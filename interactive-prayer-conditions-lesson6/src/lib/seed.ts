import { db } from "@/db";
import { ensureSchema } from "@/db/bootstrap";
import {
  teachers,
  classrooms,
  lessons,
  lessonSlides,
  activities,
  questions,
  teacherSettings,
} from "@/db/schema";
import { eq, and, sql } from "drizzle-orm";
import { hashPassword } from "./auth";
import { LESSON, SLIDES, ACTIVITIES } from "./content";

export const DEFAULT_TEACHER_USERNAME = process.env.TEACHER_USERNAME ?? "teacher";
export const DEFAULT_TEACHER_PASSWORD = process.env.TEACHER_PASSWORD ?? "139613";

type SeedQuestion = {
  key: string;
  slideKey: "book" | "quiz";
  kind: string;
  prompt: string;
  options: Record<string, unknown>;
  answer: Record<string, unknown>;
  explanation: string;
  skill: string;
  points: number;
};

const PRAYER_TIMES_TXT: Record<string, string> = {
  fajr: "من طلوع الفجر الثاني إلى طلوع الشمس",
  dhuhr: "من زوال الشمس إلى أن يصبح ظل كل شيء مثله",
  asr: "من خروج وقت الظهر إلى اصفرار الشمس",
  maghrib: "من غروب الشمس إلى مغيب الشفق الأحمر",
  isha: "من مغيب الشفق الأحمر إلى نصف الليل",
};

