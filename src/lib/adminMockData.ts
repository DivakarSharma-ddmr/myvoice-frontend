/**
 * ============================================================================
 *  MyVoice ADMIN — MOCK DATA (single swappable source)
 * ============================================================================
 *  This is the ONE file the dev team replaces with real API calls for the
 *  panel-admin console (mirrors the member platform's mockData.ts).
 *
 *  Every admin screen reads its content from `seed` / `PANELS`, and every
 *  button routes through AdminProvider's actions — so wiring the backend
 *  (Node.js + Laravel + MongoDB) means swapping this data layer and the
 *  bodies of those actions, NOT rebuilding any UI.
 *
 *  ⚠️  All values here are MOCK. Timestamps are fixed string literals (never
 *      `new Date()` at module scope) to avoid static-export hydration drift.
 *      Table TOTALS are faked so pagination footers read like the legacy admin.
 * ============================================================================
 */

/* -------------------------------- TYPES --------------------------------- */

export type Panel = { id: string; name: string; alias: string; memberCount: number };

export type AdminUser = {
  panelistId: string;
  firstName: string;
  lastName: string;
  email: string;
  status: 'active' | 'inactive' | 'unsubscribed';
};

export type Member = {
  id: number;
  email: string;
  gender: 'Male' | 'Female';
  birthYear: number;
  postalCode: string;
  status: 'active' | 'sleeping' | 'unsubscribed' | 'inactive';
  country: string;
};

export type MemberReward = {
  id: string;
  reward: string;
  memberId: number;
  email: string;
  value: number;
  status: 'pending' | 'approved' | 'rejected' | 'onhold';
  date: string;
  country: string;
};

export type CatalogueReward = {
  id: string;
  name: string;
  value: number;
  description: string;
  status: 'active' | 'inactive';
};

export type EmailTemplate = {
  id: string;
  name: string;
  group: 'admin' | 'member';
  subject: string;
  body: string;
};

export type CampaignStat = {
  campaignId: string;
  subject: string;
  recipients: number;
  opens: number;
  clicks: number;
  unsubscribes: number;
};

export type Campaign = {
  id: number;
  name: string;
  subject: string;
  created: string;
  sent: string;
  status: 'complete' | 'draft';
  language: string;
  stats: CampaignStat[];
};

export type ReportRow = {
  id: string;
  name: string;
  status: 'complete';
  createdAt: string;
};

export type RecruitmentSource = {
  id: string;
  name: string;
  status: 'active' | 'inactive';
  trigger: 'SOI (Registration)' | 'DOI (Email Verification)' | '';
};

export type ChatMessage = { from: 'admin' | 'member'; text: string; time: string };

export type MessageThread = {
  id: string;
  name: string;
  panel: string;
  panelistId: string;
  email: string;
  preview: string;
  date: string;
  messages: ChatMessage[];
};

export type PanelSettings = {
  panelName: string;
  panelAlias: string;
  contactEmail: string;
  referralReward: number;
  postalCodeNote: string;
  languages: string[];
  cintCurrency: string;
  myvoiceCurrency: string;
  rewardsAvailability: string;
  minRedemption: number;
  rewardsInfoHtml: string;
};

export type PaymentEmailSettings = { email: string; additionalEmail: string };

export type AdminProfile = {
  firstName: string;
  lastName: string;
  mobile: string;
  gender: 'Male' | 'Female';
  dob: string;
  address: string;
  postalCode: string;
};

export type DashboardStats = {
  pendingRewards: number;
  cintCompleted: number;
  myvoiceCompleted: number;
  emailInviteCompleted: number;
  recruitment: {
    source: string;
    hits: string;
    registered: string;
    verified: string;
    conversion: string;
  }[];
  recentRewards: { date: string; value: number; status: string }[];
};

