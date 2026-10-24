import {
  STORAGE_KEY, createState, parseState, dayKey, shiftDay, isDay,
  resolveTimeZone, entriesFor, actionsForDay, isActive, addAction, recordAction, undoEntry, archiveAction
} from './model.mjs';

const $ = id => document.getElementById(id);
let state;
let unreadable = false;
let startupError = '';
try {
  const raw = localStorage.getItem(STORAGE_KEY);
  state = raw === null ? createState() : parseState(raw);
  if (raw === null) localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
} catch {
  state = createState();
  unreadable = true;
  startupError = 'Не удалось открыть сохранённую историю. Разреши браузеру хранить данные и обнови страницу. Существующие записи не перезаписываются.';
}

let selectedDay = today();
let previousToday = selectedDay;
let deleteTarget = null;
let toastTimer;
const recentClicks = new Map();
const zoneNames = {
  'Europe/Kaliningrad': 'Калининград', 'Europe/Moscow': 'Москва', 'Europe/Samara': 'Самара',
  'Asia/Yekaterinburg': 'Екатеринбург', 'Asia/Omsk': 'Омск', 'Asia/Krasnoyarsk': 'Красноярск',
  'Asia/Novosibirsk': 'Новосибирск', 'Asia/Irkutsk': 'Иркутск', 'Asia/Yakutsk': 'Якутск',
  'Asia/Vladivostok': 'Владивосток', 'Asia/Magadan': 'Магадан', 'Asia/Kamchatka': 'Камчатка',
  'Europe/London': 'Лондон', 'Europe/Berlin': 'Берлин', 'Asia/Tbilisi': 'Тбилиси',
  'Asia/Almaty': 'Алматы', 'Asia/Bangkok': 'Бангкок', 'Asia/Dubai': 'Дубай',
  'America/New_York': 'Нью-Йорк', 'America/Los_Angeles': 'Лос-Анджелес', UTC: 'UTC'
};

function zone() { return resolveTimeZone(state.timeZone); }
function today() { return dayKey(new Date(), zone()); }
function uid() { return crypto.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`; }
function element(tag, className = '', text = '') {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text) node.textContent = text;
  return node;
}
function icon(name) {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('class', 'icon');
  svg.setAttribute('aria-hidden', 'true');
  const use = document.createElementNS('http://www.w3.org/2000/svg', 'use');
  use.setAttribute('href', `#i-${name}`);
  svg.append(use);
  return svg;
}
function button(className, label, onClick, iconName) {
  const node = element('button', className);
  node.type = 'button';
  if (iconName) node.append(icon(iconName));
  if (label) node.append(document.createTextNode(label));
  node.addEventListener('click', onClick);
  return node;
}
function formatTime(at, seconds = false) {
  return new Intl.DateTimeFormat('ru-RU', {
    timeZone: zone(), hour: '2-digit', minute: '2-digit', ...(seconds ? { second: '2-digit' } : {})
  }).format(new Date(at));
}
function civilDate(day, options) {
  return new Intl.DateTimeFormat('ru-RU', { timeZone: 'UTC', ...options }).format(new Date(`${day}T12:00:00Z`));
}
function notify(message) {
  clearTimeout(toastTimer);
  $('toast-message').textContent = message;
  $('toast').hidden = false;
  toastTimer = setTimeout(() => { $('toast').hidden = true; }, 4500);
}
function storageError(message) {
  $('storage-error').textContent = message;
  $('storage-error').hidden = false;
  $('save-label').textContent = 'Не удалось сохранить';
}

// Read the newest snapshot before every change so another open tab cannot be overwritten by a stale view.
function commit(change) {
  if (unreadable) return false;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const next = raw === null ? createState() : parseState(raw);
    const changed = change(next);
    if (!changed) {
      state = next;
      render();
      return false;
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    state = next;
    $('storage-error').hidden = true;
    render();
    return true;
  } catch {
    render();
    storageError('Не удалось сохранить изменение. Проверь разрешение на хранение данных и свободное место, затем попробуй ещё раз. Отметка не записана.');
    return false;
  }
}

function selectDay(day) {
  if (!isDay(day) || day > today()) return;
  selectedDay = day;
  closeAdd();
  render();
}

