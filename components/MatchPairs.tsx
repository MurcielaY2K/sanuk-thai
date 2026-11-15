import React, { useMemo, useRef, useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { Colors } from '../constants/colors';
import { Fonts } from '../constants/typography';
import { speakThai } from '../lib/audio';

export interface MatchPair { id: string; th: string; rom: string; en: string }

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// "Match the pairs" exercise: tap a Thai word, then its meaning (or the other
// way round). Calls onDone with the number of wrong pairings once every pair
// is matched. Mount with a fresh `key` per exercise.
export default function MatchPairs({ pairs, showRom, onDone }: {
  pairs: MatchPair[];
  showRom: boolean;
  onDone: (mistakes: number) => void;
}) {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const left = useMemo(() => shuffle(pairs), []);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const right = useMemo(() => shuffle(pairs), []);
  const [selTh, setSelTh] = useState<string | null>(null);
  const [selEn, setSelEn] = useState<string | null>(null);
  const [matched, setMatched] = useState<string[]>([]);
  const [wrong, setWrong] = useState<{ th: string; en: string } | null>(null);
  const mistakes = useRef(0);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);

  const tryPair = (th: string | null, en: string | null) => {
    if (!th || !en) return;
    if (th === en) {
      const next = [...matched, th];
      setMatched(next);
      setSelTh(null); setSelEn(null);
      if (next.length === pairs.length) {
        timer.current = setTimeout(() => onDone(mistakes.current), 500);
      }
    } else {
      mistakes.current += 1;
      setWrong({ th, en });
      timer.current = setTimeout(() => { setWrong(null); setSelTh(null); setSelEn(null); }, 550);
    }
  };

  const tapTh = (p: MatchPair) => {
    if (wrong || matched.includes(p.id)) return;
    speakThai(p.th);
    setSelTh(p.id);
    tryPair(p.id, selEn);
  };
  const tapEn = (p: MatchPair) => {
    if (wrong || matched.includes(p.id)) return;
    setSelEn(p.id);
    tryPair(selTh, p.id);
  };

  const cellStyle = (id: string, selected: boolean, isWrong: boolean) => {
    if (matched.includes(id)) return { backgroundColor: Colors.correctBg, borderColor: Colors.correct, opacity: 0.55 };
    if (isWrong) return { backgroundColor: Colors.wrongBg, borderColor: Colors.wrong };
    if (selected) return { backgroundColor: Colors.realmGrove, borderColor: Colors.borderStrong };
    return { backgroundColor: Colors.card, borderColor: Colors.borderStrong };
  };

  return (
    <View style={styles.grid}>
      <View style={styles.col}>
        {left.map(p => (
          <TouchableOpacity
            key={p.id}
            accessibilityRole="button"
            accessibilityLabel={`Thai: ${p.th}`}
            accessibilityState={{ selected: selTh === p.id, disabled: matched.includes(p.id) }}
            aria-selected={selTh === p.id}
            aria-disabled={matched.includes(p.id)}
            style={[styles.cell, cellStyle(p.id, selTh === p.id, wrong?.th === p.id),
              Platform.OS === 'web' && !matched.includes(p.id) ? { boxShadow: `0 3px 0 0 ${Colors.borderStrong}` } as any : {}]}
            onPress={() => tapTh(p)}
            disabled={matched.includes(p.id)}
            activeOpacity={0.8}
          >
            <Text style={styles.th}>{p.th}</Text>
            {showRom && <Text style={styles.rom}>{p.rom}</Text>}
          </TouchableOpacity>
        ))}
      </View>
      <View style={styles.col}>
        {right.map(p => (
          <TouchableOpacity
            key={p.id}
            accessibilityRole="button"
            accessibilityLabel={`Meaning: ${p.en}`}
            accessibilityState={{ selected: selEn === p.id, disabled: matched.includes(p.id) }}
            aria-selected={selEn === p.id}
            aria-disabled={matched.includes(p.id)}
            style={[styles.cell, cellStyle(p.id, selEn === p.id, wrong?.en === p.id),
              Platform.OS === 'web' && !matched.includes(p.id) ? { boxShadow: `0 3px 0 0 ${Colors.borderStrong}` } as any : {}]}
            onPress={() => tapEn(p)}
            disabled={matched.includes(p.id)}
            activeOpacity={0.8}
          >
            <Text style={styles.en} numberOfLines={2}>{p.en}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  grid: { flexDirection: 'row', gap: 12 },
  col: { flex: 1, gap: 10 },
  cell: {
    minHeight: 62,
    borderWidth: 2,
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 3,
  },
  th: { color: Colors.text, fontSize: 22, fontFamily: Fonts.body, fontWeight: '500', textAlign: 'center' },
  rom: { color: Colors.lavenderDark, fontSize: 11, fontFamily: Fonts.mono, marginTop: 1 },
  en: { color: Colors.text, fontSize: 14, fontFamily: Fonts.body, fontWeight: '600', textAlign: 'center' },
});
