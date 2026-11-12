import { test } from 'node:test';
import assert from 'node:assert/strict';
import { Potluck } from './potluck-logic.js';

// One case: Ana pays $10.00 (1000 cents) for Ana, Ben and Cai.
function build(state, action) {
  const { state: next, error } = Potluck.reduce(state, action);
  assert.equal(error, null, `setup action ${action.type} was refused: ${error}`);
  return next;
}

let state = Potluck.emptyGroup('USD');
state = build(state, { type: 'addMember', name: 'Ana' });
state = build(state, { type: 'addMember', name: 'Ben' });
state = build(state, { type: 'addMember', name: 'Cai' });
const [ana, ben, cai] = state.members;
state = build(state, {
  type: 'addExpense',
  expense: {
    description: 'Dinner',
    amount: 1000,
    payerId: ana.id,
    participantIds: [ana.id, ben.id, cai.id],
  },
});
const expense = state.expenses[0];

test('the balances add up to zero', () => {
  const L = Potluck.ledger(state);
  const total = [...L.values()].reduce((sum, row) => sum + row.balance, 0);
  assert.equal(total, 0);
});
