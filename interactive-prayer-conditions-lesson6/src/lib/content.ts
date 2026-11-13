/** المحتوى العلمي لدرس «شروط الصلاة (2)» — الدرس الثامن، ص 66–70 وفق الصور المرفقة. */
export const LESSON = {
  slug: "shurut-alsalah-2",
  title: "شروط الصلاة (2)",
  subject: "الدراسات الإسلامية – الفقه",
  grade: "الصف الثالث الابتدائي",
  lessonNumber: 8,
  pages: "66–70",
  school: "العروس الابتدائية",
  teacher: "علي عبدالله راجحي",
};

export const EVIDENCE = {
  ayah: {
    text: "﴿إِنَّ الصَّلَاةَ كَانَتْ عَلَى الْمُؤْمِنِينَ كِتَابًا مَّوْقُوتًا﴾",
    source: "سورة النساء، الآية (103)",
    conclusion: "يتضح من الآية أن دخول الوقت شرط من شروط الصلاة؛ فلا تصح الصلاة إلا به.",
  },
  hadith: {
    text: "«إِنَّمَا الْأَعْمَالُ بِالنِّيَّاتِ»",
    intro: "قال النبي ﷺ:",
    source: "أخرجه البخاري (1)، ومسلم (1907)",
    conclusion: "النية شرط من شروط الصلاة.",
  },
};

export const CONDITIONS = [
  { key: "islam", order: 1, name: "الإسلام", icon: "🕌", text: "فلا تصح الصلاة بدونه.", color: "from-teal-400 to-teal-600" },
  { key: "aql", order: 2, name: "العقل", icon: "🧠", text: "فلا تجب الصلاة على المجنون.", color: "from-indigo-400 to-indigo-600" },
  { key: "tamyeez", order: 3, name: "التمييز", icon: "🧒", text: "يؤمر الصغير بالصلاة إذا بلغ سبع سنين.", color: "from-sky-400 to-sky-600" },
  { key: "tahara", order: 4, name: "الطهارة", icon: "💧", text: "من أحدث فلا تقبل صلاته حتى يتوضأ.", color: "from-cyan-400 to-cyan-600" },
  { key: "najasa", order: 5, name: "إزالة النجاسة", icon: "🧼", text: "تجب إزالة النجاسة عن البدن والملابس ومكان الصلاة.", color: "from-emerald-400 to-emerald-600" },
  { key: "awrah", order: 6, name: "ستر العورة", icon: "👕", text: "ستر العورة شرط للرجل والمرأة في الصلاة.", color: "from-orange-400 to-orange-600" },
  { key: "time", order: 7, name: "دخول الوقت", icon: "⏰", text: "لا تصح الصلاة إلا بعد دخول وقتها.", color: "from-amber-400 to-orange-600" },
  { key: "qibla", order: 8, name: "استقبال القبلة", icon: "🕋", text: "لا تصح الصلاة دون استقبال القبلة.", color: "from-teal-500 to-emerald-700" },
  { key: "niyyah", order: 9, name: "النية", icon: "💚", text: "لا تنطق بالنية، النية محلها القلب.", color: "from-rose-400 to-pink-600" },
] as const;
export type ConditionKey = (typeof CONDITIONS)[number]["key"];

export type PrayerTime = { key: string; name: string; start: string; end: string; note?: string; scene: "dawn" | "sun" | "shadow" | "sunset" | "night"; icon: string };
export const PRAYER_TIMES: PrayerTime[] = [
  { key: "fajr", name: "الفجر", start: "طلوع الفجر الثاني", end: "طلوع الشمس", scene: "dawn", icon: "🌅" },
  { key: "dhuhr", name: "الظهر", start: "زوال الشمس", end: "أن يصير ظل كل شيء مثله", note: "زوال الشمس: ميل الشمس عن وسط السماء من جهة المشرق إلى المغرب.", scene: "shadow", icon: "☀️" },
  { key: "asr", name: "العصر", start: "خروج وقت الظهر", end: "اصفرار الشمس", scene: "sun", icon: "🌤️" },
  { key: "maghrib", name: "المغرب", start: "غروب الشمس", end: "مغيب الشفق الأحمر", note: "الشفق الأحمر: الضوء الأحمر الذي يظهر في جهة الغرب بعد غروب الشمس.", scene: "sunset", icon: "🌇" },
  { key: "isha", name: "العشاء", start: "مغيب الشفق الأحمر", end: "نصف الليل", note: "نصف الليل يحسب من غروب الشمس إلى طلوع الفجر الثاني، وليس الساعة الثانية عشرة ليلًا.", scene: "night", icon: "🌙" },
];