/* -------------------------------- PANELS -------------------------------- */
// Counts shown in the Email Tool screenshot are used where known; the rest
// are plausible fixed values. `ro` (Romania Panel) is the default context.
export const PANELS: Panel[] = [
  { id: 'al', name: 'Albania Panel', alias: 'alpanel', memberCount: 211 },
  { id: 'dz', name: 'Algeria Panel', alias: 'dzpanel', memberCount: 2103 },
  { id: 'ao', name: 'Angola Panel', alias: 'aopanel', memberCount: 45 },
  { id: 'ar', name: 'Argentina Panel', alias: 'arpanel', memberCount: 1429 },
  { id: 'au', name: 'Australia Panel', alias: 'aupanel', memberCount: 836 },
  { id: 'at', name: 'Austria Panel', alias: 'atpanel', memberCount: 166 },
  { id: 'bh', name: 'Bahrain Panel', alias: 'bhpanel', memberCount: 0 },
  { id: 'be', name: 'Belgium Panel', alias: 'bepanel', memberCount: 742 },
  { id: 'br', name: 'Brazil Panel', alias: 'brpanel', memberCount: 3288 },
  { id: 'bg', name: 'Bulgaria Panel', alias: 'bgpanel', memberCount: 690 },
  { id: 'ca', name: 'Canada Panel', alias: 'capanel', memberCount: 1512 },
  { id: 'cz', name: 'Czechia Panel', alias: 'czpanel', memberCount: 604 },
  { id: 'dk', name: 'Denmark Panel', alias: 'dkpanel', memberCount: 388 },
  { id: 'eg', name: 'Egypt Panel', alias: 'egpanel', memberCount: 2760 },
  { id: 'fi', name: 'Finland Panel', alias: 'fipanel', memberCount: 321 },
  { id: 'fr', name: 'France Panel', alias: 'frpanel', memberCount: 2890 },
  { id: 'de', name: 'Germany Panel', alias: 'depanel', memberCount: 4102 },
  { id: 'gr', name: 'Greece Panel', alias: 'grpanel', memberCount: 815 },
  { id: 'hu', name: 'Hungary Panel', alias: 'hupanel', memberCount: 733 },
  { id: 'in', name: 'India Panel', alias: 'inpanel', memberCount: 5121 },
  { id: 'id', name: 'Indonesia Panel', alias: 'idpanel', memberCount: 4360 },
  { id: 'it', name: 'Italy Panel', alias: 'itpanel', memberCount: 2611 },
  { id: 'nl', name: 'Netherlands Panel', alias: 'nlpanel', memberCount: 1044 },
  { id: 'pl', name: 'Poland Panel', alias: 'plpanel', memberCount: 1877 },
  { id: 'pt', name: 'Portugal Panel', alias: 'ptpanel', memberCount: 690 },
  { id: 'ro', name: 'Romania Panel', alias: 'ropanel', memberCount: 87696 },
  { id: 'sa', name: 'Saudi Arabia Panel', alias: 'sapanel', memberCount: 1980 },
  { id: 'rs', name: 'Serbia Panel', alias: 'rspanel', memberCount: 512 },
  { id: 'sk', name: 'Slovakia Panel', alias: 'skpanel', memberCount: 430 },
  { id: 'si', name: 'Slovenia Panel', alias: 'sipanel', memberCount: 288 },
  { id: 'es', name: 'Spain Panel', alias: 'espanel', memberCount: 3120 },
  { id: 'se', name: 'Sweden Panel', alias: 'sepanel', memberCount: 701 },
  { id: 'th', name: 'Thailand Panel', alias: 'thpanel', memberCount: 2240 },
  { id: 'tr', name: 'Turkey Panel', alias: 'trpanel', memberCount: 3980 },
  { id: 'gb', name: 'UK Panel', alias: 'gbpanel', memberCount: 4550 },
  { id: 'us', name: 'USA Panel', alias: 'uspanel', memberCount: 6210 },
  { id: 'vn', name: 'Vietnam Panel', alias: 'vnpanel', memberCount: 6224 },
];

export const DEFAULT_PANEL_ID = 'ro';

/* ----------------------------- ACCESS CONTROL --------------------------- */
const adminUsers: AdminUser[] = [
  { panelistId: '9999999999', firstName: 'MyVoice', lastName: '', email: 'techdev@datadiggers-mr.com', status: 'active' },
  { panelistId: '2046433', firstName: 'Gabriela', lastName: 'Tudor', email: 'gabriela.tudor@datadiggers-mr.com', status: 'inactive' },
  { panelistId: '2046432', firstName: 'Laurentiu', lastName: 'Petrea', email: 'laurentiu.petrea@datadiggers-mr.com', status: 'unsubscribed' },
  { panelistId: '2025952', firstName: 'gaurav', lastName: 'khandelwal', email: 'lavish.ongraph@gmail.com', status: 'active' },
  { panelistId: '2019261', firstName: 'daniela', lastName: 'cojocaru', email: 'daniela.cojocaru@datadiggers-mr.com', status: 'unsubscribed' },
  { panelistId: '1978640', firstName: 'Elena', lastName: 'Mihai', email: 'elena.mihai@datadiggers-mr.com', status: 'inactive' },
  { panelistId: '1978236', firstName: 'Miruna', lastName: 'Puscasu', email: 'miruna.puscasu@datadiggers-mr.com', status: 'unsubscribed' },
  { panelistId: '1968253', firstName: 'Alex', lastName: 'Timbus', email: 'alex.timbus@datadiggers-mr.com', status: 'inactive' },
  { panelistId: '1478258', firstName: 'Luana', lastName: 'Musi', email: 'luana.musi@datadiggers-mr.com', status: 'unsubscribed' },
  { panelistId: '1356930', firstName: 'Loredana', lastName: 'Szollosi', email: 'loredana.szollosi@datadiggers-mr.com', status: 'active' },
  { panelistId: '1263852', firstName: 'Dan', lastName: 'Deaconescu', email: 'dan.deaconescu@datadiggers-mr.com', status: 'inactive' },
  { panelistId: '1263393', firstName: 'Elena', lastName: 'Dumitrescu', email: 'elena.dumitrescu@datadiggers-mr.com', status: 'active' },
  { panelistId: '199532', firstName: 'Ruchi', lastName: 'Singh', email: 'ruchi.singh@datadiggers-mr.com', status: 'inactive' },
  { panelistId: '3832', firstName: 'George', lastName: 'Ganea', email: 'george.ganea@datadiggers-mr.com', status: 'active' },
];

