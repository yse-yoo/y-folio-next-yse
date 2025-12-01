import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import type { ResumeReviewLogEntry, ResumeReviewTrendPoint } from "@/types/AiReview";

const DEFAULT_LIMIT = 10;
const TREND_LOOKBACK = 60;

const toSectionStats = (value: unknown) => {
  if (!Array.isArray(value)) {
    return [] as ResumeReviewLogEntry["sectionStats"];
  }

  return value
    .map(item => {
      if (!item || typeof item !== "object") return null;
      const record = item as Record<string, unknown>;
      const sectionId = typeof record.sectionId === "string" ? record.sectionId : "";
      const sectionTitle = typeof record.sectionTitle === "string" ? record.sectionTitle : sectionId;
      const score = typeof record.score === "number" && !Number.isNaN(record.score)
        ? record.score
        : null;
      return { sectionId, sectionTitle, score };
    })
    .filter((item): item is ResumeReviewLogEntry["sectionStats"][number] => Boolean(item && item.sectionId));
};

const buildTrend = (entries: ResumeReviewLogEntry[]): ResumeReviewTrendPoint[] => {
  const aggregate = new Map<string, { total: number; scoredCount: number; count: number }>();
  entries.forEach(entry => {
    const dateKey = entry.createdAt.slice(0, 10);
    const existing = aggregate.get(dateKey) ?? { total: 0, scoredCount: 0, count: 0 };
    existing.count += 1;
    if (typeof entry.overallScore === "number" && !Number.isNaN(entry.overallScore)) {
      existing.total += entry.overallScore;
      existing.scoredCount += 1;
    }
    aggregate.set(dateKey, existing);
  });

  return Array.from(aggregate.entries())
    .sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0))
    .map(([date, value]) => ({
      date,
      count: value.count,
      averageScore: value.scoredCount > 0
        ? Math.round((value.total / value.scoredCount) * 10) / 10
        : null,
    }));
};

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId")?.trim();
    const limitParam = searchParams.get("limit");

    if (!userId) {
      return NextResponse.json({ error: "userId is required" }, { status: 400 });
    }

    const limit = Math.min(
      Math.max(Number.parseInt(limitParam ?? "", 10) || DEFAULT_LIMIT, DEFAULT_LIMIT),
      50,
    );

    const logs = await prisma.reviewLog.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: Math.max(limit, TREND_LOOKBACK),
    });

    const entries: ResumeReviewLogEntry[] = logs.map(log => ({
      id: log.id,
      createdAt: log.createdAt.toISOString(),
      tone: (log.tone as ResumeReviewLogEntry["tone"]) ?? "keigo",
      language: (log.language as ResumeReviewLogEntry["language"]) ?? "ja",
      writingStyle: log.writingStyle ? (log.writingStyle as ResumeReviewLogEntry["writingStyle"]) : undefined,
      overallScore: log.overallScore ?? null,
      averageSectionScore: log.averageSectionScore ?? null,
      totalSections: log.totalSections,
      sectionStats: toSectionStats(log.sectionStats),
    }));

    const trend = buildTrend(entries.slice().reverse());

    return NextResponse.json({
      entries: entries.slice(0, limit),
      trend,
    });
  } catch (error) {
    console.error("Failed to load review logs", error);
    return NextResponse.json({ error: "レビュー履歴の取得に失敗しました" }, { status: 500 });
  }
}
