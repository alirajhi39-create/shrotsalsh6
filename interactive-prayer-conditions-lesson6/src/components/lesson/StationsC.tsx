"use client";

import { useEffect, useState } from "react";
import SafeImage from "./SafeImage";
import Link from "next/link";
import { CHAMPION_LEVELS, CONDITIONS, LESSON, SKILLS } from "@/lib/content";
import type { AttemptView } from "@/lib/student";
import type { StationProps } from "./PrayerStations";
import { QuestionRenderer, type Reveal } from "./QuestionRenderer";
import { Btn, Card, Choices, Feedback, StationShell, cx } from "./ui";

const rec = (v: unknown): Record<string, unknown> => v && typeof v === "object" && !Array.isArray(v) ? v as Record<string, unknown> : {};

export function StationBook({ ctx, title, subtitle }: StationProps) {
  const qs = ctx.state.questions.filter((q) => q.slideKey === "book");
  const [drafts, setDrafts] = useState<Record<number, unknown>>({});
  const [explanations, setExplanations] = useState<Record<number, string>>({});
  const submit = async (id: number) => {
    const r = await ctx.saveQuestion(id, drafts[id] ?? {});
    if (r) { setExplanations((e) => ({ ...e, [id]: r.explanation })); r.result.isCorrect ? ctx.sounds.success() : ctx.sounds.error(); }
  };
  const answeredCount = qs.filter((q) => ctx.state.answers[`q_${q.id}`]).length;
  return <StationShell slideKey="book" emoji="📘" title={title} subtitle={subtitle} strategy="التدريب والممارسة" onSpeak={() => ctx.speak("حل أنشطة الكتاب المدرسي، وكلها اختيارات مصححة آليًا")}>
    <Card className="bg-gradient-to-l from-sky-50 to-white"><p className="text-lg font-semibold text-slate-700">أنشطة الكتاب (ص {LESSON.pages}) محوّلة إلى اختيارات تفاعلية. لا توجد أسئلة كتابية مطلوب كتابتها.</p><p className="mt-2 text-sm font-bold text-turq-700">أنجزت {answeredCount} من {qs.length}</p></Card>
    {qs.map((q, i) => {
      const saved = ctx.state.answers[`q_${q.id}`];
      const reveal: Reveal | null = saved ? { isCorrect: saved.isCorrect, score: saved.score, maxScore: saved.maxScore, explanation: explanations[q.id] ?? saved.explanation, needsReview: false } : null;
      const value = saved ? saved.answer : drafts[q.id];
      const draft = rec(drafts[q.id]);
      const ready = q.kind === "multi" ? Array.isArray(draft.indices) && draft.indices.length > 0 : q.kind === "dragdrop" ? Object.keys(rec(draft.map)).length === (Array.isArray(q.options.items) ? q.options.items.length : 0) : Object.keys(draft).length > 0;
      return <div key={q.id} className="space-y-2"><QuestionRenderer question={q} index={i + 1} value={value} onChange={(v) => setDrafts({ ...drafts, [q.id]: v })} reveal={reveal} disabled={!!saved} shuffleSeed={`${ctx.state.student.id}:${q.key}`} />{!saved && <div className="flex justify-end"><Btn onClick={() => submit(q.id)} disabled={!ready || ctx.busy}>حفظ الإجابة 💾</Btn></div>}</div>;
    })}
  </StationShell>;
}

function SkillReport({ report, passPercent }: { report: Record<string, { earned: number; max: number }>; passPercent: number }) {
  const entries = SKILLS.filter((s) => report[s]).map((s) => ({ skill: s, ...report[s] }));
  Object.keys(report).forEach((s) => { if (!SKILLS.includes(s)) entries.push({ skill: s, ...report[s] }); });
  if (!entries.length) return null;
  const weak = entries.filter((e) => e.max && (e.earned / e.max) * 100 < Math.min(passPercent, 70));
  return <div className="space-y-3"><h4 className="text-lg font-black text-turq-900">📊 تقرير المهارات</h4>{entries.map((e) => { const pct = e.max ? Math.round((e.earned / e.max) * 100) : 0; return <div key={e.skill}><div className="mb-1 flex justify-between text-sm font-bold"><span>{e.skill}</span><span>{pct}%</span></div><div className="h-3 overflow-hidden rounded-full bg-slate-100"><div className={cx("h-full rounded-full", pct >= 70 ? "bg-brand-green" : pct >= 50 ? "bg-brand-orange" : "bg-rose-500")} style={{ width: `${pct}%` }} /></div></div>; })}{weak.length > 0 && <Feedback kind="info">مهارات تحتاج إلى مراجعة: <b>{weak.map((w) => w.skill).join("، ")}</b>.</Feedback>}</div>;
}

