import type { MouseEvent, ReactNode } from "react";
import {
  Brain, Layers3, Clock3, Sun, Link2, CalendarDays, Landmark, Compass,
  Heart, Grid3X3, ClipboardCheck, Trophy, Mosque, GraduationCap, ArrowLeft,
  Check, type LucideIcon,
} from "lucide-react";

const iconMap: Record<string, LucideIcon> = {
  brain: Brain, cards: Layers3, clock: Clock3, sun: Sun, link: Link2,
  calendar: CalendarDays, kaaba: Landmark, compass: Compass, heart: Heart,
  grid: Grid3X3, quiz: ClipboardCheck, trophy: Trophy,
};

export function StationIcon({ name, size = 24 }: { name: string; size?: number }) {
  const Icon = iconMap[name] || Layers3;
  return <Icon size={size} strokeWidth={1.9} aria-hidden="true" />;
}

export function Brand({ compact = false }: { compact?: boolean }) {
  return (
    <div className={`brand ${compact ? "brand-compact" : ""}`}>
      <span className="brand-mark"><Mosque size={compact ? 25 : 29} strokeWidth={1.8} /></span>
      <span className="brand-copy">
        <strong>العروس الابتدائية</strong>
        <small>الدراسات الإسلامية – الفقه</small>
      </span>
    </div>
  );
}

export function SiteHeader({ navigate, inLesson = false }: { navigate: (path: string) => void; inLesson?: boolean }) {
  const follow = (event: MouseEvent<HTMLAnchorElement>, path: string) => {
    event.preventDefault();
    navigate(path);
  };
  return (
    <header className="site-header">
      <div className="site-header-inner">
        {inLesson ? (
          <a href="/" onClick={e => follow(e, "/")} className="brand-link" aria-label="العودة إلى بداية الدرس"><Brand compact /></a>
        ) : <Brand />}
        <a className="teacher-link" href="/teacher/login" onClick={e => follow(e, "/teacher/login")}>
          <GraduationCap size={20} />
          <span>دخول المعلم</span>
          <ArrowLeft size={16} className="teacher-arrow" />
        </a>
      </div>
    </header>
  );
}

export function CheckMark({ show }: { show: boolean }) {
  return show ? <span className="check-mark" aria-label="مكتمل"><Check size={15} strokeWidth={3} /></span> : null;
}

export function Feedback({ type, children }: { type: "success" | "error" | "info"; children: ReactNode }) {
  return <div className={`feedback feedback-${type}`} role="status">{children}</div>;
}

export function ArabicNumber({ children }: { children: string | number }) {
  return <>{String(children).replace(/[0-9]/g, d => "٠١٢٣٤٥٦٧٨٩"[Number(d)])}</>;
}