/* -------------------------------- MEMBERS ------------------------------- */
// A deterministic generator (no randomness, no time) builds a believable page
// of members. The first rows match the Members screenshot exactly.
const FIRST_MEMBERS: Member[] = [
  { id: 34, email: 'bhartianshul916@gmail.com', gender: 'Male', birthYear: 1997, postalCode: '201001', status: 'active', country: 'Romania Panel' },
  { id: 75, email: 'simplyvab@gmail.com', gender: 'Male', birthYear: 1990, postalCode: '305802', status: 'active', country: 'Romania Panel' },
  { id: 800015, email: 'dunose.elena@yahoo.com', gender: 'Female', birthYear: 1986, postalCode: '023341', status: 'active', country: 'Romania Panel' },
  { id: 199942, email: 'paula.paslaru@datadiggers-mr.com', gender: 'Female', birthYear: 1980, postalCode: '060989', status: 'active', country: 'Romania Panel' },
  { id: 199943, email: 'v.handro@gmail.com', gender: 'Male', birthYear: 1974, postalCode: '300681', status: 'active', country: 'Romania Panel' },
  { id: 199944, email: 'lucicasuliuc@yahoo.com', gender: 'Female', birthYear: 1949, postalCode: '710100', status: 'active', country: 'Romania Panel' },
  { id: 199945, email: 'denysadryan@gmail.com', gender: 'Male', birthYear: 1989, postalCode: '307046', status: 'sleeping', country: 'Romania Panel' },
  { id: 199946, email: 'maximilian_05@yahoo.com', gender: 'Male', birthYear: 1977, postalCode: '720256', status: 'active', country: 'Romania Panel' },
  { id: 199947, email: 'danutrotaru@ymail.com', gender: 'Male', birthYear: 1965, postalCode: '217237', status: 'unsubscribed', country: 'Romania Panel' },
  { id: 199948, email: 'mihai.modrea@gmail.com', gender: 'Male', birthYear: 1963, postalCode: '140032', status: 'active', country: 'Romania Panel' },
];

const M_FIRST = ['Andrei', 'Maria', 'Ion', 'Elena', 'Mihai', 'Ana', 'George', 'Ioana', 'Cristian', 'Gabriela', 'Vlad', 'Diana', 'Radu', 'Alina', 'Bogdan', 'Roxana'];
const M_LAST = ['Popescu', 'Ionescu', 'Radu', 'Dumitru', 'Stan', 'Gheorghe', 'Marin', 'Dinu', 'Barbu', 'Nistor', 'Florea', 'Toma', 'Serban', 'Voicu', 'Iancu', 'Cojocaru'];
const M_DOMAIN = ['gmail.com', 'yahoo.com', 'ymail.com', 'outlook.com'];
const M_STATUS: Member['status'][] = ['active', 'active', 'active', 'sleeping', 'unsubscribed', 'inactive'];

function buildMembers(): Member[] {
  const rows: Member[] = [...FIRST_MEMBERS];
  for (let i = 0; i < 110; i++) {
    const f = M_FIRST[i % M_FIRST.length];
    const l = M_LAST[(i * 3) % M_LAST.length];
    rows.push({
      id: 200000 + i,
      email: `${f.toLowerCase()}.${l.toLowerCase()}${i}@${M_DOMAIN[i % M_DOMAIN.length]}`,
      gender: i % 2 === 0 ? 'Male' : 'Female',
      birthYear: 1955 + ((i * 7) % 50),
      postalCode: String(100000 + ((i * 4637) % 800000)).padStart(6, '0'),
      status: M_STATUS[i % M_STATUS.length],
      country: 'Romania Panel',
    });
  }
  return rows;
}

