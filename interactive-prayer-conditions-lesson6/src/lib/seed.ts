import { db } from "@/db";
import { ensureSchema } from "@/db/bootstrap";
import { teachers, classrooms, lessons, lessonSlides, activities, questions, teacherSettings, audioRecordings, lessonMedia } from "@/db/schema";
import { eq, and, sql } from "drizzle-orm";
import { hashPassword } from "./auth";
import { LESSON, SLIDES, ACTIVITIES, EVIDENCE, PRAYER_TIMES } from "./content";

export const DEFAULT_TEACHER_USERNAME = process.env.TEACHER_USERNAME ?? "teacher";
export const DEFAULT_TEACHER_PASSWORD = process.env.TEACHER_PASSWORD ?? "";

type SeedQuestion = { key: string; slideKey: "book" | "quiz"; kind: string; prompt: string; options: Record<string, unknown>; answer: Record<string, unknown>; explanation: string; skill: string; points: number };
const mcq = (key: string, slideKey: "book" | "quiz", prompt: string, choices: string[], index: number, explanation: string, skill: string, points = 1): SeedQuestion => ({ key, slideKey, kind: "mcq", prompt, options: { choices }, answer: { index }, explanation, skill, points });
const tf = (key: string, prompt: string, value: boolean, explanation: string, skill: string): SeedQuestion => ({ key, slideKey: "quiz", kind: "truefalse", prompt, options: {}, answer: { value }, explanation, skill, points: 1 });

