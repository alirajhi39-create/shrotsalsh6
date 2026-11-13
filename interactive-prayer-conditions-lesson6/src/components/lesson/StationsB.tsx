"use client";

import { useEffect, useMemo, useState } from "react";
import {
  NEW_CONDITIONS,
  DETECTIVE_CASES,
  HADITH_NIYYAH,
  KAABA_ITEMS,
  NIYYAH_RULE,
  type ActivityResult,
} from "@/lib/content";
import type { StationProps } from "./StationsA";
import { EvidenceCard } from "./StationsA";
import { AudioRecorder, Btn, Card, Choices, Feedback, MultiChoices, ScoreBadge, StationShell, Stars, cx } from "./ui";

const rec = (v: unknown): Record<string, unknown> =>
  v && typeof v === "object" && !Array.isArray(v) ? (v as Record<string, unknown>) : {};

/* ------------------------------- المحطة 5 ------------------------------- */

export function StationDetective({ ctx, title, subtitle }: StationProps) {
  const [answers, setAnswers] = useState<Record<string, { where?: number; fix?: number }>>(() => {
    const init: Record<string, { where?: number; fix?: number }> = {};
    for (const c of DETECTIVE_CASES) {
      const s = ctx.state.answers[c.key];
      if (s) init[c.key] = rec(s.answer) as { where?: number; fix?: number };
    }
    return init;
  });
  const [results, setResults] = useState<Record<string, ActivityResult | null>>(() => {
    const init: Record<string, ActivityResult | null> = {};
    for (const c of DETECTIVE_CASES) {
      const s = ctx.state.answers[c.key];
      init[c.key] = s ? { ...s, needsReview: false } : null;
    }
    return init;
  });
  const stars = DETECTIVE_CASES.filter((c) => results[c.key]?.isCorrect).length;

  const check = async (key: string) => {
    const r = await ctx.saveAnswer(key, answers[key] ?? {});
    if (r) {
      setResults((p) => ({ ...p, [key]: r }));
      if (r.isCorrect) {
        ctx.sounds.success();
        if (stars + 1 === DETECTIVE_CASES.length) ctx.celebrate();
      } else ctx.sounds.error();
    }
  };

  return (
    <StationShell
      emoji="🔍"
      title={title}
      subtitle={subtitle}
      strategy="المحقق الصغير"
      onSpeak={() => ctx.speak("أنت المحقق الصغير. هل الوقت صحيح؟ هل استقبل القبلة؟ هل أنوى الصلاة؟")}
    >
      <Card className="overflow-hidden bg-gradient-to-l from-orange-50 to-white">
        <div className="grid items-center gap-4 md:grid-cols-[180px_1fr]">
          <div className="relative mx-auto h-44 w-44 animate-float">
            <img src="/images/detective-kid.webp" alt="المحقق الصغير" className="h-full w-full object-contain drop-shadow-xl" />
          </div>
          <div>
            <h3 className="text-2xl font-black text-turq-900">مهمتك أيها المحقق الصغير!</h3>
            <p className="mt-1 text-lg text-slate-700">
              في كل قضية: حدد الشرط الذي لم يتحقق، ثم اختر ما يجب على الطالب فعله. كل قضية تحلها تمنحك نجمة ⭐
            </p>
            <div className="mt-3 flex items-center gap-3">
              <Stars count={stars} total={DETECTIVE_CASES.length} />
              <span className="font-bold text-orange-700">{stars} / {DETECTIVE_CASES.length}</span>
            </div>
          </div>
        </div>
      </Card>

      {DETECTIVE_CASES.map((c) => {
        const a = answers[c.key] ?? {};
        const r = results[c.key];
        return (
          <Card key={c.key} className={cx("border-4", r?.isCorrect ? "border-emerald-300" : r ? "border-rose-200" : "border-transparent")}>
            <div className="mb-3 flex items-center gap-3">
              <span className="text-4xl">{c.emoji}</span>
              <div>
                <h4 className="text-xl font-black text-turq-900">{c.title}</h4>
                <p className="text-lg text-slate-700">{c.text}</p>
              </div>
              {r?.isCorrect && <span className="ms-auto text-4xl">⭐</span>}
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl bg-slate-50 p-3">
                <p className="mb-2 font-bold text-slate-700">🔎 أي شرط لم يتحقق؟</p>
                <Choices
                  choices={c.whereChoices}
                  value={a.where}
                  onChange={(i) => setAnswers({ ...answers, [c.key]: { ...a, where: i } })}
                  revealed={!!r}
                  correct={c.whereCorrect}
                  disabled={!!r}
                  shuffleKey={`${c.key}-w`}
                />
              </div>
              <div className="rounded-2xl bg-slate-50 p-3">
                <p className="mb-2 font-bold text-slate-700">🛠️ ماذا يجب أن يفعل؟</p>
                <Choices
                  choices={c.fixChoices}
                  value={a.fix}
                  onChange={(i) => setAnswers({ ...answers, [c.key]: { ...a, fix: i } })}
                  revealed={!!r}
                  correct={c.fixCorrect}
                  disabled={!!r}
                  shuffleKey={`${c.key}-f`}
                />
              </div>
            </div>
            <div className="mt-3 flex flex-wrap items-center gap-3">
              {!r ? (
                <Btn onClick={() => check(c.key)} disabled={a.where === undefined || a.fix === undefined || ctx.busy}>
                  حل القضية 🕵️
                </Btn>
              ) : r.isCorrect ? (
                <Feedback kind="correct">قضية محلولة! حصلت على نجمة.</Feedback>
              ) : (
                <>
                  <Feedback kind="wrong">لم تُحل القضية بعد؛ راجع الإجابات الخضراء ثم حاول من جديد.</Feedback>
                  <Btn variant="warning" onClick={() => setResults({ ...results, [c.key]: null })}>
                    🔁 إعادة التحقيق
                  </Btn>
                </>
              )}
            </div>
          </Card>
        );
      })}
    </StationShell>
  );
}

