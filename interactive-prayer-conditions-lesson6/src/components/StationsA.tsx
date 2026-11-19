import { useMemo, useState } from "react";
import {
  ArrowLeft, BookOpen, CalendarDays, Check, CheckCircle2, Clock3, Compass,
  Heart, Info, Lightbulb, Moon, RotateCcw, Sun, Sunrise, Sunset, XCircle,
} from "lucide-react";
import { cities, images, prayers, type PrayerKey } from "../data";
import {
  calculateSchedule, dateLabel, displayTime, hoursToTime, normalizeTime,
  prayerAtMinute, toArabicDigits,
} from "../prayerTimes";
import { Feedback } from "./Common";
import type { StationProps } from "./stationTypes";

export function Station1({ answers, save, complete }: StationProps) {
  type State = { choices: Record<string, boolean>; note: string };
  const initial = (answers.s1 || {}) as Partial<State>;
  const [state, setState] = useState<State>({ choices: initial.choices || {}, note: initial.note || "" });
  const items = [
    { id: "maghrib", text: "غربت الشمس، ثم أقام سعد صلاة المغرب. هل صلّى في وقتها؟", correct: true, why: "وقت المغرب يبدأ بغروب الشمس." },
    { id: "before", text: "صلى محمد المغرب قبل غروب الشمس بدقائق. هل دخل الوقت؟", correct: false, why: "لا تُقدَّم الصلاة على وقتها؛ ينبغي انتظار الغروب." },
    { id: "isha", text: "غاب الشفق الأحمر، فقامت سارة لتصلي العشاء. هل دخل الوقت؟", correct: true, why: "مغيب الشفق الأحمر هو بداية وقت العشاء." },
  ];
  const update = (next: State) => { setState(next); save("s1", next); };
  const choose = (id: string, value: boolean) => {
    const next = { ...state, choices: { ...state.choices, [id]: value } };
    update(next);
    if (items.every(item => next.choices[item.id] === item.correct)) complete();
  };
  const answered = Object.keys(state.choices).length;
  return (
    <div className="station-body">
      <div className="thinking-prompt"><Lightbulb size={25} /><div><h3>فكّر قبل أن تكتشف</h3><p>لكل صلاة بداية ونهاية. هل تستطيع الحكم على هذه المواقف بما تعرفه الآن؟</p></div><span>{answered}/٣</span></div>
      <div className="scenario-list">
        {items.map((item, index) => {
          const choice = state.choices[item.id];
          const answeredItem = typeof choice === "boolean";
          const correct = answeredItem && choice === item.correct;
          return <article className={`scenario-card ${answeredItem ? correct ? "answer-correct" : "answer-wrong" : ""}`} key={item.id}>
            <span className="scenario-index">{index + 1}</span>
            <p>{item.text}</p>
            <div className="binary-actions">
              <button className={choice === true ? "selected" : ""} onClick={() => choose(item.id, true)}><Check size={17} /> نعم</button>
              <button className={choice === false ? "selected" : ""} onClick={() => choose(item.id, false)}><XCircle size={17} /> لا</button>
            </div>
            {answeredItem && <div className="inline-explanation">{correct ? <CheckCircle2 size={18} /> : <Info size={18} />}<span>{correct ? "أحسنت! " : "راجع الفكرة: "}{item.why}</span></div>}
          </article>;
        })}
      </div>
      <label className="field-label" htmlFor="s1-note">سؤال أود أن أكتشف إجابته في هذا الدرس</label>
      <textarea id="s1-note" className="text-area" value={state.note} onChange={e => update({ ...state, note: e.target.value })} placeholder="مثال: كيف أعرف أن الشفق الأحمر قد غاب؟" rows={3} />
      {items.every(item => state.choices[item.id] === item.correct) && <Feedback type="success">إجاباتك صحيحة! ستكتشف في المحطة التالية ثلاثة شروط جديدة للصلاة.</Feedback>}
    </div>
  );
}

