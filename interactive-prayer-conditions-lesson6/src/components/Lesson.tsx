import { useEffect, useState } from "react";
import {
  ArrowLeft, ArrowRight, Check, CheckCircle2, Home, List, Menu, Presentation,
  Volume2, VolumeX, X,
} from "lucide-react";
import { stations } from "../data";
import type { StudentProgress } from "../types";
import { CheckMark, SiteHeader, StationIcon } from "./Common";
import { Station1, Station2, Station3, Station4, Station5, Station6 } from "./StationsA";
import { Station7, Station8, Station9, Station10, Station11, Station12 } from "./StationsB";
import type { StationProps } from "./stationTypes";

export default function Lesson({
  progress, navigate, onStation, onSave, onComplete, onHome,
}: {
  progress: StudentProgress;
  navigate: (path: string) => void;
  onStation: (id: number) => void;
  onSave: (key: string, value: unknown) => void;
  onComplete: (id: number) => void;
  onHome: () => void;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [boardMode, setBoardMode] = useState(() => {
    const saved = localStorage.getItem("shurut-salat-board-mode");
    return saved === null ? window.matchMedia("(min-width: 1100px)").matches : saved === "true";
  });
  const current = stations.find(s => s.id === progress.currentStation) || stations[0];
  const percent = Math.round(progress.completed.length / 12 * 100);
  const props: StationProps = {
    answers: progress.answers, save: onSave, complete: () => onComplete(current.id),
    studentName: progress.studentName, className: progress.className,
  };

  useEffect(() => {
    localStorage.setItem("shurut-salat-board-mode", String(boardMode));
  }, [boardMode]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setMenuOpen(false);
    setSpeaking(false);
    if ("speechSynthesis" in window) window.speechSynthesis.cancel();
    document.title = `${current.title} | شروط الصلاة (٢)`;
  }, [current.id, current.title]);

  const speak = () => {
    if (!("speechSynthesis" in window)) return;
    if (speaking) { window.speechSynthesis.cancel(); setSpeaking(false); return; }
    const utterance = new SpeechSynthesisUtterance(`${current.title}. ${current.subtitle}`);
    utterance.lang = "ar-SA"; utterance.rate = 0.9;
    utterance.onend = () => setSpeaking(false);
    utterance.onerror = () => setSpeaking(false);
    window.speechSynthesis.speak(utterance); setSpeaking(true);
  };

  const content = () => {
    switch (current.id) {
      case 1: return <Station1 {...props} />;
      case 2: return <Station2 {...props} />;
      case 3: return <Station3 {...props} />;
      case 4: return <Station4 {...props} />;
      case 5: return <Station5 {...props} />;
      case 6: return <Station6 {...props} />;
      case 7: return <Station7 {...props} />;
      case 8: return <Station8 {...props} />;
      case 9: return <Station9 {...props} />;
      case 10: return <Station10 {...props} />;
      case 11: return <Station11 {...props} />;
      case 12: return <Station12 {...props} />;
      default: return null;
    }
  };

  return (
    <div className={`lesson-page ${boardMode ? "board-mode" : ""}`}>
      <SiteHeader navigate={navigate} inLesson />
      <div className="lesson-progress-bar"><span style={{ width: `${percent}%` }} /></div>
      <nav className="lesson-toolbar" aria-label="أدوات الدرس">
        <div className="shell lesson-toolbar-inner">
          <button className="toolbar-home" onClick={onHome}><Home size={18} /><span>صفحة الرحلة</span></button>
          <div className="lesson-progress-copy"><span>تقدمك في الدرس</span><strong>{progress.completed.length} من ١٢ محطة</strong></div>
          <div className="toolbar-actions">
            <button className={`toolbar-board ${boardMode ? "active" : ""}`} aria-pressed={boardMode} onClick={() => setBoardMode(value => !value)} title="تكبير الخطوط وتحسين الوضوح للعرض على السبورة"><Presentation size={19} /><span>{boardMode ? "العرض العادي" : "وضع السبورة"}</span></button>
            <button className="toolbar-menu" onClick={() => setMenuOpen(true)}><List size={19} /><span>كل المحطات</span><Menu size={17} /></button>
          </div>
        </div>
      </nav>

      {menuOpen && <div className="drawer-backdrop" onClick={() => setMenuOpen(false)} />}
      <aside className={`station-drawer ${menuOpen ? "open" : ""}`} aria-hidden={!menuOpen}>
        <div className="drawer-heading"><div><span className="eyebrow">شروط الصلاة (٢)</span><h2>محطات الرحلة</h2></div><button className="icon-button" onClick={() => setMenuOpen(false)} aria-label="إغلاق القائمة"><X size={21} /></button></div>
        <div className="drawer-stations">{stations.map(s => <button key={s.id} className={`${s.id === current.id ? "active" : ""} ${progress.completed.includes(s.id) ? "complete" : ""}`} onClick={() => onStation(s.id)}><span className="drawer-icon" style={{ color: s.color }}><StationIcon name={s.icon} size={20} /></span><span><small>المحطة {s.id}</small><strong>{s.title}</strong></span><CheckMark show={progress.completed.includes(s.id)} /></button>)}</div>
        <div className="drawer-student"><span>{progress.studentName.slice(0, 1)}</span><div><strong>{progress.studentName}</strong><small>الفصل {progress.className}</small></div><b>{percent}٪</b></div>
      </aside>

      <main className="lesson-main shell">
        <section className="station-sheet" key={current.id}>
          <header className="station-sheet-header">
            <div className="station-title-icon" style={{ color: current.color, background: `${current.color}15` }}><StationIcon name={current.icon} size={30} /></div>
            <div className="station-title-copy"><span className="eyebrow">المحطة {current.id} من ١٢ <i /> {current.subtitle}</span><h1>{current.title}</h1></div>
            <div className="station-header-actions">
              {progress.completed.includes(current.id) && <span className="completed-pill"><CheckCircle2 size={17} /> مكتملة</span>}
              <button className="icon-button" onClick={speak} title={speaking ? "إيقاف الاستماع" : "استمع لعنوان المحطة"} aria-label={speaking ? "إيقاف الاستماع" : "استمع لعنوان المحطة"}>{speaking ? <VolumeX size={20} /> : <Volume2 size={20} />}</button>
            </div>
          </header>
          {content()}
        </section>

        <div className="lesson-navigation">
          <button className="secondary-button" disabled={current.id === 1} onClick={() => onStation(current.id - 1)}><ArrowRight size={19} /><span>المحطة السابقة</span></button>
          <div className="navigation-dots" aria-label="التنقل السريع بين المحطات">{stations.map(s => <button key={s.id} className={`${s.id === current.id ? "active" : ""} ${progress.completed.includes(s.id) ? "complete" : ""}`} onClick={() => onStation(s.id)} aria-label={`المحطة ${s.id}: ${s.title}`}>{progress.completed.includes(s.id) ? <Check size={11} /> : s.id}</button>)}</div>
          {current.id < 12 ? <button className="primary-button" onClick={() => onStation(current.id + 1)}><span>المحطة التالية</span><ArrowLeft size={19} /></button> : <button className="primary-button" onClick={onHome}><span>العودة إلى الرحلة</span><Home size={18} /></button>}
        </div>
        <p className="autosave-note"><CheckCircle2 size={15} /> تُحفظ إجاباتك وتقدمك تلقائيًا على هذا الجهاز</p>
      </main>
    </div>
  );
}
