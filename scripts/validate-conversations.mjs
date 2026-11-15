#!/usr/bin/env node
// Validates data/conversations.ts — the invariants the conversation player
// and its exercises rely on, plus consistency of the Thai itself:
//   - unique ids; ids short enough for the progress-sync key limit
//   - world ids are real base worlds; unlockAfter is reachable
//   - every conversation has turns for both sides and at least 2 "you" turns
//   - th is Thai script only, rom has no Thai, nothing is empty
//   - female forms appear only on "you" lines, and every "you" line containing
//     a gendered word (ครับ / ผม) has one — so no woman is taught ครับ
//   - female question lines end in คะ and statements in ค่ะ (never นะค่ะ)
//   - one Thai word always has the same romanization
//   - no two "you" lines share Thai but differ in English, or vice versa
//     (they are used as each other's wrong answers)
import { readFileSync } from 'node:fs';
import { loadTsModule } from './lib/load-ts.mjs';

const mod = await loadTsModule(new URL('../data/conversations.ts', import.meta.url));
const { CONVERSATIONS, resolveLine, sentenceTh } = mod;
const worldsSrc = readFileSync(new URL('../data/worlds.ts', import.meta.url), 'utf8');
const phrasesSrc = readFileSync(new URL('../data/phrases.ts', import.meta.url), 'utf8');

const errors = [];
const err = (m) => errors.push(m);

const THAI = /[฀-๿]/;
const ONLY_THAI = /^[฀-๿]+$/;
const worldIds = new Set([...worldsSrc.matchAll(/id: '(w\d+)'/g)].map(m => m[1]));
const QUESTION_WORDS = ['ไหม', 'อะไร', 'ที่ไหน', 'เท่าไหร่', 'ไหน', 'กี่', 'หรือ'];

const ids = new Set();
const romByTh = new Map();
const noteRom = (th, rom, where) => {
  const prev = romByTh.get(th);
  if (prev && prev.rom !== rom) err(`rom mismatch for ${th}: "${prev.rom}" (${prev.where}) vs "${rom}" (${where})`);
  if (!prev) romByTh.set(th, { rom, where });
};

// Seed with the phrasebook so conversations stay consistent with it.
for (const m of phrasesSrc.matchAll(/\{ th: '([^']+)', rom: '([^']+)'/g)) {
  if (!romByTh.has(m[1])) romByTh.set(m[1], { rom: m[2], where: 'phrases.ts' });
}

const youByTh = new Map();
const youByEn = new Map();

for (const c of CONVERSATIONS) {
  const at = `conversation "${c.id}"`;
  if (ids.has(c.id)) err(`${at}: duplicate id`);
  ids.add(c.id);
  if (!/^[a-z0-9-]+$/.test(c.id) || `conv-${c.id}`.length > 40) err(`${at}: bad id`);
  if (!worldIds.has(c.worldId)) err(`${at}: unknown world ${c.worldId}`);
  if (!(c.unlockAfter >= 1 && c.unlockAfter <= 5)) err(`${at}: unlockAfter out of range`);
  for (const f of ['title', 'icon', 'setting', 'npc']) if (!c[f]) err(`${at}: missing ${f}`);
  const yous = c.lines.filter(l => l.who === 'you');
  if (yous.length < 2 || yous.length === c.lines.length) err(`${at}: needs turns for both sides`);

  c.lines.forEach((line, i) => {
    const la = `${at} line ${i + 1}`;
    if (!line.en) err(`${la}: missing en`);
    if (line.tokens.length === 0) err(`${la}: no tokens`);
    for (const t of line.tokens) {
      if (!ONLY_THAI.test(t.th)) err(`${la}: th "${t.th}" is not pure Thai script`);
      if (!t.rom || THAI.test(t.rom)) err(`${la}: bad rom for ${t.th}`);
      if (!t.en) err(`${la}: missing gloss for ${t.th}`);
      noteRom(t.th, t.rom, la);
      if (t.f) {
        if (line.who !== 'you') err(`${la}: female form on an NPC line`);
        if (!ONLY_THAI.test(t.f.th) || !t.f.rom || THAI.test(t.f.rom)) err(`${la}: bad female form for ${t.th}`);
        noteRom(t.f.th, t.f.rom, la);
      } else if (line.who === 'you' && (t.th === 'ครับ' || t.th === 'ผม')) {
        err(`${la}: "${t.th}" on a "you" line has no female form`);
      }
    }
    if (line.who === 'npc') {
      const th = line.tokens.map(t => t.th);
      if (th.includes('ครับ') && (th.includes('ค่ะ') || th.includes('คะ'))) err(`${la}: NPC mixes male and female particles`);
    }
    // Female particle agreement, checked clause by clause on the resolved line.
    const toks = resolveLine(line, 'f').tokens.map(t => t.th);
    const src = line.who === 'npc' ? line.tokens.map(t => t.th) : toks;
    let clause = [];
    src.forEach((th, k) => {
      if (th === 'ค่ะ' || th === 'คะ') {
        const isQ = clause.some(x => QUESTION_WORDS.includes(x)) || clause[clause.length - 1] === 'นะ';
        if (isQ && th !== 'คะ') err(`${la}: expected คะ after "${clause.join('')}"`);
        if (!isQ && th !== 'ค่ะ') err(`${la}: expected ค่ะ after "${clause.join('')}"`);
        clause = [];
      } else if (th === 'ครับ') {
        clause = [];
      } else clause.push(th);
    });
    if (line.who === 'you') {
      for (const g of ['m', 'f']) {
        const s = resolveLine(line, g);
        const th = sentenceTh(s);
        const key = `${g}:${th}`;
        const prevEn = youByTh.get(key);
        if (prevEn && prevEn !== line.en) err(`${la}: same Thai "${th}" has two translations ("${prevEn}" / "${line.en}")`);
        youByTh.set(key, line.en);
        const ek = `${g}:${line.en}`;
        const prevTh = youByEn.get(ek);
        if (prevTh && prevTh !== th) err(`${la}: "${line.en}" has two Thai forms (${prevTh} / ${th})`);
        youByEn.set(ek, th);
      }
    }
  });
}

if (errors.length) {
  console.error(`✗ conversations: ${errors.length} problem(s)`);
  for (const e of errors) console.error('  - ' + e);
  process.exit(1);
}
const lines = CONVERSATIONS.reduce((n, c) => n + c.lines.length, 0);
console.log(`✓ conversations OK: ${CONVERSATIONS.length} conversations, ${lines} lines, ${romByTh.size} distinct words checked`);
