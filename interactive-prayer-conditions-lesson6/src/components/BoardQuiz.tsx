import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight, Check, CheckCircle2, Clock3, Expand, Minimize, Minus, Pause,
  Play, Plus, RotateCcw, Settings2, Trophy, UsersRound, XCircle,
} from "lucide-react";
import { competitionQuestions, type CompetitionQuestion } from "../data";
import { toArabicDigits } from "../prayerTimes";

type Team = { id: number; name: string; color: string };
type Screen = "setup" | "playing" | "result";

const colors = ["#159e98", "#d18a2e", "#5279bb", "#b65f79", "#758c42", "#8969b3", "#c56645", "#36879b"];
const arabicNumbers = ["١", "٢", "٣", "٤", "٥", "٦", "٧", "٨"];
const letters = ["أ", "ب", "ج", "د"];

function shuffledQuestions(length: number) {
  const copy = [...competitionQuestions];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy.slice(0, length);
}

export default function BoardQuiz({ onClose }: { onClose: () => void }) {
  const [screen, setScreen] = useState<Screen>("setup");
  const [teams, setTeams] = useState<Team[]>([
    { id: 1, name: "الفريق ١", color: colors[0] },
    { id: 2, name: "الفريق ٢", color: colors[1] },
  ]);
  const [timerDuration, setTimerDuration] = useState(30);
  const [gameLength, setGameLength] = useState(12);
  const [questions, setQuestions] = useState<CompetitionQuestion[]>([]);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [currentTeam, setCurrentTeam] = useState(0);
  const [scores, setScores] = useState<number[]>([]);
  const [selected, setSelected] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState(timerDuration);
  const [timerRunning, setTimerRunning] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(Boolean(document.fullscreenElement));
  const [fullscreenError, setFullscreenError] = useState("");

  const question = questions[questionIndex];
  const maxScore = scores.length ? Math.max(...scores) : 0;
  const winners = teams.filter((_, index) => scores[index] === maxScore);
  const standings = useMemo(() => teams.map((team, index) => ({ ...team, score: scores[index] || 0, index })).sort((a, b) => b.score - a.score), [teams, scores]);

  useEffect(() => {
    const onFullscreen = () => setIsFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener("fullscreenchange", onFullscreen);
    return () => document.removeEventListener("fullscreenchange", onFullscreen);
  }, []);

  useEffect(() => {
    if (screen !== "playing" || selected !== null || !timerRunning || !question) return;
    if (timeLeft <= 0) {
      setSelected(-1);
      setTimerRunning(false);
      return;
    }
    const timeout = window.setTimeout(() => setTimeLeft(value => Math.max(0, value - 1)), 1000);
    return () => window.clearTimeout(timeout);
  }, [screen, selected, timerRunning, timeLeft, question]);

  const startGame = () => {
    setQuestions(shuffledQuestions(gameLength));
    setScores(teams.map(() => 0));
    setQuestionIndex(0);
    setCurrentTeam(0);
    setSelected(null);
    setTimeLeft(timerDuration);
    setTimerRunning(true);
    setScreen("playing");
  };

  const restartGame = () => {
    setQuestions(shuffledQuestions(gameLength));
    setScores(teams.map(() => 0));
    setQuestionIndex(0);
    setCurrentTeam(0);
    setSelected(null);
    setTimeLeft(timerDuration);
    setTimerRunning(true);
    setScreen("playing");
  };

  const addTeam = () => {
    if (teams.length >= 8) return;
    const id = Math.max(...teams.map(team => team.id)) + 1;
    const color = colors.find(candidate => !teams.some(team => team.color === candidate)) || colors[teams.length];
    setTeams([...teams, { id, name: `الفريق ${arabicNumbers[teams.length]}`, color }]);
  };

  const removeTeam = (id: number) => {
    if (teams.length <= 2) return;
    setTeams(teams.filter(team => team.id !== id));
  };

  const renameTeam = (id: number, name: string) => {
    setTeams(teams.map(team => team.id === id ? { ...team, name } : team));
  };

  const answer = (option: number) => {
    if (selected !== null || !question) return;
    setSelected(option);
    setTimerRunning(false);
    if (option === question.answer) {
      setScores(previous => previous.map((score, index) => index === currentTeam ? score + 10 : score));
    }
  };

  const changeScore = (index: number, amount: number) => {
    setScores(previous => previous.map((score, teamIndex) => teamIndex === index ? Math.max(0, score + amount) : score));
  };

  const nextQuestion = () => {
    if (selected === null) return;
    if (questionIndex >= questions.length - 1) {
      setScreen("result");
      return;
    }
    setQuestionIndex(index => index + 1);
    setCurrentTeam(team => (team + 1) % teams.length);
    setSelected(null);
    setTimeLeft(timerDuration);
    setTimerRunning(true);
  };

  const toggleFullscreen = async () => {
    setFullscreenError("");
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
      else await document.documentElement.requestFullscreen();
    } catch {
      setFullscreenError("تعذر تفعيل ملء الشاشة في هذا المتصفح.");
    }
  };

  return (
    <section className={`board-quiz quiz-screen-${screen}`}>
      <div className="quiz-topbar">
        <button className="quiz-back-button" onClick={onClose}><ArrowRight size={22} /><span>عودة إلى لوحة المعلم</span></button>
        <div className="quiz-brand-title"><Trophy size={24} /><strong>مسابقة السبورة</strong><span>شروط الصلاة (٢)</span></div>
        <button className="quiz-fullscreen-button" onClick={toggleFullscreen}>{isFullscreen ? <Minimize size={21} /> : <Expand size={21} />}<span>{isFullscreen ? "خروج من ملء الشاشة" : "ملء الشاشة"}</span></button>
      </div>
      {fullscreenError && <p className="quiz-fullscreen-error">{fullscreenError}</p>}

      {screen === "setup" && <div className="quiz-setup">
        <header className="quiz-setup-header"><span><UsersRound size={43} /></span><div><small>مسابقة جماعية للمعلم</small><h1>جهّز فرق الصف</h1><p>فريقان أو أكثر، ودور لكل فريق، وعشر نقاط لكل إجابة صحيحة.</p></div></header>
        <div className="quiz-setup-grid">
          <section className="quiz-teams-setup">
            <div className="quiz-setup-section-title"><h2>الفرق المشاركة</h2><span>{toArabicDigits(teams.length)} فرق</span></div>
            <div className="quiz-team-name-list">{teams.map((team, index) => <div className="quiz-team-name-row" key={team.id} style={{ "--team-color": team.color } as React.CSSProperties}>
              <span className="quiz-team-color" />
              <label htmlFor={`team-${team.id}`}>الفريق {toArabicDigits(index + 1)}</label>
              <input id={`team-${team.id}`} value={team.name} maxLength={24} onChange={event => renameTeam(team.id, event.target.value)} aria-label={`اسم الفريق ${index + 1}`} />
              <button onClick={() => removeTeam(team.id)} disabled={teams.length <= 2} title="حذف الفريق" aria-label={`حذف ${team.name}`}><Minus size={20} /></button>
            </div>)}</div>
            <button className="quiz-add-team" onClick={addTeam} disabled={teams.length >= 8}><Plus size={21} /> إضافة فريق <small>حتى ٨ فرق</small></button>
          </section>
          <section className="quiz-game-settings">
            <div className="quiz-setup-section-title"><h2>إعدادات اللعب</h2><Settings2 size={24} /></div>
            <label>زمن الإجابة لكل سؤال</label>
            <div className="quiz-setting-options">{[20, 30, 45, 60].map(seconds => <button key={seconds} className={timerDuration === seconds ? "selected" : ""} onClick={() => setTimerDuration(seconds)}>{toArabicDigits(seconds)} ث</button>)}</div>
            <label>عدد أسئلة المسابقة</label>
            <div className="quiz-setting-options">{[8, 12, 16].map(length => <button key={length} className={gameLength === length ? "selected" : ""} onClick={() => setGameLength(length)}>{toArabicDigits(length)} أسئلة</button>)}</div>
            <div className="quiz-rules"><CheckCircle2 size={22} /><p>تنتقل الأدوار بين الفرق بالتساوي. إذا انتهى الوقت تُكشف الإجابة دون نقاط، ويمكن للمعلم تعديل النقاط يدويًا أثناء اللعب.</p></div>
          </section>
        </div>
        <button className="quiz-start-button" onClick={startGame} disabled={teams.some(team => !team.name.trim())}><Play size={25} fill="currentColor" /> ابدأ مسابقة السبورة</button>
      </div>}

      {screen === "playing" && question && <div className="quiz-playing">
        <div className="quiz-play-status"><span>السؤال {toArabicDigits(questionIndex + 1)} من {toArabicDigits(questions.length)}</span><div className="quiz-question-progress"><i style={{ width: `${(questionIndex + 1) / questions.length * 100}%` }} /></div><button onClick={() => setScreen("result")}>إنهاء وعرض النتائج</button></div>
        <div className="quiz-scoreboard">{teams.map((team, index) => <article key={team.id} className={index === currentTeam ? "active" : ""} style={{ "--team-color": team.color } as React.CSSProperties}>
          <div className="quiz-score-team-name"><span>{toArabicDigits(index + 1)}</span><strong>{team.name}</strong>{index === currentTeam && <small>الدور الآن</small>}</div>
          <b>{toArabicDigits(scores[index] || 0)}</b>
          <div className="quiz-score-adjust"><button onClick={() => changeScore(index, -10)} title={`إنقاص ١٠ نقاط من ${team.name}`}><Minus size={17} /></button><button onClick={() => changeScore(index, 10)} title={`إضافة ١٠ نقاط إلى ${team.name}`}><Plus size={17} /></button></div>
        </article>)}</div>
        <div className="quiz-question-area">
          <div className="quiz-turn-and-timer">
            <div className="quiz-turn-banner" style={{ "--team-color": teams[currentTeam].color } as React.CSSProperties}><span>الدور على</span><strong>{teams[currentTeam].name}</strong></div>
            <button className={`quiz-timer ${timeLeft <= 10 && selected === null ? "urgent" : ""}`} onClick={() => selected === null && setTimerRunning(value => !value)} title={timerRunning ? "إيقاف المؤقت مؤقتًا" : "تشغيل المؤقت"} style={{ "--timer-progress": `${timeLeft / timerDuration * 360}deg` } as React.CSSProperties}>
              <span>{selected !== null ? <Check size={27} /> : timerRunning ? <Clock3 size={24} /> : <Pause size={24} />}</span><strong>{toArabicDigits(timeLeft)}</strong><small>ثانية</small>
            </button>
          </div>
          <div className="quiz-question-card">
            <span className="quiz-category">{question.category}</span>
            <h1>{question.question}</h1>
            <div className="quiz-answer-grid">{question.options.map((option, index) => {
              const isCorrect = selected !== null && index === question.answer;
              const isWrong = selected === index && index !== question.answer;
              return <button key={option} disabled={selected !== null} className={`${isCorrect ? "correct" : ""} ${isWrong ? "wrong" : ""}`} onClick={() => answer(index)}><span>{letters[index]}</span><strong>{option}</strong>{isCorrect && <CheckCircle2 size={29} />}{isWrong && <XCircle size={29} />}</button>;
            })}</div>
            {selected !== null && <div className={`quiz-answer-feedback ${selected === question.answer ? "good" : "bad"}`}>
              {selected === question.answer ? <CheckCircle2 size={30} /> : <XCircle size={30} />}
              <div><strong>{selected === question.answer ? `إجابة صحيحة! ١٠ نقاط لفريق ${teams[currentTeam].name}` : selected === -1 ? "انتهى وقت الإجابة" : "إجابة غير صحيحة"}</strong><p>{question.explanation}</p></div>
              <button onClick={nextQuestion}>{questionIndex === questions.length - 1 ? "عرض النتائج" : "السؤال التالي"}</button>
            </div>}
          </div>
        </div>
      </div>}

      {screen === "result" && <div className="quiz-results">
        <div className="quiz-winner-icon"><Trophy size={65} /></div>
        <span className="quiz-results-label">النتيجة النهائية</span>
        <h1>{winners.length > 1 ? "تعادل رائع بين الفرق!" : `فاز ${winners[0]?.name || "الفريق"}!`}</h1>
        <p>{winners.length > 1 ? winners.map(team => team.name).join(" — ") : `برصيد ${toArabicDigits(maxScore)} نقطة`}</p>
        <div className="quiz-standings">{standings.map((team, index) => <article key={team.id} style={{ "--team-color": team.color } as React.CSSProperties} className={team.score === maxScore ? "winner" : ""}>
          <span className="quiz-standing-rank">{toArabicDigits(index + 1)}</span><i /><strong>{team.name}</strong><b>{toArabicDigits(team.score)}<small> نقطة</small></b>{team.score === maxScore && <Trophy size={25} />}
        </article>)}</div>
        <div className="quiz-result-actions"><button className="quiz-start-button" onClick={restartGame}><RotateCcw size={23} /> مسابقة جديدة بالفرق نفسها</button><button className="quiz-secondary-action" onClick={() => setScreen("setup")}><Settings2 size={21} /> تعديل الفرق والإعدادات</button></div>
      </div>}
    </section>
  );
}
