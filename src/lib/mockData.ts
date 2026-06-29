/**
 * ============================================================================
 *  MyVoice — MOCK DATA (single swappable source)
 * ============================================================================
 *  This is the ONE file your dev team replaces with real API calls.
 *  Every screen reads its content from here so nothing is hard-coded in the UI.
 *
 *  ⚠️  BUSINESS-CRITICAL PLACEHOLDERS — confirm/replace before going live:
 *    - trustStats:      "2M+ members / 30+ countries / ISO 20252" must be
 *                       verifiably accurate (trust brand — do not overstate).
 *    - testimonials:    names, quotes and video clips are INVENTED for layout.
 *                       Use only real, consented member content before launch.
 *    - communityStats:  monthly activity numbers are illustrative.
 *    - rewardBrands:    "20+ brands", PayPal/SEPA/charity availability varies
 *                       by country — wire to real reward catalogue per market.
 *    - referral reward: "€5 each" is illustrative — confirm the real program.
 *    - draw / prize:    "€250 prize pool, drawn Jun 30" is illustrative.
 *  Search this file for `PLACEHOLDER` to find each spot.
 * ============================================================================
 */

/* ----------------------------- PUBLIC SITE ------------------------------ */

export type TrustStat = { value: string; label: string };
// PLACEHOLDER (business-critical): verify each figure before publishing.
export const trustStats: TrustStat[] = [
  { value: '2M+', label: 'members' },
  { value: '30+', label: 'countries' },
  { value: 'Since 2015', label: 'DataDiggers' },
  { value: 'GDPR', label: 'compliant' },
  { value: 'ISO 20252', label: 'certified' },
];

export type Step = { icon: string; title: string; body: string };
export const howItWorksSteps: Step[] = [
  { icon: '🙋', title: 'Join for free', body: 'Create your account and tell us a little about yourself.' },
  { icon: '📝', title: 'Complete your profile', body: 'Help us match you with surveys you’ll actually relate to.' },
  { icon: '💬', title: 'Take surveys', body: 'Share your opinions on products, services and topics.' },
  { icon: '🎁', title: 'Earn rewards', body: 'Collect rewards and redeem once you’re eligible.' },
];

export const howItWorksDetailed: Step[] = [
  { icon: '🙋', title: 'Join for free', body: 'Create your account with just an email — tell us your country and a few basics to get started.' },
  { icon: '📝', title: 'Complete your profile', body: 'Answer short profile sections about your lifestyle, household and interests so we can match you well.' },
  { icon: '🎯', title: 'Get matched', body: 'We match surveys to your location, profile and each study’s requirements — no spam, only relevant invites.' },
  { icon: '💬', title: 'Take surveys', body: 'Share honest opinions on products, services and topics. Most take 5–15 minutes.' },
  { icon: '🎁', title: 'Earn & redeem', body: 'Rewards are validated, then added to your balance. Redeem once you reach the €10 minimum.' },
];

export const whyItMatters: Step[] = [
  { icon: '🛠️', title: 'Improve products', body: 'Brands refine what they make based on real feedback.' },
  { icon: '📣', title: 'Influence services', body: 'Your experience shapes how companies treat customers.' },
  { icon: '🔬', title: 'Support research', body: 'Help academics and organizations understand people.' },
  { icon: '🧑‍🤝‍🧑', title: 'Represent people like you', body: 'Make sure voices like yours are counted.' },
];

export const trustCards: Step[] = [
  { icon: '🛡️', title: 'GDPR-compliant', body: 'Your data is protected and never sold.' },
  { icon: '🏆', title: 'DataDiggers-backed', body: 'Research expertise since 2015.' },
  { icon: '👤', title: 'One account per person', body: 'Fair access, kept real.' },
  { icon: '✅', title: 'Clear reward rules', body: 'No surprises, no fine print.' },
];

export const whyJoinCards: Step[] = [
  { icon: '🗣️', title: 'Your opinion matters', body: 'Real feedback from real people shapes the products and services around you.' },
  { icon: '🎁', title: 'Earn occasional rewards', body: 'A simple, transparent way to get rewarded for your time — not a get-rich scheme.' },
  { icon: '🌍', title: 'Join a global community', body: '2M+ members across 30+ countries, all sharing their voice.' },
  { icon: '🕒', title: 'Flexible participation', body: 'Take surveys whenever and wherever suits you, on any device.' },
  { icon: '🔒', title: 'Safe and private', body: 'GDPR-compliant, ISO-certified, and never selling your data.' },
  { icon: '✅', title: 'Free to join', body: 'No fees, no catch — joining and participating is always free.' },
];