/* ----------------------------- MEMBER REWARDS --------------------------- */
const memberRewards: MemberReward[] = [
  { id: 'mr-1', reward: 'PayPal', memberId: 214520, email: 'ciprian.ghinda@gmail.com', value: 10, status: 'pending', date: '2026-07-29 10:41:34', country: 'Romania Panel' },
  { id: 'mr-2', reward: 'PayPal', memberId: 1391936, email: 'florariacalina@yahoo.com', value: 10, status: 'approved', date: '2026-07-26 04:12:07', country: 'Romania Panel' },
  { id: 'mr-3', reward: 'PayPal', memberId: 200112, email: 'lucica_braila@yahoo.com', value: 10, status: 'approved', date: '2026-07-23 06:06:36', country: 'Romania Panel' },
  { id: 'mr-4', reward: 'PayPal', memberId: 1683583, email: 'romy_rafaila@yahoo.com', value: 10, status: 'approved', date: '2026-07-22 16:08:29', country: 'Romania Panel' },
  { id: 'mr-5', reward: 'Wise', memberId: 1492440, email: 'aurelian_spinu@yahoo.com', value: 15, status: 'approved', date: '2026-07-21 12:13:06', country: 'Romania Panel' },
  { id: 'mr-6', reward: 'PayPal', memberId: 1420509, email: 'cristinacristea68@yahoo.com', value: 10, status: 'approved', date: '2026-07-21 09:02:13', country: 'Romania Panel' },
  { id: 'mr-7', reward: 'PayPal', memberId: 1366007, email: 'barbuelena_80@yahoo.com', value: 10, status: 'approved', date: '2026-07-21 08:58:44', country: 'Romania Panel' },
  { id: 'mr-8', reward: 'PayPal', memberId: 1412382, email: 'miha_mihutza74@yahoo.com', value: 10, status: 'approved', date: '2026-07-21 08:37:24', country: 'Romania Panel' },
  { id: 'mr-9', reward: 'PayPal', memberId: 1393221, email: 'vladcorina86@yahoo.com', value: 10, status: 'approved', date: '2026-07-21 08:11:54', country: 'Romania Panel' },
  { id: 'mr-10', reward: 'PayPal', memberId: 1409281, email: 'cristian.prundeanu@yahoo.com', value: 10, status: 'approved', date: '2026-07-21 08:04:46', country: 'Romania Panel' },
  { id: 'mr-11', reward: 'Amazon e-Card', memberId: 1502993, email: 'ionela.grigore@gmail.com', value: 20, status: 'pending', date: '2026-07-20 19:22:10', country: 'Romania Panel' },
  { id: 'mr-12', reward: 'Revolut', memberId: 1487221, email: 'mircea.dobre@yahoo.com', value: 10, status: 'onhold', date: '2026-07-20 15:03:41', country: 'Romania Panel' },
  { id: 'mr-13', reward: 'PayPal', memberId: 1477654, email: 'raluca.stanescu@gmail.com', value: 15, status: 'pending', date: '2026-07-20 11:47:58', country: 'Romania Panel' },
  { id: 'mr-14', reward: 'Wise', memberId: 1466098, email: 'daniel.voinea@yahoo.com', value: 30, status: 'rejected', date: '2026-07-19 22:12:33', country: 'Romania Panel' },
  { id: 'mr-15', reward: 'Amazon e-Card', memberId: 1455320, email: 'oana.marinescu@gmail.com', value: 10, status: 'approved', date: '2026-07-19 18:40:05', country: 'Romania Panel' },
  { id: 'mr-16', reward: 'PayPal', memberId: 1444871, email: 'sorin.pop@yahoo.com', value: 10, status: 'pending', date: '2026-07-19 09:15:27', country: 'Romania Panel' },
  { id: 'mr-17', reward: 'GoGift global gift card', memberId: 1433002, email: 'adriana.lupu@gmail.com', value: 10, status: 'pending', date: '2026-07-18 20:55:19', country: 'Romania Panel' },
  { id: 'mr-18', reward: 'PayPal', memberId: 1422118, email: 'florin.ilie@yahoo.com', value: 20, status: 'approved', date: '2026-07-18 14:31:44', country: 'Romania Panel' },
  { id: 'mr-19', reward: 'Neteller', memberId: 1411567, email: 'camelia.dumitrache@gmail.com', value: 10, status: 'onhold', date: '2026-07-18 10:08:52', country: 'Romania Panel' },
  { id: 'mr-20', reward: 'PayPal', memberId: 1400984, email: 'gabriel.tanase@yahoo.com', value: 15, status: 'pending', date: '2026-07-17 23:41:16', country: 'Romania Panel' },
];

