// Canonical gamification rules for MyVoice.
//
// INTERNAL ONLY. Transcribed by hand from
// `content/source/Level, XP, Badges, Quests rules.md`.
//
// The perk ladder, XP formulas and quest completion rules in this file are
// internal operational specifications, not a promise to members. They may
// change at any time and must never be rendered in member-facing UI.
//
// Self-contained: no imports, so `node --test` can load it directly.
//
// Two rules here deliberately supersede the older
// `docs/superpowers/specs/2026-07-07-member-gamification-design.md`:
//   1. Survey completion XP is effort-based, not payout-based.
//   2. Click Draw entries come from screenout / quota-full / survey-closed
//      outcomes only — not from completions, redemptions or quests.

export type Level = { level: number; cumulativeXp: number; label: string };
export type LevelPerk = {
  level: number;
  perk: string;
  rule: string;
  drawEntriesPerActiveMonth?: number;
  streakGraceDays?: number;
};
export type Badge = { id: string; label: string; trigger: string; art: string };
// `reappear` is the source table's "Reappear" column: 'always' for quests that
// can be offered again freely, 'limited' for those the source marks
// "Yes, limited" — one-off or milestone-bound goals that must not re-enter the
// rotation once satisfied. Scheduling-relevant, so it is carried, not dropped.
export type QuestReappear = 'always' | 'limited';
export type QuestDef = {
  id: string;
  title: string;
  objective: string;
  rule: string;
  xp: number;
  reappear: QuestReappear;
};

// The five quests the source marks "Yes, limited"; everything else is "Yes".
export const LIMITED_REAPPEAR_QUEST_IDS = [
  'profile-check',
  'profile-pair',
  'profile-milestone',
  'first-cashout-request',
  'profile-progress',
] as const;

const LIMITED = new Set<string>(LIMITED_REAPPEAR_QUEST_IDS);
function withReappear(defs: Omit<QuestDef, 'reappear'>[]): QuestDef[] {
  return defs.map((q) => ({ ...q, reappear: LIMITED.has(q.id) ? 'limited' : 'always' }));
}

export const LEVELS: Level[] = [
  { level: 0, cumulativeXp: 0, label: 'Getting Started' },
  { level: 1, cumulativeXp: 200, label: 'New Voice' },
  { level: 2, cumulativeXp: 500, label: 'Active Voice' },
  { level: 3, cumulativeXp: 1000, label: 'Consistent Voice' },
  { level: 4, cumulativeXp: 2000, label: 'Trusted Voice' },
  { level: 5, cumulativeXp: 5000, label: 'Insightful Voice' },
  { level: 6, cumulativeXp: 10000, label: 'Top Voice' },
  { level: 7, cumulativeXp: 20000, label: 'Community Ally' },
  { level: 8, cumulativeXp: 50000, label: 'Community Pillar' },
  { level: 9, cumulativeXp: 100000, label: 'Research Ally' },
  { level: 10, cumulativeXp: 200000, label: 'Research Pillar' },
  { level: 11, cumulativeXp: 500000, label: 'Panel Pro' },
  { level: 12, cumulativeXp: 1000000, label: 'MyVoice Champion' },
];

