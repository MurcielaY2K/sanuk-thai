# Sanuk Thai — pre-launch audit

**Date:** 10 September 2026 · **Commit:** `fd482c7` · **Scope:** whole app —
secrets, dependencies, backend/RLS, payments, web layer, app logic, legal,
performance, accessibility, store readiness.

Method: static review of all 15.6k lines of app source + SQL, dependency and
bundle analysis, and runtime testing against a production build (all routes,
lesson flow, paywall state, private packs).

---

## Verdict

The **engineering** is in good shape — the backend trust boundaries, payment
chain and data handling are genuinely well built, and I could not find a way
to forge Premium, read another user's data, or break the webhook.

What stands between here and launch is **two blockers that are not code
quality problems**: a privacy policy that misstates what the app collects,
and a paywall flag that corrupts its own state when flipped. Both are small
fixes; both are worth doing before money changes hands.

| | Count |
|---|---|
| 🔴 Blockers (fix before charging) | 2 |
| 🟠 Important (fix before/around launch) | 4 |
| 🟡 Medium (soon after) | 6 |
| ⚪ Low / notes | 5 |
| ✅ Verified sound | 12 areas |

---

## 🔴 Blockers

### B1 — The privacy policy does not disclose analytics, and contradicts it

`lib/analytics.ts` writes a **persistent per-device UUID** plus nine
behavioural events (`app_open`, `lesson_start`, `lesson_complete`,
`lesson_fail`, `level_picked`, `profile_created`, `email_linked`,
`paywall_view`, `checkout_click`) to your Supabase for **every user**, with no
consent step.

The policy never mentions it. Worse, §1 states:

> "It is not sent to us unless you enable cloud backup (section 3)."

That is inaccurate as written — behavioural events are sent regardless. §6
lists processors (GitHub, Supabase, Stripe, Google Fonts) but omits your own
first-party analytics.

A persistent device identifier tied to behaviour is personal data under GDPR
(Recital 30, online identifiers) and Thailand's PDPA. Publishing a policy that
denies collection you are performing is the kind of thing that turns a small
compliance gap into a real one.

**Fix:** add an "Analytics" section describing the device id, the event list,
the purpose (product improvement), retention, and that it is first-party and
never sold; correct §1's wording. ~20 lines of copy, no code change.

### B2 — `PREMIUM_ON_HOLD` permanently destroys stored paywall state

`store/progressStore.ts` `load()` rewrites every stored `premium-locked`
lesson to `available` in memory while the hold is on, with this comment:

> "stored state is untouched so flipping the flag back restores the paywall"

**That guarantee is false.** The mutated map is the one every later write
persists (`completeLesson`, `openLesson`, `applyPremium`). Reproduced against
a production build:

```
seeded    : {"w3-l1":"premium-locked","w3-l2":"premium-locked","w4-l1":"premium-locked"}
persisted : {"w3-l1":"available","w3-l2":"available","w4-l1":"available", ...}
```

Consequence: when you flip `PREMIUM_ON_HOLD = false` at launch, every paid
lesson a user had already reached stays permanently unlocked on their device —
the flip does not restore the paywall it promises to restore.

Impact today is bounded (during the hold `completeLesson` does not *create*
new `premium-locked` entries, so the exposed set is entries written before the
hold or restored from an older cloud snapshot). But the flag exists precisely
to be flipped, and it does not currently do what it says.

**Fix:** stop mutating the stored map. `getEffectiveState()` in `LearnTab`
already receives `isPremium` — let it treat a stored `premium-locked` as
available when premium is active, and leave `load()` to hydrate verbatim.

---

## 🟠 Important

### I1 — Terms has no governing law, jurisdiction or dispute clause
You are selling to an international audience from Thailand with no stated
governing law and no dispute-resolution mechanism. Standard for any paid
service; also the first thing a payment processor or store reviewer looks for.

### I2 — Accessibility is effectively absent
**1** accessibility prop across **152** `TouchableOpacity` targets. Screen
reader users cannot meaningfully operate the app: nodes, answer buttons, the
tab bar and the audio buttons are all unlabelled. Relevant to store review, to
accessibility law in several markets, and to a chunk of real users.

### I3 — A failed anonymous sign-in silently sells an unlinked subscription
`PremiumModal.openStripe()` attaches the buyer's auth id as
`client_reference_id`, but if Supabase is unreachable it deliberately falls
through and opens checkout **without** it. The webhook then logs
`checkout.session.completed without client_reference_id` and grants nothing —
the customer has paid and has no Premium, and nothing alerts you.

