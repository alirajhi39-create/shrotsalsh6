export type StationInfo = {
  id: number;
  title: string;
  subtitle: string;
  icon: string;
  color: string;
};

export const stations: StationInfo[] = [
  { id: 1, title: "هل أعرف وقت صلاتي؟", subtitle: "العصف الذهني وأسئلة التوقع", icon: "brain", color: "#e79a38" },
  { id: 2, title: "اكتشف الشروط الثلاثة", subtitle: "التعلم بالاكتشاف وتدبر الدليل", icon: "cards", color: "#1baaa4" },
  { id: 3, title: "أوقات الصلوات الخمس", subtitle: "التعلم البصري بالصور", icon: "clock", color: "#257f9e" },
  { id: 4, title: "مختبر الشمس والوقت", subtitle: "حرّك الزمن ولاحظ الصلاة", icon: "sun", color: "#e79a38" },
  { id: 5, title: "من بداية الوقت إلى نهايته", subtitle: "وصّل كل صلاة بوقتها", icon: "link", color: "#7b6bb5" },
  { id: 6, title: "نشاط التقويم", subtitle: "احسب بداية العشاء ونهايته", icon: "calendar", color: "#1baaa4" },
  { id: 7, title: "استقبال القبلة", subtitle: "الشرط الثامن وصورة الكعبة", icon: "kaaba", color: "#257f9e" },
  { id: 8, title: "أين أتجه في الصلاة؟", subtitle: "بوصلة القبلة والتعلم بالمواقف", icon: "compass", color: "#1d8c78" },
  { id: 9, title: "النية محلها القلب", subtitle: "الشرط التاسع واستنتاج الحديث", icon: "heart", color: "#c66f7a" },
  { id: 10, title: "شروط الصلاة التسعة", subtitle: "أكمل خريطة الدرسين", icon: "grid", color: "#7b6bb5" },
  { id: 11, title: "التقويم الختامي", subtitle: "صحح الخطأ وفسر الصورة", icon: "quiz", color: "#b87828" },
  { id: 12, title: "بطل شروط الصلاة", subtitle: "التحدي الأخير والشهادة", icon: "trophy", color: "#d99a2b" },
];

export const images = {
  hero: "https://images.pexels.com/photos/2608353/pexels-photo-2608353.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=900",
  kaaba: "https://images.pexels.com/photos/35446836/pexels-photo-35446836.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=760&w=1100",
  fajr: "https://images.pexels.com/photos/1595850/pexels-photo-1595850.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=620&w=1000",
  sunrise: "https://images.pexels.com/photos/29147674/pexels-photo-29147674.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=620&w=1000",
  dhuhr: "https://images.pexels.com/photos/9227734/pexels-photo-9227734.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=620&w=1000",
  asr: "https://images.pexels.com/photos/2994328/pexels-photo-2994328.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=620&w=1000",
  maghrib: "https://images.pexels.com/photos/27332122/pexels-photo-27332122.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=620&w=1000",
  twilight: "https://images.pexels.com/photos/32901670/pexels-photo-32901670.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=620&w=1000",
  isha: "https://images.pexels.com/photos/18309523/pexels-photo-18309523.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=620&w=1000",
};

export type PrayerKey = "fajr" | "dhuhr" | "asr" | "maghrib" | "isha";

export type PrayerInfo = {
  key: PrayerKey;
  name: string;
  start: string;
  end: string;
  startShort: string;
  endShort: string;
  image: string;
  alt: string;
  color: string;
  hint: string;
};

export const prayers: PrayerInfo[] = [
  {
    key: "fajr", name: "الفجر", start: "من طلوع الفجر الثاني", end: "إلى طلوع الشمس",
    startShort: "طلوع الفجر الثاني", endShort: "طلوع الشمس", image: images.fajr,
    alt: "ضوء الفجر والنجوم في السماء", color: "#31527d", hint: "الفجر الثاني هو الضوء الأبيض المنتشر في الأفق."
  },
  {
    key: "dhuhr", name: "الظهر", start: "من زوال الشمس", end: "إلى أن يصير ظل كل شيء مثله",
    startShort: "زوال الشمس", endShort: "مصير ظل كل شيء مثله", image: images.dhuhr,
    alt: "شمس ساطعة في سماء النهار", color: "#ce922c", hint: "الزوال هو ميل الشمس عن كبد السماء نحو الغرب."
  },
  {
    key: "asr", name: "العصر", start: "من خروج وقت الظهر", end: "إلى اصفرار الشمس",
    startShort: "خروج وقت الظهر", endShort: "اصفرار الشمس", image: images.asr,
    alt: "ضوء الشمس في فترة بعد الظهر", color: "#b97b38", hint: "يبدأ العصر حين يصير ظل الشيء مثله بعد الزوال."
  },
  {
    key: "maghrib", name: "المغرب", start: "من غروب الشمس", end: "إلى أن يغيب الشفق الأحمر",
    startShort: "غروب الشمس", endShort: "غياب الشفق الأحمر", image: images.maghrib,
    alt: "غروب الشمس فوق الأفق", color: "#b4584d", hint: "الشفق الأحمر هو الضوء الأحمر الذي يظهر في جهة الغرب بعد الغروب."
  },
  {
    key: "isha", name: "العشاء", start: "من مغيب الشفق الأحمر", end: "إلى نصف الليل",
    startShort: "مغيب الشفق الأحمر", endShort: "نصف الليل", image: images.isha,
    alt: "سماء الليل ومغيب الشفق", color: "#45477b", hint: "نصف الليل هنا هو منتصف المدة من غروب الشمس إلى طلوع الفجر، كما في الدرس."
  },
];

