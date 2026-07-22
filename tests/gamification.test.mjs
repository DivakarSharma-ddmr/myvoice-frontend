import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  LEVELS, BADGES, DAILY_QUESTS, WEEKLY_QUESTS, MONTHLY_QUESTS, DRAW,
  levelFromXp, levelProgress, surveyCompletionXp, streakGraceDays, drawEntriesFromLevel,
  dailyQuestSlots, weeklyQuestSlot, DAILY_ANCHOR_QUEST_ID, DAILY_SURVEY_QUEST_IDS,
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

// Confirmed by the business owner 2026-07-22. The source document says
// "+1 additional", "+2 additional" and so on, which reads as though the values
// accumulate — they do NOT. The bands below are the whole truth: a level-11
// member gets 5 entries per month, not 1+2+3+5. Every level is asserted so a
// future reading of "additional" cannot quietly reintroduce accumulation.
test('level draw-entry bonuses follow the confirmed bands at every level', () => {
  const expected = {
    0: 0, 1: 0,
    2: 1, 3: 1, 4: 1,
    5: 2, 6: 2, 7: 2,
    8: 3, 9: 3, 10: 3,
    11: 5,
    12: 7,
  };
  for (const [level, entries] of Object.entries(expected)) {
    assert.equal(
      drawEntriesFromLevel(Number(level)),
      entries,
      `level ${level} should grant ${entries} draw entries per active month`
    );
  }
});

test('draw entry bonuses never accumulate across bands', () => {
  // 1 + 2 + 3 + 5 = 11 would be the accumulating reading. It is wrong.
  assert.notEqual(drawEntriesFromLevel(11), 11);
  assert.equal(drawEntriesFromLevel(11), 5);
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

test('daily slots are the anchor, a survey quest and a wider-pool quest', () => {
  for (let day = 0; day < 40; day++) {
    const slots = dailyQuestSlots(day);
    assert.equal(slots.length, 3);
    assert.equal(slots[0].id, DAILY_ANCHOR_QUEST_ID);
    assert.ok(DAILY_SURVEY_QUEST_IDS.includes(slots[1].id));
    assert.ok(!DAILY_SURVEY_QUEST_IDS.includes(slots[2].id));
    assert.equal(new Set(slots.map((q) => q.id)).size, 3, `day ${day} repeated a quest`);
  }
});

test('the same day always yields the same quests', () => {
  assert.deepEqual(dailyQuestSlots(12), dailyQuestSlots(12));
  assert.notDeepEqual(dailyQuestSlots(12), dailyQuestSlots(13));
});

test('rotation handles a negative day index without crashing', () => {
  assert.equal(dailyQuestSlots(-1).length, 3);
  assert.ok(weeklyQuestSlot(-3));
});

test('every daily quest except the anchor is reachable by rotation', () => {
  const seen = new Set();
  for (let day = 0; day < 200; day++) dailyQuestSlots(day).forEach((q) => seen.add(q.id));
  assert.equal(seen.size, DAILY_QUESTS.length);
});

test('the weekly slot cycles the whole weekly pool', () => {
  const seen = new Set();
  for (let w = 0; w < WEEKLY_QUESTS.length; w++) seen.add(weeklyQuestSlot(w).id);
  assert.equal(seen.size, WEEKLY_QUESTS.length);
});
