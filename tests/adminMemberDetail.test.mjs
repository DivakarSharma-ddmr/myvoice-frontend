import { test } from 'node:test';
import assert from 'node:assert/strict';
import { memberDetail, TXN_TYPES, TXN_STATUSES, seed } from '../src/lib/adminMockData.ts';

test('member 34 reproduces the screenshot exactly', () => {
  const m = memberDetail(34);
  assert.equal(m.id, 34);
  assert.equal(m.panel, '1');
  assert.equal(m.cintId, '1123080033');
  assert.equal(m.created, '2019-01-23 00:00:00');
  assert.equal(m.lastSent, 'N/A');
  assert.equal(m.lastAnswered, '2026-06-15 14:29:13');
  assert.equal(m.walletAmount, 0);
  assert.equal(m.emailVerified, true);
  assert.equal(m.memberIdField, '0');
  assert.equal(m.email, 'bhartianshul916@gmail.com');
  assert.equal(m.gender, 'Male');
  assert.equal(m.birthYear, 1997);
  assert.equal(m.postalCode, '201001');
  assert.ok(m.resetPasswordLink.startsWith('https://www.myvoice-surveys.com/password_reset/'));
  assert.equal(m.firstName, 'anshul_athlete');
  assert.equal(m.lastName, '');
  assert.equal(m.transactions.length, 3);
  assert.equal(m.transactions[0].status, 'QT');
  assert.equal(m.transactions[0].projectNo, '8072');
  assert.equal(m.transactions[0].surveyNo, '664');
  assert.equal(m.consents.length, 6);
  assert.ok(m.consents.every((c) => c.option === 'Yes' && c.collected === '2026-06-15 14:29:13'));
  assert.equal(m.consents[0].name, 'Take surveys');
  assert.equal(m.messages.length, 0);
  const occ = m.panelQuestions.find((g) => g.group === 'Occupation');
  assert.ok(occ);
  assert.equal(occ.items[0].answer, 'Full-time work');
});

test('every seeded member id resolves with all arrays present', () => {
  for (const row of seed.members) {
    const m = memberDetail(row.id);
    assert.equal(m.id, row.id);
    assert.ok(Array.isArray(m.panelQuestions) && m.panelQuestions.length > 0);
    assert.ok(Array.isArray(m.transactions));
    assert.ok(Array.isArray(m.consents) && m.consents.length === 6);
    assert.ok(Array.isArray(m.messages));
    assert.ok(typeof m.cintId === 'string' && m.cintId.length > 0);
  }
});

test('memberDetail is deterministic', () => {
  assert.deepEqual(memberDetail(200005), memberDetail(200005));
});

test('enum lists match the legacy dropdowns', () => {
  assert.deepEqual(TXN_TYPES, ['Correct Points', 'Redemption', 'Points From Survey', 'Bonus Rewards', 'Cint Survey', 'Profile Completion Reward', 'MyVoice Survey']);
  assert.deepEqual(TXN_STATUSES, ['Survey Started', 'Completed', 'Screenout from Survey', 'Quota Full', 'Quality Terminate', 'Survey Closed', 'Client Dropout']);
});
