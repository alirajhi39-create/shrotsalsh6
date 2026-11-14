"use client";

import { useState } from "react";
import { ALL_CONDITIONS, CHAMPION_LEVELS, SKILLS, type ActivityResult } from "@/lib/content";
import type { AttemptView } from "@/lib/student";
import type { StationProps } from "./StationsA";
import { QuestionRenderer, type Reveal } from "./QuestionRenderer";
import { Btn, Card, Feedback, ScoreBadge, StationShell, cx } from "./ui";

const rec = (v: unknown): Record<string, unknown> =>
  v && typeof v === "object" && !Array.isArray(v) ? (v as Record<string, unknown>) : {};

/* ------------------------------- المحطة 9 ------------------------------- */

export function StationClassify({ ctx, title, subtitle }: StationProps) {
  return (
    <StationShell
      emoji="🗂️"
      title={title}
      subtitle={subtitle}
      strategy="التصنيف والتعلم التعاوني"
      onSpeak={() => ctx.speak("للصلاة شروط تسعة لا تصح إلا بها. أكمل الخانات الفارغة بالشروط المناسبة")}
    >
      <Card className="bg-gradient-to-l from-indigo-50 to-white">
        <p className="text-lg font-semibold text-slate-700">
          للصلاة شروطٌ تسعة لا تصح إلا بها. أكمل الخانات الفارغة بالشروط المناسبة. يمكن للمعلم تشغيل هذا النشاط جماعيًا على السبورة
          الذكية من لوحة التحكم.
        </p>
      </Card>
      <Card>
        <p className="text-sm font-bold text-turq-700">هذا النشاط موجود في المحطة التاسعة أعلاه (أكمل الشروط التسعة) — وهو نشاط جماعي يمكن للمعلم تشغيله من تبويب «مسابقة مباشرة» أو «السبورة الذكية».</p>
      </Card>
    </StationShell>
  );
}

/* ------------------------------ المحطة 10 ------------------------------ */

export function StationBook({ ctx, title, subtitle }: StationProps) {
  const qs = ctx.state.questions.filter((q) => q.slideKey === "book");
  const [drafts, setDrafts] = useState<Record<number, unknown>>({});
  const [explanations, setExplanations] = useState<Record<number, string>>({});

  const submit = async (id: number) => {
    const r = await ctx.saveQuestion(id, drafts[id] ?? {});
    if (r) {
      setExplanations((e) => ({ ...e, [id]: r.explanation }));
      if (r.result.needsReview) ctx.sounds.click();
      else if (r.result.isCorrect) ctx.sounds.success();
      else ctx.sounds.error();
    }
  };

  const answeredCount = qs.filter((q) => ctx.state.answers[`q_${q.id}`]).length;

  return (
    <StationShell emoji="📘" title={title} subtitle={subtitle} strategy="التدريب والممارسة" onSpeak={() => ctx.speak("حل أنشطة الكتاب المدرسي، وستصحح الأسئلة الموضوعية تلقائيًا")}>
      <Card className="bg-gradient-to-l from-sky-50 to-white">
        <p className="text-lg font-semibold text-slate-700">
          أنشطة الكتاب محوّلة إلى تدريبات إلكترونية تُصحَّح فورًا. الأسئلة الكتابية يصححها المعلم.
        </p>
        <p className="mt-2 text-sm font-bold text-turq-700">أنجزت {answeredCount} من {qs.length}</p>
      </Card>
      {qs.map((q, i) => {
        const saved = ctx.state.answers[`q_${q.id}`];
        const reveal: Reveal | null = saved
          ? {
              isCorrect: saved.needsReview ? (saved.teacherScore === null ? null : saved.teacherScore >= saved.maxScore) : saved.isCorrect,
              score: saved.teacherScore ?? saved.score,
              maxScore: saved.maxScore,
              explanation: explanations[q.id] ?? saved.explanation ?? "",
              needsReview: saved.needsReview && saved.teacherScore === null,
            }
          : null;
        const value = saved ? saved.answer : drafts[q.id];
        const draft = rec(drafts[q.id]);
        const ready =
          q.kind === "essay"
            ? typeof draft.text === "string" && draft.text.trim().length >= 3
            : q.kind === "multi"
              ? Array.isArray(draft.indices) && draft.indices.length > 0
              : q.kind === "order"
                ? Array.isArray(draft.order) && draft.order.length === (Array.isArray(q.options.words) ? q.options.words.length : 0)
                : q.kind === "dragdrop"
                  ? Object.keys(rec(draft.map)).length > 0
                  : Object.keys(draft).length > 0;
        return (
          <div key={q.id} className="space-y-2">
            <QuestionRenderer question={q} index={i + 1} value={value} onChange={(v) => setDrafts({ ...drafts, [q.id]: v })} reveal={reveal} disabled={!!saved} />
            {saved?.teacherFeedback && (
              <Feedback kind="info">
                ملاحظة المعلم: {saved.teacherFeedback}
                {saved.teacherScore !== null && (
                  <span className="ms-2 rounded-full bg-white px-2 py-0.5 text-sm">الدرجة: {saved.teacherScore}/{saved.maxScore}</span>
                )}
              </Feedback>
            )}
            {!saved && (
              <div className="flex justify-end">
                <Btn onClick={() => submit(q.id)} disabled={!ready || ctx.busy}>حفظ الإجابة 💾</Btn>
              </div>
            )}
          </div>
        );
      })}
    </StationShell>
  );
}

