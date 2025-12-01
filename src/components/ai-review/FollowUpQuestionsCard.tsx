'use client';

import { useState } from "react";
import type { FollowUpQuestion } from "@/types/AiReview";

interface FollowUpQuestionsCardProps {
  questions: FollowUpQuestion[];
  onSubmit: (question: FollowUpQuestion, answer: string) => Promise<void> | void;
  onSkip?: (question: FollowUpQuestion) => void;
  disabled?: boolean;
}

export const FollowUpQuestionsCard = ({ questions, onSubmit, onSkip, disabled }: FollowUpQuestionsCardProps) => {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [processingId, setProcessingId] = useState<string | null>(null);

  if (questions.length === 0) {
    return null;
  }

  const handleSubmit = async (question: FollowUpQuestion) => {
    const answer = answers[question.id]?.trim();
    if (!answer) return;
    try {
      setProcessingId(question.id);
      await onSubmit(question, answer);
      setAnswers(prev => {
        const next = { ...prev };
        delete next[question.id];
        return next;
      });
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <section className="rounded-lg border border-amber-200 bg-amber-50 p-5 shadow-inner">
      <h2 className="text-base font-semibold text-amber-900">AIが追加情報を求めています</h2>
      <p className="mt-1 text-sm text-amber-800">不足している内容を補足すると、より精度の高い添削が可能になります。</p>
      <div className="mt-4 space-y-4">
        {questions.map(question => (
          <div key={question.id} className="rounded border border-amber-200 bg-white p-4">
            <div className="flex flex-col gap-1 text-sm text-slate-700">
              <span className="font-semibold text-slate-900">質問:</span>
              <p>{question.question}</p>
            </div>
            {question.reason && (
              <p className="mt-2 text-xs text-slate-500">理由: {question.reason}</p>
            )}
            {question.missingInfoHint && (
              <p className="mt-1 text-xs text-slate-500">ヒント: {question.missingInfoHint}</p>
            )}
            <textarea
              value={answers[question.id] ?? ""}
              onChange={event => setAnswers(prev => ({ ...prev, [question.id]: event.target.value }))}
              className="mt-3 w-full rounded border border-amber-200 px-3 py-2 text-sm text-slate-700 focus:border-amber-400 focus:outline-none"
              rows={3}
              placeholder="補足情報を入力してください"
              disabled={disabled || processingId !== null}
            />
            <div className="mt-3 flex flex-wrap items-center gap-3 text-sm">
              <button
                type="button"
                onClick={() => handleSubmit(question)}
                className="rounded bg-amber-600 px-4 py-2 font-semibold text-white hover:bg-amber-700 disabled:opacity-60"
                disabled={disabled || processingId !== null || !answers[question.id]?.trim()}
              >
                {processingId === question.id ? "適用中..." : "回答を適用"}
              </button>
              {onSkip && (
                <button
                  type="button"
                  onClick={() => onSkip(question)}
                  className="text-xs text-amber-700 hover:text-amber-900"
                  disabled={disabled || processingId !== null}
                >
                  今はスキップ
                </button>
              )}
              {question.sectionId && (
                <span className="text-xs text-slate-500">対象セクション: {question.sectionId}</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FollowUpQuestionsCard;
