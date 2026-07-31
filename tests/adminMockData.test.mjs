import { test } from 'node:test';
import assert from 'node:assert/strict';
import { PANELS, seed, TOTALS, approvalTotal, EMAIL_TAGS } from '../src/lib/adminMockData.ts';

test('panels include Romania and have counts', () => {
  assert.ok(PANELS.length >= 30);
  assert.ok(PANELS.find((p) => p.name === 'Romania Panel'));
  assert.ok(PANELS.every((p) => typeof p.memberCount === 'number'));
});

test('seed tables are populated and typed', () => {
  assert.ok(seed.members.length >= 60);
  assert.ok(seed.memberRewards.length >= 10);
  assert.ok(seed.catalogue.length >= 15);
  assert.ok(seed.templates.length >= 15);
  assert.ok(seed.threads.length >= 5);
  assert.ok(seed.recruitment.length >= 8);
  assert.ok(seed.campaigns.length >= 10);
});

test('approvalTotal sums selected reward values', () => {
  assert.equal(approvalTotal([{ value: 10 }, { value: 15 }, { value: 10 }]), 35);
  assert.equal(TOTALS.memberRewards, 6144);
  assert.equal(TOTALS.members, 87696);
});

test('email tags expose the merge tokens', () => {
  assert.ok(EMAIL_TAGS.find((t) => t.token === '%%first_name%%'));
});
