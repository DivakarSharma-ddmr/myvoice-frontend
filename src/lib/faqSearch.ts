// Keyword search over the member FAQ. Dependency-free and deliberately pure:
// it takes the items as an argument rather than importing generated content, so
// it can be unit-tested directly and reused for any searchable list.

export type SearchableItem = { id: string; category: string; question: string; answer: string };
export type SearchHit<T> = { item: T; score: number; terms: string[] };

const STOPWORDS = new Set([
  'a', 'an', 'and', 'are', 'as', 'at', 'be', 'but', 'by', 'can', 'do', 'does', 'for', 'from',
  'get', 'has', 'have', 'how', 'i', 'if', 'in', 'is', 'it', 'me', 'my', 'not', 'of', 'on', 'or',
  'so', 'that', 'the', 'their', 'them', 'there', 'they', 'this', 'to', 'up', 'was', 'we', 'what',
  'when', 'where', 'which', 'who', 'why', 'will', 'with', 'you', 'your',
]);

// Members type without diacritics far more often than with them, so folding
// them means "parola" finds "parolă" rather than returning nothing.
export function normalize(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function tokenize(text: string): string[] {
  return normalize(text)
    .split(' ')
    .filter((t) => t.length > 1 && !STOPWORDS.has(t));
}

// The words members use are not always the words the FAQ uses. The clearest
// case: the platform itself says "screenout" (draw explainer, survey states)
// but the FAQ describes it as being "redirected prematurely", so the exact
// term the app taught the member returned nothing. Expansion happens on the
// query side only — the published FAQ text is never rewritten to suit search.
const SYNONYMS: Record<string, string[]> = {
  screenout: ['redirected', 'prematurely', 'finalize'],
  screenouts: ['redirected', 'prematurely', 'finalize'],
  screened: ['redirected', 'prematurely', 'finalize'],
  quota: ['closed', 'invitation'],
  payout: ['claim', 'money', 'earned'],
  payouts: ['claim', 'money', 'earned'],
  cashout: ['claim', 'money', 'earned'],
  withdraw: ['claim', 'money', 'earned'],
  paypal: ['money', 'claim'],
  earnings: ['money', 'earned', 'balance'],
  entries: ['draw'],
  entry: ['draw'],
  unsubscribe: ['delete', 'account'],
  gdpr: ['personal', 'data', 'privacy'],
};

const SCORE = {
  phrase: 100,
  allTerms: 25,
  questionWord: 10,
  questionPrefix: 6,
  categoryWord: 4,
  answerWord: 3,
  answerPrefix: 2,
};

function scoreOne(words: string[], term: string, exact: number, prefix: number) {
  if (words.includes(term)) return exact;
  if (prefix && words.some((w) => w.startsWith(term))) return prefix;
  return 0;
}

export function searchFaq<T extends SearchableItem>(
  items: T[],
  query: string,
  limit = 8
): SearchHit<T>[] {
  const terms = tokenize(query);
  if (!terms.length) return [];
  const phrase = normalize(query);

  const hits: SearchHit<T>[] = [];

  for (const item of items) {
    const nq = normalize(item.question);
    const qWords = nq.split(' ');
    const aWords = normalize(item.answer).split(' ');
    const cWords = normalize(item.category).split(' ');

    let score = 0;
    const matched: string[] = [];

    for (const term of terms) {
      // A synonym counts for the term that triggered it, but scores lower than
      // the member's own word so a literal match always sorts first.
      let termScore = 0;
      for (const [variant, weight] of [
        [term, 1] as const,
        ...(SYNONYMS[term] ?? []).map((v) => [v, 0.5] as const),
      ]) {
        let s = scoreOne(qWords, variant, SCORE.questionWord, SCORE.questionPrefix);
        if (!s) s = scoreOne(cWords, variant, SCORE.categoryWord, 0);
        if (!s) s = scoreOne(aWords, variant, SCORE.answerWord, SCORE.answerPrefix);
        termScore = Math.max(termScore, s * weight);
      }
      if (termScore) {
        score += termScore;
        matched.push(term);
      }
    }

    if (!matched.length) continue;
    if (matched.length === terms.length) score += SCORE.allTerms;
    if (phrase.length > 2 && nq.includes(phrase)) score += SCORE.phrase;

    hits.push({ item, score, terms: matched });
  }

  return hits
    .sort((a, b) => b.score - a.score || a.item.id.localeCompare(b.item.id))
    .slice(0, limit);
}
