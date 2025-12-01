import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import type {
  ResumeReviewHistoryEntry,
  ResumeReviewResponse,
  ResumeSectionInput,
  ReviewAudience,
  ReviewHonorific,
  ReviewLanguage,
  ReviewTone,
  ReviewWritingStyle,
} from "@/types/AiReview";

const HISTORY_LIMIT = 10;

const isReviewTone = (value: unknown): value is ReviewTone =>
  value === "keigo" || value === "futsukei" || value === "business" || value === "casual";

const isReviewLanguage = (value: unknown): value is ReviewLanguage =>
  value === "ja" || value === "en";

const normalizeTone = (value: unknown): ReviewTone => (isReviewTone(value) ? value : "keigo");
const normalizeLanguage = (value: unknown): ReviewLanguage => (isReviewLanguage(value) ? value : "ja");
const normalizeWritingStyle = (value: unknown): ReviewWritingStyle | undefined => {
  if (value === "formal" || value === "neutral" || value === "story") return value;
  return undefined;
};

const normalizeHonorific = (value: unknown): ReviewHonorific | undefined => {
  if (value === "standard" || value === "respectful" || value === "none") return value;
  return undefined;
};

const normalizeAudience = (value: unknown): ReviewAudience | undefined => {
  if (value === "internal" || value === "external") return value;
  return undefined;
};

const normalizeSections = (value: unknown): ResumeSectionInput[] => {
  if (!Array.isArray(value)) return [];
  return value
    .map((item, index) => {
      if (!item || typeof item !== "object") return null;
      const section = item as Partial<ResumeSectionInput>;
      const text = typeof section.text === "string" ? section.text : "";
      if (text.trim().length === 0) return null;
      const title = typeof section.title === "string" ? section.title : "";
      const id = typeof section.id === "string" ? section.id : `section-${index + 1}`;
      return {
        id,
        title: title || `セクション${index + 1}`,
        text: text.trim(),
      } satisfies ResumeSectionInput;
    })
    .filter((section): section is ResumeSectionInput => section !== null);
};

const normalizeResult = (value: unknown): ResumeReviewResponse => {
  if (!value || typeof value !== "object") {
    return { overallSummary: "", sections: [] } satisfies ResumeReviewResponse;
  }
  const raw = value as Partial<ResumeReviewResponse>;
  const overallSummary = typeof raw.overallSummary === "string" ? raw.overallSummary : "";
  const overallScore = typeof raw.overallScore === "number" ? raw.overallScore : undefined;
  const sections = Array.isArray(raw.sections)
    ? (raw.sections as ResumeReviewResponse["sections"])
    : [];
  const suggestions = Array.isArray(raw.suggestions)
    ? raw.suggestions.filter((item): item is string => typeof item === "string" && item.trim().length > 0)
    : undefined;

  return {
    overallSummary,
    overallScore,
    sections,
    suggestions,
  } satisfies ResumeReviewResponse;
};

const toEntry = (record: {
  id: string;
  createdAt: Date;
  tone: string;
  language: string;
  writingStyle?: string | null;
  honorific?: string | null;
  audience?: string | null;
  companyContext: string | null;
  sections: unknown;
  result: unknown;
  userId?: string;
}): ResumeReviewHistoryEntry => ({
  id: record.id,
  createdAt: record.createdAt.toISOString(),
  tone: normalizeTone(record.tone),
  language: normalizeLanguage(record.language),
  writingStyle: normalizeWritingStyle(record.writingStyle ?? undefined),
  honorific: normalizeHonorific(record.honorific ?? undefined),
  audience: normalizeAudience(record.audience ?? undefined),
  companyContext: record.companyContext ?? undefined,
  sections: normalizeSections(record.sections),
  result: normalizeResult(record.result),
});

const extractUserId = (request: NextRequest, fallback?: unknown) => {
  const header = request.headers.get("x-user-id");
  if (header && header.trim().length > 0) return header.trim();
  const searchParam = request.nextUrl.searchParams.get("userId");
  if (searchParam && searchParam.trim().length > 0) return searchParam.trim();
  if (typeof fallback === "string" && fallback.trim().length > 0) return fallback.trim();
  return null;
};

export async function GET(request: NextRequest) {
  try {
    const userId = extractUserId(request);
    if (!userId) {
      return NextResponse.json({ error: "ユーザーIDが必要です" }, { status: 401 });
    }

    const records = await prisma.resumeReviewHistory.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: HISTORY_LIMIT,
    });

    const entries = records.map(toEntry);
    return NextResponse.json({ entries });
  } catch (error) {
    console.error("Failed to fetch resume review history", error);
    return NextResponse.json({ error: "履歴の取得に失敗しました" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as Partial<ResumeReviewHistoryEntry> & { userId?: string };
    const userId = extractUserId(request, body.userId);
    if (!userId) {
      return NextResponse.json({ error: "ユーザーIDが必要です" }, { status: 401 });
    }

    const sections = normalizeSections(body.sections);
    if (sections.length === 0) {
      return NextResponse.json({ error: "保存するセクションがありません" }, { status: 400 });
    }

    if (!body.result) {
      return NextResponse.json({ error: "保存する添削結果がありません" }, { status: 400 });
    }

    const record = await prisma.resumeReviewHistory.create({
      data: {
        userId,
        tone: normalizeTone(body.tone),
        language: normalizeLanguage(body.language),
        writingStyle: normalizeWritingStyle(body.writingStyle) ?? null,
        honorific: normalizeHonorific(body.honorific) ?? null,
        audience: normalizeAudience(body.audience) ?? null,
        companyContext: typeof body.companyContext === "string" && body.companyContext.trim().length > 0
          ? body.companyContext.trim()
          : null,
        sections,
        result: normalizeResult(body.result),
      },
    });

    const entry = toEntry(record);
    return NextResponse.json({ entry }, { status: 201 });
  } catch (error) {
    console.error("Failed to store resume review history", error);
    return NextResponse.json({ error: "履歴の保存に失敗しました" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const body = request.method === "DELETE" && request.headers.get("content-type")?.includes("application/json")
      ? await request.json().catch(() => ({}))
      : {};

    const userId = extractUserId(request, (body as { userId?: string }).userId);
    if (!userId) {
      return NextResponse.json({ error: "ユーザーIDが必要です" }, { status: 401 });
    }

    const id = request.nextUrl.searchParams.get("id")
      ?? (typeof (body as { id?: string }).id === "string" ? (body as { id?: string }).id : null);

    if (id) {
      await prisma.resumeReviewHistory.deleteMany({ where: { id, userId } });
      return NextResponse.json({ success: true });
    }

    await prisma.resumeReviewHistory.deleteMany({ where: { userId } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete resume review history", error);
    return NextResponse.json({ error: "履歴の削除に失敗しました" }, { status: 500 });
  }
}