/* --------------------------- REWARDS CATALOGUE -------------------------- */
const catalogue: CatalogueReward[] = [
  { id: 'cat-1', name: 'Amazon e-Card', value: 10, description: 'Comandat de pe amazon.de', status: 'active' },
  { id: 'cat-2', name: 'Amazon e-Card', value: 20, description: 'Comandat de pe amazon.de', status: 'active' },
  { id: 'cat-3', name: 'Amazon e-Card', value: 15, description: 'Comandat de pe amazon.de', status: 'active' },
  { id: 'cat-4', name: 'Amazon e-Card', value: 30, description: 'Comandat de pe amazon.de', status: 'active' },
  { id: 'cat-5', name: 'Donație către "Câini de Salvare București"', value: 10, description: 'ONG dedicată salvării de vieți omenești cu ajutorul câinilor special antrenați pentru misiuni de căutare. https://cainisalvatori.ro/', status: 'active' },
  { id: 'cat-6', name: 'GoGift global gift card', value: 10, description: 'Can be redeemed for any vouchers from this list, directly on the GoGift website: https://gogift.io/en/ro/ron/display-catalog', status: 'active' },
  { id: 'cat-7', name: 'Neteller', value: 10, description: '', status: 'active' },
  { id: 'cat-8', name: 'PayPal', value: 10, description: '', status: 'active' },
  { id: 'cat-9', name: 'PayPal', value: 20, description: '', status: 'active' },
  { id: 'cat-10', name: 'PayPal', value: 15, description: '', status: 'active' },
  { id: 'cat-11', name: 'PayPal', value: 30, description: '', status: 'active' },
  { id: 'cat-12', name: 'Payoneer', value: 20, description: 'Sign-up to PAYONEER is required', status: 'active' },
  { id: 'cat-13', name: 'Red Cross Donation', value: 10, description: 'Alegând această opțiune, donați banii dvs. Crucii Roșii. Vom face plăți trimestriale către Crucea Roșie.', status: 'inactive' },
  { id: 'cat-14', name: 'Red Cross Donation', value: 10, description: 'Alegând această opțiune, donați banii dvs. Crucii Roșii. Vom face plăți trimestriale către Crucea Roșie.', status: 'inactive' },
  { id: 'cat-15', name: 'Revolut', value: 10, description: 'To be able to send you the money, we need the following information: Revolut IBAN and BIC, First name, Last name and Postal address.', status: 'active' },
  { id: 'cat-16', name: 'Revolut', value: 20, description: 'To be able to send you the money, we need the following information: Revolut IBAN and BIC, First name, Last name and Postal address.', status: 'active' },
  { id: 'cat-17', name: 'Skrill', value: 10, description: '', status: 'inactive' },
  { id: 'cat-18', name: 'Skrill', value: 20, description: '', status: 'inactive' },
  { id: 'cat-19', name: 'Skrill', value: 30, description: '', status: 'inactive' },
  { id: 'cat-20', name: 'Skrill', value: 15, description: '', status: 'inactive' },
  { id: 'cat-21', name: 'Skrill', value: 30, description: '', status: 'inactive' },
  { id: 'cat-22', name: 'TREMENDOUS', value: 30, description: 'Redeem for any option from the website: https://www.tremendous.com/catalog/', status: 'active' },
  { id: 'cat-23', name: 'Wise', value: 10, description: '', status: 'active' },
  { id: 'cat-24', name: 'Wise', value: 20, description: '', status: 'active' },
  { id: 'cat-25', name: 'Wise', value: 15, description: '', status: 'active' },
  { id: 'cat-26', name: 'Wise', value: 30, description: '', status: 'active' },
  { id: 'cat-27', name: 'Xoom', value: 30, description: 'Îți trimitem banii direct în contul tău bancar. Dar e nevoie să validăm numele, numele băncii și IBAN-ul.', status: 'active' },
];

/* --------------------------- EMAIL TEMPLATES ---------------------------- */
const REDEMPTION_BODY = `<div style="text-align:center">
  <p>You have a new redemption request.</p>
  <p>Here are the details:</p>
  <p>Member Id: %%panelist_id%%</p>
  <p>First Name: %%first_name%%</p>
  <p>Email: %%email%%</p>
  <p>PayPal Email: %%paypal_email%%</p>
</div>`;

