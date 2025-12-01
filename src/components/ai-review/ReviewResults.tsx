'use client';

import { useMemo } from "react";
import { diffWords } from "diff";
import type {
  ResumeReviewResponse,
  ResumeSectionInput,
  SectionReviewFeedback,
} from "@/types/AiReview";

interface ReviewResultsProps {
  originalSections: ResumeSectionInput[];
  result: ResumeReviewResponse;
}

const buildDiff = (source: string, target: string) => {
  const parts = diffWords(source, target);
  return parts.map((part, index) => {
    if (part.added) {
      return (
        <span key={`added-${index}`} className="bg-emerald-100 text-emerald-800 px-0.5 rounded">
          {part.value}
        </span>
      );
    }
    if (part.removed) {
      return (
        <span key={`removed-${index}`} className="bg-rose-100 text-rose-800 line-through px-0.5 rounded">
          {part.value}
        </span>
      );
    }
    return (
      <span key={`kept-${index}`}>{part.value}</span>
    );
  });
};

const SectionCard = ({
  data,
  originalText,
}: {
  data: SectionReviewFeedback;
  originalText: string;
}) => (
  <section className="border border-slate-200 rounded-lg bg-white shadow-sm">
    <header className="border-b border-slate-100 px-4 py-3">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h3 className="text-base font-semibold text-slate-900">{data.sectionTitle || data.sectionId}</h3>
        {typeof data.score === "number" && (
          <span className="text-sm font-medium text-slate-500">スコア: {data.score}/100</span>
        )}
      </div>
      {data.summary && (
        <p className="mt-2 text-sm text-slate-600">{data.summary}</p>
      )}
    </header>
    <div className="grid gap-4 p-4 lg:grid-cols-2">
      <div>
        <h4 className="mb-2 text-sm font-semibold text-slate-700">添削前</h4>
        <p className="whitespace-pre-wrap text-sm text-slate-600">{originalText || "(入力なし)"}</p>
      </div>
      <div>
        <h4 className="mb-2 text-sm font-semibold text-slate-700">差分ハイライト</h4>
        <p className="whitespace-pre-wrap text-sm text-slate-700">{buildDiff(originalText, data.revisedText)}</p>
        <h4 className="mt-4 mb-2 text-sm font-semibold text-slate-700">添削後</h4>
        <p className="whitespace-pre-wrap text-sm text-slate-700">{data.revisedText}</p>
      </div>
    </div>
    {data.categories.length > 0 && (
      <div className="border-t border-slate-100 bg-slate-50 px-4 py-3">
        <h4 className="text-sm font-semibold text-slate-700">改善ポイント</h4>
        <ul className="mt-2 grid gap-2 md:grid-cols-2">
          {data.categories.map((category, index) => (
            <li key={`${data.sectionId}-${index}`} className="rounded border border-slate-200 bg-white p-3 text-sm text-slate-700">
              <div className="flex items-center justify-between gap-2">
                <span className="font-semibold text-slate-800">{category.label}</span>
                <span className="rounded bg-slate-100 px-2 py-0.5 text-xs uppercase tracking-wide text-slate-500">{category.priority}</span>
              </div>
              {category.comment && <p className="mt-2 text-slate-600">{category.comment}</p>}
              {category.suggestion && (
                <p className="mt-1 text-slate-600"><span className="font-semibold text-slate-700">提案:</span> {category.suggestion}</p>
              )}
              {category.example && (
                <p className="mt-1 text-slate-600"><span className="font-semibold text-slate-700">例:</span> {category.example}</p>
              )}
            </li>
          ))}
        </ul>
      </div>
    )}
  </section>
);

export const ReviewResults = ({ originalSections, result }: ReviewResultsProps) => {
  const originalMap = useMemo(() => {
    const map = new Map<string, ResumeSectionInput>();
    originalSections.forEach(section => {
      map.set(section.id, section);
    });
    return map;
  }, [originalSections]);

  return (
    <div className="mt-6 space-y-6">
      <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">総評</h2>
        {result.overallSummary && (
          <p className="mt-2 text-sm text-slate-700">{result.overallSummary}</p>
        )}
        {typeof result.overallScore === "number" && (
          <p className="mt-3 inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-600">
            総合スコア: {result.overallScore}/100
          </p>
        )}
        {result.styleCompliance && (
          <div className="mt-3 rounded border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-600">
            <span className="font-semibold text-slate-700">スタイル遵守:</span>{" "}
            {result.styleCompliance.matched ? "指示に適合" : "指示から一部逸脱"}
            {result.styleCompliance.notes && (
              <p className="mt-1 text-xs text-slate-500">{result.styleCompliance.notes}</p>
            )}
          </div>
        )}
        {result.suggestions && result.suggestions.length > 0 && (
          <div className="mt-4">
            <h3 className="text-sm font-semibold text-slate-700">追加アドバイス</h3>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-600">
              {result.suggestions.map((item, index) => (
                <li key={`suggestion-${index}`}>{item}</li>
              ))}
            </ul>
          </div>
        )}
      </section>

      {result.sections.length > 0 && (
        <div className="space-y-4">
          {result.sections.map(section => {
            const original = originalMap.get(section.sectionId) ?? originalMap.values().next().value;
            return (
              <SectionCard
                key={section.sectionId}
                data={section}
                originalText={original?.text ?? ""}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ReviewResults;
