/**
 * المحتوى العلمي المعتمد لدرس «شروط الصلاة (2)» – الصف الثالث الابتدائي – الدرس الثامن (ص 70–71)
 * جميع النصوص منقولة كما وردت في الكتاب المدرسي.
 */

export const LESSON = {
  slug: "shurut-alsalah-2",
  title: "شروط الصلاة (2)",
  subject: "الدراسات الإسلامية – الفقه",
  grade: "الصف الثالث الابتدائي",
  lessonNumber: 8,
  pages: "70–71",
  school: "العروس الابتدائية",
  teacher: "علي عبدالله راجحي",
};

/** الآية الكريمة في مطلع الدرس */
export const AYAH = {
  text: "﴿إِنَّمَا الْمُؤْمِنُونَ الَّذِينَ إِذَا ذُكِرَ اللَّهُ وَجِلَتْ قُلُوبُهُمْ﴾",
  source: "سورة الحديد، الآية (16)",
  intro: "قال الله تعالى:",
};

/** الشروط الجديدة التي يدرسها هذا الدرس (7 – 9) */
export const NEW_CONDITIONS = [
  {
    key: "time",
    order: 7,
    ordinal: "السابع",
    name: "دخول الوقت",
    text: "حتى تحدثُ الصلاةُ في وقتها.",
    simple: "لا تصح الصلاة إلا في وقتها المحدَّد.",
    icon: "🕐",
    color: "from-teal-400 to-teal-600",
    example: "صلى خالد صلاة الفجر قبل طلوع الشمس.",
  },
  {
    key: "qibla",
    order: 8,
    ordinal: "الثامن",
    name: "استقبال القبلة",
    text: "فيستقبل القبلة في صلاته.",
    simple: "أستقبل الكعبة المشرفة عند صلاتي.",
    icon: "🕋",
    color: "from-sky-400 to-sky-600",
    example: "استقبل سعيد الكعبة المشرفة عند صلاته.",
  },
  {
    key: "niyyah",
    order: 9,
    ordinal: "التاسع",
    name: "النية",
    text: "فيُنوي الصلاة التي يريد أداءها.",
    simple: "أنوي في قلبي الصلاة التي أريد أداءها.",
    icon: "💖",
    color: "from-indigo-400 to-indigo-600",
    example: "نوى سالم في قلبه صلاة العصر.",
  },
] as const;

export type NewConditionKey = (typeof NEW_CONDITIONS)[number]["key"];

/** الشروط التسعة كاملة (الدرسان السابع والثامن) */
/** الشروط التسعة بالترتيب الصحيح كما في الكتاب */
export const ALL_CONDITIONS = [
  { key: "islam", name: "الإسلام", icon: "🕌" },
  { key: "tamyeez", name: "التمييز", icon: "🧒" },
  { key: "aql", name: "العقل", icon: "🧠" },
  { key: "tahara", name: "الطهارة", icon: "💧" },
  { key: "najasa", name: "إزالة النجاسة", icon: "🧼" },
  { key: "awrah", name: "ستر العورة", icon: "👕" },
  { key: "time", name: "دخول الوقت", icon: "🕐" },
  { key: "qibla", name: "استقبال القبلة", icon: "🕋" },
  { key: "niyyah", name: "النية", icon: "💖" },
] as const;

/** أوقات الصلوات الخمس كما وردت في الكتاب */
export const PRAYER_TIMES = [
  {
    key: "fajr",
    name: "الفجر",
    rakat: "ركعتان",
    emoji: "🌅",
    start: "من طلوع الفجر الثاني",
    end: "إلى طلوع الشمس",
    color: "from-indigo-400 to-indigo-600",
  },
  {
    key: "dhuhr",
    name: "الظهر",
    rakat: "أربع ركعات",
    emoji: "☀️",
    start: "من زوال الشمس",
    end: "إلى أن يصبح ظل كل شيء مثله",
    color: "from-amber-400 to-orange-500",
  },
  {
    key: "asr",
    name: "العصر",
    rakat: "أربع ركعات",
    emoji: "🌤️",
    start: "من خروج وقت الظهر",
    end: "إلى اصفرار الشمس",
    color: "from-orange-400 to-amber-600",
  },
  {
    key: "maghrib",
    name: "المغرب",
    rakat: "ثلاث ركعات",
    emoji: "🌇",
    start: "من غروب الشمس",
    end: "إلى مغيب الشفق الأحمر",
    color: "from-rose-400 to-red-500",
  },
  {
    key: "isha",
    name: "العشاء",
    rakat: "أربع ركعات",
    emoji: "🌙",
    start: "من مغيب الشفق الأحمر",
    end: "إلى نصف الليل",
    color: "from-slate-500 to-indigo-700",
  },
] as const;