// An "active month" requires at least one confirmed survey start.
//
// DRAW ENTRY BANDS — confirmed by the business owner 2026-07-22:
//   levels 0–1   0 entries
//   levels 2–4   +1 entry  per active month
//   levels 5–7   +2 entries
//   levels 8–10  +3 entries
//   level  11    +5 entries
//   level  12    +7 entries
//
// The source document phrases these as "+1 additional", "+2 additional" and so
// on, which reads as though they accumulate. THEY DO NOT. A level-11 member
// gets 5 entries per month, not 1+2+3+5. `drawEntriesFromLevel` implements the
// bands by taking the highest threshold at or below the member's level, and
// tests/gamification.test.mjs asserts every level so this cannot regress.
//
// These bonus entries are INTERNAL WEIGHTING, never advertised. Member-facing
// copy states only the signed regulation's rule: one entry per survey ending in
// screenout, quota full or survey closed.
export const LEVEL_PERKS: LevelPerk[] = [
  { level: 0, perk: 'Captain MyVoice Welcome Badge', rule: 'Displayed automatically during onboarding.' },
  { level: 1, perk: 'New Voice Profile Pack', rule: 'First permanent Captain MyVoice badge and bronze profile frame.' },
  { level: 2, perk: 'First Level-Up Draw Entry', rule: 'Grants +1 Click Draw entry per active month.', drawEntriesPerActiveMonth: 1 },
  { level: 3, perk: 'Streak Shield', rule: 'The streak resets only after two consecutive missed days.', streakGraceDays: 2 },
  { level: 4, perk: 'Trusted Voice Profile Pack', rule: 'More prominent badge and silver profile frame.' },
  { level: 5, perk: 'Second Level-Up Draw Entry', rule: 'Grants +2 Click Draw entries per active month.', drawEntriesPerActiveMonth: 2 },
  { level: 6, perk: 'Streak Shield Level Two', rule: 'The streak resets only after three consecutive missed days.', streakGraceDays: 3 },
  { level: 7, perk: 'Community Ally Profile Pack', rule: 'More prominent badge and gold profile frame.' },
  { level: 8, perk: 'Third Level-Up Draw Entry', rule: 'Grants +3 Click Draw entries per active month.', drawEntriesPerActiveMonth: 3 },
  { level: 9, perk: 'Streak Shield Level Three', rule: 'The streak resets only after five consecutive missed days.', streakGraceDays: 5 },
  { level: 10, perk: 'Research Pillar Profile Pack', rule: 'More prominent badge and diamond profile frame.' },
  { level: 11, perk: 'Final Level-Up Draw Entry', rule: 'Grants +5 Click Draw entries per active month.', drawEntriesPerActiveMonth: 5 },
  { level: 12, perk: 'Maximum-level prestige', rule: 'Permanent animated Champion badge, seven-day streak shield, +7 Click Draw entries per active month. The status never expires.', drawEntriesPerActiveMonth: 7, streakGraceDays: 7 },
];

export function levelFromXp(xp: number): number {
  let out = 0;
  for (const l of LEVELS) if (xp >= l.cumulativeXp) out = l.level;
  return out;
}

export function levelProgress(xp: number) {
  const level = levelFromXp(xp);
  const current = LEVELS[level];
  const next = LEVELS[level + 1] ?? null;
  const into = xp - current.cumulativeXp;
  const span = next ? next.cumulativeXp - current.cumulativeXp : 0;
  return {
    level,
    label: current.label,
    into,
    span,
    pct: next ? Math.round((into / span) * 100) : 100,
    nextAt: next ? next.cumulativeXp : null,
    nextLabel: next ? next.label : null,
  };
}

// Effort-based. Supersedes the payout-based formula in the 2026-07-07 spec.
export function surveyCompletionXp(estimatedMinutes: number): number {
  return 25 + 5 * estimatedMinutes;
}

function perkValue(level: number, key: 'drawEntriesPerActiveMonth' | 'streakGraceDays', base: number) {
  let out = base;
  for (const p of LEVEL_PERKS) {
    if (p.level <= level && p[key] !== undefined) out = p[key] as number;
  }
  return out;
}

export function streakGraceDays(level: number): number {
  return perkValue(level, 'streakGraceDays', 1);
}

export function drawEntriesFromLevel(level: number): number {
  return perkValue(level, 'drawEntriesPerActiveMonth', 0);
}