export const conditions = [
  "الإسلام", "العقل", "التمييز", "الطهارة", "ستر العورة",
  "إزالة النجاسة", "دخول الوقت", "استقبال القبلة", "النية",
];

export type City = {
  id: string;
  name: string;
  lat: number;
  lng: number;
  timezone: number;
};

export const cities: City[] = [
  { id: "makkah", name: "مكة المكرمة", lat: 21.3891, lng: 39.8579, timezone: 3 },
  { id: "madinah", name: "المدينة المنورة", lat: 24.5247, lng: 39.5692, timezone: 3 },
  { id: "riyadh", name: "الرياض", lat: 24.7136, lng: 46.6753, timezone: 3 },
  { id: "jeddah", name: "جدة", lat: 21.4858, lng: 39.1925, timezone: 3 },
  { id: "dammam", name: "الدمام", lat: 26.4207, lng: 50.0888, timezone: 3 },
  { id: "abha", name: "أبها", lat: 18.2465, lng: 42.5117, timezone: 3 },
  { id: "tabuk", name: "تبوك", lat: 28.3838, lng: 36.555, timezone: 3 },
];

export type CompetitionQuestion = {
  category: string;
  question: string;
  options: string[];
  answer: number;
  explanation: string;
};

export const competitionQuestions: CompetitionQuestion[] = [
  { category: "وقت الفجر", question: "ما العلامة التي يبدأ عندها وقت صلاة الفجر؟", options: ["طلوع الفجر الثاني", "طلوع الشمس", "زوال الشمس", "غروب الشمس"], answer: 0, explanation: "يبدأ وقت الفجر بطلوع الفجر الثاني، وهو الضوء الأبيض المنتشر في الأفق." },
  { category: "وقت الفجر", question: "أي صلاة ينتهي وقتها بطلوع الشمس؟", options: ["العشاء", "المغرب", "الفجر", "العصر"], answer: 2, explanation: "وقت الفجر من طلوع الفجر الثاني إلى طلوع الشمس." },
  { category: "وقت الظهر", question: "متى يبدأ وقت صلاة الظهر؟", options: ["عند اصفرار الشمس", "عند زوال الشمس", "عند غروب الشمس", "عند مغيب الشفق"], answer: 1, explanation: "يبدأ وقت الظهر بزوال الشمس وميلها عن كبد السماء نحو الغرب." },
  { category: "وقت الظهر", question: "متى ينتهي وقت صلاة الظهر بحسب الدرس؟", options: ["بطلوع الشمس", "بغروب الشمس", "حين يصير ظل كل شيء مثله", "عند نصف الليل"], answer: 2, explanation: "ينتهي وقت الظهر حين يصير ظل كل شيء مثله بعد الزوال." },
  { category: "وقت العصر", question: "ما نهاية وقت صلاة العصر الوارد في الدرس؟", options: ["اصفرار الشمس", "طلوع الفجر", "زوال الشمس", "مغيب الشفق"], answer: 0, explanation: "وقت العصر من خروج وقت الظهر إلى اصفرار الشمس." },
  { category: "وقت المغرب", question: "صلى فريق من الطلاب المغرب قبل الغروب. ما الحكم؟", options: ["صحيحة لأن الغروب قريب", "صحيحة إذا كان في المسجد", "لا تصح لأنها قبل دخول الوقت", "تصح إذا نوى المغرب"], answer: 2, explanation: "من شروط صحة الصلاة دخول الوقت، ووقت المغرب يبدأ بغروب الشمس." },
  { category: "وقت المغرب", question: "ما العلامة التي ينتهي عندها وقت المغرب؟", options: ["اصفرار الشمس", "مغيب الشفق الأحمر", "طلوع الفجر", "زوال الشمس"], answer: 1, explanation: "وقت المغرب من غروب الشمس إلى مغيب الشفق الأحمر." },
  { category: "وقت العشاء", question: "أي صلاة يبدأ وقتها بمغيب الشفق الأحمر؟", options: ["الفجر", "الظهر", "المغرب", "العشاء"], answer: 3, explanation: "مغيب الشفق الأحمر هو بداية وقت صلاة العشاء." },
  { category: "نصف الليل", question: "ما المقصود بنصف الليل في نهاية وقت العشاء كما في الدرس؟", options: ["الساعة الثانية عشرة دائمًا", "منتصف المدة من الغروب إلى طلوع الفجر", "الساعة العاشرة مساءً", "بداية غروب الشمس"], answer: 1, explanation: "نصف الليل هنا منتصف المدة من غروب الشمس إلى طلوع الفجر الثاني." },
  { category: "استقبال القبلة", question: "إلى أي شرط ننتبه عندما نحدد اتجاه الكعبة قبل الصلاة؟", options: ["استقبال القبلة", "دخول الوقت", "التمييز", "العقل"], answer: 0, explanation: "استقبال القبلة هو الشرط الثامن من شروط الصلاة." },
  { category: "الكعبة", question: "أين تقع الكعبة التي هي قبلة المسلمين؟", options: ["المدينة المنورة", "الرياض", "مكة المكرمة", "جدة"], answer: 2, explanation: "الكعبة المشرفة تقع في مكة المكرمة." },
  { category: "استقبال القبلة", question: "صلى سعد عكس القبلة مع قدرته على استقبالها. ما التصحيح؟", options: ["يستمر في الاتجاه نفسه", "يستقبل الكعبة ويعيد الصلاة", "ينتظر صلاة العشاء", "يكتفي بالنية"], answer: 1, explanation: "لا تصح الصلاة مع القدرة دون استقبال القبلة." },
  { category: "النية", question: "أين محل نية الصلاة؟", options: ["القلب", "اللسان بصوت مرتفع", "المصحف", "سجادة الصلاة"], answer: 0, explanation: "النية محلها القلب ولا ننطق بها." },
  { category: "النية", question: "أي شرط نستنتجه من حديث «إنما الأعمال بالنيات»؟", options: ["ستر العورة", "الطهارة", "النية", "دخول الوقت"], answer: 2, explanation: "النية هي الشرط التاسع، ويدل الحديث على أهميتها للأعمال." },
  { category: "شروط الصلاة", question: "كم عدد شروط الصلاة التي جمعها الدرسان؟", options: ["خمسة", "سبعة", "ثمانية", "تسعة"], answer: 3, explanation: "للصلاة تسعة شروط لا تصح إلا بها." },
  { category: "تدبر الآية", question: "بم تدل كلمة «موقوتًا» في الآية على أحد شروط الصلاة؟", options: ["استقبال القبلة", "دخول الوقت", "العقل", "إزالة النجاسة"], answer: 1, explanation: "الآية تدل على أن لكل صلاة وقتًا محددًا، ومن ذلك نعرف شرط دخول الوقت." },
];

