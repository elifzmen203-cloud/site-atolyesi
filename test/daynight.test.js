import { test } from 'node:test';
import assert from 'node:assert/strict';
import { modeForHour, TRANSITION_DURATION } from '../src/theme/daynight.js';

test('daynight: transition duration constant is 60000 ms (1 minute)', () => {
  assert.equal(TRANSITION_DURATION, 60000, 'Transition duration must be exactly 60 seconds (60000 ms)');
});

test('daynight: boundary hour calculations match 08:00 - 19:59 day, 20:00 - 07:59 night', () => {
  // Helper to create date with specific hours and minutes
  const makeDate = (h, m = 0, s = 0) => {
    const d = new Date(2026, 9, 1, h, m, s);
    return d;
  };

  // Morning boundary
  assert.equal(modeForHour(makeDate(7, 59, 59)), 'night', '07:59:59 must be night');
  assert.equal(modeForHour(makeDate(8, 0, 0)), 'day', '08:00:00 must be day');
  assert.equal(modeForHour(makeDate(12, 0, 0)), 'day', '12:00:00 must be day');

  // Evening boundary
  assert.equal(modeForHour(makeDate(19, 59, 59)), 'day', '19:59:59 must be day');
  assert.equal(modeForHour(makeDate(20, 0, 0)), 'night', '20:00:00 must be night');

  // Midnight & late night
  assert.equal(modeForHour(makeDate(23, 59, 59)), 'night', '23:59:59 must be night');
  assert.equal(modeForHour(makeDate(0, 0, 0)), 'night', '00:00:00 must be night');
  assert.equal(modeForHour(makeDate(4, 30, 0)), 'night', '04:30:00 must be night');

  // Also test with numeric hours
  assert.equal(modeForHour(7.99), 'night');
  assert.equal(modeForHour(8.0), 'day');
  assert.equal(modeForHour(19.99), 'day');
  assert.equal(modeForHour(20.0), 'night');
});
