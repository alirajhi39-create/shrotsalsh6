import { useMemo, useState } from "react";
import {
  Award, Check, CheckCircle2, Compass, Download, Heart, Info, LocateFixed,
  MapPin, Navigation2, Printer, RotateCcw, Sparkles, Trophy, XCircle,
} from "lucide-react";
import { cities, conditions, finalQuestions, images } from "../data";
import { qiblaBearing, toArabicDigits } from "../prayerTimes";
import { Feedback } from "./Common";
import type { StationProps } from "./stationTypes";

export function Station7({ answers, save, complete }: StationProps) {
  type Saved = { checks: Record<string, boolean>; submitted: boolean };
  const initial = (answers.s7 || {}) as Partial<Saved>;
  const [state, setState] = useState<Saved>({ checks: initial.checks || {}, submitted: initial.submitted || false });
  const statements = [
    { id: "makkah", text: "تقع في مكة المكرمة.", correct: true },
    { id: "qibla", text: "قبلة المسلمين.", correct: true },
    { id: "madinah", text: "تقع في المدينة المنورة.", correct: false },
  ];
  const update = (next: Saved) => { setState(next); save("s7", next); };
  const allCorrect = statements.every(s => Boolean(state.checks[s.id]) === s.correct);
  const check = () => { update({ ...state, submitted: true }); if (allCorrect) complete(); };
  return (
    <div className="station-body">
      <div className="condition-heading"><span>الشرط الثامن</span><h3>استقبال القبلة</h3><p>قبلة المسلمين هي الكعبة المشرفة. نتجه إليها في صلاتنا أينما كنا.</p></div>
      <div className="kaaba-layout">
        <figure className="kaaba-photo"><img src={images.kaaba} alt="الكعبة المشرفة في المسجد الحرام وحولها المصلون" /><figcaption>الكعبة المشرفة — مكة المكرمة</figcaption></figure>
        <div className="kaaba-activity">
          <h3>ضع علامة أمام كل عبارة ترتبط بصورة الكعبة:</h3>
          {statements.map(item => {
            const chosen = Boolean(state.checks[item.id]);
            const correct = chosen === item.correct;
            return <label key={item.id} className={`check-statement ${state.submitted ? correct ? "statement-correct" : "statement-wrong" : ""}`}>
              <input type="checkbox" checked={chosen} onChange={e => update({ checks: { ...state.checks, [item.id]: e.target.checked }, submitted: false })} />
              <span className="custom-checkbox">{chosen && <Check size={16} />}</span>
              <span>{item.text}</span>
              {state.submitted && (correct ? <CheckCircle2 size={19} /> : <XCircle size={19} />)}
            </label>;
          })}
          <button className="primary-button" onClick={check}><CheckCircle2 size={18} /> تحقق من العبارات</button>
          {state.submitted && (allCorrect ? <Feedback type="success">صحيح! الكعبة في مكة المكرمة وهي قبلة المسلمين.</Feedback> : <Feedback type="error">راجع العبارات: العبارة التي تجعل الكعبة في المدينة غير صحيحة، لذلك تُترك بلا علامة.</Feedback>)}
        </div>
      </div>
      <div className="golden-rule"><Compass size={27} /><strong>لا تصح الصلاة مع القدرة دون استقبال القبلة.</strong></div>
    </div>
  );
}

