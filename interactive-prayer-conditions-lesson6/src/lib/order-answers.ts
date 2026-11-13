/** المقاطع والترتيبات المقبولة لسؤال إزالة النجاسة في الكتاب والتقويم. */
export const NAJASA_ORDER_WORDS = [
  "عند إرادة",
  "النجاسة",
  "عن البدن",
  "ومكان الصلاة",
  "تجب إزالة",
  "والملابس",
  "الصلاة",
] as const;

export const NAJASA_ORDER_SENTENCES = [
  "عند إرادة الصلاة تجب إزالة النجاسة عن البدن والملابس ومكان الصلاة",
  "تجب إزالة النجاسة عن البدن والملابس ومكان الصلاة عند إرادة الصلاة",
] as const;

export const NAJASA_ORDER_KEYS = new Set(["book_order_sentence", "quiz_order"]);

/** توحيد المسافات والتشكيل والصياغة المكافئة دون تغيير كلمات الجملة الأخرى. */
export function normalizeOrderToken(value: unknown): string {
  if (typeof value !== "string") return "";
  return value
    .normalize("NFKC")
    .replace(/[\u064B-\u065F\u0670\u0640]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/^يجب إزالة$/, "تجب إزالة");
}

export function orderLabel(value: string): string {
  return value === "تجب إزالة" ? "تجب إزالة / يجب إزالة" : value;
}

function splitSentence(sentence: string, words: readonly string[]): string[] | null {
  let rest = normalizeOrderToken(sentence);
  const result: string[] = [];
  const choices = words.map(normalizeOrderToken).sort((a, b) => b.length - a.length);
  while (rest) {
    const match = choices.find((word) => word && (rest === word || rest.startsWith(`${word} `)));
    if (!match) return null;
    result.push(match);
    rest = rest.slice(match.length).trimStart();
  }
  return result;
}

export function acceptedOrderLists(answer: Record<string, unknown>, words: readonly string[], questionKey?: string): string[][] {
  const lists: string[][] = [];
  const add = (value: unknown) => {
    if (!Array.isArray(value)) return;
    const order = value.map(normalizeOrderToken);
    if (order.length && order.every(Boolean)) lists.push(order);
  };
  add(answer.order);
  if (Array.isArray(answer.acceptedOrders)) answer.acceptedOrders.forEach(add);
  if (typeof answer.acceptedSentences === "string") {
    answer.acceptedSentences.split(/\r?\n/).forEach((sentence) => add(splitSentence(sentence, words)));
  }
  if (questionKey && NAJASA_ORDER_KEYS.has(questionKey)) {
    NAJASA_ORDER_SENTENCES.forEach((sentence) => add(splitSentence(sentence, words)));
  }
  const seen = new Set<string>();
  return lists.filter((order) => {
    const key = JSON.stringify(order);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

export function isAcceptedOrder(response: unknown, accepted: readonly (readonly string[])[]): boolean {
  if (!response || typeof response !== "object" || Array.isArray(response)) return false;
  const given = (response as Record<string, unknown>).order;
  if (!Array.isArray(given)) return false;
  const normalized = given.map(normalizeOrderToken);
  return accepted.some((order) => order.length > 0 && normalized.length === order.length && normalized.every((token, index) => token === normalizeOrderToken(order[index])));
}