// All 19 rows of the "XP sources" table.
export const XP_SOURCES: { source: string; award: string; frequency: string; rule: string }[] = [
  {
    source: 'Verify email and activate account',
    award: '50 XP',
    frequency: 'Once',
    rule: 'Award after the verification link or code is successfully confirmed.',
  },
  {
    source: 'Add and verify the phone number',
    award: '25 XP',
    frequency: 'Once',
    rule: 'Award only after the phone number passes any required verification. Do not award for repeatedly replacing the method.',
  },
  {
    source: 'First authenticated login or check-in of the day',
    award: '10 XP',
    frequency: 'Once per day',
    rule: 'Multiple sessions, browsers or devices do not generate additional XP.',
  },
  {
    source: 'Reach a streak milestone',
    award: 'Variable',
    frequency: 'Once per milestone',
    rule: 'Reward sustained MyVoice log-in at 3 days 30 XP, 7 days 100 XP, 14 days 250XP, 30 days 1000XP, 60 days 3000XP, 100 days 10000XP and 365 days 50000XP.',
  },
  {
    source: 'Complete the first profile section',
    award: '50 XP',
    frequency: 'Once',
    rule: 'Award when the first full profiling section reaches a valid completed state.',
  },
  {
    source: 'Complete each additional profile section',
    award: '25 XP',
    frequency: 'Once per section',
    rule: 'Each section has its own completion event. Re-saving the same answers does not count.',
  },
  {
    source: 'Reach 50% profile completion',
    award: '50 XP',
    frequency: 'Once',
    rule: 'A milestone reward added on top of the underlying section-completion XP.',
  },
  {
    source: 'Reach 100% profile completion',
    award: '100 XP',
    frequency: 'Once',
    rule: 'Award only when all currently mandatory profiling sections are complete.',
  },
  {
    source: 'Complete a profile with new questions',
    award: '25 XP',
    frequency: 'Once',
    rule: 'Used when MyVoice adds new profiling questions after the member originally reached 100%.',
  },
  {
    source: 'Complete a newly introduced mandatory profile module',
    award: '50 XP',
    frequency: 'Once per module',
    rule: 'Used when MyVoice adds a genuinely new profiling area after the member originally reached 100%.',
  },
  {
    source: 'Start a survey successfully',
    award: '10 XP',
    frequency: 'Once per unique survey',
    rule: 'After the member is taken to the survey page.',
  },
  {
    source: 'Receive an eligible screenout',
    award: '25 XP',
    frequency: 'Once per unique survey',
    rule: 'Award only after the survey system returns a valid screenout status.',
  },
  {
    source: 'Receive an eligible quota-full outcome',
    award: '25 XP',
    frequency: 'Once per unique survey',
    rule: 'Award only after a valid quota-full callback.',
  },
  {
    source: 'Reconcile to Complete',
    award: '25 XP',
    frequency: 'Once per unique survey',
    rule: 'Award only when the reconciled to a complete.',
  },
  {
    source: 'Complete the first valid survey on MyVoice',
    award: '100 XP',
    frequency: 'Once',
    rule: 'An early milestone designed to bring a new member close to their next level.',
  },
  {
    source: 'Complete a valid survey',
    award: 'Variable',
    frequency: 'Every confirmed completion',
    rule: 'Base XP should be linked to expected survey effort and awarded only after the completion is accepted. Recommended survey-completion formula I recommend calculating base completion XP from the survey’s estimated length rather than its monetary reward: Base completion XP = 25 + (5 × estimated survey minutes) Examples: Expected survey length Base completion XP 5 minutes 50 XP 10 minutes 75 XP 15 minutes 100 XP 20 minutes 125 XP 30 minutes 175 XP',
  },
  {
    source: 'Resume a dropout survey and successfully completed it',
    award: '10 XP',
    frequency: 'Once per unique survey',
    rule: 'The system must detect a genuine earlier session and a later successful completion. Refreshing the page does not qualify.',
  },
  {
    source: 'Reach a valid survey-completion milestone',
    award: 'Variable',
    frequency: 'Once per milestone',
    rule: 'Suggested milestones: 5 surveys 50 XP, 10 surveys 100XP, 15 surveys 150 XP, 20 surveys 200 XP, 25 surveys 250 XP and so on.',
  },
  {
    source: 'Complete the first successful reward redemption',
    award: '100 XP',
    frequency: 'Once',
    rule: 'Award when the first payout is successfully processed, and the status is updated by the Incentives colleague.',
  },
];