export const SEED_QUESTIONS: SeedQuestion[] = [
  // نشاط الكتاب: أسئلة كتابية محولة إلى اختيارات
  mcq("book_isha_timetable", "book", "أحدد بداية صلاة العشاء في منطقتي من خلال التقويم المحلي في عمود:", ["العشاء", "الشروق", "الظهر"], 0, "نقرأ وقت العشاء من تقويم الصلاة الخاص بالمنطقة.", "أوقات الصلوات"),
  { key: "book_qibla", slideKey: "book", kind: "multi", prompt: "أضع علامة أمام كل عبارة لها ارتباط بصورة الكعبة المشرفة:", options: { choices: ["تقع في مكة المكرمة", "قبلة المسلمين", "تقع في المدينة المنورة"] }, answer: { indices: [0, 1] }, explanation: "الكعبة المشرفة تقع في مكة المكرمة وهي قبلة المسلمين.", skill: "استقبال القبلة", points: 2 },
  mcq("book_niyyah", "book", `أستنتج من حديث ${EVIDENCE.hadith.text} شرطًا من شروط الصلاة:`, ["النية", "دخول الوقت", "إزالة النجاسة"], 0, EVIDENCE.hadith.conclusion, "النية"),
  mcq("book_niyyah_place", "book", "لا تنطق بالنية، النية محلها:", ["القلب", "اللسان", "اليد"], 0, "النية محلها القلب ولا تُنطق.", "النية"),
  { key: "book_conditions", slideKey: "book", kind: "multi", prompt: "أكمل شروط الصلاة التسعة: الإسلام، التمييز، ستر العورة، دخول الوقت، النية، والأربعة المتبقية هي:", options: { choices: ["العقل", "الطهارة", "إزالة النجاسة", "استقبال القبلة", "السفر", "النوم"] }, answer: { indices: [0, 1, 2, 3] }, explanation: "الشروط التسعة: الإسلام، العقل، التمييز، الطهارة، إزالة النجاسة، ستر العورة، دخول الوقت، استقبال القبلة، النية.", skill: "شروط الصلاة التسعة", points: 4 },
  ...PRAYER_TIMES.map((t) => mcq(`book_time_${t.key}`, "book", `وقت صلاة ${t.name} هو:`, [`من ${t.start} إلى ${t.end}`, "من طلوع الشمس إلى الظهر", "من نصف الليل إلى الفجر"], 0, `وقت ${t.name}: من ${t.start} إلى ${t.end}.`, "أوقات الصلوات")),
  // التقويم الختامي: موضوعي بالكامل
  mcq("quiz_ayah", "quiz", `قال الله تعالى: ${EVIDENCE.ayah.text}. يتضح من الآية شرط:`, ["دخول الوقت", "ستر العورة", "الطهارة"], 0, EVIDENCE.ayah.conclusion, "دخول الوقت"),
  mcq("quiz_seventh", "quiz", "الشرط السابع من شروط الصلاة هو:", ["دخول الوقت", "النية", "استقبال القبلة"], 0, "الشرط السابع: دخول الوقت.", "شروط الصلاة التسعة"),
  mcq("quiz_fajr_start", "quiz", "يبدأ وقت الفجر بـ:", ["طلوع الفجر الثاني", "طلوع الشمس", "غروب الشمس"], 0, "وقت الفجر من طلوع الفجر الثاني إلى طلوع الشمس.", "أوقات الصلوات"),
  mcq("quiz_fajr_end", "quiz", "ينتهي وقت الفجر بـ:", ["طلوع الشمس", "نصف الليل", "اصفرار الشمس"], 0, "ينتهي وقت الفجر بطلوع الشمس.", "أوقات الصلوات"),
  mcq("quiz_dhuhr_start", "quiz", "يبدأ وقت الظهر بـ:", ["زوال الشمس", "طلوع الفجر", "غروب الشمس"], 0, "يبدأ وقت الظهر بزوال الشمس.", "أوقات الصلوات"),
  mcq("quiz_dhuhr_end", "quiz", "ينتهي وقت الظهر عندما:", ["يصير ظل كل شيء مثله", "تغرب الشمس", "يطلع الفجر"], 0, "ينتهي وقت الظهر أن يصير ظل كل شيء مثله.", "أوقات الصلوات"),
  mcq("quiz_asr_end", "quiz", "ينتهي وقت العصر المذكور في الدرس بـ:", ["اصفرار الشمس", "طلوع الفجر الثاني", "نصف الليل"], 0, "وقت العصر من خروج وقت الظهر إلى اصفرار الشمس.", "أوقات الصلوات"),
  mcq("quiz_maghrib_start", "quiz", "يبدأ وقت المغرب بـ:", ["غروب الشمس", "مغيب الشفق الأحمر", "طلوع الشمس"], 0, "وقت المغرب من غروب الشمس إلى مغيب الشفق الأحمر.", "أوقات الصلوات"),
  mcq("quiz_maghrib_end", "quiz", "ينتهي وقت المغرب بـ:", ["مغيب الشفق الأحمر", "نصف الليل", "زوال الشمس"], 0, "ينتهي وقت المغرب بمغيب الشفق الأحمر.", "أوقات الصلوات"),
  mcq("quiz_isha_start", "quiz", "يبدأ وقت العشاء بـ:", ["مغيب الشفق الأحمر", "غروب الشمس مباشرة", "نصف الليل"], 0, "يبدأ وقت العشاء بمغيب الشفق الأحمر.", "أوقات الصلوات"),
  mcq("quiz_isha_end", "quiz", "ينتهي وقت العشاء في الدرس عند:", ["نصف الليل", "الساعة الثانية عشرة دائمًا", "طلوع الشمس"], 0, "وقت العشاء من مغيب الشفق الأحمر إلى نصف الليل.", "أوقات الصلوات"),
  tf("quiz_midnight", "نصف الليل هو الساعة الثانية عشرة ليلًا دائمًا.", false, "نصف الليل يحسب من غروب الشمس إلى طلوع الفجر الثاني، وليس الساعة الثانية عشرة ليلًا.", "أوقات الصلوات"),
  mcq("quiz_qibla_location", "quiz", "تقع الكعبة المشرفة في:", ["مكة المكرمة", "المدينة المنورة", "الطائف"], 0, "الكعبة المشرفة تقع في مكة المكرمة وهي قبلة المسلمين.", "استقبال القبلة"),
  tf("quiz_qibla_rule", "لا تصح الصلاة دون استقبال القبلة.", true, "استقبال القبلة هو الشرط الثامن من شروط الصلاة.", "استقبال القبلة"),
  mcq("quiz_niyyah_hadith", "quiz", `حديث ${EVIDENCE.hadith.text} يدل على شرط:`, ["النية", "العقل", "التمييز"], 0, EVIDENCE.hadith.conclusion, "النية"),
  mcq("quiz_niyyah_place", "quiz", "محل النية هو:", ["القلب", "اللسان", "اليد"], 0, "لا تنطق بالنية، النية محلها القلب.", "النية"),
  { key: "quiz_fix_qibla", slideKey: "quiz", kind: "situation", prompt: "صلى سعد عكس القبلة. ما التصحيح؟", options: { choices: ["يتجه إلى القبلة ويعيد الصلاة", "يكمل صلاته عكس القبلة", "يرفع صوته بالقراءة"] }, answer: { index: 0 }, explanation: "لا تصح الصلاة دون استقبال القبلة؛ فيتجه إليها ويعيد الصلاة.", skill: "استقبال القبلة", points: 2 },
  { key: "quiz_fix_maghrib", slideKey: "quiz", kind: "situation", prompt: "صلى محمد المغرب قبل غروب الشمس. ما التصحيح؟", options: { choices: ["ينتظر غروب الشمس ثم يصلي المغرب", "يصليها قبل الغروب دائمًا", "يؤخرها إلى الفجر"] }, answer: { index: 0 }, explanation: "لا تصح الصلاة قبل دخول وقتها؛ ووقت المغرب يبدأ بغروب الشمس.", skill: "دخول الوقت", points: 2 },
  { key: "quiz_missing_condition", slideKey: "quiz", kind: "situation", prompt: "إذا صليتُ بدون تحقيق أحد شروط الصلاة التسعة، فهل صلاتي صحيحة؟", options: { choices: ["لا تصح الصلاة", "تصح دائمًا", "تصح إذا كنت سريعًا"] }, answer: { index: 0 }, explanation: "لا تصح الصلاة إلا بالشروط التسعة.", skill: "شروط الصلاة التسعة", points: 2 },
  mcq("quiz_sunset_image", "quiz", "صورة تظهر غروب الشمس والشفق الأحمر. ما الوقت والصلاة؟", ["وقت المغرب وصلاة المغرب", "وقت الفجر وصلاة الفجر", "وقت الظهر وصلاة الظهر"], 0, "غروب الشمس علامة دخول وقت المغرب.", "أوقات الصلوات"),
  mcq("quiz_conditions_count", "quiz", "عدد شروط الصلاة التي لا تصح إلا بها:", ["تسعة", "ستة", "خمسة"], 0, "شروط الصلاة تسعة.", "شروط الصلاة التسعة"),
];

