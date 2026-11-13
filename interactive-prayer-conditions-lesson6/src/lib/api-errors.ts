import { NextResponse } from "next/server";
import { randomUUID } from "crypto";

/** خطأ تشغيلي آمن يمكن عرض نصه للمستخدم. */
export class AppError extends Error {
  constructor(message: string, public readonly status = 400) {
    super(message);
    this.name = "AppError";
  }
}

export function isAppError(error: unknown): error is AppError {
  return error instanceof AppError || (error instanceof Error && error.name === "AppError" && "status" in error);
}

/** لا يعرض تفاصيل SQL أو معلمات الاستعلام؛ يسجلها في الخادم مع رمز متابعة. */
export function safeApiError(error: unknown, fallback: string, context: Record<string, unknown> = {}) {
  if (isAppError(error)) return NextResponse.json({ error: error.message }, { status: error.status });
  const ref = randomUUID().slice(0, 8);
  console.error("api_error", { ref, ...context, error: error instanceof Error ? error.stack ?? error.message : String(error) });
  return NextResponse.json({ error: `${fallback} رمز المتابعة: ${ref}`, ref }, { status: 500 });
}
