import { NextRequest, NextResponse } from "next/server";
import { evaluateGeneralInterviewAnswers, evaluateIndustrySpecificAnswers } from "@/lib/gemini";

export async function POST(req: NextRequest) {
  try {
    const {
      user,
      portfolio,
      type,
      questions,
      answers,
      industry,
      jobType,
      companyContext,
    } = await req.json();

    const normalizedQuestions = Array.isArray(questions)
      ? questions
          .map((item) => {
            const id = typeof item?.id === "number" ? item.id : Number(item?.id);
            const questionText = typeof item?.question === "string" ? item.question.trim() : "";
            if (!Number.isFinite(id) || !questionText) return null;
            return { id, question: questionText };
          })
          .filter((item): item is { id: number; question: string } => item !== null)
      : [];

    if (normalizedQuestions.length === 0) {
      return NextResponse.json(
        { error: "questionsが不足しています" },
        { status: 400 }
      );
    }

    const answerEntries = Array.isArray(answers)
      ? answers
          .map((entry) => {
            if (typeof entry === "string") {
              return { questionId: null, answer: entry };
            }
            const answerText = typeof entry?.answer === "string" ? entry.answer : "";
            const id = typeof entry?.questionId === "number" ? entry.questionId : Number(entry?.questionId);
            return {
              questionId: Number.isFinite(id) ? id : null,
              answer: answerText,
            };
          })
      : [];

    if (answerEntries.length === 0) {
      return NextResponse.json(
        { error: "answersが不足しています" },
        { status: 400 }
      );
    }

    const answerMap = new Map<number, string>();
    answerEntries.forEach((entry) => {
      if (entry.questionId !== null && typeof entry.answer === "string") {
        answerMap.set(entry.questionId, entry.answer);
      }
    });

    const orderedAnswers = normalizedQuestions.map((question, index) => {
      const mapped = answerMap.get(question.id);
      if (typeof mapped === "string") {
        return mapped;
      }
      const fallback = answerEntries[index]?.answer ?? "";
      return typeof fallback === "string" ? fallback : "";
    });

    const interviewType = typeof type === "string" ? type : "general";

    const evaluation = interviewType === "general" || !industry || !jobType
      ? await evaluateGeneralInterviewAnswers({
          user: user ?? null,
          portfolio: portfolio ?? null,
          questions: normalizedQuestions,
          answers: orderedAnswers,
          companyContext: companyContext ?? null,
        })
      : await evaluateIndustrySpecificAnswers({
          user: user ?? null,
          portfolio: portfolio ?? null,
          questions: normalizedQuestions,
          answers: orderedAnswers,
          industry,
          jobType,
          companyContext: companyContext ?? null,
        });

    return NextResponse.json({ evaluation });
  } catch (e) {
    console.error('評価生成エラー:', e);
    return NextResponse.json(
      { 
        error: "評価生成に失敗しました",
        details: e instanceof Error ? e.message : "不明なエラー"
      }, 
      { status: 500 }
    );
  }
}