export function StationQuiz({ ctx, title, subtitle }: StationProps) {
  const qs = ctx.state.questions.filter((q) => q.slideKey === "quiz");
  const attempts = ctx.state.attempts;
  const last = attempts[attempts.length - 1] ?? null;
  const [mode, setMode] = useState<"result" | "form">(last ? "result" : "form");
  const [answers, setAnswers] = useState<Record<string, unknown>>({});
  const [submitted, setSubmitted] = useState<AttemptView | null>(null);
  const shown = submitted ?? last;
  const canRetry = attempts.length < ctx.state.attemptsAllowed;
  const pass = ctx.state.settings.passPercent;
  const unanswered = qs.filter((q) => answers[String(q.id)] === undefined).length;
  const submit = async () => {
    if (unanswered > 0 && !confirm(`لديك ${unanswered} أسئلة بلا إجابة. هل تريد الإرسال على أي حال؟`)) return;
    const a = await ctx.submitQuiz(answers);
    if (a) { setSubmitted(a); setMode("result"); if (a.percent >= pass) ctx.celebrate(); else ctx.sounds.error(); window.scrollTo({ top: 0, behavior: "smooth" }); }
  };
  if (mode === "result" && shown) {
    const passed = shown.percent >= pass;
    return <StationShell slideKey="quiz" emoji="📝" title={title} subtitle={subtitle} strategy="التقويم التفاعلي">
      <Card className={cx("text-center", passed ? "bg-emerald-50" : "bg-orange-50")}><div className="text-6xl">{passed ? "🏅" : "💪"}</div><h3 className="mt-2 text-3xl font-black text-turq-900">{Math.round(shown.percent)}%</h3><p className="mt-1 text-lg font-bold">المحاولة {shown.attemptNumber} — {passed ? `اجتزت التقويم (${pass}% فأكثر)` : `تحتاج إلى ${pass}% للاجتياز`}</p><p className="text-sm text-slate-600">الدرجة: {shown.autoScore} / {shown.maxAutoScore}</p><div className="mt-4 flex flex-wrap justify-center gap-3">{canRetry && <Btn variant="warning" onClick={() => { setAnswers({}); setSubmitted(null); setMode("form"); }}>🔁 محاولة جديدة</Btn>}{passed && <Btn variant="success" onClick={ctx.goNext}>إلى التحدي النهائي 🏆</Btn>}</div></Card>
      <Card><SkillReport report={shown.skillReport} passPercent={pass}/></Card>
      <h4 className="text-lg font-black text-turq-900">مراجعة الإجابات</h4>
      {qs.map((q, i) => { const d = shown.details.find((x) => x.questionId === q.id); return <QuestionRenderer key={q.id} question={q} index={i + 1} value={shown.answers[String(q.id)]} onChange={() => {}} disabled reveal={d ? { isCorrect: d.isCorrect, score: d.score, maxScore: d.maxScore, explanation: d.explanation } : null} shuffleSeed={`${ctx.state.student.id}:${q.key}`} />; })}
    </StationShell>;
  }
  return <StationShell slideKey="quiz" emoji="📝" title={title} subtitle={subtitle} strategy="التقويم التفاعلي" onSpeak={() => ctx.speak("اقرأ كل سؤال واختر الإجابة الصحيحة")}>
    <Card className="bg-sky-50"><p className="text-lg font-semibold">التقويم الختامي لدرس {LESSON.title}: {qs.length} سؤالًا موضوعيًا. نسبة النجاح {pass}٪.</p></Card>
    {qs.map((q, i) => <QuestionRenderer key={q.id} question={q} index={i + 1} value={answers[String(q.id)]} onChange={(v) => setAnswers({ ...answers, [String(q.id)]: v })} shuffleSeed={`${ctx.state.student.id}:${q.key}`} />)}
    <Card className="sticky bottom-24 flex flex-wrap items-center justify-between gap-3 border-2 border-turq-200"><span className="font-bold">أجبت عن {qs.length - unanswered} من {qs.length}</span><Btn size="lg" variant="success" onClick={submit} disabled={ctx.busy || qs.length === 0}>إرسال الاختبار 🚀</Btn></Card>
  </StationShell>;
}