export type PrayerKey = (typeof PRAYER_TIMES)[number]["key"];

/** الحديث النبوي في شرط النية */
export const HADITH_NIYYAH = {
  intro: "قال رسول الله ﷺ:",
  text: "«إِنَّمَا الأَعْمَالُ بِالنِّيَّاتِ»",
  source: "أخرجه البخاري (1) ومسلم (1907)",
  words: ["إِنَّمَا", "الأَعْمَالُ", "بِالنِّيَّاتِ"],
  conclusion: "النية شرط من شروط الصلاة، ومكانها القلب لا اللسان.",
};

/** قاعدة النية كما وردت في الكتاب */
export const NIYYAH_RULE = "النِّيَّةُ مَكانُهَا القَلْبُ، فلا تُنْطَقُ باللِّسانِ.";

/** عبارات نشاط الكعبة (الشرط الثامن) */
export const KAABA_ITEMS = [
  { id: "k1", label: "نستقبلها عند أداء الصلاة.", correct: true },
  { id: "k2", label: "تُبنى من الحجر الأسود.", correct: false },
  { id: "k3", label: "استقبالها شرط من شروط الصلاة.", correct: true },
  { id: "k4", label: "نستقبلها في صلاة الفجر فقط.", correct: false },
] as const;

/** مواقف المحقق الصغير (هل الوقت صحيح؟) */
export const DETECTIVE_CASES = [
  {
    key: "detective_case_1",
    emoji: "🌅",
    title: "القضية الأولى",
    text: "صلى سعد صلاة الفجر بعد طلوع الشمس.",
    prayer: "الفجر",
    whereChoices: ["وقت صلاة الفجر", "وقت صلاة الظهر", "وقت صلاة العشاء"],
    whereCorrect: 0,
    fixChoices: ["صلى قبل طلوع الشمس", "صلى بعد زوال الشمس", "صلى بعد نصف الليل"],
    fixCorrect: 0,
  },
  {
    key: "detective_case_2",
    emoji: "🌤️",
    title: "القضية الثانية",
    text: "صلى نورة صلاة العصر قبل غروب الشمس.",
    prayer: "العصر",
    whereChoices: ["وقت صلاة العصر", "وقت صلاة الفجر", "وقت صلاة المغرب"],
    whereCorrect: 0,
    fixChoices: ["صلى قبل اصفرار الشمس", "صلى قبل طلوع الشمس", "صلى بعد نصف الليل"],
    fixCorrect: 0,
  },
  {
    key: "detective_case_3",
    emoji: "🕋",
    title: "القضية الثالثة",
    text: "صلى فهد صلاة المغرب مستقبلًا الشرق.",
    prayer: "المغرب",
    whereChoices: ["استقبال القبلة", "دخول الوقت", "النية"],
    whereCorrect: 0,
    fixChoices: ["يستقبل الكعبة المشرفة", "يستقبل الشرق", "يستقبل الجنوب"],
    fixCorrect: 0,
  },
] as const;

/** نشاط 2: الخانات الفارغة في الشروط التسعة */
/**
 * الشروط التسعة بالترتيب الصحيح كما في الكتاب:
 * 1 الإسلام، 2 التمييز، 3 العقل، 4 الطهارة، 5 إزالة النجاسة، 6 ستر العورة، 7 دخول الوقت، 8 استقبال القبلة، 9 النية
 */
export const NINE_ORDER = [
  "الإسلام",
  "التمييز",
  "العقل",
  "الطهارة",
  "إزالة النجاسة",
  "ستر العورة",
  "دخول الوقت",
  "استقبال القبلة",
  "النية",
] as const;