export const finalQuestions = [
  {
    question: "متى ينتهي وقت صلاة الفجر؟",
    options: ["بغروب الشمس", "بطلوع الشمس", "بزوال الشمس", "بمغيب الشفق"],
    answer: 1,
    explanation: "وقت الفجر من طلوع الفجر الثاني إلى طلوع الشمس."
  },
  {
    question: "صلى محمد المغرب قبل غروب الشمس. ما الصواب؟",
    options: ["صلاته صحيحة", "يعيدها بعد طلوع الشمس", "ينتظر غروب الشمس ثم يصلي", "يصليها بعد العشاء دائمًا"],
    answer: 2,
    explanation: "من شرط صحة الصلاة دخول وقتها، ووقت المغرب يبدأ بغروب الشمس."
  },
  {
    question: "ما الشرط الذي دل عليه حديث: «إنما الأعمال بالنيات»؟",
    options: ["العقل", "الطهارة", "النية", "ستر العورة"],
    answer: 2,
    explanation: "النية هي الشرط التاسع، ومحلها القلب."
  },
  {
    question: "أين تقع الكعبة التي يستقبلها المسلمون؟",
    options: ["في المدينة المنورة", "في مكة المكرمة", "في الرياض", "في جدة"],
    answer: 1,
    explanation: "الكعبة المشرفة في مكة المكرمة، وهي قبلة المسلمين."
  },
  {
    question: "غاب الشفق الأحمر. أي صلاة دخل وقتها؟",
    options: ["العشاء", "الفجر", "العصر", "الظهر"],
    answer: 0,
    explanation: "يبدأ وقت العشاء بمغيب الشفق الأحمر."
  },
  {
    question: "صلّى سعد عكس القبلة مع قدرته على استقبالها. ما الشرط الذي أخلّ به؟",
    options: ["التمييز", "دخول الوقت", "استقبال القبلة", "إزالة النجاسة"],
    answer: 2,
    explanation: "لا تصح الصلاة مع القدرة دون استقبال القبلة."
  },
];
