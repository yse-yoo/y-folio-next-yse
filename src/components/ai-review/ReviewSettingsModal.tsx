'use client';

import { useEffect, useState } from "react";
import type { ReviewStyleOptions } from "@/types/AiReview";

interface ReviewSettingsModalProps {
  open: boolean;
  initialSettings: ReviewStyleOptions;
  onSave: (settings: ReviewStyleOptions) => void;
  onClose: () => void;
}

const toneOptions = [
  { value: "keigo" as const, label: "丁寧語（です・ます）" },
  { value: "business" as const, label: "ビジネス敬語" },
  { value: "futsukei" as const, label: "常体（である調）" },
  { value: "casual" as const, label: "カジュアル" },
];

const writingStyleOptions = [
  { value: "formal" as const, label: "フォーマル" },
  { value: "neutral" as const, label: "ニュートラル" },
  { value: "story" as const, label: "ストーリー重視" },
];

const honorificOptions = [
  { value: "standard" as const, label: "丁寧語メイン" },
  { value: "respectful" as const, label: "尊敬語・謙譲語強め" },
  { value: "none" as const, label: "敬称なし" },
];

const audienceOptions = [
  { value: "external" as const, label: "社外向け（採用担当想定）" },
  { value: "internal" as const, label: "社内向け（上長・同僚想定）" },
];

const languageOptions = [
  { value: "ja" as const, label: "日本語" },
  { value: "en" as const, label: "英語" },
];

export const ReviewSettingsModal = ({ open, initialSettings, onSave, onClose }: ReviewSettingsModalProps) => {
  const [draft, setDraft] = useState<ReviewStyleOptions>(initialSettings);

  useEffect(() => {
    if (open) {
      setDraft(initialSettings);
    }
  }, [open, initialSettings]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-xl rounded-lg bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <h2 className="text-lg font-semibold text-slate-900">添削設定</h2>
          <button type="button" onClick={onClose} className="text-sm text-slate-500 hover:text-slate-700">
            閉じる
          </button>
        </div>
        <div className="max-h-[70vh] overflow-y-auto px-6 py-5 space-y-5">
          <section>
            <h3 className="text-sm font-semibold text-slate-700">文体トーン</h3>
            <p className="mt-1 text-xs text-slate-500">全体の雰囲気に最も近いトーンを選択してください。</p>
            <div className="mt-3 grid grid-cols-2 gap-2">
              {toneOptions.map(option => (
                <label key={option.value} className={`cursor-pointer rounded border px-3 py-2 text-sm transition ${draft.tone === option.value ? "border-blue-500 bg-blue-50 text-blue-600" : "border-slate-200 hover:border-blue-400"}`}>
                  <input
                    type="radio"
                    name="tone"
                    value={option.value}
                    checked={draft.tone === option.value}
                    onChange={() => setDraft(prev => ({ ...prev, tone: option.value }))}
                    className="hidden"
                  />
                  {option.label}
                </label>
              ))}
            </div>
          </section>

          <section>
            <h3 className="text-sm font-semibold text-slate-700">文章スタイル</h3>
            <div className="mt-2 grid grid-cols-3 gap-2 text-sm">
              {writingStyleOptions.map(option => (
                <label key={option.value} className={`cursor-pointer rounded border px-3 py-2 transition ${draft.writingStyle === option.value ? "border-blue-500 bg-blue-50 text-blue-600" : "border-slate-200 hover:border-blue-400"}`}>
                  <input
                    type="radio"
                    name="writingStyle"
                    value={option.value}
                    checked={draft.writingStyle === option.value}
                    onChange={() => setDraft(prev => ({ ...prev, writingStyle: option.value }))}
                    className="hidden"
                  />
                  {option.label}
                </label>
              ))}
            </div>
          </section>

          <section>
            <h3 className="text-sm font-semibold text-slate-700">敬称レベル</h3>
            <div className="mt-2 grid grid-cols-3 gap-2 text-sm">
              {honorificOptions.map(option => (
                <label key={option.value} className={`cursor-pointer rounded border px-3 py-2 transition ${draft.honorific === option.value ? "border-blue-500 bg-blue-50 text-blue-600" : "border-slate-200 hover:border-blue-400"}`}>
                  <input
                    type="radio"
                    name="honorific"
                    value={option.value}
                    checked={draft.honorific === option.value}
                    onChange={() => setDraft(prev => ({ ...prev, honorific: option.value }))}
                    className="hidden"
                  />
                  {option.label}
                </label>
              ))}
            </div>
          </section>

          <section>
            <h3 className="text-sm font-semibold text-slate-700">想定読者</h3>
            <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
              {audienceOptions.map(option => (
                <label key={option.value} className={`cursor-pointer rounded border px-3 py-2 transition ${draft.audience === option.value ? "border-blue-500 bg-blue-50 text-blue-600" : "border-slate-200 hover:border-blue-400"}`}>
                  <input
                    type="radio"
                    name="audience"
                    value={option.value}
                    checked={draft.audience === option.value}
                    onChange={() => setDraft(prev => ({ ...prev, audience: option.value }))}
                    className="hidden"
                  />
                  {option.label}
                </label>
              ))}
            </div>
          </section>

          <section>
            <h3 className="text-sm font-semibold text-slate-700">出力言語</h3>
            <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
              {languageOptions.map(option => (
                <label key={option.value} className={`cursor-pointer rounded border px-3 py-2 transition ${draft.language === option.value ? "border-blue-500 bg-blue-50 text-blue-600" : "border-slate-200 hover:border-blue-400"}`}>
                  <input
                    type="radio"
                    name="language"
                    value={option.value}
                    checked={draft.language === option.value}
                    onChange={() => setDraft(prev => ({ ...prev, language: option.value }))}
                    className="hidden"
                  />
                  {option.label}
                </label>
              ))}
            </div>
          </section>
        </div>
        <div className="flex justify-end gap-3 border-t border-slate-200 px-6 py-4">
          <button type="button" onClick={onClose} className="rounded border border-slate-200 px-4 py-2 text-sm text-slate-600 hover:border-slate-300">
            キャンセル
          </button>
          <button
            type="button"
            onClick={() => onSave(draft)}
            className="rounded bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
          >
            保存
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReviewSettingsModal;
