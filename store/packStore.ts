import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import { StorageKeys } from '../constants/storageKeys';
import {
  PackId, PACK_PUBLIC, PACK_UNLOCK_CODES, LOCK_ALL_CODE, UNLOCK_PARAM,
} from '../constants/privatePacks';

interface PackStore {
  unlocked: PackId[];
  isLoaded: boolean;
  load: () => Promise<void>;
  isVisible: (pack: PackId) => boolean;
  setUnlocked: (pack: PackId, on: boolean) => Promise<void>;
}

// Reads ?unlock=<code> once on web, applies it, and strips it from the URL so
// the code isn't left sitting in the address bar / browser history entry.
function consumeUnlockParam(): { unlock?: PackId; lockAll?: boolean } {
  if (Platform.OS !== 'web' || typeof window === 'undefined') return {};
  try {
    const params = new URLSearchParams(window.location.search);
    const code = params.get(UNLOCK_PARAM);
    if (!code) return {};
    // Strip now, and again after the router has finished hydrating — expo-router
    // re-syncs the address bar from its own state during startup and would
    // otherwise put the code straight back.
    const strip = () => {
      try {
        const cur = new URLSearchParams(window.location.search);
        if (!cur.has(UNLOCK_PARAM)) return;
        cur.delete(UNLOCK_PARAM);
        const qs = cur.toString();
        window.history.replaceState({}, '', window.location.pathname + (qs ? `?${qs}` : ''));
      } catch { /* address bar is cosmetic — never block unlocking on it */ }
    };
    strip();
    setTimeout(strip, 600);
    setTimeout(strip, 2000);
    if (code === LOCK_ALL_CODE) return { lockAll: true };
    const pack = PACK_UNLOCK_CODES[code];
    return pack ? { unlock: pack } : {};
  } catch {
    return {};
  }
}

export const usePackStore = create<PackStore>((set, get) => ({
  unlocked: [],
  isLoaded: false,

  load: async () => {
    let unlocked: PackId[] = [];
    try {
      const raw = await AsyncStorage.getItem(StorageKeys.unlockedPacks);
      const parsed: unknown = raw ? JSON.parse(raw) : [];
      if (Array.isArray(parsed)) {
        unlocked = parsed.filter((p): p is PackId => p === 'renovation');
      }
    } catch {
      // Unreadable/corrupt value — treat as nothing unlocked.
    }

    const { unlock, lockAll } = consumeUnlockParam();
    if (lockAll) unlocked = [];
    else if (unlock && !unlocked.includes(unlock)) unlocked = [...unlocked, unlock];

    if (unlock || lockAll) {
      await AsyncStorage.setItem(StorageKeys.unlockedPacks, JSON.stringify(unlocked)).catch(() => {});
    }
    set({ unlocked, isLoaded: true });
  },

  // A pack is visible if it has gone public, or this device unlocked it.
  isVisible: (pack) => PACK_PUBLIC[pack] || get().unlocked.includes(pack),

  setUnlocked: async (pack, on) => {
    const next = on
      ? [...new Set([...get().unlocked, pack])]
      : get().unlocked.filter(p => p !== pack);
    set({ unlocked: next });
    await AsyncStorage.setItem(StorageKeys.unlockedPacks, JSON.stringify(next)).catch(() => {});
  },
}));

// Non-reactive read for module-level/imperative call sites.
export function packVisible(pack: PackId): boolean {
  return usePackStore.getState().isVisible(pack);
}