// All 27 rows of the "Badges" table. id is a kebab-case slug of the label.
export const BADGES: Badge[] = [
  {
    id: 'verified-voice',
    label: 'Verified Voice',
    trigger: 'Successfully verify the member account through email or the required account-verification process.',
    art: 'Captain holding a check-mark shield.',
  },
  {
    id: 'reward-ready',
    label: 'Reward Ready',
    trigger: 'Add and successfully verify phone number.',
    art: 'Captain holding a verified wallet.',
  },
  {
    id: 'profile-starter',
    label: 'Profile Starter',
    trigger: 'Save the first valid answer in the member profile.',
    art: 'Captain writing the first line on a profile card.',
  },
  {
    id: 'profile-pioneer',
    label: 'Profile Pioneer',
    trigger: 'Complete the first full profile category.',
    art: 'Captain planting a small MyVoice flag.',
  },
  {
    id: 'halfway-heard',
    label: 'Halfway Heard',
    trigger: 'Reach 50% overall profile completion for the first time.',
    art: 'Captain beside a half-filled speech bubble.',
  },
  {
    id: 'full-picture',
    label: 'Full Picture',
    trigger: 'Reach 100% profile completion for the first time.',
    art: 'Captain completing the final piece of a profile puzzle.',
  },
  {
    id: 'new-chapter',
    label: 'New Chapter',
    trigger: 'Complete the first new mandatory profile category added after registration.',
    art: 'Captain opening a new chapter in a book.',
  },
  {
    id: 'invitation-accepted',
    label: 'Invitation Accepted',
    trigger: 'Start the first survey directly from an invitation.',
    art: 'Captain opening a MyVoice survey envelope.',
  },
  {
    id: 'survey-scout',
    label: 'Survey Scout',
    trigger: 'Start the first survey from dashboard.',
    art: 'Captain looking through a survey-shaped magnifying glass.',
  },
  {
    id: 'every-attempt-counts',
    label: 'Every Attempt Counts',
    trigger: 'Receive the first eligible survey screenout.',
    art: 'Captain giving an encouraging thumbs-up beside a survey exit.',
  },
  {
    id: 'quota-navigator',
    label: 'Quota Navigator',
    trigger: 'Receive the first eligible quota-full outcome.',
    art: 'Captain beside a full sign, holding a Click Draw ticket.',
  },
  {
    id: 'back-on-track',
    label: 'Back on Track',
    trigger: 'Resume a survey from a dropout earlier and successfully complete it.',
    art: 'Captain following a return arrow back to the survey path.',
  },
  {
    id: 'confirmed-contribution',
    label: 'Confirmed Contribution',
    trigger: 'Have the first survey complete confirmed as valid.',
    art: 'Captain stamping a completed clipboard.',
  },
  {
    id: 'first-earnings',
    label: 'First Earnings',
    trigger: 'Receive the first approved monetary survey reward.',
    art: 'Captain catching the first reward coin in a speech bubble.',
  },
  {
    id: 'reward-step-up',
    label: 'Reward Step-Up',
    trigger: 'Receive the first approved single-survey reward worth more than $/€ 1.',
    art: 'Captain beside a larger reward coin marked “1+”.',
  },
  {
    id: 'quick-take',
    label: 'Quick Take',
    trigger: 'Complete the first survey with an LOI of five minutes or less.',
    art: 'Captain holding a small stopwatch.',
  },
  {
    id: 'thoughtful-ten',
    label: 'Thoughtful Ten',
    trigger: 'Complete the first survey with an LOI greater than ten minutes.',
    art: 'Captain thinking beside a ten-minute timer.',
  },
  {
    id: 'deep-dive',
    label: 'Deep Dive',
    trigger: 'Complete the first survey with an LOI of at least 20 minutes.',
    art: 'Captain exploring a deep research map.',
  },
  {
    id: 'feedback-loop',
    label: 'Feedback Loop',
    trigger: 'Submit the first message to Member Support, chat or support form.',
    art: 'Captain completing a short feedback card.',
  },
  {
    id: 'first-check-in',
    label: 'First Check-In',
    trigger: 'Complete the first eligible daily login or check-in.',
    art: 'Captain greeting the member at sunrise.',
  },
  {
    id: 'daily-sweep',
    label: 'Daily Sweep',
    trigger: 'Complete all available daily quests for the first time in one day.',
    art: 'Captain holding three completed check marks.',
  },
  {
    id: 'three-day-rhythm',
    label: 'Three-Day Rhythm',
    trigger: 'Reach the first three-day activity streak.',
    art: 'Captain beside three connected calendar days.',
  },
  {
    id: 'seven-day-voice',
    label: 'Seven-Day Voice',
    trigger: 'Reach the first seven-day activity streak.',
    art: 'Captain beside a seven-day flame or continuous ribbon.',
  },
  {
    id: 'shield-activated',
    label: 'Shield Activated',
    trigger: 'Use a streak grace rule for the first time and prevent the streak from resetting.',
    art: 'Captain raising a streak-protection shield.',
  },
  {
    id: 'cashout-ready',
    label: 'Cashout Ready',
    trigger: 'Reach the minimum redemption threshold for the first time.',
    art: 'Captain watching a balance gauge reach its target.',
  },
  {
    id: 'first-redemption',
    label: 'First Redemption',
    trigger: 'Submit the first valid reward-redemption request.',
    art: 'Captain sending a reward from the wallet.',
  },
  {
    id: 'draw-debut',
    label: 'Draw Debut',
    trigger: 'Receive the first valid Click Draw entry.',
    art: 'Captain holding the first Click Draw ticket.',
  },
];

