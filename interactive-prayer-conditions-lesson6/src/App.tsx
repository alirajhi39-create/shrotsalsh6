import { useEffect, useState } from "react";
import Landing from "./components/Landing";
import Lesson from "./components/Lesson";
import Teacher from "./components/Teacher";
import { emptyProgress, type StudentProgress } from "./types";

const STORAGE_KEY = "shurut-salat-2-progress-v1";

function readProgress(): StudentProgress {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
    if (!saved) return emptyProgress;
    return {
      ...emptyProgress, ...saved,
      completed: Array.isArray(saved.completed) ? saved.completed : [],
      answers: saved.answers && typeof saved.answers === "object" ? saved.answers : {},
    };
  } catch { return emptyProgress; }
}

function stationFromHash() {
  const match = window.location.hash.match(/^#station-(\d+)$/);
  const id = match ? Number(match[1]) : 1;
  return Math.max(1, Math.min(12, id));
}

export default function App() {
  const [progress, setProgress] = useState<StudentProgress>(() => {
    const saved = readProgress();
    return window.location.hash.startsWith("#station-") ? { ...saved, currentStation: stationFromHash() } : saved;
  });
  const [path, setPath] = useState(window.location.pathname);
  const [lessonOpen, setLessonOpen] = useState(window.location.hash.startsWith("#station-"));

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  }, [progress]);

  useEffect(() => {
    const onPopState = () => {
      setPath(window.location.pathname);
      const open = window.location.hash.startsWith("#station-");
      setLessonOpen(open);
      if (open) setProgress(prev => ({ ...prev, currentStation: stationFromHash() }));
    };
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  useEffect(() => {
    if (!lessonOpen) document.title = "شروط الصلاة (٢) – درس تفاعلي";
  }, [lessonOpen]);

  const navigate = (nextPath: string) => {
    window.history.pushState({}, "", nextPath);
    setPath(nextPath);
    if (nextPath === "/") setLessonOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const openStation = (id: number) => {
    setProgress(prev => ({ ...prev, currentStation: id, lastVisited: new Date().toISOString() }));
    setLessonOpen(true);
    window.history.pushState({}, "", `/#station-${id}`);
  };

  const start = (studentName: string, className: string) => {
    const now = new Date().toISOString();
    setProgress(prev => ({
      ...prev, studentName, className, started: true,
      createdAt: prev.createdAt || now, lastVisited: now,
    }));
    setLessonOpen(true);
    window.history.pushState({}, "", `/#station-${progress.currentStation || 1}`);
  };

  const saveAnswer = (key: string, value: unknown) => {
    setProgress(prev => ({ ...prev, answers: { ...prev.answers, [key]: value }, lastVisited: new Date().toISOString() }));
  };

  const completeStation = (id: number) => {
    setProgress(prev => prev.completed.includes(id) ? prev : { ...prev, completed: [...prev.completed, id].sort((a, b) => a - b), lastVisited: new Date().toISOString() });
  };

  const goHome = () => navigate("/");

  if (path.startsWith("/teacher")) return <Teacher progress={progress} navigate={navigate} />;
  if (progress.started && lessonOpen) return <Lesson progress={progress} navigate={navigate} onStation={openStation} onSave={saveAnswer} onComplete={completeStation} onHome={goHome} />;
  return <Landing progress={progress} onStart={start} onOpenStation={openStation} navigate={navigate} />;
}