export const QIBLA_STATEMENTS = [
  { key: "makkah", text: "تقع في مكة المكرمة", correct: true },
  { key: "qibla", text: "قبلة المسلمين", correct: true },
  { key: "madinah", text: "تقع في المدينة المنورة", correct: false },
];

export const SLIDES = [
  { key: "intro", title: "الصلاة كتاب موقوت", subtitle: "التهيئة بالآية الكريمة", strategy: "الاستنتاج من الآية", emoji: "📖" },
  { key: "times", title: "اكتشف أوقات الصلوات", subtitle: "بطاقات بصرية للصلوات الخمس", strategy: "التعلم بالاكتشاف", emoji: "🔎" },
  { key: "fajr", title: "وقت الفجر", subtitle: "من الفجر الثاني إلى طلوع الشمس", strategy: "التعلم البصري", emoji: "🌅" },
  { key: "day", title: "الظهر والعصر", subtitle: "الظل وزوال الشمس واصفرارها", strategy: "الملاحظة والاستنتاج", emoji: "☀️" },
  { key: "night", title: "المغرب والعشاء", subtitle: "الشفق الأحمر ونصف الليل", strategy: "التعلم بالمشاهد", emoji: "🌙" },
  { key: "timetable", title: "تقويم منطقتي", subtitle: "أقرأ بداية العشاء ونهايته", strategy: "التعلم بالحياة اليومية", emoji: "🗓️" },
  { key: "qibla", title: "استقبال القبلة", subtitle: "الشرط الثامن", strategy: "التعلم البصري والتصحيح", emoji: "🕋" },
  { key: "intention", title: "النية", subtitle: "الشرط التاسع", strategy: "الاستنتاج من الحديث", emoji: "💚" },
  { key: "classify", title: "شروط الصلاة التسعة", subtitle: "أكمل وصنف", strategy: "التعلم التعاوني والتصنيف", emoji: "🧩" },
  { key: "book", title: "أنشطة الكتاب المدرسي", subtitle: "ص 68–69 بصيغة اختيارات", strategy: "التدريب والممارسة", emoji: "📘" },
  { key: "quiz", title: "التقويم الختامي", subtitle: "أسئلة موضوعية مصححة آليًا", strategy: "التقويم التفاعلي", emoji: "📝" },
  { key: "champion", title: "بطل شروط الصلاة", subtitle: "التحدي النهائي والشهادة", strategy: "التعلم باللعب", emoji: "🏆" },
] as const;
export type SlideKey = (typeof SLIDES)[number]["key"];

export type ActivityResult = { isCorrect: boolean | null; score: number; maxScore: number; needsReview: boolean; detail?: Record<string, boolean> };
export type ActivityDef = { slideKey: SlideKey; title: string; kind: string; required: boolean; maxScore: number; grade: (answer: unknown) => ActivityResult };
export type LessonChoice = { key: string; prompt: string; choices: readonly string[]; correct: number; explanation: string; emoji?: string };

const rec = (v: unknown): Record<string, unknown> => v && typeof v === "object" && !Array.isArray(v) ? v as Record<string, unknown> : {};
function groupGrade(questions: readonly LessonChoice[]) {
  return (answer: unknown): ActivityResult => {
    const a = rec(answer); const detail: Record<string, boolean> = {}; let score = 0;
    for (const q of questions) { const ok = Number(a[q.key]) === q.correct; detail[q.key] = ok; if (ok) score++; }
    return { isCorrect: score === questions.length, score, maxScore: questions.length, needsReview: false, detail };
  };
}

