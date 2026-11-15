import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView, Platform,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import {
  CONVERSATIONS, getConversation, resolveLine, sentenceTh, sentenceRom,
  conversationKey, SpeakerGender,
} from '../data/conversations';
import type { Sentence } from '../data/reading';
import { conversationState } from '../lib/conversations';
import { useProgressStore } from '../store/progressStore';
import { usePrefsStore } from '../store/prefsStore';
import { Colors } from '../constants/colors';
import { Fonts } from '../constants/typography';
import PixelSprite from '../components/PixelSprite';
import PixelEmoji from '../components/PixelEmoji';
import SentenceBuilder from '../components/SentenceBuilder';
import { SPRITES } from '../data/sprites';
import { speakThai, stopSpeaking } from '../lib/audio';
import { track } from '../lib/analytics';

const XP_REWARD = 20;

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

type Phase = 'intro' | 'play' | 'done' | 'hearts';

// What the learner has to do on each of their turns.
type Challenge =
  | { kind: 'choice'; options: Sentence[] }
  | { kind: 'build'; distractors: { th: string; rom: string }[] };

export default function ConversationScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const conv = getConversation(id ?? '');

  const { hearts, loseHeart, earnXP, completeLesson, setLessonStars, isPremium, skillLevel, lessonProgress } = useProgressStore();
  const { speakerGender, setSpeakerGender, isLoaded: prefsLoaded, load: loadPrefs } = usePrefsStore();
  useEffect(() => { if (!prefsLoaded) loadPrefs(); }, []);

  // Same deep-link gate as lessons: only reachable through progression.
  const state = conv ? conversationState(conv, lessonProgress, isPremium) : 'locked';
  const unlocked = state === 'available' || state === 'complete';
  const romAlways = skillLevel === 'beginner';

  const [phase, setPhase] = useState<Phase>('intro');
  const [idx, setIdx] = useState(0);
  const [answered, setAnswered] = useState<null | boolean>(null);  // current "you" turn: null = pending
  const [chosen, setChosen] = useState<string | null>(null);
  const [right, setRight] = useState(0);
  const [outOfHearts, setOutOfHearts] = useState(false);
  const scrollRef = useRef<ScrollView>(null);

  const gender: SpeakerGender = speakerGender ?? 'm';
  const lines = useMemo(
    () => (conv ? conv.lines.map(l => ({ who: l.who, s: resolveLine(l, gender) })) : []),
    [conv, gender],
  );
  const youTurns = lines.filter(l => l.who === 'you').length;

  // One challenge per "you" turn, fixed when play starts: alternate between
  // picking the reply and building it (very short or long lines are picked).
  const challenges = useMemo(() => {
    const out: Record<number, Challenge> = {};
    if (!conv) return out;
    const others = CONVERSATIONS.flatMap(c => c.lines.filter(l => l.who === 'you').map(l => resolveLine(l, gender)));
    let turn = 0;
    lines.forEach((line, i) => {
      if (line.who !== 'you') return;
      const th = sentenceTh(line.s);
      const n = line.s.tokens.length;
      const wantBuild = turn % 2 === 1 && n >= 2 && n <= 7;
      turn++;
      if (wantBuild) {
        const inAnswer = new Set(line.s.tokens.map(t => t.th));
        const distractors: { th: string; rom: string }[] = [];
        for (const t of shuffle(lines.filter((_, k) => k !== i).flatMap(l => l.s.tokens))) {
          if (distractors.length >= 3) break;
          if (!inAnswer.has(t.th)) { inAnswer.add(t.th); distractors.push({ th: t.th, rom: t.rom }); }
        }
        out[i] = { kind: 'build', distractors };
      } else {
        // Wrong replies: other things a learner says, closest in length first
        // so the answer can't be spotted by its size alone.
        const seenTh = new Set([th]);
        const seenEn = new Set([line.s.en]);
        const pool = shuffle(others)
          .filter(o => {
            const oth = sentenceTh(o);
            if (seenTh.has(oth) || seenEn.has(o.en)) return false;
            seenTh.add(oth); seenEn.add(o.en);
            return true;
          })
          .sort((a, b) => Math.abs(a.tokens.length - n) - Math.abs(b.tokens.length - n));
        out[i] = { kind: 'choice', options: shuffle([line.s, ...shuffle(pool.slice(0, 5)).slice(0, 2)]) };
      }
    });
    return out;
    // Rebuilt only when the conversation or the speaker's gender changes.
  }, [conv, gender, lines]);

  const current = lines[idx];
  const isYourTurn = phase === 'play' && current?.who === 'you';

  // Speak each line as it appears: NPC lines on arrival, yours once answered.
  useEffect(() => {
    if (phase !== 'play' || !current) return;
    if (current.who === 'npc') {
      const t = setTimeout(() => speakThai(sentenceTh(current.s)), 350);
      return () => clearTimeout(t);
    }
  }, [phase, idx]);

  useEffect(() => () => stopSpeaking(), []);

  useEffect(() => {
    const t = setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 60);
    return () => clearTimeout(t);
  }, [idx, answered, phase]);

  const start = () => {
    if (!conv) return;
    setIdx(0); setAnswered(null); setChosen(null); setRight(0); setOutOfHearts(false);
    setPhase('play');
    track('lesson_start', { lesson: conversationKey(conv.id) });
  };

  const answer = (ok: boolean) => {
    if (answered !== null) return;
    setAnswered(ok);
    speakThai(sentenceTh(current.s));
    if (ok) setRight(r => r + 1);
    else if (!isPremium) {
      if (hearts <= 1) setOutOfHearts(true);
      loseHeart();
    }
  };

  const next = () => {
    if (!conv) return;
    if (outOfHearts) { setPhase('hearts'); return; }
    if (idx + 1 >= lines.length) {
      const pct = youTurns > 0 ? right / youTurns : 1;
      const stars = pct >= 0.9 ? 3 : pct >= 0.7 ? 2 : 1;
      const key = conversationKey(conv.id);
      earnXP(XP_REWARD);
      completeLesson(key);
      setLessonStars(key, stars);
      track('lesson_complete', { lesson: key, stars, pct: Math.round(pct * 100) });
      setPhase('done');
      return;
    }
    setAnswered(null); setChosen(null);
    setIdx(i => i + 1);
  };

  const leave = () => (router.canGoBack() ? router.back() : router.replace('/'));

  if (!conv || !unlocked) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.center}>
          <Text style={styles.errorText}>{!conv ? 'Conversation not found' : '🔒 Locked — finish more lessons in this world first'}</Text>
          <TouchableOpacity accessibilityRole="button" style={styles.backBtn} onPress={leave}>
            <Text style={styles.backBtnText}>← Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // ── Intro ────────────────────────────────────────────────────────────────
  if (phase === 'intro') {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.header}>
          <TouchableOpacity accessibilityRole="button" accessibilityLabel="Close conversation" onPress={leave} style={styles.closeBtn}>
            <Text style={styles.closeText}>✕</Text>
          </TouchableOpacity>
        </View>
        <ScrollView contentContainerStyle={styles.intro} showsVerticalScrollIndicator={false}>
          <View style={styles.introIcon}><PixelEmoji emoji={conv.icon} size={44} /></View>
          <Text style={styles.kicker}>REAL CONVERSATION</Text>
          <Text style={styles.introTitle}>{conv.title}</Text>
          <Text style={styles.introSetting}>{conv.setting}</Text>

          <View style={styles.genderBox}>
            <Text style={styles.genderLabel}>I SPEAK AS</Text>
            <View style={styles.genderRow} accessibilityRole="radiogroup">
              {([
                ['m', 'A man', 'ครับ', 'khráp'],
                ['f', 'A woman', 'ค่ะ', 'khâ'],
              ] as const).map(([g, label, th, rom]) => {
                const on = speakerGender === g;
                return (
                  <TouchableOpacity
                    key={g}
                    accessibilityRole="radio"
                    accessibilityLabel={`${label}, polite word ${rom}`}
                    accessibilityState={{ checked: on }}
                    aria-checked={on}
                    style={[styles.genderBtn, on && styles.genderBtnOn,
                      Platform.OS === 'web' && on ? { boxShadow: `0 3px 0 0 ${Colors.borderStrong}` } as any : {}]}
                    onPress={() => setSpeakerGender(g)}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.genderName}>{label}</Text>
                    <Text style={styles.genderTh}>{th}</Text>
                    <Text style={styles.genderRom}>{rom}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
            <Text style={styles.genderHint}>
              Thai polite words depend on who is speaking. Your lines will use the right ones for you.
            </Text>
          </View>

          <TouchableOpacity
            accessibilityRole="button"
            accessibilityState={{ disabled: !speakerGender }}
            aria-disabled={!speakerGender}
            style={[styles.primaryBtn, !speakerGender && styles.primaryBtnOff,
              Platform.OS === 'web' && speakerGender ? { boxShadow: `0 5px 0 0 ${Colors.emberDeep}` } as any : {}]}
            onPress={start}
            disabled={!speakerGender}
            activeOpacity={0.85}
          >
            <Text style={styles.primaryBtnText}>START</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // ── Result ───────────────────────────────────────────────────────────────
  if (phase === 'done' || phase === 'hearts') {
    const passed = phase === 'done';
    const pct = youTurns > 0 ? Math.round((right / youTurns) * 100) : 100;
    const stars = pct >= 90 ? 3 : pct >= 70 ? 2 : 1;
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.center}>
          <PixelSprite sprite={passed ? (stars === 3 ? SPRITES.garuda : SPRITES.lotus) : SPRITES.nagaSleep} size={96} />
          {passed && <Text style={styles.doneStars}>{'★'.repeat(stars)}{'☆'.repeat(3 - stars)}</Text>}
          <Text style={styles.doneTitle}>{passed ? 'Conversation complete!' : 'Out of hearts!'}</Text>
          <Text style={styles.doneSub}>
            {passed ? conv.title : 'Hearts refill over time — or go Premium for unlimited.'}
          </Text>
          {passed && (
            <View style={styles.doneStats}>
              <View style={styles.doneStat}>
                <Text style={styles.doneStatValue}>{right}/{youTurns}</Text>
                <Text style={styles.doneStatLabel}>REPLIES RIGHT</Text>
              </View>
              <View style={styles.doneStatDiv} />
              <View style={styles.doneStat}>
                <Text style={styles.doneStatValue}>+{XP_REWARD}</Text>
                <Text style={styles.doneStatLabel}>XP</Text>
              </View>
            </View>
          )}
          <TouchableOpacity
            accessibilityRole="button"
            style={[styles.primaryBtn, Platform.OS === 'web' ? { boxShadow: `0 5px 0 0 ${Colors.emberDeep}` } as any : {}]}
            onPress={leave}
            activeOpacity={0.85}
          >
            <Text style={styles.primaryBtnText}>{passed ? 'CONTINUE' : 'EXIT'}</Text>
          </TouchableOpacity>
          {passed && (
            <TouchableOpacity accessibilityRole="button" style={styles.ghostBtn} onPress={() => setPhase('intro')} activeOpacity={0.8}>
              <Text style={styles.ghostBtnText}>PLAY AGAIN</Text>
            </TouchableOpacity>
          )}
        </View>
      </SafeAreaView>
    );
  }

  // ── Play ─────────────────────────────────────────────────────────────────
  // Everything said so far; your current line appears once you've answered.
  const shown = lines.slice(0, idx + 1).filter((l, i) => i < idx || l.who === 'npc' || answered !== null);
  const challenge = challenges[idx];
  const progress = (idx + (isYourTurn && answered === null ? 0 : 1)) / lines.length;

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity accessibilityRole="button" accessibilityLabel="Close conversation" onPress={leave} style={styles.closeBtn}>
          <Text style={styles.closeText}>✕</Text>
        </TouchableOpacity>
        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: `${Math.round(progress * 100)}%` as any }]} />
        </View>
        <Text style={styles.hearts}>{isPremium ? '♾️' : `❤️ ${hearts}`}</Text>
      </View>

      <ScrollView ref={scrollRef} style={styles.chat} contentContainerStyle={styles.chatContent} showsVerticalScrollIndicator={false}>
        <Text style={styles.sceneText}>{conv.setting}</Text>
        {shown.map((l, i) => {
          const mine = l.who === 'you';
          const th = sentenceTh(l.s);
          return (
            <View key={i} style={[styles.bubbleRow, mine && styles.bubbleRowMine]}>
              <Text style={styles.speaker}>{mine ? 'YOU' : conv.npc.toUpperCase()}</Text>
              <TouchableOpacity
                accessibilityRole="button"
                accessibilityLabel={`${mine ? 'You' : conv.npc}: ${th}. ${l.s.en} Tap to hear it`}
                style={[styles.bubble, mine ? styles.bubbleMine : styles.bubbleNpc,
                  Platform.OS === 'web' ? { boxShadow: `0 3px 0 0 ${Colors.borderStrong}` } as any : {}]}
                onPress={() => speakThai(th)}
                activeOpacity={0.8}
              >
                <Text style={styles.bubbleTh}>{th}</Text>
                <Text style={styles.bubbleRom}>{sentenceRom(l.s)}</Text>
                <Text style={styles.bubbleEn}>{l.s.en}</Text>
              </TouchableOpacity>
            </View>
          );
        })}
      </ScrollView>

      <View style={styles.panel}>
        {isYourTurn && answered === null && challenge && (
          <>
            <Text style={styles.kicker}>YOUR TURN — SAY THIS IN THAI</Text>
            <Text style={styles.sayEn}>“{current.s.en}”</Text>
            {challenge.kind === 'choice' ? (
              <View style={styles.options}>
                {challenge.options.map(o => {
                  const th = sentenceTh(o);
                  return (
                    <TouchableOpacity
                      key={th}
                      accessibilityRole="button"
                      style={styles.option}
                      onPress={() => { setChosen(th); answer(th === sentenceTh(current.s)); }}
                      activeOpacity={0.8}
                    >
                      <Text style={styles.optionTh}>{th}</Text>
                      {romAlways && <Text style={styles.optionRom}>{sentenceRom(o)}</Text>}
                    </TouchableOpacity>
                  );
                })}
              </View>
            ) : (
              <SentenceBuilder
                key={`${idx}-${gender}`}
                answer={current.s.tokens}
                distractors={challenge.distractors}
                showRom={romAlways}
                onResult={answer}
              />
            )}
          </>
        )}

        {(!isYourTurn || answered !== null) && (
          <>
            {isYourTurn && (
              <Text style={[styles.verdict, { color: answered ? Colors.correct : Colors.wrong }]}>
                {answered
                  ? '✓ That’s right!'
                  : chosen ? '✗ Not quite — the right reply is shown above.' : '✗ Not quite — the right order is shown above.'}
              </Text>
            )}
            <TouchableOpacity
              accessibilityRole="button"
              style={[styles.primaryBtn, Platform.OS === 'web' ? { boxShadow: `0 5px 0 0 ${Colors.emberDeep}` } as any : {}]}
              onPress={next}
              activeOpacity={0.85}
            >
              <Text style={styles.primaryBtnText}>CONTINUE</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.bg },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24, gap: 14 },

  header: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    paddingHorizontal: 20, paddingTop: 12, paddingBottom: 8, minHeight: 44,
  },
  closeBtn: { padding: 6 },
  closeText: { color: Colors.textDim, fontSize: 18 },
  progressTrack: { flex: 1, height: 8, borderRadius: 4, backgroundColor: Colors.border, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: Colors.ember, borderRadius: 4 },
  hearts: { color: Colors.text, fontSize: 14, fontFamily: Fonts.hud, minWidth: 44, textAlign: 'right' },

  // Intro
  intro: { alignItems: 'center', paddingHorizontal: 24, paddingBottom: 32, gap: 10 },
  introIcon: {
    width: 84, height: 84, borderRadius: 18, alignItems: 'center', justifyContent: 'center',
    backgroundColor: Colors.realmGrove, borderWidth: 2, borderColor: Colors.borderStrong, marginBottom: 6,
  },
  kicker: { color: Colors.textDim, fontSize: 9, fontFamily: Fonts.hud, letterSpacing: 2, textAlign: 'center' },
  introTitle: { color: Colors.text, fontSize: 26, fontFamily: Fonts.display, fontWeight: '700', textAlign: 'center' },
  introSetting: { color: Colors.textDim, fontSize: 15, fontFamily: Fonts.body, textAlign: 'center', lineHeight: 21 },
  genderBox: {
    width: '100%', maxWidth: 380, marginTop: 14, padding: 16, gap: 10,
    backgroundColor: Colors.card, borderRadius: 16, borderWidth: 2, borderColor: Colors.borderStrong,
  },
  genderLabel: { color: Colors.textDim, fontSize: 9, fontFamily: Fonts.hud, letterSpacing: 2, textAlign: 'center' },
  genderRow: { flexDirection: 'row', gap: 10 },
  genderBtn: {
    flex: 1, alignItems: 'center', paddingVertical: 12, borderRadius: 12,
    borderWidth: 2, borderColor: Colors.border, backgroundColor: Colors.bg, gap: 2,
  },
  genderBtnOn: { borderColor: Colors.borderStrong, backgroundColor: Colors.realmGrove },
  genderName: { color: Colors.text, fontSize: 13, fontFamily: Fonts.body, fontWeight: '700' },
  genderTh: { color: Colors.text, fontSize: 24, fontFamily: Fonts.body },
  genderRom: { color: Colors.lavenderDark, fontSize: 12, fontFamily: Fonts.mono },
  genderHint: { color: Colors.textMuted, fontSize: 12, fontFamily: Fonts.body, textAlign: 'center', lineHeight: 17 },

  // Chat
  chat: { flex: 1 },
  chatContent: { paddingHorizontal: 16, paddingTop: 6, paddingBottom: 16, gap: 12 },
  sceneText: { color: Colors.textMuted, fontSize: 12, fontFamily: Fonts.body, textAlign: 'center', fontStyle: 'italic' },
  bubbleRow: { alignItems: 'flex-start', gap: 3 },
  bubbleRowMine: { alignItems: 'flex-end' },
  speaker: { color: Colors.textDim, fontSize: 8, fontFamily: Fonts.hud, letterSpacing: 1.5, paddingHorizontal: 6 },
  bubble: {
    maxWidth: '86%', borderWidth: 2, borderColor: Colors.borderStrong,
    borderRadius: 16, paddingVertical: 10, paddingHorizontal: 14, gap: 2, marginBottom: 3,
  },
  bubbleNpc: { backgroundColor: Colors.card, borderTopLeftRadius: 4 },
  bubbleMine: { backgroundColor: Colors.realmMarket, borderTopRightRadius: 4 },
  bubbleTh: { color: Colors.text, fontSize: 21, fontFamily: Fonts.body, lineHeight: 30 },
  bubbleRom: { color: Colors.lavenderDark, fontSize: 12, fontFamily: Fonts.mono },
  bubbleEn: { color: Colors.textDim, fontSize: 13, fontFamily: Fonts.body },

  // Bottom panel
  panel: {
    paddingHorizontal: 16, paddingTop: 12, paddingBottom: 20, gap: 10,
    borderTopWidth: 2, borderTopColor: Colors.borderStrong, backgroundColor: Colors.bgInset,
  },
  sayEn: { color: Colors.text, fontSize: 18, fontFamily: Fonts.body, fontWeight: '700', textAlign: 'center' },
  options: { gap: 8 },
  option: {
    backgroundColor: Colors.card, borderWidth: 2, borderColor: Colors.borderStrong,
    borderRadius: 12, paddingVertical: 10, paddingHorizontal: 14,
  },
  optionTh: { color: Colors.text, fontSize: 18, fontFamily: Fonts.body, lineHeight: 26 },
  optionRom: { color: Colors.lavenderDark, fontSize: 12, fontFamily: Fonts.mono },
  verdict: { fontSize: 14, fontFamily: Fonts.body, fontWeight: '700', textAlign: 'center' },

  primaryBtn: {
    backgroundColor: Colors.ember, borderRadius: 12, paddingVertical: 15,
    width: '100%', maxWidth: 380, alignSelf: 'center', alignItems: 'center',
    borderWidth: 2, borderColor: Colors.borderStrong, marginTop: 4,
  },
  primaryBtnOff: { backgroundColor: Colors.bgInset, borderColor: Colors.border },
  primaryBtnText: { color: Colors.onBrand, fontSize: 14, fontFamily: Fonts.hud, letterSpacing: 2 },
  ghostBtn: { paddingVertical: 10, paddingHorizontal: 20 },
  ghostBtnText: { color: Colors.textDim, fontSize: 11, fontFamily: Fonts.hud, letterSpacing: 2 },

  errorText: { color: Colors.textDim, fontSize: 15, fontFamily: Fonts.body, textAlign: 'center' },
  backBtn: {
    backgroundColor: Colors.card, borderRadius: 6, paddingVertical: 12, paddingHorizontal: 24,
    borderWidth: 1, borderColor: Colors.border,
  },
  backBtnText: { color: Colors.text, fontSize: 14, fontFamily: Fonts.body },

  doneStars: { color: Colors.gold, fontSize: 32, fontFamily: Fonts.hud, letterSpacing: 6 },
  doneTitle: { color: Colors.text, fontSize: 26, fontFamily: Fonts.display, fontWeight: '700', textAlign: 'center' },
  doneSub: { color: Colors.textDim, fontSize: 14, fontFamily: Fonts.body, textAlign: 'center', maxWidth: 300 },
  doneStats: {
    flexDirection: 'row', backgroundColor: Colors.card, borderRadius: 12, borderWidth: 2,
    borderColor: Colors.borderStrong, paddingVertical: 18, paddingHorizontal: 8, width: '100%', maxWidth: 360,
  },
  doneStat: { flex: 1, alignItems: 'center', gap: 6 },
  doneStatValue: { color: Colors.text, fontSize: 24, fontFamily: Fonts.hud },
  doneStatLabel: { color: Colors.textDim, fontSize: 9, fontFamily: Fonts.hud, letterSpacing: 1 },
  doneStatDiv: { width: 1, backgroundColor: Colors.border },
});