export const NINE_ICONS: Record<string, string> = {
  الإسلام: "🕌",
  التمييز: "🧒",
  العقل: "🧠",
  الطهارة: "💧",
  "إزالة النجاسة": "🧼",
  "ستر العورة": "👕",
  "دخول الوقت": "🕐",
  "استقبال القبلة": "🕋",
  النية: "💖",
};

/** الخانات المعطاة (مكتملة في الكتاب) */
export const NINE_GIVEN = [
  { slot: 1, label: "الإسلام" },
  { slot: 3, label: "العقل" },
  { slot: 5, label: "إزالة النجاسة" },
  { slot: 7, label: "دخول الوقت" },
  { slot: 9, label: "النية" },
] as const;

/** الخانات الفارغة التي يملؤها الطالب */
export const NINE_BLANKS = [
  { slot: 2, answer: "التمييز" },
  { slot: 4, answer: "الطهارة" },
  { slot: 6, answer: "ستر العورة" },
  { slot: 8, answer: "استقبال القبلة" },
] as const;

/** نشاط 3: أوقات الصلوات في المواعيد الثابتة */
export const IQAMA_ROWS = [
  { key: "fajr", name: "الفجر" },
  { key: "dhuhr", name: "الظهر" },
  { key: "asr", name: "العصر" },
  { key: "maghrib", name: "المغرب" },
  { key: "isha", name: "العشاء" },
] as const;

/** خيارات تصحيح المواعيد (التقويم) */
export const CORRECT_ROWS = [
  {
    key: "correct_1",
    label: "صلى سعد عقب القيامة",
    prayer: "صلاة الفجر",
    choices: [
      "صلى سعد صلاة الفجر قبل طلوع الشمس",
      "صلى سعد صلاة الفجر بعد زوال الشمس",
      "صلى سعد صلاة الفجر بعد مغيب الشفق",
    ],
    correct: 0,
    explanation: "وقت صلاة الفجر من طلوع الفجر الثاني إلى طلوع الشمس.",
  },
  {
    key: "correct_2",
    label: "صلى محمدة العصر قبل غروب الشمس",
    prayer: "صلاة العصر",
    choices: [
      "صلى محمدة صلاة العصر قبل اصفرار الشمس",
      "صلى محمدة صلاة العصر بعد مغيب الشفق",
      "صلى محمدة صلاة العصر بعد نصف الليل",
    ],
    correct: 0,
    explanation: "وقت صلاة العصر من خروج وقت الظهر إلى اصفرار الشمس.",
  },
] as const;

/** التقويم: ما الوقت الذي تدل عليه الصورة؟ */
export const IMAGE_TIME = {
  text: "أ. ما الوقت الذي تدل عليه الصورة؟",
  choices: ["وقت صلاة المغرب", "وقت صلاة الفجر", "وقت صلاة الظهر"],
  correct: 0,
  prayer: {
    text: "ب. ما الصلاة التي تُؤدَّى في هذا الوقت؟",
    choices: ["صلاة المغرب", "صلاة الفجر", "صلاة العصر"],
    correct: 0,
  },
  explanation: "الصورة تدل على مغيب الشفق الأحمر، وهو وقت صلاة المغرب.",
} as const;

/* ------------------------------------------------------------------ */
/*  المحطات (12 محطة)                                                  */
/* ------------------------------------------------------------------ */