// Section 4.1, all 17 rows. Three slots are drawn from this pool daily,
// refreshing at local midnight.
const DAILY_RAW: Omit<QuestDef, 'reappear'>[] = [
  {
    id: 'daily-check-in',
    title: 'Daily Check-In',
    objective: 'Check in to MyVoice today',
    rule: 'Complete the first authenticated platform session during the member’s local calendar day',
    xp: 5,
  },
  {
    id: 'share-your-voice',
    title: 'Share Your Voice',
    objective: 'Complete one survey today',
    rule: 'Receive one confirmed valid survey-completion outcome during the local day',
    xp: 20,
  },
  {
    id: 'give-it-a-go',
    title: 'Give It a Go',
    objective: 'Make one genuine survey attempt',
    rule: 'Reach one valid terminal survey outcome: completed, screened out or quota full',
    xp: 10,
  },
  {
    id: 'quick-contribution',
    title: 'Quick Contribution',
    objective: 'Complete one short survey today',
    rule: 'Complete a survey with a configured expected duration of 10 minutes or less',
    xp: 10,
  },
  {
    id: 'thoughtful-contribution',
    title: 'Thoughtful Contribution',
    objective: 'Complete one survey longer than 10 minutes',
    rule: 'Complete a survey with a configured expected duration greater than 10 minutes',
    xp: 25,
  },
  {
    id: 'profile-check',
    title: 'Profile Check',
    objective: 'Complete one profile category',
    rule: 'Complete an unfinished profile category',
    xp: 15,
  },
  {
    id: 'double-contribution',
    title: 'Double Contribution',
    objective: 'Complete two surveys today',
    rule: 'Receive two distinct confirmed survey-complete status during the same day',
    xp: 35,
  },
  {
    id: 'two-genuine-attempts',
    title: 'Two Genuine Attempts',
    objective: 'Make two genuine survey attempts today',
    rule: 'Two unique attempts must reach completed, screened-out or quota-full status',
    xp: 15,
  },
  {
    id: 'reward-step-up',
    title: 'Reward Step-Up',
    objective: 'Complete a survey worth more than €1',
    rule: 'Complete a survey with a configured reward above €1 or the approved local equivalent',
    xp: 25,
  },
  {
    id: 'dashboard-discovery',
    title: 'Dashboard Discovery',
    objective: 'Find and complete a survey from the dashboard',
    rule: 'Start a survey directly from the available-surveys area and complete it',
    xp: 15,
  },
  {
    id: 'mobile-contribution',
    title: 'Mobile Contribution',
    objective: 'Complete a mobile-ready survey on your phone',
    rule: 'Complete a survey marked as mobile-compatible from a mobile device',
    xp: 15,
  },
  {
    id: 'mixed-journey',
    title: 'Mixed Journey',
    objective: 'Complete one short and one longer survey',
    rule: 'Complete one survey of 10 expected minutes or less and one survey longer than 10 expected minutes',
    xp: 40,
  },
  {
    id: 'profile-pair',
    title: 'Profile Pair',
    objective: 'Complete two profile categories',
    rule: 'Complete, verify or legitimately correct two distinct eligible profile categories',
    xp: 25,
  },
  {
    id: 'profile-milestone',
    title: 'Profile Milestone',
    objective: 'Reach your next profile-completion milestone',
    rule: 'Cross the next 25% completion boundary: 25%, 50%, 75% or 100%',
    xp: 30,
  },
  {
    id: 'first-cashout-request',
    title: 'First Cashout Request',
    objective: 'Request your first reward payment',
    rule: 'Submit the member’s first valid redemption request after meeting all payment requirements',
    xp: 50,
  },
  {
    id: 'badge-breakthrough',
    title: 'Badge Breakthrough',
    objective: 'Unlock a new badge today',
    rule: 'Earn one previously locked, eligible achievement badge',
    xp: 30,
  },
  {
    id: 'century-day',
    title: 'Century Day',
    objective: 'Earn 100 XP today',
    rule: 'Earn at least 100 confirmed underlying XP during the local day',
    xp: 25,
  },
];

