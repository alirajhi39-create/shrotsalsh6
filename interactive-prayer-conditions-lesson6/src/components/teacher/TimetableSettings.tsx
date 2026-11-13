"use client";

import { useState } from "react";
import { Btn } from "@/components/lesson/ui";

const FIELDS = [
  ["location", "المنطقة / المدينة"], ["date", "تاريخ التقويم"], ["fajr", "الفجر"], ["sunrise", "الشروق"], ["dhuhr", "الظهر"], ["asr", "العصر"], ["maghrib", "المغرب"], ["isha", "العشاء"],
] as const;
export default function TimetableSettings({ value, onSave, busy }: { value: Record<string, string>; onSave: (timetable: Record<string, string>) => Promise<boolean>; busy: boolean }) {
  const [draft, setDraft] = useState<Record<string, string>>(() => Object.fromEntries(FIELDS.map(([key]) => [key, value[key] ?? ""])));
  const [saving, setSaving] = useState(false);
  return <section className="rounded-3xl bg-white p-5 shadow"><h2 className="text-lg font-black text-turq-900">🗓️ تقويم الصلاة المحلي</h2><p className="mt-1 text-sm text-slate-500">أدخل أوقات منطقتك من التقويم الموثوق ليظهر للطلاب في نشاط «تقويم منطقتي». اتركه فارغًا إذا لم يتوفر بعد.</p><div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{FIELDS.map(([key, label]) => <label key={key} className="block text-sm font-bold text-slate-700">{label}<input value={draft[key] ?? ""} onChange={(e) => setDraft({ ...draft, [key]: e.target.value })} className="mt-1 w-full rounded-xl border-2 border-slate-200 p-2 focus:border-turq-400 focus:outline-none" placeholder={key === "location" ? "مثال: مكة المكرمة" : key === "date" ? "مثال: 1447/06/10" : "مثال: 06:15 م"} /></label>)}</div><Btn className="mt-4" disabled={busy || saving} onClick={async () => { setSaving(true); await onSave(draft); setSaving(false); }}>{saving ? "جارٍ الحفظ…" : "حفظ التقويم"}</Btn></section>;
}
