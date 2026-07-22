import { test } from 'node:test';
import assert from 'node:assert/strict';
import { normalize, tokenize, searchFaq } from '../src/lib/faqSearch.ts';
import { FAQ_SUGGESTIONS } from '../src/lib/faqSuggestions.ts';
import { faqItems } from '../src/content/faq.generated.ts';

const ITEMS = [
  { id: 'a', category: 'Rewards', question: 'Where can I see my balance?', answer: 'Log in and the dashboard shows your current balance.' },
  { id: 'b', category: 'Rewards', question: 'How can I claim the money I earned?', answer: 'There are different methods to claim your money.' },
  { id: 'c', category: 'Password recovery', question: 'I have lost my password. How do I get it back?', answer: 'Use the password reset page to recover it.' },
  { id: 'd', category: 'Completing surveys', question: 'How much time does it take to fill in a survey?', answer: 'Most studies average 10-15 minutes.' },
];

test('normalize folds case, diacritics and punctuation', () => {
  assert.equal(normalize('Parolă, PIERDUTĂ!'), 'parola pierduta');
});

test('tokenize drops stopwords and single characters', () => {
  assert.deepEqual(tokenize('how do I get it back'), ['back']);
});

test('finds an item by a word in its question', () => {
  const hits = searchFaq(ITEMS, 'balance');
  assert.equal(hits[0].item.id, 'a');
});

test('question matches outrank answer-only matches', () => {
  const hits = searchFaq(ITEMS, 'password');
  assert.equal(hits[0].item.id, 'c');
});

test('an exact question phrase wins outright', () => {
  const hits = searchFaq(ITEMS, 'claim the money');
  assert.equal(hits[0].item.id, 'b');
});

test('matches ignore diacritics in the query', () => {
  const hits = searchFaq(ITEMS, 'bálance');
  assert.equal(hits[0].item.id, 'a');
});

test('prefix matching finds partial words', () => {
  const hits = searchFaq(ITEMS, 'surv');
  assert.ok(hits.some((h) => h.item.id === 'd'));
});

test('returns nothing for a query with no match', () => {
  assert.deepEqual(searchFaq(ITEMS, 'helicopter'), []);
});

test('returns nothing for an empty or stopword-only query', () => {
  assert.deepEqual(searchFaq(ITEMS, '   '), []);
  assert.deepEqual(searchFaq(ITEMS, 'the and it'), []);
});

test('respects the result limit', () => {
  assert.ok(searchFaq(ITEMS, 'money balance survey password', 2).length <= 2);
});

test('reports which terms matched so the UI can highlight them', () => {
  const [hit] = searchFaq(ITEMS, 'balance dashboard');
  assert.deepEqual([...hit.terms].sort(), ['balance', 'dashboard']);
});

test('a literal match still outranks a synonym match', () => {
  // "money" is literal in b and reachable from "payout" — the literal wins.
  const hits = searchFaq(ITEMS, 'payout');
  const literal = searchFaq(ITEMS, 'money');
  assert.ok(hits[0].score < literal[0].score);
});

// Every pressable suggestion must return something. A chip that leads to "no
// answers matched" is worse than no chip at all.
for (const suggestion of FAQ_SUGGESTIONS) {
  test(`suggestion "${suggestion}" returns FAQ results`, () => {
    assert.ok(searchFaq(faqItems, suggestion).length > 0);
  });
}

// The app says "screenout" (draw explainer, survey states) but the FAQ says
// "redirected prematurely". Members type the word the app taught them.
test('vocabulary the app uses reaches the FAQ that explains it', () => {
  for (const term of ['screenout', 'payout', 'earnings', 'unsubscribe', 'gdpr']) {
    assert.ok(searchFaq(faqItems, term).length > 0, `"${term}" found nothing`);
  }
});
