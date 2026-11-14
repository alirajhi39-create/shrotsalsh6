"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import {
  AYAH,
  BRAINSTORM_CHIPS,
  DHUHR_QUESTIONS,
  DISCOVER_MEANINGS,
  IQAMA_ROWS,
  NEW_CONDITIONS,
  PRAYER_TIMES,
  type ActivityResult,
} from "@/lib/content";
import type { JourneyCtx } from "./Journey";
import {
  AudioRecorder,
  Btn,
  Card,
  Choices,
  Feedback,
  FlipCard,
  MatchPairs,
  ScoreBadge,
  StationShell,
  VideoPlayer,
  cx,
} from "./ui";

export type StationProps = { ctx: JourneyCtx; title: string; subtitle: string };

export function EvidenceCard({ intro, text, source, quran }: { intro: string; text: string; source?: string; quran?: boolean }) {
  return (
    <div className="rounded-3xl border-2 border-amber-200 bg-gradient-to-br from-amber-50 to-white p-5 shadow-inner">
      <p className="text-sm font-bold text-amber-800">{intro}</p>
      <p className={cx("my-2 text-2xl font-bold leading-loose text-turq-900", quran && "quran text-3xl text-emerald-900")}>{text}</p>
      {source && <p className="text-xs font-bold text-slate-500">{source}</p>}
    </div>
  );
}

/* ------------------------------- المحطة 1 ------------------------------- */

const INTRO_SCENES = [
  { emoji: "🌇", text: "أذَّن المغرب، وأراد سالم أن يصلي صلاة العشاء بعد مغيب الشفق الأحمر." },
  { emoji: "🕋", text: "صلى نورة صلاة المغرب مستقبلة الشرق." },
  { emoji: "💖", text: "صلى فهد صلاة العصر دون أن ينويها في قلبه." },
];