export const SLIDES = [
  { key: "intro", title: "متى أُصلّي؟", subtitle: "التهيئة المشوقة", strategy: "العصف الذهني وأسئلة التوقع", emoji: "🤔" },
  { key: "discover", title: "اكتشف الشروط الجديدة", subtitle: "ثلاثة شروط جديدة", strategy: "التعلم بالاكتشاف", emoji: "🃏" },
  { key: "times", title: "أوقات الصلوات الخمس", subtitle: "بطاقات الأوقات", strategy: "التعلم البصري", emoji: "🕐" },
  { key: "match", title: "طابق الصلاة بوقتها", subtitle: "نشاط المطابقة", strategy: "المطابقة والربط", emoji: "🔗" },
  { key: "dhuhr", title: "وقت الظهر والعصر", subtitle: "شاهد وفكر وأجب", strategy: "شاهد – فكر – أجب", emoji: "☀️" },
  { key: "detective", title: "تحدي المحقق: هل الوقت صحيح؟", subtitle: "مواقف من حياتنا", strategy: "المحقق الصغير", emoji: "🔍" },
  { key: "qibla", title: "استقبال القبلة", subtitle: "الكعبة المشرفة", strategy: "التعلم البصري", emoji: "🕋" },
  { key: "niyyah", title: "النية", subtitle: "تدبر الحديث", strategy: "تدبر الحديث والاستنتاج", emoji: "💖" },
  { key: "classify", title: "أكمل الشروط التسعة", subtitle: "نشاط جماعي", strategy: "التصنيف والتعلم التعاوني", emoji: "🗂️" },
  { key: "book", title: "نشاط الكتاب المدرسي", subtitle: "تدريبات إلكترونية", strategy: "التدريب والممارسة", emoji: "📘" },
  { key: "quiz", title: "التقويم الختامي", subtitle: "اختبر نفسك", strategy: "التقويم التفاعلي", emoji: "📝" },
  { key: "champion", title: "بطل شروط الصلاة", subtitle: "التحدي النهائي والشهادة", strategy: "التعلم باللعب", emoji: "🏆" },
] as const;

export type SlideKey = (typeof SLIDES)[number]["key"];

/* ------------------------------------------------------------------ */
/*  أنشطة المحطات                                                      */
/* ------------------------------------------------------------------ */

export type ActivityResult = {
  isCorrect: boolean | null;
  score: number;
  maxScore: number;
  needsReview: boolean;
  detail?: Record<string, boolean>;
};

export type ActivityDef = {
  slideKey: SlideKey;
  title: string;
  kind: string;
  required: boolean;
  maxScore: number;
  grade: (answer: unknown) => ActivityResult;
};

const asRecord = (v: unknown): Record<string, unknown> =>
  v && typeof v === "object" && !Array.isArray(v) ? (v as Record<string, unknown>) : {};

const mapGrade = (answer: unknown, key: Record<string, string>): ActivityResult => {
  const a = asRecord(answer);
  const detail: Record<string, boolean> = {};
  let score = 0;
  for (const [item, zone] of Object.entries(key)) {
    const ok = a[item] === zone;
    detail[item] = ok;
    if (ok) score += 1;
  }
  const max = Object.keys(key).length;
  return { isCorrect: score === max, score, maxScore: max, needsReview: false, detail };
};

const choiceGrade = (answer: unknown, correct: number): ActivityResult => {
  const a = asRecord(answer);
  const ok = Number(a.choice) === correct;
  return { isCorrect: ok, score: ok ? 1 : 0, maxScore: 1, needsReview: false };
};

const multiChoiceGrade = (answer: unknown, correct: Record<string, number>): ActivityResult => {
  const a = asRecord(answer);
  const detail: Record<string, boolean> = {};
  let score = 0;
  for (const [k, v] of Object.entries(correct)) {
    const ok = Number(a[k]) === v;
    detail[k] = ok;
    if (ok) score += 1;
  }
  const max = Object.keys(correct).length;
  return { isCorrect: score === max, score, maxScore: max, needsReview: false, detail };
};

const participationGrade = (answer: unknown): ActivityResult => {
  const a = asRecord(answer);
  const hasText = typeof a.text === "string" && a.text.trim().length > 0;
  const hasAudio = a.audio === true;
  const hasChoices = Array.isArray(a.choices) && a.choices.length > 0;
  const ok = hasText || hasAudio || hasChoices || a.done === true;
  return { isCorrect: ok ? true : null, score: ok ? 1 : 0, maxScore: 1, needsReview: false };
};

const orderGrade = (answer: unknown, correct: readonly string[]): ActivityResult => {
  const a = asRecord(answer);
  const order = Array.isArray(a.order) ? (a.order as unknown[]) : [];
  const ok = order.length === correct.length && order.every((w, i) => w === correct[i]);
  return { isCorrect: ok, score: ok ? 1 : 0, maxScore: 1, needsReview: false };
};