export function Station8({ answers, save, complete }: StationProps) {
  type Saved = { cityId: string; viewed: string[]; custom: { lat: number; lng: number } | null };
  const initial = (answers.s8 || {}) as Partial<Saved>;
  const [state, setState] = useState<Saved>({ cityId: initial.cityId || "riyadh", viewed: initial.viewed || ["riyadh"], custom: initial.custom || null });
  const [locationStatus, setLocationStatus] = useState("");
  const city = cities.find(c => c.id === state.cityId) || cities[2];
  const point = state.custom || city;
  const bearing = useMemo(() => qiblaBearing(point.lat, point.lng), [point.lat, point.lng]);
  const directions = ["الشمال", "الشمال الشرقي", "الشرق", "الجنوب الشرقي", "الجنوب", "الجنوب الغربي", "الغرب", "الشمال الغربي"];
  const direction = directions[Math.round(bearing / 45) % 8];
  const update = (next: Saved) => {
    setState(next); save("s8", next);
    if (next.viewed.length >= 3) complete();
  };
  const selectCity = (id: string) => {
    const viewed = state.viewed.includes(id) ? state.viewed : [...state.viewed, id];
    update({ cityId: id, viewed, custom: null });
    setLocationStatus("");
  };
  const locate = () => {
    if (!navigator.geolocation) return setLocationStatus("تحديد الموقع غير مدعوم في هذا المتصفح.");
    setLocationStatus("جارٍ تحديد موقعك…");
    navigator.geolocation.getCurrentPosition(position => {
      const custom = { lat: position.coords.latitude, lng: position.coords.longitude };
      const viewed = state.viewed.includes("موقعي") ? state.viewed : [...state.viewed, "موقعي"];
      update({ ...state, custom, viewed });
      setLocationStatus("تم حساب اتجاه القبلة من موقعك الحالي.");
    }, () => setLocationStatus("تعذر الوصول إلى الموقع. يمكنك متابعة النشاط باختيار مدينة."), { enableHighAccuracy: true, timeout: 10000 });
  };
  return (
    <div className="station-body">
      <div className="activity-heading"><span>تجربة</span><div><h3>إلى أين أتجه؟</h3><p>اختر ثلاث مدن ولاحظ كيف يتغير اتجاه الكعبة. الحساب يعتمد إحداثيات الموقع والكعبة.</p></div></div>
      <div className="qibla-layout">
        <div className="qibla-compass-wrap">
          <div className="qibla-compass" aria-label={`اتجاه القبلة ${bearing} درجة من الشمال`}>
            <span className="north">ش</span><span className="east">شر</span><span className="south">ج</span><span className="west">غ</span>
            <div className="compass-ring" />
            <div className="qibla-needle" style={{ transform: `translate(-50%, -88%) rotate(${bearing}deg)` }}><Navigation2 size={54} fill="currentColor" /></div>
            <div className="kaaba-center"><span>الكعبة</span></div>
          </div>
          <div className="bearing-result"><small>اتجاه القبلة من {state.custom ? "موقعك" : city.name}</small><strong>{toArabicDigits(bearing)}°</strong><span>باتجاه {direction} بالتقريب</span></div>
        </div>
        <div className="qibla-controls">
          <label className="field-label" htmlFor="qibla-city">أنا موجود في</label>
          <div className="input-with-icon"><MapPin size={19} /><select id="qibla-city" value={state.cityId} onChange={e => selectCity(e.target.value)}>{cities.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}</select></div>
          <button className="secondary-button" onClick={locate}><LocateFixed size={19} /> استخدم موقعي الحالي</button>
          {locationStatus && <p className="location-status" role="status">{locationStatus}</p>}
          <div className="qibla-fact"><Info size={20} /><p>زاوية القبلة تُقاس من الشمال الجغرافي باتجاه عقارب الساعة. عند الصلاة الفعلية استعن ببوصلة أو تطبيق موثوق وتحقق من الاتجاه.</p></div>
          <div className="city-view-progress"><span>مدن استكشفتها</span><div>{state.viewed.map(id => <b key={id}>{id === "موقعي" ? id : cities.find(c => c.id === id)?.name}</b>)}</div><small>{Math.min(state.viewed.length, 3)} من ٣ لإكمال التجربة</small></div>
        </div>
      </div>
      {state.viewed.length >= 3 && <Feedback type="success">أكملت التجربة! لاحظت أن اتجاه القبلة يتغير بتغير موقع المصلي، لكن الوجهة واحدة: الكعبة المشرفة.</Feedback>}
    </div>
  );
}