export function Station2({ answers, save, complete }: StationProps) {
  const [opened, setOpened] = useState<number[]>((answers.s2 as number[]) || []);
  const cards = [
    { id: 7, title: "دخول الوقت", short: "أُصلي بعد أن يدخل وقت الصلاة.", detail: "لكل صلاة وقت محدد لا تصح قبله. سنتعلم بداية أوقات الصلوات الخمس ونهايتها.", icon: Clock3, color: "#1baaa4" },
    { id: 8, title: "استقبال القبلة", short: "أتجه نحو الكعبة المشرفة.", detail: "الكعبة في مكة المكرمة هي قبلة المسلمين، ولا تصح الصلاة مع القدرة دون استقبالها.", icon: Compass, color: "#257f9e" },
    { id: 9, title: "النية", short: "أقصد الصلاة بقلبي.", detail: "قال النبي ﷺ: «إنما الأعمال بالنيات». النية محلها القلب ولا ننطق بها.", icon: Heart, color: "#c66f7a" },
  ];
  const open = (id: number) => {
    const next = opened.includes(id) ? opened.filter(v => v !== id) : [...opened, id];
    setOpened(next); save("s2", next);
    if (cards.every(card => next.includes(card.id))) complete();
  };
  return (
    <div className="station-body">
      <blockquote className="quran-card">
        <span className="quran-ornament">﴿</span>
        <p>إِنَّ الصَّلَاةَ كَانَتْ عَلَى الْمُؤْمِنِينَ كِتَابًا مَوْقُوتًا</p>
        <span className="quran-ornament">﴾</span>
        <cite>سورة النساء: ١٠٣</cite>
      </blockquote>
      <div className="evidence-question"><BookOpen size={23} /><p>يتضح من هذه الآية الشرط السابع من شروط الصلاة التي لا تصح إلا به. اقلب البطاقات واكتشف الشروط الثلاثة في درسنا.</p></div>
      <div className="discovery-grid">
        {cards.map(card => {
          const isOpen = opened.includes(card.id);
          const Icon = card.icon;
          return <button key={card.id} className={`discovery-card ${isOpen ? "is-open" : ""}`} onClick={() => open(card.id)} style={{ "--card-color": card.color } as React.CSSProperties} aria-expanded={isOpen}>
            <span className="condition-number">الشرط {toArabicDigits(card.id)}</span>
            <span className="discovery-icon"><Icon size={32} /></span>
            <strong>{card.title}</strong>
            {!isOpen ? <><p>{card.short}</p><small>اضغط لتكتشف أكثر <ArrowLeft size={15} /></small></> : <p className="discovery-detail">{card.detail}</p>}
          </button>;
        })}
      </div>
      {opened.length === 3 && <Feedback type="success">اكتشفت الشروط: دخول الوقت، واستقبال القبلة، والنية. أصبحت جاهزًا لتفاصيل كل شرط.</Feedback>}
    </div>
  );
}

const endImages: Record<PrayerKey, string> = {
  fajr: images.sunrise, dhuhr: images.asr, asr: images.twilight, maghrib: images.twilight, isha: images.isha,
};

export function Station3({ answers, save, complete }: StationProps) {
  type Saved = { selected: PrayerKey; viewed: PrayerKey[] };
  const initial = (answers.s3 || {}) as Partial<Saved>;
  const [selected, setSelected] = useState<PrayerKey>(initial.selected || "fajr");
  const [viewed, setViewed] = useState<PrayerKey[]>(initial.viewed || (initial.selected ? [initial.selected] : ["fajr"]));
  const active = prayers.find(p => p.key === selected)!;
  const select = (key: PrayerKey) => {
    const nextViewed = viewed.includes(key) ? viewed : [...viewed, key];
    setSelected(key); setViewed(nextViewed); save("s3", { selected: key, viewed: nextViewed });
    if (nextViewed.length === prayers.length) complete();
  };
  return (
    <div className="station-body">
      <div className="condition-heading"><span>الشرط السابع</span><h3>دخول الوقت</h3><p>استكشف كل صلاة، ولاحظ العلامة التي تبدأ عندها والعلامة التي ينتهي عندها وقتها.</p></div>
      <div className="prayer-tabs" role="tablist" aria-label="الصلوات الخمس">
        {prayers.map((prayer, index) => <button role="tab" aria-selected={selected === prayer.key} className={`${selected === prayer.key ? "active" : ""} ${viewed.includes(prayer.key) ? "viewed" : ""}`} key={prayer.key} onClick={() => select(prayer.key)}><span>{index + 1}</span>{prayer.name}{viewed.includes(prayer.key) && <Check size={14} />}</button>)}
      </div>
      <div className="prayer-spread" style={{ "--prayer-color": active.color } as React.CSSProperties}>
        <div className="prayer-side-label"><span>وَقْتُ</span><strong>صَلَاةِ<br />{active.name}</strong></div>
        <article className="time-image-card">
          <h4>{active.start}</h4><img src={active.image} alt={`${active.alt} — بداية وقت ${active.name}`} /><span className="image-label"><Sunrise size={17} /> البداية</span>
        </article>
        <article className="time-image-card">
          <h4>{active.end}</h4><img src={endImages[active.key]} alt={`مشهد نهاية وقت صلاة ${active.name}`} /><span className="image-label"><Sunset size={17} /> النهاية</span>
        </article>
      </div>
      <div className="prayer-hint"><Info size={20} /><p><strong>معلومة تساعدك:</strong> {active.hint}</p></div>
      <div className="footnotes">
        <p>١. زوال الشمس: الوقت الذي تكون فيه الشمس في كبد السماء ثم تميل من جهة الشرق إلى الغرب.</p>
        <p>٢. الشفق الأحمر: الضوء الأحمر الذي يظهر في جهة الغرب بعد غروب الشمس.</p>
        <p>٣. نصف الليل في الدرس: منتصف المدة من غروب الشمس إلى طلوع الفجر الثاني، وليس الساعة الثانية عشرة ليلًا دائمًا.</p>
      </div>
      <p className="view-progress">استكشفت {viewed.length} من ٥ صلوات {viewed.length === 5 && "— اكتملت الجولة!"}</p>
    </div>
  );
}

