import { test } from 'node:test';
import assert from 'node:assert/strict';
import { normalize, tokenize, searchFaq } from '../src/lib/faqSearch.ts';

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