export function Station9({ answers, save, complete }: StationProps) {
  type Saved = { selections: Record<number, number>; checked: boolean };
  const initial = (answers.s9 || {}) as Partial<Saved>;
  const [state, setState] = useState<Saved>({ selections: initial.selections || {}, checked: initial.checked || false });
  const questions = [
    { q: "من حديث «إنما الأعمال بالنيات» نستنتج شرطًا من شروط الصلاة، ما هو؟", options: ["دخول الوقت", "ستر العورة", "النية"], answer: 2, why: "العمل الصالح يحتاج إلى قصد ونية، والصلاة من أعظم الأعمال." },
    { q: "أين محل نية الصلاة؟", options: ["القلب", "اللسان بصوت مرتفع", "دفتر الملاحظات"], answer: 0, why: "النية قصد القلب، ولا ننطق بها." },
    { q: "أي موقف يعبّر عن النية الصحيحة؟", options: ["وقف سعد وقصد بقلبه أن ما سيؤديه صلاة الظهر", "انشغل سعد بالكلام ولم يقصد الصلاة", "قلد سعد الحركات دون أن يدري ما يفعل"], answer: 0, why: "أن يقصد المصلي بقلبه الصلاة التي سيؤديها." },
  ];
  const score = questions.reduce((sum, q, i) => sum + (state.selections[i] === q.answer ? 1 : 0), 0);
  const select = (qi: number, option: number) => { const next = { selections: { ...state.selections, [qi]: option }, checked: false }; setState(next); save("s9", next); };
  const check = () => { const next = { ...state, checked: true }; setState(next); save("s9", next); if (score === 3) complete(); };
  return (
    <div className="station-body">
      <div className="condition-heading"><span>الشرط التاسع</span><h3>النية</h3><p>اقرأ الحديث الشريف واستنتج، ثم طبّق فهمك على المواقف.</p></div>
      <blockquote className="hadith-card"><Heart size={29} /><p>قال النبي ﷺ: <strong>«إِنَّمَا الأَعْمَالُ بِالنِّيَّاتِ»</strong></p><cite>أخرجه البخاري (١)، ومسلم (١٩٠٧)</cite></blockquote>
      <div className="intention-rule"><Sparkles size={22} /><strong>لا ننطق بالنية، النية محلها القلب.</strong></div>
      <div className="question-stack">
        {questions.map((question, qi) => <article className="question-card" key={question.q}>
          <h3><span>{qi + 1}</span>{question.q}</h3>
          <div className="option-list">{question.options.map((option, oi) => {
            const selected = state.selections[qi] === oi;
            const correct = state.checked && oi === question.answer;
            const wrong = state.checked && selected && oi !== question.answer;
            return <button key={option} className={`${selected ? "selected" : ""} ${correct ? "correct" : ""} ${wrong ? "wrong" : ""}`} onClick={() => select(qi, oi)}><span className="radio-dot" />{option}{correct && <Check size={17} />}{wrong && <XCircle size={17} />}</button>;
          })}</div>
          {state.checked && state.selections[qi] !== undefined && <p className="question-explanation">{question.why}</p>}
        </article>)}
      </div>
      <button className="primary-button" onClick={check} disabled={Object.keys(state.selections).length < 3}><CheckCircle2 size={18} /> تحقق من استنتاجي</button>
      {state.checked && (score === 3 ? <Feedback type="success">استنتاج صحيح وتطبيق موفق! النية قصد القلب، وهي الشرط التاسع.</Feedback> : <Feedback type="info">أجبت عن {score} من ٣ إجابات صحيحة. اقرأ التفسير وصحح اختياراتك.</Feedback>)}
    </div>
  );
}

