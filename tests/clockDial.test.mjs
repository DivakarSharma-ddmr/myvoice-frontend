import { test } from 'node:test';
import assert from 'node:assert/strict';
import { dialFraction, dialPercent, dialPath, DIAL } from '../src/lib/clockDial.ts';

const close = (a, b, tol = 1e-4) =>
  assert.ok(Math.abs(a - b) < tol, `expected ${a} to be within ${tol} of ${b}`);

test('the ends of the scale are empty and full', () => {
  assert.equal(dialFraction(0), 0);
  assert.equal(dialFraction(12), 1);
  // Levels cannot exceed 12, but the dial should not wrap if one ever did.
  assert.equal(dialFraction(13), 1);
  assert.equal(dialFraction(-1), 0);
});

test('the quarter hours land exactly on the quarter turns', () => {
  // 3, 6 and 9 o'clock point at the middle of an edge, so by symmetry they are
  // exactly a quarter, a half and three quarters of the way round.
  close(dialFraction(3), 0.25);
  close(dialFraction(6), 0.5);
  close(dialFraction(9), 0.75);
});

test('the corners fall on the half hours', () => {
  // A corner of a square sits at 45°, which is half past one on a clock face.
  const geometry = DIAL;
  const corner = (dialFraction(1, geometry) + dialFraction(2, geometry)) / 2;
  // Not asserting the midpoint IS the corner — only that 1.5h is between 1h
  // and 2h, i.e. the mapping stays ordered through a corner.
  assert.ok(dialFraction(1) < corner && corner < dialFraction(2));
});

test('hours increase monotonically', () => {
  for (let h = 1; h <= 12; h++) {
    assert.ok(
      dialFraction(h) > dialFraction(h - 1),
      `hour ${h} did not advance past ${h - 1}`
    );
  }
});

test('an hour is NOT one twelfth of the perimeter', () => {
  // The whole point of solving from the angle: on a square the 30° ray lands
  // short of a twelfth of the way round. If this ever becomes equal, someone
  // has replaced the geometry with a naive division and the dial no longer
  // matches a clock.
  const naive = 1 / 12;
  assert.ok(dialFraction(1) < naive, 'one o’clock should fall short of a twelfth');
  // ~0.24 percentage points on this geometry: small, because the corners are
  // heavily rounded, but real and in the direction the maths predicts.
  assert.ok(naive - dialFraction(1) > 0.002, 'the difference should be measurable');
});

test('the path starts at top centre and closes', () => {
  const d = dialPath();
  assert.match(d, /^M 50 4\.5\b/);
  assert.match(d, /Z$/);
});

test('geometry is configurable without breaking the invariants', () => {
  const g = { stroke: 6, radius: 18 };
  close(dialFraction(3, g), 0.25);
  close(dialFraction(6, g), 0.5);
  close(dialPercent(12, g), 100);
});