// Section 4.2, all 12 rows. One is active per week, refreshing at local
// midnight on Monday.
const WEEKLY_RAW: Omit<QuestDef, 'reappear'>[] = [
  {
    id: 'three-voices-shared',
    title: 'Three Voices Shared',
    objective: 'Complete three surveys this week',
    rule: 'Receive three distinct confirmed valid survey completions during the weekly period',
    xp: 150,
  },
  {
    id: 'five-day-rhythm',
    title: 'Five-Day Rhythm',
    objective: 'Be active on five different days this week',
    rule: 'Record qualifying activity on five local calendar days plus genuine survey activity on at least two days',
    xp: 125,
  },
  {
    id: 'five-genuine-attempts',
    title: 'Five Genuine Attempts',
    objective: 'Make five genuine survey attempts this week',
    rule: 'Five unique attempts must reach completed, screened-out or quota-full status',
    xp: 100,
  },
  {
    id: 'thoughtful-week',
    title: 'Thoughtful Week',
    objective: 'Complete 30 minutes of research this week',
    rule: 'Accumulate surveys with total LOI = 30 minutes through confirmed completes',
    xp: 125,
  },
  {
    id: 'profile-progress',
    title: 'Profile Progress',
    objective: 'Complete two profile categories',
    rule: 'Complete correct two distinct eligible profile categories',
    xp: 100,
  },
  {
    id: 'quest-rhythm',
    title: 'Quest Rhythm',
    objective: 'Complete all daily quests on three different days',
    rule: 'Earn the full daily quest-set completion on three distinct local days during the weekly period',
    xp: 200,
  },
  {
    id: 'double-day',
    title: 'Double-Day',
    objective: 'Complete two surveys in one day',
    rule: 'Receive two confirmed completions during the same local calendar day at least once that week',
    xp: 150,
  },
  {
    id: 'short-and-deep',
    title: 'Short and Deep',
    objective: 'Complete one short and one long survey',
    rule: 'Complete one survey of 10 expected minutes or less and one survey of at least 20 expected minutes',
    xp: 200,
  },
  {
    id: 'research-sampler',
    title: 'Research Sampler',
    objective: 'Complete short, medium and long surveys',
    rule: 'Complete one survey of 10 minutes or less, one of 11–20 minutes and one longer than 20 minutes',
    xp: 300,
  },
  {
    id: 'bounce-back-week',
    title: 'Bounce-Back Week',
    objective: 'Turn one unsuccessful attempt into a later success',
    rule: 'After an eligible screenout or quota-full result, complete another survey later that same day',
    xp: 175,
  },
  {
    id: 'reflective-researcher',
    title: 'Reflective Researcher',
    objective: 'Complete two surveys',
    rule: 'Complete two distinct surveys',
    xp: 150,
  },
  {
    id: 'topic-specialist',
    title: 'Topic Specialist',
    objective: 'Complete three surveys',
    rule: 'Complete three valid surveys',
    xp: 200,
  },
];

