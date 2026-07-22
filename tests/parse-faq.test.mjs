import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parseFaq } from '../scripts/parse-faq.mjs';

const SAMPLE = [
  '| Category | Question | Actions |',
  '| :---: | :---- | :---- |',
  '| Panel registration | Who can join the panel? | Anyone at least 14 years old. |',
  '| Panel registration | How do I join? | Very simple: [click here](http://x.com/register). |',
  '| Rewards | Where can I see my balance? | Log in and check the dashboard. |',
].join('\n');

test('groups items by category in source order', () => {
  const { categories } = parseFaq(SAMPLE);
  assert.deepEqual(categories.map((c) => c.name), ['Panel registration', 'Rewards']);
  assert.equal(categories[0].items.length, 2);
  assert.equal(categories[1].items.length, 1);
});

test('gives every item a stable unique id', () => {
  const { categories } = parseFaq(SAMPLE);
  const ids = categories.flatMap((c) => c.items.map((i) => i.id));
  assert.equal(new Set(ids).size, ids.length);
  assert.equal(parseFaq(SAMPLE).categories[0].items[0].id, ids[0]);
});

test('strips markdown links from the answer but records them', () => {
  const { categories } = parseFaq(SAMPLE);
  const item = categories[0].items[1];
  assert.equal(item.answer, 'Very simple: click here.');
  assert.deepEqual(item.links, [{ label: 'click here', href: 'http://x.com/register' }]);
});

test('question text is cleaned of markdown', () => {
  const md = '| C | Q |\n| :-- | :-- |\n| Rewards | [Why no money](http://x.com/faq)? | Reasons vary. |';
  const { categories } = parseFaq(md);
  assert.equal(categories[0].items[0].question, 'Why no money?');
});
