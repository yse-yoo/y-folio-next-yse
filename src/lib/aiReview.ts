import { genAI } from "@/lib/gemini";
import type {
  FollowUpQuestion,
  ResumeReviewRequestPayload,
  ResumeReviewResponse,
  ResumeSectionInput,
  ReviewCategoryFeedback,
  ReviewCategoryId,
  ReviewStyleCompliance,
  SectionReviewFeedback,
} from "@/types/AiReview";

const normaliseWritingStyle = (value: ResumeReviewRequestPayload["writingStyle"]) => value ?? "formal";
const normaliseHonorific = (value: ResumeReviewRequestPayload["honorific"]) => value ?? "standard";
const normaliseAudience = (value: ResumeReviewRequestPayload["audience"]) => value ?? "external";

const clampScore = (value: number) => {
  if (Number.isNaN(value)) return undefined;
  return Math.max(0, Math.min(100, Math.round(value)));
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

const REVIEW_CATEGORY_LABELS: Record<ReviewCategoryId, string> = {
  clarity: "明瞭さ・表現",
  structure: "構成",
  quantitative: "定量的アピール",
  story: "ストーリー",
  fit: "企業適合性",
  tone: "トーン・敬語",
  grammar: "文法・表記",
  other: "その他",
};

const normalizeCategoryId = (value: unknown): ReviewCategoryId => {
  if (typeof value !== "string") return "other";
  const normalized = value.trim().toLowerCase();

  switch (normalized) {
    case "clarity":
    case "明瞭さ":
    case "わかりやすさ":
      return "clarity";
    case "structure":
    case "構成":
    case "ロジック":
      return "structure";
    case "quantitative":
    case "metrics":
    case "numbers":
    case "定量":
    case "数値":
      return "quantitative";
    case "story":
    case "ストーリー":
    case "narrative":
      return "story";
    case "fit":
    case "alignment":
    case "企業適合性":
    case "cultural fit":
      return "fit";
    case "tone":
    case "tone_style":
    case "敬語":
    case "トーン":
      return "tone";
    case "grammar":
    case "文法":
    case "スペル":
      return "grammar";
    default:
      return "other";
  }
};

const normalizePriority = (value: unknown): "high" | "medium" | "low" => {
  const normalized = typeof value === "string" ? value.trim().toLowerCase() : "";
  if (normalized === "high" || normalized === "medium" || normalized === "low") {
    return normalized;
  }
  return "medium";
};

const sanitizeSectionInput = (section: ResumeSectionInput, index: number) => {
  const fallbackTitle = `セクション${index + 1}`;
  return {
    id: section.id || `section-${index + 1}`,
    title: section.title?.trim() || fallbackTitle,
    text: section.text?.trim() ?? "",
  };
};

const writingStyleInstruction = (value: ResumeReviewRequestPayload["writingStyle"]) => {
  const writingStyle = normaliseWritingStyle(value);
  switch (writingStyle) {
    case "neutral":
      return "過度に形式ばらず、読み手がすぐ理解できるニュートラルな文体でまとめてください。";
    case "story":
      return "具体的なエピソードや成果を盛り込み、ストーリー性を感じさせる文体に整えてください。";
    default:
      return "ビジネス用途に適したフォーマルな文体を維持してください。";
  }
};

const honorificInstruction = (value: ResumeReviewRequestPayload["honorific"]) => {
  const honorific = normaliseHonorific(value);
  switch (honorific) {
    case "respectful":
      return "敬語は尊敬語・謙譲語を適切に使い分け、丁寧さを最優先してください。";
    case "none":
      return "敬語は使用せず、簡潔で直接的な表現を使ってください。";
    default:
      return "丁寧語（です・ます調）を基本とし、過度に堅苦しくならないよう整えてください。";
  }
};

const audienceInstruction = (value: ResumeReviewRequestPayload["audience"]) => {
  const audience = normaliseAudience(value);
  return audience === "internal"
    ? "社内向け資料として、読み手が同じ組織のメンバーである前提で表現してください。専門用語は必要に応じて補足してください。"
    : "社外の採用担当者を想定し、背景を知らない相手にも伝わるよう用語を説明しながら表現してください。";
};

const formatSectionsForPrompt = (sections: ResumeSectionInput[]) =>
  sections
    .map((section, index) => {
      const sanitized = sanitizeSectionInput(section, index);
      return `### Section ${index + 1}`
        + `\nID: ${sanitized.id}`
        + `\nTitle: ${sanitized.title}`
        + `\nText: ${sanitized.text || "(empty)"}`;
    })
    .join("\n\n");

const normalizeStyleCompliance = (value: unknown): ReviewStyleCompliance | undefined => {
  if (!value || typeof value !== "object") return undefined;
  const raw = value as { matched?: unknown; notes?: unknown };
  const matched = typeof raw.matched === "boolean" ? raw.matched : undefined;
  const notes = typeof raw.notes === "string" ? raw.notes.trim() : undefined;
  if (matched === undefined && !notes) return undefined;
  return {
    matched: matched ?? true,
    notes,
  };
};

const normalizeFollowUpQuestions = (value: unknown): FollowUpQuestion[] | undefined => {
  if (!Array.isArray(value)) return undefined;

  const questions = value
    .map((item, index) => {
      if (!item || typeof item !== "object") return null;
      const raw = item as Record<string, unknown>;
      const id = typeof raw.id === "string" ? raw.id.trim() : `follow-up-${index + 1}`;
      const question = typeof raw.question === "string" ? raw.question.trim() : "";
      if (!question) return null;

      const sectionId = typeof raw.sectionId === "string" && raw.sectionId.trim().length > 0
        ? raw.sectionId.trim()
        : undefined;
      const reason = typeof raw.reason === "string" ? raw.reason.trim() : undefined;
      const hint = typeof raw.missingInfoHint === "string" ? raw.missingInfoHint.trim() : undefined;

      return {
        id,
        sectionId,
        question,
        reason,
        missingInfoHint: hint,
      } satisfies FollowUpQuestion;
    })
    .filter((item): item is FollowUpQuestion => item !== null);

  return questions.length > 0 ? questions : undefined;
};

export async function reviewResumeSections({
  sections,
  tone = "keigo",
  language = "ja",
  companyContext,
  writingStyle,
  honorific,
  audience,
  answeredFollowUps,
}: ResumeReviewRequestPayload): Promise<ResumeReviewResponse> {
  if (!Array.isArray(sections) || sections.length === 0) {
    throw new Error("添削するセクションがありません");
  }

  const sanitizedSections = sections
    .map((section, index) => sanitizeSectionInput(section, index))
    .filter(section => section.text.length > 0);

  if (sanitizedSections.length === 0) {
    throw new Error("内容が入力されたセクションがありません");
  }

  const contextSection = companyContext?.trim()
    ? `\n\n### Company Context\n${companyContext.trim()}`
    : "";

  const toneInstructions = (() => {
    switch (tone) {
      case "futsukei":
        return "常体（ですます調ではなく、である調）で推敲してください。";
      case "business":
        return "ビジネス文書として適切な敬語と語彙を意識してください。";
      case "casual":
        return "親しみやすく簡潔なトーンで調整してください。";
      default:
        return "丁寧語（ですます調）で自然な表現に整えてください。";
    }
  })();

  const languageInstruction = language === "en"
    ? "英語の履歴書として自然な表現にしてください。必要に応じて簡潔に意訳して構いません。"
    : "日本語の履歴書として自然な表現にしてください。";

  const followUpContext = Array.isArray(answeredFollowUps) && answeredFollowUps.length > 0
    ? `\n\n### 回答済みの追加情報\n${answeredFollowUps
      .map((item, index) => {
        const answer = typeof item.answer === "string" ? item.answer.trim() : "";
        return `Q${index + 1}: ${item.id}\nA: ${answer}`;
      })
      .join("\n\n")}`
    : "";

  const sectionText = formatSectionsForPrompt(sanitizedSections);

  const prompt = `あなたはキャリアコンサルタントです。以下の履歴書・職務経歴書のセクションを添削し、改善提案をJSON形式で出力してください。${contextSection}

${languageInstruction}
${toneInstructions}
${writingStyleInstruction(writingStyle)}
${honorificInstruction(honorific)}
${audienceInstruction(audience)}
指定されたスタイルへの整合性を自己チェックし、指示から逸脱していないか確認してください。

各セクションごとに、以下の観点を必ず確認してください。
- clarity: 表現の明瞭さや読みやすさ
- structure: 構成や論理の流れ
- quantitative: 数字や指標を使った定量的アピール
- story: エピソードの流れやストーリー性
- fit: 応募企業・職種との適合性
- tone: トーンや敬語の適切さ
- grammar: 文法やスペル
- other: 上記以外の重要な指摘

### 出力形式
{
  "overallSummary": "200文字以内の総評",
  "overallScore": 0から100までの整数,
  "sections": [
    {
      "sectionId": "元のID",
      "summary": "150文字以内の要約",
      "score": 0から100までの整数,
      "revisedText": "添削後の文章",
      "categories": [
        {
          "id": "clarity|structure|quantitative|story|fit|tone|grammar|other",
          "comment": "指摘内容を70文字程度で",
          "suggestion": "改善提案を70文字程度で",
          "example": "可能であれば改善例",
          "priority": "high|medium|low"
        }
      ]
    }
  ],
  "styleCompliance": {
    "matched": true,
    "notes": "スタイルが指示に従っているかのコメント（100文字以内）"
  },
  "followUpQuestions": [
    {
      "id": "不足情報の識別子",
      "sectionId": "追記が必要なセクションID（不明ならnull）",
      "question": "不足情報を確認するための質問。80文字以内",
      "reason": "なぜ必要なのかを50文字以内で",
      "missingInfoHint": "どのような情報が欲しいかのヒント"
    }
  ],
  "suggestions": ["全体に対するアドバイス"]
}

JSONのみで回答し、前後に文章を付けないでください。

### 添削対象
${sectionText}${followUpContext}`;

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

  const overallSummary = typeof parsed.overallSummary === "string"
    ? parsed.overallSummary.trim()
    : "";
  const overallScore = typeof parsed.overallScore === "number"
    ? clampScore(parsed.overallScore)
    : undefined;

  const sectionsFeedback: SectionReviewFeedback[] = Array.isArray(parsed.sections)
    ? parsed.sections
        .map((item: Record<string, unknown>) => {
          const sectionId = typeof item.sectionId === "string" ? item.sectionId : "";
          const targetSection = sanitizedSections.find(section => section.id === sectionId);
          const sectionTitle = targetSection?.title ?? sectionId ?? "未設定";

          const summary = typeof item.summary === "string" ? item.summary.trim() : "";
          const score = typeof item.score === "number" ? clampScore(item.score) : undefined;
          const revisedText = typeof item.revisedText === "string" && item.revisedText.trim().length > 0
            ? item.revisedText.trim()
            : targetSection?.text ?? "";

          const categories: ReviewCategoryFeedback[] = Array.isArray(item.categories)
            ? item.categories
                .map((category: Record<string, unknown>) => {
                  const id = normalizeCategoryId(category.id);
                  const comment = typeof category.comment === "string" ? category.comment.trim() : "";
                  const suggestion = typeof category.suggestion === "string" ? category.suggestion.trim() : "";
                  const example = typeof category.example === "string" ? category.example.trim() : undefined;
                  const priority = normalizePriority(category.priority);

                  if (!comment && !suggestion) {
                    return null;
                  }

                  return {
                    id,
                    label: REVIEW_CATEGORY_LABELS[id],
                    comment,
                    suggestion,
                    example,
                    priority,
                  };
                })
                .filter((category): category is ReviewCategoryFeedback => category !== null)
            : [];

          return {
            sectionId: sectionId || (targetSection?.id ?? ""),
            sectionTitle,
            summary,
            score,
            revisedText,
            categories,
          } satisfies SectionReviewFeedback;
        })
    : [];

  const suggestions = Array.isArray(parsed.suggestions)
    ? parsed.suggestions
        .filter((item: unknown): item is string => typeof item === "string" && item.trim().length > 0)
        .map(item => item.trim())
    : [];

  const result: ResumeReviewResponse = {
    overallSummary,
    overallScore,
    sections: sectionsFeedback,
    suggestions,
    styleCompliance: normalizeStyleCompliance(parsed.styleCompliance),
    followUpQuestions: normalizeFollowUpQuestions(parsed.followUpQuestions),
  };

  return result;
}
