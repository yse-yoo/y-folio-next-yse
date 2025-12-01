'use client';

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { User } from "@/types/User";
import type { Project } from "@/types/Project";
import ReviewResults from "@/components/ai-review/ReviewResults";
import ReviewHistoryPanel from "@/components/ai-review/ReviewHistoryPanel";
import ReviewSettingsModal from "@/components/ai-review/ReviewSettingsModal";
import FollowUpQuestionsCard from "@/components/ai-review/FollowUpQuestionsCard";
import ReviewExportActions from "@/components/ai-review/ReviewExportActions";
import PortfolioSyncModal from "@/components/ai-review/PortfolioSyncModal";
import PortfolioPreview from "@/components/PortfolioPreview";
import type {
  FollowUpAnswer,
  FollowUpQuestion,
  ResumeReviewHistoryEntry,
  ResumeReviewResponse,
  ResumeSectionInput,
  SectionReviewFeedback,
  ReviewStyleOptions,
} from "@/types/AiReview";
import useResumeReviewHistory from "@/hooks/useResumeReviewHistory";
import { useAuth } from "@/hooks/useAuth";
import { usePortfolioSync, suggestFieldForSection, type PortfolioSyncAssignment } from "@/hooks/usePortfolioSync";

interface EditorSection extends ResumeSectionInput {}

