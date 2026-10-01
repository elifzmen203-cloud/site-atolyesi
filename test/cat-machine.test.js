import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createCatMachine, CAT_STATES, VALID_TRANSITIONS } from '../src/mascot/cat-machine.js';

test('cat-machine: supports all 8 required cat states', () => {
  const required = ['sit', 'walk', 'groom', 'purr', 'aim', 'jump', 'sleep', 'stretch'];
  for (const s of required) {
    assert.ok(CAT_STATES.includes(s), `CAT_STATES must include state: ${s}`);
  }
});

test('cat-machine: allows valid transitions and rejects invalid ones', () => {
  const machine = createCatMachine({ initialState: 'sit' });
  assert.equal(machine.getState(), 'sit');

  // Valid: sit -> aim
  assert.equal(machine.transition('aim'), true);
  assert.equal(machine.getState(), 'aim');

  // Valid: aim -> jump
  assert.equal(machine.transition('jump'), true);
  assert.equal(machine.getState(), 'jump');

  // Invalid: jump directly to sleep (must land in sit first)
  assert.equal(machine.transition('sleep'), false);
  assert.equal(machine.getState(), 'jump');

  // Valid: jump -> sit
  assert.equal(machine.transition('sit'), true);
  assert.equal(machine.getState(), 'sit');

  // Valid: sit -> sleep
  assert.equal(machine.transition('sleep'), true);
  assert.equal(machine.getState(), 'sleep');

  // Valid: sleep -> stretch
  assert.equal(machine.transition('stretch'), true);
  assert.equal(machine.getState(), 'stretch');
});

test('cat-machine: deterministic state progression with mock RNG', () => {
  // Mock RNG that cycles [0, 0.5, 0.99]
  let counter = 0;
  const mockRng = () => {
    const val = (counter % 3) / 3;
    counter++;
    return val;
  };

  const machine = createCatMachine({ initialState: 'sit', rng: mockRng });
  const observed = [];
  machine.onStateChange(st => observed.push(st));

  machine.tickNatural();
  assert.ok(observed.length === 1);
  assert.ok(VALID_TRANSITIONS.sit.includes(machine.getState()));
});
