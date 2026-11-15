import type { Sentence, Token } from './reading';

// Real-life conversations, played turn by turn on the Learn path
// (app/conversation.tsx). The learner takes the "you" side: for each of their
// turns they either pick the right reply or build it from word tiles.
//
// Thai marks the SPEAKER's gender in polite particles and in "I", so every
// "you" line carries both forms: the token's own th/rom is what a man says,
// and `f` is what a woman says. The learner picks which one they are once
// (store/prefsStore.ts) and resolveLine() applies it. NPC lines are fixed —
// they speak as whoever they are.
//
// Romanization follows data/phrases.ts (ɔ ɛ ɯ ɤ, doubled long vowels, tone
// marks). scripts/validate-conversations.mjs checks structure and consistency.

export interface ConvToken extends Token {
  f?: { th: string; rom: string };   // female-speaker form ("you" lines only)
}

export interface ConvLine {
  who: 'you' | 'npc';
  tokens: ConvToken[];
  en: string;
}

export interface Conversation {
  id: string;
  worldId: string;       // base world (w1…w17) whose header the card sits under
  unlockAfter: number;   // completed lessons in that world needed to unlock
  title: string;
  icon: string;
  setting: string;       // one-line scene description
  npc: string;           // who you are talking to
  lines: ConvLine[];
}

export type SpeakerGender = 'm' | 'f';

const w = (th: string, rom: string, en: string): ConvToken => ({ th, rom, en });

// ── Polite particles and "I" ────────────────────────────────────────────────
// Learner ("you") forms: male by default, female in `f`.
// A woman says ค่ะ (falling) after statements but คะ (high) after questions
// and after นะ — the two are not interchangeable.
const KS: ConvToken = { th: 'ครับ', rom: 'khráp', en: '[polite particle]', f: { th: 'ค่ะ', rom: 'khâ' } };
const KQ: ConvToken = { th: 'ครับ', rom: 'khráp', en: '[polite particle]', f: { th: 'คะ', rom: 'khá' } };
const I:  ConvToken = { th: 'ผม', rom: 'phǒm', en: 'I', f: { th: 'ฉัน', rom: 'chǎn' } };
// NPC forms (fixed).
const FS = w('ค่ะ', 'khâ', '[polite particle, female]');
const FQ = w('คะ', 'khá', '[polite particle, female, question]');
const MS = w('ครับ', 'khráp', '[polite particle, male]');

const you = (en: string, ...tokens: ConvToken[]): ConvLine => ({ who: 'you', tokens, en });
const npc = (en: string, ...tokens: ConvToken[]): ConvLine => ({ who: 'npc', tokens, en });