const templates: EmailTemplate[] = [
  { id: 'tpl-1', name: 'Rewards Redemption Email [Admin]', group: 'admin', subject: 'Rewards Redemption Email [Admin]', body: REDEMPTION_BODY },
  { id: 'tpl-2', name: 'Member Feedback Email [Admin]', group: 'admin', subject: 'Member Feedback Received', body: '<p>A member left feedback on %%PANEL_NAME%%.</p>' },
  { id: 'tpl-3', name: 'Password Reset Email', group: 'member', subject: 'Reset your MyVoice password', body: '<p>Hi %%first_name%%, click the link to reset your password.</p>' },
  { id: 'tpl-4', name: 'Signup Confirmation Email', group: 'member', subject: 'Confirm your MyVoice account', body: '<p>Welcome %%first_name%% — please confirm your email.</p>' },
  { id: 'tpl-5', name: 'Refer Friend Invitation Email', group: 'member', subject: 'Your friend invited you to MyVoice', body: '<p>You were invited to join %%PANEL_NAME%%.</p>' },
  { id: 'tpl-6', name: 'Password Update Email', group: 'member', subject: 'Your password was updated', body: '<p>Hi %%first_name%%, your password was changed.</p>' },
  { id: 'tpl-7', name: 'Signup Welcome Email', group: 'member', subject: 'Welcome to MyVoice!', body: '<p>Welcome aboard, %%first_name%%.</p>' },
  { id: 'tpl-8', name: 'Invitation to MyVoice Email', group: 'member', subject: 'Join MyVoice %%PANEL_NAME%%', body: '<p>Make your voice heard and get rewarded.</p>' },
  { id: 'tpl-9', name: 'Refer Friend Reminder Email', group: 'member', subject: 'Reminder: invite your friends', body: '<p>Invite friends and earn a referral reward.</p>' },
  { id: 'tpl-10', name: 'Account Deleted Email', group: 'member', subject: 'Your MyVoice account was deleted', body: '<p>Your account has been deleted as requested.</p>' },
  { id: 'tpl-11', name: 'Suspicious Activity Email', group: 'member', subject: 'Suspicious activity on your account', body: '<p>We noticed unusual activity, %%first_name%%.</p>' },
  { id: 'tpl-12', name: 'Mark Fraud Panelist to Inactive Email', group: 'admin', subject: 'Panelist marked inactive (fraud)', body: '<p>Panelist %%panelist_id%% was marked inactive.</p>' },
  { id: 'tpl-13', name: 'Inactive by Correction Points Alert', group: 'admin', subject: 'Panelist inactive by correction points', body: '<p>Panelist %%panelist_id%% reached the correction-point limit.</p>' },
  { id: 'tpl-14', name: 'First Profile Question Reminder', group: 'member', subject: 'Complete your profile', body: '<p>Finish your profile to unlock more surveys.</p>' },
  { id: 'tpl-15', name: 'Second Profile Question Reminder', group: 'member', subject: 'One more reminder: complete your profile', body: '<p>You are almost there, %%first_name%%.</p>' },
  { id: 'tpl-16', name: 'Refer Friend Invitation Email', group: 'member', subject: 'A friend wants you on MyVoice', body: '<p>Join %%PANEL_NAME%% today.</p>' },
];

export const EMAIL_TAGS: { token: string; label: string }[] = [
  { token: '%%panelist_id%%', label: 'Member Id' },
  { token: '%%first_name%%', label: 'First Name' },
  { token: '%%last_name%%', label: 'Last Name' },
  { token: '%%email%%', label: 'Email' },
  { token: '%%paypal_email%%', label: 'PayPal Email' },
  { token: '%%PANEL_NAME%%', label: 'Panel Name' },
];

/* ------------------------------- CAMPAIGNS ------------------------------ */
const CAMPAIGN_LANGS = ['Vietnamese', 'Urdu', 'Turkish', 'Swedish', 'Thai', 'Spanish EUR', 'Spanish USD', 'Slovenian', 'Slovak 2', 'Slovak', 'Romanian', 'Polish'];
function buildCampaigns(): Campaign[] {
  return CAMPAIGN_LANGS.map((lang, i) => {
    const id = 3479 - i;
    return {
      id,
      name: `MV Iul 26 - ${lang}`,
      subject: `MV Iul 26 - ${lang}`,
      created: `2026-07-09 13:${String(23 - i).padStart(2, '0')}:13`,
      sent: `2026-07-09 13:${String(50 - i).padStart(2, '0')}:45`,
      status: 'complete',
      language: lang,
      stats: [
        { campaignId: `39911714${4 + i}`, subject: `Complete your profile — ${lang}`, recipients: 1, opens: 0, clicks: 0, unsubscribes: 0 },
        { campaignId: `39911715${5 + i}`, subject: `Complete your profile — ${lang}`, recipients: 6224 - i * 37, opens: 55 - i, clicks: 16 - (i % 5), unsubscribes: i % 3 },
      ],
    };
  });
}

/* -------------------------------- REPORTS ------------------------------- */
const reports: ReportRow[] = [
  { id: 'rep-1', name: 'Multiple_Panels_Recruitment_2026-06-08_08:51:00', status: 'complete', createdAt: '2026-06-08 08:51:00' },
  { id: 'rep-2', name: 'UKPanel_Recruitment_2026-06-08_08:27:05', status: 'complete', createdAt: '2026-06-08 08:27:05' },
  { id: 'rep-3', name: 'UKPanel_Report_2026-06-08_08:24:48', status: 'complete', createdAt: '2026-06-08 08:24:48' },
  { id: 'rep-4', name: 'Multiple_Panels_Statistics_2026-06-08_07:50:08', status: 'complete', createdAt: '2026-06-08 07:50:08' },
  { id: 'rep-5', name: 'Multiple_Panels_Statistics_2026-06-08_07:45:05', status: 'complete', createdAt: '2026-06-08 07:45:05' },
  { id: 'rep-6', name: 'Multiple_Panels_Statistics_2026-06-08_07:37:40', status: 'complete', createdAt: '2026-06-08 07:37:40' },
  { id: 'rep-7', name: 'Multiple_Panels_Statistics_2026-06-08_07:29:30', status: 'complete', createdAt: '2026-06-08 07:29:30' },
  { id: 'rep-8', name: 'Multiple_Panels_Statistics_2026-06-08_07:08:22', status: 'complete', createdAt: '2026-06-08 07:08:22' },
  { id: 'rep-9', name: 'Multiple_Panels_Statistics_2026-06-08_06:34:32', status: 'complete', createdAt: '2026-06-08 06:34:32' },
  { id: 'rep-10', name: 'Multiple_Panels_Statistics_2026-06-08_06:24:50', status: 'complete', createdAt: '2026-06-08 06:24:50' },
  { id: 'rep-11', name: 'RomaniaPanel_Report_2026-06-07_18:12:00', status: 'complete', createdAt: '2026-06-07 18:12:00' },
  { id: 'rep-12', name: 'RomaniaPanel_Statistics_2026-06-07_17:40:11', status: 'complete', createdAt: '2026-06-07 17:40:11' },
];

