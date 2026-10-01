import { test } from 'node:test';
import assert from 'node:assert/strict';
import { groupRuns, nearestSpot } from '../src/mascot/spots.js';
import { catSvg } from '../src/mascot/cat-art.js';
import { CAT_STATES } from '../src/mascot/cat-machine.js';

test('cat-spots: free sample points are grouped into continuous runs', () => {
  const runs = groupRuns([100, 126, 152, 400, 426, 800]);
  assert.deepEqual(runs, [{ x1: 100, x2: 152 }, { x1: 400, x2: 426 }, { x1: 800, x2: 800 }]);
  assert.deepEqual(groupRuns([]), []);
});

test('cat-spots: nearestSpot clamps to the run and respects max distance', () => {
  const spots = [{ x1: 100, x2: 300, y: 500 }, { x1: 600, x2: 700, y: 200 }];
  const near = nearestSpot(spots, 350, 500);
  assert.equal(near.x, 300);
  assert.equal(near.y, 500);
  const top = nearestSpot(spots, 650, 180);
  assert.equal(top.x, 650);
  assert.equal(top.y, 200);
  assert.equal(nearestSpot(spots, 2000, 2000, 100), null);
});

test('cat-art: every cat state renders an SVG (night sleep has a blanket)', () => {
  for (const state of CAT_STATES) {
    const svg = catSvg(state);
    assert.ok(svg.startsWith('<svg') && svg.endsWith('</svg>'), `${state} renders svg`);
  }
  assert.ok(catSvg('sleepBlanket').includes('#c1bfd5'), 'blanket sleep uses the lilac blanket');
  assert.ok(catSvg('sleepBack').includes('cat-twitch'), 'back sleep has a twitching paw');
  assert.ok(catSvg('bake').includes('cat-knead-l') && catSvg('bake').includes('cat-chefhat'), 'bake kneads with a chef hat');
  assert.ok(catSvg('eat').includes('cat-milk'), 'eat has bowl and milk');
  assert.ok(catSvg('laptop').includes('float-icon'), 'laptop shows floating work icons');
  assert.ok(catSvg('walk').includes('leg-hl') && catSvg('walk').includes('leg-fr'), 'walk has 4 animated legs');
});