export function Station10({ answers, save, complete }: StationProps) {
  type Saved = { values: Record<number, string>; checked: boolean };
  const initial = (answers.s10 || {}) as Partial<Saved>;
  const [state, setState] = useState<Saved>({ values: initial.values || {}, checked: initial.checked || false });
  const given = new Set([1, 3, 5, 7, 9]);
  const missing = [2, 4, 6, 8];
  const options = ["العقل", "الطهارة", "إزالة النجاسة", "استقبال القبلة", "الخشوع", "صلاة الجماعة"];
  const correctCount = missing.filter(i => state.values[i] === conditions[i - 1]).length;
  const update = (index: number, value: string) => { const next = { values: { ...state.values, [index]: value }, checked: false }; setState(next); save("s10", next); };
  const check = () => { const next = { ...state, checked: true }; setState(next); save("s10", next); if (correctCount === 4) complete(); };
  return (
    <div className="station-body">
      <div className="activity-heading"><span>نشاط ٢</span><div><h3>أتعاون مع مجموعتي وأكمل</h3><p>للصلاة شروط تسعة لا تصح إلا بها. أكمل البطاقات الفارغة بالشرط المناسب.</p></div></div>
      <div className="conditions-map">
        {conditions.map((condition, index) => {
          const number = index + 1;
          const fixed = given.has(number);
          const correct = state.values[number] === condition;
          return <div className={`condition-slot ${fixed ? "fixed" : ""}`} key={condition}>
            <span className="condition-slot-number">{toArabicDigits(number)}</span>
            {fixed ? <strong>{condition}</strong> : <select aria-label={`الشرط ${number}`} className={`text-input ${state.checked && state.values[number] ? correct ? "input-correct" : "input-wrong" : ""}`} value={state.values[number] || ""} onChange={e => update(number, e.target.value)}><option value="">اكتشف الشرط…</option>{options.map(o => <option key={o}>{o}</option>)}</select>}
          </div>;
        })}
      </div>
      <div className="conditions-summary"><div><Clock3Icon /><span>السابع</span><strong>دخول الوقت</strong></div><div><Compass size={21} /><span>الثامن</span><strong>استقبال القبلة</strong></div><div><Heart size={21} /><span>التاسع</span><strong>النية</strong></div></div>
      <div className="activity-actions"><button className="primary-button" onClick={check} disabled={missing.some(i => !state.values[i])}><CheckCircle2 size={18} /> تحقق من الخريطة</button><span>{correctCount} من ٤ بطاقات صحيحة</span></div>
      {state.checked && (correctCount === 4 ? <Feedback type="success">اكتملت الخريطة! هذه هي شروط الصلاة التسعة التي جمعتها في الدرسين.</Feedback> : <Feedback type="error">بعض البطاقات تحتاج إلى تعديل. تذكر ترتيب ما تعلمته في الدرس الأول.</Feedback>)}
    </div>
  );
}

function Clock3Icon() { return <span className="small-clock-icon">٧</span>; }

