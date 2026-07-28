# Private content packs

A private pack is content that ships inside the app but stays invisible until
a device unlocks it. It exists so content can be written and used for real
before it becomes part of the public product.

## Using the renovation pack

**Unlock it on a device** — open this once, on that device:

```
https://murcielay2k.github.io/sanuk-thai/?unlock=reno-8412
```

The code is consumed, saved on the device, and stripped from the address bar.
The pack then stays unlocked on that device until you clear site data.

**Hide it again:**

```
https://murcielay2k.github.io/sanuk-thai/?unlock=lock-all
```

**What appears when unlocked**

| Where | What |
|---|---|
| Learn path | 4 renovation worlds, appended after the public path |
| Read tab | 8 renovation phrasebook tabs (96 situational sentences) |
| Words tab | 217 renovation words + 8 new category filters |

**What stays true when locked** (the default, and what every other user sees):
renovation worlds are absent from the path, its phrasebooks are absent from
Read, its words are absent from the Words tab, and a hand-typed deep link to
`/lesson?lessonId=rv1-l1` is refused by the existing lesson gate.

## ⚠️ What this is not

This hides the pack from the UI. **It does not encrypt it.** The words and
sentences sit in the JavaScript bundle like everything else, so anyone who
opens devtools and reads the bundle can find them. It is privacy by
obscurity — right for "not finished yet", wrong for anything actually secret.

If content ever genuinely must not ship to users, it has to be fetched from
the server behind an authenticated request instead of bundled.

## Launching a pack publicly

One switch, in `constants/privatePacks.ts`:

```ts
export const PACK_PUBLIC: Record<PackId, boolean> = {
  renovation: true,   // was false
};
```

Then `npm run deploy:web`. Every user gets it; no unlock code needed.

**Before doing that**, the pack should get the same treatment as the rest of
the vocabulary: it is machine-authored and has never had a native-speaker
review pass. Export it through `review.html` and have it checked — a
renovation vocabulary with wrong tone marks is worse than no renovation
vocabulary.

## How it is wired

| File | Role |
|---|---|
| `data/renovation.ts` | the content: 217 words, 96 sentences, world/lesson plan |
| `constants/privatePacks.ts` | unlock codes + the public launch switch |
| `store/packStore.ts` | reads/writes unlock state, consumes `?unlock=` |
| `data/worlds.ts` | builds `PRIVATE_WORLDS` — kept out of `WORLDS`/`ALL_LESSONS` |

Two deliberate isolation rules make the pack safe to ship locked:

1. **Separate progression chain.** Private worlds are not in `ALL_LESSONS`, so
   finishing the last public lesson can never spill a learner into private
   content. `getNextLesson` advances within whichever chain the lesson
   belongs to.
2. **Separate distractor pool.** `buildQuestions` picks answers *and* wrong
   answers from the lesson's own pool, so a public lesson never shows a
   renovation word as a distractor (which would both leak the pack and make
   the wrong answer obvious).

Adding another pack means: a new `PackId`, a data file, a `PRIVATE_WORLDS`
builder entry, and an unlock code.
