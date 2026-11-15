import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StorageKeys } from '../constants/storageKeys';
import type { SpeakerGender } from '../data/conversations';

// Small per-device preferences that aren't progress.
interface PrefsStore {
  // null until the learner has chosen — the conversation intro asks once.
  speakerGender: SpeakerGender | null;
  isLoaded: boolean;
  load: () => Promise<void>;
  setSpeakerGender: (g: SpeakerGender) => void;
}

export const usePrefsStore = create<PrefsStore>((set) => ({
  speakerGender: null,
  isLoaded: false,

  load: async () => {
    try {
      const raw = await AsyncStorage.getItem(StorageKeys.speakerGender);
      set({ speakerGender: raw === 'm' || raw === 'f' ? raw : null, isLoaded: true });
    } catch {
      set({ isLoaded: true });
    }
  },

  setSpeakerGender: (g) => {
    set({ speakerGender: g });
    AsyncStorage.setItem(StorageKeys.speakerGender, g).catch(() => {});
  },
}));