export function Station11({ answers, save, complete }: StationProps) {
  type Saved = { selections: Record<number, number>; checked: boolean; best: number };
  const initial = (answers.s11 || {}) as Partial<Saved>;
  const [state, setState] = useState<Saved>({ selections: initial.selections || {}, checked: initial.checked || false, best: initial.best || 0 });
  const questions = [
    { q: "صلى سعد عكس القبلة. ما التصحيح؟", options: ["يستقبل الكعبة ثم يصلي", "يستمر عكس القبلة", "يصلي بعد العشاء فقط"], answer: 0, why: "التصحيح: يستقبل القبلة، لأن استقبالها شرط لصحة الصلاة مع القدرة." },
    { q: "صلى محمد المغرب قبل غروب الشمس. ما التصحيح؟", options: ["يصلي قبل الغروب دائمًا", "ينتظر غروب الشمس ثم يصلي", "يؤخرها إلى الفجر"], answer: 1, why: "التصحيح: ينتظر دخول الوقت بغروب الشمس ثم يصلي المغرب." },
    { q: "عددت شروط الصلاة تسعة، فإذا صليت دون تحقيق أحدها فهل صلاتي صحيحة؟", options: ["نعم، يكفي تحقيق شرط واحد", "لا، لا تصح الصلاة إلا بتحقيق شروطها", "نعم، إذا كانت الصلاة في البيت"], answer: 1, why: "شروط الصلاة التسعة لا تصح الصلاة إلا بها." },
    { q: "ما الوقت الذي تدل عليه الصورة؟", options: ["طلوع الشمس", "زوال الشمس", "مغيب الشفق الأحمر", "طلوع الفجر الثاني"], answer: 2, why: "اختفت الحمرة من الأفق وحل ظلام الليل؛ فهذا يدل على مغيب الشفق الأحمر.", image: true },
    { q: "ما الصلاة التي تؤدى في هذا الوقت؟", options: ["الفجر", "الظهر", "المغرب", "العشاء"], answer: 3, why: "يدخل وقت العشاء بمغيب الشفق الأحمر.", image: true },
  ];
  const score = questions.reduce((sum, q, i) => sum + (state.selections[i] === q.answer ? 1 : 0), 0);
  const select = (qi: number, oi: number) => { const next = { ...state, selections: { ...state.selections, [qi]: oi }, checked: false }; setState(next); save("s11", next); };
  const check = () => {
    const best = Math.max(state.best, score);
    const next = { ...state, checked: true, best }; setState(next); save("s11", next);
    if (score === questions.length) complete();
  };
  const reset = () => { const next = { ...state, selections: {}, checked: false }; setState(next); save("s11", next); };
  return (
    <div className="station-body assessment-body">
      <div className="assessment-banner"><span>التقويم</span><div><h3>صحّح الخطأ وفسّر الصورة</h3><p>خمس إجابات صحيحة تدل على إتقانك للدرس. أفضل نتيجة لك: {state.best}/٥</p></div></div>
      <div className="question-stack">
        {questions.map((question, qi) => <article className={`question-card ${question.image ? "image-question" : ""}`} key={question.q}>
          {question.image && qi === 3 && <img src={images.isha} alt="سماء داكنة بعد مغيب الشفق الأحمر" />}
          <div>
            <h3><span>{qi + 1}</span>{question.q}</h3>
            <div className="option-list">{question.options.map((option, oi) => {
              const selected = state.selections[qi] === oi;
              const correct = state.checked && oi === question.answer;
              const wrong = state.checked && selected && oi !== question.answer;
              return <button key={option} className={`${selected ? "selected" : ""} ${correct ? "correct" : ""} ${wrong ? "wrong" : ""}`} onClick={() => select(qi, oi)}><span className="radio-dot" />{option}{correct && <Check size={17} />}{wrong && <XCircle size={17} />}</button>;
            })}</div>
            {state.checked && state.selections[qi] !== undefined && <p className="question-explanation">{question.why}</p>}
          </div>
        </article>)}
      </div>
      <div className="activity-actions"><button className="primary-button" onClick={check} disabled={Object.keys(state.selections).length < 5}><CheckCircle2 size={18} /> اعرض نتيجتي</button>{state.checked && <button className="secondary-button" onClick={reset}><RotateCcw size={17} /> محاولة جديدة</button>}</div>
      {state.checked && <div className={`assessment-score ${score === 5 ? "perfect" : ""}`}><strong>{toArabicDigits(score)}/٥</strong><div><h3>{score === 5 ? "إتقان كامل، أحسنت!" : score >= 3 ? "تقدم جيد، راجع أخطاءك" : "نحتاج إلى مراجعة الدرس"}</h3><p>{score === 5 ? "صححت المواقف وفسرت الصورة بنجاح." : "اقرأ التفسير أسفل كل سؤال، ثم أعد المحاولة لتحصل على ٥/٥."}</p></div></div>}
    </div>
  );
}