/* ------------------------------ المحطة 11 ------------------------------ */

function SkillReport({ report, passPercent }: { report: Record<string, { earned: number; max: number }>; passPercent: number }) {
  const entries = SKILLS.filter((s) => report[s]).map((s) => ({ skill: s, ...report[s] }));
  Object.keys(report).forEach((s) => {
    if (!SKILLS.includes(s)) entries.push({ skill: s, ...report[s] });
  });
  if (!entries.length) return null;
  const weak = entries.filter((e) => e.max && (e.earned / e.max) * 100 < Math.min(passPercent, 70));
  return (
    <div className="space-y-3">
      <h4 className="text-lg font-black text-turq-900">📊 تقرير المهارات</h4>
      {entries.map((e) => {
        const pct = e.max ? Math.round((e.earned / e.max) * 100) : 0;
        return (
          <div key={e.skill}>
            <div className="mb-1 flex justify-between text-sm font-bold">
              <span>{e.skill}</span>
              <span>{pct}%</span>
            </div>
            <div className="h-3 overflow-hidden rounded-full bg-slate-100">
              <div className={cx("h-full rounded-full transition-all", pct >= 70 ? "bg-brand-green" : pct >= 50 ? "bg-brand-orange" : "bg-rose-500")} style={{ width: `${pct}%` }} />
            </div>
          </div>
        );
      })}
      {weak.length > 0 && (
        <Feedback kind="info">
          مهارات تحتاج إلى مراجعة: <b>{weak.map((w) => w.skill).join("، ")}</b>. عد إلى المحطات المرتبطة بها ثم أعد المحاولة.
        </Feedback>
      )}
    </div>
  );
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
    if (a) {
      setSubmitted(a);
      setMode("result");
      if (a.percent >= pass) ctx.celebrate();
      else ctx.sounds.error();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  if (mode === "result" && shown) {
    const passed = shown.percent >= pass;
    return (
      <StationShell emoji="📝" title={title} subtitle={subtitle} strategy="التقويم التفاعلي">
        <Card className={cx("text-center", passed ? "bg-gradient-to-br from-emerald-50 to-white" : "bg-gradient-to-br from-orange-50 to-white")}>
          <div className="text-6xl">{passed ? "🏅" : "💪"}</div>
          <h3 className="mt-2 text-3xl font-black text-turq-900">{Math.round(shown.percent)}%</h3>
          <p className="mt-1 text-lg font-bold text-slate-700">
            المحاولة {shown.attemptNumber} من {ctx.state.attemptsAllowed} — {passed ? `اجتزت التقويم (نسبة النجاح ${pass}%)` : `لم تصل إلى نسبة النجاح ${pass}% بعد`}
          </p>
          <p className="mt-1 text-sm text-slate-500">
            الدرجة الآلية: {shown.autoScore} / {shown.maxAutoScore}
            {shown.maxTeacherScore > 0 && ` — الأسئلة الكتابية: ${shown.pendingReview ? "بانتظار تصحيح المعلم" : `${shown.teacherScore} / ${shown.maxTeacherScore}`}`}
          </p>
          {shown.pendingReview && <Feedback kind="pending">الأسئلة الكتابية لا تُحتسب في النسبة حتى يصححها المعلم، وستُحدَّث نتيجتك بعد التصحيح.</Feedback>}
          <div className="mt-4 flex flex-wrap justify-center gap-3">
            {canRetry ? (
              <Btn
                variant="warning"
                onClick={() => { setAnswers({}); setSubmitted(null); setMode("form"); }}
              >
                🔁 محاولة جديدة ({ctx.state.attemptsAllowed - attempts.length} متبقية)
              </Btn>
            ) : (
              <span className="rounded-2xl bg-slate-100 px-4 py-2 text-sm font-bold text-slate-600">استنفدت المحاولات؛ لإعادة المحاولة اطلب إذن معلمك.</span>
            )}
            {passed && <Btn variant="success" onClick={ctx.goNext}>إلى التحدي النهائي 🏆</Btn>}
          </div>
        </Card>
        <Card><SkillReport report={shown.skillReport} passPercent={pass} /></Card>
        <h4 className="text-lg font-black text-turq-900">مراجعة الإجابات</h4>
        {qs.map((q, i) => {
          const d = shown.details.find((x) => x.questionId === q.id);
          return (
            <QuestionRenderer
              key={q.id}
              question={q}
              index={i + 1}
              value={shown.answers[String(q.id)]}
              onChange={() => {}}
              disabled
              reveal={d ? { isCorrect: d.isCorrect, score: d.score, maxScore: d.maxScore, explanation: d.explanation, needsReview: d.needsReview } : null}
            />
          );
        })}
        {attempts.length > 1 && (
          <Card>
            <h4 className="mb-2 font-black text-turq-900">سجل المحاولات</h4>
            <ul className="space-y-1 text-sm">
              {attempts.map((a) => (
                <li key={a.id} className="flex justify-between rounded-xl bg-slate-50 px-3 py-2">
                  <span>المحاولة {a.attemptNumber}</span>
                  <span className="font-bold">{Math.round(a.percent)}%</span>
                  <span className="text-slate-500">{new Date(a.submittedAt).toLocaleString("ar-SA")}</span>
                </li>
              ))}
            </ul>
          </Card>
        )}
      </StationShell>
    );
  }

  return (
    <StationShell
      emoji="📝"
      title={title}
      subtitle={subtitle}
      strategy="التقويم التفاعلي"
      onSpeak={() => ctx.speak("اقرأ كل سؤال بتمعن ثم أجب، وعند الانتهاء اضغط إرسال الاختبار")}
    >
      <Card className="bg-gradient-to-l from-sky-50 to-white">
        <p className="text-lg font-semibold text-slate-700">
          الاختبار يحتوي على {qs.length} سؤالًا متنوعًا. نسبة النجاح {pass}%. المحاولة {attempts.length + 1} من {ctx.state.attemptsAllowed}.
        </p>
      </Card>
      {qs.map((q, i) => (
        <QuestionRenderer key={q.id} question={q} index={i + 1} value={answers[String(q.id)]} onChange={(v) => setAnswers({ ...answers, [String(q.id)]: v })} />
      ))}
      <Card className="sticky bottom-24 flex flex-wrap items-center justify-between gap-3 border-2 border-turq-200">
        <span className="font-bold text-slate-700">أجبت عن {qs.length - unanswered} من {qs.length}</span>
        <Btn size="lg" variant="success" onClick={submit} disabled={ctx.busy || qs.length === 0}>إرسال الاختبار 🚀</Btn>
      </Card>
    </StationShell>
  );
}

/* ------------------------------ المحطة 12 ------------------------------ */

export function StationChampion({ ctx, title, subtitle }: StationProps) {
  const saved = ctx.state.answers.champion_game;
  const [level, setLevel] = useState(0);
  const [first, setFirst] = useState<Record<string, number>>(() => (saved ? (saved.answer as Record<string, number>) : {}));
  const [solved, setSolved] = useState<Set<string>>(() => new Set(saved ? CHAMPION_LEVELS.map((l) => l.key) : []));
  const [pick, setPick] = useState<number | null>(null);
  const [wrong, setWrong] = useState(false);
  const [timeLeft, setTimeLeft] = useState(20);
  const [issuing, setIssuing] = useState(false);
  const [reasons, setReasons] = useState<string[] | null>(null);
  const finished = solved.size === CHAMPION_LEVELS.length;
  const current = CHAMPION_LEVELS[level];

  const choose = async (i: number) => {
    if (!current || solved.has(current.key)) return;
    setPick(i);
    const nextFirst = first[current.key] === undefined ? { ...first, [current.key]: i } : first;
    setFirst(nextFirst);
    if (i === current.correct) {
      ctx.sounds.success();
      const nextSolved = new Set(solved).add(current.key);
      setSolved(nextSolved);
      setWrong(false);
      setTimeout(() => {
        setPick(null);
        if (level < CHAMPION_LEVELS.length - 1) setLevel(level + 1);
      }, 900);
      if (nextSolved.size === CHAMPION_LEVELS.length) {
        const r = await ctx.saveAnswer("champion_game", nextFirst);
        if (r) ctx.celebrate();
      }
    } else {
      ctx.sounds.error();
      setWrong(true);
    }
  };

  const getCertificate = async () => {
    setIssuing(true);
    const c = await ctx.issueCertificate();
    setIssuing(false);
    if (c) { ctx.celebrate(); setReasons(null); } else setReasons(ctx.state.eligibility.reasons);
  };

  const cert = ctx.state.certificate;
  const eligibility = ctx.state.eligibility;
  const firstCorrect = CHAMPION_LEVELS.filter((l) => first[l.key] === l.correct).length;

  return (
    <StationShell
      emoji="🏆"
      title={title}
      subtitle={subtitle}
      strategy="التعلم باللعب"
      onSpeak={() => ctx.speak("لعبة بطل شروط الصلاة: اجتز ستة تحديات عن الشروط التسعة وأوقات الصلوات")}
    >
      <Card className="bg-gradient-to-l from-amber-50 via-white to-turq-50">
        <div className="flex flex-wrap items-center gap-4">
          <div className="text-6xl">{finished ? "🏆" : "🎮"}</div>
          <div className="flex-1">
            <h3 className="text-2xl font-black text-turq-900">لعبة «بطل شروط الصلاة»</h3>
            <p className="text-lg text-slate-700">اجتز ستة تحديات عن الشروط التسعة وأوقات الصلوات الخمس!</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {CHAMPION_LEVELS.map((c) => (
                <span key={c.key} className={cx("rounded-full border-2 px-3 py-1 text-sm font-bold transition-all", solved.has(c.key) ? "border-emerald-400 bg-emerald-50 text-emerald-800" : "border-slate-200 bg-white text-slate-400")}>
                  تحدٍ {CHAMPION_LEVELS.indexOf(c) + 1} {solved.has(c.key) && "✓"}
                </span>
              ))}
            </div>
          </div>
        </div>
      </Card>

      {!finished && current && (
        <Card className="border-4 border-amber-300">
          <div className="mb-3 flex items-center justify-between">
            <span className="rounded-full bg-amber-100 px-4 py-1 font-black text-amber-800">التحدي {level + 1} / {CHAMPION_LEVELS.length}</span>
            <span className={cx("rounded-full px-4 py-1 font-black", timeLeft <= 5 ? "animate-pulse bg-rose-100 text-rose-700" : "bg-slate-100 text-slate-700")}>⏱️ {timeLeft} ث</span>
          </div>
          <div className="mb-3 h-2 overflow-hidden rounded-full bg-slate-100">
            <div className="h-full bg-amber-400 transition-all" style={{ width: `${(timeLeft / 20) * 100}%` }} />
          </div>
          <p className="mb-4 text-2xl font-black text-turq-900">{current.text}</p>
          <div className="grid gap-3 sm:grid-cols-3">
            {current.choices.map((c, i) => (
              <button
                key={i}
                type="button"
                disabled={pick !== null}
                onClick={() => choose(i)}
                className={cx(
                  "touch-target rounded-2xl border-2 p-4 text-lg font-black transition-all",
                  pick === i ? "border-turq-600 bg-turq-50" : "border-slate-200 bg-white hover:border-turq-400",
                  pick !== null && wrong && pick === i && "animate-wiggle border-rose-400 bg-rose-50",
                )}
              >
                {c}
              </button>
            ))}
          </div>
          {wrong && (
            <div className="mt-3 flex flex-wrap items-center gap-3">
              <Feedback kind="wrong">ليست الإجابة الصحيحة. فكر مرة أخرى!</Feedback>
              <Btn variant="warning" onClick={() => { setWrong(false); setPick(null); }}>🔁 أعد المحاولة</Btn>
            </div>
          )}
        </Card>
      )}

      {finished && (
        <Card className="text-center">
          <div className="text-6xl">🎉</div>
          <h3 className="mt-2 text-2xl font-black text-turq-900">أنت بطل شروط الصلاة!</h3>
          <p className="text-lg text-slate-700">أجبت عن {firstCorrect} من {CHAMPION_LEVELS.length} تحديات من المحاولة الأولى.</p>
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            {ctx.state.achievements.map((a) => (
              <span key={a.key} className="animate-pop rounded-2xl bg-gradient-to-l from-amber-300 to-orange-400 px-4 py-2 font-black text-white shadow">
                {a.icon} {a.title}
              </span>
            ))}
          </div>
          <div className="mt-6">
            {cert ? (
              <div className="space-y-3">
                <Feedback kind="correct">تم إصدار شهادتك الرقمية بنسبة {Math.round(cert.percent)}% — الرقم: <b>{cert.serial}</b></Feedback>
                <a href={`/certificate/${cert.serial}`} className="inline-block rounded-2xl bg-gradient-to-l from-turq-500 to-brand-blue px-8 py-4 text-xl font-black text-white shadow-xl">
                  🎓 عرض الشهادة وطباعتها / حفظها PDF
                </a>
              </div>
            ) : eligibility.eligible ? (
              <Btn size="lg" variant="success" onClick={getCertificate} disabled={issuing || ctx.busy}>
                {issuing ? "جارٍ الإصدار…" : "🎓 استلام شهادتي الآن"}
              </Btn>
            ) : (
              <div className="space-y-2 text-start">
                <Feedback kind="info">لإصدار الشهادة يلزم إكمال الأنشطة الإلزامية وتحقيق {ctx.state.settings.passPercent}% على الأقل في التقويم:</Feedback>
                <ul className="list-disc space-y-1 pe-6 text-slate-700">
                  {(reasons ?? eligibility.reasons).map((r) => <li key={r}>{r}</li>)}
                </ul>
              </div>
            )}
          </div>
        </Card>
      )}
    </StationShell>
  );
}