let seedPromise: Promise<number> | null = null;
export function ensureSeeded(): Promise<number> {
  if (!seedPromise) seedPromise = runSeed().catch((err) => { seedPromise = null; throw err; });
  return seedPromise;
}

async function runSeed(): Promise<number> {
  await ensureSchema();
  let [teacher] = await db.select().from(teachers).limit(1);
  if (!teacher) {
    if (!DEFAULT_TEACHER_PASSWORD) throw new Error("TEACHER_PASSWORD is required to initialize the first teacher account");
    [teacher] = await db.insert(teachers).values({ username: DEFAULT_TEACHER_USERNAME, passwordHash: hashPassword(DEFAULT_TEACHER_PASSWORD), name: LESSON.teacher, school: LESSON.school }).onConflictDoNothing().returning();
    if (!teacher) [teacher] = await db.select().from(teachers).limit(1);
  }
  const [{ count: classCount }] = await db.select({ count: sql<number>`count(*)::int` }).from(classrooms).where(eq(classrooms.teacherId, teacher.id));
  if (Number(classCount) === 0) await db.insert(classrooms).values([{ teacherId: teacher.id, name: "الثالث (أ)" }, { teacherId: teacher.id, name: "الثالث (ب)" }]).onConflictDoNothing();

  let [lesson] = await db.select().from(lessons).where(eq(lessons.slug, LESSON.slug)).limit(1);
  if (!lesson) {
    [lesson] = await db.insert(lessons).values({ slug: LESSON.slug, title: LESSON.title, subject: LESSON.subject, grade: LESSON.grade, lessonNumber: LESSON.lessonNumber, pages: LESSON.pages }).onConflictDoNothing().returning();
    if (!lesson) [lesson] = await db.select().from(lessons).where(eq(lessons.slug, LESSON.slug)).limit(1);
  }
  await db.insert(lessonSlides).values(SLIDES.map((s, i) => ({ lessonId: lesson.id, key: s.key, orderIndex: i, title: s.title, subtitle: s.subtitle, strategy: s.strategy, isRequired: true, config: { emoji: s.emoji } }))).onConflictDoNothing();
  const slideRows = await db.select().from(lessonSlides).where(eq(lessonSlides.lessonId, lesson.id));
  const slideIdByKey = new Map(slideRows.map((s) => [s.key, s.id]));
  const activityValues = Object.entries(ACTIVITIES).map(([key, a], i) => { const slideId = slideIdByKey.get(a.slideKey); return slideId ? { slideId, key, title: a.title, kind: a.kind, isRequired: a.required, maxScore: a.maxScore, orderIndex: i, config: {} } : null; }).filter((v): v is NonNullable<typeof v> => v !== null);
  if (activityValues.length) await db.insert(activities).values(activityValues).onConflictDoNothing();
  await db.insert(questions).values(SEED_QUESTIONS.map((q, i) => ({ lessonId: lesson.id, slideKey: q.slideKey, key: q.key, kind: q.kind, prompt: q.prompt, options: q.options, answer: q.answer, explanation: q.explanation, skill: q.skill, points: q.points, orderIndex: i, active: true }))).onConflictDoNothing();
  const existingSettings = await db.select({ id: teacherSettings.id }).from(teacherSettings).where(and(eq(teacherSettings.teacherId, teacher.id), eq(teacherSettings.lessonId, lesson.id))).limit(1);
  if (!existingSettings.length) await db.insert(teacherSettings).values({ teacherId: teacher.id, lessonId: lesson.id, passPercent: 80, maxAttempts: 2 }).onConflictDoNothing();
  const legacyClips = await db.select().from(audioRecordings).where(and(eq(audioRecordings.lessonId, lesson.id), eq(audioRecordings.kind, "teacher")));
  for (const clip of legacyClips) await db.insert(lessonMedia).values({ lessonId: lesson.id, teacherId: teacher.id, kind: "audio", slideKey: SLIDES.some((s) => s.key === clip.slideKey) ? clip.slideKey : "intro", title: clip.title || "شرح المعلم", source: "uploaded", mimeType: clip.mimeType, dataBase64: clip.dataBase64, sizeBytes: Buffer.byteLength(clip.dataBase64, "base64"), active: true, legacyAudioId: clip.id, createdAt: clip.createdAt }).onConflictDoNothing({ target: lessonMedia.legacyAudioId });
  return lesson.id;
}