// ── Shared words (one definition each, so readings never drift) ─────────────
const W = {
  hello:    w('สวัสดี', 'sà-wàt-dii', 'hello'),
  khun:     w('คุณ', 'khun', 'you'),
  arai:     w('อะไร', 'à-rai', 'what'),
  mai:      w('ไหม', 'mǎi', '[question particle]'),
  not:      w('ไม่', 'mâi', 'not'),
  thanks:   w('ขอบคุณ', 'khɔ̀ɔp-khun', 'thank you'),
  maak:     w('มาก', 'mâak', 'very / a lot'),
  khor:     w('ขอ', 'khɔ̌ɔ', 'may I have'),
  dai:      w('ได้', 'dâai', 'can / OK'),
  dii:      w('ดี', 'dii', 'good'),
  mii:      w('มี', 'mii', 'have / there is'),
  pai:      w('ไป', 'pai', 'go'),
  maa:      w('มา', 'maa', 'come'),
  yuu:      w('อยู่', 'yùu', 'to be (located)'),
  where:    w('ที่ไหน', 'thîi-nǎi', 'where'),
  howMuch:  w('เท่าไหร่', 'thâo-rài', 'how much'),
  baht:     w('บาท', 'bàat', 'baht'),
  one:      w('หนึ่ง', 'nɯ̀ng', 'one'),
  two:      w('สอง', 'sɔ̌ɔng', 'two'),
  six:      w('หก', 'hòk', 'six'),
  kii:      w('กี่', 'kìi', 'how many'),
  khon:     w('คน', 'khon', 'person / people'),
  na:       w('นะ', 'ná', '[softening particle]'),
  duay:     w('ด้วย', 'dûay', 'please / also'),
  kan:      w('กัน', 'kan', 'together'),
  here:     w('ที่นี่', 'thîi-nîi', 'here'),
  thii:     w('ที่', 'thîi', 'at'),
  kin:      w('กิน', 'kin', 'eat'),
  naam:     w('น้ำ', 'náam', 'water / drink'),
  rap:      w('รับ', 'ráp', 'take / receive'),
  chop:     w('ชอบ', 'chɔ̂ɔp', 'like'),
  len:      w('เล่น', 'lên', 'play'),
  yaak:     w('อยาก', 'yàak', 'want to'),
  tomorrow: w('พรุ่งนี้', 'phrûng-níi', 'tomorrow'),
  moong:    w('โมง', 'moong', "o'clock"),
  yen:      w('เย็น', 'yen', 'evening'),
  far:      w('ไกล', 'klai', 'far'),
  walk:     w('เดิน', 'dɤɤn', 'walk'),
  minute:   w('นาที', 'naa-thii', 'minute'),
  about:    w('ประมาณ', 'prà-maan', 'about'),
  england:  w('อังกฤษ', 'ang-krìt', 'England'),
  speak:    w('พูด', 'phûut', 'speak'),
  this:     w('นี้', 'níi', 'this'),
  nii:      w('นี่', 'nîi', 'here you are / this'),
  price:    w('ราคา', 'raa-khaa', 'price'),
  kilo:     w('กิโล', 'kì-loo', 'kilo'),
  la:       w('ละ', 'lá', 'per'),
  sanuk:    w('สนุก', 'sà-nùk', 'fun'),
  songkran: w('สงกรานต์', 'sǒng-kraan', 'Songkran (Thai New Year)'),
  month:    w('เดือน', 'dɯan', 'month'),
  every:    w('ทุก', 'thúk', 'every'),
  saturday: w('วันเสาร์', 'wan-sǎo', 'Saturday'),
  work:     w('ทำงาน', 'tham-ngaan', 'to work'),
  hour:     w('ชั่วโมง', 'chûa-moong', 'hour'),
  exchange: w('แลก', 'lɛ̂ɛk', 'exchange'),
  food:     w('อาหาร', 'aa-hǎan', 'food / meal'),
  aroi:     w('อร่อย', 'à-rɔ̀i', 'delicious'),
  spicy:    w('เผ็ด', 'phèt', 'spicy'),
  sweet:    w('หวาน', 'wǎan', 'sweet'),
  busy:     w('ยุ่ง', 'yûng', 'busy'),
  ever:     w('เคย', 'khɤɤi', 'ever / have done before'),
  free:     w('ว่าง', 'wâang', 'free (not busy)'),
  sister:   w('น้องสาว', 'nɔ́ɔng-sǎao', 'younger sister'),
  nice:     w('ยินดี', 'yin-dii', 'pleased'),
  thiiRel:  w('ที่', 'thîi', 'that / to'),
  daiGot:   w('ได้', 'dâai', 'get to'),
  know:     w('รู้จัก', 'rúu-jàk', 'know (someone)'),
  name:     w('ชื่อ', 'chɯ̂ɯ', 'name / be called'),
  rain:     w('ฝน', 'fǒn', 'rain'),
  fall:     w('ตก', 'tòk', 'fall'),
  will:     w('จะ', 'jà', 'will'),
};