export type TrustSection = { title: string; body: string };
export const trustSections: TrustSection[] = [
  { title: 'Who we are', body: 'MyVoice is a proprietary research panel operated in-house by DataDiggers, a technology-first market research company founded in 2015 serving clients in 65+ countries.' },
  { title: 'Powered by DataDiggers', body: 'Every panelist sits within DataDiggers’ research ecosystem — proprietary panels, rigorous quality standards and global reach behind a brand you can trust.' },
  { title: 'How survey data is used', body: 'Your answers are aggregated and used strictly for research purposes — to help brands and organizations make better decisions. They are never sold as personal data.' },
  { title: 'How personal data is protected', body: 'We are GDPR-compliant and ISO 20252:2019 certified. Your data is stored securely and processed lawfully, with double opt-in confirming your participation.' },
  { title: 'Your privacy rights', body: 'You can access, correct, export or delete your data at any time, and manage your consent preferences directly from your account settings.' },
  { title: 'Anti-fraud & quality checks', body: 'We use advanced validation (including IPQS) and a one-account-per-person rule to keep responses genuine and the community fair for everyone.' },
];

// Real panel-member testimonials. Per the member's request, quotes and video
// clips are NOT paired 1:1 and members are attributed generically ("Verified
// MyVoice member") — no names/locations are shown. Swap to named attribution
// later only with each member's consent.
//
// Real video clips live in /public/assets/videos/member-01.mp4 … member-13.mp4.
export const memberVideos: string[] = Array.from(
  { length: 13 },
  (_, i) => `/assets/videos/member-${String(i + 1).padStart(2, '0')}.mp4`,
);

// Real member quotes (verbatim, lightly trimmed). Shown in the scrolling band.
export const memberQuotes: string[] = [
  'MyVoice gives me a place to share my opinions and learn from different survey topics. I’m glad to be part of the community, and I believe new members will find it useful too.',
  'MyVoice is helpful when you need a simple way to earn occasional rewards in your free time. I like that regular people can answer surveys and get something back for their opinions.',
  'Getting started with MyVoice by DataDiggers was easy: I created my account, confirmed my email, and completed my profile. Once your profile is ready, you can receive surveys that match your information.',
  'I started using MyVoice because it felt trustworthy and open. The surveys let me share real feedback about products, services, and the market in a simple way.',
  'MyVoice helps companies understand how people use their products and services. As a member, I like knowing that my answers can support better decisions while I’m also rewarded for taking part.',
  'I enjoy MyVoice because the surveys are interesting, clear, and do not take too long to complete. It is a friendly platform where members can participate, answer questions, and earn rewards.',
  'I have used MyVoice by DataDiggers for several years and have redeemed rewards many times. I like that once I reach the payout threshold, I can request my reward and receive it by email.',
  'MyVoice by DataDiggers is an online survey community where members receive invitations to participate in research. It gives people the chance to share their opinions and be rewarded for eligible surveys.',
  'MyVoice has helped me speak openly about how I feel on different topics. I like that my opinion can count, and that I can earn rewards while participating in research.',
  'Surveys help collect opinions that represent real people, and MyVoice gives members a chance to be part of that process. I like being able to share my views, make my voice count, and receive rewards for my time.',
  'MyVoice is a platform I’m happy to support because it gives members a way to participate in research and share their opinions. I like being part of a community where people’s voices matter.',
  'I like MyVoice because the questions are simple, direct, and connected to real topics like communities, organizations, global events, and everyday life. Answering surveys feels meaningful because I know my feedback is part of research.',
  'MyVoice helps connect people’s feedback with companies that want to improve their products and services. I value being part of a research community where member opinions are listened to and appreciated.',
];

export const insideTiles: { title: string; body: string; tint: 'lteal' | 'syel' }[] = [
  { title: 'Dashboard', body: 'Balance, surveys & progress at a glance', tint: 'lteal' },
  { title: 'Surveys', body: 'Matched to your profile & country', tint: 'syel' },
  { title: 'Rewards wallet', body: 'Pending, approved & redeemed', tint: 'lteal' },
  { title: 'Profile', body: 'Guided, bite-sized completion', tint: 'syel' },
];