export function StationIntro({ ctx, title, subtitle }: StationProps) {
  const saved = ctx.state.answers.intro_predict;
  const savedOpen = ctx.state.answers.intro_brainstorm;
  const [chips, setChips] = useState<string[]>(() => {
    const c = (saved?.answer as { choices?: string[] })?.choices;
    return Array.isArray(c) ? c : [];
  });
  const [text, setText] = useState<string>(() => {
    const t = (savedOpen?.answer as { text?: string })?.text;
    return typeof t === "string" ? t : "";
  });
  const [sent, setSent] = useState(!!saved);
  const [openSent, setOpenSent] = useState(!!savedOpen);
  const question = "متى تصح الصلاة؟ وما الذي يجب أن أتأكد منه قبل أن أبدأ؟";

  const submit = async () => {
    const r = await ctx.saveAnswer("intro_predict", { choices: chips });
    if (r) { setSent(true); ctx.sounds.success(); }
  };
  const submitText = async () => {
    if (!text.trim()) return;
    const r = await ctx.saveAnswer("intro_brainstorm", { text: text.trim() });
    if (r) { setOpenSent(true); ctx.sounds.success(); }
  };

  return (
    <StationShell emoji="🤔" title={title} subtitle={subtitle} strategy="العصف الذهني وأسئلة التوقع" onSpeak={() => ctx.speak(`${title}. ${question}`)}>
      <Card className="overflow-hidden bg-gradient-to-l from-turq-50 to-white">
        <div className="grid items-center gap-6 md:grid-cols-[220px_1fr]">
          <div className="relative mx-auto h-56 w-56 animate-float">
            <Image src="/images/hero-boy.png" alt="طالب يفكر في مواقيت الصلاة" fill className="object-contain drop-shadow-xl" priority />
          </div>
          <div>
            <p className="text-lg leading-relaxed text-slate-700">
              مرحبًا يا بطل! أنا <span className="font-black text-turq-700">سالم</span>، تعلمنا سابقًا ستة شروط للصلاة… لكن هناك
              شروطٌ أخرى! هل تساعدني أتذكرها؟
            </p>
            <p className="mt-3 rounded-2xl bg-white p-4 text-2xl font-black text-turq-900 shadow-sm">{question}</p>
          </div>
        </div>
      </Card>

      <div className="grid gap-4 md:grid-cols-3">
        {INTRO_SCENES.map((s, i) => (
          <Card key={i} className="text-center">
            <div className="mb-2 text-6xl">{s.emoji}</div>
            <p className="font-semibold leading-relaxed text-slate-700">{s.text}</p>
            <p className="mt-2 text-sm font-bold text-brand-orange">هل صلاته صحيحة؟</p>
          </Card>
        ))}
      </div>

      <Card>
        <h3 className="mb-1 text-xl font-black text-turq-900">🧠 عصف ذهني: اختر ما تتوقع أنه شرط للصلاة</h3>
        <p className="mb-4 text-sm text-slate-500">لا توجد إجابة خاطئة الآن؛ المهم أن تشارك وتفكر!</p>
        <div className="flex flex-wrap gap-2">
          {BRAINSTORM_CHIPS.map((c) => {
            const on = chips.includes(c);
            return (
              <button
                key={c}
                type="button"
                disabled={sent}
                onClick={() => { ctx.sounds.click(); setChips(on ? chips.filter((x) => x !== c) : [...chips, c]); }}
                className={cx(
                  "touch-target rounded-2xl border-2 px-4 py-2 text-lg font-bold transition-all",
                  on ? "border-turq-500 bg-turq-500 text-white shadow" : "border-slate-200 bg-white hover:border-turq-300",
                  sent && "opacity-80",
                )}
              >
                {c}
              </button>
            );
          })}
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-3">
          {!sent ? (
            <Btn onClick={submit} disabled={chips.length === 0 || ctx.busy} size="lg">أرسل توقعي ✨</Btn>
          ) : (
            <Feedback kind="correct">
              رائع يا {ctx.state.student.name}! تعلمنا سابقًا ستة شروط، وفي هذا الدرس سنتعلم ثلاثة شروط جديدة: دخول الوقت،
              استقبال القبلة، والنية. لنبدأ الرحلة!
            </Feedback>
          )}
        </div>
      </Card>

      <Card>
        <h3 className="mb-3 text-xl font-black text-turq-900">✍️ اكتب أو سجّل إجابتك بصوتك (اختياري)</h3>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={3}
          disabled={openSent}
          placeholder="قبل أن أصلّي يجب أن…"
          className="w-full rounded-2xl border-2 border-slate-200 p-4 text-lg focus:border-turq-400 focus:outline-none disabled:bg-slate-50"
        />
        <div className="mt-3 flex flex-wrap items-center gap-3">
          <Btn variant="secondary" onClick={submitText} disabled={!text.trim() || openSent || ctx.busy}>
            {openSent ? "✓ تم حفظ إجابتك" : "حفظ الإجابة الكتابية"}
          </Btn>
          {ctx.state.settings.allowAudio && (
            <AudioRecorder saved={ctx.state.audioSlides.includes("intro")} onSave={(d) => ctx.uploadAudio("intro", "intro_brainstorm", d)} />
          )}
        </div>
      </Card>
    </StationShell>
  );
}

/* ------------------------------- المحطة 2 ------------------------------- */

