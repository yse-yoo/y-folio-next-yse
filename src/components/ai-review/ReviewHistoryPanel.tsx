'use client';

import type { ResumeReviewHistoryEntry } from "@/types/AiReview";

interface ReviewHistoryPanelProps {
  history: ResumeReviewHistoryEntry[];
  onSelect: (entry: ResumeReviewHistoryEntry) => void;
  onDelete: (id: string) => void;
  onClear: () => void;
  disabled?: boolean;
}

const formatTimestamp = (iso: string) => {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "日時不明";
  return new Intl.DateTimeFormat("ja-JP", {
    month: "numeric",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
};

const toneLabel = {
  keigo: "丁寧語",
  futsukei: "常体",
  business: "ビジネス",
  casual: "カジュアル",
};

const languageLabel = {
  ja: "日本語",
  en: "英語",
};

const writingStyleLabel = {
  formal: "フォーマル",
  neutral: "ニュートラル",
  story: "ストーリー重視",
} as const;

const honorificLabel = {
  standard: "丁寧語",
  respectful: "尊敬/謙譲",
  none: "敬称なし",
} as const;

const audienceLabel = {
  internal: "社内向け",
  external: "社外向け",
} as const;

export const ReviewHistoryPanel = ({ history, onSelect, onDelete, onClear, disabled }: ReviewHistoryPanelProps) => {
  if (history.length === 0) {
    return (
      <div className="rounded border border-slate-200 bg-slate-50 p-4 text-center text-sm text-slate-500">
        まだ履歴はありません
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-slate-700">最近の添削履歴</h3>
        <button
          type="button"
          onClick={onClear}
          className="text-xs text-slate-500 hover:text-rose-500 disabled:cursor-not-allowed disabled:text-slate-300"
          disabled={disabled}
        >
          すべて削除
        </button>
      </div>
      <ul className="space-y-2">
        {history.map(entry => (
          <li key={entry.id} className="rounded border border-slate-200 bg-white p-3 text-left text-sm text-slate-700 shadow-sm">
            <div className="flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={() => onSelect(entry)}
                className="flex-1 text-left font-semibold text-blue-600 hover:underline disabled:cursor-not-allowed disabled:text-slate-400"
                disabled={disabled}
              >
                {formatTimestamp(entry.createdAt)}
              </button>
              <button
                type="button"
                onClick={() => onDelete(entry.id)}
                className="text-xs text-slate-400 hover:text-rose-500 disabled:cursor-not-allowed disabled:text-slate-300"
                disabled={disabled}
              >
                削除
              </button>
            </div>
            <p className="mt-1 text-xs text-slate-500">
              {(toneLabel[entry.tone] ?? "トーン不明")}・{(languageLabel[entry.language] ?? "言語不明")}・セクション{entry.sections.length}件
            </p>
            <p className="mt-1 text-xs text-slate-500">
              {(writingStyleLabel[entry.writingStyle ?? "formal"] ?? "スタイル不明")}・{(honorificLabel[entry.honorific ?? "standard"] ?? "敬称不明")}・{(audienceLabel[entry.audience ?? "external"] ?? "想定不明")}
            </p>
            {entry.result.overallScore !== undefined && (
              <p className="mt-1 text-xs text-slate-500">総合スコア: {entry.result.overallScore}/100</p>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ReviewHistoryPanel;
