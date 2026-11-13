"use client";

import { useMemo, useState } from "react";
import { LIVE_QUESTION_BANK } from "@/lib/content";
import { Btn, Confetti, cx, stableShuffle, useSounds } from "@/components/lesson/ui";

export default function BoardGame() {
  const [round, setRound] = useState(0);
  const [team, setTeam] = useState<0 | 1>(0);
  const [scores, setScores] = useState([0, 0]);
  const [names, setNames] = useState(["الفريق الأخضر", "الفريق البرتقالي"]);
  const [idx, setIdx] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [confetti, setConfetti] = useState(false);
  const sounds = useSounds(true);
  const deck = useMemo(() => stableShuffle(LIVE_QUESTION_BANK, `board:${round}`).slice(0, 12), [round]);
  const card = deck[idx];
  const finished = idx >= deck.length;
  const choose = (choice: number) => {
    if (!card || picked !== null) return;
    setPicked(choice);
    const ok = choice === card.correct;
    ok ? sounds.success() : sounds.error();
    if (ok) setScores((s) => s.map((v, i) => i === team ? v + 1 : v));
    setTimeout(() => { setPicked(null); setIdx((i) => i + 1); setTeam((t) => t === 0 ? 1 : 0); if (idx + 1 >= deck.length) { setConfetti(true); sounds.celebration(); setTimeout(() => setConfetti(false), 3500); } }, 1400);
  };
  const reset = () => { setRound((r) => r + 1); setIdx(0); setScores([0, 0]); setTeam(0); setPicked(null); };
  return <div className="space-y-5"><Confetti show={confetti}/><div className="grid gap-3 sm:grid-cols-2">{names.map((n, i) => <div key={i} className={cx("flex items-center gap-3 rounded-3xl border-4 bg-white p-4", team === i && !finished ? "border-turq-400" : "border-transparent")}><input value={n} onChange={(e) => setNames((t) => t.map((x, j) => j === i ? e.target.value : x))} className="w-full bg-transparent text-xl font-black focus:outline-none"/><span className="text-4xl font-black">{scores[i]}</span></div>)}</div>
    {!finished && card ? <div className="rounded-3xl bg-white p-6 shadow-xl"><p className="text-center text-sm font-bold text-slate-500">السؤال {idx + 1} من {deck.length} — دور {names[team]}</p><p className="my-4 rounded-3xl bg-turq-50 p-6 text-center text-3xl font-black text-turq-900">{card.prompt}</p><div className="grid gap-3 md:grid-cols-3">{card.choices.map((choice, i) => <button key={i} onClick={() => choose(i)} disabled={picked !== null} className={cx("rounded-3xl border-4 p-5 text-2xl font-black", picked === null ? "border-turq-200 bg-white" : i === card.correct ? "border-emerald-500 bg-emerald-50" : picked === i ? "border-rose-400 bg-rose-50" : "opacity-50")}>{choice}</button>)}</div></div> : <div className="rounded-3xl bg-white p-8 text-center shadow"><div className="text-6xl">🏆</div><h3 className="mt-2 text-3xl font-black">{scores[0] === scores[1] ? "تعادل رائع!" : `الفائز: ${scores[0] > scores[1] ? names[0] : names[1]}`}</h3><Btn className="mt-4" onClick={reset}>جولة جديدة</Btn></div>}
    <Btn variant="secondary" onClick={reset}>🔄 إعادة الجولة</Btn>
  </div>;
}