// Section 4.3, all 6 rows. One is active per month, refreshing at local
// midnight on the 1st of the new month.
const MONTHLY_RAW: Omit<QuestDef, 'reappear'>[] = [
  {
    id: 'ten-voices-shared',
    title: 'Ten Voices Shared',
    objective: 'Complete 10 surveys this month',
    rule: 'Receive 10 distinct confirmed valid survey completions during the monthly period',
    xp: 750,
  },
  {
    id: 'monthly-rhythm',
    title: 'Monthly Rhythm',
    objective: 'Be active on 12 different days this month',
    rule: 'Record qualifying activity on 12 local calendar days, including genuine survey activity on at least five days',
    xp: 500,
  },
  {
    id: 'balanced-participation',
    title: 'Balanced Participation',
    objective: 'Complete 20 survey attempts',
    rule: 'Record 20 unique survey outcomes, complete, terminate or quotafull',
    xp: 600,
  },
  {
    id: 'deep-research-month',
    title: 'Deep Research Month',
    objective: 'Complete three longer surveys',
    rule: 'Complete either three surveys longer than 10 expected minutes',
    xp: 750,
  },
  {
    id: 'profile-in-shape',
    title: 'Profile in Shape',
    objective: 'Complete and verify your MyVoice profile',
    rule: 'Reach 100% profile completion',
    xp: 500,
  },
  {
    id: 'daily-quest-regular',
    title: 'Daily Quest Regular',
    objective: 'Complete all daily quests on eight different days',
    rule: 'Earn the full daily quest-set completion on eight distinct local days during the month',
    xp: 750,
  },
];

export const DRAW = {
  prizes: [
    { count: 1, value: 50 },
    { count: 10, value: 10 },
  ],
  totalValue: 150,
  currency: 'EUR',
  entrySources: ['screenout', 'quota-full', 'survey-closed'] as const,
  entriesPerQualifyingSurvey: 1,
  monthlyCap: null,
  resetsMonthly: true,
  drawnWith: 'random.org',
  onePrizePerPersonPerMonth: true,
};

export const DAILY_QUESTS: QuestDef[] = withReappear(DAILY_RAW);
export const WEEKLY_QUESTS: QuestDef[] = withReappear(WEEKLY_RAW);
export const MONTHLY_QUESTS: QuestDef[] = withReappear(MONTHLY_RAW);

//
// Quest rotation
//
// Three daily slots, per the confirmed design: a fixed habit anchor, a survey
// slot, and one rotating from the wider pool. The split matters — if all three
// slots needed a survey, a member in a market with thin survey supply could
// finish a day with nothing completable, which is exactly the frustration the
// habit loop is meant to avoid.
//
// Rotation is a pure function of a day index so the same day always yields the
// same three quests: the static build precomputes them, and the real backend
// can hand the member the same slots on every device without storing them.
export const DAILY_ANCHOR_QUEST_ID = 'daily-check-in';

// The daily quests that need a survey outcome. Everything else in the pool is
// completable without one.
export const DAILY_SURVEY_QUEST_IDS = [
  'share-your-voice',
  'give-it-a-go',
  'quick-contribution',
  'thoughtful-contribution',
  'double-contribution',
  'two-genuine-attempts',
  'reward-step-up',
  'dashboard-discovery',
  'mobile-contribution',
  'mixed-journey',
] as const;

function mod(n: number, m: number): number {
  return ((n % m) + m) % m;
}

function questById(pool: QuestDef[], id: string): QuestDef {
  const def = pool.find((q) => q.id === id);
  if (!def) throw new Error(`unknown quest id "${id}"`);
  return def;
}

/** The three daily quests for a given day index. Deterministic. */
export function dailyQuestSlots(dayIndex: number): QuestDef[] {
  const anchor = questById(DAILY_QUESTS, DAILY_ANCHOR_QUEST_ID);
  const surveyPool = (DAILY_SURVEY_QUEST_IDS as readonly string[]).map((id) =>
    questById(DAILY_QUESTS, id)
  );
  const widePool = DAILY_QUESTS.filter(
    (q) =>
      q.id !== DAILY_ANCHOR_QUEST_ID &&
      !(DAILY_SURVEY_QUEST_IDS as readonly string[]).includes(q.id)
  );
  return [
    anchor,
    surveyPool[mod(dayIndex, surveyPool.length)],
    widePool[mod(dayIndex, widePool.length)],
  ];
}

/** The weekly quest for a given week index. Deterministic. */
export function weeklyQuestSlot(weekIndex: number): QuestDef {
  return WEEKLY_QUESTS[mod(weekIndex, WEEKLY_QUESTS.length)];
}