function renderWeek() {
  const weekday = new Date(`${selectedDay}T12:00:00Z`).getUTCDay();
  const monday = shiftDay(selectedDay, -((weekday + 6) % 7));
  const recordedDays = new Set(state.entries.map(entry => dayKey(entry.at, zone())));
  const fragment = document.createDocumentFragment();
  for (let i = 0; i < 7; i++) {
    const day = shiftDay(monday, i);
    const node = button('day-button', '', () => selectDay(day));
    node.dataset.focus = `day-${day}`;
    node.classList.toggle('is-today', day === today());
    node.classList.toggle('has-entries', recordedDays.has(day));
    if (day === selectedDay) node.setAttribute('aria-current', 'date');
    node.setAttribute('aria-label', `${civilDate(day, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}${recordedDays.has(day) ? ', есть отметки' : ''}`);
    node.disabled = day > today();
    node.append(element('span', 'weekday', civilDate(day, { weekday: 'short' })), element('span', 'day-number', String(Number(day.slice(-2)))));
    fragment.append(node);
  }
  $('week-days').replaceChildren(fragment);
  $('previous-week').onclick = () => selectDay(shiftDay(selectedDay, -7));
  $('next-week').disabled = shiftDay(monday, 7) > today();
  $('next-week').onclick = () => selectDay(shiftDay(selectedDay, 7) > today() ? today() : shiftDay(selectedDay, 7));
}

function canRecord() {
  if (selectedDay === today()) return true;
  selectDay(today());
  notify('Начался новый день. Отметь действие ещё раз.');
  return false;
}

function record(action) {
  if (!canRecord()) return;
  // Ignore accidental double taps without limiting intentional later repetitions.
  const last = recentClicks.get(action.id) ?? 0;
  if (action.kind === 'repeat' && Date.now() - last < 1200) { render(); return; }
  recentClicks.set(action.id, Date.now());
  const now = new Date();
  if (commit(next => recordAction(next, action.id, uid(), now))) {
    const label = action.id === 'door' ? 'Дверь закрыта' : action.id === 'pill' ? 'Приём таблетки отмечен' : 'Готово';
    notify(`${label} · ${formatTime(now)}`);
  }
}

function removeLatest(action) {
  if (!canRecord()) return;
  const last = entriesFor(state, action.id, today()).at(-1);
  if (last && commit(next => undoEntry(next, last.id))) notify('Последняя отметка отменена');
}

function requestDelete(action) {
  deleteTarget = action.id;
  $('delete-name').textContent = action.title;
  $('delete-description').textContent = action.schedule === 'daily'
    ? 'Действие больше не будет появляться каждый день. Все прежние отметки останутся в истории.'
    : 'Действие исчезнет из списка. Если ты уже отметила выполнение, запись останется в истории.';
  $('delete-dialog').returnValue = '';
  $('delete-dialog').showModal();
}

function renderAction(action) {
  const entries = entriesFor(state, action.id, selectedDay);
  const last = entries.at(-1);
  const editable = selectedDay === today() && isActive(action, today(), zone()) && !unreadable;
  const article = element('article', `action${last ? ' is-done' : ''}`);
  const heading = element('div', 'action-heading');
  const symbol = element('span', 'action-symbol');
  symbol.append(icon(action.icon));
  const title = element('div', 'action-title');
  title.append(element('h3', '', action.title));
  const schedule = action.schedule === 'daily' ? 'Каждый день' : 'На этот день';
  title.append(element('p', '', `${schedule}${action.kind === 'repeat' ? ' · несколько отметок' : ' · галочка'}`));
  heading.append(symbol, title);
  if (editable) {
    const remove = button('icon-button', '', () => requestDelete(action), 'trash');
    remove.setAttribute('aria-label', `Удалить действие «${action.title}»`);
    remove.dataset.focus = `delete-${action.id}`;
    heading.append(remove);
  } else if (action.archivedOn && selectedDay >= (action.archivedAt ? dayKey(action.archivedAt, zone()) : action.archivedOn)) {
    heading.append(element('span', 'archived-label', 'В архиве'));
  }
  const body = element('div', 'action-body');
  const status = element('p', 'action-status');
  if (last) {
    status.append(document.createTextNode(action.id === 'door' ? 'Дверь закрыта' : action.id === 'pill' ? 'Таблетка выпита' : 'Сделано'));
    const time = element('time', 'status-time', formatTime(last.at));
    time.dateTime = last.at;
    status.append(time);
    if (entries.length > 1) status.append(element('span', '', 'Последняя отметка'));
  } else {
    status.textContent = selectedDay === today() ? 'Пока нет отметок' : 'В этот день отметок нет';
  }
  body.append(status);
  if (editable && action.kind === 'repeat') {
    const label = action.id === 'door' ? 'Я закрыла дверь' : action.id === 'pill' ? 'Я выпила таблетку' : 'Отметить выполнение';
    const recordButton = button('primary-button record-button', label, () => record(action), last ? 'plus' : 'check');
    recordButton.dataset.focus = `record-${action.id}`;
    if (action.id !== 'door' && action.id !== 'pill') recordButton.setAttribute('aria-label', `Отметить выполнение: ${action.title}`);
    body.append(recordButton);
  } else if (editable && action.kind === 'check') {
    const label = element('label', 'check-control');
    const input = element('input');
    input.type = 'checkbox';
    input.checked = Boolean(last);
    input.dataset.focus = `check-${action.id}`;
    input.setAttribute('aria-label', `Выполнено: ${action.title}`);
    input.addEventListener('change', () => last ? removeLatest(action) : record(action));
    label.append(input, element('span', '', last ? 'Сделано' : 'Отметить как сделанное'));
    body.append(label);
  }
  article.append(heading, body);
  if (entries.length && action.kind === 'repeat') {
    const details = element('details', 'entry-history');
    details.dataset.history = action.id;
    details.append(element('summary', '', `Все отметки за день · ${entries.length}`));
    const list = element('ol', 'entry-list');
    for (const entry of entries) {
      const li = element('li');
      const time = element('time', '', formatTime(entry.at, true));
      time.dateTime = entry.at;
      li.append(time);
      list.append(li);
    }
    details.append(list);
    if (editable) {
      const undo = button('text-button undo-button', 'Отменить последнюю отметку', () => removeLatest(action));
      undo.dataset.focus = `undo-${action.id}`;
      details.append(undo);
    }
    article.append(details);
  }
  return article;
}