export type Faq = { q: string; a: string };
export const faqs: Faq[] = [
  { q: 'Is MyVoice free?', a: 'Yes — joining and participating is always free. There are no fees, ever.' },
  { q: 'How do I earn rewards?', a: 'Complete eligible surveys matched to your profile. Each completed survey adds a reward to your balance once validated.' },
  { q: 'Why do I need to complete my profile?', a: 'Your profile helps us match you with surveys you’re eligible for and actually relate to — so you waste less time being screened out.' },
  { q: 'How often will I receive surveys?', a: 'It varies by your profile, country and active studies. Completing more profile sections improves your match rate.' },
  { q: 'What happens if I don’t qualify for a survey?', a: 'Sometimes a study needs a different profile or its quota is full. You’re never penalized — just check back for new matches.' },
  { q: 'How is my data protected?', a: 'MyVoice is GDPR-compliant and ISO 20252 certified. Your answers are used for research only and are never sold.' },
  { q: 'Who owns MyVoice?', a: 'MyVoice is a proprietary panel built and managed in-house by DataDiggers, a research company founded in 2015.' },
  { q: 'How do I redeem rewards?', a: 'Once you reach the €10 minimum, redeem via PayPal, gift cards, bank transfer or charity donation.' },
];
// FAQ page grouping: [groupTitle, [faq indexes]]
export const faqGroups: [string, number[]][] = [
  ['Getting started', [0, 2]],
  ['Surveys', [3, 4]],
  ['Rewards', [1, 7]],
  ['Privacy & account', [5, 6]],
];

// PLACEHOLDER (business-critical): illustrative monthly community numbers.
export const communityMonth: TrustStat[] = [
  { value: '42,000', label: 'surveys completed' },
  { value: '18,500', label: 'rewards issued' },
  { value: '30+', label: 'active countries' },
];

export const blogFeatured = {
  title: 'Are paid survey sites legitimate?',
  body: 'A clear, honest look at how reputable research panels actually work — and the red flags that signal a scam.',
  category: 'Privacy & Safety',
};
export const blogPosts: { title: string; category: string }[] = [
  { title: 'How online surveys work', category: 'Online Research' },
  { title: 'Why you may not qualify for every survey', category: 'Surveys' },
  { title: 'How to avoid survey scams', category: 'Privacy & Safety' },
  { title: 'Completing your survey profile properly', category: 'Survey Tips' },
  { title: 'What companies do with your answers', category: 'Online Research' },
  { title: 'How survey rewards work', category: 'Rewards' },
];
export const blogCategories = ['Paid Surveys', 'Online Research', 'Rewards', 'Privacy & Safety', 'Survey Tips'];

// Country landing pages (SEO). Slugs are lowercased + hyphenated.
export const countries = ['Romania', 'Germany', 'France', 'United Kingdom', 'Canada'];

/* ---------------------------- MEMBER PLATFORM --------------------------- */

export const member = {
  name: 'Ana',
  initials: 'AM',
  accountId: 'AM-4821',
  email: 'ana.m@email.com',
  country: 'Romania',
  countryFlag: '🇷🇴',
  language: 'English',
  level: 4,
  rank: 'Voicer',
  xp: 320,
  xpMax: 500,
  streak: 7,
  tickets: 6,
  referralLink: 'myvoice.com/r/ana-m-4821',
};

export const wallet = {
  available: 8.8,
  pending: 2.4,
  lifetime: 146.2,
  minPayout: 10,
};

export type Quest = {
  id: number;
  title: string;
  icon: string;
  xp: number;
  reward?: number;
  done: boolean;
  kind: 'survey' | 'profile' | 'checkin';
};
export const quests: Quest[] = [
  { id: 1, title: 'Complete a survey today', icon: 'u1-share', xp: 60, reward: 1.2, done: false, kind: 'survey' },
  { id: 2, title: 'Update one profile section', icon: 'u1-work', xp: 40, done: false, kind: 'profile' },
  { id: 3, title: 'Daily check-in', icon: 'u1-calendar', xp: 20, done: false, kind: 'checkin' },
];

