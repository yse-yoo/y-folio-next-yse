import { User } from "@/types/User";
import { Portfolio } from "@/types/Portforio";
import type { InterviewCompanyContext, InterviewEvaluation } from "@/types/Interview";
import { GoogleGenAI } from "@google/genai";
// import { getIndustryProfile, getJobTypeProfile } from "@/data/IndustryData";
import { simpleIndustries, simpleJobTypes } from "@/data/SimpleIndustryData";

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  throw new Error("Gemini APIキーが設定されていません。.env.localを確認してください。");
}

export const genAI = new GoogleGenAI({ apiKey });

type BasicQuestion = { id: number; question: string };

interface EvaluationPromptParams {
  user?: Partial<User> | null;
  portfolio?: Partial<Portfolio> | null;
  questions: BasicQuestion[];
  answers: string[];
  guidelines: string[];
  additionalContext?: string[];
}

const clampScore = (value: number) => {
  if (Number.isNaN(value)) return undefined;
  return Math.max(0, Math.min(100, Math.round(value)));
};


const truncate = (value: string, maxLength: number) => {
  if (value.length <= maxLength) return value;
  return `${value.slice(0, maxLength)}...`;
};

const parseGeminiJson = (text: string) => {
  const trimmed = text.trim();
  if (!trimmed) {
    throw new Error("Gemini APIの応答が空です");
  }
  try {
    return JSON.parse(trimmed);
  } catch {
    const fallback = trimmed.match(/\{[\s\S]*\}/);
    if (!fallback) {
      throw new Error("Gemini APIの応答をJSONとして解析できませんでした");
    }
    return JSON.parse(fallback[0]);
  }
};

const formatApplicantProfile = ({ user, portfolio }: { user?: Partial<User> | null; portfolio?: Partial<Portfolio> | null }) => {
  const lines: string[] = [];
  const name = user?.name ?? portfolio?.name ?? "未登録";
  const university = user?.university ?? portfolio?.university ?? "未登録";
  const department = user?.department ?? portfolio?.faculty ?? "未登録";
  const intro = portfolio?.selfIntroduction ?? user?.selfIntroduction ?? "未登録";

  const portfolioSkills = Array.isArray(portfolio?.skills)
    ? portfolio?.skills?.filter((skill): skill is string => typeof skill === "string" && skill.trim().length > 0)
    : typeof portfolio?.skills === "string"
      ? [portfolio.skills]
      : [];
  const userProgrammingSkills = Array.isArray(user?.skills?.programming)
    ? user?.skills?.programming.filter((skill): skill is string => typeof skill === "string" && skill.trim().length > 0)
    : [];
  const userFrameworkSkills = Array.isArray(user?.skills?.frameworks)
    ? user?.skills?.frameworks.filter((skill): skill is string => typeof skill === "string" && skill.trim().length > 0)
    : [];

  const mergedSkills = [...portfolioSkills, ...userProgrammingSkills, ...userFrameworkSkills];
  const skillsText = mergedSkills.length > 0 ? Array.from(new Set(mergedSkills)).join("、") : "未登録";

  lines.push(`氏名: ${name}`);
  lines.push(`大学: ${university}`);
  lines.push(`学部/学科: ${department}`);
  lines.push(`自己紹介: ${intro}`);
  lines.push(`スキル: ${skillsText}`);
  lines.push(`インターン: ${portfolio?.internship ?? "未登録"}`);
  lines.push(`課外活動: ${portfolio?.extracurricular ?? "未登録"}`);
  lines.push(`受賞歴: ${portfolio?.awards ?? (user?.awards ?? "未登録")}`);
  lines.push(`経験: ${portfolio?.experience ?? "未登録"}`);

  return lines.join("\n");
};

const buildQaSection = (questions: BasicQuestion[], answers: string[]) =>
  questions
    .map((q, index) => {
      const answer = answers[index] ?? "";
      const normalizedAnswer = answer.trim().length > 0 ? answer.trim() : "未回答";
      return `Q${index + 1}: ${q.question}\nA: ${normalizedAnswer}`;
    })
    .join("\n\n");