export function StationChampion({ ctx, title, subtitle }: StationProps) {
  const saved = ctx.state.answers.champion_game;
  const [level, setLevel] = useState(0);
  const [first, setFirst] = useState<Record<string, number>>(() => saved ? rec(saved.answer) as Record<string, number> : {});
  const [solved, setSolved] = useState<Set<string>>(() => new Set(saved ? CHAMPION_LEVELS.map((l) => l.key) : []));
  const [pick, setPick] = useState<number | null>(null);
  const [wrong, setWrong] = useState(false);
  const [timeLeft, setTimeLeft] = useState(20);
  const [issuing, setIssuing] = useState(false);
  const finished = solved.size === CHAMPION_LEVELS.length;
  const current = CHAMPION_LEVELS[level];
  useEffect(() => { if (finished || wrong) return; setTimeLeft(20); const t = setInterval(() => setTimeLeft((s) => s > 0 ? s - 1 : 0), 1000); return () => clearInterval(t); }, [level, finished, wrong]);
  const choose = async (i: number) => {
    if (!current || solved.has(current.key)) return;
    setPick(i);
    const nextFirst = first[current.key] === undefined ? { ...first, [current.key]: i } : first;
    setFirst(nextFirst);
    if (i === current.correct) { ctx.sounds.success(); const nextSolved = new Set(solved).add(current.key); setSolved(nextSolved); setWrong(false); setTimeout(() => { setPick(null); if (level < CHAMPION_LEVELS.length - 1) setLevel(level + 1); }, 800); if (nextSolved.size === CHAMPION_LEVELS.length) { const r = await ctx.saveAnswer("champion_game", nextFirst); if (r) ctx.celebrate(); } }
    else { ctx.sounds.error(); setWrong(true); }
  };
  const getCertificate = async () => { setIssuing(true); const c = await ctx.issueCertificate(); setIssuing(false); if (c) ctx.celebrate(); };
  const cert = ctx.state.certificate;
  const eligibility = ctx.state.eligibility;
  return <StationShell slideKey="champion" emoji="🏆" title={title} subtitle={subtitle} strategy="التعلم باللعب">
    <Card className="bg-amber-50"><div className="flex flex-wrap items-center gap-4"><SafeImage slot="champion_badge" src="/images/champion-badge.webp" alt="وسام البطل" className={cx("h-28 w-28", finished ? "animate-float" : "opacity-40 grayscale")} fallback="🏆"/><div><h3 className="text-2xl font-black text-turq-900">بطل شروط الصلاة التسعة</h3><p className="text-lg">اجتز {CHAMPION_LEVELS.length} تحديات، كل تحدٍّ يمثل شرطًا.</p><div className="mt-3 flex flex-wrap gap-2">{CONDITIONS.map((c) => <span key={c.key} className={cx("rounded-full border-2 px-3 py-1 text-sm font-bold", solved.has(c.key) ? "border-emerald-400 bg-emerald-50" : "border-slate-200 bg-white text-slate-400")}>{c.icon} {c.name}</span>)}</div></div></div></Card>
    {!finished && current && <Card className="border-4 border-amber-300"><div className="mb-3 flex justify-between"><span className="font-black">التحدي {level + 1} / {CHAMPION_LEVELS.length}</span><span className="font-black">⏱️ {timeLeft} ث</span></div><p className="mb-4 text-2xl font-black text-turq-900">{current.text}</p><Choices choices={current.choices} value={pick} onChange={choose} revealed={pick !== null} correct={wrong ? undefined : current.correct} disabled={pick !== null} columns={3} shuffleSeed={`${ctx.state.student.id}:champion:${current.key}`} />{wrong && <div className="mt-3"><Feedback kind="wrong">فكر مرة أخرى.</Feedback><Btn variant="warning" className="mt-2" onClick={() => { setWrong(false); setPick(null); }}>أعد المحاولة</Btn></div>}</Card>}
    {finished && <Card className="text-center"><div className="text-6xl">🎉</div><h3 className="mt-2 text-2xl font-black">أنت بطل شروط الصلاة!</h3><div className="mt-5">{cert ? <Link href={`/certificate/${cert.serial}`} className="inline-block rounded-2xl bg-turq-600 px-8 py-4 text-xl font-black text-white">🎓 عرض شهادتي</Link> : eligibility.eligible ? <Btn size="lg" variant="success" onClick={getCertificate} disabled={issuing || ctx.busy}>استلام شهادتي الآن</Btn> : <Feedback kind="info">لإصدار الشهادة: {eligibility.reasons.join("، ")}</Feedback>}</div></Card>}
  </StationShell>;
}
