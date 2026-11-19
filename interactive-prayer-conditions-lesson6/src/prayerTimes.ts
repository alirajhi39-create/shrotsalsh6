import type { City } from "./data";

const DEG = Math.PI / 180;
const sin = (v: number) => Math.sin(v * DEG);
const cos = (v: number) => Math.cos(v * DEG);
const tan = (v: number) => Math.tan(v * DEG);
const arcsin = (v: number) => Math.asin(v) / DEG;
const arccos = (v: number) => Math.acos(v) / DEG;
const arctan2 = (y: number, x: number) => Math.atan2(y, x) / DEG;
const arccot = (v: number) => Math.atan(1 / v) / DEG;
const fixAngle = (v: number) => ((v % 360) + 360) % 360;
const fixHour = (v: number) => ((v % 24) + 24) % 24;

function julian(year: number, month: number, day: number) {
  let y = year;
  let m = month;
  if (m <= 2) { y -= 1; m += 12; }
  const a = Math.floor(y / 100);
  const b = 2 - a + Math.floor(a / 4);
  return Math.floor(365.25 * (y + 4716)) + Math.floor(30.6001 * (m + 1)) + day + b - 1524.5;
}

function sunPosition(jd: number) {
  const d = jd - 2451545;
  const g = fixAngle(357.529 + 0.98560028 * d);
  const q = fixAngle(280.459 + 0.98564736 * d);
  const l = fixAngle(q + 1.915 * sin(g) + 0.02 * sin(2 * g));
  const e = 23.439 - 0.00000036 * d;
  const ra = fixHour(arctan2(cos(e) * sin(l), cos(l)) / 15);
  return { declination: arcsin(sin(e) * sin(l)), equation: q / 15 - ra };
}

function rawTimes(year: number, month: number, day: number, city: City) {
  const { lat, lng, timezone } = city;
  const jDate = julian(year, month, day) - lng / (15 * 24);
  const midDay = (t: number) => fixHour(12 - sunPosition(jDate + t).equation);
  const sunAngleTime = (angle: number, t: number, direction: -1 | 1 = 1) => {
    const declination = sunPosition(jDate + t).declination;
    const noon = midDay(t);
    const numerator = -sin(angle) - sin(declination) * sin(lat);
    const denominator = cos(declination) * cos(lat);
    const ratio = Math.max(-1, Math.min(1, numerator / denominator));
    const delta = arccos(ratio) / 15;
    return noon + direction * delta;
  };
  const asrTime = (factor: number, t: number) => {
    const declination = sunPosition(jDate + t).declination;
    const angle = -arccot(factor + tan(Math.abs(lat - declination)));
    return sunAngleTime(angle, t);
  };
  const adjust = (v: number) => fixHour(v + timezone - lng / 15);
  const fajr = adjust(sunAngleTime(18, 5 / 24, -1));
  const sunrise = adjust(sunAngleTime(0.833, 6 / 24, -1));
  const dhuhr = adjust(midDay(12 / 24) + 1 / 60);
  const asr = adjust(asrTime(1, 13 / 24));
  const maghrib = adjust(sunAngleTime(0.833, 18 / 24));
  const isha = adjust(sunAngleTime(17, 18 / 24));
  return { fajr, sunrise, dhuhr, asr, maghrib, isha };
}

export type Schedule = ReturnType<typeof rawTimes> & { midnight: number };

export function calculateSchedule(dateValue: string, city: City): Schedule {
  const [year, month, day] = dateValue.split("-").map(Number);
  const safeYear = Number.isFinite(year) ? year : 2026;
  const safeMonth = Number.isFinite(month) ? month : 1;
  const safeDay = Number.isFinite(day) ? day : 1;
  const current = rawTimes(safeYear, safeMonth, safeDay, city);
  const nextDate = new Date(Date.UTC(safeYear, safeMonth - 1, safeDay + 1));
  const next = rawTimes(nextDate.getUTCFullYear(), nextDate.getUTCMonth() + 1, nextDate.getUTCDate(), city);
  const midnight = fixHour(current.maghrib + (next.fajr + 24 - current.maghrib) / 2);
  return { ...current, midnight };
}

export function hoursToTime(hours: number) {
  const total = Math.round(fixHour(hours) * 60) % 1440;
  const h = Math.floor(total / 60);
  const m = total % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

export function toArabicDigits(value: string | number) {
  return String(value).replace(/[0-9]/g, d => "٠١٢٣٤٥٦٧٨٩"[Number(d)]);
}

export function displayTime(hours: number) {
  return toArabicDigits(hoursToTime(hours));
}

export function normalizeTime(value: string) {
  const western = value.replace(/[٠-٩]/g, d => String("٠١٢٣٤٥٦٧٨٩".indexOf(d)));
  const [h, m] = western.split(":").map(Number);
  return (h || 0) * 60 + (m || 0);
}

export function qiblaBearing(lat: number, lng: number) {
  const kaabaLat = 21.4225;
  const kaabaLng = 39.8262;
  const deltaLng = kaabaLng - lng;
  const y = sin(deltaLng);
  const x = cos(lat) * tan(kaabaLat) - sin(lat) * cos(deltaLng);
  return Math.round(fixAngle(Math.atan2(y * DEG, x * DEG) / DEG));
}

export function dateLabel(dateValue: string) {
  const date = new Date(`${dateValue}T12:00:00`);
  try {
    return new Intl.DateTimeFormat("ar-SA-u-ca-islamic", {
      day: "numeric", month: "long", year: "numeric",
    }).format(date);
  } catch {
    return dateValue;
  }
}

export function prayerAtMinute(minute: number, schedule: Schedule) {
  const h = minute / 60;
  const fajr = schedule.fajr * 60;
  const sunrise = schedule.sunrise * 60;
  const dhuhr = schedule.dhuhr * 60;
  const asr = schedule.asr * 60;
  const maghrib = schedule.maghrib * 60;
  const isha = schedule.isha * 60;
  const midnight = schedule.midnight * 60;
  void h;
  if (minute >= fajr && minute < sunrise) return { name: "الفجر", detail: "من طلوع الفجر الثاني إلى طلوع الشمس", key: "fajr" };
  if (minute >= dhuhr && minute < asr) return { name: "الظهر", detail: "من زوال الشمس إلى أن يصير ظل كل شيء مثله", key: "dhuhr" };
  if (minute >= asr && minute < maghrib) return { name: "العصر", detail: "من خروج وقت الظهر إلى اصفرار الشمس", key: "asr" };
  if (minute >= maghrib && minute < isha) return { name: "المغرب", detail: "من غروب الشمس إلى مغيب الشفق الأحمر", key: "maghrib" };
  if (minute >= isha || (midnight > 0 && minute < midnight && minute < fajr)) return { name: "العشاء", detail: "من مغيب الشفق الأحمر إلى نصف الليل", key: "isha" };
  if (minute >= sunrise && minute < dhuhr) return { name: "نهار قبل الزوال", detail: "خرج وقت الفجر ولم يدخل وقت الظهر بعد", key: "day" };
  return { name: "ليس وقت فريضة الآن", detail: "تابع حركة المؤشر لتكتشف دخول الوقت التالي", key: "none" };
}