function render() {
  const focused = document.activeElement?.dataset.focus;
  const openHistories = new Set([...document.querySelectorAll('[data-history][open]')].map(node => node.dataset.history));
  const isToday = selectedDay === today();
  const date = civilDate(selectedDay, { day: 'numeric', month: 'long' });
  $('day-title').textContent = isToday ? 'Сегодня' : selectedDay === shiftDay(today(), -1) ? 'Вчера' : date;
  $('day-subtitle').textContent = civilDate(selectedDay, { ...(isToday || selectedDay === shiftDay(today(), -1) ? { day: 'numeric', month: 'long' } : {}), weekday: 'long', year: 'numeric' });
  $('date-picker').value = selectedDay;
  $('date-picker').max = today();
  $('go-today').hidden = isToday;
  $('history-notice').hidden = isToday;
  $('add-section').hidden = !isToday || unreadable;
  renderWeek();
  const actions = actionsForDay(state, selectedDay);
  $('actions').replaceChildren(...actions.map(renderAction));
  for (const details of document.querySelectorAll('[data-history]')) details.open = openHistories.has(details.dataset.history);
  $('empty-state').hidden = Boolean(actions.length);
  $('empty-title').textContent = isToday ? 'Здесь пока нет действий' : 'В этот день ещё нет записей';
  $('empty-copy').textContent = isToday ? 'Добавь то, что хочется не держать в голове.' : 'Когда начнёшь отмечать действия, здесь будет их история.';
  const offset = new Intl.DateTimeFormat('ru-RU', { timeZone: zone(), timeZoneName: 'shortOffset' })
    .formatToParts().find(part => part.type === 'timeZoneName').value.replace('GMT', 'UTC');
  $('zone-label').textContent = `${state.timeZone === 'device' ? 'Время устройства' : zoneNames[zone()] ?? zone().split('/').at(-1).replaceAll('_', ' ')} · ${offset}`;
  $('time-zone').value = state.timeZone;
  $('time-zone').disabled = unreadable;
  if ($('storage-error').hidden) $('save-label').textContent = 'Сохраняется в этом браузере';
  if (focused) document.querySelector(`[data-focus="${CSS.escape(focused)}"]`)?.focus({ preventScroll: true });
}

function openSettings() {
  $('settings-panel').hidden = false;
  $('settings-toggle').setAttribute('aria-expanded', 'true');
  $('time-zone').focus();
  $('settings-panel').scrollIntoView({ block: 'nearest' });
}
function closeSettings() {
  $('settings-panel').hidden = true;
  $('settings-toggle').setAttribute('aria-expanded', 'false');
  $('settings-toggle').focus();
}
function closeAdd() {
  $('add-form').hidden = true;
  $('add-toggle').setAttribute('aria-expanded', 'false');
}
function updateSchedule() {
  const daily = $('add-form').elements.schedule.value === 'daily';
  $('kind-field').hidden = !daily;
  $('kind-field').disabled = !daily;
  $('schedule-help').textContent = daily
    ? 'Появится сегодня и будет повторяться каждый день. У каждого дня — свои отметки.'
    : 'Появится только сегодня. Выполнение отмечается галочкой.';
}
function setupTimeZones() {
  const option = (value, label) => {
    const node = element('option', '', label);
    node.value = value;
    return node;
  };
  $('time-zone').append(option('device', 'Как на устройстве'));
  const common = element('optgroup');
  common.label = 'Города';
  for (const [value, label] of Object.entries(zoneNames)) common.append(option(value, label));
  $('time-zone').append(common);
  const others = element('optgroup');
  others.label = 'Другие часовые пояса';
  const zones = new Set(typeof Intl.supportedValuesOf === 'function' ? Intl.supportedValuesOf('timeZone') : []);
  zones.add(resolveTimeZone(state.timeZone));
  for (const value of [...zones].sort()) if (!zoneNames[value]) others.append(option(value, value.replaceAll('_', ' ')));
  $('time-zone').append(others);
}