export function Station4({ answers, save, complete }: StationProps) {
  type Saved = { minute: number; cityId: string; date: string; score: number; guess: string; checked: boolean };
  const today = new Date().toISOString().slice(0, 10);
  const initial = (answers.s4 || {}) as Partial<Saved>;
  const [state, setState] = useState<Saved>({ minute: initial.minute ?? 760, cityId: initial.cityId || "riyadh", date: initial.date || today, score: initial.score || 0, guess: initial.guess || "", checked: initial.checked || false });
  const city = cities.find(c => c.id === state.cityId) || cities[2];
  const schedule = useMemo(() => calculateSchedule(state.date, city), [state.date, city]);
  const current = prayerAtMinute(state.minute, schedule);
  const update = (patch: Partial<Saved>) => { const next = { ...state, ...patch }; setState(next); save("s4", next); };
  const guess = (key: string) => {
    const correct = key === current.key;
    const nextScore = correct && !state.checked ? Math.min(3, state.score + 1) : state.score;
    update({ guess: key, checked: true, score: nextScore });
    if (nextScore >= 3) complete();
  };
  const newTime = () => {
    const keys: PrayerKey[] = ["fajr", "dhuhr", "asr", "maghrib", "isha"];
    const nextKey = keys[state.score % keys.length];
    update({ minute: Math.round(schedule[nextKey] * 60) + 20, guess: "", checked: false });
  };
  const dayRatio = Math.max(0, Math.min(1, (state.minute / 60 - schedule.sunrise) / Math.max(1, schedule.maghrib - schedule.sunrise)));
  const isDay = state.minute / 60 >= schedule.sunrise && state.minute / 60 <= schedule.maghrib;
  return (
    <div className="station-body">
      <div className="lab-controls">
        <label>المدينة<select className="text-input" value={state.cityId} onChange={e => update({ cityId: e.target.value, checked: false, guess: "" })}>{cities.map(c => <option value={c.id} key={c.id}>{c.name}</option>)}</select></label>
        <label>التاريخ<input className="text-input" type="date" value={state.date} onChange={e => update({ date: e.target.value, checked: false, guess: "" })} /></label>
      </div>
      <div className={`sky-lab ${isDay ? "day" : "night"}`} style={{ "--sun-x": `${10 + dayRatio * 80}%`, "--sun-y": `${75 - Math.sin(dayRatio * Math.PI) * 58}%` } as React.CSSProperties}>
        <div className="sky-stars" />
        <div className="sky-orb">{isDay ? <Sun size={42} /> : <Moon size={35} />}</div>
        <div className="sky-land" />
        <div className="sky-clock"><small>الوقت الآن في المختبر</small><strong>{toArabicDigits(hoursToTime(state.minute / 60))}</strong></div>
      </div>
      <div className="time-slider-wrap">
        <input aria-label="حرّك وقت اليوم" className="time-slider" type="range" min="0" max="1439" value={state.minute} onChange={e => update({ minute: Number(e.target.value), guess: "", checked: false })} />
        <div><span>١٢ ليلًا</span><span>الظهر</span><span>١١:٥٩ مساءً</span></div>
      </div>
      <div className="current-time-result"><Clock3 size={23} /><div><small>المشهد يدل على</small><h3>{current.name}</h3><p>{current.detail}</p></div></div>
      <div className="lab-quiz">
        <div className="lab-quiz-heading"><h3>ما الصلاة المرتبطة بهذا الوقت؟</h3><span>ثلاث إجابات صحيحة لإكمال المحطة: {state.score}/٣</span></div>
        <div className="answer-chips">{prayers.map(p => <button key={p.key} className={state.guess === p.key ? "selected" : ""} onClick={() => guess(p.key)}>{p.name}</button>)}</div>
        {state.checked && (state.guess === current.key ? <Feedback type="success">إجابة صحيحة! {current.detail}</Feedback> : <Feedback type="error">ليست {prayers.find(p => p.key === state.guess)?.name}. لاحظ المشهد: {current.detail}.</Feedback>)}
        {state.checked && state.guess === current.key && state.score < 3 && <button className="secondary-button" onClick={newTime}>جرّب وقتًا جديدًا <RotateCcw size={17} /></button>}
        {state.score >= 3 && <Feedback type="success">رائع! قرأت ثلاث علامات زمنية بنجاح وأكملت مختبر الشمس.</Feedback>}
      </div>
      <p className="calculation-note">الأوقات حساب فلكي تقريبي للتدريب؛ في الصلاة الفعلية نعتمد التقويم والتوقيت الرسميين للمنطقة.</p>
    </div>
  );
}

