"use client";

import { useMemo, useState } from "react";
import { CONDITIONS, EVIDENCE, PRAYER_TIMES, QIBLA_STATEMENTS, SLIDES, STATION_QUESTIONS, type ActivityResult, type LessonChoice, type PrayerTime } from "@/lib/content";
import type { JourneyCtx } from "./Journey";
import { Btn, Card, Choices, Feedback, ScoreBadge, StationShell, cx, stableShuffle } from "./ui";

export type StationProps = { ctx: JourneyCtx; title: string; subtitle: string };
const rec = (v: unknown): Record<string, unknown> => v && typeof v === "object" && !Array.isArray(v) ? v as Record<string, unknown> : {};

export function TimeScene({ scene, className = "h-40 w-full" }: { scene: PrayerTime["scene"]; className?: string }) {
  const id = `sky-${scene}`;
  const palettes = { dawn: ["#172554", "#fb923c"], sun: ["#38bdf8", "#fef3c7"], shadow: ["#0ea5e9", "#e0f2fe"], sunset: ["#312e81", "#f97316"], night: ["#020617", "#1e1b4b"] } as const;
  const [top, bottom] = palettes[scene];
  return <svg viewBox="0 0 320 160" className={cx("rounded-3xl shadow-inner", className)} role="img" aria-label={`مشهد ${scene}`}>
    <defs><linearGradient id={id} x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={top}/><stop offset="100%" stopColor={bottom}/></linearGradient></defs>
    <rect width="320" height="160" fill={`url(#${id})`} rx="20"/>
    {scene === "night" ? <><circle cx="250" cy="42" r="18" fill="#fef9c3"/><circle cx="258" cy="36" r="18" fill={top}/>{[30,70,110,150,190,280].map((x,i)=><circle key={x} cx={x} cy={20+(i%3)*18} r="2" fill="#fff"/>)}</> : <circle cx={scene === "sunset" ? 160 : scene === "dawn" ? 160 : 235} cy={scene === "sunset" || scene === "dawn" ? 105 : 45} r={scene === "shadow" ? 24 : 30} fill={scene === "sunset" ? "#fb923c" : "#fde047"}/>}
    <path d="M0 125 Q80 105 160 125 T320 120 V160 H0Z" fill={scene === "night" ? "#0f172a" : "#d6a96c"} opacity=".9"/>
    {scene === "shadow" && <><rect x="150" y="55" width="6" height="70" fill="#334155"/><path d="M156 125 L235 140 L150 130Z" fill="#334155" opacity=".55"/><text x="160" y="150" textAnchor="middle" fontSize="11" fill="#17343a" fontWeight="700">الظل</text></>}
    {scene === "sunset" && <path d="M0 100 H320" stroke="#fecdd3" strokeWidth="3" opacity=".6"/>}
  </svg>;
}

function Evidence({ kind }: { kind: "ayah" | "hadith" }) {
  const e = kind === "ayah" ? EVIDENCE.ayah : EVIDENCE.hadith;
  return <Card className="border-2 border-amber-200 bg-gradient-to-l from-amber-50 to-white text-center"><p className="text-sm font-bold text-amber-800">{kind === "ayah" ? "قال الله تعالى:" : EVIDENCE.hadith.intro}</p><p className="quran my-3 text-3xl font-bold leading-loose text-turq-900">{e.text}</p><p className="text-xs font-bold text-slate-500">{e.source}</p></Card>;
}

function ChoiceQuestion({ q, value, onChange, revealed, seed, disabled }: { q: LessonChoice; value: number | null; onChange: (i:number)=>void; revealed: boolean; seed: string; disabled?: boolean }) {
  return <Card><p className="mb-3 flex items-start gap-3 text-xl font-black leading-relaxed text-turq-900"><span className="text-3xl">{q.emoji ?? "💡"}</span>{q.prompt}</p><Choices choices={q.choices} value={value} onChange={onChange} correct={q.correct} revealed={revealed} disabled={disabled} shuffleSeed={seed} />{revealed && <div className="mt-3"><Feedback kind={value === q.correct ? "correct" : "info"}>{q.explanation}</Feedback></div>}</Card>;
}

