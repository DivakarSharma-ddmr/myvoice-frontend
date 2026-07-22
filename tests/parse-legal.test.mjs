import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parseCookiePolicy, parseClickDraw, parseTerms } from '../scripts/parse-legal.mjs';

const COOKIE = [
  '**COOKIE POLICY**',
  '',
  '**Effective Date:** April 19th, 2019',
  '',
  '**Last Revised:** August 9th, 2022',
  '',
  "### **What's a \"cookie\"?**",
  '',
  'A cookie is a piece of information stored on your device.',
  '',
  'Cookies are used by nearly all websites.',
  '',
  '### **How do we use cookies?**',
  '',
  '**\\- Session cookies:** deleted when you close your browser; or',
  '',
  '**\\- Persistent cookies:** stored as a file on your computer.',
].join('\n');

test('cookie policy captures title and dates', () => {
  const doc = parseCookiePolicy(COOKIE);
  assert.equal(doc.slug, 'cookies');
  assert.equal(doc.title, 'Cookie policy');
  assert.equal(doc.effective, 'April 19th, 2019');
  assert.equal(doc.revised, 'August 9th, 2022');
});

test('cookie policy splits sections on ### headings', () => {
  const doc = parseCookiePolicy(COOKIE);
  assert.equal(doc.sections.length, 2);
  assert.equal(doc.sections[0].heading, 'What\'s a "cookie"?');
  assert.equal(doc.sections[0].blocks.length, 2);
});

test('cookie policy turns dash-prefixed paragraphs into a list', () => {
  const doc = parseCookiePolicy(COOKIE);
  const list = doc.sections[1].blocks.find((b) => b.type === 'list');
  assert.ok(list, 'expected a list block');
  assert.equal(list.items.length, 2);
  assert.match(list.items[0], /^Session cookies:/);
});

test('every section gets a unique slug id', () => {
  const doc = parseCookiePolicy(COOKIE);
  const ids = doc.sections.map((s) => s.id);
  assert.equal(new Set(ids).size, ids.length);
  assert.ok(ids.every((id) => /^[a-z0-9-]+$/.test(id)));
});

test('click draw splits the single cell on Section markers', () => {
  const md = [
    '| Terms and Conditions Raffle "The Click Draw" |',
    '| :---: |',
    '| Section 1\\. The raffle organizer The organizer is DataDiggers. Section 2\\. Place and duration Held online monthly. |',
    '',
    '[image1]: <data:image/png;base64,AAAA>',
  ].join('\n');
  const doc = parseClickDraw(md);
  assert.equal(doc.slug, 'click-draw');
  assert.equal(doc.sections.length, 2);
  assert.equal(doc.sections[0].heading, 'Section 1. The raffle organizer');
  assert.match(doc.sections[1].blocks[0].text, /Held online monthly/);
});

test('click draw discards the base64 signature image', () => {
  const md = [
    '| T |',
    '| :---: |',
    '| Section 1\\. Organizer DataDiggers ![Sig][image1] |',
    '',
    '[image1]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUg>',
  ].join('\n');
  const doc = parseClickDraw(md);
  const all = JSON.stringify(doc);
  assert.ok(!all.includes('base64'), 'base64 image leaked into output');
  assert.ok(!all.includes('image1'), 'image reference leaked into output');
});

test('terms splits on numbered section headings', () => {
  const md = [
    '#### **TERMS AND CONDITIONS FOR PANEL MEMBERSHIP,**',
    '',
    '### **Definitions**',
    '',
    'Words have meanings.',
    '',
    '### ',
    '',
    '### **1\\. Applicability; Agreement**',
    '',
    'These terms apply to you.',
  ].join('\n');
  const doc = parseTerms(md);
  assert.equal(doc.slug, 'terms');
  assert.equal(doc.sections.length, 2);
  assert.equal(doc.sections[1].heading, '1. Applicability; Agreement');
});