const formatCompanyContextForPrompt = (context?: InterviewCompanyContext | null) => {
  if (!context) return "";

  const lines: string[] = [];
  if (context.url) lines.push(`参照URL: ${context.url}`);
  if (context.summary) lines.push(`概要: ${truncate(context.summary, 600)}`);

  if (Array.isArray(context.highlights) && context.highlights.length > 0) {
    const highlightLines = context.highlights
      .filter((item): item is string => typeof item === "string" && item.trim().length > 0)
      .slice(0, 5)
      .map((item, idx) => `${idx + 1}. ${truncate(item.trim(), 120)}`);
    if (highlightLines.length > 0) {
      lines.push("注目ポイント:");
      highlightLines.forEach(item => lines.push(`  ${item}`));
    }
  }

  if (context.extraNotes) lines.push(`追加メモ: ${truncate(context.extraNotes, 400)}`);
  if (context.rawTextSnippet) lines.push(`サイト抜粋: ${truncate(context.rawTextSnippet, 600)}`);

  if (lines.length === 0) return "";
  return `\n【企業情報】\n${lines.join("\n")}`;
};

const buildCompanyContextNotes = (context?: InterviewCompanyContext | null) => {
  if (!context) return [];
  const notes: string[] = [];
  if (context.summary) notes.push(`企業要約: ${truncate(context.summary, 600)}`);
  if (Array.isArray(context.highlights)) {
    const highlightText = context.highlights
      .filter((item): item is string => typeof item === "string" && item.trim().length > 0)
      .map(item => item.trim())
      .join(" / ");
    if (highlightText) notes.push(`注目ポイント: ${truncate(highlightText, 400)}`);
  }
  if (context.extraNotes) notes.push(`追加情報: ${truncate(context.extraNotes, 400)}`);
  if (context.rawTextSnippet) notes.push(`サイト抜粋: ${truncate(context.rawTextSnippet, 600)}`);
  if (context.url) notes.push(`参照URL: ${context.url}`);
  return notes;
};

const evaluateAnswersWithGemini = async ({
  user,
  portfolio,
  questions,
  answers,
  guidelines,
  additionalContext,
}: EvaluationPromptParams): Promise<InterviewEvaluation> => {
  if (!Array.isArray(questions) || questions.length === 0) {
    throw new Error("評価する質問がありません");
  }
  if (!Array.isArray(answers) || answers.length === 0) {
    throw new Error("評価する回答がありません");
  }

  const qaSection = buildQaSection(questions, answers);
  const applicantProfile = formatApplicantProfile({ user, portfolio });
  const guidelineText = guidelines
    .map((item, idx) => `${idx + 1}. ${item}`)
    .join("\n");
  const extraContext = Array.isArray(additionalContext) && additionalContext.length > 0
    ? `\n\n### 補足情報\n${additionalContext.join("\n")}`
    : "";

  const prompt = `あなたは日本語圏の大手企業で働くシニア面接官です。応募者の回答をもとに、総合的な人物評価と今後の成長につながるフィードバックを作成してください。判断は日本語で行い、建設的で分かりやすい表現を心掛けてください。\n\n### 応募者情報\n${applicantProfile}${extraContext}\n\n### 質問と回答\n${qaSection}\n\n### 評価指針\n${guidelineText}\n\n### 出力形式（JSON）\n{"score": 0 から 100 の整数値, "summary": "300文字以内の総評", "strengths": ["50文字以内の強み"], "improvements": ["50文字以内の改善提案"]}\n\n出力は上記のJSONのみとし、追加の文章や注釈は付けないでください。`;

  const response = await genAI.models.generateContent({
    model: "gemini-2.0-flash",
    config: { responseMimeType: "application/json" },
    contents: [
      {
        parts: [
          {
            text: prompt,
          },
        ],
      },
    ],
  });

  const responseText = response.candidates
    ?.flatMap(candidate => candidate.content?.parts ?? [])
    .map(part => part?.text ?? "")
    .join("") ?? "";

  const parsed = parseGeminiJson(responseText);

  const score = typeof parsed.score === "number" ? clampScore(parsed.score) : undefined;
  const summary = typeof parsed.summary === "string" ? parsed.summary.trim() : undefined;
  const strengths = Array.isArray(parsed.strengths)
  ? parsed.strengths
    .filter((item: unknown): item is string => typeof item === "string" && item.trim().length > 0)
    .map((item: string) => item.trim())
    : [];
  const improvements = Array.isArray(parsed.improvements)
    ? parsed.improvements
    .filter((item: unknown): item is string => typeof item === "string" && item.trim().length > 0)
    .map((item: string) => item.trim())
    : [];

  const evaluation: InterviewEvaluation = {};
  if (typeof score === "number") evaluation.score = score;
  if (summary) evaluation.summary = summary;
  if (strengths.length > 0) evaluation.strengths = strengths;
  if (improvements.length > 0) evaluation.improvements = improvements;

  return evaluation;
};