/* ------------------------------ RECRUITMENT ----------------------------- */
const recruitment: RecruitmentSource[] = [
  { id: 'rec-1', name: 'Google', status: 'active', trigger: 'SOI (Registration)' },
  { id: 'rec-2', name: 'MVFinItaly', status: 'inactive', trigger: '' },
  { id: 'rec-3', name: 'Facebook', status: 'inactive', trigger: '' },
  { id: 'rec-4', name: 'MVFinUSA', status: 'active', trigger: 'DOI (Email Verification)' },
  { id: 'rec-5', name: 'ongraph', status: 'inactive', trigger: '' },
  { id: 'rec-6', name: 'Testing', status: 'active', trigger: '' },
  { id: 'rec-7', name: 'TORO', status: 'inactive', trigger: '' },
  { id: 'rec-8', name: 'MVFinGermany', status: 'inactive', trigger: '' },
  { id: 'rec-9', name: 'AdGateMedia', status: 'inactive', trigger: '' },
  { id: 'rec-10', name: 'MaxBounty', status: 'inactive', trigger: '' },
];

/* ------------------------------- MESSAGES ------------------------------- */
const CANNED_EN = `Hello again,

If these surveys do not appear complete in your panel account, then it means that you have not managed to qualify for them and receive your reward.

But please stay active on our panel, there will certainly be enough opportunities for you to qualify and receive your reward.

Have a nice day!

Do you have any more questions? Check our FAQ page: myvoice-surveys.com/panelist/faq`;

const threads: MessageThread[] = [
  { id: 'th-1', name: 'Çetin Kurt', panel: 'Turkey Panel', panelistId: '1138655', email: 'strateji21@hotmail.com', preview: 'Tekrar merhaba, Eğer bu anketler panel hesabınızda tamamlanmış…', date: '30 Jul (UTC)', messages: [
    { from: 'member', text: 'Merhaba, anketlerim tamamlandı görünmüyor.', time: '06:40 AM | 30 Jul (UTC)' },
    { from: 'admin', text: CANNED_EN, time: '06:48 AM | 30 Jul (UTC)' },
  ] },
  { id: 'th-2', name: 'septian tri nugroho', panel: 'Indonesia Panel', panelistId: '994210', email: 'septian.tri@gmail.com', preview: '😳', date: '30 Jul (UTC)', messages: [
    { from: 'member', text: 'When will I get my reward?', time: '05:10 AM | 30 Jul (UTC)' },
  ] },
  { id: 'th-3', name: 'Ahmet Arif Gunes', panel: 'Turkey Panel', panelistId: '1101882', email: 'a.arif.gunes@yahoo.com', preview: 'Hi, Ahmet, Thank you for the message. Your account is active…', date: '28 Jul (UTC)', messages: [
    { from: 'member', text: 'Is my account still active?', time: '09:00 AM | 28 Jul (UTC)' },
    { from: 'admin', text: 'Hi, Ahmet. Thank you for the message. Your account is active and works, from our verification.', time: '10:15 AM | 28 Jul (UTC)' },
  ] },
  { id: 'th-4', name: 'Yasoo Kareem', panel: 'Saudi Arabia Panel', panelistId: '1207731', email: 'yasoo.kareem@gmail.com', preview: 'مرحباً، شكراً لرسالتك. لقد تأكدنا من أن حسابك نشط.', date: '27 Jul (UTC)', messages: [
    { from: 'member', text: 'لماذا لا أرى استبيانات؟', time: '08:20 AM | 27 Jul (UTC)' },
    { from: 'admin', text: 'مرحباً، شكراً لرسالتك. سيتم ربطك بالدراسات الأنسب لملفك الشخصي.', time: '09:05 AM | 27 Jul (UTC)' },
  ] },
  { id: 'th-5', name: 'jonas christensson', panel: 'Sweden Panel', panelistId: '880114', email: 'jonas.christensson@gmail.com', preview: 'Hej, Tack för ditt meddelande. Vi har verifierat att ditt konto…', date: '27 Jul (UTC)', messages: [
    { from: 'member', text: 'Varför får jag inga undersökningar?', time: '07:30 AM | 27 Jul (UTC)' },
    { from: 'admin', text: 'Hej, Tack för ditt meddelande. Vi har verifierat att ditt konto är aktivt.', time: '08:12 AM | 27 Jul (UTC)' },
  ] },
  { id: 'th-6', name: 'Mohamed Kallel', panel: 'Algeria Panel', panelistId: '1330028', email: 'mohamed.kallel@yahoo.com', preview: 'مرحباً محمد، شكراً لرسالتك. يرجى تسجيل الدخول إلى حسابك.', date: '27 Jul (UTC)', messages: [
    { from: 'member', text: 'كيف أسحب أموالي؟', time: '06:00 AM | 27 Jul (UTC)' },
  ] },
  { id: 'th-7', name: 'Ioana Radu', panel: 'Romania Panel', panelistId: '199944', email: 'lucicasuliuc@yahoo.com', preview: 'Bună ziua, când primesc recompensa?', date: '26 Jul (UTC)', messages: [
    { from: 'member', text: 'Bună ziua, când primesc recompensa?', time: '14:20 PM | 26 Jul (UTC)' },
  ] },
  { id: 'th-8', name: 'Andrei Popescu', panel: 'Romania Panel', panelistId: '200003', email: 'andrei.dumitru3@gmail.com', preview: 'Mulțumesc pentru ajutor!', date: '25 Jul (UTC)', messages: [
    { from: 'member', text: 'Am o întrebare despre profilul meu.', time: '11:05 AM | 25 Jul (UTC)' },
    { from: 'admin', text: 'Bună ziua! Cu ce vă putem ajuta?', time: '11:20 AM | 25 Jul (UTC)' },
    { from: 'member', text: 'Mulțumesc pentru ajutor!', time: '11:35 AM | 25 Jul (UTC)' },
  ] },
];

