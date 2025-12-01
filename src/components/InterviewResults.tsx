"use client";
// import { IndustryEvaluationResult } from "@/types/Industry";
import type { InterviewEvaluation } from "@/types/Interview";

interface InterviewResultsProps {
  onRestart: () => void;
  evaluation?: InterviewEvaluation | null;
}

// フォールバック用の固定結果コンポーネント
const FallbackResults = ({ onRestart }: { onRestart: () => void }) => (
  <div className="max-w-lg mx-auto bg-white rounded-lg shadow p-8 mt-10 text-center">
    <h2 className="text-2xl font-bold mb-6 text-blue-700">面接結果</h2>
    <div className="bg-blue-50 p-6 rounded-lg shadow mb-6">
      <div className="text-3xl font-bold text-blue-600 mb-2">80/100</div>
      <div className="text-gray-700 mb-4">よくできました！回答の具体性が高く、経験がしっかり伝わっています。</div>
      <ul className="text-left list-disc list-inside text-gray-800">
        <li>技術面の深掘りがあるとさらに良い</li>
        <li>エピソードに数字を入れると説得力UP</li>
      </ul>
    </div>
    <button
      className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
      onClick={onRestart}
    >
      新しい面接を開始
    </button>
  </div>
);

// 一時的にコメントアウト
// const getScoreColor = (score: number) => {
//   if (score >= 80) return "text-green-600";
//   if (score >= 60) return "text-blue-600";
//   if (score >= 40) return "text-yellow-600";
//   return "text-red-600";
// };

// const getScoreBgColor = (score: number) => {
//   if (score >= 80) return "from-green-50 to-emerald-50";
//   if (score >= 60) return "from-blue-50 to-indigo-50";
//   if (score >= 40) return "from-yellow-50 to-orange-50";
//   return "from-red-50 to-pink-50";
// };

export default function InterviewResults({ onRestart, evaluation }: InterviewResultsProps) {
  if (!evaluation) {
    return <FallbackResults onRestart={onRestart} />;
  }

  const score = typeof evaluation.score === "number" ? evaluation.score : undefined;
  const summary = typeof evaluation.summary === "string" ? evaluation.summary : undefined;
  const strengths = Array.isArray(evaluation.strengths)
    ? evaluation.strengths.filter((item): item is string => typeof item === "string")
    : [];
  const improvements = Array.isArray(evaluation.improvements)
    ? evaluation.improvements.filter((item): item is string => typeof item === "string")
    : [];

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow p-8 mt-10">
      <h2 className="text-2xl font-bold mb-6 text-blue-700">面接結果</h2>
      <div className="bg-blue-50 p-6 rounded-lg shadow mb-6">
        {score !== undefined && (
          <div className="text-center mb-6">
            <div className="text-4xl font-bold text-blue-600">
              {score}
              <span className="text-base text-gray-600 ml-1">/100</span>
            </div>
          </div>
        )}
        {summary && <p className="text-gray-700 whitespace-pre-line">{summary}</p>}
        {!summary && <p className="text-gray-700">評価コメントはまだありません。</p>}
      </div>

      {(strengths.length > 0 || improvements.length > 0) && (
        <div className="grid gap-6 md:grid-cols-2">
          {strengths.length > 0 && (
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-green-600 mb-3">強み</h3>
              <ul className="list-disc list-inside text-gray-800 space-y-2">
                {strengths.map((item, index) => (
                  <li key={`strength-${index}`}>{item}</li>
                ))}
              </ul>
            </div>
          )}
          {improvements.length > 0 && (
            <div className="bg-amber-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-amber-600 mb-3">改善ポイント</h3>
              <ul className="list-disc list-inside text-gray-800 space-y-2">
                {improvements.map((item, index) => (
                  <li key={`improvement-${index}`}>{item}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      <button
        className="mt-8 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
        onClick={onRestart}
      >
        新しい面接を開始
      </button>
    </div>
  );
} 