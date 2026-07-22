import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  LEVELS, BADGES, DAILY_QUESTS, WEEKLY_QUESTS, MONTHLY_QUESTS, DRAW,
  levelFromXp, levelProgress, surveyCompletionXp, streakGraceDays, drawEntriesFromLevel,
} from '../src/lib/gamification.ts';

test('the level table matches the rules document', () => {
  assert.equal(LEVELS.length, 13);
  assert.equal(LEVELS[0].label, 'Getting Started');
  assert.equal(LEVELS[12].label, 'MyVoice Champion');
  assert.deepEqual(
    LEVELS.map((l) => l.cumulativeXp),
    [0, 200, 500, 1000, 2000, 5000, 10000, 20000, 50000, 100000, 200000, 500000, 1000000]
  );
});

test('levelFromXp picks the highest threshold reached', () => {
  assert.equal(levelFromXp(0), 0);
  assert.equal(levelFromXp(199), 0);
  assert.equal(levelFromXp(200), 1);
  assert.equal(levelFromXp(2340), 4);
  assert.equal(levelFromXp(4999), 4);
  assert.equal(levelFromXp(5000), 5);
  assert.equal(levelFromXp(9999999), 12);
});

test('levelProgress reports position within the band', () => {
  const p = levelProgress(2340);
  assert.equal(p.level, 4);
  assert.equal(p.label, 'Trusted Voice');
  assert.equal(p.into, 340);
  assert.equal(p.span, 3000);
  assert.equal(p.nextAt, 5000);
  assert.equal(p.nextLabel, 'Insightful Voice');
  assert.equal(p.pct, Math.round((340 / 3000) * 100));
});

test('levelProgress caps cleanly at the maximum level', () => {
  const p = levelProgress(2000000);
  assert.equal(p.level, 12);
  assert.equal(p.nextAt, null);
  assert.equal(p.nextLabel, null);
  assert.equal(p.pct, 100);
});

test('survey completion XP is effort-based, not payout-based', () => {
  assert.equal(surveyCompletionXp(5), 50);
  assert.equal(surveyCompletionXp(10), 75);
  assert.equal(surveyCompletionXp(15), 100);
  assert.equal(surveyCompletionXp(20), 125);
  assert.equal(surveyCompletionXp(30), 175);
});

test('streak grace days step up at levels 3, 6, 9 and 12', () => {
  assert.equal(streakGraceDays(0), 1);
  assert.equal(streakGraceDays(2), 1);
  assert.equal(streakGraceDays(3), 2);
  assert.equal(streakGraceDays(5), 2);
  assert.equal(streakGraceDays(6), 3);
  assert.equal(streakGraceDays(9), 5);
  assert.equal(streakGraceDays(12), 7);
});

test('level draw-entry bonuses step up at levels 2, 5, 8, 11 and 12', () => {
  assert.equal(drawEntriesFromLevel(1), 0);
  assert.equal(drawEntriesFromLevel(2), 1);
  assert.equal(drawEntriesFromLevel(4), 1);
  assert.equal(drawEntriesFromLevel(5), 2);
  assert.equal(drawEntriesFromLevel(8), 3);
  assert.equal(drawEntriesFromLevel(11), 5);
  assert.equal(drawEntriesFromLevel(12), 7);
});

test('the badge set is complete and uniquely keyed', () => {
  assert.equal(BADGES.length, 27);
  const ids = BADGES.map((b) => b.id);
  assert.equal(new Set(ids).size, 27);
  assert.ok(BADGES.every((b) => b.label && b.trigger && b.art));
});

test('quest pools match the rules document', () => {
  assert.equal(DAILY_QUESTS.length, 17);
  assert.equal(WEEKLY_QUESTS.length, 12);
  assert.equal(MONTHLY_QUESTS.length, 6);
  assert.ok([...DAILY_QUESTS, ...WEEKLY_QUESTS, ...MONTHLY_QUESTS].every((q) => q.xp > 0));
});

test('the draw prize structure matches the signed regulation', () => {
  assert.equal(DRAW.totalValue, 150);
  assert.equal(DRAW.prizes.reduce((n, p) => n + p.count, 0), 11);
  assert.deepEqual(DRAW.entrySources, ['screenout', 'quota-full', 'survey-closed']);
});