export function Station5({ answers, save, complete }: StationProps) {
  type Saved = { values: Record<string, { start: string; end: string }>; checked: boolean };
  const initial = (answers.s5 || {}) as Partial<Saved>;
  const [state, setState] = useState<Saved>({ values: initial.values || {}, checked: initial.checked || false });
  const starts = prayers.map(p => p.startShort);
  const ends = ["طلوع الشمس", "مصير ظل كل شيء مثله", "اصفرار الشمس", "غياب الشفق الأحمر", "نصف الليل"];
  const updateValue = (key: string, side: "start" | "end", value: string) => {
    const next = { values: { ...state.values, [key]: { start: state.values[key]?.start || "", end: state.values[key]?.end || "", [side]: value } }, checked: false };
    setState(next); save("s5", next);
  };
  const correctCount = prayers.reduce((sum, p) => sum + (state.values[p.key]?.start === p.startShort ? 1 : 0) + (state.values[p.key]?.end === ends[prayers.indexOf(p)] ? 1 : 0), 0);
  const check = () => {
    const next = { ...state, checked: true }; setState(next); save("s5", next);
    if (correctCount === 10) complete();
  };
  return (
    <div className="station-body">
      <div className="activity-heading"><span>نشاط ٣</span><div><h3>أحدّد أوقات الصلوات</h3><p>اختر بداية الوقت ونهايته لكل صلاة. يمكنك التصحيح ثم إعادة التحقق.</p></div></div>
      <div className="matching-table">
        <div className="matching-header"><span>الصلاة</span><span>من</span><span>إلى</span></div>
        {prayers.map((p, index) => {
          const row = state.values[p.key] || { start: "", end: "" };
          const startCorrect = row.start === p.startShort;
          const endCorrect = row.end === ends[index];
          return <div className="matching-row" key={p.key}>
            <strong><span>{index + 1}</span>وقت صلاة {p.name}</strong>
            <label><span className="mobile-only">من</span><select className={`text-input ${state.checked && row.start ? startCorrect ? "input-correct" : "input-wrong" : ""}`} value={row.start} onChange={e => updateValue(p.key, "start", e.target.value)}><option value="">اختر البداية</option>{starts.map(v => <option key={v}>{v}</option>)}</select>{state.checked && row.start && (startCorrect ? <CheckCircle2 className="validation-icon good" size={18} /> : <XCircle className="validation-icon bad" size={18} />)}</label>
            <label><span className="mobile-only">إلى</span><select className={`text-input ${state.checked && row.end ? endCorrect ? "input-correct" : "input-wrong" : ""}`} value={row.end} onChange={e => updateValue(p.key, "end", e.target.value)}><option value="">اختر النهاية</option>{ends.map(v => <option key={v}>{v}</option>)}</select>{state.checked && row.end && (endCorrect ? <CheckCircle2 className="validation-icon good" size={18} /> : <XCircle className="validation-icon bad" size={18} />)}</label>
          </div>;
        })}
      </div>
      <div className="activity-actions"><button className="primary-button" onClick={check}><CheckCircle2 size={19} /> تحقق من إجاباتي</button><span>{correctCount} من ١٠ اختيارات صحيحة</span></div>
      {state.checked && (correctCount === 10 ? <Feedback type="success">ممتاز! ربطت الصلوات الخمس ببداياتها ونهاياتها كما وردت في الدرس.</Feedback> : <Feedback type="info">راجع الاختيارات المعلّمة بالأحمر. تذكّر: نهاية وقت صلاة قد تكون بداية الوقت الذي يليها.</Feedback>)}
    </div>
  );
}

