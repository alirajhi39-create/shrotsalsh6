import { useMemo, useState } from "react";
import { ArrowRight, Download, GraduationCap, LockKeyhole, LogOut, Printer, Trophy, UserRound } from "lucide-react";
import { stations } from "../data";
import type { StudentProgress } from "../types";
import { Brand, CheckMark } from "./Common";
import BoardQuiz from "./BoardQuiz";

const TEACHER_PASSWORD = "139613";

function formatDate(value?: string) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return new Intl.DateTimeFormat("ar-SA", { dateStyle: "medium", timeStyle: "short" }).format(date);
}

export default function Teacher({ progress, navigate }: { progress: StudentProgress; navigate: (path: string) => void }) {
  const [loggedIn, setLoggedIn] = useState(false);
  const [quizOpen, setQuizOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const percent = useMemo(() => Math.round(progress.completed.length / 12 * 100), [progress.completed]);
  const assessmentBest = Number((progress.answers.s11 as { best?: number } | undefined)?.best || 0);
  const challengeBest = Number((progress.answers.s12 as { best?: number } | undefined)?.best || 0);
  const printedAt = new Intl.DateTimeFormat("ar-SA", { dateStyle: "full", timeStyle: "short" }).format(new Date());

  const submit = () => {
    if (password === TEACHER_PASSWORD) {
      setLoggedIn(true);
      setError("");
      setPassword("");
    } else {
      setError("كلمة المرور غير صحيحة. حاول مرة أخرى.");
    }
  };

  const exportReport = () => {
    const data = { lesson: "شروط الصلاة (٢)", exportedAt: new Date().toISOString(), student: progress };
    const url = URL.createObjectURL(new Blob([JSON.stringify(data, null, 2)], { type: "application/json" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = "تقرير-شروط-الصلاة-2.json";
    link.click();
    URL.revokeObjectURL(url);
  };

  const printPdfReport = () => {
    const previousTitle = document.title;
    const student = progress.studentName.trim() || "طالب";
    document.title = `تقرير-${student}-شروط-الصلاة-2`;
    const restoreTitle = () => { document.title = previousTitle; };
    window.addEventListener("afterprint", restoreTitle, { once: true });
    window.print();
  };

  return (
    <div className="teacher-page">
      <header className="site-header"><div className="site-header-inner"><Brand compact /><button className="text-button" onClick={() => navigate("/")}><ArrowRight size={18} /> العودة للدرس</button></div></header>
      <main className="shell teacher-main">
        {!loggedIn ? (
          <section className="teacher-login-card">
            <span className="teacher-login-icon"><GraduationCap size={34} /></span>
            <span className="eyebrow">منطقة المعلم</span>
            <h1>دخول المعلم</h1>
            <p>أدخل كلمة المرور للوصول إلى لوحة متابعة الطالب وتقاريره.</p>
            <label className="field-label" htmlFor="teacher-password">كلمة المرور</label>
            <div className="input-with-icon"><LockKeyhole size={19} /><input id="teacher-password" type="password" inputMode="numeric" autoComplete="current-password" value={password} onChange={e => setPassword(e.target.value)} placeholder="كلمة المرور" onKeyDown={e => e.key === "Enter" && submit()} /></div>
            {error && <p className="form-error" role="alert">{error}</p>}
            <button className="primary-button" onClick={submit}>دخول لوحة المتابعة</button>
            <small className="local-note">بيانات الطالب محفوظة على هذا الجهاز فقط، ولا تُرسل إلى خادم خارجي.</small>
          </section>
        ) : quizOpen ? (
          <BoardQuiz onClose={() => setQuizOpen(false)} />
        ) : (
          <section className="dashboard">
            <div className="dashboard-heading">
              <div><span className="eyebrow">لوحة المعلم</span><h1>متابعة درس شروط الصلاة (٢)</h1><p>بيانات الطالب المحفوظة على هذا الجهاز</p></div>
              <div className="dashboard-actions"><button className="primary-button quiz-launch-button" onClick={() => setQuizOpen(true)}><Trophy size={19} /> مسابقة السبورة</button><button className="secondary-button pdf-button" onClick={printPdfReport}><Printer size={18} /> طباعة تقرير PDF</button><button className="secondary-button" onClick={exportReport}><Download size={18} /> تصدير البيانات</button><button className="icon-button" title="تسجيل الخروج" onClick={() => setLoggedIn(false)}><LogOut size={19} /></button></div>
            </div>
            <div className="student-summary">
              <div className="student-avatar"><UserRound size={30} /></div>
              <div><small>الطالب</small><h2>{progress.studentName || "لم يبدأ طالب بعد"}</h2><p>{progress.started ? `الفصل ${progress.className}` : "افتح صفحة الدرس وسجّل اسم الطالب لبدء المتابعة."}</p></div>
              <div className="summary-stat"><strong>{progress.completed.length}<small>/١٢</small></strong><span>محطة مكتملة</span></div>
              <div className="summary-stat"><strong>{percent}٪</strong><span>نسبة الإنجاز</span></div>
            </div>
            <div className="dashboard-progress"><span style={{ width: `${percent}%` }} /></div>
            <h2 className="dashboard-list-title">تفاصيل المحطات</h2>
            <div className="dashboard-stations">
              {stations.map(s => <div key={s.id}><span className="dashboard-station-icon" style={{ color: s.color, background: `${s.color}15` }}>{s.id}</span><p><strong>{s.title}</strong><small>{progress.completed.includes(s.id) ? "اكتملت المحطة" : s.id === progress.currentStation && progress.started ? "المحطة الحالية" : "لم تكتمل بعد"}</small></p><CheckMark show={progress.completed.includes(s.id)} /></div>)}
            </div>

            <article className="teacher-print-report" dir="rtl">
              <header className="print-report-header">
                <div className="print-report-school"><span><GraduationCap size={28} /></span><div><strong>العروس الابتدائية</strong><small>الدراسات الإسلامية — الفقه</small></div></div>
                <div><h1>تقرير أداء الطالب</h1><p>درس شروط الصلاة (٢) — الدرس الثامن</p></div>
              </header>
              <section className="print-student-details">
                <div><span>اسم الطالب</span><strong>{progress.studentName || "لم يُسجل بعد"}</strong></div>
                <div><span>الفصل</span><strong>{progress.started ? progress.className : "—"}</strong></div>
                <div><span>نسبة الإنجاز</span><strong>{percent}٪</strong></div>
                <div><span>المحطات المكتملة</span><strong>{progress.completed.length} من ١٢</strong></div>
                <div><span>بداية التعلم</span><strong>{formatDate(progress.createdAt)}</strong></div>
                <div><span>آخر نشاط</span><strong>{formatDate(progress.lastVisited)}</strong></div>
              </section>
              <section className="print-result-cards">
                <div><span>التقويم الختامي</span><strong>{assessmentBest} / ٥</strong><small>أفضل نتيجة محفوظة</small></div>
                <div><span>تحدي بطل شروط الصلاة</span><strong>{challengeBest} / ٦</strong><small>أفضل نتيجة محفوظة</small></div>
                <div><span>المحطة الحالية</span><strong>{progress.started ? progress.currentStation : "—"}</strong><small>{progress.started ? stations[progress.currentStation - 1]?.title : "لم تبدأ الرحلة"}</small></div>
              </section>
              <h2 className="print-section-title">تفصيل إنجاز محطات الرحلة</h2>
              <table className="print-stations-table">
                <thead><tr><th>المحطة</th><th>عنوان النشاط</th><th>الحالة</th></tr></thead>
                <tbody>{stations.map(station => {
                  const complete = progress.completed.includes(station.id);
                  const current = progress.started && station.id === progress.currentStation && !complete;
                  return <tr key={station.id}><td>{station.id}</td><td>{station.title}</td><td className={complete ? "print-complete" : ""}>{complete ? "مكتملة" : current ? "قيد التعلم" : "لم تكتمل"}</td></tr>;
                })}</tbody>
              </table>
              <div className="print-teacher-notes"><strong>ملاحظات المعلم:</strong><span /><span /><span /></div>
              <footer className="print-report-footer"><span>توقيع المعلم: ........................................</span><span>أُنشئ التقرير: {printedAt}</span></footer>
            </article>
          </section>
        )}
      </main>
    </div>
  );
}
