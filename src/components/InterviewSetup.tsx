"use client";

import { useMemo, useState } from "react";
import type { InterviewCompanyContext } from "@/types/Interview";

interface InterviewSetupProps {
  onStart: (context?: InterviewCompanyContext | null) => void | Promise<void>;
}

interface CompanyAnalysis extends InterviewCompanyContext {
  fetchedAt: number;
}

const isValidUrl = (value: string) => {
  try {
    const parsed = new URL(value);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
};

export default function InterviewSetup({ onStart }: InterviewSetupProps) {
  const [companyUrl, setCompanyUrl] = useState("");
  const [extraNotes, setExtraNotes] = useState("");
  const [analysis, setAnalysis] = useState<CompanyAnalysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [statusMessage, setStatusMessage] = useState("");

  const cleanedExtraNotes = useMemo(() => extraNotes.trim(), [extraNotes]);

  const handleFetchCompanyInfo = async () => {
    const trimmedUrl = companyUrl.trim();
    setError("");
    setStatusMessage("");

    if (!trimmedUrl) {
      setError("企業サイトのURLを入力してください。");
      return;
    }

    if (!isValidUrl(trimmedUrl)) {
      setError("URLの形式が正しくありません。");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/ai/company-context", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          url: trimmedUrl,
          extraText: cleanedExtraNotes || undefined,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        const message = typeof data?.error === "string" ? data.error : "企業情報の取得に失敗しました。";
        throw new Error(message);
      }

      const data = await res.json() as {
        summary?: string;
        highlights?: string[];
        rawTextSnippet?: string;
        url?: string;
      };

      setAnalysis({
        url: data.url ?? trimmedUrl,
        summary: data.summary ?? "",
        highlights: Array.isArray(data.highlights) ? data.highlights : [],
        extraNotes: cleanedExtraNotes || undefined,
        rawTextSnippet: data.rawTextSnippet,
        fetchedAt: Date.now(),
      });
      setStatusMessage("企業情報の要約を取得しました。");
    } catch (err) {
      console.error("Failed to load company info:", err);
      setError(err instanceof Error ? err.message : "企業情報の取得に失敗しました。");
      setAnalysis(null);
    } finally {
      setLoading(false);
    }
  };

  const handleStartInterview = () => {
    const context: InterviewCompanyContext = {
      url: companyUrl.trim() || undefined,
      summary: analysis?.summary || undefined,
      highlights: analysis?.highlights && analysis.highlights.length > 0 ? analysis.highlights : undefined,
      extraNotes: cleanedExtraNotes || undefined,
      rawTextSnippet: analysis?.rawTextSnippet,
    };

    const hasContext = Boolean(
      context.url ||
      context.summary ||
      (context.highlights && context.highlights.length > 0) ||
      context.extraNotes ||
      context.rawTextSnippet
    );

    onStart(hasContext ? context : null);
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow p-8 mt-10">
      <h2 className="text-2xl font-bold mb-6 text-center">AI面接シミュレーション</h2>
      <div className="mb-6 text-sm text-gray-700 space-y-3">
        <p className="leading-relaxed">
          総合面接では志望動機や学生時代の経験、自己PRなど幅広いテーマから質問されます。
          想定質問に落ち着いて回答し、回答後にはAIがフィードバックを提示します。
        </p>
        <p className="leading-relaxed">
          企業サイトURLや求人票の要点を読み込むと、その企業の特徴を踏まえた質問が生成されます。
          情報の入力は任意ですが、事前に読み込むとより実践的な面接シミュレーションが可能です。
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="company-url">
            企業サイトのURL
          </label>
          <input
            id="company-url"
            type="url"
            className="w-full border rounded-lg px-3 py-2 text-sm"
            placeholder="https://example.com/company"
            value={companyUrl}
            onChange={(event) => {
              setCompanyUrl(event.target.value);
              setStatusMessage("");
            }}
            autoComplete="off"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="company-notes">
            追加情報（求人票や会社概要の要点など）
          </label>
          <textarea
            id="company-notes"
            className="w-full border rounded-lg px-3 py-2 text-sm min-h-[100px] resize-y"
            placeholder="例: エンジニア採用／新規SaaS開発、リモート可など"
            value={extraNotes}
            onChange={(event) => {
              setExtraNotes(event.target.value);
              setStatusMessage("");
            }}
          />
          <p className="text-xs text-gray-500 mt-1">※ URL と合わせて読み込むと、企業独自の観点を質問に反映できます。</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            className="bg-gray-100 text-gray-800 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-200 transition disabled:opacity-60"
            onClick={handleFetchCompanyInfo}
            disabled={loading}
          >
            {loading ? "読み込み中..." : "企業情報を読み込む"}
          </button>
          {statusMessage && (
            <span className="text-sm text-green-600">{statusMessage}</span>
          )}
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-3 py-2 text-sm">
            {error}
          </div>
        )}

        {analysis && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-3 text-sm text-gray-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-blue-700">企業情報のサマリー</span>
              <span className="text-xs text-blue-600">
                取得日時: {new Date(analysis.fetchedAt).toLocaleTimeString()}
              </span>
            </div>
            {analysis.summary ? (
              <p className="leading-relaxed whitespace-pre-wrap">{analysis.summary}</p>
            ) : (
              <p className="text-gray-600">サマリーは取得できませんでした。</p>
            )}
            {Array.isArray(analysis.highlights) && analysis.highlights.length > 0 && (
              <div>
                <p className="font-semibold text-blue-700 mb-1">注目ポイント</p>
                <ul className="list-disc list-inside space-y-1">
                  {analysis.highlights.map((item, idx) => (
                    <li key={`${item}-${idx}`} className="text-gray-700">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>

      <button
        className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition mt-6 disabled:opacity-70"
        onClick={handleStartInterview}
        disabled={loading}
      >
        面接を開始
      </button>
    </div>
  );
}