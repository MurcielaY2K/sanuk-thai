// ─────────────────────────────────────────────────────────────────────────────
// RENOVATION PACK — private content pack (see constants/privatePacks.ts)
//
// Situational Thai for renovation work: tools, materials, techniques, trades,
// measurements, defects and money, plus the sentences you actually say to a
// contractor, a hardware shop, or a crew on site.
//
// This pack is kept OUT of data/vocabulary.ts on purpose:
//   - its words never appear as distractors in the public lessons
//   - its worlds never join the public progression chain
//   - it is only visible on a device that has unlocked the pack
//
// ⚠️ Romanization/translation here is machine-authored like the rest of the
// vocabulary and has NOT had a native-speaker review pass yet. Send it through
// review.html before this ever goes public.
// ─────────────────────────────────────────────────────────────────────────────

import type { Word } from './vocabulary';
import type { PhraseCategory } from './phrases';

export const RENO_CATEGORIES = [
  'reno-tools', 'reno-materials', 'reno-technique', 'reno-structure',
  'reno-trades', 'reno-measure', 'reno-problems', 'reno-money',
] as const;

const RENO_CATEGORY_SET = new Set<string>(RENO_CATEGORIES);
export function isRenoCategory(category: string): boolean {
  return RENO_CATEGORY_SET.has(category);
}