// Google Gemini API(@google/genai)を使った面接質問生成
export async function generateInterviewQuestionsWithGemini({
  user,
  portfolio,
  companyContext,
}: {
  user: User;
  portfolio: Portfolio;
  companyContext?: InterviewCompanyContext | null;
}) {
  const companySection = formatCompanyContextForPrompt(companyContext);

  const prompt = `
あなたは面接官です。以下の応募者情報をもとに、総合面接で使う質問を5つ日本語で作成してください。

【応募者情報】
氏名: ${user.name}
大学: ${user.university}
学科: ${user.department}
自己紹介: ${user.selfIntroduction}
スキル: ${(portfolio.skills || []).join(", ")}
インターン: ${portfolio.internship || ""}
課外活動: ${portfolio.extracurricular || ""}
受賞歴: ${portfolio.awards || ""}
経験: ${portfolio.experience || ""}
${companySection}

【質問作成ルール】
1. 質問は対話形式で120文字以内にしてください。
2. 志望動機、人物像（価値観・強み）、学生時代に力を入れた経験をバランス良く取り上げてください。
3. 学科に関する質問では、その学部で何を学んだかを簡潔に確認してください。
4. スキルについては1つを選び、深掘りする質問にしてください。
5. 経験については、その経験を通して何を学んだかを尋ねてください。
6. 応募者の回答を引き出すために、自然な会話調で質問を始めてください。
`;

  const contents = [
    {
      parts: [
        {
          text: prompt,
        },
      ],
    },
  ];

  const response = await genAI.models.generateContent({
    model: "gemini-2.0-flash",
    config: { responseMimeType: "text/plain" },
    contents,
  });
  const responseText = response.candidates?.[0]?.content?.parts?.[0]?.text || "";
  const lines = responseText.split("\n").filter(Boolean);
  return lines.map((q, i) => ({ id: i + 1, question: q.replace(/^[0-9.\-\s]+/, "") }));
}

// シンプルな業界・職種特化面接質問生成
export async function generateIndustrySpecificQuestions({
  user,
  portfolio,
  industry,
  jobType,
  companyContext,
}: {
  user: User;
  portfolio: Portfolio;
  industry: string;
  jobType: string;
  companyContext?: InterviewCompanyContext | null;
}) {
  const industryData = simpleIndustries.find(i => i.id === industry);
  const jobTypeData = simpleJobTypes[industry]?.find(j => j.id === jobType);
  
  if (!industryData || !jobTypeData) {
    throw new Error('無効な業界・職種です');
  }

  const companySection = formatCompanyContextForPrompt(companyContext);

  const prompt = `
あなたは${industryData.name}業界の${jobTypeData.name}職種の面接官です。
以下の応募者情報をもとに、${jobTypeData.name}職種に特化した面接質問を5つ日本語で作成してください。

【応募者情報】
氏名: ${user.name}
大学: ${user.university}
学科: ${user.department}
自己紹介: ${user.selfIntroduction}
スキル: ${(portfolio.skills || []).join(", ")}
インターン: ${portfolio.internship || ""}
課外活動: ${portfolio.extracurricular || ""}
受賞歴: ${portfolio.awards || ""}
経験: ${portfolio.experience || ""}

【業界・職種情報】
業界: ${industryData.name}
業界説明: ${industryData.description}
職種: ${jobTypeData.name}
職種説明: ${jobTypeData.description}
${companySection}

【質問作成指針】
1. ${industryData.name}業界の特性を反映した質問
2. ${jobTypeData.name}職種に必要なスキルを問う質問
3. 応募者の経験と業界・職種の関連性を探る質問
4. 業界の課題やトレンドに関する質問
5. 職種特有の業務内容に関する質問

【出力形式】
- 質問は対話形式、120文字以内で出力してください
- 業界特有の専門用語を含めてください
- 職種に必要なスキルを評価できる質問にしてください
- 応募者の経験を活かした具体的な質問にしてください
`;

  const contents = [
    {
      parts: [{ text: prompt }],
    },
  ];

  const response = await genAI.models.generateContent({
    model: "gemini-2.0-flash",
    config: { responseMimeType: "text/plain" },
    contents,
  });
  
  const responseText = response.candidates?.[0]?.content?.parts?.[0]?.text || "";
  const lines = responseText.split("\n").filter(Boolean);
  return lines.map((q, i) => ({ id: i + 1, question: q.replace(/^[0-9.\-\s]+/, "") }));
}