/* ------------------------------- المحطة 6 ------------------------------- */

export function StationQibla({ ctx, title, subtitle }: StationProps) {
  const savedItems = ctx.state.answers.qibla_items;
  const savedRules = ctx.state.answers.qibla_rules;
  const [items, setItems] = useState<Record<string, boolean>>(() =>
    savedItems ? ((savedItems.answer as Record<string, boolean>) ?? {}) : {},
  );
  const [itemsRes, setItemsRes] = useState<ActivityResult | null>(savedItems ? { ...savedItems, needsReview: false } : null);
  const [rules, setRules] = useState<number | null>(() => {
    const c = (savedRules?.answer as { choice?: number })?.choice;
    return typeof c === "number" ? c : null;
  });
  const [rulesRes, setRulesRes] = useState<ActivityResult | null>(savedRules ? { ...savedRules, needsReview: false } : null);

  const checkItems = async () => {
    const r = await ctx.saveAnswer("qibla_items", items);
    if (r) {
      setItemsRes(r);
      if (r.isCorrect) { ctx.sounds.success(); ctx.celebrate(); } else ctx.sounds.error();
    }
  };
  const checkRules = async (i: number) => {
    setRules(i);
    const r = await ctx.saveAnswer("qibla_rules", { choice: i });
    if (r) {
      setRulesRes(r);
      if (r.isCorrect) { ctx.sounds.success(); ctx.celebrate(); } else ctx.sounds.error();
    }
  };

  const cond = NEW_CONDITIONS.find((c) => c.key === "qibla")!;

  return (
    <StationShell
      emoji="🕋"
      title={title}
      subtitle={subtitle}
      strategy="التعلم البصري"
      onSpeak={() => ctx.speak("الشرط الثامن: استقبال القبلة. الكعبة المشرفة تقع في مكة المكرمة، ولا نصلي دون استقبال القبلة")}
    >
      <Card className="bg-gradient-to-l from-sky-50 to-white">
        <div className="flex flex-wrap items-center gap-4">
          <div className="grid h-24 w-24 place-items-center rounded-3xl bg-sky-100 text-6xl">🕋</div>
          <div className="flex-1">
            <h3 className="text-2xl font-black text-turq-900">الشرط الثامن: استقبال القبلة</h3>
            <p className="mt-1 text-lg text-slate-700">{cond.text} {cond.simple}</p>
          </div>
        </div>
      </Card>

      <Card className="text-center">
        <div className="mx-auto mb-3 grid h-48 w-full max-w-md place-items-center rounded-3xl bg-gradient-to-br from-slate-900 to-slate-700 text-8xl">🕋</div>
        <p className="text-xl font-black text-turq-900">الكعبة المشرفة تقع في مكة المكرمة</p>
        <p className="mt-2 text-lg font-bold text-brand-orange">لا نصلي الصلاة دون استقبال القبلة</p>
      </Card>

      <Card>
        <h3 className="mb-1 text-xl font-black text-turq-900">✅ أعلم بعلامة (✓) أمام كل عبارة لها ارتباط بصورة الكعبة</h3>
        <p className="mb-4 text-sm text-slate-500">اضغط على العبارات الصحيحة فقط.</p>
        <MultiChoices
          choices={KAABA_ITEMS.map((i) => i.label)}
          value={Object.entries(items)
            .filter(([, v]) => v === true)
            .map(([k]) => KAABA_ITEMS.findIndex((i) => i.id === k))
            .filter((i) => i >= 0)}
          onChange={(arr) => {
            const next: Record<string, boolean> = {};
            KAABA_ITEMS.forEach((i, idx) => { next[i.id] = arr.includes(idx); });
            setItems(next);
          }}
          revealed={!!itemsRes}
          correct={itemsRes?.isCorrect ? KAABA_ITEMS.map((i, idx) => (i.correct ? idx : -1)).filter((i) => i >= 0) : undefined}
          disabled={!!itemsRes}
        />
        <div className="mt-4 flex flex-wrap items-center gap-3">
          {!itemsRes ? (
            <Btn size="lg" onClick={checkItems} disabled={Object.keys(items).length === 0 || ctx.busy}>تحقق ✅</Btn>
          ) : (
            <>
              <ScoreBadge score={itemsRes.score} max={itemsRes.maxScore} />
              {itemsRes.isCorrect ? (
                <Feedback kind="correct">ممتاز! عرفت العبارات المرتبطة بالكعبة المشرفة.</Feedback>
              ) : (
                <>
                  <Feedback kind="wrong">راجع العبارات ذات العلامة ✗ ثم حاول مرة أخرى.</Feedback>
                  <Btn variant="warning" onClick={() => { setItems({}); setItemsRes(null); }}>🔁 حاول مرة أخرى</Btn>
                </>
              )}
            </>
          )}
        </div>
      </Card>

      <Card>
        <h3 className="mb-3 text-xl font-black text-turq-900">🕌 أين تقع الكعبة التي نستقبلها في صلاتنا؟</h3>
        <Choices
          choices={["مكة المكرمة", "المدينة المنورة", "الطائف"]}
          value={rules}
          onChange={checkRules}
          revealed={!!rulesRes}
          correct={rulesRes?.isCorrect ? rules ?? undefined : undefined}
          disabled={!!rulesRes}
          shuffleKey="qibla-place"
        />
        {rulesRes && (
          <div className="mt-3 space-y-3">
            <Feedback kind={rulesRes.isCorrect ? "correct" : "wrong"}>
              {rulesRes.isCorrect ? "صحيح! الكعبة المشرفة تقع في مكة المكرمة." : "الإجابة الصحيحة: مكة المكرمة."}
            </Feedback>
            {!rulesRes.isCorrect && (
              <Btn variant="warning" onClick={() => { setRules(null); setRulesRes(null); }}>🔁 حاول مرة أخرى</Btn>
            )}
          </div>
        )}
      </Card>
    </StationShell>
  );
}

