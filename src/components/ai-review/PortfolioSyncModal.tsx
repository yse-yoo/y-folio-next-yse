'use client';

import { useEffect, useMemo, useState } from "react";
import type { SectionReviewFeedback } from "@/types/AiReview";
import type { PortfolioSyncAssignment, PortfolioSyncFieldKey } from "@/hooks/usePortfolioSync";

interface SectionRowState {
  sectionId: string;
  title: string;
  text: string;
  field: PortfolioSyncFieldKey | "none";
  projectName: string;
}

interface PortfolioSyncModalProps {
  open: boolean;
  sections: SectionReviewFeedback[];
  busy?: boolean;
  errorMessage?: string | null;
  onClose: () => void;
  onConfirm: (assignments: PortfolioSyncAssignment[]) => void | Promise<void>;
  suggestField: (section: SectionReviewFeedback) => PortfolioSyncFieldKey | "none";
}

const FIELD_OPTIONS: Array<{ value: PortfolioSyncFieldKey | "none"; label: string }> = [
  { value: "none", label: "同期しない" },
  { value: "selfIntroduction", label: "自己紹介に反映" },
  { value: "experience", label: "経験サマリーに反映" },
  { value: "internship", label: "インターンシップ欄に反映" },
  { value: "extracurricular", label: "課外活動欄に反映" },
  { value: "awards", label: "受賞歴欄に反映" },
  { value: "customQuestions", label: "企業設問への回答に反映" },
  { value: "additionalInfo", label: "追加情報欄に反映" },
  { value: "projects", label: "プロジェクトに追加" },
];

const buildInitialRows = (
  sections: SectionReviewFeedback[],
  suggestField: (section: SectionReviewFeedback) => PortfolioSyncFieldKey | "none",
): SectionRowState[] =>
  sections.map(section => {
    const suggested = suggestField(section);
    return {
      sectionId: section.sectionId,
      title: section.sectionTitle,
      text: section.revisedText,
      field: suggested,
      projectName: section.sectionTitle || "AI提案プロジェクト",
    } satisfies SectionRowState;
  });

export default function PortfolioSyncModal({
  open,
  sections,
  busy = false,
  errorMessage,
  onClose,
  onConfirm,
  suggestField,
}: PortfolioSyncModalProps) {
  const [rows, setRows] = useState<SectionRowState[]>(() => buildInitialRows(sections, suggestField));

  useEffect(() => {
    if (!open) return;
    setRows(buildInitialRows(sections, suggestField));
  }, [open, sections, suggestField]);

  const selectableRows = useMemo(() => rows.filter(row => row.field !== "none"), [rows]);

  const handleChangeField = (sectionId: string, nextField: PortfolioSyncFieldKey | "none") => {
    setRows(prev => prev.map(row => (row.sectionId === sectionId ? { ...row, field: nextField } : row)));
  };

  const handleProjectNameChange = (sectionId: string, nextName: string) => {
    setRows(prev => prev.map(row => (row.sectionId === sectionId ? { ...row, projectName: nextName } : row)));
  };

  const handleConfirm = () => {
    const assignments: PortfolioSyncAssignment[] = rows
      .filter(row => row.field !== "none")
      .map(row => ({
        sectionId: row.sectionId,
        field: row.field,
        projectName: row.field === "projects" ? row.projectName : undefined,
      }));

    void onConfirm(assignments);
  };

  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-900/60 px-4 py-8">
      <div className="max-h-full w-full max-w-3xl overflow-hidden rounded-lg bg-white shadow-xl">
        <div className="border-b border-slate-200 px-6 py-4">
          <h2 className="text-lg font-semibold text-slate-900">ポートフォリオへ同期</h2>
          <p className="mt-1 text-xs text-slate-500">同期対象を選択すると、対応する欄が即座に更新されます。</p>
        </div>

        <div className="max-h-[70vh] overflow-y-auto px-6 py-4">
          {sections.length === 0 ? (
            <p className="text-sm text-slate-600">同期できるセクションがありません。</p>
          ) : (
            <ul className="space-y-4">
              {rows.map(row => (
                <li key={row.sectionId} className="rounded border border-slate-200 bg-slate-50 p-4">
                  <header className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                    <div>
                      <p className="text-sm font-semibold text-slate-800">{row.title || row.sectionId}</p>
                      <p className="mt-1 text-xs text-slate-500">ID: {row.sectionId}</p>
                    </div>
                    <select
                      value={row.field}
                      onChange={event => handleChangeField(row.sectionId, event.target.value as PortfolioSyncFieldKey | "none")}
                      className="rounded border border-slate-300 px-3 py-2 text-sm"
                    >
                      {FIELD_OPTIONS.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </header>
                  <p className="mt-3 whitespace-pre-wrap text-sm text-slate-700">{row.text}</p>
                  {row.field === "projects" && (
                    <div className="mt-3">
                      <label className="text-xs font-semibold text-slate-600">プロジェクト名</label>
                      <input
                        value={row.projectName}
                        onChange={event => handleProjectNameChange(row.sectionId, event.target.value)}
                        className="mt-1 w-full rounded border border-slate-300 px-3 py-2 text-sm"
                        placeholder="プロジェクト名を入力"
                      />
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}
          <div className="mt-4 rounded border border-amber-200 bg-amber-50 p-3 text-xs text-amber-700">
            <p>同期した内容は即座に保存され、ダッシュボードや公開ポートフォリオに反映されます。</p>
          </div>
          {errorMessage && <p className="mt-2 text-xs text-rose-600">{errorMessage}</p>}
        </div>

        <div className="flex items-center justify-between border-t border-slate-200 bg-slate-50 px-6 py-4">
          <div className="text-xs text-slate-500">
            {selectableRows.length > 0 ? `${selectableRows.length}件を同期対象として選択中` : "同期対象が未選択です"}
          </div>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded border border-slate-300 px-4 py-2 text-sm text-slate-600 hover:bg-slate-100"
              disabled={busy}
            >
              キャンセル
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              className="rounded bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
              disabled={busy || selectableRows.length === 0}
            >
              {busy ? "同期中..." : "同期する"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