export const STATION_QUESTIONS: Record<string, readonly LessonChoice[]> = {
  intro: [
    { key: "ayah", prompt: `قال الله تعالى: ${EVIDENCE.ayah.text}. على أي شرط تدل الآية؟`, choices: ["دخول الوقت", "ستر العورة", "إزالة النجاسة"], correct: 0, explanation: EVIDENCE.ayah.conclusion, emoji: "📖" },
    { key: "before", prompt: "هل تصح الصلاة قبل دخول وقتها؟", choices: ["لا تصح حتى يدخل الوقت", "تصح في أي وقت", "تصح إذا كان الجو صحوًا"], correct: 0, explanation: "دخول الوقت هو الشرط السابع من شروط الصلاة.", emoji: "⏰" },
  ],
  times: [
    { key: "count", prompt: "كم عدد الصلوات المفروضة في اليوم والليلة؟", choices: ["خمس صلوات", "ثلاث صلوات", "سبع صلوات"], correct: 0, explanation: "الصلوات المفروضة خمس: الفجر والظهر والعصر والمغرب والعشاء.", emoji: "🕌" },
    { key: "order", prompt: "أي صلاة يأتي وقتها بعد غروب الشمس مباشرة؟", choices: ["المغرب", "العشاء", "الفجر"], correct: 0, explanation: "يبدأ وقت المغرب بغروب الشمس.", emoji: "🌇" },
    { key: "last", prompt: "آخر وقت العشاء المذكور في الدرس هو:", choices: ["نصف الليل", "طلوع الشمس", "زوال الشمس"], correct: 0, explanation: "وقت العشاء من مغيب الشفق الأحمر إلى نصف الليل.", emoji: "🌙" },
  ],
  fajr: [
    { key: "start", prompt: "يبدأ وقت الفجر بـ:", choices: ["طلوع الفجر الثاني", "طلوع الشمس", "غروب الشمس"], correct: 0, explanation: "وقت الفجر من طلوع الفجر الثاني إلى طلوع الشمس.", emoji: "🌅" },
    { key: "end", prompt: "ينتهي وقت الفجر بـ:", choices: ["طلوع الشمس", "نصف الليل", "اصفرار الشمس"], correct: 0, explanation: "ينتهي وقت الفجر بطلوع الشمس.", emoji: "☀️" },
  ],
  day: [
    { key: "dhuhr_start", prompt: "يبدأ وقت الظهر بـ:", choices: ["زوال الشمس", "طلوع الفجر", "غروب الشمس"], correct: 0, explanation: "يبدأ وقت الظهر بزوال الشمس.", emoji: "☀️" },
    { key: "dhuhr_end", prompt: "ينتهي وقت الظهر عندما:", choices: ["يصير ظل كل شيء مثله", "تغرب الشمس", "يطلع الفجر"], correct: 0, explanation: "ينتهي وقت الظهر أن يصير ظل كل شيء مثله، وعنده يخرج وقت الظهر ويدخل وقت العصر.", emoji: "📏" },
    { key: "asr_end", prompt: "ينتهي وقت العصر المذكور في الدرس بـ:", choices: ["اصفرار الشمس", "طلوع الفجر الثاني", "نصف الليل"], correct: 0, explanation: "وقت العصر من خروج وقت الظهر إلى اصفرار الشمس.", emoji: "🌤️" },
  ],
  night: [
    { key: "maghrib_end", prompt: "ينتهي وقت المغرب بـ:", choices: ["مغيب الشفق الأحمر", "طلوع الشمس", "زوال الشمس"], correct: 0, explanation: "وقت المغرب من غروب الشمس إلى مغيب الشفق الأحمر.", emoji: "🌇" },
    { key: "isha_start", prompt: "يبدأ وقت العشاء بـ:", choices: ["مغيب الشفق الأحمر", "غروب الشمس مباشرة", "نصف الليل"], correct: 0, explanation: "يبدأ وقت العشاء بمغيب الشفق الأحمر.", emoji: "🌙" },
    { key: "midnight", prompt: "كيف يحسب نصف الليل في الدرس؟", choices: ["من غروب الشمس إلى طلوع الفجر الثاني ثم يؤخذ نصفه", "هو الساعة الثانية عشرة دائمًا", "من الظهر إلى العصر"], correct: 0, explanation: "ليس نصف الليل الساعة الثانية عشرة ليلًا؛ بل يحسب من غروب الشمس إلى طلوع الفجر الثاني.", emoji: "🕛" },
  ],
  timetable: [
    { key: "source", prompt: "أحدد وقت صلاة العشاء في منطقتي من:", choices: ["تقويم الصلاة المحلي الموثوق", "لون السماء فقط", "الساعة الثانية عشرة دائمًا"], correct: 0, explanation: "نقرأ وقت العشاء من تقويم الصلاة الخاص بالمنطقة.", emoji: "🗓️" },
    { key: "column", prompt: "في تقويم الصلاة، أقرأ بداية العشاء من عمود:", choices: ["العشاء", "الشروق", "الظهر"], correct: 0, explanation: "عمود العشاء يعرض وقت بداية صلاة العشاء في المنطقة.", emoji: "🕌" },
    { key: "end", prompt: "ينتهي وقت العشاء في الدرس عند:", choices: ["نصف الليل المحسوب من الغروب إلى الفجر الثاني", "الساعة الثانية عشرة دائمًا", "طلوع الشمس"], correct: 0, explanation: "نصف الليل يحسب من غروب الشمس إلى طلوع الفجر الثاني.", emoji: "🌙" },
  ],
  qibla: [
    { key: "location", prompt: "أين تقع الكعبة المشرفة؟", choices: ["مكة المكرمة", "المدينة المنورة", "الرياض"], correct: 0, explanation: "الكعبة المشرفة تقع في مكة المكرمة وهي قبلة المسلمين.", emoji: "🕋" },
    { key: "rule", prompt: "لا تصح الصلاة دون:", choices: ["استقبال القبلة", "رفع الصوت بالقراءة", "الصلاة في حديقة"], correct: 0, explanation: "استقبال القبلة هو الشرط الثامن.", emoji: "🧭" },
    { key: "fix", prompt: "صلى سعد عكس القبلة. ما التصحيح؟", choices: ["يتجه إلى القبلة ويعيد الصلاة", "يكمل عكس القبلة", "يرفع صوته"], correct: 0, explanation: "لا تصح الصلاة دون استقبال القبلة؛ فيتجه إليها ويعيد الصلاة.", emoji: "🧭" },
  ],
  intention: [
    { key: "hadith", prompt: `حديث ${EVIDENCE.hadith.text} يدل على شرط:`, choices: ["النية", "دخول الوقت", "إزالة النجاسة"], correct: 0, explanation: EVIDENCE.hadith.conclusion, emoji: "📜" },
    { key: "place", prompt: "محل النية هو:", choices: ["القلب", "اللسان", "اليد"], correct: 0, explanation: "لا تنطق بالنية، النية محلها القلب.", emoji: "💚" },
    { key: "say", prompt: "هل أنطق بالنية قبل الصلاة؟", choices: ["لا أنطق بها ومحلها القلب", "أرفع بها صوتي", "أكتبها على ورقة"], correct: 0, explanation: "لا تنطق بالنية، النية محلها القلب.", emoji: "🤲" },
  ],
  classify: [
    { key: "seventh", prompt: "الشرط السابع من شروط الصلاة هو:", choices: ["دخول الوقت", "النية", "الطهارة"], correct: 0, explanation: "الشرط السابع: دخول الوقت.", emoji: "⏰" },
    { key: "eighth", prompt: "الشرط الثامن من شروط الصلاة هو:", choices: ["استقبال القبلة", "التمييز", "العقل"], correct: 0, explanation: "الشرط الثامن: استقبال القبلة.", emoji: "🕋" },
    { key: "ninth", prompt: "الشرط التاسع من شروط الصلاة هو:", choices: ["النية", "ستر العورة", "الإسلام"], correct: 0, explanation: "الشرط التاسع: النية.", emoji: "💚" },
    { key: "count", prompt: "عدد شروط الصلاة التي لا تصح إلا بها في الدرس:", choices: ["تسعة", "ستة", "خمسة"], correct: 0, explanation: "شروط الصلاة تسعة.", emoji: "🧩" },
  ],
};