/* ------------------------------- المحطة 7 ------------------------------- */

export function StationNiyyah({ ctx, title, subtitle }: StationProps) {
  const savedOrder = ctx.state.answers.niyyah_hadith_order;
  const savedInfer = ctx.state.answers.niyyah_infer;
  const [order, setOrder] = useState<string[]>(() => {
    const o = (savedOrder?.answer as { order?: string[] })?.order;
    return Array.isArray(o) ? o : [];
  });
  const [orderRes, setOrderRes] = useState<ActivityResult | null>(savedOrder ? { ...savedOrder, needsReview: false } : null);
  const [infer, setInfer] = useState<number | null>(() => {
    const c = (savedInfer?.answer as { choice?: number })?.choice;
    return typeof c === "number" ? c : null;
  });
  const [inferRes, setInferRes] = useState<ActivityResult | null>(savedInfer ? { ...savedInfer, needsReview: false } : null);
  const [recSent, setRecSent] = useState(ctx.state.audioSlides.includes("niyyah"));

  const checkOrder = async () => {
    const r = await ctx.saveAnswer("niyyah_hadith_order", { order });
    if (r) {
      setOrderRes(r);
      if (r.isCorrect) { ctx.sounds.success(); ctx.celebrate(); } else ctx.sounds.error();
    }
  };
  const checkInfer = async (i: number) => {
    setInfer(i);
    const r = await ctx.saveAnswer("niyyah_infer", { choice: i });
    if (r) {
      setInferRes(r);
      r.isCorrect ? ctx.sounds.success() : ctx.sounds.error();
    }
  };

  const words = useMemo(() => [...HADITH_NIYYAH.words].sort(() => Math.random() - 0.5), []);

  return (
    <StationShell
      emoji="💖"
      title={title}
      subtitle={subtitle}
      strategy="تدبر الحديث والاستنتاج"
      onSpeak={() => ctx.speak(`${HADITH_NIYYAH.intro} ${HADITH_NIYYAH.text}. النية مكانها القلب`)}
    >
      <EvidenceCard intro={HADITH_NIYYAH.intro} text={HADITH_NIYYAH.text} source={HADITH_NIYYAH.source} />

      <Card>
        <h3 className="mb-1 text-xl font-black text-turq-900">1️⃣ اقرأ الحديث ثم رتّب كلماته</h3>
        <p className="mb-4 text-sm text-slate-500">اضغط على الكلمات بالترتيب الصحيح لتكوين الحديث الشريف.</p>
        <div
          className={cx(
            "flex min-h-20 flex-wrap items-center gap-2 rounded-2xl border-2 border-dashed p-3",
            orderRes?.isCorrect ? "border-emerald-400 bg-emerald-50" : orderRes && !orderRes.isCorrect ? "border-rose-300 bg-rose-50" : "border-turq-300 bg-turq-50/50",
          )}
        >
          {order.length === 0 && <span className="text-slate-400">اضغط على الكلمات بالترتيب…</span>}
          {order.map((w, i) => (
            <button
              key={`${w}-${i}`}
              type="button"
              disabled={!!orderRes}
              onClick={() => setOrder(order.filter((_, j) => j !== i))}
              className="touch-target animate-pop rounded-xl bg-turq-600 px-4 py-2 text-lg font-bold text-white shadow"
            >
              {w}
            </button>
          ))}
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {words
            .filter((w) => order.filter((o) => o === w).length < words.filter((x) => x === w).length)
            .map((w, i) => (
              <button
                key={`${w}-${i}`}
                type="button"
                disabled={!!orderRes}
                onClick={() => setOrder([...order, w])}
                className="touch-target rounded-xl border-2 border-turq-200 bg-white px-4 py-2 text-lg font-bold text-turq-800 shadow-sm hover:border-turq-400"
              >
                {w}
              </button>
            ))}
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-3">
          {!orderRes ? (
            <Btn onClick={checkOrder} disabled={order.length < HADITH_NIYYAH.words.length || ctx.busy}>تحقق ✅</Btn>
          ) : orderRes.isCorrect ? (
            <Feedback kind="correct">أحسنت! رتبت كلمات الحديث الشريف ترتيبًا صحيحًا.</Feedback>
          ) : (
            <>
              <Feedback kind="wrong">الترتيب غير صحيح؛ اقرأ الحديث في الأعلى ثم حاول مرة أخرى.</Feedback>
              <Btn variant="warning" onClick={() => { setOrder([]); setOrderRes(null); }}>🔁 حاول مرة أخرى</Btn>
            </>
          )}
        </div>
      </Card>

      <Card>
        <h3 className="mb-3 text-xl font-black text-turq-900">2️⃣ أستنتج من هذا الحديث شرطًا من شروط الصلاة</h3>
        <Choices
          choices={[
            "النية شرط من شروط الصلاة",
            "دخول الوقت شرط من شروط الصلاة",
            "استقبال القبلة شرط من شروط الصلاة",
          ]}
          value={infer}
          onChange={checkInfer}
          revealed={!!inferRes}
          correct={inferRes?.isCorrect ? infer ?? undefined : undefined}
          disabled={!!inferRes}
          shuffleKey="niyyah-infer"
        />
        {inferRes && (
          <div className="mt-3 space-y-3">
            <Feedback kind={inferRes.isCorrect ? "correct" : "wrong"}>
              {inferRes.isCorrect ? "استنتاج صحيح! النية شرط من شروط الصلاة." : "ليس هذا هو الاستنتاج الصحيح."}
            </Feedback>
            <Feedback kind="info">{NIYYAH_RULE}</Feedback>
            {!inferRes.isCorrect && (
              <Btn variant="warning" onClick={() => { setInfer(null); setInferRes(null); }}>🔁 حاول مرة أخرى</Btn>
            )}
          </div>
        )}
      </Card>

      {ctx.state.settings.allowAudio && (
        <Card>
          <h3 className="mb-2 text-xl font-black text-turq-900">3️⃣ 🎙️ سجّل قراءتك للحديث (اختياري)</h3>
          <p className="mb-3 text-sm text-slate-500">سيستمع المعلم إلى قراءتك من لوحة التحكم.</p>
          <AudioRecorder saved={recSent} onSave={async (d) => { const ok = await ctx.uploadAudio("niyyah", "niyyah_hadith_order", d); if (ok) setRecSent(true); }} />
        </Card>
      )}
    </StationShell>
  );
}