/* ---------------------------- PANEL SETTINGS ---------------------------- */
const panelSettings: PanelSettings = {
  panelName: 'Romania Panel',
  panelAlias: 'ropanel',
  contactEmail: 'membersupport@myvoice-surveys.com',
  referralReward: 1,
  postalCodeNote: '',
  languages: ['English', 'Romanian'],
  cintCurrency: 'EUR',
  myvoiceCurrency: 'Euro(€)',
  rewardsAvailability: 'Available in 3 working day',
  minRedemption: 10,
  rewardsInfoHtml: `<p>Once you've accumulated USD/EUR 10.00 you can withdraw your money by selecting any voucher MyVoice is offering!</p>
<p>Just click on the 'Withdraw rewards' button and select your reward.</p>
<p>The rest is done by us and you will receive the reward by email within 3 working days.</p>
<p>It's that simple!</p>`,
};

const paymentEmail: PaymentEmailSettings = {
  email: 'panel-manager@datadiggers-mr.com',
  additionalEmail: 'ddtest074@gmail.com',
};

const profile: AdminProfile = {
  firstName: 'Divakar',
  lastName: 'Sharma',
  mobile: '+40722 222 222',
  gender: 'Male',
  dob: '',
  address: '',
  postalCode: '110075',
};

const dashboard: DashboardStats = {
  pendingRewards: 0,
  cintCompleted: 4,
  myvoiceCompleted: 196,
  emailInviteCompleted: 78,
  recruitment: [
    { source: 'LeasdscaleinUSA', hits: '6 | 0', registered: '2 | 0', verified: '2 | 0', conversion: '0.33% | 0.00%' },
    { source: 'MVFinUSA', hits: '25 | 0', registered: '8 | 0', verified: '7 | 0', conversion: '0.28% | 0.00%' },
    { source: 'LeasdscaleinBE', hits: '5 | 0', registered: '2 | 0', verified: '2 | 0', conversion: '0.40% | 0.00%' },
  ],
  recentRewards: [],
};

/* --------------------------------- SEED --------------------------------- */
export const seed = {
  adminUsers,
  members: buildMembers(),
  memberRewards,
  catalogue,
  templates,
  campaigns: buildCampaigns(),
  reports,
  recruitment,
  threads,
  panelSettings,
  paymentEmail,
  profile,
  dashboard,
};

/** Faked table totals so pagination footers read like the legacy admin. */
export const TOTALS = { members: 87696, memberRewards: 6144, campaigns: 3242, reports: 913 };

/** Sum of the values of the given rewards (used by the bulk-approve confirm). */
export const approvalTotal = (rewards: { value: number }[]): number =>
  rewards.reduce((sum, r) => sum + r.value, 0);