export const CONVERSATIONS: Conversation[] = [
  // ── w1 Survival Thai ──────────────────────────────────────────────────────
  {
    id: 'meet', worldId: 'w1', unlockAfter: 2,
    title: 'Meeting Someone', icon: '🤝',
    setting: 'You meet Ploy at a café in Bangkok.', npc: 'Ploy',
    lines: [
      npc('Hello.', W.hello, FS),
      you('Hello.', W.hello, KS),
      npc("What's your name?", W.khun, W.name, W.arai, FQ),
      you('My name is Sam.', I, W.name, w('แซม', 'sɛɛm', 'Sam'), KS),
      npc('Nice to meet you.', W.nice, W.thiiRel, W.daiGot, W.know, FS),
      you('Nice to meet you too.', W.nice, W.thiiRel, W.daiGot, W.know, w('เช่นกัน', 'chên-kan', 'as well'), KS),
    ],
  },
  {
    id: 'from', worldId: 'w1', unlockAfter: 4,
    title: 'Where Are You From?', icon: '🌏',
    setting: 'Ploy is curious about you.', npc: 'Ploy',
    lines: [
      npc('Where are you from?', W.khun, W.maa, w('จาก', 'jàak', 'from'), w('ไหน', 'nǎi', 'where / which'), FQ),
      you("I'm from England.", I, W.maa, w('จาก', 'jàak', 'from'), W.england, KS),
      npc('Can you speak Thai?', W.khun, W.speak, w('ภาษาไทย', 'phaa-sǎa-thai', 'Thai language'), W.dai, W.mai, FQ),
      you('I can speak a little.', W.speak, W.dai, w('นิดหน่อย', 'nít-nɔ̀i', 'a little'), KS),
      npc('You speak very well.', W.khun, W.speak, w('เก่ง', 'kèng', 'skilled / well'), W.maak, FS),
      you('Thank you.', W.thanks, KS),
    ],
  },

  // ── w2 Food & Flavors ─────────────────────────────────────────────────────
  {
    id: 'stall', worldId: 'w2', unlockAfter: 2,
    title: 'Street Food Stall', icon: '🍜',
    setting: 'You order lunch at a street stall.', npc: 'Vendor',
    lines: [
      npc('What would you like?', W.rap, W.arai, W.dii, FQ),
      you('One pad thai, please.', W.khor, w('ผัดไทย', 'phàt-thai', 'pad thai'), W.one, w('จาน', 'jaan', 'plate'), KS),
      npc('Spicy?', W.spicy, W.mai, FQ),
      you('Not spicy.', W.not, W.spicy, KS),
      npc('Eat here or take away?', W.kin, W.here, w('หรือ', 'rɯ̌ɯ', 'or'), w('กลับบ้าน', 'klàp-bâan', 'take home'), FQ),
      you('Eat here.', W.kin, W.here, KS),
    ],
  },
  {
    id: 'bill', worldId: 'w2', unlockAfter: 4,
    title: 'Paying the Bill', icon: '💵',
    setting: 'You have finished eating and want to pay.', npc: 'Waiter',
    lines: [
      you('The bill, please.', w('เก็บเงิน', 'kèp-ngɤn', 'collect the money (the bill)'), W.duay, KS),
      npc("That's 200 baht altogether.", w('ทั้งหมด', 'tháng-mòt', 'altogether'), w('สองร้อย', 'sɔ̌ɔng-rɔ́ɔi', 'two hundred'), W.baht, MS),
      you('Here you are.', W.nii, KS),
      npc('Was the food good?', W.food, W.aroi, W.mai, MS),
      you('Very delicious.', W.aroi, W.maak, KS),
      npc('Thank you.', W.thanks, MS),
    ],
  },

  // ── w3 Bangkok Life ───────────────────────────────────────────────────────
  {
    id: 'taxi', worldId: 'w3', unlockAfter: 2,
    title: 'Taking a Taxi', icon: '🚕',
    setting: 'You flag down a taxi.', npc: 'Driver',
    lines: [
      you('Will you go to Siam?', W.pai, w('สยาม', 'sà-yǎam', 'Siam'), W.mai, KQ),
      npc('Yes, I will.', W.pai, MS),
      you('Please turn on the meter.', w('เปิด', 'pɤ̀ɤt', 'open / turn on'), w('มิเตอร์', 'mí-tɤ̂ɤ', 'meter'), W.duay, W.na, KQ),
      npc('Sure.', W.dai, MS),
      you('Stop right here.', w('จอด', 'jɔ̀ɔt', 'stop / park'), w('ตรงนี้', 'trong-níi', 'right here'), KS),
      npc('100 baht.', w('หนึ่งร้อย', 'nɯ̀ng-rɔ́ɔi', 'one hundred'), W.baht, MS),
    ],
  },
  {
    id: 'directions', worldId: 'w3', unlockAfter: 4,
    title: 'Asking Directions', icon: '🧭',
    setting: 'You are looking for the skytrain.', npc: 'Passer-by',
    lines: [
      you('Excuse me, where is the skytrain station?',
        w('ขอโทษ', 'khɔ̌ɔ-thôot', 'excuse me / sorry'), KS,
        w('สถานี', 'sà-thǎa-nii', 'station'), w('รถไฟฟ้า', 'rót-fai-fáa', 'skytrain'), W.yuu, W.where, KQ),
      npc('Go straight, then turn left.', w('ตรงไป', 'trong-pai', 'go straight'), w('แล้ว', 'lɛ́ɛw', 'then'), w('เลี้ยว', 'líaw', 'turn'), w('ซ้าย', 'sáai', 'left'), FS),
      you('Is it far?', W.far, W.mai, KQ),
      npc('Not far. A five-minute walk.', W.not, W.far, FS, W.walk, w('ห้า', 'hâa', 'five'), W.minute),
      you('Thank you very much.', W.thanks, W.maak, KS),
      npc("You're welcome.", w('ไม่เป็นไร', 'mâi-pen-rai', "you're welcome / never mind"), FS),
    ],
  },

  // ── w4 Social Thai ────────────────────────────────────────────────────────
  {
    id: 'family', worldId: 'w4', unlockAfter: 2,
    title: 'Talking About Family', icon: '👨‍👩‍👧',
    setting: 'Your friend Nok asks about your family.', npc: 'Nok',
    lines: [
      npc('Do you have any siblings?', W.khun, W.mii, w('พี่น้อง', 'phîi-nɔ́ɔng', 'siblings'), W.mai, FQ),
      you('Yes. I have one younger sister.', W.mii, KS, I, W.mii, W.sister, W.one, W.khon),
      npc('How old is your sister?', W.sister, w('อายุ', 'aa-yú', 'age'), W.howMuch, FQ),
      you('Twenty years old.', w('ยี่สิบ', 'yîi-sìp', 'twenty'), w('ปี', 'pii', 'year'), KS),
      npc('Where does your family live?', w('ครอบครัว', 'khrɔ̂ɔp-khrua', 'family'), W.khun, W.yuu, W.where, FQ),
      you('In England.', W.yuu, W.thii, W.england, KS),
    ],
  },

  // ── w5 Fluency Path ───────────────────────────────────────────────────────
  {
    id: 'plans', worldId: 'w5', unlockAfter: 2,
    title: 'Making Plans', icon: '🎬',
    setting: 'Nok wants to do something tomorrow.', npc: 'Nok',
    lines: [
      npc('Are you free tomorrow?', W.tomorrow, W.khun, W.free, W.mai, FQ),
      you("Yes, I'm free.", W.free, KS),
      npc('Shall we go see a movie?', W.pai, w('ดู', 'duu', 'watch'), w('หนัง', 'nǎng', 'movie'), W.kan, W.mai, FQ),
      you('Sounds good. What time?', W.dii, KS, W.kii, W.moong, KQ),
      npc('Six in the evening.', W.six, W.moong, W.yen, FS),
      you('OK, see you tomorrow.', w('โอเค', 'oo-khee', 'OK'), KS, w('เจอ', 'jɤɤ', 'meet'), W.kan, W.tomorrow),
    ],
  },

  // ── w6 At Home ────────────────────────────────────────────────────────────
  {
    id: 'visit', worldId: 'w6', unlockAfter: 2,
    title: "Visiting a Friend's Home", icon: '🏠',
    setting: 'You arrive at a Thai friend\'s house.', npc: 'Host',
    lines: [
      npc('Please come in.', w('เชิญ', 'chɤɤn', 'please (inviting)'), w('เข้า', 'khâo', 'enter'), W.maa, FS),
      you('Thank you. The house is very beautiful.', W.thanks, KS, w('บ้าน', 'bâan', 'house'), w('สวย', 'sǔay', 'beautiful'), W.maak),
      npc('Would you like some water?', w('ดื่ม', 'dɯ̀ɯm', 'drink'), W.naam, W.mai, FQ),
      you('Cold water, please.', W.khor, w('น้ำเย็น', 'náam-yen', 'cold water'), KS),
      npc('Have a seat.', w('นั่ง', 'nâng', 'sit'), w('ก่อน', 'kɔ̀ɔn', 'first'), W.na, FQ),
      you('Yes, thank you.', KS, W.thanks, KS),
    ],
  },

  // ── w7 Shopping Spree ─────────────────────────────────────────────────────
  {
    id: 'shirt', worldId: 'w7', unlockAfter: 2,
    title: 'Buying a Shirt', icon: '👕',
    setting: 'You are bargaining at a market stall.', npc: 'Seller',
    lines: [
      you('How much is this shirt?', w('เสื้อ', 'sɯ̂a', 'shirt'), w('ตัว', 'tua', '[classifier for clothes]'), W.this, W.price, W.howMuch, KQ),
      npc('300 baht.', w('สามร้อย', 'sǎam-rɔ́ɔi', 'three hundred'), W.baht, FS),
      you('Too expensive. Can you lower the price?', w('แพง', 'phɛɛng', 'expensive'), w('ไป', 'pai', 'too (after an adjective)'), KS, w('ลด', 'lót', 'reduce'), W.dai, W.mai, KQ),
      npc('250 is OK.', w('สองร้อยห้าสิบ', 'sɔ̌ɔng-rɔ́ɔi-hâa-sìp', 'two hundred and fifty'), W.dai, FS),
      you('Do you have a large size?', W.mii, w('ไซซ์', 'sái', 'size'), w('ใหญ่', 'yài', 'big'), W.mai, KQ),
      npc('Yes, we do.', W.mii, FS),
    ],
  },

  // ── w8 Fresh Market ───────────────────────────────────────────────────────
  {
    id: 'mango', worldId: 'w8', unlockAfter: 2,
    title: 'Buying Mangoes', icon: '🥭',
    setting: 'You stop at a fruit stall in the fresh market.', npc: 'Vendor',
    lines: [
      you('How much are mangoes per kilo?', w('มะม่วง', 'má-mûang', 'mango'), W.kilo, W.la, W.howMuch, KQ),
      npc('60 baht a kilo.', W.kilo, W.la, w('หกสิบ', 'hòk-sìp', 'sixty'), W.baht, FS),
      you('Are they sweet?', W.sweet, W.mai, KQ),
      npc('Very sweet.', W.sweet, W.maak, FS),
      you("I'll take two kilos.", w('เอา', 'ao', 'take / want'), W.two, W.kilo, KS),
      npc('120 baht.', w('หนึ่งร้อยยี่สิบ', 'nɯ̀ng-rɔ́ɔi-yîi-sìp', 'one hundred and twenty'), W.baht, FS),
    ],
  },

  // ── w9 Food Adventures ────────────────────────────────────────────────────
  {
    id: 'restaurant', worldId: 'w9', unlockAfter: 2,
    title: 'At a Restaurant', icon: '🍲',
    setting: 'You walk into a restaurant with a friend.', npc: 'Waitress',
    lines: [
      npc('How many people?', W.kii, w('ท่าน', 'thân', 'person (polite, for guests)'), FQ),
      you('Two people.', W.two, W.khon, KS),
      npc('What would you like to order?', W.will, w('สั่ง', 'sàng', 'order'), W.arai, W.dii, FQ),
      you('Tom yum goong and steamed rice, please.', W.khor, w('ต้มยำกุ้ง', 'tôm-yam-kûng', 'tom yum goong (spicy prawn soup)'), w('กับ', 'kàp', 'and / with'), w('ข้าวสวย', 'khâao-sǔay', 'steamed rice'), KS),
      npc('What would you like to drink?', W.rap, W.naam, W.arai, FQ),
      you('One bottle of water, please.', W.khor, w('น้ำเปล่า', 'náam-plàao', 'plain water'), W.one, w('ขวด', 'khùat', 'bottle'), KS),
    ],
  },

  // ── w10 On the Move ───────────────────────────────────────────────────────
  {
    id: 'ticket', worldId: 'w10', unlockAfter: 2,
    title: 'Buying a Train Ticket', icon: '🚆',
    setting: 'You are at the ticket counter in Bangkok.', npc: 'Clerk',
    lines: [
      you('One ticket to Chiang Mai, please.', W.khor, w('ตั๋ว', 'tǔa', 'ticket'), W.pai, w('เชียงใหม่', 'chiang-mài', 'Chiang Mai'), W.one, w('ใบ', 'bai', '[classifier for tickets]'), KS),
      npc('Which day?', W.pai, w('วัน', 'wan', 'day'), w('ไหน', 'nǎi', 'where / which'), MS),
      you('Tomorrow.', W.tomorrow, KS),
      npc('The train leaves at 6 pm.', w('รถไฟ', 'rót-fai', 'train'), w('ออก', 'ɔ̀ɔk', 'leave / depart'), W.six, W.moong, W.yen, MS),
      you('How many hours does it take?', w('ใช้', 'chái', 'use'), w('เวลา', 'wee-laa', 'time'), W.kii, W.hour, KQ),
      npc('About twelve hours.', W.about, w('สิบสอง', 'sìp-sɔ̌ɔng', 'twelve'), W.hour, MS),
    ],
  },

  // ── w11 City Life ─────────────────────────────────────────────────────────
  {
    id: 'money', worldId: 'w11', unlockAfter: 2,
    title: 'Exchanging Money', icon: '🏦',
    setting: 'You are at a currency exchange counter.', npc: 'Teller',
    lines: [
      you("I'd like to exchange money.", I, W.yaak, W.exchange, w('เงิน', 'ngɤn', 'money'), KS),
      npc('How much?', W.exchange, W.howMuch, FQ),
      you('100 dollars.', w('หนึ่งร้อย', 'nɯ̀ng-rɔ́ɔi', 'one hundred'), w('ดอลลาร์', 'dɔn-lâa', 'dollars'), KS),
      npc('May I see your passport?', W.khor, w('ดู', 'duu', 'look at'), w('พาสปอร์ต', 'pháat-sà-pɔ̀ɔt', 'passport'), w('หน่อย', 'nɔ̀i', 'a little (softens a request)'), FS),
      you('Here you are.', W.nii, KS),
      npc('All done.', w('เรียบร้อย', 'rîap-rɔ́ɔi', 'done / in order'), w('แล้ว', 'lɛ́ɛw', 'already'), FS),
    ],
  },

  // ── w12 Body & Health ─────────────────────────────────────────────────────
  {
    id: 'pharmacy', worldId: 'w12', unlockAfter: 2,
    title: 'At the Pharmacy', icon: '💊',
    setting: 'You are not feeling well and visit a pharmacy.', npc: 'Pharmacist',
    lines: [
      npc("What's the problem?", w('เป็น', 'pen', 'to be / have (a condition)'), W.arai, W.maa, FQ),
      you('I have a headache.', I, w('ปวด', 'pùat', 'ache'), w('หัว', 'hǔa', 'head'), KS),
      npc('Do you have a fever?', W.mii, w('ไข้', 'khâi', 'fever'), W.mai, FQ),
      you("No, I don't.", W.not, W.mii, KS),
      npc('Take this medicine after meals.', W.kin, w('ยา', 'yaa', 'medicine'), W.this, w('หลัง', 'lǎng', 'after'), W.food, W.na, FQ),
      you('How much is it?', W.price, W.howMuch, KQ),
    ],
  },

  // ── w13 Sport & Fitness ───────────────────────────────────────────────────
  {
    id: 'football', worldId: 'w13', unlockAfter: 2,
    title: 'Talking About Sport', icon: '⚽',
    setting: 'A colleague, Ton, asks what you do for exercise.', npc: 'Ton',
    lines: [
      npc('What sports do you like to play?', W.khun, W.chop, W.len, w('กีฬา', 'kii-laa', 'sport'), W.arai, MS),
      you('I like playing football.', I, W.chop, W.len, w('ฟุตบอล', 'fút-bɔɔn', 'football'), KS),
      npc('Do you play often?', W.len, w('บ่อย', 'bɔ̀i', 'often'), W.mai, MS),
      you('Every Saturday.', W.every, W.saturday, KS),
      npc('Want to play together this Saturday?', W.saturday, W.this, W.maa, W.len, w('ด้วยกัน', 'dûay-kan', 'together'), W.mai, MS),
      you('Sure.', W.dai, KS),
    ],
  },

  // ── w14 Wild Thailand ─────────────────────────────────────────────────────
  {
    id: 'park', worldId: 'w14', unlockAfter: 2,
    title: 'At the National Park', icon: '🐘',
    setting: 'You ask a park ranger for advice.', npc: 'Ranger',
    lines: [
      you('Are there elephants here?', W.here, W.mii, w('ช้าง', 'cháang', 'elephant'), W.mai, KQ),
      npc('Yes, but you must be careful.', W.mii, MS, w('แต่', 'tɛ̀ɛ', 'but'), w('ต้อง', 'tɔ̂ng', 'must'), w('ระวัง', 'rá-wang', 'be careful')),
      you('Is the waterfall far?', w('น้ำตก', 'náam-tòk', 'waterfall'), W.yuu, W.far, W.mai, KQ),
      npc('About a thirty-minute walk.', W.walk, W.about, w('สามสิบ', 'sǎam-sìp', 'thirty'), W.minute, MS),
      you('Will it rain today?', w('วันนี้', 'wan-níi', 'today'), W.rain, W.will, W.fall, W.mai, KQ),
      npc('No. The weather is very good.', W.not, W.fall, MS, w('อากาศ', 'aa-kàat', 'weather'), W.dii, W.maak),
    ],
  },

  // ── w15 Work & Study ──────────────────────────────────────────────────────
  {
    id: 'job', worldId: 'w15', unlockAfter: 2,
    title: 'What Do You Do?', icon: '💼',
    setting: 'A new acquaintance asks about your work.', npc: 'Mai',
    lines: [
      npc('What work do you do?', W.khun, W.work, W.arai, FQ),
      you("I'm a teacher.", I, w('เป็น', 'pen', 'to be'), w('ครู', 'khruu', 'teacher'), KS),
      npc('Where do you work?', W.work, W.where, FQ),
      you('At a school in Bangkok.', W.thii, w('โรงเรียน', 'roong-rian', 'school'), w('ใน', 'nai', 'in'), w('กรุงเทพ', 'krung-thêep', 'Bangkok'), KS),
      npc('Is work busy?', w('งาน', 'ngaan', 'work'), W.busy, W.mai, FQ),
      you('Very busy.', W.busy, W.maak, KS),
    ],
  },

  // ── w16 Fun & Free Time ───────────────────────────────────────────────────
  {
    id: 'karaoke', worldId: 'w16', unlockAfter: 2,
    title: 'Free Time', icon: '🎤',
    setting: 'Mai asks what you do on your days off.', npc: 'Mai',
    lines: [
      npc('What do you like to do on your days off?', w('วันหยุด', 'wan-yùt', 'day off / holiday'), W.khun, W.chop, w('ทำ', 'tham', 'do'), W.arai, FQ),
      you('I like listening to music.', I, W.chop, w('ฟัง', 'fang', 'listen'), w('เพลง', 'phleeng', 'song / music'), KS),
      npc('Do you like Thai songs?', W.chop, w('เพลง', 'phleeng', 'song / music'), w('ไทย', 'thai', 'Thai'), W.mai, FQ),
      you('I like them a lot.', W.chop, W.maak, KS),
      npc('Shall we go sing karaoke tonight?', w('คืนนี้', 'khɯɯn-níi', 'tonight'), W.pai, w('ร้อง', 'rɔ́ɔng', 'sing'), w('คาราโอเกะ', 'khaa-raa-oo-kè', 'karaoke'), W.kan, W.mai, FQ),
      you("Let's go. It will definitely be fun.", W.pai, KS, W.sanuk, w('แน่นอน', 'nɛ̂ɛ-nɔɔn', 'definitely')),
    ],
  },

  // ── w17 Thai Culture ──────────────────────────────────────────────────────
  {
    id: 'songkran', worldId: 'w17', unlockAfter: 2,
    title: 'Songkran', icon: '💦',
    setting: 'Mai tells you about the Thai New Year water festival.', npc: 'Mai',
    lines: [
      npc('Have you ever celebrated Songkran?', W.khun, W.ever, W.len, W.songkran, W.mai, FQ),
      you('Not yet.', w('ยัง', 'yang', 'yet / still'), W.not, W.ever, KS),
      npc('It is so much fun. Everyone plays with water.', W.sanuk, W.maak, FS, W.every, W.khon, W.len, W.naam),
      you('What month is Songkran?', W.songkran, W.month, W.arai, KQ),
      npc('April.', W.month, w('เมษายน', 'mee-sǎa-yon', 'April'), FS),
      you('I want to go.', I, W.yaak, W.pai, KS),
    ],
  },
];

// ── Helpers ─────────────────────────────────────────────────────────────────

/** The line as this speaker says it (female forms applied to "you" lines). */
export function resolveLine(line: ConvLine, gender: SpeakerGender): Sentence {
  return {
    en: line.en,
    tokens: line.tokens.map(t => {
      const alt = line.who === 'you' && gender === 'f' ? t.f : undefined;
      return { th: alt?.th ?? t.th, rom: alt?.rom ?? t.rom, en: t.en };
    }),
  };
}

export const sentenceTh = (s: Sentence) => s.tokens.map(t => t.th).join('');
export const sentenceRom = (s: Sentence) => s.tokens.map(t => t.rom).join(' ');

/** Key under which a finished conversation is recorded in lesson progress. */
export const conversationKey = (id: string) => `conv-${id}`;

export function getConversation(id: string): Conversation | undefined {
  return CONVERSATIONS.find(c => c.id === id);
}

export function conversationsForWorld(worldId: string): Conversation[] {
  return CONVERSATIONS.filter(c => c.worldId === worldId);
}
