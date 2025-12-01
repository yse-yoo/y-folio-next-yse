import { NextResponse } from "next/server";
import { reviewResumeSections } from "@/lib/aiReview";
import { prisma } from "@/lib/prisma";
import type { ResumeReviewRequestPayload } from "@/types/AiReview";

const computeAverage = (values: Array<number | null | undefined>) => {
  const numeric = values.filter((value): value is number => typeof value === "number" && !Number.isNaN(value));
  if (numeric.length === 0) {
    return null;
  }
  const total = numeric.reduce((sum, value) => sum + value, 0);
  return total / numeric.length;
};

const addDays = (base: Date, days: number) => {
  const next = new Date(base);
  next.setDate(next.getDate() + days);
  return next;
};

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as Partial<ResumeReviewRequestPayload>;

    if (!Array.isArray(payload.sections) || payload.sections.length === 0) {
      return NextResponse.json({ error: "添削するセクションを1つ以上入力してください" }, { status: 400 });
    }

    const response = await reviewResumeSections({
      sections: payload.sections,
      tone: payload.tone ?? "keigo",
      language: payload.language ?? "ja",
      companyContext: payload.companyContext,
      writingStyle: payload.writingStyle,
      honorific: payload.honorific,
      audience: payload.audience,
      answeredFollowUps: payload.answeredFollowUps,
    });

    const userId = typeof payload.userId === "string" && payload.userId.trim().length > 0
      ? payload.userId.trim()
      : undefined;

    try {
      const sectionStats = response.sections.map(section => ({
        sectionId: section.sectionId,
        sectionTitle: section.sectionTitle,
        score: typeof section.score === "number" ? section.score : null,
      }));

      const averageSectionScore = computeAverage(sectionStats.map(stat => stat.score));

      const log = await prisma.reviewLog.create({
        data: {
          userId,
          tone: payload.tone ?? "keigo",
          language: payload.language ?? "ja",
          writingStyle: payload.writingStyle ?? null,
          overallScore: typeof response.overallScore === "number" ? response.overallScore : null,
          averageSectionScore,
          totalSections: response.sections.length,
          sectionStats,
        },
      });

      if (userId) {
        const existingFollowUp = await prisma.reviewReminder.findFirst({
          where: {
            userId,
            type: "follow_up_review",
            status: "pending",
            scheduledAt: {
              gt: new Date(),
            },
          },
        });

        if (!existingFollowUp) {
          const reminderDays = typeof response.overallScore === "number"
            ? (response.overallScore < 80 ? 3 : 7)
            : 5;
          await prisma.reviewReminder.create({
            data: {
              userId,
              type: "follow_up_review",
              channel: "in-app",
              scheduledAt: addDays(new Date(), reminderDays),
              payload: {
                logId: log.id,
                overallScore: response.overallScore ?? null,
                sectionIds: sectionStats.map(stat => stat.sectionId),
              },
            },
          });
        }
      }
    } catch (logError) {
      console.error("Failed to persist review log", logError);
    }

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error("Failed to review resume sections", error);
    return NextResponse.json({ error: "AI添削でエラーが発生しました" }, { status: 500 });
  }
}