export const RENOVATION_WORDS: Word[] = [
  // ── Tools ─────────────────────────────────────────────────────────────────
  { id: 'rv001', th: 'เครื่องมือ',      rom: 'khrêuang-meu',            en: 'tool',              category: 'reno-tools' },
  { id: 'rv002', th: 'ค้อน',            rom: 'khón',                    en: 'hammer',            category: 'reno-tools' },
  { id: 'rv003', th: 'ไขควง',           rom: 'khǎi-khuang',             en: 'screwdriver',       category: 'reno-tools' },
  { id: 'rv004', th: 'สว่าน',           rom: 'sà-wàan',                 en: 'drill',             category: 'reno-tools' },
  { id: 'rv005', th: 'ดอกสว่าน',        rom: 'dòk-sà-wàan',             en: 'drill bit',         category: 'reno-tools' },
  { id: 'rv006', th: 'เลื่อย',          rom: 'lêuay',                   en: 'saw',               category: 'reno-tools' },
  { id: 'rv007', th: 'เลื่อยวงเดือน',   rom: 'lêuay-wong-deuan',        en: 'circular saw',      category: 'reno-tools' },
  { id: 'rv008', th: 'ตลับเมตร',        rom: 'dtà-làp-méet',            en: 'tape measure',      category: 'reno-tools' },
  { id: 'rv009', th: 'ระดับน้ำ',        rom: 'rá-dàp-nám',              en: 'spirit level',      category: 'reno-tools' },
  { id: 'rv010', th: 'คีม',             rom: 'kheem',                   en: 'pliers',            category: 'reno-tools' },
  { id: 'rv011', th: 'ประแจ',           rom: 'bprà-jae',                en: 'wrench',            category: 'reno-tools' },
  { id: 'rv012', th: 'สิ่ว',            rom: 'sìu',                     en: 'chisel',            category: 'reno-tools' },
  { id: 'rv013', th: 'เกรียง',          rom: 'kriang',                  en: 'trowel',            category: 'reno-tools' },
  { id: 'rv014', th: 'เกรียงโป๊ว',      rom: 'kriang-bpóo',             en: 'putty knife',       category: 'reno-tools' },
  { id: 'rv015', th: 'แปรงทาสี',        rom: 'bpraeng-thaa-sěe',        en: 'paintbrush',        category: 'reno-tools' },
  { id: 'rv016', th: 'ลูกกลิ้งทาสี',    rom: 'lûuk-klîng-thaa-sěe',     en: 'paint roller',      category: 'reno-tools' },
  { id: 'rv017', th: 'บันได',           rom: 'ban-dai',                 en: 'ladder',            category: 'reno-tools' },
  { id: 'rv018', th: 'กระดาษทราย',      rom: 'krà-dàat-saai',           en: 'sandpaper',         category: 'reno-tools' },
  { id: 'rv019', th: 'เครื่องเจียร',    rom: 'khrêuang-jia',            en: 'angle grinder',     category: 'reno-tools' },
  { id: 'rv020', th: 'ค้อนปอนด์',       rom: 'khón-bpon',               en: 'sledgehammer',      category: 'reno-tools' },
  { id: 'rv021', th: 'ชะแลง',           rom: 'chá-laeng',               en: 'crowbar',           category: 'reno-tools' },
  { id: 'rv022', th: 'รถเข็น',          rom: 'rót-khěn',                en: 'wheelbarrow',       category: 'reno-tools' },
  { id: 'rv023', th: 'ถังปูน',          rom: 'thǎng-bpuun',             en: 'mixing bucket',     category: 'reno-tools' },
  { id: 'rv024', th: 'สายพ่วง',         rom: 'sǎai-phûang',             en: 'extension cord',    category: 'reno-tools' },
  { id: 'rv025', th: 'แว่นตานิรภัย',    rom: 'wâen-dtaa-ní-rá-phai',    en: 'safety glasses',    category: 'reno-tools' },
  { id: 'rv026', th: 'ถุงมือ',          rom: 'thǔng-meu',               en: 'gloves',            category: 'reno-tools' },
  { id: 'rv027', th: 'หน้ากากกันฝุ่น',  rom: 'nâa-gàak-gan-fùn',        en: 'dust mask',         category: 'reno-tools' },
  { id: 'rv028', th: 'หมวกนิรภัย',      rom: 'mùak-ní-rá-phai',         en: 'hard hat',          category: 'reno-tools' },
  { id: 'rv029', th: 'กล่องเครื่องมือ', rom: 'klòng-khrêuang-meu',      en: 'toolbox',           category: 'reno-tools' },
  { id: 'rv030', th: 'ตัวหนีบ',         rom: 'dtua-nèep',               en: 'clamp',             category: 'reno-tools' },
  { id: 'rv031', th: 'ปืนยิงกาว',       rom: 'bpeun-ying-gaao',         en: 'caulking gun',      category: 'reno-tools' },
  { id: 'rv032', th: 'คัตเตอร์',        rom: 'kát-dtêr',                en: 'utility knife',     category: 'reno-tools' },
  { id: 'rv033', th: 'ไม้บรรทัด',       rom: 'máai-ban-thát',           en: 'ruler',             category: 'reno-tools' },
  { id: 'rv034', th: 'ไม้กวาด',         rom: 'máai-gwàat',              en: 'broom',             category: 'reno-tools' },
  { id: 'rv035', th: 'บักเก็ต',         rom: 'bàk-gèt',                 en: 'bucket',            category: 'reno-tools' },
  { id: 'rv036', th: 'สายยาง',          rom: 'sǎai-yaang',              en: 'hose',              category: 'reno-tools' },

  // ── Materials ─────────────────────────────────────────────────────────────
  { id: 'rv040', th: 'วัสดุ',           rom: 'wát-sà-dù',               en: 'material',          category: 'reno-materials' },
  { id: 'rv041', th: 'ปูนซีเมนต์',      rom: 'bpuun-see-méen',          en: 'cement',            category: 'reno-materials' },
  { id: 'rv042', th: 'ทราย',            rom: 'saai',                    en: 'sand',              category: 'reno-materials' },
  { id: 'rv043', th: 'หิน',             rom: 'hǐn',                     en: 'gravel / stone',    category: 'reno-materials' },
  { id: 'rv044', th: 'คอนกรีต',         rom: 'khon-krèet',              en: 'concrete',          category: 'reno-materials' },
  { id: 'rv045', th: 'ปูนฉาบ',          rom: 'bpuun-chàap',             en: 'plaster / render',  category: 'reno-materials' },
  { id: 'rv046', th: 'ปูนกาว',          rom: 'bpuun-gaao',              en: 'tile adhesive',     category: 'reno-materials' },
  { id: 'rv047', th: 'อิฐ',             rom: 'ìt',                      en: 'brick',             category: 'reno-materials' },
  { id: 'rv048', th: 'บล็อก',           rom: 'blòk',                    en: 'concrete block',    category: 'reno-materials' },
  { id: 'rv049', th: 'กระเบื้อง',       rom: 'krà-bêuang',              en: 'tile',              category: 'reno-materials' },
  { id: 'rv050', th: 'ยาแนว',           rom: 'yaa-naew',                en: 'grout',             category: 'reno-materials' },
  { id: 'rv051', th: 'สี',              rom: 'sěe',                     en: 'paint',             category: 'reno-materials' },
  { id: 'rv052', th: 'สีรองพื้น',       rom: 'sěe-rong-péun',           en: 'primer',            category: 'reno-materials' },
  { id: 'rv053', th: 'ทินเนอร์',        rom: 'thin-nêr',                en: 'thinner',           category: 'reno-materials' },
  { id: 'rv054', th: 'กาว',             rom: 'gaao',                    en: 'glue',              category: 'reno-materials' },
  { id: 'rv055', th: 'ซิลิโคน',         rom: 'sí-lí-khoon',             en: 'silicone sealant',  category: 'reno-materials' },
  { id: 'rv056', th: 'ไม้',             rom: 'máai',                    en: 'wood',              category: 'reno-materials' },
  { id: 'rv057', th: 'ไม้อัด',          rom: 'máai-àt',                 en: 'plywood',           category: 'reno-materials' },
  { id: 'rv058', th: 'เหล็ก',           rom: 'lèk',                     en: 'steel / iron',      category: 'reno-materials' },
  { id: 'rv059', th: 'เหล็กเส้น',       rom: 'lèk-sên',                 en: 'rebar',             category: 'reno-materials' },
  { id: 'rv060', th: 'ตะแกรงเหล็ก',     rom: 'dtà-kraeng-lèk',          en: 'wire mesh',         category: 'reno-materials' },
  { id: 'rv061', th: 'ตะปู',            rom: 'dtà-bpuu',                en: 'nail',              category: 'reno-materials' },
  { id: 'rv062', th: 'สกรู',            rom: 'sà-kruu',                 en: 'screw',             category: 'reno-materials' },
  { id: 'rv063', th: 'น็อต',            rom: 'nót',                     en: 'bolt / nut',        category: 'reno-materials' },
  { id: 'rv064', th: 'พุก',             rom: 'phúk',                    en: 'wall anchor',       category: 'reno-materials' },
  { id: 'rv065', th: 'บานพับ',          rom: 'baan-pháp',               en: 'hinge',             category: 'reno-materials' },
  { id: 'rv066', th: 'ลูกบิด',          rom: 'lûuk-bìt',                en: 'door knob',         category: 'reno-materials' },
  { id: 'rv067', th: 'กุญแจ',           rom: 'gun-jae',                 en: 'lock / key',        category: 'reno-materials' },
  { id: 'rv068', th: 'ท่อ',             rom: 'thôr',                    en: 'pipe',              category: 'reno-materials' },
  { id: 'rv069', th: 'ท่อพีวีซี',       rom: 'thôr-pee-wee-see',        en: 'PVC pipe',          category: 'reno-materials' },
  { id: 'rv070', th: 'ข้องอ',           rom: 'khôr-ngor',               en: 'elbow fitting',     category: 'reno-materials' },
  { id: 'rv071', th: 'วาล์ว',           rom: 'waao',                    en: 'valve',             category: 'reno-materials' },
  { id: 'rv072', th: 'ก๊อกน้ำ',         rom: 'gók-nám',                 en: 'faucet / tap',      category: 'reno-materials' },
  { id: 'rv073', th: 'สายไฟ',           rom: 'sǎai-fai',                en: 'electrical wire',   category: 'reno-materials' },
  { id: 'rv074', th: 'เบรกเกอร์',       rom: 'brèk-gêr',                en: 'circuit breaker',   category: 'reno-materials' },
  { id: 'rv075', th: 'สวิตช์',          rom: 'sà-wít',                  en: 'switch',            category: 'reno-materials' },
  { id: 'rv076', th: 'ปลั๊ก',           rom: 'bplák',                   en: 'plug / outlet',     category: 'reno-materials' },
  { id: 'rv077', th: 'หลอดไฟ',          rom: 'lòt-fai',                 en: 'light bulb',        category: 'reno-materials' },
  { id: 'rv078', th: 'ฉนวนกันความร้อน', rom: 'chà-nǔan-gan-khwaam-rón', en: 'insulation',        category: 'reno-materials' },
  { id: 'rv079', th: 'แผ่นยิปซัม',      rom: 'phàen-yíp-sam',           en: 'gypsum board',      category: 'reno-materials' },
  { id: 'rv080', th: 'กระจก',           rom: 'krà-jòk',                 en: 'glass / mirror',    category: 'reno-materials' },
  { id: 'rv081', th: 'หินอ่อน',         rom: 'hǐn-òn',                  en: 'marble',            category: 'reno-materials' },
  { id: 'rv082', th: 'แกรนิต',          rom: 'krae-nít',                en: 'granite',           category: 'reno-materials' },
  { id: 'rv083', th: 'สแตนเลส',         rom: 'sà-dtaen-lét',            en: 'stainless steel',   category: 'reno-materials' },
  { id: 'rv084', th: 'อลูมิเนียม',      rom: 'a-luu-mí-niam',           en: 'aluminium',         category: 'reno-materials' },
  { id: 'rv085', th: 'น้ำยากันซึม',     rom: 'nám-yaa-gan-seum',        en: 'waterproofing',     category: 'reno-materials' },
  { id: 'rv086', th: 'หลังคาเมทัลชีท',  rom: 'lǎng-khaa-mé-thân-chèet', en: 'metal roof sheet',  category: 'reno-materials' },

  // ── Techniques (verbs) ────────────────────────────────────────────────────
  { id: 'rv100', th: 'ทุบ',             rom: 'thúp',                    en: 'to demolish',       category: 'reno-technique' },
  { id: 'rv101', th: 'รื้อ',            rom: 'réu',                     en: 'to tear out',       category: 'reno-technique' },
  { id: 'rv102', th: 'ติดตั้ง',         rom: 'dtìt-dtâng',              en: 'to install',        category: 'reno-technique' },
  { id: 'rv103', th: 'สร้าง',           rom: 'sâang',                   en: 'to build',          category: 'reno-technique' },
  { id: 'rv104', th: 'เท',              rom: 'thee',                    en: 'to pour',           category: 'reno-technique' },
  { id: 'rv105', th: 'ผสม',             rom: 'phà-sǒm',                 en: 'to mix',            category: 'reno-technique' },
  { id: 'rv106', th: 'ฉาบ',             rom: 'chàap',                   en: 'to plaster',        category: 'reno-technique' },
  { id: 'rv107', th: 'ขัด',             rom: 'khàt',                    en: 'to sand / scrub',   category: 'reno-technique' },
  { id: 'rv108', th: 'ทาสี',            rom: 'thaa-sěe',                en: 'to paint',          category: 'reno-technique' },
  { id: 'rv109', th: 'ปูกระเบื้อง',     rom: 'bpuu-krà-bêuang',         en: 'to lay tile',       category: 'reno-technique' },
  { id: 'rv110', th: 'อุด',             rom: 'ùt',                      en: 'to seal / plug',    category: 'reno-technique' },
  { id: 'rv111', th: 'เชื่อม',          rom: 'chêuam',                  en: 'to weld',           category: 'reno-technique' },
  { id: 'rv112', th: 'เจาะ',            rom: 'jòr',                     en: 'to drill / bore',   category: 'reno-technique' },
  { id: 'rv113', th: 'ขัน',             rom: 'khǎn',                    en: 'to tighten',        category: 'reno-technique' },
  { id: 'rv114', th: 'ตอก',             rom: 'dtòk',                    en: 'to hammer in',      category: 'reno-technique' },
  { id: 'rv115', th: 'วัด',             rom: 'wát',                     en: 'to measure',        category: 'reno-technique' },
  { id: 'rv116', th: 'ตัด',             rom: 'dtàt',                    en: 'to cut',            category: 'reno-technique' },
  { id: 'rv117', th: 'ปรับระดับ',       rom: 'bpràp-rá-dàp',            en: 'to level',          category: 'reno-technique' },
  { id: 'rv118', th: 'แขวน',            rom: 'khwǎen',                  en: 'to hang',           category: 'reno-technique' },
  { id: 'rv119', th: 'ต่อ',             rom: 'dtòr',                    en: 'to connect',        category: 'reno-technique' },
  { id: 'rv120', th: 'เปลี่ยน',         rom: 'bplìan',                  en: 'to replace',        category: 'reno-technique' },
  { id: 'rv121', th: 'ซ่อม',            rom: 'sôm',                     en: 'to repair',         category: 'reno-technique' },
  { id: 'rv122', th: 'โป๊ว',            rom: 'bpóo',                    en: 'to fill / putty',   category: 'reno-technique' },
  { id: 'rv123', th: 'ขูด',             rom: 'khùut',                   en: 'to scrape',         category: 'reno-technique' },
  { id: 'rv124', th: 'ถอด',             rom: 'thòt',                    en: 'to detach',         category: 'reno-technique' },
  { id: 'rv125', th: 'ประกอบ',          rom: 'bprà-gòp',                en: 'to assemble',       category: 'reno-technique' },
  { id: 'rv126', th: 'ยึด',             rom: 'yéut',                    en: 'to fasten',         category: 'reno-technique' },
  { id: 'rv127', th: 'ขน',              rom: 'khǒn',                    en: 'to haul',           category: 'reno-technique' },
  { id: 'rv128', th: 'ทิ้ง',            rom: 'thíng',                   en: 'to throw away',     category: 'reno-technique' },
  { id: 'rv129', th: 'ตรวจ',            rom: 'dtrùat',                  en: 'to inspect',        category: 'reno-technique' },
  { id: 'rv130', th: 'ปรับปรุง',        rom: 'bpràp-bprung',            en: 'to renovate',       category: 'reno-technique' },
  { id: 'rv131', th: 'ต่อเติม',         rom: 'dtòr-dterm',              en: 'to extend (build)', category: 'reno-technique' },
  { id: 'rv132', th: 'คลุม',            rom: 'khlum',                   en: 'to cover over',     category: 'reno-technique' },
  { id: 'rv133', th: 'เก็บกวาด',        rom: 'gèp-gwàat',               en: 'to clean up',       category: 'reno-technique' },

  // ── Structure & rooms ─────────────────────────────────────────────────────
  { id: 'rv150', th: 'ผนัง',            rom: 'phà-nǎng',                en: 'wall (interior)',   category: 'reno-structure' },
  { id: 'rv151', th: 'กำแพง',           rom: 'gam-phaeng',              en: 'wall (exterior)',   category: 'reno-structure' },
  { id: 'rv152', th: 'พื้น',            rom: 'péun',                    en: 'floor',             category: 'reno-structure' },
  { id: 'rv153', th: 'เพดาน',           rom: 'phee-daan',               en: 'ceiling',           category: 'reno-structure' },
  { id: 'rv154', th: 'ฝ้าเพดาน',        rom: 'fâa-phee-daan',           en: 'ceiling panel',     category: 'reno-structure' },
  { id: 'rv155', th: 'หลังคา',          rom: 'lǎng-khaa',               en: 'roof',              category: 'reno-structure' },
  { id: 'rv156', th: 'ประตู',           rom: 'bprà-dtuu',               en: 'door',              category: 'reno-structure' },
  { id: 'rv157', th: 'หน้าต่าง',        rom: 'nâa-dtàang',              en: 'window',            category: 'reno-structure' },
  { id: 'rv158', th: 'ขั้นบันได',       rom: 'khân-ban-dai',            en: 'stair step',        category: 'reno-structure' },
  { id: 'rv159', th: 'เสา',             rom: 'sǎo',                     en: 'column / post',     category: 'reno-structure' },
  { id: 'rv160', th: 'คาน',             rom: 'khaan',                   en: 'beam',              category: 'reno-structure' },
  { id: 'rv161', th: 'ฐานราก',          rom: 'thǎan-râak',              en: 'foundation',        category: 'reno-structure' },
  { id: 'rv162', th: 'ห้องครัว',        rom: 'hông-khrua',              en: 'kitchen',           category: 'reno-structure' },
  { id: 'rv163', th: 'ห้องน้ำ',         rom: 'hông-nám',                en: 'bathroom',          category: 'reno-structure' },
  { id: 'rv164', th: 'ห้องนอน',         rom: 'hông-non',                en: 'bedroom',           category: 'reno-structure' },
  { id: 'rv165', th: 'ห้องนั่งเล่น',    rom: 'hông-nâng-lên',           en: 'living room',       category: 'reno-structure' },
  { id: 'rv166', th: 'ระเบียง',         rom: 'rá-biang',                en: 'balcony',           category: 'reno-structure' },
  { id: 'rv167', th: 'โรงรถ',           rom: 'roong-rót',               en: 'garage',            category: 'reno-structure' },
  { id: 'rv168', th: 'รั้ว',            rom: 'rúa',                     en: 'fence',             category: 'reno-structure' },
  { id: 'rv169', th: 'ท่อระบายน้ำ',     rom: 'thôr-rá-baai-nám',        en: 'drainage pipe',     category: 'reno-structure' },
  { id: 'rv170', th: 'ห้องเก็บของ',     rom: 'hông-gèp-khǒng',          en: 'storage room',      category: 'reno-structure' },
  { id: 'rv171', th: 'ชั้น',            rom: 'chán',                    en: 'floor / storey',    category: 'reno-structure' },
  { id: 'rv172', th: 'ดาดฟ้า',          rom: 'dàat-fáa',                en: 'rooftop terrace',   category: 'reno-structure' },
  { id: 'rv173', th: 'กันสาด',          rom: 'gan-sàat',                en: 'awning',            category: 'reno-structure' },
  { id: 'rv174', th: 'อ่างล้างจาน',     rom: 'àang-láang-jaan',         en: 'kitchen sink',      category: 'reno-structure' },
  { id: 'rv175', th: 'ชักโครก',         rom: 'chák-khrôok',             en: 'toilet',            category: 'reno-structure' },
  { id: 'rv176', th: 'อ่างอาบน้ำ',      rom: 'àang-àap-nám',            en: 'bathtub',           category: 'reno-structure' },
  { id: 'rv177', th: 'เคาน์เตอร์',      rom: 'khao-dtêr',               en: 'counter',           category: 'reno-structure' },
  { id: 'rv178', th: 'ตู้',             rom: 'dtûu',                    en: 'cabinet',           category: 'reno-structure' },
  { id: 'rv179', th: 'หน้างาน',         rom: 'nâa-ngaan',               en: 'the job site',      category: 'reno-structure' },

  // ── Trades & people ───────────────────────────────────────────────────────
  { id: 'rv200', th: 'ช่าง',            rom: 'châang',                  en: 'technician',        category: 'reno-trades' },
  { id: 'rv201', th: 'ผู้รับเหมา',      rom: 'phûu-ráp-mǎo',            en: 'contractor',        category: 'reno-trades' },
  { id: 'rv202', th: 'หัวหน้าช่าง',     rom: 'hǔa-nâa-châang',          en: 'foreman',           category: 'reno-trades' },
  { id: 'rv203', th: 'ช่างไฟ',          rom: 'châang-fai',              en: 'electrician',       category: 'reno-trades' },
  { id: 'rv204', th: 'ช่างประปา',       rom: 'châang-bprà-bpaa',        en: 'plumber',           category: 'reno-trades' },
  { id: 'rv205', th: 'ช่างไม้',         rom: 'châang-máai',             en: 'carpenter',         category: 'reno-trades' },
  { id: 'rv206', th: 'ช่างสี',          rom: 'châang-sěe',              en: 'painter',           category: 'reno-trades' },
  { id: 'rv207', th: 'ช่างปูน',         rom: 'châang-bpuun',            en: 'mason',             category: 'reno-trades' },
  { id: 'rv208', th: 'ช่างเชื่อม',      rom: 'châang-chêuam',           en: 'welder',            category: 'reno-trades' },
  { id: 'rv209', th: 'ช่างแอร์',        rom: 'châang-ae',               en: 'AC technician',     category: 'reno-trades' },
  { id: 'rv210', th: 'สถาปนิก',         rom: 'sà-thǎa-bpà-ník',         en: 'architect',         category: 'reno-trades' },
  { id: 'rv211', th: 'วิศวกร',          rom: 'wít-sà-wá-gon',           en: 'engineer',          category: 'reno-trades' },
  { id: 'rv212', th: 'คนงาน',           rom: 'khon-ngaan',              en: 'labourer',          category: 'reno-trades' },
  { id: 'rv213', th: 'ร้านวัสดุ',       rom: 'ráan-wát-sà-dù',          en: 'builders merchant', category: 'reno-trades' },

  // ── Measurement & quantity ────────────────────────────────────────────────
  { id: 'rv230', th: 'เมตร',            rom: 'méet',                    en: 'metre',             category: 'reno-measure' },
  { id: 'rv231', th: 'เซนติเมตร',       rom: 'sen-dtì-méet',            en: 'centimetre',        category: 'reno-measure' },
  { id: 'rv232', th: 'มิลลิเมตร',       rom: 'min-lí-méet',             en: 'millimetre',        category: 'reno-measure' },
  { id: 'rv233', th: 'ตารางเมตร',       rom: 'dtaa-raang-méet',         en: 'square metre',      category: 'reno-measure' },
  { id: 'rv234', th: 'ลูกบาศก์เมตร',    rom: 'lûuk-bàat-méet',          en: 'cubic metre',       category: 'reno-measure' },
  { id: 'rv235', th: 'นิ้ว',            rom: 'níu',                     en: 'inch',              category: 'reno-measure' },
  { id: 'rv236', th: 'กิโลกรัม',        rom: 'gì-loo-gram',             en: 'kilogram',          category: 'reno-measure' },
  { id: 'rv237', th: 'ลิตร',            rom: 'lít',                     en: 'litre',             category: 'reno-measure' },
  { id: 'rv238', th: 'ถุง',             rom: 'thǔng',                   en: 'bag (unit)',        category: 'reno-measure' },
  { id: 'rv239', th: 'แผ่น',            rom: 'phàen',                   en: 'sheet (unit)',      category: 'reno-measure' },
  { id: 'rv240', th: 'ก้อน',            rom: 'gôn',                     en: 'block (unit)',      category: 'reno-measure' },
  { id: 'rv241', th: 'ม้วน',            rom: 'múan',                    en: 'roll (unit)',       category: 'reno-measure' },
  { id: 'rv242', th: 'ความยาว',         rom: 'khwaam-yaao',             en: 'length',            category: 'reno-measure' },
  { id: 'rv243', th: 'ความกว้าง',       rom: 'khwaam-kwâang',           en: 'width',             category: 'reno-measure' },
  { id: 'rv244', th: 'ความสูง',         rom: 'khwaam-sǔung',            en: 'height',            category: 'reno-measure' },
  { id: 'rv245', th: 'ความหนา',         rom: 'khwaam-nǎa',              en: 'thickness',         category: 'reno-measure' },
  { id: 'rv246', th: 'ขนาด',            rom: 'khà-nàat',                en: 'size',              category: 'reno-measure' },
  { id: 'rv247', th: 'ตรง',             rom: 'dtrong',                  en: 'straight',          category: 'reno-measure' },
  { id: 'rv248', th: 'เอียง',           rom: 'iang',                    en: 'slanted / crooked', category: 'reno-measure' },
  { id: 'rv249', th: 'เท่ากัน',         rom: 'thâo-gan',                en: 'equal / the same',  category: 'reno-measure' },

  // ── Problems & defects ────────────────────────────────────────────────────
  { id: 'rv270', th: 'รั่ว',            rom: 'rûa',                     en: 'to leak',           category: 'reno-problems' },
  { id: 'rv271', th: 'ร้าว',            rom: 'ráao',                    en: 'cracked',           category: 'reno-problems' },
  { id: 'rv272', th: 'เชื้อรา',         rom: 'chéua-raa',               en: 'mould',             category: 'reno-problems' },
  { id: 'rv273', th: 'ชื้น',            rom: 'chéun',                   en: 'damp',              category: 'reno-problems' },
  { id: 'rv274', th: 'สนิม',            rom: 'sà-nǐm',                  en: 'rust',              category: 'reno-problems' },
  { id: 'rv275', th: 'ผุ',              rom: 'phù',                     en: 'rotten',            category: 'reno-problems' },
  { id: 'rv276', th: 'ปลวก',            rom: 'bplùak',                  en: 'termites',          category: 'reno-problems' },
  { id: 'rv277', th: 'พัง',             rom: 'phang',                   en: 'broken / collapsed',category: 'reno-problems' },
  { id: 'rv278', th: 'หลวม',            rom: 'lǔam',                    en: 'loose',             category: 'reno-problems' },
  { id: 'rv279', th: 'อุดตัน',          rom: 'ùt-dtan',                 en: 'clogged',           category: 'reno-problems' },
  { id: 'rv280', th: 'ไฟช็อต',          rom: 'fai-chót',                en: 'short circuit',     category: 'reno-problems' },
  { id: 'rv281', th: 'ไม่เรียบ',        rom: 'mâi-rîap',                en: 'uneven',            category: 'reno-problems' },
  { id: 'rv282', th: 'สีลอก',           rom: 'sěe-lôk',                 en: 'peeling paint',     category: 'reno-problems' },
  { id: 'rv283', th: 'บิ่น',            rom: 'bìn',                     en: 'chipped',           category: 'reno-problems' },
  { id: 'rv284', th: 'คราบ',            rom: 'khrâap',                  en: 'stain',             category: 'reno-problems' },
  { id: 'rv285', th: 'ช่องว่าง',        rom: 'chông-wâang',             en: 'gap',               category: 'reno-problems' },
  { id: 'rv286', th: 'ทรุด',            rom: 'sút',                     en: 'subsiding',         category: 'reno-problems' },
  { id: 'rv287', th: 'โก่ง',            rom: 'gòong',                   en: 'warped / bent',     category: 'reno-problems' },
  { id: 'rv288', th: 'ฝุ่น',            rom: 'fùn',                     en: 'dust',              category: 'reno-problems' },
  { id: 'rv289', th: 'เสีย',            rom: 'sǐa',                     en: 'out of order',      category: 'reno-problems' },

  // ── Money & contract ──────────────────────────────────────────────────────
  { id: 'rv310', th: 'ราคา',            rom: 'raa-khaa',                en: 'price',             category: 'reno-money' },
  { id: 'rv311', th: 'ใบเสนอราคา',      rom: 'bai-sà-nǒe-raa-khaa',     en: 'quotation',         category: 'reno-money' },
  { id: 'rv312', th: 'ประเมิน',         rom: 'bprà-mern',               en: 'to estimate',       category: 'reno-money' },
  { id: 'rv313', th: 'มัดจำ',           rom: 'mát-jam',                 en: 'deposit',           category: 'reno-money' },
  { id: 'rv314', th: 'งวด',             rom: 'ngûat',                   en: 'instalment',        category: 'reno-money' },
  { id: 'rv315', th: 'ค่าแรง',          rom: 'khâa-raeng',              en: 'labour cost',       category: 'reno-money' },
  { id: 'rv316', th: 'ค่าวัสดุ',        rom: 'khâa-wát-sà-dù',          en: 'material cost',     category: 'reno-money' },
  { id: 'rv317', th: 'ส่วนลด',          rom: 'sùan-lót',                en: 'discount',          category: 'reno-money' },
  { id: 'rv318', th: 'ใบเสร็จ',         rom: 'bai-sèt',                 en: 'receipt',           category: 'reno-money' },
  { id: 'rv319', th: 'งบประมาณ',        rom: 'ngóp-bprà-maan',          en: 'budget',            category: 'reno-money' },
  { id: 'rv320', th: 'จ่าย',            rom: 'jàai',                    en: 'to pay',            category: 'reno-money' },
  { id: 'rv321', th: 'สัญญา',           rom: 'sǎn-yaa',                 en: 'contract',          category: 'reno-money' },
  { id: 'rv322', th: 'กำหนดเสร็จ',      rom: 'gam-nòt-sèt',             en: 'completion date',   category: 'reno-money' },
  { id: 'rv323', th: 'ต่อวัน',          rom: 'dtòr-wan',                en: 'per day',           category: 'reno-money' },
  { id: 'rv324', th: 'ต่อตารางเมตร',    rom: 'dtòr-dtaa-raang-méet',    en: 'per square metre',  category: 'reno-money' },
  { id: 'rv325', th: 'เพิ่มเงิน',       rom: 'phêrm-ngern',             en: 'to charge extra',   category: 'reno-money' },
];

