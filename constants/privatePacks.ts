// ─────────────────────────────────────────────────────────────────────────────
// PRIVATE CONTENT PACKS
//
// A private pack is content that ships in the app but stays invisible until
// the device unlocks it. Used for content that is being written/used by the
// author before it is ready to be part of the public product.
//
// Two independent switches:
//   1. PACK_PUBLIC[id] = true    → the pack is live for everyone (the launch
//                                  switch; flip it and deploy).
//   2. an unlock code on a device → the pack is visible on that device only.
//
// ⚠️ HONEST LIMITATION: this hides the pack from the UI, it does not encrypt
// it. The words and sentences are inside the JavaScript bundle like the rest
// of the app, so anyone who opens devtools and reads the bundle can find them.
// It is privacy-by-obscurity — fine for "not finished yet", not a secret vault.
// ─────────────────────────────────────────────────────────────────────────────

export type PackId = 'renovation';

// Flip to true (and deploy) to launch a pack publicly for all users.
export const PACK_PUBLIC: Record<PackId, boolean> = {
  renovation: false,
};

// Per-device unlock codes. Visit the app once with ?unlock=<code> appended to
// the URL — e.g.  https://murcielay2k.github.io/sanuk-thai/?unlock=reno-8412
// The code is consumed, stored on the device, and stripped from the address
// bar. Enter 'lock-all' to hide every private pack again.
export const PACK_UNLOCK_CODES: Record<string, PackId> = {
  'reno-8412': 'renovation',
};

export const LOCK_ALL_CODE = 'lock-all';
export const UNLOCK_PARAM = 'unlock';