export function StationDiscover({ ctx, title, subtitle }: StationProps) {
  const savedMatch = ctx.state.answers.discover_match;
  const [flipped, setFlipped] = useState<Set<string>>(
    () => new Set(ctx.state.answers.discover_flip ? NEW_CONDITIONS.map((c) => c.key) : []),
  );
  const [pairs, setPairs] = useState<Record<string, string>>(() => (savedMatch ? (savedMatch.answer as Record<string, string>) : {}));
  const [result, setResult] = useState<ActivityResult | null>(
    savedMatch ? { isCorrect: savedMatch.isCorrect, score: savedMatch.score, maxScore: savedMatch.maxScore, needsReview: false, detail: savedMatch.detail } : null,
  );
  const meanings = useMemo(() => NEW_CONDITIONS.map((c) => ({ id: c.key, label: DISCOVER_MEANINGS[c.key] })), []);
  const allFlipped = flipped.size === NEW_CONDITIONS.length;

  useEffect(() => {
    if (allFlipped && !ctx.state.answers.discover_flip) ctx.saveAnswer("discover_flip", { done: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allFlipped]);

  const check = async () => {
    const r = await ctx.saveAnswer("discover_match", pairs);
    if (r) {
      setResult(r);
      if (r.isCorrect) { ctx.sounds.success(); ctx.celebrate(); } else ctx.sounds.error();
    }
  };
  const retry = () => {
    const next: Record<string, string> = {};
    for (const [k, v] of Object.entries(pairs)) if (result?.detail?.[k]) next[k] = v;
    setPairs(next); setResult(null);
  };

  return (
    <StationShell emoji="🃏" title={title} subtitle={subtitle} strategy="التعلم بالاكتشاف" onSpeak={() => ctx.speak("اضغط على كل بطاقة لتكتشف شرطًا جديدًا من شروط الصلاة")}>
      <Card className="bg-gradient-to-l from-sky-50 to-white">
        <p className="text-lg font-semibold text-slate-700">
          يتضح من قول الله تعالى: <span className="font-black text-emerald-800">{AYAH.text}</span> من شروط الصلاة التي لا تصح إلا بها ثلاثة
          شروط جديدة. اضغط على كل بطاقة لتكتشفها:
        </p>
        <p className="mt-2 text-sm font-bold text-turq-700">اكتشفت {flipped.size} من {NEW_CONDITIONS.length}</p>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {NEW_CONDITIONS.map((c) => (
          <FlipCard
            key={c.key}
            flipped={flipped.has(c.key)}
            onFlip={() => { ctx.sounds.click(); setFlipped((s) => new Set(s).add(c.key)); }}
            front={
              <div className={cx("flex h-full flex-col items-center justify-center rounded-3xl bg-gradient-to-br p-4 text-white shadow-lg", c.color)}>
                <span className="text-6xl">❔</span>
                <span className="mt-3 text-xl font-black">الشرط {c.ordinal}</span>
                <span className="mt-1 text-sm opacity-90">اضغط للاكتشاف</span>
              </div>
            }
            back={
              <div className="flex h-full flex-col rounded-3xl border-4 border-turq-200 bg-white p-4 shadow-lg">
                <div className="flex items-center justify-between">
                  <span className="text-4xl">{c.icon}</span>
                  <span
                    role="button"
                    tabIndex={0}
                    onClick={(e) => { e.stopPropagation(); ctx.speak(`الشرط ${c.ordinal}: ${c.name}. ${c.text}`); }}
                    onKeyDown={(e) => e.key === "Enter" && ctx.speak(`الشرط ${c.ordinal}: ${c.name}. ${c.text}`)}
                    className="touch-target grid place-items-center rounded-2xl bg-turq-50 text-2xl text-turq-700 hover:bg-turq-100"
                    aria-label="استمع إلى الشرح"
                  >
                    🔊
                  </span>
                </div>
                <h4 className="mt-2 text-2xl font-black text-turq-900">{c.name}</h4>
                <p className="mt-1 text-base font-semibold leading-relaxed text-slate-700">{c.text}</p>
                <p className="mt-auto rounded-xl bg-orange-50 p-2 text-sm text-orange-800">مثال: {c.example}</p>
              </div>
            }
          />
        ))}
      </div>

      <Card className={cx(!allFlipped && "opacity-60")}>
        <h3 className="mb-1 text-xl font-black text-turq-900">🔗 نشاط المطابقة: صل كل شرط جديد بمعناه</h3>
        <p className="mb-4 text-sm text-slate-500">{allFlipped ? "اضغط على الشرط ثم اضغط على معناه." : "اكتشف جميع البطاقات أولًا لفتح نشاط المطابقة."}</p>
        <MatchPairs
          left={NEW_CONDITIONS.map((c) => ({ id: c.key, label: c.name, emoji: c.icon }))}
          right={meanings}
          value={pairs}
          onChange={setPairs}
          results={result?.detail}
          disabled={!allFlipped || !!result}
        />
        <div className="mt-4 flex flex-wrap items-center gap-3">
          {!result ? (
            <Btn size="lg" onClick={check} disabled={!allFlipped || Object.keys(pairs).length < NEW_CONDITIONS.length || ctx.busy}>
              تحقق من إجاباتي ✅
            </Btn>
          ) : (
            <>
              <ScoreBadge score={result.score} max={result.maxScore} />
              {result.isCorrect ? (
                <Feedback kind="correct">ممتاز! طابقت الشروط الجديدة الثلاثة بمعانيها بشكل صحيح.</Feedback>
              ) : (
                <>
                  <Feedback kind="wrong">أحسنت المحاولة! راجع البطاقات ذات العلامة ✗ ثم حاول مرة أخرى.</Feedback>
                  <Btn variant="warning" onClick={retry}>🔁 حاول مرة أخرى</Btn>
                </>
              )}
            </>
          )}
        </div>
      </Card>
    </StationShell>
  );
}

/* ------------------------------- المحطة 3 ------------------------------- */

export function StationTimes({ ctx, title, subtitle }: StationProps) {
  const saved = ctx.state.answers.times_match;
  const [pairs, setPairs] = useState<Record<string, string>>(() => (saved ? (saved.answer as Record<string, string>) : {}));
  const [result, setResult] = useState<ActivityResult | null>(
    saved ? { isCorrect: saved.isCorrect, score: saved.score, maxScore: saved.maxScore, needsReview: false, detail: saved.detail } : null,
  );

  const check = async () => {
    const r = await ctx.saveAnswer("times_match", pairs);
    if (r) {
      setResult(r);
      if (r.isCorrect) { ctx.sounds.success(); ctx.celebrate(); } else ctx.sounds.error();
    }
  };
  const retry = () => {
    const next: Record<string, string> = {};
    for (const [k, v] of Object.entries(pairs)) if (result?.detail?.[k]) next[k] = v;
    setPairs(next); setResult(null);
  };

  return (
    <StationShell emoji="🕐" title={title} subtitle={subtitle} strategy="التعلم البصري" onSpeak={() => ctx.speak("هذه أوقات الصلوات الخمس كما وردت في الكتاب")}>
      <Card className="bg-gradient-to-l from-teal-50 to-white">
        <p className="text-lg font-semibold text-slate-700">
          للصلاة شروطٌ لا تصح إلا بها، ومنها <b className="text-turq-800">دخول الوقت</b>. وهذه أوقات الصلوات الخمس:
        </p>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {PRAYER_TIMES.map((p) => (
          <Card key={p.key} className={cx("text-white", `bg-gradient-to-br ${p.color}`)}>
            <div className="flex items-center gap-3">
              <span className="text-4xl">{p.emoji}</span>
              <div>
                <h4 className="text-2xl font-black">صلاة {p.name}</h4>
                <p className="text-xs opacity-90">{p.rakat}</p>
              </div>
            </div>
            <div className="mt-3 space-y-1 text-sm font-bold">
              <p>🕒 البداية: {p.start}</p>
              <p>🏁 النهاية: {p.end}</p>
            </div>
          </Card>
        ))}
      </div>

      <Card>
        <h3 className="mb-1 text-xl font-black text-turq-900">🔗 نشاط المطابقة: صل كل صلاة بوقتها</h3>
        <p className="mb-4 text-sm text-slate-500">اضغط على الصلاة ثم اضغط على وصف وقتها.</p>
        <MatchPairs
          left={PRAYER_TIMES.map((p) => ({ id: p.key, label: `صلاة ${p.name}`, emoji: p.emoji }))}
          right={PRAYER_TIMES.map((p) => ({ id: p.key, label: `${p.start} — ${p.end}` }))}
          value={pairs}
          onChange={setPairs}
          results={result?.detail}
          disabled={!!result}
        />
        <div className="mt-4 flex flex-wrap items-center gap-3">
          {!result ? (
            <Btn size="lg" onClick={check} disabled={Object.keys(pairs).length < PRAYER_TIMES.length || ctx.busy}>
              تحقق من إجاباتي ✅
            </Btn>
          ) : (
            <>
              <ScoreBadge score={result.score} max={result.maxScore} />
              {result.isCorrect ? (
                <Feedback kind="correct">ممتاز! طابقت الصلوات الخمس بأوقاتها بشكل صحيح.</Feedback>
              ) : (
                <>
                  <Feedback kind="wrong">أحسنت المحاولة! راجع البطاقات ذات العلامة ✗ ثم حاول مرة أخرى.</Feedback>
                  <Btn variant="warning" onClick={retry}>🔁 حاول مرة أخرى</Btn>
                </>
              )}
            </>
          )}
        </div>
      </Card>
    </StationShell>
  );
}

/* ------------------------------- المحطة 4 ------------------------------- */

export function StationDhuhr({ ctx, title, subtitle, videoUrl }: StationProps & { videoUrl: string | null }) {
  const saved = ctx.state.answers.dhuhr_quiz;
  const savedIqama = ctx.state.answers.iqama_fill;
  const [phase, setPhase] = useState<"intro" | "video" | "activity">(saved ? "activity" : "intro");
  const [ans, setAns] = useState<Record<string, number>>(() => (saved ? (saved.answer as Record<string, number>) : {}));
  const [result, setResult] = useState<ActivityResult | null>(saved ? { ...saved, needsReview: false } : null);
  const [fill, setFill] = useState<Record<string, string>>(() => (savedIqama ? (savedIqama.answer as Record<string, string>) : {}));
  const [fillRes, setFillRes] = useState<ActivityResult | null>(savedIqama ? { ...savedIqama, needsReview: false } : null);

  const check = async () => {
    const r = await ctx.saveAnswer("dhuhr_quiz", ans);
    if (r) {
      setResult(r);
      if (r.isCorrect) { ctx.sounds.success(); ctx.celebrate(); } else ctx.sounds.error();
    }
  };
  const checkFill = async () => {
    const r = await ctx.saveAnswer("iqama_fill", fill);
    if (r) {
      setFillRes(r);
      if (r.isCorrect) { ctx.sounds.success(); ctx.celebrate(); } else ctx.sounds.error();
    }
  };
  const retryFill = () => {
    const next: Record<string, string> = {};
    for (const [k, v] of Object.entries(fill)) if (fillRes?.detail?.[k]) next[k] = v;
    setFill(next); setFillRes(null);
  };

  return (
    <StationShell
      emoji="☀️"
      title={title}
      subtitle={subtitle}
      strategy="شاهد – فكر – أجب"
      onSpeak={() => ctx.speak("وقت صلاة الظهر من زوال الشمس إلى أن يصبح ظل كل شيء مثله، ووقت العصر من خروج وقت الظهر إلى اصفرار الشمس")}
    >
      <Card className="bg-gradient-to-l from-cyan-50 to-white">
        <div className="flex flex-wrap items-center gap-4">
          <div className="grid h-24 w-24 place-items-center rounded-3xl bg-cyan-100 text-6xl">☀️</div>
          <div className="flex-1">
            <h3 className="text-2xl font-black text-turq-900">وقت صلاة الظهر والعصر</h3>
            <p className="mt-1 text-lg text-slate-700">
              الظهر: من زوال الشمس إلى أن يصبح ظل كل شيء مثله. العصر: من خروج وقت الظهر إلى اصفرار الشمس.
            </p>
          </div>
        </div>
      </Card>

      {phase === "intro" && (
        <Card className="text-center">
          {videoUrl ? (
            <>
              <h3 className="text-xl font-black text-turq-900">🎬 شاهد الفيديو التعليمي القصير عن أوقات الصلاة</h3>
              <p className="mt-2 text-slate-600">بعد انتهاء الفيديو سينتقل بك النشاط تلقائيًا إلى مرحلة «فكر وأجب».</p>
              <div className="mt-4 flex flex-wrap justify-center gap-3">
                <Btn size="lg" onClick={() => setPhase("video")}>▶️ تشغيل الفيديو</Btn>
                <Btn variant="secondary" onClick={() => setPhase("activity")}>الانتقال إلى النشاط مباشرة</Btn>
              </div>
            </>
          ) : (
            <>
              <div className="mx-auto mb-3 grid h-40 w-full max-w-md place-items-center rounded-3xl bg-gradient-to-br from-sky-100 to-cyan-50 text-7xl">☀️🌤️🕌</div>
              <p className="text-lg font-semibold text-slate-700">لم يُضف المعلم رابط فيديو لهذه المحطة بعد (يمكن إضافته من لوحة المعلم).</p>
              <Btn className="mt-4" size="lg" onClick={() => setPhase("activity")}>فكّر وأجب ←</Btn>
            </>
          )}
        </Card>
      )}

      {phase === "video" && videoUrl && (
        <Card>
          <VideoPlayer url={videoUrl} onEnded={() => setPhase("activity")} />
          <div className="mt-3 flex justify-between">
            <p className="text-sm text-slate-500">سينتقل النشاط تلقائيًا عند انتهاء الفيديو.</p>
            <Btn variant="secondary" size="sm" onClick={() => setPhase("activity")}>تخطي إلى النشاط ←</Btn>
          </div>
        </Card>
      )}

      {phase === "activity" && (
        <>
          <Card className="animate-fadeup">
            <h3 className="mb-4 text-xl font-black text-turq-900">🤔 فكر وأجب</h3>
            <div className="space-y-5">
              {DHUHR_QUESTIONS.map((q, i) => (
                <div key={q.key} className="rounded-2xl bg-slate-50 p-4">
                  <p className="mb-3 text-lg font-bold text-slate-800">{i + 1}. {q.text}</p>
                  <Choices
                    choices={q.choices}
                    value={ans[q.key]}
                    onChange={(v) => setAns({ ...ans, [q.key]: v })}
                    revealed={!!result}
                    correct={q.correct}
                    disabled={!!result}
                    shuffleKey={`dhuhr-${q.key}`}
                  />
                </div>
              ))}
            </div>
            <div className="mt-4 flex flex-wrap items-center gap-3">
              {!result ? (
                <Btn size="lg" onClick={check} disabled={Object.keys(ans).length < DHUHR_QUESTIONS.length || ctx.busy}>تحقق ✅</Btn>
              ) : (
                <>
                  <ScoreBadge score={result.score} max={result.maxScore} />
                  <Feedback kind={result.isCorrect ? "correct" : "info"}>
                    {result.isCorrect ? "رائع! عرفت وقت الظهر والعصر بدقة." : "تذكر: الظهر من زوال الشمس، والعصر حتى اصفرار الشمس."}
                  </Feedback>
                  {!result.isCorrect && <Btn variant="warning" onClick={() => setResult(null)}>🔁 حاول مرة أخرى</Btn>}
                </>
              )}
            </div>
          </Card>

          <Card>
            <h3 className="mb-1 text-xl font-black text-turq-900">📋 أحدد أوقات الصلوات في المواعيد الثابتة</h3>
            <p className="mb-4 text-sm text-slate-500">اختر وصف البداية والنهاية الصحيح أمام كل صلاة.</p>
            <div className="space-y-2">
              {IQAMA_ROWS.map((row) => {
                const val = fill[row.key] ?? "";
                const ok = fillRes?.detail?.[row.key];
                const [st, en] = val.split("|||");
                return (
                  <div
                    key={row.key}
                    className={cx(
                      "flex flex-wrap items-center gap-2 rounded-2xl border-2 p-3",
                      ok === true ? "border-emerald-300 bg-emerald-50" : ok === false ? "border-rose-300 bg-rose-50" : "border-slate-200 bg-white",
                    )}
                  >
                    <span className="font-black text-turq-900">وقت صلاة {row.name}:</span>
                    <span className="text-sm text-slate-500">من</span>
                    <select
                      value={st ?? ""}
                      disabled={!!fillRes}
                      onChange={(e) => setFill({ ...fill, [row.key]: [e.target.value, en ?? ""].join("|||") })}
                      className="rounded-xl border-2 border-slate-200 p-2 text-sm font-bold focus:border-turq-400 focus:outline-none"
                    >
                      <option value="">اختر البداية…</option>
                      {PRAYER_TIMES.map((p) => <option key={p.key} value={p.start}>{p.start}</option>)}
                    </select>
                    <span className="text-sm text-slate-500">إلى</span>
                    <select
                      value={en ?? ""}
                      disabled={!!fillRes}
                      onChange={(e) => setFill({ ...fill, [row.key]: [st ?? "", e.target.value].join("|||") })}
                      className="rounded-xl border-2 border-slate-200 p-2 text-sm font-bold focus:border-turq-400 focus:outline-none"
                    >
                      <option value="">اختر النهاية…</option>
                      {PRAYER_TIMES.map((p) => <option key={p.key} value={p.end}>{p.end}</option>)}
                    </select>
                    {ok === true && <span className="text-emerald-600">✓</span>}
                    {ok === false && <span className="text-rose-600">✗</span>}
                  </div>
                );
              })}
            </div>
            <div className="mt-4 flex flex-wrap items-center gap-3">
              {!fillRes ? (
                <Btn size="lg" onClick={checkFill} disabled={Object.keys(fill).length < IQAMA_ROWS.length || ctx.busy}>تحقق ✅</Btn>
              ) : (
                <>
                  <ScoreBadge score={fillRes.score} max={fillRes.maxScore} />
                  {fillRes.isCorrect ? (
                    <Feedback kind="correct">ممتاز! حددت أوقات الصلوات الخمس بدقة.</Feedback>
                  ) : (
                    <>
                      <Feedback kind="wrong">راجع الخانات ذات العلامة ✗ ثم حاول مرة أخرى.</Feedback>
                      <Btn variant="warning" onClick={retryFill}>🔁 حاول مرة أخرى</Btn>
                    </>
                  )}
                </>
              )}
            </div>
          </Card>
        </>
      )}
    </StationShell>
  );
}