$('settings-toggle').addEventListener('click', () => $('settings-panel').hidden ? openSettings() : closeSettings());
$('close-settings').addEventListener('click', closeSettings);
$('zone-shortcut').addEventListener('click', openSettings);
$('time-zone').addEventListener('change', event => {
  const value = event.target.value;
  const wasToday = selectedDay === today();
  if (commit(next => { next.timeZone = value; return true; })) {
    previousToday = today();
    if (wasToday || selectedDay > today()) selectedDay = today();
    closeAdd();
    render();
    notify('Часовой пояс сохранён');
  }
});
$('date-picker').addEventListener('change', event => selectDay(event.target.value));
$('go-today').addEventListener('click', () => selectDay(today()));
$('add-toggle').addEventListener('click', () => {
  if (!$('add-form').hidden) { closeAdd(); return; }
  $('add-form').hidden = false;
  $('add-toggle').setAttribute('aria-expanded', 'true');
  $('action-title').focus();
});
$('cancel-add').addEventListener('click', () => { closeAdd(); $('add-toggle').focus(); });
$('add-form').addEventListener('change', updateSchedule);
$('action-title').addEventListener('input', () => $('action-title').setCustomValidity(''));
$('add-form').addEventListener('submit', event => {
  event.preventDefault();
  if (!canRecord()) return;
  const title = $('action-title').value.trim();
  if (!title) {
    $('action-title').setCustomValidity('Напиши название действия.');
    $('action-title').reportValidity();
    return;
  }
  const schedule = $('add-form').elements.schedule.value;
  const id = uid();
  if (commit(next => addAction(next, { id, title, schedule, kind: schedule === 'once' ? 'check' : $('add-form').elements.kind.value }))) {
    $('add-form').reset();
    updateSchedule();
    closeAdd();
    notify('Действие добавлено');
    document.querySelector(`[data-focus="${schedule === 'once' || state.actions.at(-1).kind === 'check' ? 'check' : 'record'}-${CSS.escape(id)}"]`)?.focus({ preventScroll: true });
  }
});
$('delete-dialog').addEventListener('close', () => {
  if ($('delete-dialog').returnValue === 'delete' && deleteTarget) {
    if (commit(next => archiveAction(next, deleteTarget))) {
      notify('Действие удалено. История сохранена.');
      $('add-toggle').focus({ preventScroll: true });
    }
  }
  deleteTarget = null;
});
$('delete-dialog').addEventListener('click', event => {
  if (event.target !== $('delete-dialog')) return;
  const rect = $('delete-dialog').getBoundingClientRect();
  if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) $('delete-dialog').close('cancel');
});
document.addEventListener('keydown', event => {
  if (event.key !== 'Escape' || $('delete-dialog').open) return;
  if (!$('add-form').hidden) { closeAdd(); $('add-toggle').focus(); }
  else if (!$('settings-panel').hidden) closeSettings();
});
window.addEventListener('storage', event => {
  if (event.key !== STORAGE_KEY && event.key !== null) return;
  try {
    state = event.newValue === null ? createState() : parseState(event.newValue);
    unreadable = false;
    $('storage-error').hidden = true;
    refreshDay();
    render();
  } catch {
    unreadable = true;
    render();
    storageError('История была изменена в другой вкладке, но её не удалось прочитать. Обнови страницу.');
  }
});
function refreshDay() {
  const current = today();
  if (current !== previousToday) {
    if (selectedDay === previousToday || selectedDay > current) { selectedDay = current; closeAdd(); }
    previousToday = current;
    render();
  }
}
window.addEventListener('focus', refreshDay);
document.addEventListener('visibilitychange', () => { if (!document.hidden) refreshDay(); });
setInterval(refreshDay, 15000);

setupTimeZones();
render();
if (startupError) storageError(startupError);
