export const STORAGE_KEY = 'katya-todo-v1';
export const DEFAULT_TIME_ZONE = 'Asia/Krasnoyarsk';

export function isTimeZone(value) {
  if (typeof value !== 'string' || !value) return false;
  try {
    new Intl.DateTimeFormat('ru-RU', { timeZone: value }).format();
    return true;
  } catch {
    return false;
  }
}

export function resolveTimeZone(value, deviceZone = Intl.DateTimeFormat().resolvedOptions().timeZone) {
  const zone = value === 'device' ? deviceZone : value;
  return isTimeZone(zone) ? zone : DEFAULT_TIME_ZONE;
}

export function dayKey(date = new Date(), timeZone = DEFAULT_TIME_ZONE) {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone, year: 'numeric', month: '2-digit', day: '2-digit'
  }).formatToParts(new Date(date));
  const part = type => parts.find(item => item.type === type).value;
  return `${part('year')}-${part('month')}-${part('day')}`;
}

export function isDay(value) {
  return typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value)
    && Number.isFinite(Date.parse(`${value}T12:00:00Z`))
    && new Date(`${value}T12:00:00Z`).toISOString().slice(0, 10) === value;
}

export function shiftDay(day, offset) {
  const date = new Date(`${day}T12:00:00Z`);
  date.setUTCDate(date.getUTCDate() + offset);
  return date.toISOString().slice(0, 10);
}

export function createState(now = new Date()) {
  const startsOn = dayKey(now);
  const createdAt = new Date(now).toISOString();
  return {
    version: 1,
    timeZone: DEFAULT_TIME_ZONE,
    actions: [
      { id: 'door', title: 'Дверь', kind: 'repeat', schedule: 'daily', startsOn, createdAt, archivedOn: null, icon: 'door' },
      { id: 'pill', title: 'Таблетка', kind: 'repeat', schedule: 'daily', startsOn, createdAt, archivedOn: null, icon: 'pill' }
    ],
    entries: []
  };
}

// Reject an invalid document instead of silently replacing someone's history.
export function parseState(raw) {
  const state = JSON.parse(raw);
  const fail = () => { throw new Error('Не удалось прочитать сохранённые данные.'); };
  if (!state || state.version !== 1 || !Array.isArray(state.actions) || !Array.isArray(state.entries)) fail();
  if (state.timeZone !== 'device' && !isTimeZone(state.timeZone)) fail();
  const ids = new Set();
  for (const action of state.actions) {
    if (!action || typeof action.id !== 'string' || !action.id || ids.has(action.id)
      || typeof action.title !== 'string' || !action.title.trim() || action.title.length > 120
      || !['check', 'repeat'].includes(action.kind) || !['daily', 'once'].includes(action.schedule)
      || (action.schedule === 'once' && action.kind !== 'check') || !isDay(action.startsOn)
      || (action.archivedOn !== null && (!isDay(action.archivedOn) || action.archivedOn < action.startsOn))
      || ['createdAt', 'archivedAt'].some(key => action[key] !== undefined
        && (typeof action[key] !== 'string' || !Number.isFinite(Date.parse(action[key]))))
      || !['door', 'pill', 'check'].includes(action.icon)) fail();
    ids.add(action.id);
  }
  const entryIds = new Set();
  for (const entry of state.entries) {
    if (!entry || typeof entry.id !== 'string' || !entry.id || entryIds.has(entry.id)
      || !ids.has(entry.actionId) || typeof entry.at !== 'string' || !Number.isFinite(Date.parse(entry.at))) fail();
    entryIds.add(entry.id);
  }
  return state;
}

export function entriesFor(state, actionId, day, timeZone = resolveTimeZone(state.timeZone)) {
  return state.entries
    .filter(entry => entry.actionId === actionId && dayKey(entry.at, timeZone) === day)
    .sort((a, b) => a.at.localeCompare(b.at));
}

function firstDay(action, timeZone) {
  return action.schedule === 'daily' && action.createdAt ? dayKey(action.createdAt, timeZone) : action.startsOn;
}

export function isActive(action, day, timeZone = DEFAULT_TIME_ZONE) {
  return firstDay(action, timeZone) <= day && !action.archivedOn
    && (action.schedule === 'daily' || action.startsOn === day);
}

export function actionsForDay(state, day, timeZone = resolveTimeZone(state.timeZone)) {
  return state.actions.filter(action => {
    // Recorded facts stay visible, even if a timezone change moves them across a date boundary.
    if (entriesFor(state, action.id, day, timeZone).length) return true;
    const archivedOn = action.archivedAt ? dayKey(action.archivedAt, timeZone) : action.archivedOn;
    return firstDay(action, timeZone) <= day && (!archivedOn || day < archivedOn)
      && (action.schedule === 'daily' || action.startsOn === day);
  });
}

export function addAction(state, { id, title, schedule, kind }, now = new Date()) {
  const cleanTitle = title.trim();
  if (!cleanTitle || cleanTitle.length > 120 || !id || state.actions.some(action => action.id === id)
    || !['daily', 'once'].includes(schedule) || !['repeat', 'check'].includes(kind)) return false;
  state.actions.push({ id, title: cleanTitle, schedule, kind: schedule === 'once' ? 'check' : kind,
    startsOn: dayKey(now, resolveTimeZone(state.timeZone)), createdAt: new Date(now).toISOString(), archivedOn: null, icon: 'check' });
  return true;
}

export function recordAction(state, actionId, id, now = new Date()) {
  const day = dayKey(now, resolveTimeZone(state.timeZone));
  const action = state.actions.find(item => item.id === actionId);
  if (!action || !isActive(action, day, resolveTimeZone(state.timeZone)) || !id || state.entries.some(entry => entry.id === id)) return false;
  if (action.kind === 'check' && entriesFor(state, actionId, day).length) return false;
  state.entries.push({ id, actionId, at: new Date(now).toISOString() });
  return true;
}

export function undoEntry(state, entryId, now = new Date()) {
  const entry = state.entries.find(item => item.id === entryId);
  const day = dayKey(now, resolveTimeZone(state.timeZone));
  if (!entry || dayKey(entry.at, resolveTimeZone(state.timeZone)) !== day) return false;
  const action = state.actions.find(item => item.id === entry.actionId);
  if (!action || !isActive(action, day, resolveTimeZone(state.timeZone))) return false;
  state.entries = state.entries.filter(item => item.id !== entryId);
  return true;
}

export function archiveAction(state, actionId, now = new Date()) {
  const action = state.actions.find(item => item.id === actionId);
  if (!action || action.archivedOn) return false;
  const day = dayKey(now, resolveTimeZone(state.timeZone));
  action.archivedOn = day < action.startsOn ? action.startsOn : day;
  action.archivedAt = new Date(now).toISOString();
  return true;
}