export function Station12({ answers, save, complete, studentName, className }: StationProps) {
  type Saved = { selections: Record<number, number>; step: number; finished: boolean; best: number };
  const initial = (answers.s12 || {}) as Partial<Saved>;
  const [state, setState] = useState<Saved>({ selections: initial.selections || {}, step: initial.step || 0, finished: initial.finished || false, best: initial.best || 0 });
  const score = finalQuestions.reduce((sum, q, i) => sum + (state.selections[i] === q.answer ? 1 : 0), 0);
  const passed = score >= 4;
  const step = Math.min(state.step, finalQuestions.length - 1);
  const question = finalQuestions[step];
  const selection = state.selections[step];
  const select = (oi: number) => { if (selection !== undefined) return; const next = { ...state, selections: { ...state.selections, [step]: oi } }; setState(next); save("s12", next); };
  const next = () => {
    if (selection === undefined) return;
    if (step < finalQuestions.length - 1) {
      const nextState = { ...state, step: step + 1 }; setState(nextState); save("s12", nextState);
    } else {
      const best = Math.max(state.best, score);
      const nextState = { ...state, finished: true, best }; setState(nextState); save("s12", nextState);
      if (passed) complete();
    }
  };
  const restart = () => { const next = { selections: {}, step: 0, finished: false, best: state.best }; setState(next); save("s12", next); };
  if (state.finished) return (
    <div className="station-body final-result">
      <div className={`result-medal ${passed ? "passed" : ""}`}><Trophy size={54} /></div>
      <span className="eyebrow">اكتمل التحدي</span>
      <h2>{passed ? `مبارك يا ${studentName || "بطلنا"}!` : "محاولة طيبة، ونستطيع التحسن!"}</h2>
      <p>نتيجتك {toArabicDigits(score)} من ٦ — أفضل نتيجة {toArabicDigits(Math.max(state.best, score))} من ٦</p>
      {!passed ? <>
        <Feedback type="info">تحتاج إلى ٤ إجابات صحيحة للحصول على الشهادة. راجع الأسئلة الخاطئة ثم أعد التحدي.</Feedback>
        <div className="review-list">{finalQuestions.map((q, i) => state.selections[i] !== q.answer && <div key={q.question}><XCircle size={19} /><p><strong>{q.question}</strong><span>{q.explanation}</span></p></div>)}</div>
        <button className="primary-button" onClick={restart}><RotateCcw size={18} /> أعد التحدي</button>
      </> : <>
        <div className="certificate" id="certificate">
          <div className="certificate-border">
            <div className="certificate-logo"><Award size={38} /></div>
            <span>العروس الابتدائية — الدراسات الإسلامية</span>
            <h2>شهادة بطل شروط الصلاة</h2>
            <p>تشهد المدرسة بأن الطالب</p>
            <h3>{studentName || "بطل شروط الصلاة"}</h3>
            <p>من الفصل <strong>{className}</strong> قد أتم رحلة «شروط الصلاة (٢)»<br />وأظهر فهمًا لأوقات الصلوات واستقبال القبلة والنية</p>
            <div className="certificate-score"><span>نتيجة التحدي</span><strong>{toArabicDigits(score)}/٦</strong></div>
            <div className="certificate-footer"><span>الدرس الثامن — الصف الثالث الابتدائي</span><span>{new Intl.DateTimeFormat("ar-SA", { dateStyle: "long" }).format(new Date())}</span></div>
          </div>
        </div>
        <div className="certificate-actions"><button className="primary-button" onClick={() => window.print()}><Printer size={19} /> اطبع الشهادة</button><button className="secondary-button" onClick={() => window.print()}><Download size={18} /> احفظها PDF</button><button className="secondary-button" onClick={restart}><RotateCcw size={17} /> العب مرة أخرى</button></div>
      </>}
    </div>
  );
  return (
    <div className="station-body final-game">
      <div className="game-top"><div className="game-trophy"><Trophy size={31} /></div><div><span>التحدي الأخير</span><h3>ست إجابات تفتح شهادة البطل</h3></div><strong>{toArabicDigits(step + 1)}/٦</strong></div>
      <div className="game-progress"><span style={{ width: `${(step + 1) / finalQuestions.length * 100}%` }} /></div>
      <article className="game-question">
        <span className="eyebrow">السؤال {toArabicDigits(step + 1)}</span>
        <h2>{question.question}</h2>
        <div className="game-options">{question.options.map((option, oi) => {
          const chosen = selection === oi;
          const revealed = selection !== undefined;
          const correct = revealed && oi === question.answer;
          const wrong = revealed && chosen && oi !== question.answer;
          return <button key={option} disabled={revealed} className={`${chosen ? "selected" : ""} ${correct ? "correct" : ""} ${wrong ? "wrong" : ""}`} onClick={() => select(oi)}><span>{String.fromCharCode(65 + oi)}</span>{option}{correct && <CheckCircle2 size={21} />}{wrong && <XCircle size={21} />}</button>;
        })}</div>
        {selection !== undefined && <div className={`game-feedback ${selection === question.answer ? "good" : "bad"}`}>{selection === question.answer ? <CheckCircle2 size={22} /> : <Info size={22} />}<p><strong>{selection === question.answer ? "إجابة صحيحة!" : "ليست الإجابة المطلوبة."}</strong>{question.explanation}</p></div>}
      </article>
      <button className="primary-button game-next" onClick={next} disabled={selection === undefined}>{step === finalQuestions.length - 1 ? "اعرض النتيجة والشهادة" : "السؤال التالي"}</button>
    </div>
  );
}