The fallback is the right call (better to take the money than block the sale),
but it needs a safety net: a Stripe dashboard alert or a weekly reconciliation
query for sessions with no `client_reference_id`.

### I4 — No crash reporting will be active at launch
`lib/monitoring.ts` only initialises Sentry when `EXPO_PUBLIC_SENTRY_DSN` is
set at build time, and it is not set. You will launch blind to client-side
crashes. Set the DSN before the first promotion push.

---

## 🟡 Medium

| # | Finding |
|---|---|
| M1 | **Analytics insert is unrated-limited.** `for insert to anon with check (true)` — the event allowlist and 512-byte props cap are good, but nothing caps *volume*. Anyone can pump rows into a free-tier database and distort your funnel. Consider a per-device rate limit or a daily row cap. |
| M2 | **First load is heavy.** 3.5 MB raw / **872 KB gzipped** JS. ~16% is bundled content data; the rest is React Native Web + Expo Router. Thai text is emitted as `\u0eXX` escapes (32,385 of them) — 6 bytes per character instead of 3. Noticeable on Thai mobile networks. |
| M3 | **No Content-Security-Policy.** GitHub Pages cannot set headers, but a `<meta http-equiv>` CSP in `+html.tsx` is possible. Actual XSS risk is low (no `innerHTML` sink touches user data — verified), so this is defence in depth. |
| M4 | **Cloud sync can silently discard progress.** `pullAndMerge` resolves conflicts by "higher XP wins wholesale". A device with lower XP but unique recent lessons loses them with no warning and no undo. Documented as intentional, but it is silent data loss from the user's point of view. |
| M5 | **Private pack content ships in the bundle.** Documented in `docs/PRIVATE_PACKS.md` — obscurity, not security. Fine as long as the renovation pack never contains anything you would mind a curious user reading. |
| M6 | **Dictionary romanization is unreviewed and demonstrably imperfect.** Two garbled entries (`pelin`, `khwam-chuai-elue`) were found by chance while adding words, which implies more. Same native-review pass as the rest of the vocabulary. |

---

## ⚪ Low / notes

- **L1** `review.html` relies on `robots.txt` alone (advisory); no `noindex` meta tag.
- **L2** The on-device error banner in `+html.tsx` prints raw JS errors full-screen to end users. Useful in testing, noisy in production. (It uses `textContent`, so it is not an injection risk.)
- **L3** `@sentry/browser` is a production dependency and is statically bundled even when the DSN is unset.
- **L4** 58 npm advisories (1 critical, 22 high) — **none reach the browser**. Verified package-by-package against the built bundle: `tar`, `cacache`, `postcss`, `undici`, `ws`, `metro` et al. are Expo/Metro CLI tooling only. Still worth `npm audit fix` for your own machine.
- **L5** `node_modules` and the scratchpad were wiped mid-session by the container, not by the repo — unrelated to project health, but it is why a fresh `npm ci` is needed after a cold start.

---

## ✅ Verified sound

Things I specifically tried to break and could not:

- **Secrets** — nothing real in tracked files or in full git history; only placeholder strings in deployment docs. `.gitignore` covers `*.env`, keystores, `.p8`/`.p12`.
- **Entitlements** — no client insert/update/delete policy exists; only the service-role webhook writes. A user cannot grant themselves Premium.
- **Webhook** — verifies the Stripe signature via `constructEventAsync` before touching any data, and returns 400 on failure.
- **Lifetime purchases** — one-time payments produce a null `current_period_end`, and `refreshEntitlement` correctly reads that as "never expires".
- **Checkout linkage** — `client_reference_id` is correctly attached and URL-encoded (see I3 for the failure path).
- **`profiles.auth_id`** — column-level `revoke` keeps it out of client reach while leaving the leaderboard readable.
- **Score tampering** — `clamp_score()` trigger bounds XP/streak/mastered and caps per-sync jumps at +2000, with a pinned `search_path`.
- **`progress_sync`** — owner-only select/insert/update/delete; `my_profile()` is `security definer` with `search_path` pinned and execute revoked from `anon`.
- **Analytics payload** — genuinely no PII: anonymous uuid, allowlisted event names enforced by a CHECK constraint, 512-byte props cap, write-only.
- **XSS** — both `dangerouslySetInnerHTML` blocks are static author strings with no interpolation; the error banner uses `textContent`.
- **Build health** — `tsc --noEmit` clean, vocab validator clean (3,147 words + 217 pack words), web build succeeds.
- **Runtime** — 11/11 smoke checks pass: cold start, onboarding gate, learn path, `/read`, `/write`, `/privacy`, `/terms`, `/refunds`, `/delete-account` all render with **zero console errors**, and a lesson plays to a scored result.