const boolGrade = (answer: unknown, correct: Record<string, boolean>): ActivityResult => {
  const a = asRecord(answer);
  const detail: Record<string, boolean> = {};
  let score = 0;
  for (const [k, v] of Object.entries(correct)) {
    const ok = a[k] === v;
    detail[k] = ok;
    if (ok) score += 1;
  }
  const max = Object.keys(correct).length;
  return { isCorrect: score === max, score, maxScore: max, needsReview: false, detail };
};

/** معاني الشروط الجديدة (نشاط المطابقة) */
export const DISCOVER_MEANINGS: Record<NewConditionKey, string> = {
  time: "حتى تحدث الصلاة في وقتها",
  qibla: "فيستقبل القبلة في صلاته",
  niyyah: "فيُنوي الصلاة التي يريد أداءها",
};

/** أسئلة محطة شاهد وفكر وأجب (الظهر والعصر) */
export const DHUHR_QUESTIONS = [
  {
    key: "d1",
    text: "متى يبدأ وقت صلاة الظهر؟",
    choices: ["من زوال الشمس", "من طلوع الفجر الثاني", "من مغيب الشفق"],
    correct: 0,
  },
  {
    key: "d2",
    text: "متى ينتهي وقت صلاة العصر؟",
    choices: ["عند اصفرار الشمس", "عند نصف الليل", "عند طلوع الشمس"],
    correct: 0,
  },
  {
    key: "d3",
    text: "أستنتج: لماذا لا تصح الصلاة قبل دخول وقتها؟",
    choices: [
      "لأن دخول الوقت شرط من شروط الصلاة",
      "لأن الصلاة تُصلى في أي وقت",
      "لأن الوقت لا يهم في الصلاة",
    ],
    correct: 0,
  },
] as const;

/** خيارات القبلة */
export const QIBLA_RULE_CHOICES = {
  where: ["مكة المكرمة", "الصحراء", "المدينة المنورة"],
} as const;

/** بطاقات المحقق */
export const DETECTIVE_CASE_KEYS = DETECTIVE_CASES.map((c) => c.key);

/** بطاقات التصنيف: الشروط التسعة (نشاط جماعي) */
export const CLASSIFY_CARDS = [
  { id: "c1", label: "الإسلام", zone: "islam" },
  { id: "c2", label: "الطهارة", zone: "tahara" },
  { id: "c3", label: "التمييز", zone: "tamyeez" },
  { id: "c4", label: "إزالة النجاسة", zone: "najasa" },
  { id: "c5", label: "ستر العورة", zone: "awrah" },
  { id: "c6", label: "العقل", zone: "aql" },
  { id: "c7", label: "دخول الوقت", zone: "time" },
  { id: "c8", label: "استقبال القبلة", zone: "qibla" },
  { id: "c9", label: "النية", zone: "niyyah" },
] as const;

/** بطاقات أوقات الصلوات (للسبورة الذكية) */
export const PRAYER_CARDS = PRAYER_TIMES.map((p) => ({ id: p.key, label: p.name, zone: p.key }));

/** مستويات لعبة التحدي النهائي */
export const CHAMPION_LEVELS = [
  { key: "time", text: "الشرط السابع من شروط الصلاة هو ...", choices: ["دخول الوقت", "النية", "الطهارة"], correct: 0 },
  { key: "fajr", text: "وقت صلاة الفجر من ... إلى ...", choices: ["طلوع الفجر الثاني – طلوع الشمس", "غروب الشمس – نصف الليل", "زوال الشمس – اصفرارها"], correct: 0 },
  { key: "asr", text: "ينتهي وقت صلاة العصر عند ...", choices: ["اصفرار الشمس", "طلوع الشمس", "نصف الليل"], correct: 0 },
  { key: "qibla", text: "الشرط الثامن من شروط الصلاة هو ...", choices: ["استقبال القبلة", "إزالة النجاسة", "التمييز"], correct: 0 },
  { key: "niyyah", text: "الشرط التاسع من شروط الصلاة هو ...", choices: ["النية", "دخول الوقت", "ستر العورة"], correct: 0 },
  { key: "place", text: "تقع الكعبة المشرفة التي نستقبلها في صلاتنا في ...", choices: ["مكة المكرمة", "المدينة المنورة", "الطائف"], correct: 0 },
] as const;