export const SEED_QUESTIONS: SeedQuestion[] = [
  /* ---------- نشاط الكتاب المدرسي ---------- */
  {
    key: "book_correct_rows",
    slideKey: "book",
    kind: "multi",
    prompt: "أصلح الخطأ في المواعيد الآتية: صلى سعد صلاة الفجر عكس القبلة، وصلى محمد المغرب قبل غروب الشمس. أختر التصحيح الصحيح لكل منهما:",
    options: {
      choices: [
        "صلى سعد صلاة الفجر مستقبلًا القبلة",
        "صلى محمد صلاة المغرب بعد غروب الشمس",
        "صلى سعد صلاة الفجر عكس القبلة",
        "صلى محمد صلاة المغرب قبل غروب الشمس",
      ],
    },
    answer: { indices: [0, 1] },
    explanation:
      "استقبال القبلة شرط من شروط الصلاة، ودخول الوقت شرط؛ فصلاة الفجر تُصلى مستقبلًا القبلة قبل طلوع الشمس، وصلاة المغرب تُصلى بعد غروب الشمس.",
    skill: "دخول الوقت",
    points: 2,
  },
  {
    key: "book_kaaba",
    slideKey: "book",
    kind: "multi",
    prompt: "أعلم بعلامة (✓) أمام كل عبارة لها ارتباط بصورة الكعبة المشرفة (اختر كل ما ينطبق):",
    options: {
      choices: [
        "تقع في مكة المكرمة.",
        "نستقبلها عند أداء الصلاة.",
        "تقع في المدينة المنورة.",
        "نستقبلها في صلاة الفجر فقط.",
      ],
    },
    answer: { indices: [0, 1] },
    explanation: "الكعبة المشرفة تقع في مكة المكرمة، ونستقبلها عند أداء الصلاة جميعًا.",
    skill: "استقبال القبلة",
    points: 2,
  },
  {
    key: "book_nine_count",
    slideKey: "book",
    kind: "fill",
    prompt: "للصلاة شروطٌ لا تصح إلا بها، وعددها:",
    options: { choices: ["تسعة شروط", "ستة شروط", "ثلاثة شروط"] },
    answer: { index: 0 },
    explanation: "شروط الصلاة تسعة: الإسلام، الطهارة، التمييز، إزالة النجاسة، ستر العورة، العقل، دخول الوقت، استقبال القبلة، النية.",
    skill: "الشروط التسعة",
    points: 1,
  },
  {
    key: "book_nine_missing",
    slideKey: "book",
    kind: "multi",
    prompt: "أكمل الشروط التسعة: الإسلام، الطهارة، التمييز، ستر العورة، دخول الوقت، النية. ما الشروط الناقصة؟",
    options: {
      choices: ["إزالة النجاسة", "استقبال القبلة", "مشاهدة التلفاز", "تناول الحلوى"],
    },
    answer: { indices: [0, 1] },
    explanation: "شروط الصلاة التسعة تشمل إزالة النجاسة واستقبال القبلة.",
    skill: "الشروط التسعة",
    points: 2,
  },
  {
    key: "book_image_time",
    slideKey: "book",
    kind: "mcq",
    prompt: "ما الوقت الذي تدل عليه الصورة (مغيب الشفق الأحمر)؟",
    options: { choices: ["وقت صلاة المغرب", "وقت صلاة الفجر", "وقت صلاة الظهر"] },
    answer: { index: 0 },
    explanation: "وقت صلاة المغرب من غروب الشمس إلى مغيب الشفق الأحمر.",
    skill: "أوقات الصلوات",
    points: 1,
  },
  {
    key: "book_image_prayer",
    slideKey: "book",
    kind: "mcq",
    prompt: "ما الصلاة التي تُؤدَّى في هذا الوقت (مغيب الشفق الأحمر)؟",
    options: { choices: ["صلاة المغرب", "صلاة الفجر", "صلاة العصر"] },
    answer: { index: 0 },
    explanation: "صلاة المغرب تُؤدَّى من غروب الشمس إلى مغيب الشفق الأحمر.",
    skill: "أوقات الصلوات",
    points: 1,
  },
  /* ---------- التقويم الختامي ---------- */
  {
    key: "quiz_seventh",
    slideKey: "quiz",
    kind: "mcq",
    prompt: "الشرط السابع من شروط الصلاة هو:",
    options: { choices: ["دخول الوقت", "النية", "الطهارة", "التمييز"] },
    answer: { index: 0 },
    explanation: "الشرط السابع: دخول الوقت.",
    skill: "دخول الوقت",
    points: 1,
  },
  {
    key: "quiz_fajr_time",
    slideKey: "quiz",
    kind: "mcq",
    prompt: "وقت صلاة الفجر من ... إلى ...",
    options: {
      choices: [
        "طلوع الفجر الثاني إلى طلوع الشمس",
        "زوال الشمس إلى اصفرارها",
        "غروب الشمس إلى مغيب الشفق",
      ],
    },
    answer: { index: 0 },
    explanation: "وقت صلاة الفجر من طلوع الفجر الثاني إلى طلوع الشمس.",
    skill: "أوقات الصلوات",
    points: 1,
  },
  {
    key: "quiz_asr_end",
    slideKey: "quiz",
    kind: "fill",
    prompt: "ينتهي وقت صلاة العصر عند ........",
    options: { choices: ["اصفرار الشمس", "طلوع الشمس", "نصف الليل"] },
    answer: { index: 0 },
    explanation: "وقت صلاة العصر من خروج وقت الظهر إلى اصفرار الشمس.",
    skill: "أوقات الصلوات",
    points: 1,
  },
  {
    key: "quiz_eighth",
    slideKey: "quiz",
    kind: "mcq",
    prompt: "الشرط الثامن من شروط الصلاة هو:",
    options: { choices: ["استقبال القبلة", "إزالة النجاسة", "ستر العورة", "العقل"] },
    answer: { index: 0 },
    explanation: "الشرط الثامن: استقبال القبلة.",
    skill: "استقبال القبلة",
    points: 1,
  },
  {
    key: "quiz_kaaba_place",
    slideKey: "quiz",
    kind: "mcq",
    prompt: "الكعبة المشرفة التي نستقبلها في صلاتنا تقع في:",
    options: { choices: ["مكة المكرمة", "المدينة المنورة", "القدس"] },
    answer: { index: 0 },
    explanation: "الكعبة المشرفة تقع في مكة المكرمة، ونستقبلها عند أداء الصلاة.",
    skill: "استقبال القبلة",
    points: 1,
  },
  {
    key: "quiz_ninth",
    slideKey: "quiz",
    kind: "mcq",
    prompt: "الشرط التاسع من شروط الصلاة هو:",
    options: { choices: ["النية", "دخول الوقت", "الإسلام", "الطهارة"] },
    answer: { index: 0 },
    explanation: "الشرط التاسع: النية.",
    skill: "النية",
    points: 1,
  },
  {
    key: "quiz_hadith_niyyah",
    slideKey: "quiz",
    kind: "mcq",
    prompt: "حديث رسول الله ﷺ: «إنما الأعمال بالنيات» يدل على شرط:",
    options: { choices: ["النية", "دخول الوقت", "استقبال القبلة", "الطهارة"] },
    answer: { index: 0 },
    explanation: "الحديث يدل على أن النية شرط من شروط الصلاة، ومكانها القلب.",
    skill: "النية",
    points: 1,
  },
  {
    key: "quiz_niyyah_place",
    slideKey: "quiz",
    kind: "fill",
    prompt: "أكمل: النية مكانها ........",
    options: { choices: ["القلب", "اللسان", "اليد"] },
    answer: { index: 0 },
    explanation: "النية مكانها القلب، فلا تُنطق باللسان.",
    skill: "النية",
    points: 1,
  },
  {
    key: "quiz_tf_time",
    slideKey: "quiz",
    kind: "truefalse",
    prompt: "تصح الصلاة في أي وقت يشاء المسلم.",
    options: {},
    answer: { value: false },
    explanation: "دخول الوقت شرط من شروط الصلاة، فلا تصح إلا في وقتها.",
    skill: "دخول الوقت",
    points: 1,
  },
  {
    key: "quiz_tf_qibla",
    slideKey: "quiz",
    kind: "truefalse",
    prompt: "لا نصلي الصلاة دون استقبال القبلة.",
    options: {},
    answer: { value: true },
    explanation: "استقبال القبلة شرط من شروط الصلاة.",
    skill: "استقبال القبلة",
    points: 1,
  },
  {
    key: "quiz_tf_dhuhr_end",
    slideKey: "quiz",
    kind: "truefalse",
    prompt: "ينتهي وقت صلاة العصر عند مغيب الشفق الأحمر.",
    options: {},
    answer: { value: false },
    explanation: "وقت صلاة العصر ينتهي عند اصفرار الشمس، ومغيب الشفق الأحمر هو وقت المغرب.",
    skill: "أوقات الصلوات",
    points: 1,
  },
  {
    key: "quiz_order_times",
    slideKey: "quiz",
    kind: "order",
    prompt: "أرتب الصلوات الخمس حسب تسلسل أوقاتها في اليوم (تقبل أكثر من ترتيب صحيح):",
    options: { words: ["الفجر", "الظهر", "العصر", "المغرب", "العشاء"] },
    answer: { order: ["الفجر", "الظهر", "العصر", "المغرب", "العشاء"] },
    explanation: "ترتيب الصلوات: الفجر ثم الظهر ثم العصر ثم المغرب ثم العشاء.",
    skill: "أوقات الصلوات",
    points: 2,
  },
  {
    key: "quiz_dragdrop_times",
    slideKey: "quiz",
    kind: "dragdrop",
    prompt: "أصل كل صلاة بوقتها:",
    options: {
      items: ["من طلوع الفجر الثاني", "من زوال الشمس", "من مغيب الشفق الأحمر"],
      zones: ["الفجر", "الظهر", "العشاء"],
    },
    answer: {
      map: {
        "من طلوع الفجر الثاني": "الفجر",
        "من زوال الشمس": "الظهر",
        "من مغيب الشفق الأحمر": "العشاء",
      },
    },
    explanation: "الفجر من طلوع الفجر الثاني، والظهر من زوال الشمس، والعشاء من مغيب الشفق الأحمر.",
    skill: "أوقات الصلوات",
    points: 3,
  },
  {
    key: "quiz_sit_after_sunrise",
    slideKey: "quiz",
    kind: "situation",
    prompt: "صلى سعد صلاة الفجر بعد طلوع الشمس. ماذا يحدث لصلاته؟",
    options: { choices: ["لا تصح لأنه خرج عن الوقت", "تصح لأنها صلاة", "تصح إذا أعادها"] },
    answer: { index: 0 },
    explanation: "دخول الوقت شرط؛ فمن خرج عن الوقت لم تصح صلاته.",
    skill: "دخول الوقت",
    points: 1,
  },
  {
    key: "quiz_sit_qibla",
    slideKey: "quiz",
    kind: "situation",
    prompt: "صلى محمد صلاة المغرب قبل غروب الشمس. ماذا يحدث لصلاته؟",
    options: { choices: ["لا تصح لأنه لم يأتِ وقتها", "تصح لأنه صلى", "تصح إذا أعادها"] },
    answer: { index: 0 },
    explanation: "دخول الوقت شرط؛ فصلاة المغرب لا تُصلى قبل غروب الشمس.",
    skill: "دخول الوقت",
    points: 1,
  },
];

