import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { Colors } from '../constants/colors';
import { Fonts } from '../constants/typography';
import { speakThai } from '../lib/audio';

export interface BuilderToken { th: string; rom: string }

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// "Build the sentence" exercise: tap word tiles into the answer tray in the
// right order, then CHECK. The parent decides what happens next (it shows the
// CONTINUE button); mount with a fresh `key` for every new sentence.
//
// The answer is compared as the joined Thai string, so two identical tiles
// (a sentence with ครับ twice) are interchangeable.
export default function SentenceBuilder({
  answer, distractors, showRom, onResult,
}: {
  answer: BuilderToken[];
  distractors: BuilderToken[];
  showRom: boolean;                 // beginners always see the reading
  onResult: (correct: boolean) => void;
}) {
  const tiles = useMemo(
    () => shuffle([...answer, ...distractors]).map((t, i) => ({ ...t, key: i })),
    // Tiles are fixed for the life of this mount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );
  const [picked, setPicked] = useState<number[]>([]);
  const [result, setResult] = useState<boolean | null>(null);
  const done = result !== null;

  const target = answer.map(t => t.th).join('');

  const pick = (key: number) => {
    if (done || picked.includes(key)) return;
    speakThai(tiles[key].th);
    setPicked(p => [...p, key]);
  };
  const unpick = (key: number) => {
    if (done) return;
    setPicked(p => p.filter(k => k !== key));
  };
  const check = () => {
    if (done || picked.length === 0) return;
    const ok = picked.map(k => tiles[k].th).join('') === target;
    setResult(ok);
    onResult(ok);
  };

  const trayColor = !done ? Colors.borderStrong : result ? Colors.correct : Colors.wrong;

  return (
    <View style={styles.wrap}>
      <View
        style={[styles.tray, { borderColor: trayColor }, done && { backgroundColor: result ? Colors.correctBg : Colors.wrongBg }]}
        accessibilityLabel="Your answer"
      >
        {picked.length === 0 && <Text style={styles.trayHint}>Tap the words in order</Text>}
        {picked.map(k => (
          <Tile key={k} th={tiles[k].th} rom={tiles[k].rom} showRom={showRom}
            label={`Remove ${tiles[k].th}`} onPress={() => unpick(k)} disabled={done} />
        ))}
      </View>

      {done && !result && (
        <View style={styles.solution}>
          <Text style={styles.solutionLabel}>CORRECT ANSWER</Text>
          <Text style={styles.solutionTh}>{target}</Text>
          <Text style={styles.solutionRom}>{answer.map(t => t.rom).join(' ')}</Text>
        </View>
      )}
      {done && result && showRom === false && (
        <Text style={styles.solutionRom}>{answer.map(t => t.rom).join(' ')}</Text>
      )}

      {!done && (
        <View style={styles.bank}>
          {tiles.map(t => picked.includes(t.key)
            ? <View key={t.key} style={[styles.tile, styles.tileGhost]}>
                <Text style={[styles.tileTh, { opacity: 0 }]}>{t.th}</Text>
                {showRom && <Text style={[styles.tileRom, { opacity: 0 }]}>{t.rom}</Text>}
              </View>
            : <Tile key={t.key} th={t.th} rom={t.rom} showRom={showRom}
                label={`Add ${t.th}`} onPress={() => pick(t.key)} />)}
        </View>
      )}

      {!done && (
        <TouchableOpacity
          accessibilityRole="button"
          accessibilityState={{ disabled: picked.length === 0 }}
          aria-disabled={picked.length === 0}
          style={[
            styles.checkBtn,
            picked.length === 0 && styles.checkBtnOff,
            Platform.OS === 'web' && picked.length > 0 ? { boxShadow: `0 4px 0 0 ${Colors.emberDeep}` } as any : {},
          ]}
          onPress={check}
          disabled={picked.length === 0}
          activeOpacity={0.85}
        >
          <Text style={styles.checkText}>CHECK</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

function Tile({ th, rom, showRom, label, onPress, disabled }: {
  th: string; rom: string; showRom: boolean; label: string;
  onPress: () => void; disabled?: boolean;
}) {
  return (
    <TouchableOpacity
      accessibilityRole="button"
      accessibilityLabel={label}
      style={[styles.tile, Platform.OS === 'web' ? { boxShadow: `0 3px 0 0 ${Colors.borderStrong}` } as any : {}]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.75}
    >
      <Text style={styles.tileTh}>{th}</Text>
      {showRom && <Text style={styles.tileRom}>{rom}</Text>}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: 14 },
  tray: {
    minHeight: 76,
    borderWidth: 2,
    borderRadius: 14,
    borderStyle: 'dashed',
    padding: 10,
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 8,
    backgroundColor: Colors.card,
  },
  trayHint: { color: Colors.textMuted, fontSize: 13, fontFamily: Fonts.body, paddingHorizontal: 6 },
  bank: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, justifyContent: 'center' },
  tile: {
    backgroundColor: Colors.card,
    borderWidth: 2,
    borderColor: Colors.borderStrong,
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 12,
    alignItems: 'center',
    marginBottom: 3,
  },
  tileGhost: { backgroundColor: Colors.bgInset, borderColor: Colors.border },
  tileTh: { color: Colors.text, fontSize: 20, fontFamily: Fonts.body, fontWeight: '500' },
  tileRom: { color: Colors.lavenderDark, fontSize: 11, fontFamily: Fonts.mono, marginTop: 1 },
  solution: { alignItems: 'center', gap: 2 },
  solutionLabel: { color: Colors.wrong, fontSize: 9, fontFamily: Fonts.hud, letterSpacing: 2 },
  solutionTh: { color: Colors.text, fontSize: 22, fontFamily: Fonts.body, textAlign: 'center' },
  solutionRom: { color: Colors.lavenderDark, fontSize: 14, fontFamily: Fonts.mono, textAlign: 'center' },
  checkBtn: {
    backgroundColor: Colors.ember,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.borderStrong,
  },
  checkBtnOff: { backgroundColor: Colors.bgInset, borderColor: Colors.border },
  checkText: { color: Colors.onBrand, fontSize: 13, fontFamily: Fonts.hud, letterSpacing: 2 },
});
