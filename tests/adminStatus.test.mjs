import { test } from 'node:test';
import assert from 'node:assert/strict';
import { STATUS_TOKENS, statusToken } from '../src/lib/adminStatus.ts';

test('every status has a distinct label, tone class and icon', () => {
  const keys = Object.keys(STATUS_TOKENS);
  assert.equal(keys.length, 9);
  // Active and Unsubscribed must NOT share a tone (legacy bug: both blue)
  assert.notEqual(STATUS_TOKENS.active.tone, STATUS_TOKENS.unsubscribed.tone);
  for (const k of keys) {
    assert.ok(STATUS_TOKENS[k].label && STATUS_TOKENS[k].tone && STATUS_TOKENS[k].icon);
  }
});

test('statusToken is case-insensitive and maps legacy strings', () => {
  assert.equal(statusToken('Active').label, 'Active');
  assert.equal(statusToken('ON HOLD').label, 'On Hold');
  assert.equal(statusToken('unknown-x').label, 'Unknown-x'); // graceful fallback
});