const championKey = Object.fromEntries(CHAMPION_LEVELS.map((l) => [l.key, l.correct]));
const dhuhrKey = Object.fromEntries(DHUHR_QUESTIONS.map((q) => [q.key, q.correct]));
const timesMatchKey = Object.fromEntries(PRAYER_TIMES.map((p) => [p.key, p.key]));
const nineKey = Object.fromEntries(NINE_BLANKS.map((b) => [String(b.slot), b.answer]));
const correctRowsKey = Object.fromEntries(CORRECT_ROWS.map((c) => [c.key, c.correct]));
const detectiveKey = Object.fromEntries(DETECTIVE_CASES.map((c) => [c.key, 0]));
const kaabaKey = Object.fromEntries(KAABA_ITEMS.map((i) => [i.id, i.correct ? "1" : "0"]));
const iqamaKey = Object.fromEntries(
  IQAMA_ROWS.map((r) => {
    const p = PRAYER_TIMES.find((x) => x.key === r.key)!;
    return [r.key, `${p.start}|||${p.end}`];
  }),
);

export const ACTIVITIES: Record<string, ActivityDef> = {
  intro_predict: {
    slideKey: "intro",
    title: "التوقع: متى تصح الصلاة؟",
    kind: "brainstorm",
    required: true,
    maxScore: 1,
    grade: participationGrade,
  },
  intro_brainstorm: {
    slideKey: "intro",
    title: "العصف الذهني (كتابي/صوتي)",
    kind: "open",
    required: false,
    maxScore: 1,
    grade: participationGrade,
  },
  discover_flip: {
    slideKey: "discover",
    title: "اكتشاف البطاقات الثلاث",
    kind: "explore",
    required: false,
    maxScore: 1,
    grade: participationGrade,
  },
  discover_match: {
    slideKey: "discover",
    title: "مطابقة الشرط الجديد بمعناه",
    kind: "match",
    required: true,
    maxScore: 3,
    grade: (a) => mapGrade(a, Object.fromEntries(NEW_CONDITIONS.map((c) => [c.key, c.key]))),
  },
  times_match: {
    slideKey: "times",
    title: "مطابقة الصلاة بوقتها",
    kind: "match",
    required: true,
    maxScore: 5,
    grade: (a) => mapGrade(a, timesMatchKey),
  },
  dhuhr_quiz: {
    slideKey: "dhuhr",
    title: "شاهد وفكر وأجب – الظهر والعصر",
    kind: "mcq",
    required: true,
    maxScore: 3,
    grade: (a) => multiChoiceGrade(a, dhuhrKey),
  },
  iqama_fill: {
    slideKey: "dhuhr",
    title: "أحدد أوقات الصلوات في المواعيد الثابتة",
    kind: "dragdrop",
    required: true,
    maxScore: 5,
    grade: (a) => mapGrade(a, iqamaKey),
  },
  detective_case_1: {
    slideKey: "detective",
    title: "القضية الأولى",
    kind: "case",
    required: true,
    maxScore: 1,
    grade: (a) => {
      const r = multiChoiceGrade(a, { where: DETECTIVE_CASES[0].whereCorrect, fix: DETECTIVE_CASES[0].fixCorrect });
      return { ...r, score: r.isCorrect ? 1 : 0, maxScore: 1 };
    },
  },
  detective_case_2: {
    slideKey: "detective",
    title: "القضية الثانية",
    kind: "case",
    required: true,
    maxScore: 1,
    grade: (a) => {
      const r = multiChoiceGrade(a, { where: DETECTIVE_CASES[1].whereCorrect, fix: DETECTIVE_CASES[1].fixCorrect });
      return { ...r, score: r.isCorrect ? 1 : 0, maxScore: 1 };
    },
  },
  detective_case_3: {
    slideKey: "detective",
    title: "القضية الثالثة",
    kind: "case",
    required: true,
    maxScore: 1,
    grade: (a) => {
      const r = multiChoiceGrade(a, { where: DETECTIVE_CASES[2].whereCorrect, fix: DETECTIVE_CASES[2].fixCorrect });
      return { ...r, score: r.isCorrect ? 1 : 0, maxScore: 1 };
    },
  },
  qibla_items: {
    slideKey: "qibla",
    title: "أعلم على كل عبارة لها ارتباط بالكعبة",
    kind: "sort",
    required: true,
    maxScore: 3,
    grade: (a) => boolGrade(a, Object.fromEntries(KAABA_ITEMS.map((i) => [i.id, i.correct]))),
  },
  qibla_rules: {
    slideKey: "qibla",
    title: "أين تقع الكعبة التي نستقبلها؟",
    kind: "mcq",
    required: true,
    maxScore: 1,
    grade: (a) => choiceGrade(a, 0),
  },
  niyyah_hadith_order: {
    slideKey: "niyyah",
    title: "ترتيب كلمات الحديث",
    kind: "order",
    required: true,
    maxScore: 1,
    grade: (a) => orderGrade(a, HADITH_NIYYAH.words),
  },
  niyyah_infer: {
    slideKey: "niyyah",
    title: "أستنتج من الحديث شرطًا من شروط الصلاة",
    kind: "mcq",
    required: true,
    maxScore: 1,
    grade: (a) => choiceGrade(a, 0),
  },
  nine_conditions: {
    slideKey: "classify",
    title: "أكمل الخانات الفارغة في الشروط التسعة",
    kind: "dragdrop",
    required: true,
    maxScore: 4,
    grade: (a) => mapGrade(a, nineKey),
  },
  correct_rows: {
    slideKey: "book",
    title: "أصحح الخطأ في المواعيد",
    kind: "mcq",
    required: true,
    maxScore: 2,
    grade: (a) => multiChoiceGrade(a, correctRowsKey),
  },
  kaaba_check: {
    slideKey: "book",
    title: "أعلم على العبارات المرتبطة بالكعبة",
    kind: "sort",
    required: true,
    maxScore: 3,
    grade: (a) => mapGrade(a, kaabaKey),
  },
  champion_game: {
    slideKey: "champion",
    title: "لعبة بطل شروط الصلاة",
    kind: "game",
    required: true,
    maxScore: 6,
    grade: (a) => multiChoiceGrade(a, championKey),
  },
};