function activity(slideKey: SlideKey, title: string, required = true): ActivityDef {
  const questions = STATION_QUESTIONS[slideKey] ?? [];
  return { slideKey, title, kind: "choices", required, maxScore: questions.length, grade: groupGrade(questions) };
}
export const ACTIVITIES: Record<string, ActivityDef> = {
  intro_predict: activity("intro", "الاستنتاج من الآية"),
  times_discover: activity("times", "اكتشاف أوقات الصلوات"),
  fajr_cases: activity("fajr", "وقت الفجر"),
  day_cases: activity("day", "الظهر والعصر"),
  night_cases: activity("night", "المغرب والعشاء"),
  timetable_read: activity("timetable", "قراءة تقويم الصلاة"),
  qibla_check: activity("qibla", "استقبال القبلة"),
  intention_cases: activity("intention", "النية ومحلها"),
  conditions_classify: activity("classify", "الشروط التسعة"),
  champion_game: {
    slideKey: "champion", title: "بطل شروط الصلاة", kind: "game", required: true, maxScore: 9,
    grade: (answer) => {
      const a = rec(answer); const detail: Record<string, boolean> = {}; let score = 0;
      for (const level of CHAMPION_LEVELS) { const ok = Number(a[level.key]) === level.correct; detail[level.key] = ok; if (ok) score++; }
      return { isCorrect: score === CHAMPION_LEVELS.length, score, maxScore: CHAMPION_LEVELS.length, needsReview: false, detail };
    },
  },
};
export const REQUIRED_ACTIVITY_KEYS = Object.entries(ACTIVITIES).filter(([, a]) => a.required).map(([key]) => key);
export const SKILLS = ["دخول الوقت", "أوقات الصلوات", "استقبال القبلة", "النية", "شروط الصلاة التسعة"];
export const ACHIEVEMENT_DEFS: Record<string, { title: string; icon: string }> = {
  starter: { title: "بداية موفقة", icon: "🚀" },
  time_keeper: { title: "حافظ الوقت", icon: "⏰" },
  qibla_guide: { title: "دليل القبلة", icon: "🕋" },
  intention: { title: "نية صادقة", icon: "💚" },
  quiz_passed: { title: "اجتاز التقويم", icon: "🎯" },
  champion: { title: "بطل شروط الصلاة", icon: "🏆" },
};
export const CHAMPION_LEVELS = CONDITIONS.map((condition, index) => ({
  key: condition.key,
  text: [`الشرط الأول: لا تصح الصلاة بدونه`, `الشرط الثاني: لا تجب الصلاة على المجنون`, `الشرط الثالث: يؤمر الصغير بالصلاة عند سبع سنين`, `الشرط الرابع: من أحدث يتوضأ قبل الصلاة`, `الشرط الخامس: إزالة النجاسة عن البدن والملابس ومكان الصلاة`, `الشرط السادس: ستر العورة للرجل والمرأة`, `الشرط السابع: لا تصح الصلاة قبل دخوله`, `الشرط الثامن: التوجه إلى الكعبة المشرفة`, `الشرط التاسع: محله القلب ولا يُنطق به`][index],
  choices: [condition.name, CONDITIONS[(index + 3) % CONDITIONS.length].name, CONDITIONS[(index + 6) % CONDITIONS.length].name],
  correct: 0,
}));
/** بنك موحد للمسابقة المباشرة: كل أنشطة الدرس قابلة للاختيار. */
export const LIVE_QUESTION_BANK = Object.entries(STATION_QUESTIONS).flatMap(([station, questions]) => questions.map((q) => ({ ...q, id: `${station}-${q.key}`, source: SLIDES.find((s) => s.key === station)?.title ?? station })));
export const CLASSIFY_CARDS = LIVE_QUESTION_BANK.map((q) => ({ id: q.id, label: q.prompt, zone: q.correct }));