export function ChoiceStation({ ctx, title, subtitle, activityKey, stationKey, children }: StationProps & { activityKey: string; stationKey: string; children?: React.ReactNode }) {
  const questions = STATION_QUESTIONS[stationKey] ?? [];
  const saved = ctx.state.answers[activityKey];
  const [answers, setAnswers] = useState<Record<string, number>>(() => saved ? rec(saved.answer) as Record<string, number> : {});
  const [result, setResult] = useState<ActivityResult | null>(saved ? { ...saved, needsReview: false } : null);
  const meta = SLIDES.find((s) => s.key === stationKey);
  const check = async () => { const r = await ctx.saveAnswer(activityKey, answers); if (r) { setResult(r); r.isCorrect ? ctx.sounds.success() : ctx.sounds.error(); if (r.isCorrect) ctx.celebrate(); } };
  return <StationShell slideKey={stationKey} emoji={meta?.emoji ?? "📘"} title={title} subtitle={subtitle} strategy={meta?.strategy} onSpeak={() => ctx.speak(title)}>
    {children}
    {questions.map((q) => <ChoiceQuestion key={q.key} q={q} value={answers[q.key] ?? null} onChange={(i) => setAnswers({ ...answers, [q.key]: i })} revealed={!!result} disabled={!!result} seed={`${ctx.state.student.id}:${stationKey}:${q.key}`} />)}
    <Card className="flex flex-wrap items-center gap-3">{!result ? <Btn size="lg" onClick={check} disabled={ctx.busy || questions.some((q) => answers[q.key] === undefined)}>تحقق من الإجابات ✅</Btn> : <><ScoreBadge score={result.score} max={result.maxScore}/><Feedback kind={result.isCorrect ? "correct" : "info"}>{result.isCorrect ? "أحسنت! إجابات صحيحة." : "راجع التوضيح، ثم يمكنك إعادة المحاولة."}</Feedback>{!result.isCorrect && <Btn variant="warning" onClick={() => { const keep: Record<string,number> = {}; for (const q of questions) if (result.detail?.[q.key]) keep[q.key] = answers[q.key]; setAnswers(keep); setResult(null); }}>🔁 حاول مرة أخرى</Btn>}</>}</Card>
  </StationShell>;
}

export function StationIntro(p: StationProps) { return <ChoiceStation {...p} stationKey="intro" activityKey="intro_predict"><Evidence kind="ayah"/><Card className="bg-turq-50"><p className="text-lg font-bold text-turq-900">في هذا الدرس نتعلم الشروط السابع والثامن والتاسع: دخول الوقت، استقبال القبلة، والنية، ثم نراجع شروط الصلاة التسعة.</p></Card></ChoiceStation>; }