export type SurveyState = 'rec' | 'closing' | 'avail' | 'quota' | 'screen' | 'pending' | 'done';
export type Survey = { id: number; topic: string; icon: string; time: number; reward: number; xp: number; state: SurveyState };
export const dashboardSurveys: Survey[] = [
  { id: 1, topic: 'Shopping Habits', icon: 'u2-cart', time: 8, reward: 1.2, xp: 60, state: 'rec' },
  { id: 2, topic: 'Consumer Technology', icon: 'u1-gaming', time: 10, reward: 1.5, xp: 70, state: 'rec' },
];
export const allSurveys: Survey[] = [
  { id: 1, topic: 'Shopping Habits', icon: 'u2-cart', time: 8, reward: 1.2, xp: 60, state: 'rec' },
  { id: 2, topic: 'Consumer Technology', icon: 'u1-gaming', time: 10, reward: 1.5, xp: 70, state: 'rec' },
  { id: 3, topic: 'Travel & Holidays', icon: 'n-map', time: 12, reward: 1.8, xp: 80, state: 'closing' },
  { id: 4, topic: 'Streaming & Media', icon: 'u1-music', time: 6, reward: 0.9, xp: 45, state: 'avail' },
  { id: 5, topic: 'Banking Services', icon: 'u2-money', time: 9, reward: 1.4, xp: 65, state: 'quota' },
  { id: 6, topic: 'Health & Wellbeing', icon: 'u1-health', time: 11, reward: 1.6, xp: 75, state: 'screen' },
  { id: 7, topic: 'Grocery Shopping', icon: 'u1-cooking', time: 7, reward: 1.1, xp: 55, state: 'pending' },
  { id: 8, topic: 'Automotive', icon: 'u1-car', time: 10, reward: 1.5, xp: 70, state: 'done' },
];
export const surveyFilters = ['All', 'Short surveys', 'Highest reward', 'Closing soon', 'Recommended'];
export const surveyStateMeta: Record<SurveyState, { label: string; fg: string; bg: string }> = {
  rec: { label: 'Recommended for you', fg: '#336666', bg: '#E8F3F3' },
  closing: { label: 'Closing soon', fg: '#B4541E', bg: '#FCE9DD' },
  avail: { label: 'Available', fg: '#8a6d12', bg: '#FFF4CC' },
  quota: { label: 'Quota full', fg: '#98A2B3', bg: '#F1F2EE' },
  screen: { label: 'Not a match', fg: '#98A2B3', bg: '#F1F2EE' },
  pending: { label: 'Reward pending', fg: '#B4801E', bg: '#FBF1D8' },
  done: { label: 'Completed', fg: '#22A06B', bg: '#E7F6EF' },
};

export type Badge = { icon: string; label: string; earned: boolean };
export const badges: Badge[] = [
  { icon: 'u2-money', label: 'First reward', earned: true },
  { icon: 'r2-cool', label: '7-day streak', earned: true },
  { icon: 'u1-search', label: 'Explorer', earned: true },
  { icon: 'r1-celebrate', label: 'Level 5', earned: false },
  { icon: 'u2-gift', label: '€100 club', earned: false },
  { icon: 'u1-share', label: 'Survey pro', earned: false },
];

export type ProfileCategory = { name: string; pct: number; time: string };
export const profileCategories: ProfileCategory[] = [
  { name: 'Basic information', pct: 100, time: '#' },
  { name: 'Household', pct: 80, time: '2 min' },
  { name: 'Work & Education', pct: 60, time: '3 min' },
  { name: 'Technology', pct: 60, time: '3 min' },
  { name: 'Shopping', pct: 90, time: '1 min' },
  { name: 'Travel', pct: 40, time: '4 min' },
  { name: 'Media', pct: 70, time: '2 min' },
  { name: 'Health', pct: 0, time: '5 min' },
  { name: 'Finance', pct: 20, time: '4 min' },
  { name: 'Automotive', pct: 0, time: '3 min' },
  { name: 'Children & Family', pct: 50, time: '3 min' },
  { name: 'Lifestyle', pct: 85, time: '2 min' },
];
export const profileCompletion = 72;

// Recent wallet activity: [when, label, amount, xp, status, fg, bg]
export const recentActivity: [string, string, string, string, string, string, string][] = [
  ['Today', 'Consumer Technology', '+€1.50', '+70 XP', 'Approved', '#22A06B', '#E7F6EF'],
  ['Yesterday', 'Daily check-in', '+1 🎟', '+20 XP', 'Done', '#336666', '#E8F3F3'],
  ['Jun 8', 'PayPal redemption', '−€10.00', '', 'Redeemed', '#336666', '#E8F3F3'],
  ['Jun 5', 'Shopping Habits', '+€1.20', '+60 XP', 'Approved', '#22A06B', '#E7F6EF'],
];