export function Station6({ answers, save, complete }: StationProps) {
  type Saved = { cityId: string; date: string; start: string; end: string; checked: boolean };
  const today = new Date().toISOString().slice(0, 10);
  const initial = (answers.s6 || {}) as Partial<Saved>;
  const [state, setState] = useState<Saved>({ cityId: initial.cityId || "makkah", date: initial.date || today, start: initial.start || "", end: initial.end || "", checked: initial.checked || false });
  const city = cities.find(c => c.id === state.cityId) || cities[0];
  const schedule = useMemo(() => calculateSchedule(state.date, city), [state.date, city]);
  const update = (patch: Partial<Saved>) => { const next = { ...state, ...patch }; setState(next); save("s6", next); };
  const startCorrect = state.start !== "" && Math.abs(normalizeTime(state.start) - normalizeTime(hoursToTime(schedule.isha))) <= 1;
  const endCorrect = state.end !== "" && Math.abs(normalizeTime(state.end) - normalizeTime(hoursToTime(schedule.midnight))) <= 1;
  const check = () => { update({ checked: true }); if (startCorrect && endCorrect) complete(); };
  const times = [
    { key: "fajr", label: "الفجر", value: schedule.fajr }, { key: "sunrise", label: "الشروق", value: schedule.sunrise },
    { key: "dhuhr", label: "الظهر", value: schedule.dhuhr }, { key: "asr", label: "العصر", value: schedule.asr },
    { key: "maghrib", label: "المغرب", value: schedule.maghrib }, { key: "isha", label: "العشاء", value: schedule.isha },
  ];
  return (
    <div className="station-body">
      <div className="activity-heading"><span>نشاط ١</span><div><h3>أحدّد بداية وقت العشاء ونهايته</h3><p>اختر مدينتك وتاريخك، واستخرج الوقت من التقويم الظاهر ثم اكتب الإجابتين.</p></div></div>
      <div className="calendar-activity">
        <div className="calendar-panel">
          <div className="calendar-panel-head"><CalendarDays size={24} /><div><strong>تقويم الصلوات</strong><span>{city.name} — {dateLabel(state.date)}</span></div></div>
          <div className="calendar-controls"><select aria-label="اختر المدينة" className="text-input" value={state.cityId} onChange={e => update({ cityId: e.target.value, checked: false })}>{cities.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}</select><input aria-label="اختر التاريخ" className="text-input" type="date" value={state.date} onChange={e => update({ date: e.target.value, checked: false })} /></div>
          <div className="calendar-times">{times.map(t => <div className={t.key === "isha" ? "highlight-time" : ""} key={t.key}><span>{t.label}</span><strong>{displayTime(t.value)}</strong></div>)}</div>
          <div className="midnight-line"><Moon size={18} /><span>نصف الليل (نهاية العشاء في الدرس)</span><strong>{displayTime(schedule.midnight)}</strong></div>
        </div>
        <div className="calendar-answers">
          <div className="book-question"><span>١</span><p>يبدأ وقت صلاة العشاء الساعة:</p></div>
          <input aria-label="بداية وقت العشاء" type="time" className={`text-input large-time-input ${state.checked && state.start ? startCorrect ? "input-correct" : "input-wrong" : ""}`} value={state.start} onChange={e => update({ start: e.target.value, checked: false })} />
          <div className="book-question"><span>٢</span><p>ينتهي وقت صلاة العشاء الساعة:</p></div>
          <input aria-label="نهاية وقت العشاء" type="time" className={`text-input large-time-input ${state.checked && state.end ? endCorrect ? "input-correct" : "input-wrong" : ""}`} value={state.end} onChange={e => update({ end: e.target.value, checked: false })} />
          <button className="primary-button" onClick={check} disabled={!state.start || !state.end}><CheckCircle2 size={18} /> تحقق من الوقتين</button>
          {state.checked && (startCorrect && endCorrect ? <Feedback type="success">أحسنت! بدأ العشاء بمغيب الشفق الأحمر وينتهي عند نصف الليل بحسب الدرس.</Feedback> : <Feedback type="error">راجع سطر العشاء وشريط نصف الليل في التقويم، ثم حاول مرة أخرى.</Feedback>)}
        </div>
      </div>
      <p className="calculation-note">هذا تقويم تدريبي يعتمد حسابًا فلكيًا تقريبيًا بزاوية الفجر ١٨° والعشاء ١٧° وطريقة ظل العصر المعتمدة. يُرجع للتقويم الرسمي عند أداء الصلاة.</p>
    </div>
  );
}
