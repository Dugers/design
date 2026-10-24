import assert from 'node:assert/strict';
import {
  DEFAULT_TIME_ZONE, createState, parseState, dayKey, shiftDay, isDay, resolveTimeZone,
  entriesFor, actionsForDay, addAction, recordAction, undoEntry, archiveAction
} from '../todo/model.mjs';

const morning = new Date('2026-10-24T02:15:00Z'); // 09:15 in Krasnoyarsk.
const evening = new Date('2026-10-24T16:59:59Z');
const midnight = new Date('2026-10-24T17:00:00Z');
const state = createState(morning);
assert.equal(state.timeZone, DEFAULT_TIME_ZONE);
assert.equal(resolveTimeZone('device', 'Europe/Moscow'), 'Europe/Moscow');
assert.equal(resolveTimeZone('Bad/Zone'), DEFAULT_TIME_ZONE);
assert.equal(dayKey(evening), '2026-10-24');
assert.equal(dayKey(midnight), '2026-10-25');
assert.equal(dayKey(midnight, 'America/New_York'), '2026-10-24');
assert.equal(shiftDay('2026-12-31', 1), '2027-01-01');
assert.equal(shiftDay('2028-03-01', -1), '2028-02-29');
assert.equal(isDay('2026-02-30'), false);
assert.equal(isDay('2028-02-29'), true);

assert.deepEqual(actionsForDay(state, '2026-10-23'), []);
assert.equal(recordAction(state, 'door', 'door-1', morning), true);
assert.equal(recordAction(state, 'door', 'door-2', evening), true);
assert.equal(entriesFor(state, 'door', '2026-10-24').length, 2);
assert.equal(recordAction(state, 'door', 'door-2', evening), false);
assert.equal(recordAction(state, 'pill', 'pill-1', morning), true);
assert.equal(recordAction(state, 'pill', 'pill-2', evening), true);
assert.equal(entriesFor(state, 'pill', '2026-10-24').length, 2);
assert.equal(entriesFor(state, 'door', '2026-10-25').length, 0);
assert.equal(undoEntry(state, 'door-1', midnight), false, 'Historical facts cannot be edited from today');

assert.equal(addAction(state, { id: 'water', title: '  Полить цветы  ', schedule: 'once', kind: 'repeat' }, morning), true);
assert.equal(state.actions.at(-1).title, 'Полить цветы');
assert.equal(state.actions.at(-1).kind, 'check', 'One-off actions are always checkboxes');
assert.equal(recordAction(state, 'water', 'water-1', morning), true);
assert.equal(recordAction(state, 'water', 'water-2', evening), false, 'A checkbox has only one completion per day');
assert.equal(undoEntry(state, 'water-1', evening), true);
assert.equal(recordAction(state, 'water', 'water-3', evening), true);
assert(!actionsForDay(state, '2026-10-25').some(action => action.id === 'water'));
assert.equal(recordAction(state, 'water', 'water-tomorrow', midnight), false);
assert.equal(addAction(state, { id: 'blank', title: '   ', schedule: 'once', kind: 'check' }, morning), false);

assert.equal(addAction(state, { id: 'iron', title: 'Выключить утюг', schedule: 'daily', kind: 'check' }, morning), true);
assert.equal(recordAction(state, 'iron', 'iron-1', morning), true);
assert.equal(recordAction(state, 'iron', 'iron-2', midnight), true, 'A daily checkbox resets at local midnight');
assert.equal(entriesFor(state, 'iron', '2026-10-24').length, 1);
assert.equal(entriesFor(state, 'iron', '2026-10-25').length, 1);

const factsBeforeDelete = structuredClone(state.entries);
assert.equal(archiveAction(state, 'door', midnight), true);
assert.deepEqual(state.entries, factsBeforeDelete, 'Deleting an action must never delete its recorded facts');
assert(actionsForDay(state, '2026-10-24').some(action => action.id === 'door'));
assert(!actionsForDay(state, '2026-10-25').some(action => action.id === 'door'));
assert.equal(recordAction(state, 'door', 'archived', midnight), false);
assert.equal(archiveAction(state, 'door', midnight), false);
assert.equal(archiveAction(state, 'pill', evening), true);
assert(actionsForDay(state, '2026-10-24').some(action => action.id === 'pill'), 'Today’s facts remain visible after deletion');
assert.equal(undoEntry(state, 'pill-2', evening), false);
assert(!actionsForDay(state, '2026-10-25').some(action => action.id === 'pill'));

const changedZone = structuredClone(state);
changedZone.timeZone = 'America/Los_Angeles';
assert(entriesFor(changedZone, 'door', '2026-10-23').length > 0);
assert(actionsForDay(changedZone, '2026-10-23').some(action => action.id === 'door'), 'Timezone changes cannot hide a historical fact before the action’s initial civil date');
assert.deepEqual(changedZone.entries, state.entries, 'Changing timezone does not rewrite timestamps');

const westernToday = createState(midnight);
westernToday.timeZone = 'Europe/Moscow';
assert.equal(actionsForDay(westernToday, '2026-10-24').length, 2, 'Default daily actions remain available when the new timezone is still yesterday');
assert.equal(recordAction(westernToday, 'door', 'western-door', midnight), true);
assert.equal(addAction(westernToday, { id: 'daily', title: 'Прогулка', schedule: 'daily', kind: 'check' }, midnight), true);
westernToday.timeZone = 'America/Los_Angeles';
assert.equal(recordAction(westernToday, 'daily', 'western-daily', midnight), true);
assert.equal(archiveAction(westernToday, 'pill', midnight), true);
assert(!actionsForDay(westernToday, '2026-10-24').some(action => action.id === 'pill'), 'Deletion follows the selected timezone across day boundaries');

assert.deepEqual(parseState(JSON.stringify(state)), state);
const deletedDefaults = createState(morning);
deletedDefaults.actions = [];
assert.deepEqual(parseState(JSON.stringify(deletedDefaults)).actions, [], 'Deleted default actions are not restored');
assert.throws(() => parseState('{broken json'));
assert.throws(() => parseState('{"version":2,"actions":[],"entries":[]}'));
assert.throws(() => parseState(JSON.stringify({ ...state, timeZone: 'Bad/Zone' })));
assert.throws(() => parseState(JSON.stringify({ ...state, entries: [{ id: 'bad', actionId: 'door', at: 'yesterday' }] })));
assert.throws(() => parseState(JSON.stringify({ ...state, entries: [{ id: 'orphan', actionId: 'missing', at: morning.toISOString() }] })));
assert.throws(() => parseState(JSON.stringify({ ...state, actions: [...state.actions, state.actions[0]] })));

console.log('PASS: todo timezone boundaries, multiple timestamps, daily and one-off checkboxes, undo, deletion with preserved history, and storage validation.');
