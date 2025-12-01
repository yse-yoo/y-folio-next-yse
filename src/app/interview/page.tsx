"use client";
import { useEffect, useMemo, useState } from "react";
import InterviewSetup from "@/components/InterviewSetup";
import InterviewSession from "@/components/InterviewSession";
import InterviewResults from "@/components/InterviewResults";
import { fetchPortfolioPdfData } from "@/lib/api/portfolio";
import { fetchUser } from "@/lib/api/user";
import type { PortfolioPdfData } from "@/types/PortfolioPdf";
import type { InterviewCompanyContext, InterviewEvaluation } from "@/types/Interview";
import { useAuth } from "@/hooks/useAuth";

// // カテゴリごとのダミー質問（10問ずつ）
// const dummyQuestions = { ... };

const LoadingScreen = () => (
  <div className="flex flex-col items-center gap-4">
    <div className="h-12 w-12 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600" />
    <p className="text-sm text-gray-600">読み込み中です…</p>
  </div>
);

export default function InterviewPage() {
  const [step, setStep] = useState<'setup' | 'session' | 'result'>('setup');
  const [questions, setQuestions] = useState<{ id: number; question: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [evaluation, setEvaluation] = useState<InterviewEvaluation | null>(null);
  const [interviewType, setInterviewType] = useState<'general' | 'technical' | 'behavioral'>('general');
  const [companyContext, setCompanyContext] = useState<InterviewCompanyContext | null>(null);
  const [portfolioData, setPortfolioData] = useState<PortfolioPdfData | null>(null);
  const [portfolioLoading, setPortfolioLoading] = useState(true);
  const [portfolioError, setPortfolioError] = useState("");
  const { user, loading: authLoading } = useAuth();
  const providerUid = user?.uid ?? null;

  useEffect(() => {
    let mounted = true;
    const controller = new AbortController();

    const loadPortfolio = async () => {
      if (!providerUid) {
        setPortfolioData(null);
        setPortfolioError("ログインが必要です。");
        setPortfolioLoading(false);
        return;
      }

      try {
        setPortfolioError("");
        setPortfolioLoading(true);
        setPortfolioData(null);
        const fetchedUser = await fetchUser(providerUid);
        if (!mounted) return;

        if (!fetchedUser?.id) {
          setPortfolioError("ユーザー情報が見つかりませんでした。");
          return;
        }

        const data = await fetchPortfolioPdfData(fetchedUser.id, { signal: controller.signal });
        if (!mounted) return;
        if (!data.user && !data.portfolio) {
          setPortfolioError("保存済みのポートフォリオが見つかりません。");
          return;
        }
        setPortfolioData(data);
      } catch (error) {
        if (!mounted) return;
        if (error instanceof DOMException && error.name === "AbortError") {
          return;
        }
  console.error("Failed to load portfolio for interview:", error);
        setPortfolioError("ポートフォリオの取得に失敗しました。");
      } finally {
        if (mounted) setPortfolioLoading(false);
      }
    };

    if (!authLoading) {
      loadPortfolio();
    }

    return () => {
      mounted = false;
      controller.abort();
    };
  }, [authLoading, providerUid]);

  const resolvedUser = useMemo(() => portfolioData?.user ?? null, [portfolioData]);
  const resolvedPortfolio = useMemo(() => portfolioData?.portfolio ?? null, [portfolioData]);

  const handleStart = async (context?: InterviewCompanyContext | null) => {
    const type = 'general' as const;
    if (!resolvedUser || !resolvedPortfolio) {
      setError("面接を開始するにはユーザー情報とポートフォリオが必要です。");
      return;
    }

    setLoading(true);
    setError("");
    setInterviewType(type);
    setCompanyContext(context ?? null);
    
    try {
      const res = await fetch("/api/ai/job-interview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user: resolvedUser,
          portfolio: resolvedPortfolio,
          type,
          companyContext: context ?? null,
        }),
      });
      if (!res.ok) throw new Error("APIリクエストに失敗しました");
      const data = await res.json();
      setQuestions(data.questions);
      setStep('session');
    } catch (err) {
      console.error("AI質問生成に失敗しました:", err);
      setError("AIによる質問生成に失敗しました。");
    } finally {
      setLoading(false);
    }
  };

  const handleFinish = async (answers: { questionId: number; answer: string }[]) => {
    if (!resolvedUser || !resolvedPortfolio) {
      setError("評価を実行できるユーザー情報とポートフォリオが見つかりません。");
      return;
    }

    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/ai/evaluate-interview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user: resolvedUser,
          portfolio: resolvedPortfolio,
          type: interviewType,
          questions,
          answers,
          companyContext: companyContext ?? null,
        }),
      });
      if (!res.ok) throw new Error("評価APIリクエストに失敗しました");
      const data = await res.json() as { evaluation: InterviewEvaluation };
      setEvaluation(data.evaluation ?? null);
      setStep('result');
    } catch (err) {
      console.error("AI評価に失敗しました:", err);
      setError("AIによる評価に失敗しました。");
    } finally {
      setLoading(false);
    }
  };

  const handleRestart = () => {
    setStep('setup');
    setEvaluation(null);
    setInterviewType('general');
    setQuestions([]);
    setCompanyContext(null);
  };

  const isLoading = authLoading || portfolioLoading || loading;
  const hasBlockingError = !isLoading && (portfolioError || error);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      {isLoading && <LoadingScreen />}

      {hasBlockingError && (
        <div className="rounded-lg bg-red-50 px-6 py-4 text-sm text-red-600 shadow">
          {portfolioError || error}
        </div>
      )}

      {!isLoading && !hasBlockingError && step === 'setup' && (
        <InterviewSetup onStart={handleStart} />
      )}

      {!isLoading && !hasBlockingError && step === 'session' && (
        <InterviewSession onFinish={handleFinish} questions={questions} />
      )}

      {!isLoading && !hasBlockingError && step === 'result' && (
        <InterviewResults onRestart={handleRestart} evaluation={evaluation} />
      )}
    </div>
  );
}