export async function evaluateGeneralInterviewAnswers({
  user,
  portfolio,
  questions,
  answers,
  companyContext,
}: {
  user?: Partial<User> | null;
  portfolio?: Partial<Portfolio> | null;
  questions: BasicQuestion[];
  answers: string[];
  companyContext?: InterviewCompanyContext | null;
}) {
  const guidelines = [
    "志望動機とキャリア目標が一貫しているかを評価してください。",
    "学生時代の経験やエピソードが具体性と学びを伴っているかを確認してください。",
    "スキルや強みが実際の経験や成果で裏付けられているかを評価してください。",
    "回答全体の論理構成とコミュニケーションの分かりやすさを評価してください。",
  ];

  const additionalContext = buildCompanyContextNotes(companyContext);

  return evaluateAnswersWithGemini({ user, portfolio, questions, answers, guidelines, additionalContext });
}

export async function evaluateIndustrySpecificAnswers({
  user,
  portfolio,
  questions,
  answers,
  industry,
  jobType,
  companyContext,
}: {
  user?: Partial<User> | null;
  portfolio?: Partial<Portfolio> | null;
  questions: BasicQuestion[];
  answers: string[];
  industry: string;
  jobType: string;
  companyContext?: InterviewCompanyContext | null;
}) {
  const industryData = simpleIndustries.find(item => item.id === industry);
  const jobTypeData = simpleJobTypes[industry]?.find(item => item.id === jobType);

  if (!industryData || !jobTypeData) {
    throw new Error('無効な業界・職種です');
  }

  const guidelines = [
    `${industryData.name}業界に求められる視点や課題意識が回答から伝わるかを評価してください。`,
    `${jobTypeData.name}として必要なスキル・知識を具体的な経験で示せているかを評価してください。`,
    "成果や役割の説明に具体的な数字や工夫が含まれているかを確認してください。",
    "改善提案では業界・職種の特性に即したアドバイスを提示してください。",
  ];

  const additionalContext = [
    `業界: ${industryData.name}`,
    `業界説明: ${industryData.description}`,
    `職種: ${jobTypeData.name}`,
    `職種説明: ${jobTypeData.description}`,
    ...buildCompanyContextNotes(companyContext),
  ];

  const evaluation = await evaluateAnswersWithGemini({
    user,
    portfolio,
    questions,
    answers,
    guidelines,
    additionalContext,
  });

  const totalScore = typeof evaluation.score === "number" ? evaluation.score : undefined;
  const strengths = Array.isArray(evaluation.strengths) ? evaluation.strengths : [];
  const improvements = Array.isArray(evaluation.improvements) ? evaluation.improvements : [];

  const extendedEvaluation: InterviewEvaluation = {
    ...evaluation,
    totalScore,
    categoryScores: evaluation.categoryScores ?? [
      { category: "業界理解", score: totalScore },
      { category: "職種適性", score: totalScore },
      { category: "コミュニケーション", score: totalScore },
    ],
    evaluations: evaluation.evaluations ?? strengths,
    overallFeedback: evaluation.overallFeedback ?? evaluation.summary,
    industrySpecificAdvice: evaluation.industrySpecificAdvice ?? improvements,
  };

  return extendedEvaluation;
}