// ── Situational sentences ───────────────────────────────────────────────────
// Grouped the way the conversations actually happen on a job.

export const RENOVATION_PHRASES: PhraseCategory[] = [
  {
    key: 'reno-hiring',
    th: 'จ้างช่าง',
    label: 'Hiring & Quotes',
    icon: '🤝',
    sentences: [
      { tokens: [
        { th: 'ผม', rom: 'phǒm', en: 'I (male)' },
        { th: 'อยาก', rom: 'yàak', en: 'want to' },
        { th: 'ปรับปรุง', rom: 'bpràp-bprung', en: 'renovate' },
        { th: 'ห้องน้ำ', rom: 'hông-nám', en: 'bathroom' },
      ], en: 'I want to renovate the bathroom.' },
      { tokens: [
        { th: 'คุณ', rom: 'khun', en: 'you' },
        { th: 'รับ', rom: 'ráp', en: 'take / accept' },
        { th: 'งาน', rom: 'ngaan', en: 'work / job' },
        { th: 'ไหม', rom: 'mǎi', en: '[question]' },
      ], en: 'Would you take this job?' },
      { tokens: [
        { th: 'ขอ', rom: 'khǒr', en: 'may I have' },
        { th: 'ใบเสนอราคา', rom: 'bai-sà-nǒe-raa-khaa', en: 'quotation' },
        { th: 'หน่อย', rom: 'nòi', en: '[softener]' },
      ], en: 'Could I get a quotation?' },
      { tokens: [
        { th: 'ค่าแรง', rom: 'khâa-raeng', en: 'labour cost' },
        { th: 'เท่าไร', rom: 'thâo-rai', en: 'how much' },
      ], en: 'How much is the labour?' },
      { tokens: [
        { th: 'ราคา', rom: 'raa-khaa', en: 'price' },
        { th: 'รวม', rom: 'ruam', en: 'include' },
        { th: 'วัสดุ', rom: 'wát-sà-dù', en: 'materials' },
        { th: 'ไหม', rom: 'mǎi', en: '[question]' },
      ], en: 'Does the price include materials?' },
      { tokens: [
        { th: 'ใช้', rom: 'chái', en: 'use / take' },
        { th: 'เวลา', rom: 'wee-laa', en: 'time' },
        { th: 'กี่', rom: 'gèe', en: 'how many' },
        { th: 'วัน', rom: 'wan', en: 'days' },
      ], en: 'How many days will it take?' },
      { tokens: [
        { th: 'เคย', rom: 'khoie', en: 'have ever' },
        { th: 'ทำ', rom: 'tham', en: 'do' },
        { th: 'งาน', rom: 'ngaan', en: 'work' },
        { th: 'แบบนี้', rom: 'bàep-née', en: 'like this' },
        { th: 'ไหม', rom: 'mǎi', en: '[question]' },
      ], en: 'Have you done this kind of work before?' },
      { tokens: [
        { th: 'มี', rom: 'mee', en: 'have' },
        { th: 'ผลงาน', rom: 'phǒn-ngaan', en: 'past work' },
        { th: 'ให้ดู', rom: 'hâi-duu', en: 'to show' },
        { th: 'ไหม', rom: 'mǎi', en: '[question]' },
      ], en: 'Do you have past work to show me?' },
      { tokens: [
        { th: 'งบ', rom: 'ngóp', en: 'budget' },
        { th: 'ห้าหมื่น', rom: 'hâa-mèun', en: 'fifty thousand' },
        { th: 'บาท', rom: 'bàat', en: 'baht' },
      ], en: 'The budget is fifty thousand baht.' },
      { tokens: [
        { th: 'ลด', rom: 'lót', en: 'reduce' },
        { th: 'ราคา', rom: 'raa-khaa', en: 'price' },
        { th: 'ได้', rom: 'dâai', en: 'can' },
        { th: 'ไหม', rom: 'mǎi', en: '[question]' },
      ], en: 'Can you lower the price?' },
      { tokens: [
        { th: 'เริ่ม', rom: 'rêrm', en: 'start' },
        { th: 'งาน', rom: 'ngaan', en: 'work' },
        { th: 'ได้', rom: 'dâai', en: 'can' },
        { th: 'เมื่อไร', rom: 'mêua-rai', en: 'when' },
      ], en: 'When can you start the work?' },
      { tokens: [
        { th: 'ขอ', rom: 'khǒr', en: 'may I have' },
        { th: 'เบอร์โทร', rom: 'ber-thoh', en: 'phone number' },
        { th: 'หน่อย', rom: 'nòi', en: '[softener]' },
      ], en: 'Could I have your phone number?' },
    ],
  },
  {
    key: 'reno-store',
    th: 'ร้านวัสดุ',
    label: 'At the Builders Merchant',
    icon: '🏪',
    sentences: [
      { tokens: [
        { th: 'มี', rom: 'mee', en: 'have' },
        { th: 'ปูนซีเมนต์', rom: 'bpuun-see-méen', en: 'cement' },
        { th: 'ไหม', rom: 'mǎi', en: '[question]' },
      ], en: 'Do you have cement?' },
      { tokens: [
        { th: 'ถุง', rom: 'thǔng', en: 'bag' },
        { th: 'ละ', rom: 'lá', en: 'per' },
        { th: 'เท่าไร', rom: 'thâo-rai', en: 'how much' },
      ], en: 'How much per bag?' },
      { tokens: [
        { th: 'ขอ', rom: 'khǒr', en: 'may I have' },
        { th: 'ทราย', rom: 'saai', en: 'sand' },
        { th: 'สาม', rom: 'sǎam', en: 'three' },
        { th: 'ถุง', rom: 'thǔng', en: 'bags' },
      ], en: 'Three bags of sand, please.' },
      { tokens: [
        { th: 'กระเบื้อง', rom: 'krà-bêuang', en: 'tile' },
        { th: 'แผ่นนี้', rom: 'phàen-née', en: 'this one' },
        { th: 'เท่าไร', rom: 'thâo-rai', en: 'how much' },
      ], en: 'How much is this tile?' },
      { tokens: [
        { th: 'มี', rom: 'mee', en: 'have' },
        { th: 'สี', rom: 'sěe', en: 'paint' },
        { th: 'ขาว', rom: 'khǎao', en: 'white' },
        { th: 'ไหม', rom: 'mǎi', en: '[question]' },
      ], en: 'Do you have white paint?' },
      { tokens: [
        { th: 'ส่ง', rom: 'sòng', en: 'deliver' },
        { th: 'ที่บ้าน', rom: 'thêe-bâan', en: 'to the house' },
        { th: 'ได้', rom: 'dâai', en: 'can' },
        { th: 'ไหม', rom: 'mǎi', en: '[question]' },
      ], en: 'Can you deliver to the house?' },
      { tokens: [
        { th: 'ค่าส่ง', rom: 'khâa-sòng', en: 'delivery fee' },
        { th: 'เท่าไร', rom: 'thâo-rai', en: 'how much' },
      ], en: 'How much is delivery?' },
      { tokens: [
        { th: 'อันนี้', rom: 'an-née', en: 'this one' },
        { th: 'ใช้กับ', rom: 'chái-gàp', en: 'use with' },
        { th: 'ไม้', rom: 'máai', en: 'wood' },
        { th: 'ได้', rom: 'dâai', en: 'can' },
        { th: 'ไหม', rom: 'mǎi', en: '[question]' },
      ], en: 'Can this be used on wood?' },
      { tokens: [
        { th: 'มี', rom: 'mee', en: 'have' },
        { th: 'ขนาด', rom: 'khà-nàat', en: 'size' },
        { th: 'ใหญ่กว่านี้', rom: 'yài-gwàa-née', en: 'bigger than this' },
        { th: 'ไหม', rom: 'mǎi', en: '[question]' },
      ], en: 'Do you have a bigger size?' },
      { tokens: [
        { th: 'ขอ', rom: 'khǒr', en: 'may I' },
        { th: 'ดู', rom: 'duu', en: 'see' },
        { th: 'ตัวอย่าง', rom: 'dtua-yàang', en: 'sample' },
        { th: 'หน่อย', rom: 'nòi', en: '[softener]' },
      ], en: 'Could I see a sample?' },
      { tokens: [
        { th: 'ของ', rom: 'khǒng', en: 'the item' },
        { th: 'หมด', rom: 'mòt', en: 'run out' },
        { th: 'ไหม', rom: 'mǎi', en: '[question]' },
      ], en: 'Is it out of stock?' },
      { tokens: [
        { th: 'รับ', rom: 'ráp', en: 'accept' },
        { th: 'บัตร', rom: 'bàt', en: 'card' },
        { th: 'ไหม', rom: 'mǎi', en: '[question]' },
      ], en: 'Do you take cards?' },
    ],
  },
  {
    key: 'reno-instruct',
    th: 'สั่งงาน',
    label: 'Giving Instructions',
    icon: '📋',
    sentences: [
      { tokens: [
        { th: 'ช่วย', rom: 'chûay', en: 'please' },
        { th: 'ทาสี', rom: 'thaa-sěe', en: 'paint' },
        { th: 'ผนัง', rom: 'phà-nǎng', en: 'wall' },
        { th: 'นี้', rom: 'née', en: 'this' },
        { th: 'สีขาว', rom: 'sěe-khǎao', en: 'white' },
      ], en: 'Please paint this wall white.' },
      { tokens: [
        { th: 'อย่า', rom: 'yàa', en: "don't" },
        { th: 'ทุบ', rom: 'thúp', en: 'demolish' },
        { th: 'ผนัง', rom: 'phà-nǎng', en: 'wall' },
        { th: 'นี้', rom: 'née', en: 'this' },
      ], en: "Don't demolish this wall." },
      { tokens: [
        { th: 'ทำ', rom: 'tham', en: 'make' },
        { th: 'ให้', rom: 'hâi', en: 'to be' },
        { th: 'เรียบ', rom: 'rîap', en: 'smooth' },
        { th: 'กว่านี้', rom: 'gwàa-née', en: 'than this' },
      ], en: 'Make it smoother than this.' },
      { tokens: [
        { th: 'ติดตั้ง', rom: 'dtìt-dtâng', en: 'install' },
        { th: 'ตรงนี้', rom: 'dtrong-née', en: 'right here' },
        { th: 'ครับ', rom: 'khráp', en: '[polite]' },
      ], en: 'Install it right here.' },
      { tokens: [
        { th: 'วัด', rom: 'wát', en: 'measure' },
        { th: 'ก่อน', rom: 'gòn', en: 'before' },
        { th: 'ตัด', rom: 'dtàt', en: 'cutting' },
      ], en: 'Measure before you cut.' },
      { tokens: [
        { th: 'ใช้', rom: 'chái', en: 'use' },
        { th: 'วัสดุ', rom: 'wát-sà-dù', en: 'material' },
        { th: 'อย่างดี', rom: 'yàang-dee', en: 'good quality' },
      ], en: 'Use good quality material.' },
      { tokens: [
        { th: 'ทำ', rom: 'tham', en: 'do' },
        { th: 'ใหม่', rom: 'mài', en: 'again / anew' },
        { th: 'อีกครั้ง', rom: 'èek-kráng', en: 'one more time' },
      ], en: 'Please do it over again.' },
      { tokens: [
        { th: 'รอ', rom: 'ror', en: 'wait' },
        { th: 'ก่อน', rom: 'gòn', en: 'first' },
        { th: 'อย่าเพิ่ง', rom: 'yàa-phêrng', en: 'not yet' },
        { th: 'ทำ', rom: 'tham', en: 'do it' },
      ], en: "Wait — don't do it yet." },
      { tokens: [
        { th: 'ตรงนี้', rom: 'dtrong-née', en: 'this spot' },
        { th: 'ต้อง', rom: 'dtông', en: 'must' },
        { th: 'กันซึม', rom: 'gan-seum', en: 'be waterproofed' },
      ], en: 'This spot needs waterproofing.' },
      { tokens: [
        { th: 'เก็บกวาด', rom: 'gèp-gwàat', en: 'clean up' },
        { th: 'ให้', rom: 'hâi', en: 'to be' },
        { th: 'เรียบร้อย', rom: 'rîap-rói', en: 'tidy' },
      ], en: 'Clean up properly.' },
      { tokens: [
        { th: 'ระวัง', rom: 'rá-wang', en: 'be careful of' },
        { th: 'ท่อ', rom: 'thôr', en: 'pipe' },
        { th: 'ใต้', rom: 'dtâi', en: 'under' },
        { th: 'พื้น', rom: 'péun', en: 'the floor' },
      ], en: 'Careful of the pipe under the floor.' },
      { tokens: [
        { th: 'เอา', rom: 'ao', en: 'take' },
        { th: 'ของเก่า', rom: 'khǒng-gào', en: 'the old stuff' },
        { th: 'ไปทิ้ง', rom: 'bpai-thíng', en: 'away' },
      ], en: 'Take the old material away.' },
    ],
  },
  {
    key: 'reno-problems',
    th: 'ปัญหา',
    label: 'Problems & Complaints',
    icon: '⚠️',
    sentences: [
      { tokens: [
        { th: 'หลังคา', rom: 'lǎng-khaa', en: 'the roof' },
        { th: 'รั่ว', rom: 'rûa', en: 'leaks' },
      ], en: 'The roof is leaking.' },
      { tokens: [
        { th: 'ผนัง', rom: 'phà-nǎng', en: 'the wall' },
        { th: 'ร้าว', rom: 'ráao', en: 'is cracked' },
      ], en: 'The wall is cracked.' },
      { tokens: [
        { th: 'พื้น', rom: 'péun', en: 'the floor' },
        { th: 'ไม่เรียบ', rom: 'mâi-rîap', en: 'is uneven' },
      ], en: 'The floor is uneven.' },
      { tokens: [
        { th: 'สี', rom: 'sěe', en: 'the paint' },
        { th: 'ลอก', rom: 'lôk', en: 'is peeling' },
        { th: 'แล้ว', rom: 'láew', en: 'already' },
      ], en: 'The paint is peeling.' },
      { tokens: [
        { th: 'ท่อ', rom: 'thôr', en: 'the pipe' },
        { th: 'อุดตัน', rom: 'ùt-dtan', en: 'is clogged' },
      ], en: 'The pipe is clogged.' },
      { tokens: [
        { th: 'มี', rom: 'mee', en: 'there is' },
        { th: 'เชื้อรา', rom: 'chéua-raa', en: 'mould' },
        { th: 'ที่', rom: 'thêe', en: 'on' },
        { th: 'เพดาน', rom: 'phee-daan', en: 'the ceiling' },
      ], en: 'There is mould on the ceiling.' },
      { tokens: [
        { th: 'ประตู', rom: 'bprà-dtuu', en: 'the door' },
        { th: 'ปิด', rom: 'bpìt', en: 'close' },
        { th: 'ไม่สนิท', rom: 'mâi-sà-nìt', en: 'not tightly' },
      ], en: "The door doesn't close properly." },
      { tokens: [
        { th: 'งาน', rom: 'ngaan', en: 'the work' },
        { th: 'ยัง', rom: 'yang', en: 'still' },
        { th: 'ไม่เสร็จ', rom: 'mâi-sèt', en: 'not finished' },
      ], en: 'This work still is not finished.' },
      { tokens: [
        { th: 'สี', rom: 'sěe', en: 'the colour' },
        { th: 'ไม่ตรง', rom: 'mâi-dtrong', en: "doesn't match" },
        { th: 'กับ', rom: 'gàp', en: 'with' },
        { th: 'ตัวอย่าง', rom: 'dtua-yàang', en: 'the sample' },
      ], en: "The colour doesn't match the sample." },
      { tokens: [
        { th: 'กระเบื้อง', rom: 'krà-bêuang', en: 'tiles' },
        { th: 'บิ่น', rom: 'bìn', en: 'chipped' },
        { th: 'หลาย', rom: 'lǎai', en: 'several' },
        { th: 'แผ่น', rom: 'phàen', en: 'pieces' },
      ], en: 'Several tiles are chipped.' },
      { tokens: [
        { th: 'ผม', rom: 'phǒm', en: 'I (male)' },
        { th: 'ไม่พอใจ', rom: 'mâi-phor-jai', en: 'am not satisfied' },
        { th: 'งานนี้', rom: 'ngaan-née', en: 'with this work' },
      ], en: "I'm not satisfied with this work." },
      { tokens: [
        { th: 'ช่วย', rom: 'chûay', en: 'please' },
        { th: 'มา', rom: 'maa', en: 'come' },
        { th: 'ดู', rom: 'duu', en: 'look' },
        { th: 'หน่อย', rom: 'nòi', en: '[softener]' },
      ], en: 'Please come and take a look.' },
    ],
  },
  {
    key: 'reno-measure',
    th: 'วัดขนาด',
    label: 'Measuring & Quantities',
    icon: '📐',
    sentences: [
      { tokens: [
        { th: 'ห้องนี้', rom: 'hông-née', en: 'this room' },
        { th: 'กี่', rom: 'gèe', en: 'how many' },
        { th: 'ตารางเมตร', rom: 'dtaa-raang-méet', en: 'square metres' },
      ], en: 'How many square metres is this room?' },
      { tokens: [
        { th: 'กว้าง', rom: 'kwâang', en: 'wide' },
        { th: 'สาม', rom: 'sǎam', en: 'three' },
        { th: 'เมตร', rom: 'méet', en: 'metres' },
      ], en: 'It is three metres wide.' },
      { tokens: [
        { th: 'สูง', rom: 'sǔung', en: 'tall / high' },
        { th: 'เท่าไร', rom: 'thâo-rai', en: 'how much' },
      ], en: 'How tall is it?' },
      { tokens: [
        { th: 'หนา', rom: 'nǎa', en: 'thick' },
        { th: 'กี่', rom: 'gèe', en: 'how many' },
        { th: 'เซนติเมตร', rom: 'sen-dtì-méet', en: 'centimetres' },
      ], en: 'How many centimetres thick?' },
      { tokens: [
        { th: 'ต้องใช้', rom: 'dtông-chái', en: 'need to use' },
        { th: 'กี่', rom: 'gèe', en: 'how many' },
        { th: 'แผ่น', rom: 'phàen', en: 'sheets' },
      ], en: 'How many sheets are needed?' },
      { tokens: [
        { th: 'ตัด', rom: 'dtàt', en: 'cut' },
        { th: 'ให้สั้นลง', rom: 'hâi-sân-long', en: 'shorter' },
        { th: 'สิบ', rom: 'sìp', en: 'ten' },
        { th: 'เซนติเมตร', rom: 'sen-dtì-méet', en: 'centimetres' },
      ], en: 'Cut it ten centimetres shorter.' },
      { tokens: [
        { th: 'วัด', rom: 'wát', en: 'measure' },
        { th: 'อีกครั้ง', rom: 'èek-kráng', en: 'again' },
        { th: 'ได้', rom: 'dâai', en: 'can' },
        { th: 'ไหม', rom: 'mǎi', en: '[question]' },
      ], en: 'Could you measure it again?' },
      { tokens: [
        { th: 'อันนี้', rom: 'an-née', en: 'this one' },
        { th: 'ยาว', rom: 'yaao', en: 'long' },
        { th: 'เกินไป', rom: 'gern-bpai', en: 'too much' },
      ], en: 'This one is too long.' },
      { tokens: [
        { th: 'ต้อง', rom: 'dtông', en: 'must' },
        { th: 'ได้ระดับ', rom: 'dâai-rá-dàp', en: 'be level' },
      ], en: 'It has to be level.' },
      { tokens: [
        { th: 'เส้นนี้', rom: 'sên-née', en: 'this line' },
        { th: 'ไม่ตรง', rom: 'mâi-dtrong', en: 'is not straight' },
      ], en: 'This line is not straight.' },
      { tokens: [
        { th: 'ขนาด', rom: 'khà-nàat', en: 'the sizes' },
        { th: 'เท่ากัน', rom: 'thâo-gan', en: 'the same' },
        { th: 'ไหม', rom: 'mǎi', en: '[question]' },
      ], en: 'Are the sizes the same?' },
      { tokens: [
        { th: 'เผื่อ', rom: 'phèua', en: 'allow extra' },
        { th: 'ไว้', rom: 'wái', en: 'keep' },
        { th: 'นิดหน่อย', rom: 'nít-nòi', en: 'a little' },
      ], en: 'Leave a little extra.' },
    ],
  },
  {
    key: 'reno-utilities',
    th: 'ไฟและประปา',
    label: 'Electrical & Plumbing',
    icon: '🔌',
    sentences: [
      { tokens: [
        { th: 'ปลั๊ก', rom: 'bplák', en: 'the outlet' },
        { th: 'นี้', rom: 'née', en: 'this' },
        { th: 'ใช้ไม่ได้', rom: 'chái-mâi-dâai', en: "doesn't work" },
      ], en: "This outlet doesn't work." },
      { tokens: [
        { th: 'น้ำ', rom: 'nám', en: 'the water' },
        { th: 'ไม่ไหล', rom: 'mâi-lǎi', en: "doesn't flow" },
      ], en: 'The water is not running.' },
      { tokens: [
        { th: 'ไฟ', rom: 'fai', en: 'the power' },
        { th: 'ดับ', rom: 'dàp', en: 'is out' },
      ], en: 'The power is out.' },
      { tokens: [
        { th: 'ช่วย', rom: 'chûay', en: 'please' },
        { th: 'ปิด', rom: 'bpìt', en: 'turn off' },
        { th: 'เบรกเกอร์', rom: 'brèk-gêr', en: 'the breaker' },
        { th: 'ก่อน', rom: 'gòn', en: 'first' },
      ], en: 'Please turn off the breaker first.' },
      { tokens: [
        { th: 'ต้อง', rom: 'dtông', en: 'must' },
        { th: 'เดินสายไฟ', rom: 'dern-sǎai-fai', en: 'run the wiring' },
        { th: 'ใหม่', rom: 'mài', en: 'anew' },
      ], en: 'The wiring has to be redone.' },
      { tokens: [
        { th: 'อยาก', rom: 'yàak', en: 'want' },
        { th: 'เพิ่ม', rom: 'phêrm', en: 'to add' },
        { th: 'ปลั๊ก', rom: 'bplák', en: 'outlets' },
        { th: 'สองจุด', rom: 'sǒng-jùt', en: 'two points' },
      ], en: 'I want to add two outlets.' },
      { tokens: [
        { th: 'ท่อน้ำ', rom: 'thôr-nám', en: 'the water pipe' },
        { th: 'รั่ว', rom: 'rûa', en: 'leaks' },
        { th: 'ใต้', rom: 'dtâi', en: 'under' },
        { th: 'อ่าง', rom: 'àang', en: 'the sink' },
      ], en: 'The water pipe leaks under the sink.' },
      { tokens: [
        { th: 'เปลี่ยน', rom: 'bplìan', en: 'replace' },
        { th: 'ก๊อกน้ำ', rom: 'gók-nám', en: 'the tap' },
        { th: 'ให้หน่อย', rom: 'hâi-nòi', en: 'for me please' },
      ], en: 'Please replace the tap for me.' },
      { tokens: [
        { th: 'ติดตั้ง', rom: 'dtìt-dtâng', en: 'install' },
        { th: 'หลอดไฟ', rom: 'lòt-fai', en: 'a light' },
        { th: 'ตรงนี้', rom: 'dtrong-née', en: 'here' },
      ], en: 'Install a light here.' },
      { tokens: [
        { th: 'น้ำร้อน', rom: 'nám-rón', en: 'hot water' },
        { th: 'ไม่ออก', rom: 'mâi-òk', en: "doesn't come out" },
      ], en: 'No hot water comes out.' },
      { tokens: [
        { th: 'ชักโครก', rom: 'chák-khrôok', en: 'the toilet' },
        { th: 'กด', rom: 'gòt', en: 'flush' },
        { th: 'ไม่ลง', rom: 'mâi-long', en: "won't go down" },
      ], en: "The toilet won't flush." },
      { tokens: [
        { th: 'ช่างไฟ', rom: 'châang-fai', en: 'the electrician' },
        { th: 'มา', rom: 'maa', en: 'come' },
        { th: 'เมื่อไร', rom: 'mêua-rai', en: 'when' },
      ], en: 'When is the electrician coming?' },
    ],
  },
  {
    key: 'reno-schedule',
    th: 'นัดและจ่ายเงิน',
    label: 'Schedule & Payment',
    icon: '📅',
    sentences: [
      { tokens: [
        { th: 'พรุ่งนี้', rom: 'phrûng-née', en: 'tomorrow' },
        { th: 'มา', rom: 'maa', en: 'come' },
        { th: 'กี่โมง', rom: 'gèe-mohng', en: 'what time' },
      ], en: 'What time are you coming tomorrow?' },
      { tokens: [
        { th: 'วันนี้', rom: 'wan-née', en: 'today' },
        { th: 'ทำ', rom: 'tham', en: 'work' },
        { th: 'ถึง', rom: 'thěung', en: 'until' },
        { th: 'กี่โมง', rom: 'gèe-mohng', en: 'what time' },
      ], en: 'Until what time are you working today?' },
      { tokens: [
        { th: 'งาน', rom: 'ngaan', en: 'the work' },
        { th: 'จะเสร็จ', rom: 'jà-sèt', en: 'will finish' },
        { th: 'เมื่อไร', rom: 'mêua-rai', en: 'when' },
      ], en: 'When will the work be finished?' },
      { tokens: [
        { th: 'ช้ากว่า', rom: 'cháa-gwàa', en: 'later than' },
        { th: 'กำหนด', rom: 'gam-nòt', en: 'the schedule' },
      ], en: 'It is behind schedule.' },
      { tokens: [
        { th: 'จ่าย', rom: 'jàai', en: 'pay' },
        { th: 'มัดจำ', rom: 'mát-jam', en: 'deposit' },
        { th: 'ห้าสิบ', rom: 'hâa-sìp', en: 'fifty' },
        { th: 'เปอร์เซ็นต์', rom: 'bper-sen', en: 'percent' },
      ], en: "I'll pay a fifty percent deposit." },
      { tokens: [
        { th: 'จ่าย', rom: 'jàai', en: 'pay' },
        { th: 'ที่เหลือ', rom: 'thêe-lěua', en: 'the rest' },
        { th: 'ตอนเสร็จ', rom: 'dton-sèt', en: 'when finished' },
      ], en: "I'll pay the rest when it's done." },
      { tokens: [
        { th: 'ขอ', rom: 'khǒr', en: 'may I have' },
        { th: 'ใบเสร็จ', rom: 'bai-sèt', en: 'a receipt' },
        { th: 'ด้วย', rom: 'dûay', en: 'as well' },
      ], en: 'Please give me a receipt as well.' },
      { tokens: [
        { th: 'โอนเงิน', rom: 'ohn-ngern', en: 'transfer money' },
        { th: 'ได้', rom: 'dâai', en: 'can' },
        { th: 'ไหม', rom: 'mǎi', en: '[question]' },
      ], en: 'Can I pay by bank transfer?' },
      { tokens: [
        { th: 'อาทิตย์หน้า', rom: 'aa-thít-nâa', en: 'next week' },
        { th: 'มา', rom: 'maa', en: 'come' },
        { th: 'ได้', rom: 'dâai', en: 'can' },
        { th: 'ไหม', rom: 'mǎi', en: '[question]' },
      ], en: 'Could you come next week?' },
      { tokens: [
        { th: 'วันนี้', rom: 'wan-née', en: 'today' },
        { th: 'ไม่ต้อง', rom: 'mâi-dtông', en: 'no need to' },
        { th: 'มา', rom: 'maa', en: 'come' },
      ], en: "You don't need to come today." },
      { tokens: [
        { th: 'ขอเลื่อน', rom: 'khǒr-lêuan', en: 'may we postpone' },
        { th: 'เป็น', rom: 'bpen', en: 'to' },
        { th: 'วันจันทร์', rom: 'wan-jan', en: 'Monday' },
      ], en: 'Can we postpone it to Monday?' },
      { tokens: [
        { th: 'เซ็น', rom: 'sen', en: 'sign' },
        { th: 'สัญญา', rom: 'sǎn-yaa', en: 'the contract' },
        { th: 'ก่อน', rom: 'gòn', en: 'before' },
        { th: 'เริ่มงาน', rom: 'rêrm-ngaan', en: 'starting work' },
      ], en: 'Sign the contract before starting work.' },
    ],
  },
  {
    key: 'reno-site',
    th: 'หน้างาน',
    label: 'On Site & Safety',
    icon: '🦺',
    sentences: [
      { tokens: [
        { th: 'ระวัง', rom: 'rá-wang', en: 'watch out for' },
        { th: 'หัว', rom: 'hǔa', en: 'your head' },
      ], en: 'Watch your head.' },
      { tokens: [
        { th: 'ใส่', rom: 'sài', en: 'wear' },
        { th: 'ถุงมือ', rom: 'thǔng-meu', en: 'gloves' },
        { th: 'ด้วย', rom: 'dûay', en: 'please' },
      ], en: 'Please wear gloves.' },
      { tokens: [
        { th: 'ปิดไฟ', rom: 'bpìt-fai', en: 'cut the power' },
        { th: 'ก่อน', rom: 'gòn', en: 'before' },
        { th: 'ทำงาน', rom: 'tham-ngaan', en: 'working' },
      ], en: 'Turn off the power before working.' },
      { tokens: [
        { th: 'ตรงนี้', rom: 'dtrong-née', en: 'here' },
        { th: 'อันตราย', rom: 'an-dtà-raai', en: 'dangerous' },
      ], en: 'It is dangerous here.' },
      { tokens: [
        { th: 'ฝุ่น', rom: 'fùn', en: 'dust' },
        { th: 'เยอะ', rom: 'yúh', en: 'a lot' },
        { th: 'มาก', rom: 'mâak', en: 'very' },
      ], en: 'There is a lot of dust.' },
      { tokens: [
        { th: 'ช่วย', rom: 'chûay', en: 'please' },
        { th: 'คลุม', rom: 'khlum', en: 'cover' },
        { th: 'พื้น', rom: 'péun', en: 'the floor' },
        { th: 'ด้วย', rom: 'dûay', en: 'as well' },
      ], en: 'Please cover the floor.' },
      { tokens: [
        { th: 'เก็บ', rom: 'gèp', en: 'put away' },
        { th: 'เครื่องมือ', rom: 'khrêuang-meu', en: 'the tools' },
        { th: 'ให้เรียบร้อย', rom: 'hâi-rîap-rói', en: 'properly' },
      ], en: 'Put the tools away properly.' },
      { tokens: [
        { th: 'ห้าม', rom: 'hâam', en: 'forbidden' },
        { th: 'สูบบุหรี่', rom: 'sùup-bù-rèe', en: 'to smoke' },
        { th: 'ตรงนี้', rom: 'dtrong-née', en: 'here' },
      ], en: 'No smoking here.' },
      { tokens: [
        { th: 'เอา', rom: 'ao', en: 'take' },
        { th: 'ขยะ', rom: 'khà-yà', en: 'the rubbish' },
        { th: 'ไปทิ้ง', rom: 'bpai-thíng', en: 'to throw out' },
        { th: 'ข้างนอก', rom: 'khâang-nôk', en: 'outside' },
      ], en: 'Take the rubbish outside.' },
      { tokens: [
        { th: 'อย่า', rom: 'yàa', en: "don't" },
        { th: 'ทำเสียงดัง', rom: 'tham-sǐang-dang', en: 'make noise' },
        { th: 'ตอนกลางคืน', rom: 'dton-glaang-kheun', en: 'at night' },
      ], en: "Don't make noise at night." },
      { tokens: [
        { th: 'ล็อค', rom: 'lók', en: 'lock' },
        { th: 'ประตู', rom: 'bprà-dtuu', en: 'the door' },
        { th: 'ก่อนกลับ', rom: 'gòn-glàp', en: 'before leaving' },
      ], en: 'Lock the door before you leave.' },
      { tokens: [
        { th: 'พัก', rom: 'phák', en: 'rest' },
        { th: 'กินข้าว', rom: 'gin-khâao', en: 'eat' },
        { th: 'ได้', rom: 'dâai', en: 'you may' },
      ], en: 'You can take a lunch break.' },
    ],
  },
];