export function StationTimes(p: StationProps) {
  const [open, setOpen] = useState<string | null>(null);
  return <ChoiceStation {...p} stationKey="times" activityKey="times_discover"><div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{PRAYER_TIMES.map((t) => <button key={t.key} type="button" onClick={() => setOpen(open === t.key ? null : t.key)} className="rounded-3xl bg-white p-4 text-start shadow transition hover:-translate-y-1"><TimeScene scene={t.scene} className="h-28 w-full"/><h3 className="mt-3 text-2xl font-black text-turq-900">{t.icon} صلاة {t.name}</h3><p className="mt-2 font-bold text-turq-700">من: {t.start}</p><p className="font-bold text-brand-orange">إلى: {t.end}</p>{open === t.key && t.note && <p className="mt-2 rounded-xl bg-sky-50 p-2 text-sm font-semibold text-sky-900">{t.note}</p>}</button>)}</div></ChoiceStation>;
}
export function StationFajr(p: StationProps) { return <ChoiceStation {...p} stationKey="fajr" activityKey="fajr_cases"><Card><TimeScene scene="dawn"/><p className="mt-3 text-xl font-black text-turq-900">وقت الفجر: من طلوع الفجر الثاني إلى طلوع الشمس.</p></Card></ChoiceStation>; }
export function StationDay(p: StationProps) { return <ChoiceStation {...p} stationKey="day" activityKey="day_cases"><div className="grid gap-4 md:grid-cols-2">{PRAYER_TIMES.filter(t=>["dhuhr","asr"].includes(t.key)).map(t=><Card key={t.key}><TimeScene scene={t.scene}/><h3 className="mt-3 text-xl font-black">صلاة {t.name}</h3><p className="font-bold">من {t.start} إلى {t.end}.</p>{t.note && <p className="mt-2 text-sm text-slate-600">{t.note}</p>}</Card>)}</div></ChoiceStation>; }
export function StationNight(p: StationProps) { return <ChoiceStation {...p} stationKey="night" activityKey="night_cases"><div className="grid gap-4 md:grid-cols-2">{PRAYER_TIMES.filter(t=>["maghrib","isha"].includes(t.key)).map(t=><Card key={t.key}><TimeScene scene={t.scene}/><h3 className="mt-3 text-xl font-black">صلاة {t.name}</h3><p className="font-bold">من {t.start} إلى {t.end}.</p>{t.note && <p className="mt-2 rounded-xl bg-amber-50 p-2 text-sm font-bold text-amber-900">{t.note}</p>}</Card>)}</div></ChoiceStation>; }
export function StationTimetable(p: StationProps) {
  const t = p.ctx.state.settings.prayerTimetable ?? {};
  const rows = [["الفجر", t.fajr], ["الشروق", t.sunrise], ["الظهر", t.dhuhr], ["العصر", t.asr], ["المغرب", t.maghrib], ["العشاء", t.isha]];
  return <ChoiceStation {...p} stationKey="timetable" activityKey="timetable_read"><Card className="bg-sky-50"><h3 className="text-xl font-black text-turq-900">🗓️ نشاط 1 في الكتاب: تقويم منطقتي</h3><p className="mt-2 text-lg font-semibold">أحدد بداية صلاة العشاء في منطقتي من تقويم الصلاة المحلي، وأتذكر أن نهايتها نصف الليل المحسوب من غروب الشمس إلى طلوع الفجر الثاني.</p>{t.location || t.isha ? <div className="mt-4 rounded-2xl bg-white p-4 shadow-sm"><p className="font-black text-turq-800">{t.location || "منطقتي"} {t.date ? `— ${t.date}` : ""}</p><div className="mt-3 grid gap-2 sm:grid-cols-3">{rows.map(([name, time]) => <div key={name} className={cx("rounded-xl p-3 text-center", name === "العشاء" ? "bg-turq-100 ring-2 ring-turq-400" : "bg-slate-50")}><p className="text-sm font-bold text-slate-500">{name}</p><p className="text-xl font-black text-turq-900">{time || "—"}</p></div>)}</div></div> : <p className="mt-3 rounded-xl bg-amber-50 p-3 font-bold text-amber-800">سيضيف المعلم تقويم المنطقة من الإعدادات؛ استخدم تقويم منطقتك الموثوق للمناقشة.</p>}</Card></ChoiceStation>;
}
export function StationQibla(p: StationProps) { return <ChoiceStation {...p} stationKey="qibla" activityKey="qibla_check"><Card className="text-center"><div className="text-7xl">🕋</div><h3 className="mt-2 text-2xl font-black text-turq-900">الشرط الثامن: استقبال القبلة</h3><div className="mt-4 grid gap-2">{QIBLA_STATEMENTS.map(s=><p key={s.key} className="rounded-2xl bg-slate-50 p-3 text-lg font-bold">{s.correct ? "✓" : "✗"} {s.text}</p>)}</div><p className="mt-4 rounded-2xl bg-rose-50 p-3 text-xl font-black text-rose-800">لا تصح الصلاة دون استقبال القبلة.</p></Card></ChoiceStation>; }
export function StationIntention(p: StationProps) { return <ChoiceStation {...p} stationKey="intention" activityKey="intention_cases"><Evidence kind="hadith"/><Card className="text-center"><div className="text-7xl">💚</div><h3 className="mt-2 text-2xl font-black text-turq-900">الشرط التاسع: النية</h3><p className="mt-3 rounded-2xl bg-rose-50 p-4 text-2xl font-black text-rose-800">لا تنطق بالنية، النية محلها القلب.</p></Card></ChoiceStation>; }
export function StationClassify(p: StationProps) { return <ChoiceStation {...p} stationKey="classify" activityKey="conditions_classify"><Card><h3 className="mb-3 text-xl font-black text-turq-900">🧩 شروط الصلاة التسعة</h3><div className="grid gap-2 sm:grid-cols-3">{CONDITIONS.map(c=><div key={c.key} className="rounded-2xl border-2 border-turq-100 bg-turq-50 p-3 text-center"><span className="text-3xl">{c.icon}</span><p className="font-black text-turq-900">{c.order}. {c.name}</p><p className="text-xs font-semibold text-slate-600">{c.text}</p></div>)}</div></Card></ChoiceStation>; }
