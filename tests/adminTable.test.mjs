import { test } from 'node:test';
import assert from 'node:assert/strict';
import { paginate, filterRows, sortRows } from '../src/lib/adminTable.ts';

const rows = Array.from({ length: 23 }, (_, i) => ({ id: i + 1, name: `n${i + 1}` }));

test('paginate slices and clamps', () => {
  const p = paginate(rows, 1, 10);
  assert.equal(p.slice.length, 10);
  assert.equal(p.pages, 3);
  assert.equal(p.total, 23);
  assert.equal(paginate(rows, 99, 10).page, 3); // clamps high
  assert.equal(paginate(rows, 0, 10).page, 1);  // clamps low
  assert.equal(paginate(rows, 3, 10).slice.length, 3);
});

test('filterRows is case-insensitive substring; blanks pass', () => {
  const acc = { name: (r) => r.name };
  // "n1" matches n1, n10..n19 = 11 rows
  assert.equal(filterRows(rows, { name: 'N1' }, acc).length, 11);
  assert.equal(filterRows(rows, { name: '' }, acc).length, 23);
  assert.equal(filterRows(rows, { name: 'all' }, acc).length, 23);
});

test('sortRows asc/desc by accessor', () => {
  const acc = (r) => r.id;
  assert.equal(sortRows(rows, 'id', 'desc', acc)[0].id, 23);
  assert.equal(sortRows(rows, 'id', 'asc', acc)[0].id, 1);
  assert.equal(sortRows(rows, null, 'asc', acc)[0].id, 1); // null key = original order
});
