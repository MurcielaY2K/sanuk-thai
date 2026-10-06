// Minimal, privacy-respecting product analytics into our own Supabase
// (supabase/analytics.sql). No PII, no third-party trackers: an anonymous
// per-device uuid + a small allowlisted event set, batched every few seconds.
// Fire-and-forget: failures are silently dropped, never block the UI.

import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from './supabase';
import { SUPABASE_CONFIGURED } from '../constants/supabase';

export type AnalyticsEvent =
  | 'app_open' | 'level_picked' | 'lesson_start' | 'lesson_complete'
  | 'lesson_fail' | 'profile_created' | 'email_linked'
  | 'paywall_view' | 'checkout_click';

const DEVICE_KEY = '@thaiapp_device_id';
// Opt-out switch (Profile → "Share anonymous usage data"). Default on; stored
// per device. Legal basis is legitimate interest, which requires a working
// right to object — this is it.
const OPT_OUT_KEY = '@thaiapp_analytics_opt_out';
let deviceId: string | null = null;
let optedOut: boolean | null = null;

async function isOptedOut(): Promise<boolean> {
  if (optedOut === null) optedOut = (await AsyncStorage.getItem(OPT_OUT_KEY)) === 'true';
  return optedOut;
}

export async function getAnalyticsEnabled(): Promise<boolean> {
  return !(await isOptedOut());
}

export async function setAnalyticsEnabled(enabled: boolean): Promise<void> {
  optedOut = !enabled;
  await AsyncStorage.setItem(OPT_OUT_KEY, enabled ? 'false' : 'true');
  if (!enabled) {
    // Drop anything queued and forget the id, so turning it back on later
    // starts a fresh, unlinked identifier.
    queue = [];
    deviceId = null;
    await AsyncStorage.removeItem(DEVICE_KEY);
  }
}
let queue: { device_id: string; event: string; props: Record<string, unknown> }[] = [];
let flushTimer: ReturnType<typeof setTimeout> | null = null;

async function getDeviceId(): Promise<string> {
  if (deviceId) return deviceId;
  let id = await AsyncStorage.getItem(DEVICE_KEY);
  if (!id) {
    id = typeof crypto !== 'undefined' && crypto.randomUUID
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random()}`.padEnd(36, '0').slice(0, 36);
    await AsyncStorage.setItem(DEVICE_KEY, id);
  }
  deviceId = id;
  return id;
}

async function flush() {
  flushTimer = null;
  if (!SUPABASE_CONFIGURED || !supabase || queue.length === 0) return;
  const batch = queue.splice(0, 20);
  try {
    await supabase.from('analytics_events').insert(batch);
  } catch {
    // Dropped on the floor by design — analytics must never hurt the app.
  }
}

export function track(event: AnalyticsEvent, props: Record<string, unknown> = {}): void {
  if (!SUPABASE_CONFIGURED) return;
  isOptedOut()
    .then(out => (out ? null : getDeviceId()))
    .then(id => {
      if (!id) return;
      queue.push({ device_id: id, event, props });
      if (!flushTimer) flushTimer = setTimeout(flush, 4000);
    })
    .catch(() => {});
}