/* ------------------------------- المحطة 8 ------------------------------- */

export function StationNine({ ctx, title, subtitle }: StationProps) {
  const saved = ctx.state.answers.nine_conditions;
  const [map, setMap] = useState<Record<string, string>>(() => (saved ? (saved.answer as Record<string, string>) : {}));
  const [result, setResult] = useState<ActivityResult | null>(saved ? { ...saved, needsReview: false } : null);
  const missing = ["الطهارة", "إزالة النجاسة", "استقبال القبلة", "النية"];
  const slots = ["2", "4", "6", "8"];
  const given: Record<string, string> = { "1": "الإسلام", "3": "التمييز", "5": "ستر العورة", "7": "دخول الوقت", "9": "النية" };
  const icons: Record<string, string> = {
    الإسلام: "🕌", الطهارة: "💧", التمييز: "🧒", "إزالة النجاسة": "🧼", "ستر العورة": "👕",
    العقل: "🧠", "دخول الوقت": "🕐", "استقبال القبلة": "🕋", النية: "💖",
  };

  const check = async () => {
    const r = await ctx.saveAnswer("nine_conditions", map);
    if (r) {
      setResult(r);
      if (r.isCorrect) { ctx.sounds.success(); ctx.celebrate(); } else ctx.sounds.error();
    }
  };
  const retry = () => {
    const next: Record<string, string> = {};
    for (const [k, v] of Object.entries(map)) if (result?.detail?.[k]) next[k] = v;
    setMap(next); setResult(null);
  };

  return (
    <StationShell
      emoji="🗂️"
      title={title}
      subtitle={subtitle}
      strategy="التصنيف والتعلم التعاوني"
      onSpeak={() => ctx.speak("للصلاة شروط تسعة لا تصح إلا بها. أكمل الخانات الفارغة")}
    >
      <Card className="bg-gradient-to-l from-indigo-50 to-white">
        <p className="text-lg font-semibold text-slate-700">
          أعاونَ مَجموعتي وأكمل: للصلاة شروطٌ تسعة لا تصح إلا بها. ضع الشرط المناسب في كل خانة فارغة.
        </p>
      </Card>

      <Card>
        <div className="grid gap-3 sm:grid-cols-3">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => {
            const slot = String(n);
            const givenLabel = given[slot];
            const filled = map[slot];
            const ok = result?.detail?.[slot];
            return (
              <div
                key={slot}
                className={cx(
                  "rounded-2xl border-2 p-3 text-center",
                  givenLabel
                    ? "border-turq-300 bg-turq-50"
                    : ok === true
                      ? "border-emerald-400 bg-emerald-50"
                      : ok === false
                        ? "border-rose-400 bg-rose-50"
                        : "border-dashed border-slate-300 bg-white",
                )}
              >
                <span className="mx-auto mb-1 grid h-7 w-7 place-items-center rounded-full bg-turq-600 text-xs font-black text-white">{n}</span>
                {givenLabel ? (
                  <p className="text-lg font-black text-turq-900">{icons[givenLabel]} {givenLabel}</p>
                ) : filled ? (
                  <p className="text-lg font-black text-slate-800">{icons[filled]} {filled}</p>
                ) : (
                  <p className="py-2 text-slate-400">………</p>
                )}
              </div>
            );
          })}
        </div>

        <h4 className="mb-2 mt-5 text-sm font-black text-slate-500">الشروط المتاحة (اسحب أو اضغط ثم اضغط الخانة):</h4>
        <div className="flex flex-wrap gap-2">
          {missing.map((m) => {
            const used = Object.values(map).includes(m);
            return (
              <button
                key={m}
                type="button"
                disabled={!!result || used}
                onClick={() => {
                  const free = slots.find((s) => !map[s]);
                  if (free) setMap({ ...map, [free]: m });
                }}
                className={cx(
                  "touch-target rounded-2xl border-2 px-4 py-2 text-lg font-bold transition-all",
                  used ? "border-slate-200 bg-slate-100 text-slate-400 line-through" : "border-turq-300 bg-white hover:border-turq-500",
                )}
              >
                {icons[m]} {m}
              </button>
            );
          })}
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-3">
          {!result ? (
            <>
              <Btn size="lg" onClick={check} disabled={Object.keys(map).length < slots.length || ctx.busy}>تحقق ✅</Btn>
              <Btn variant="secondary" onClick={() => setMap({})} disabled={ctx.busy}>🗑️ إعادة التوزيع</Btn>
            </>
          ) : (
            <>
              <ScoreBadge score={result.score} max={result.maxScore} />
              {result.isCorrect ? (
                <Feedback kind="correct">ممتاز! أكملت الشروط التسعة بشكل صحيح.</Feedback>
              ) : (
                <>
                  <Feedback kind="wrong">راجع الخانات ذات العلامة ✗ ثم حاول مرة أخرى.</Feedback>
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
