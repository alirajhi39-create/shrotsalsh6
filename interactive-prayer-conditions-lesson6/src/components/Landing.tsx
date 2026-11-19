import { useRef, useState } from "react";
import {
  ArrowLeft, BookOpenCheck, Clock3, Compass, Heart, Monitor,
  Save, TabletSmartphone, Play, RotateCcw, UserRound,
} from "lucide-react";
import { stations, images } from "../data";
import type { StudentProgress } from "../types";
import { CheckMark, SiteHeader, StationIcon } from "./Common";

export default function Landing({
  progress, onStart, onOpenStation, navigate,
}: {
  progress: StudentProgress;
  onStart: (name: string, className: string) => void;
  onOpenStation: (id: number) => void;
  navigate: (path: string) => void;
}) {
  const [name, setName] = useState(progress.studentName);
  const [className, setClassName] = useState(progress.className || "٣/١");
  const [error, setError] = useState("");
  const formRef = useRef<HTMLDivElement>(null);

  const start = () => {
    if (name.trim().length < 2) {
      setError("اكتب اسمك أولًا لنحفظ تقدمك ونضعه في الشهادة.");
      return;
    }
    setError("");
    onStart(name.trim(), className);
  };

  const openStation = (id: number) => {
    if (!progress.started) {
      setError("ابدأ رحلتك بكتابة الاسم، ثم اختر أي محطة.");
      formRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    onOpenStation(id);
  };

  return (
    <div className="landing-page">
      <SiteHeader navigate={navigate} />
      <main>
        <section className="landing-hero shell" aria-labelledby="lesson-title">
          <div className="hero-copy">
            <div className="lesson-badge"><BookOpenCheck size={17} /> الدرس ٨ <i /> الصف الثالث الابتدائي <i /> ص ٦٦–٧٠</div>
            <h1 id="lesson-title">شروط الصلاة <span>(٢)</span></h1>
            <p className="hero-lead">رحلة تعليمية تفاعلية من <strong>١٢ محطة</strong>: اكتشف أوقات الصلوات، حرّك الشمس، حدّد القبلة، وفكّر في النية… ثم احصل على شهادة «بطل شروط الصلاة»!</p>
            <div className="topic-chips" aria-label="موضوعات الدرس">
              <span><Clock3 size={17} /> دخول الوقت</span>
              <span><Compass size={17} /> استقبال القبلة</span>
              <span><Heart size={17} /> النية</span>
            </div>
            <div className="hero-teacher-card">
              <img src={images.hero} alt="طالب يصلي داخل المسجد" />
              <div>
                <span className="tiny-label">نتعلم لنصلي صلاة صحيحة</span>
                <p>«إِنَّ الصَّلَاةَ كَانَتْ عَلَى الْمُؤْمِنِينَ كِتَابًا مَوْقُوتًا»</p>
                <small>المعلم: علي عبدالله راجحي — العروس الابتدائية</small>
              </div>
            </div>
          </div>

          <div className="start-column" ref={formRef}>
            <div className="start-card">
              <div className="start-card-heading">
                <span className="user-icon"><UserRound size={24} /></span>
                <div>
                  <h2>{progress.started ? `أهلًا ${progress.studentName}` : "ابدأ رحلتك التعليمية"}</h2>
                  <p>{progress.started ? `أكملت ${progress.completed.length} من ١٢ محطة` : "جهّز اسمك وابدأ التعلم خطوة بخطوة"}</p>
                </div>
              </div>
              <label className="field-label" htmlFor="student-name">اسم الطالب</label>
              <input id="student-name" className="text-input" value={name} onChange={e => setName(e.target.value)} placeholder="اكتب اسمك هنا" autoComplete="name" />
              <label className="field-label" htmlFor="student-class">الفصل</label>
              <select id="student-class" className="text-input" value={className} onChange={e => setClassName(e.target.value)}>
                {["٣/١", "٣/٢", "٣/٣", "٣/٤", "٣/٥", "أخرى"].map(c => <option key={c}>{c}</option>)}
              </select>
              {error && <p className="form-error" role="alert">{error}</p>}
              <button className="primary-button start-button" onClick={start}>
                {progress.started ? <RotateCcw size={19} /> : <Play size={19} fill="currentColor" />}
                {progress.started ? "تابع من حيث توقفت" : "ابدأ الرحلة الآن"}
                <ArrowLeft size={19} />
              </button>
              {progress.started && <p className="resume-note">ستنتقل إلى المحطة {progress.currentStation} ويمكنك اختيار أي محطة أخرى.</p>}
            </div>
            <div className="device-benefits">
              <span><TabletSmartphone size={19} /> يعمل على الجوال والأجهزة اللوحية</span>
              <span><Monitor size={19} /> مناسب للسبورة الذكية</span>
              <span><Save size={19} /> يحفظ تقدمك تلقائيًا</span>
            </div>
          </div>
        </section>

        <section className="stations-section shell" aria-labelledby="stations-title">
          <div className="section-heading-row">
            <div>
              <span className="eyebrow">خريطة التعلم</span>
              <h2 id="stations-title">محطات الرحلة</h2>
            </div>
            {progress.started && <div className="mini-progress"><span style={{ width: `${progress.completed.length / 12 * 100}%` }} /><b>{Math.round(progress.completed.length / 12 * 100)}٪</b></div>}
          </div>
          <div className="station-grid">
            {stations.map(station => {
              const complete = progress.completed.includes(station.id);
              return (
                <button key={station.id} className={`station-card ${complete ? "is-complete" : ""}`} onClick={() => openStation(station.id)}>
                  <span className="station-icon" style={{ backgroundColor: `${station.color}18`, color: station.color }}><StationIcon name={station.icon} /></span>
                  <span className="station-card-copy">
                    <span className="station-number">المحطة {station.id} <CheckMark show={complete} /></span>
                    <strong>{station.title}</strong>
                    <small>{station.subtitle}</small>
                  </span>
                  <ArrowLeft size={18} className="station-card-arrow" />
                </button>
              );
            })}
          </div>
        </section>
      </main>
    </div>
  );
}