const createSectionId = (seed: string) => {
  const safeSeed = seed.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return `${safeSeed || "section"}-${crypto.randomUUID()}`;
  }
  return `${safeSeed || "section"}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
};

const createEmptySection = (index: number): EditorSection => ({
  id: createSectionId(`manual-${index}`),
  title: index === 0 ? "自己紹介" : "経験",
  text: "",
});

const normalizeTextValue = (value: unknown): string => {
  if (Array.isArray(value)) {
    return value
      .map((item) => (typeof item === "string" ? item.trim() : ""))
      .filter((item) => item.length > 0)
      .join("\n");
  }
  if (typeof value === "string") {
    return value.replace(/\r\n?/g, "\n").split("\n").map((line) => line.trim()).filter((line) => line.length > 0).join("\n");
  }
  return "";
};

const formatProjectSection = (project: Project): string => {
  const lines: string[] = [];
  if (project.description) {
    lines.push(project.description.trim());
  }
  if (project.url) {
    lines.push(`URL: ${project.url}`);
  }
  return lines.join("\n");
};

const buildSectionsFromPortfolio = (user: User | null): EditorSection[] => {
  if (!user?.portfolio) {
    return [];
  }

  const sections: EditorSection[] = [];
  const portfolio = user.portfolio as (NonNullable<User["portfolio"]> & { projects?: Project[] });

  const pushSection = (title: string, content: unknown, idSeed?: string) => {
    const text = normalizeTextValue(content);
    if (text.length === 0) {
      return;
    }
    sections.push({
      id: createSectionId(idSeed ?? title),
      title,
      text,
    });
  };

  pushSection("自己紹介", portfolio.selfIntroduction ?? user.selfIntroduction ?? user.profile);

  const experienceBlocks = [
    { label: "職務経験", value: portfolio.experience },
    { label: "インターンシップ", value: portfolio.internship },
    { label: "課外活動", value: portfolio.extracurricular },
    { label: "受賞歴", value: portfolio.awards ?? user.awards },
  ]
    .map((block) => {
      const body = normalizeTextValue(block.value);
      if (!body) return "";
      return `${block.label}\n${body}`;
    })
    .filter((block) => block.length > 0)
    .join("\n\n");

  if (experienceBlocks.length > 0) {
    pushSection("経験・実績", experienceBlocks, "experience");
  }

  const projects = Array.isArray(portfolio.projects) ? portfolio.projects : [];
  projects.forEach((project, index) => {
    const formatted = formatProjectSection(project);
    if (!formatted) {
      return;
    }
    const title = project.name ? `プロジェクト: ${project.name}` : `プロジェクト${index + 1}`;
    pushSection(title, formatted, `project-${project.id || index}`);
  });

  const certificationText = normalizeTextValue(portfolio.certifications ?? user.certifications);
  if (certificationText.length > 0) {
    pushSection("資格・認定", certificationText, "certifications");
  }

  pushSection("設問・自由記述", [portfolio.customQuestions, portfolio.additionalInfo], "additional-info");

  if (sections.length === 0) {
    return [];
  }

  return sections;
};

const sanitizeSections = (sections: EditorSection[]) =>
  sections
    .map((section, index) => ({
      id: section.id || `section-${index + 1}`,
      title: section.title.trim() || `セクション${index + 1}`,
      text: section.text.trim(),
    }))
    .filter(section => section.text.length > 0);

const toneLabel: Record<ReviewStyleOptions["tone"], string> = {
  keigo: "丁寧語",
  futsukei: "常体",
  business: "ビジネス敬語",
  casual: "カジュアル",
};

const languageLabel: Record<ReviewStyleOptions["language"], string> = {
  ja: "日本語",
  en: "英語",
};

const writingStyleLabel: Record<ReviewStyleOptions["writingStyle"], string> = {
  formal: "フォーマル",
  neutral: "ニュートラル",
  story: "ストーリー重視",
};

const honorificLabel: Record<ReviewStyleOptions["honorific"], string> = {
  standard: "丁寧語メイン",
  respectful: "尊敬語・謙譲語強め",
  none: "敬称なし",
};

const audienceLabel: Record<ReviewStyleOptions["audience"], string> = {
  internal: "社内向け",
  external: "社外向け",
};

const defaultSettings: ReviewStyleOptions = {
  tone: "keigo",
  language: "ja",
  writingStyle: "formal",
  honorific: "standard",
  audience: "external",
};

const applyFollowUpToSections = (sections: EditorSection[], question: FollowUpQuestion, answer: string): EditorSection[] => {
  const trimmedAnswer = answer.trim();
  if (trimmedAnswer.length === 0) return sections;

  const fallbackId = sections[0]?.id;
  const targetId = question.sectionId && sections.some(section => section.id === question.sectionId)
    ? question.sectionId
    : fallbackId;

  if (!targetId) {
    return sections;
  }

  return sections.map(section => {
    if (section.id !== targetId) return section;
    const base = section.text.trim();
    const appended = base.length > 0
      ? `${base}\n\n【追記 (${question.id})】${trimmedAnswer}`
      : trimmedAnswer;
    return { ...section, text: appended };
  });
};

export default function AiResumeReviewPage() {
  const router = useRouter();
  const [sections, setSections] = useState<EditorSection[]>([createEmptySection(0)]);
  const [settings, setSettings] = useState<ReviewStyleOptions>(defaultSettings);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isSyncModalOpen, setIsSyncModalOpen] = useState(false);
  const [pendingQuestions, setPendingQuestions] = useState<FollowUpQuestion[]>([]);
  const [answeredFollowUps, setAnsweredFollowUps] = useState<FollowUpAnswer[]>([]);
  const [companyContext, setCompanyContext] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ResumeReviewResponse | null>(null);
  const [submittedSections, setSubmittedSections] = useState<ResumeSectionInput[] | null>(null);
  const [syncMessage, setSyncMessage] = useState<string | null>(null);
  const [hasLoadedFromPortfolio, setHasLoadedFromPortfolio] = useState(false);
  const { user, loading: authLoading } = useAuth();
  const { history, addEntry, removeEntry, clearHistory, replaceHistory } = useResumeReviewHistory();
  const [historySyncing, setHistorySyncing] = useState(false);

  const {
    loading: portfolioLoading,
    syncing: portfolioSyncing,
    error: portfolioError,
    portfolioUser,
    lastUpdatedAt: portfolioUpdatedAt,
    applyAssignments: applyPortfolioAssignments,
  } = usePortfolioSync({ uid: user?.uid ?? null });

  const sectionCount = sections.length;

  const canSubmit = useMemo(() => {
    const filled = sections.some(section => section.text.trim().length > 0);
    return filled && !loading;
  }, [sections, loading]);

  const handleSuggestField = useCallback((section: SectionReviewFeedback) => suggestFieldForSection(section), []);

  const handleOpenSyncModal = () => {
    setSyncMessage(null);
    setIsSyncModalOpen(true);
  };

  const handleSyncConfirm = useCallback(async (assignments: PortfolioSyncAssignment[]) => {
    if (!result) return;
    const success = await applyPortfolioAssignments({ assignments, result });
    if (success) {
      setSyncMessage("ポートフォリオへ同期しました");
    }
    setIsSyncModalOpen(false);
  }, [applyPortfolioAssignments, result]);

  const handlePreviewShare = useCallback(() => {
    router.push("/interview");
  }, [router]);

  const handlePreviewPdf = useCallback(() => {
    router.push("/portfolio/preview");
  }, [router]);

  const canOpenSyncDialog = useMemo(() => Boolean(result && result.sections.length > 0 && portfolioUser), [result, portfolioUser]);

  const createHistoryId = useCallback(() => {
    if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
      return crypto.randomUUID();
    }
    return `review-${Date.now()}-${Math.random().toString(16).slice(2)}`;
  }, []);

  const handleSectionChange = (id: string, key: keyof ResumeSectionInput, value: string) => {
    setSections(prev => prev.map(section => (section.id === id ? { ...section, [key]: value } : section)));
  };

  const handleAddSection = () => {
    setSections(prev => [...prev, createEmptySection(prev.length)]);
  };

  const handleLoadFromPortfolio = useCallback(() => {
    if (!portfolioUser) {
      setError("ポートフォリオ情報が取得できませんでした");
      return;
    }

    const portfolioSections = buildSectionsFromPortfolio(portfolioUser);
    if (portfolioSections.length === 0) {
      setError("ポートフォリオから読み込めるセクションが見つかりませんでした");
      return;
    }

    setError(null);
    setSections(portfolioSections);
    setHasLoadedFromPortfolio(true);
    setResult(null);
    setSubmittedSections(null);
    setPendingQuestions([]);
    setAnsweredFollowUps([]);
  }, [portfolioUser]);

  const handleRemoveSection = (id: string) => {
    if (sectionCount === 1) return;
    setSections(prev => prev.filter(section => section.id !== id));
  };

  const submitReview = useCallback(async (overrideSections?: EditorSection[]) => {
    const workingSections = overrideSections ?? sections;
    const payloadSections = sanitizeSections(workingSections);

    if (payloadSections.length === 0) {
      setError("テキストを入力してから添削を実行してください");
      return;
    }

    setError(null);
    setResult(null);
    setLoading(true);

    const followUpPayload = answeredFollowUps
      .filter(item => typeof item.answer === "string" && item.answer.trim().length > 0)
      .map(item => ({ id: item.id, answer: item.answer.trim() }));

    try {
      const response = await fetch("/api/ai/resume-review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sections: payloadSections,
          tone: settings.tone,
          language: settings.language,
          writingStyle: settings.writingStyle,
          honorific: settings.honorific,
          audience: settings.audience,
          companyContext,
          answeredFollowUps: followUpPayload,
          userId: user?.uid,
        }),
      });

      if (!response.ok) {
        const body = await response.json().catch(() => ({}));
        throw new Error(body.error || "AI添削中に問題が発生しました");
      }

      const data = (await response.json()) as ResumeReviewResponse;
      setResult(data);
      setSubmittedSections(payloadSections);
      setPendingQuestions(data.followUpQuestions ?? []);
      setAnsweredFollowUps(followUpPayload);

      const entry: ResumeReviewHistoryEntry = {
        id: createHistoryId(),
        createdAt: new Date().toISOString(),
        tone: settings.tone,
        language: settings.language,
        writingStyle: settings.writingStyle,
        honorific: settings.honorific,
        audience: settings.audience,
        companyContext: companyContext.trim() || undefined,
        sections: payloadSections,
        result: data,
      };

      if (user) {
        try {
          setHistorySyncing(true);
          const storeResponse = await fetch("/api/ai/resume-review/history", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "X-User-Id": user.uid,
            },
            body: JSON.stringify({
              userId: user.uid,
              tone: settings.tone,
              language: settings.language,
              writingStyle: settings.writingStyle,
              honorific: settings.honorific,
              audience: settings.audience,
              companyContext: entry.companyContext,
              sections: payloadSections,
              result: data,
            }),
          });

          if (!storeResponse.ok) {
            const body = await storeResponse.json().catch(() => ({}));
            throw new Error(body.error || "履歴の保存に失敗しました");
          }

          const stored = await storeResponse.json();
          const storedEntry = stored?.entry as ResumeReviewHistoryEntry | undefined;
          if (storedEntry) {
            addEntry(storedEntry);
          } else {
            addEntry(entry);
          }
        } catch (persistError) {
          console.error("Failed to persist resume review history", persistError);
          addEntry(entry);
          setError(prev => prev ?? "履歴の保存に失敗しました");
        } finally {
          setHistorySyncing(false);
        }
      } else {
        addEntry(entry);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "AI添削中に予期せぬエラーが発生しました";
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [sections, answeredFollowUps, settings, companyContext, user, addEntry, createHistoryId]);

  const handleSelectHistory = useCallback((entry: ResumeReviewHistoryEntry) => {
    const restoredSections: EditorSection[] = entry.sections.map(section => ({ ...section }));
    setSections(restoredSections);
    setHasLoadedFromPortfolio(true);
    setSettings({
      tone: entry.tone ?? defaultSettings.tone,
      language: entry.language ?? defaultSettings.language,
      writingStyle: entry.writingStyle ?? defaultSettings.writingStyle,
      honorific: entry.honorific ?? defaultSettings.honorific,
      audience: entry.audience ?? defaultSettings.audience,
    });
    setCompanyContext(entry.companyContext ?? "");
    setSubmittedSections(entry.sections);
    setResult(entry.result);
    setError(null);
    setPendingQuestions(entry.result.followUpQuestions ?? []);
    setAnsweredFollowUps([]);
  }, []);

  const handleDeleteHistory = useCallback(async (id: string) => {
    if (!id) return;
    if (!user) {
      removeEntry(id);
      return;
    }

    try {
      setHistorySyncing(true);
      const response = await fetch(`/api/ai/resume-review/history?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
        headers: {
          "X-User-Id": user.uid,
        },
      });

      if (!response.ok) {
        const body = await response.json().catch(() => ({}));
        throw new Error(body.error || "履歴の削除に失敗しました");
      }

      removeEntry(id);
    } catch (err) {
      console.error("Failed to delete resume review history entry", err);
      setError(prev => prev ?? (err instanceof Error ? err.message : "履歴の削除に失敗しました"));
    } finally {
      setHistorySyncing(false);
    }
  }, [user, removeEntry]);

  const handleClearHistory = useCallback(async () => {
    if (!user) {
      clearHistory();
      return;
    }

    try {
      setHistorySyncing(true);
      const response = await fetch("/api/ai/resume-review/history", {
        method: "DELETE",
        headers: {
          "X-User-Id": user.uid,
        },
      });

      if (!response.ok) {
        const body = await response.json().catch(() => ({}));
        throw new Error(body.error || "履歴の一括削除に失敗しました");
      }

      clearHistory();
    } catch (err) {
      console.error("Failed to clear resume review history", err);
      setError(prev => prev ?? (err instanceof Error ? err.message : "履歴の一括削除に失敗しました"));
    } finally {
      setHistorySyncing(false);
    }
  }, [user, clearHistory]);

  useEffect(() => {
    if (authLoading || !user) {
      return;
    }

    const controller = new AbortController();
    let active = true;

    const loadHistory = async () => {
      try {
        setHistorySyncing(true);
        const response = await fetch(`/api/ai/resume-review/history?userId=${encodeURIComponent(user.uid)}`, {
          headers: {
            "X-User-Id": user.uid,
          },
          signal: controller.signal,
        });

        if (!response.ok) {
          const body = await response.json().catch(() => ({}));
          throw new Error(body.error || "履歴の取得に失敗しました");
        }

        const data = await response.json();
        if (!active) return;
        const entries = Array.isArray(data.entries) ? data.entries as ResumeReviewHistoryEntry[] : [];
        replaceHistory(entries);
      } catch (err) {
        if (controller.signal.aborted) return;
        console.error("Failed to load resume review history", err);
        setError(prev => prev ?? (err instanceof Error ? err.message : "履歴の取得に失敗しました"));
      } finally {
        if (active) setHistorySyncing(false);
      }
    };

    loadHistory();

    return () => {
      active = false;
      controller.abort();
    };
  }, [authLoading, user, replaceHistory]);

  useEffect(() => {
    if (!authLoading && !user) {
      setHistorySyncing(false);
    }
  }, [authLoading, user]);

  useEffect(() => {
    if (!result) {
      setIsSyncModalOpen(false);
      setSyncMessage(null);
    }
  }, [result]);

  const handleSettingsSave = (next: ReviewStyleOptions) => {
    setSettings(next);
    setIsSettingsOpen(false);
  };

  const handleApplyFollowUp = useCallback(async (question: FollowUpQuestion, answer: string) => {
    if (loading) return;
    const updatedSections = applyFollowUpToSections(sections, question, answer);
    setSections(updatedSections);
    setPendingQuestions(prev => prev.filter(item => item.id !== question.id));
    setAnsweredFollowUps(prev => {
      const filtered = prev.filter(item => item.id !== question.id);
      return [...filtered, { id: question.id, answer }];
    });
    await submitReview(updatedSections);
  }, [loading, sections, submitReview]);

  const handleSkipFollowUp = useCallback((question: FollowUpQuestion) => {
    setPendingQuestions(prev => prev.filter(item => item.id !== question.id));
    setAnsweredFollowUps(prev => {
      const filtered = prev.filter(item => item.id !== question.id);
      return [...filtered, { id: question.id, answer: "ユーザーが回答を保留しました" }];
    });
  }, []);

  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <header>
        <h1 className="text-2xl font-bold text-slate-900">AI履歴書・職務経歴書 添削</h1>
        <p className="mt-2 text-sm text-slate-600">履歴書の各セクションを入力すると、AIが改善案と差分ハイライトを返します。</p>
      </header>

      <div className="mt-8 grid gap-6 lg:grid-cols-[340px_1fr]">
        <aside className="space-y-4 rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
          <div className="rounded border border-slate-200 bg-slate-50 p-4">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-sm font-semibold text-slate-700">添削設定</h2>
              <button
                type="button"
                onClick={() => setIsSettingsOpen(true)}
                className="text-xs font-semibold text-blue-600 hover:text-blue-700"
              >
                設定を変更
              </button>
            </div>
            <dl className="mt-3 space-y-2 text-sm text-slate-600">
              <div className="flex items-center justify-between">
                <dt className="text-xs text-slate-500">トーン</dt>
                <dd>{toneLabel[settings.tone]}</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-xs text-slate-500">文体</dt>
                <dd>{writingStyleLabel[settings.writingStyle]}</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-xs text-slate-500">敬称</dt>
                <dd>{honorificLabel[settings.honorific]}</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-xs text-slate-500">想定読者</dt>
                <dd>{audienceLabel[settings.audience]}</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-xs text-slate-500">言語</dt>
                <dd>{languageLabel[settings.language]}</dd>
              </div>
            </dl>
            <div className="mt-3 flex items-center justify-between gap-2 text-xs">
              <span className="text-slate-500">言語切替</span>
              <div className="flex gap-2">
                {(["ja", "en"] as Array<ReviewStyleOptions["language"]>).map(option => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => setSettings(prev => ({ ...prev, language: option }))}
                    className={`rounded px-2 py-1 font-semibold transition ${settings.language === option ? "bg-blue-600 text-white" : "border border-slate-200 text-slate-600 hover:border-blue-400"}`}
                  >
                    {languageLabel[option]}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div>
            <label className="text-sm font-semibold text-slate-700">企業・職種の背景（任意）</label>
            <textarea
              value={companyContext}
              onChange={event => setCompanyContext(event.target.value)}
              className="mt-1 w-full rounded border border-slate-300 px-3 py-2 text-sm"
              rows={6}
              placeholder="企業の特徴や募集要項など、文脈に関する情報があれば入力してください"
            />
          </div>
          <button
            type="button"
            onClick={handleLoadFromPortfolio}
            className="w-full rounded border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-indigo-400 hover:text-indigo-600 disabled:opacity-60"
            disabled={portfolioLoading || !portfolioUser}
          >
            {portfolioLoading ? "ポートフォリオを読み込み中..." : hasLoadedFromPortfolio ? "ポートフォリオを再読み込み" : "ポートフォリオから読み込む"}
          </button>
          <button
            type="button"
            onClick={() => submitReview()}
            className="w-full rounded bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-60"
            disabled={!canSubmit}
          >
            {loading ? "AIが分析中..." : "AIに添削を依頼"}
          </button>
          {error && <p className="text-xs text-rose-600">{error}</p>}
          <ReviewHistoryPanel
            history={history}
            onSelect={handleSelectHistory}
            onDelete={handleDeleteHistory}
            onClear={handleClearHistory}
            disabled={loading || historySyncing}
          />
        </aside>

        <main className="space-y-6">
          <section className="space-y-4">
            {sections.map((section, index) => (
              <div key={section.id} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <label className="text-sm font-semibold text-slate-700">セクションタイトル</label>
                    <input
                      value={section.title}
                      onChange={event => handleSectionChange(section.id, "title", event.target.value)}
                      className="mt-1 w-full rounded border border-slate-300 px-3 py-2 text-sm"
                      placeholder={`例: ${index === 0 ? "自己紹介" : "成果"}`}
                    />
                  </div>
                  {sectionCount > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveSection(section.id)}
                      className="text-sm text-slate-500 hover:text-rose-500"
                    >
                      削除
                    </button>
                  )}
                </div>
                <label className="mt-3 block text-sm font-semibold text-slate-700">本文</label>
                <textarea
                  value={section.text}
                  onChange={event => handleSectionChange(section.id, "text", event.target.value)}
                  className="mt-1 w-full rounded border border-slate-300 px-3 py-3 text-sm"
                  rows={6}
                  placeholder="自己PRや経験の詳細を入力してください"
                />
              </div>
            ))}
          </section>
          <button
            type="button"
            onClick={handleAddSection}
            className="rounded border border-dashed border-slate-300 px-4 py-2 text-sm text-slate-600 hover:border-slate-400"
          >
            セクションを追加
          </button>

          {result && submittedSections && (
            <>
              <ReviewResults originalSections={submittedSections} result={result} />
              <ReviewExportActions
                originalSections={submittedSections}
                result={result}
                settings={settings}
              />
              <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                  <div>
                    <h2 className="text-base font-semibold text-slate-900">ポートフォリオ同期</h2>
                    {user ? (
                      <p className="text-xs text-slate-500">ダッシュボードのポートフォリオにAI添削結果を即座に反映できます。</p>
                    ) : (
                      <p className="text-xs text-slate-500">Googleアカウントでログインするとポートフォリオ同期が利用できます。</p>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={handleOpenSyncModal}
                    className="rounded bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-60"
                    disabled={!user || !canOpenSyncDialog || portfolioLoading || portfolioSyncing}
                  >
                    {portfolioSyncing ? "同期中..." : "ポートフォリオに同期"}
                  </button>
                </div>
                <div className="mt-3 space-y-2 text-xs text-slate-500">
                  {portfolioUpdatedAt && (
                    <p>最終更新: {new Date(portfolioUpdatedAt).toLocaleString()}</p>
                  )}
                  {syncMessage && <p className="text-emerald-600">{syncMessage}</p>}
                  {portfolioError && <p className="text-rose-600">{portfolioError}</p>}
                  {portfolioLoading && <p>ポートフォリオ情報を読み込み中です...</p>}
                </div>
                {portfolioUser && (
                  <div className="mt-4 border-t border-slate-100 pt-4">
                    <PortfolioPreview
                      user={portfolioUser}
                      handleShareClick={handlePreviewShare}
                      handlePdfPreview={handlePreviewPdf}
                    />
                  </div>
                )}
              </section>
            </>
          )}

          {pendingQuestions.length > 0 && (
            <FollowUpQuestionsCard
              questions={pendingQuestions}
              onSubmit={handleApplyFollowUp}
              onSkip={handleSkipFollowUp}
              disabled={loading}
            />
          )}
        </main>
      </div>

      <PortfolioSyncModal
        open={isSyncModalOpen && Boolean(result)}
        sections={result?.sections ?? []}
        busy={portfolioSyncing}
        errorMessage={portfolioError}
        onClose={() => setIsSyncModalOpen(false)}
        onConfirm={handleSyncConfirm}
        suggestField={handleSuggestField}
      />

      <ReviewSettingsModal
        open={isSettingsOpen}
        initialSettings={settings}
        onClose={() => setIsSettingsOpen(false)}
        onSave={handleSettingsSave}
      />
    </div>
  );
}
