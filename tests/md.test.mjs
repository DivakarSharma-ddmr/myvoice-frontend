import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parseTable, extractLinks, cleanText, splitLabelledClauses } from '../scripts/lib/md.mjs';

test('parseTable reads a table and drops the alignment row', () => {
  const md = [
    '| Category | Question |',
    '| :---: | :---- |',
    '| Rewards | Where can I see my balance? |',
    '| Rewards | How much can I make? |',
  ].join('\n');
  const [t] = parseTable(md);
  assert.deepEqual(t.head, ['Category', 'Question']);
  assert.equal(t.rows.length, 2);
  assert.deepEqual(t.rows[0], ['Rewards', 'Where can I see my balance?']);
});

test('parseTable returns each table separately', () => {
  const md = '| A |\n| :-- |\n| 1 |\n\ntext\n\n| B |\n| :-- |\n| 2 |';
  assert.equal(parseTable(md).length, 2);
});

test('extractLinks strips markdown links and keeps the label', () => {
  const r = extractLinks('Very simple: [click here](http://x.com/register), fill it in.');
  assert.equal(r.text, 'Very simple: click here, fill it in.');
  assert.deepEqual(r.links, [{ label: 'click here', href: 'http://x.com/register' }]);
});

test('extractLinks finds bare email addresses', () => {
  const r = extractLinks('Contact us at membersupport@myvoice-surveys.com today.');
  assert.equal(r.text, 'Contact us at membersupport@myvoice-surveys.com today.');
  assert.deepEqual(r.links, [{
    label: 'membersupport@myvoice-surveys.com',
    href: 'mailto:membersupport@myvoice-surveys.com',
  }]);
});

test('cleanText removes escape noise and bold markers', () => {
  assert.equal(cleanText('**Section 3\\.** Terms  and\\- conditions'), 'Section 3. Terms and- conditions');
});

test('cleanText collapses whitespace and trims', () => {
  assert.equal(cleanText('  a   b \n c  '), 'a b c');
});

test('splitLabelledClauses regroups labelled sub-clauses without losing words', () => {
  const text =
    'Participation requires the following conditions: Qualifying Surveys: Every screenout counts. ' +
    'Unlimited entries per month: There is no cap. Attempt limit per survey: Only once each.';
  const out = splitLabelledClauses(text);
  assert.ok(out, 'expected a split');
  assert.equal(out.items.length, 3);
  assert.match(out.intro, /following conditions:$/);
  assert.match(out.items[0], /^Qualifying Surveys: Every screenout counts\.$/);
  assert.match(out.items[2], /^Attempt limit per survey: Only once each\.$/);

  const words = (s) => s.replace(/\s+/g, ' ').trim();
  assert.equal(words([out.intro, ...out.items].join(' ')), words(text));
});

test('splitLabelledClauses leaves ordinary prose alone', () => {
  assert.equal(splitLabelledClauses('A sentence. Another sentence. And a third one here.'), null);
});