let seedPromise: Promise<number> | null = null;

/** يضمن وجود بيانات الدرس الأساسية؛ آمن للتكرار ولا يمس تعديلات المعلم. يعيد معرف الدرس. */
export function ensureSeeded(): Promise<number> {
  if (!seedPromise) {
    seedPromise = runSeed().catch((err) => {
      seedPromise = null;
      throw err;
    });
  }
  return seedPromise;
}

async function runSeed(): Promise<number> {
  // شبكة أمان: إنشاء الجداول إن لم تكن موجودة (نشر جديد بدون تنفيذ الهجرات)
  await ensureSchema();

  // المعلم الافتراضي
  let [teacher] = await db.select().from(teachers).limit(1);
  if (!teacher) {
    [teacher] = await db
      .insert(teachers)
      .values({
        username: DEFAULT_TEACHER_USERNAME,
        passwordHash: hashPassword(DEFAULT_TEACHER_PASSWORD),
        name: LESSON.teacher,
        school: LESSON.school,
      })
      .onConflictDoNothing()
      .returning();
    if (!teacher) [teacher] = await db.select().from(teachers).limit(1);
  }

  // الفصول الافتراضية (فقط إذا لم يكن للمعلم أي فصل)
  const [{ count: classCount }] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(classrooms)
    .where(eq(classrooms.teacherId, teacher.id));
  if (Number(classCount) === 0) {
    await db
      .insert(classrooms)
      .values([
        { teacherId: teacher.id, name: "الثالث (أ)" },
        { teacherId: teacher.id, name: "الثالث (ب)" },
      ])
      .onConflictDoNothing();
  }

  // الدرس
  let [lesson] = await db.select().from(lessons).where(eq(lessons.slug, LESSON.slug)).limit(1);
  if (!lesson) {
    [lesson] = await db
      .insert(lessons)
      .values({
        slug: LESSON.slug,
        title: LESSON.title,
        subject: LESSON.subject,
        grade: LESSON.grade,
        lessonNumber: LESSON.lessonNumber,
        pages: LESSON.pages,
      })
      .onConflictDoNothing()
      .returning();
    if (!lesson) [lesson] = await db.select().from(lessons).where(eq(lessons.slug, LESSON.slug)).limit(1);
  }

  // الشرائح
  await db
    .insert(lessonSlides)
    .values(
      SLIDES.map((s, i) => ({
        lessonId: lesson.id,
        key: s.key,
        orderIndex: i,
        title: s.title,
        subtitle: s.subtitle,
        strategy: s.strategy,
        isRequired: true,
        config: { emoji: s.emoji },
      })),
    )
    .onConflictDoNothing();

  const slideRows = await db.select().from(lessonSlides).where(eq(lessonSlides.lessonId, lesson.id));
  const slideIdByKey = new Map(slideRows.map((s) => [s.key, s.id]));

  // الأنشطة
  const activityValues = Object.entries(ACTIVITIES)
    .map(([key, a], i) => {
      const slideId = slideIdByKey.get(a.slideKey);
      if (!slideId) return null;
      return {
        slideId,
        key,
        title: a.title,
        kind: a.kind,
        isRequired: a.required,
        maxScore: a.maxScore,
        orderIndex: i,
        config: {},
      };
    })
    .filter((v): v is NonNullable<typeof v> => v !== null);
  if (activityValues.length) {
    await db.insert(activities).values(activityValues).onConflictDoNothing();
  }

  // الأسئلة
  await db
    .insert(questions)
    .values(
      SEED_QUESTIONS.map((q, i) => ({
        lessonId: lesson.id,
        slideKey: q.slideKey,
        key: q.key,
        kind: q.kind,
        prompt: q.prompt,
        options: q.options,
        answer: q.answer,
        explanation: q.explanation,
        skill: q.skill,
        points: q.points,
        orderIndex: i,
        active: true,
      })),
    )
    .onConflictDoUpdate({
      target: [questions.lessonId, questions.key],
      // تحديث الإجابات المتوقعة فقط (لا يمس تعديلات المعلم في نص السؤال)
      set: { answer: sql`excluded.answer`, updatedAt: new Date() },
    });

  // إعدادات المعلم
  const existingSettings = await db
    .select({ id: teacherSettings.id })
    .from(teacherSettings)
    .where(and(eq(teacherSettings.teacherId, teacher.id), eq(teacherSettings.lessonId, lesson.id)))
    .limit(1);
  if (!existingSettings.length) {
    await db
      .insert(teacherSettings)
      .values({ teacherId: teacher.id, lessonId: lesson.id, passPercent: 80, maxAttempts: 2 })
      .onConflictDoNothing();
  }

  return lesson.id;
}
