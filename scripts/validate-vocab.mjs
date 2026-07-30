#!/usr/bin/env node
// Validates data/vocabulary.ts invariants that the quiz logic depends on:
//   - no duplicate id, th, or en values
//   - no Latin letters inside th (Thai script only)
//   - every category is registered in DatabaseTab (CATEGORIES, CAT_EMOJI, CAT_COLORS)
// Exits non-zero with a report if anything fails.

import { readFileSync } from 'node:fs';

const vocabSrc = readFileSync(new URL('../data/vocabulary.ts', import.meta.url), 'utf8');
const renoSrc = readFileSync(new URL('../data/renovation.ts', import.meta.url), 'utf8');
const tabSrc = readFileSync(new URL('../components/tabs/DatabaseTab.tsx', import.meta.url), 'utf8');

// Match single- or double-quoted values allowing escaped quotes
// (en uses both styles: 'Mother\'s Day' and "I don't understand").
const FIELD = (name) =>
  new RegExp(`${name}:\\s*(?:'((?:[^'\\\\]|\\\\.)*)'|"((?:[^"\\\\]|\\\\.)*)")`, 'g');

function extractFrom(src, name) {
  const out = [];
  for (const m of src.matchAll(FIELD(name))) {
    const raw = m[1] ?? m[2];
    // Normalize escapes so 'Mother\'s Day' and "Mother's Day" collide as dups.
    out.push(raw.replace(/\\(.)/g, '$1'));
  }
  return out;
}
const extract = (name) => extractFrom(vocabSrc, name);

const ids = extract('id');
const ths = extract('th');
const ens = extract('en');
const cats = extract('category');

const errors = [];

function findDups(list, label) {
  const seen = new Map();
  for (const v of list) seen.set(v, (seen.get(v) ?? 0) + 1);
  for (const [v, n] of seen) if (n > 1) errors.push(`duplicate ${label}: '${v}' (${n}x)`);
}

findDups(ids, 'id');
findDups(ens, 'en');

// Duplicate Thai is only a defect for words the quiz can actually use: two
// identical prompts with different right answers make an unanswerable
// question. 'dictionary' is reference-only — app/lesson.tsx filters it out of
// the question and distractor pool — so a dictionary entry may legitimately
// share Thai with a lesson word (buy/purchase) or with another dictionary
// entry (construct/create), the way any English→Thai dictionary does.
// The invariant that actually matters: at most ONE quiz-eligible word per
// Thai string.
const quizThs = ths.filter((_, i) => cats[i] !== 'dictionary');
findDups(quizThs, 'th (quiz-eligible)');

if (!(ids.length === ths.length && ths.length === ens.length && ens.length === cats.length)) {
  errors.push(`field count mismatch: id=${ids.length} th=${ths.length} en=${ens.length} category=${cats.length}`);
}

for (const th of ths) {
  if (/[A-Za-z]/.test(th)) errors.push(`Latin letters in th: '${th}'`);
}

// Category registration in DatabaseTab
const catList = tabSrc.match(/const CATEGORIES = \[([^\]]+)\]/)?.[1] ?? '';
const registered = new Set([...catList.matchAll(/'([^']+)'/g)].map((m) => m[1]));
const emojiBlock = tabSrc.match(/const CAT_EMOJI[^=]*=\s*\{([\s\S]*?)\n\};/)?.[1] ?? '';
const colorBlock = tabSrc.match(/const CAT_COLORS[^=]*=\s*\{([\s\S]*?)\n\};/)?.[1] ?? '';

for (const cat of new Set(cats)) {
  if (!registered.has(cat)) errors.push(`category '${cat}' missing from CATEGORIES`);
  if (!new RegExp(`(^|[\\s{])${cat}:`).test(emojiBlock)) errors.push(`category '${cat}' missing from CAT_EMOJI`);
  if (!new RegExp(`(^|[\\s{])${cat}:`).test(colorBlock)) errors.push(`category '${cat}' missing from CAT_COLORS`);
}

// ── Private packs (data/renovation.ts) ──────────────────────────────────────
// Same invariants, checked within the pack: the quiz builds distractors from
// the pack's own pool, so a duplicate th/en there breaks a question just as
// badly as it would in the public vocabulary.
const renoWordBlock = renoSrc.match(/RENOVATION_WORDS: Word\[\] = \[([\s\S]*?)\n\];/)?.[1] ?? '';
const renoIds = extractFrom(renoWordBlock, 'id');
const renoThs = extractFrom(renoWordBlock, 'th');
const renoEns = extractFrom(renoWordBlock, 'en');
const renoCats = extractFrom(renoWordBlock, 'category');

findDups(renoIds, 'renovation id');
findDups(renoThs, 'renovation th');
findDups(renoEns, 'renovation en');
for (const th of renoThs) {
  if (/[A-Za-z]/.test(th)) errors.push(`Latin letters in renovation th: '${th}'`);
}
for (const cat of new Set(renoCats)) {
  if (!new RegExp(`'${cat}':`).test(emojiBlock)) errors.push(`category '${cat}' missing from CAT_EMOJI`);
  if (!new RegExp(`'${cat}':`).test(colorBlock)) errors.push(`category '${cat}' missing from CAT_COLORS`);
}
// A public id colliding with a pack id would make getLessonById ambiguous.
const publicIds = new Set(ids);
for (const id of renoIds) {
  if (publicIds.has(id)) errors.push(`renovation id '${id}' collides with a vocabulary id`);
}

if (errors.length) {
  console.error(`vocab validation FAILED (${errors.length} problem${errors.length > 1 ? 's' : ''}):`);
  for (const e of errors) console.error(`  - ${e}`);
  process.exit(1);
}
console.log(`vocab validation OK: ${ids.length} words, ${new Set(cats).size} categories`);
console.log(`  + private packs: ${renoIds.length} renovation words, ${new Set(renoCats).size} categories`);