// ── Lesson layout ───────────────────────────────────────────────────────────
// Each entry becomes one world in the pack; lessons are sliced from the
// category's words in order, 8 per lesson, with a checkpoint at the end.

export interface RenoWorldPlan {
  id: string;
  title: string;
  subtitle: string;
  emoji: string;
  tier: 2 | 3;
  categories: string[];
  phraseKeys: string[];
  lessonTitles: [string, string][]; // [title, icon]
}

export const RENO_WORLD_PLANS: RenoWorldPlan[] = [
  {
    id: 'rv1',
    title: 'Tools & Materials',
    subtitle: 'Everything on the truck',
    emoji: '🔨',
    tier: 2,
    categories: ['reno-tools', 'reno-materials'],
    phraseKeys: ['reno-store', 'reno-hiring'],
    lessonTitles: [
      ['Hand Tools', '🔨'], ['Power Tools', '🪚'], ['Safety Gear', '🦺'],
      ['Site Kit', '🧰'], ['Cement & Stone', '🧱'], ['Surfaces', '🎨'],
      ['Timber & Steel', '🪵'], ['Fixings', '🔩'], ['Pipes & Wiring', '🔌'],
      ['Finishes', '✨'],
    ],
  },
  {
    id: 'rv2',
    title: 'The Work Itself',
    subtitle: 'Verbs and the parts of a house',
    emoji: '🏗️',
    tier: 2,
    categories: ['reno-technique', 'reno-structure'],
    phraseKeys: ['reno-instruct', 'reno-site'],
    lessonTitles: [
      ['Demolition', '💥'], ['Building Up', '🧱'], ['Wet Trades', '🪣'],
      ['Finishing', '🖌️'], ['Fixing & Fitting', '🔧'], ['Structure', '🏛️'],
      ['Rooms', '🚪'], ['Outside', '🌤️'], ['Fittings', '🚿'],
    ],
  },
  {
    id: 'rv3',
    title: 'Crew & Numbers',
    subtitle: 'Who does what, and how much of it',
    emoji: '📐',
    tier: 3,
    categories: ['reno-trades', 'reno-measure'],
    phraseKeys: ['reno-measure', 'reno-hiring'],
    lessonTitles: [
      ['The Trades', '👷'], ['Specialists', '⚡'], ['Units', '📏'],
      ['Quantities', '🔢'], ['Dimensions', '📐'],
    ],
  },
  {
    id: 'rv4',
    title: 'Problems & Money',
    subtitle: 'What went wrong, and what it costs',
    emoji: '💸',
    tier: 3,
    categories: ['reno-problems', 'reno-money'],
    phraseKeys: ['reno-problems', 'reno-schedule'],
    lessonTitles: [
      ['Water Damage', '💧'], ['Wear & Decay', '🐛'], ['Defects', '🔍'],
      ['Quoting', '🧾'], ['Paying', '💰'],
    ],
  },
];

// Phrase categories that belong to a given renovation world (used by the
// checkpoint phrase questions).
export function renoPhrasesForWorld(worldId: string): PhraseCategory[] {
  const plan = RENO_WORLD_PLANS.find(p => p.id === worldId);
  if (!plan) return RENOVATION_PHRASES;
  const picked = RENOVATION_PHRASES.filter(c => plan.phraseKeys.includes(c.key));
  return picked.length ? picked : RENOVATION_PHRASES;
}