---

## Suggested order

1. B1 privacy copy + B2 paywall-state fix ← *before flipping `PREMIUM_ON_HOLD`*
2. I4 Sentry DSN, I3 unlinked-payment alert ← *before the first promotion push*
3. I1 governing law, M1 analytics rate limit
4. I2 accessibility pass ← *before app-store submission*
5. M2 bundle trim, M6 native review ← *ongoing content work*

Still outstanding from `LAUNCH_PLAN.md` and unverifiable from here (they are
server-side or account-side): Resend domain verification, the Supabase auth
URL configuration, and whether `analytics.sql` has been run.

---

## Resolution status (6 October 2026)

| # | Finding | Status |
|---|---|---|
| B1 | Privacy policy omitted analytics | ✅ Fixed — new §4 discloses the device id, every event, purpose, legal basis and retention; §1 corrected. Made true in code: in-app opt-out (Profile, also on the setup screen) that deletes the device id, and an enforced 13-month purge. |
| B2 | Hold flag laundered paywall state | ✅ Fixed — unlock derived at read time (`effectiveLessonState`); storage is never rewritten. Also closes: a lapsed subscription now re-locks. Verified in browser + 8 unit cases. |
| I1 | No governing law | ✅ Fixed — Terms §10: Thai law and courts, mandatory consumer protections of the user's country preserved. |
| I2 | Accessibility absent | ✅ Fixed — all 66 touchables have roles; 15 icon-only buttons labelled; tabs, lesson nodes, tier picker and opt-out expose state via `aria-*`. Verified: 0 unnamed buttons on Learn. |
| I3 | Unlinked payments lost silently | ✅ Fixed (needs deploy, below) — webhook matches buyers by confirmed email, parks the rest in `unlinked_payments`, and returns 500 on failed writes so Stripe retries. App tells a buyer how to get help if Premium hasn't appeared after 40 s. |
| — | **New:** webhook granted access before payment for delayed methods | ✅ Fixed — checks `payment_status`; grants on `async_payment_succeeded`. |
| — | **New:** webhook ignored database write errors | ✅ Fixed — see I3. |
| I4 | No crash reporting | ⏳ Needs your Sentry DSN (`EXPO_PUBLIC_SENTRY_DSN` at build time). Already disclosed in the privacy policy. |
| M1 | Analytics unrate-limited | ✅ Fixed (needs SQL run) — 300/h per device, 3,000/min global, via a `SECURITY DEFINER` trigger. |
| M2 | Heavy first load | ⏳ Deferred — no functional risk; worth doing before a big promotion push. |
| M3 | No CSP | ✅ Fixed — `scripts/inject-csp.mjs` hashes inline scripts (no `'unsafe-inline'` for script). Verified: 0 violations on all 8 routes; fonts, audio and service worker all load. |
| M4 | Sync silently dropped progress | ✅ Fixed — winner still wins, but completed lessons and best stars are unioned and pushed back. |
| M5 | Private pack in bundle | ✅ By design, documented. |
| M6 | Romanization unreviewed | ⏳ Native-speaker review (content, not code). |
| L1 | `review.html` indexable | ✅ Fixed — `noindex` meta. |
| L2 | Raw errors shown to users | ✅ Fixed — worse than recorded: any stray failed request painted a red banner. Now raw output only with `?debug=1`; users see a reload prompt only if the app fails to start. |
| L3 | Sentry bundled unused | ⏳ Moot once I4 is done. |
| L4 | npm advisories | ⏳ None reach the browser; `npm audit fix` is optional. |

### Actions only you can take
1. **Re-run SQL** in Supabase → SQL Editor: `supabase/analytics.sql` and `supabase/entitlements.sql` (both safe to re-run).
2. **Redeploy the webhook:** `supabase functions deploy stripe-webhook --no-verify-jwt`.
3. **Stripe → Developers → Webhooks:** add the event `checkout.session.async_payment_succeeded` to the endpoint.
4. **Sentry:** create a project, set `EXPO_PUBLIC_SENTRY_DSN`, redeploy.
5. **Decide on early testers:** with B2 fixed, flipping `PREMIUM_ON_HOLD` now really re-locks premium lessons that testers reached but did not finish (completed ones stay replayable). If you want to grandfather them, that needs a deliberate rule, not the old accident.