export const rewardMethods: { icon: string; name: string; desc: string }[] = [
  { icon: 'u2-money', name: 'PayPal', desc: 'Cash payout' },
  { icon: 'u2-gift', name: 'Gift cards', desc: '20+ brands' }, // PLACEHOLDER: real catalogue per country
  { icon: 'u2-calculator', name: 'Bank', desc: 'SEPA transfer' },
  { icon: 'n-heart', name: 'Charity', desc: 'Donate balance' },
];

// Community
export const communityStats: { icon: string; value: string; label: string }[] = [
  { icon: 'u2-pets', value: '12,400', label: 'members active this month' },
  { icon: 'u1-share', value: '42,000', label: 'surveys completed' },
  { icon: 'u2-gift', value: '18,500', label: 'rewards redeemed' },
];
// PLACEHOLDER (business-critical): real draw date + prize pool.
export const draw = { date: 'Jun 30', prize: '€250 prize pool' };
export const pollOptions: [string, number][] = [
  ['Gift cards', 46],
  ['PayPal cash', 34],
  ['Bank transfer', 12],
  ['Charity', 8],
];
export const pollQuestion = 'What’s your favourite way to get rewarded?';
export const memberTips: [string, string][] = [
  ['Complete your profile', 'Better data means better-matched surveys.'],
  ['Answer honestly', 'Consistent answers keep your account in good standing.'],
  ['Check in daily', 'A streak earns bonus tickets and XP.'],
];
export const announcements: [string, string, string][] = [
  ['New reward: Amazon gift cards', 'Now available in 12 more countries.', '2 days ago'],
  ['Faster reward approvals', 'Most rewards now verified within 48h.', '1 week ago'],
  ['Scheduled maintenance', 'Jun 20, 02:00–04:00 UTC.', '1 week ago'],
];

// Referrals
export const referralSteps: [string, string][] = [
  ['Invited', 'Friend received your link'],
  ['Joined', 'Created their account'],
  ['Profile completed', 'Finished onboarding'],
  ['First survey', 'Completed a survey'],
  ['Reward approved', 'You both earn €5'], // PLACEHOLDER (business-critical): confirm reward
];
export const referralFriends: [string, string, number][] = [
  ['Maria P.', 'Reward approved', 4],
  ['Jonas K.', 'First survey', 3],
  ['Lena R.', 'Profile completed', 2],
  ['Sam D.', 'Joined', 1],
  ['Ahmed F.', 'Invited', 0],
];
export const referralStats: [string, string][] = [
  ['3', 'friends joined'],
  ['1', 'reward approved'],
  ['€5', 'earned so far'],
];

// Help center
export const helpCategories: [string, string, string][] = [
  ['u1-work', 'Account', 'Login, profile, deletion'],
  ['u1-share', 'Surveys', 'Matching, screen-outs, quotas'],
  ['u2-gift', 'Rewards', 'Balance, payouts, timing'],
  ['u2-shield', 'Privacy', 'Data, GDPR, consent'],
  ['u2-gear', 'Technical', 'Bugs and device issues'],
  ['n-headphones', 'Contact', 'Reach our support team'],
];
export const helpTopics = ['Topic: Rewards', 'Topic: Surveys', 'Topic: Account', 'Topic: Privacy', 'Topic: Technical'];
export const helpTickets: [string, string, string, string, string][] = [
  ['#48213', 'Reward not received', 'Resolved', '#22A06B', '#E7F6EF'],
  ['#48118', 'Survey kept loading', 'In progress', '#8a6d12', '#FFF4CC'],
];

// Settings
export const notificationToggles: { key: string; label: string; sub: string; on: boolean }[] = [
  { key: 'surveys', label: 'New surveys', sub: 'Get notified when a survey matches you', on: true },
  { key: 'rewards', label: 'Reward updates', sub: 'Approvals, redemptions and payouts', on: true },
  { key: 'profile', label: 'Profile reminders', sub: 'Nudges to complete profile sections', on: true },
  { key: 'draws', label: 'Community draws', sub: 'Draw entries and results', on: false },
  { key: 'updates', label: 'Product updates', sub: 'New features and announcements', on: false },
];

// Onboarding
export const onboardingSteps: [string, string, string][] = [
  ['u1-share', 'Take surveys', 'Matched to your profile and country'],
  ['u2-target', 'Complete quests', 'Earn XP, level up and collect badges'],
  ['u2-gift', 'Redeem rewards', 'Cash out from just €10 — PayPal, gift cards & more'],
];