/** الأنشطة الإلزامية الافتراضية */
export const REQUIRED_ACTIVITY_KEYS = Object.entries(ACTIVITIES)
  .filter(([, a]) => a.required)
  .map(([k]) => k);

export const ACHIEVEMENT_DEFS: Record<string, { title: string; icon: string }> = {
  starter: { title: "بداية موفقة", icon: "🚀" },
  discoverer: { title: "المكتشف الصغير", icon: "🔎" },
  detective: { title: "المحقق الذكي", icon: "🕵️" },
  reciter: { title: "حافظ الحديث", icon: "📖" },
  quiz_passed: { title: "اجتاز التقويم", icon: "🎯" },
  champion: { title: "بطل شروط الصلاة", icon: "🏆" },
};

export const SKILLS = [
  "دخول الوقت",
  "أوقات الصلوات",
  "استقبال القبلة",
  "النية",
  "الشروط التسعة",
];

export const BRAINSTORM_CHIPS = [
  "أن أعرف وقت الصلاة",
  "أن أستقبل القبلة",
  "أن أنوي الصلاة في قلبي",
  "مشاهدة التلفاز",
  "تناول الحلوى",
  "أن أكون مسلمًا",
];

/** بطاقات التصنيف للسبورة الذكية */
export const IQAMA_CARDS = IQAMA_ROWS.map((r) => ({ id: r.key, label: r.name, zone: r.key }));

export const NIYYAH_CARDS = [
  { id: "n1", label: "أنوي في قلبي صلاة الفجر", zone: "niyyah" },
  { id: "n2", label: "أستقبل الكعبة المشرفة", zone: "qibla" },
  { id: "n3", label: "أصلي بعد طلوع الشمس", zone: "time" },
] as const;
