'use client';

import { useCallback, useEffect, useMemo, useState } from "react";
import type { ResumeReviewResponse, SectionReviewFeedback } from "@/types/AiReview";
import type { Portfolio } from "@/types/Portforio";
import type { Project } from "@/types/Project";
import type { User } from "@/types/User";
import { fetchUser } from "@/lib/api/user";

const createUniqueId = () => {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `id-${Date.now()}-${Math.random().toString(16).slice(2)}`;
};

const createEmptyPortfolio = (userId: string): Portfolio & { projects: Project[] } => ({
  id: "",
  user_id: userId,
  name: "",
  university: "",
  faculty: "",
  grade: "",
  email: "",
  selfIntroduction: "",
  skills: [],
  skillTags: [],
  certifications: "",
  projects: [],
  internship: "",
  extracurricular: "",
  experience: "",
  awards: "",
  customQuestions: "",
  additionalInfo: "",
  isPublic: false,
  autoDeleteAfterOneYear: false,
  publication: {},
  visibilitySettings: {},
  rawProjects: "",
});

const parseProjects = (value: unknown): Project[] => {
  if (!value) return [];

  const parseFromString = (input: string): Project[] => {
    try {
      const parsed = JSON.parse(input);
      if (Array.isArray(parsed)) {
        return parsed
          .map((item, index) => {
            if (!item || typeof item !== "object") return null;
            const record = item as Record<string, unknown>;
            const id = typeof record.id === "string" && record.id.trim().length > 0
              ? record.id.trim()
              : createUniqueId();
            const name = typeof record.name === "string" ? record.name : `プロジェクト${index + 1}`;
            const description = typeof record.description === "string" ? record.description : "";
            const url = typeof record.url === "string" ? record.url : undefined;
            return {
              id,
              name,
              description,
              url,
            } satisfies Project;
          })
          .filter((item): item is Project => item !== null);
      }
      if (typeof parsed === "object" && parsed) {
        return parseProjects(parsed);
      }
    } catch {
      return [];
    }
    return [];
  };

  if (Array.isArray(value)) {
    return value
      .map((item, index) => {
        if (!item || typeof item !== "object") return null;
        const record = item as Record<string, unknown>;
        const id = typeof record.id === "string" && record.id.trim().length > 0
          ? record.id.trim()
          : createUniqueId();
        const name = typeof record.name === "string" ? record.name : `プロジェクト${index + 1}`;
        const description = typeof record.description === "string" ? record.description : "";
        const url = typeof record.url === "string" ? record.url : undefined;
        return {
          id,
          name,
          description,
          url,
        } satisfies Project;
      })
      .filter((item): item is Project => item !== null);
  }

  if (typeof value === "string") {
    return parseFromString(value);
  }

  if (typeof value === "object") {
    return parseProjects([value]);
  }

  return [];
};

const normalizePortfolio = (portfolio: Portfolio | null | undefined, userId: string): (Portfolio & { projects: Project[] }) => {
  if (!portfolio) {
    return createEmptyPortfolio(userId);
  }

  const normalized: Portfolio & { projects: Project[] } = {
    ...createEmptyPortfolio(userId),
    ...portfolio,
    id: portfolio.id ?? "",
    user_id: portfolio.user_id ?? userId,
    university: portfolio.university ?? "",
    faculty: portfolio.faculty ?? "",
    grade: portfolio.grade ?? "",
    email: portfolio.email ?? "",
    selfIntroduction: portfolio.selfIntroduction ?? "",
    skills: Array.isArray(portfolio.skills) ? portfolio.skills : [],
    skillTags: Array.isArray(portfolio.skillTags) ? portfolio.skillTags : [],
    certifications: portfolio.certifications ?? "",
    internship: portfolio.internship ?? "",
    extracurricular: portfolio.extracurricular ?? "",
    experience: portfolio.experience ?? "",
    awards: portfolio.awards ?? "",
    customQuestions: portfolio.customQuestions ?? "",
    additionalInfo: portfolio.additionalInfo ?? "",
    isPublic: portfolio.isPublic ?? false,
    autoDeleteAfterOneYear: portfolio.autoDeleteAfterOneYear ?? false,
    publication: portfolio.publication ?? {},
    visibilitySettings: portfolio.visibilitySettings ?? {},
    projects: parseProjects(portfolio.projects ?? portfolio.rawProjects ?? []),
    rawProjects: portfolio.rawProjects ?? "",
  };

  normalized.skillTags = Array.isArray(normalized.skillTags) && normalized.skillTags.length > 0
    ? normalized.skillTags
    : Array.isArray(normalized.skills)
      ? normalized.skills
      : [];

  return normalized;
};

const cloneProject = (project: Project): Project => ({
  id: project.id,
  name: project.name,
  description: project.description,
  url: project.url,
});

export type PortfolioSyncFieldKey =
  | "selfIntroduction"
  | "experience"
  | "internship"
  | "extracurricular"
  | "awards"
  | "customQuestions"
  | "additionalInfo"
  | "projects";

export interface PortfolioSyncAssignment {
  sectionId: string;
  field: PortfolioSyncFieldKey;
  projectName?: string;
}

export const suggestFieldForSection = (section: Pick<SectionReviewFeedback, "sectionTitle">): PortfolioSyncFieldKey | "none" => {
  const title = section.sectionTitle?.toLowerCase() ?? "";

  if (!title) {
    return "none";
  }

  if (/(自己紹介|self|summary|profile|introduction)/u.test(title)) {
    return "selfIntroduction";
  }
  if (/(インターン|intern|internship)/u.test(title)) {
    return "internship";
  }
  if (/(経験|経歴|experience|career)/u.test(title)) {
    return "experience";
  }
  if (/(課外|活動|extracurricular|club)/u.test(title)) {
    return "extracurricular";
  }
  if (/(受賞|表彰|awards|award)/u.test(title)) {
    return "awards";
  }
  if (/(設問|質問|question|Q&A|qa|custom)/iu.test(title)) {
    return "customQuestions";
  }
  if (/(志望|motivation|アピール|additional|補足|info)/u.test(title)) {
    return "additionalInfo";
  }
  if (/(プロジェクト|project|制作|開発)/u.test(title)) {
    return "projects";
  }

  return "none";
};

interface UsePortfolioSyncOptions {
  uid?: string | null;
}

interface ApplyAssignmentsParams {
  assignments: PortfolioSyncAssignment[];
  result: ResumeReviewResponse;
}

interface UsePortfolioSyncResult {
  loading: boolean;
  syncing: boolean;
  error: string | null;
  portfolioUser: User | null;
  lastUpdatedAt: string | null;
  refresh: () => Promise<void>;
  applyAssignments: (params: ApplyAssignmentsParams) => Promise<boolean>;
}

export function usePortfolioSync({ uid }: UsePortfolioSyncOptions): UsePortfolioSyncResult {
  const [portfolioUser, setPortfolioUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdatedAt, setLastUpdatedAt] = useState<string | null>(null);

  const fetchAndSet = useCallback(async () => {
    if (!uid) {
      setPortfolioUser(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const user = await fetchUser(uid);
      const normalizedPortfolio = normalizePortfolio(user.portfolio, user.id ?? uid);
      setPortfolioUser({
        ...user,
        portfolio: normalizedPortfolio,
      });
      setLastUpdatedAt(new Date().toISOString());
    } catch (err) {
      console.error("Failed to load portfolio for AI sync", err);
      const message = err instanceof Error ? err.message : "ポートフォリオ情報の取得に失敗しました";
      setError(message);
      setPortfolioUser(null);
    } finally {
      setLoading(false);
    }
  }, [uid]);

  useEffect(() => {
    void fetchAndSet();
  }, [fetchAndSet]);

  const refresh = useCallback(async () => {
    await fetchAndSet();
  }, [fetchAndSet]);

  const applyAssignments = useCallback(async ({ assignments, result }: ApplyAssignmentsParams) => {
    if (!uid) {
      setError("ポートフォリオ同期にはログインが必要です");
      return false;
    }

    if (!portfolioUser) {
      setError("ポートフォリオ情報が読み込まれていません");
      return false;
    }

    const actionable = assignments.filter(item => item.field !== undefined);
    if (actionable.length === 0) {
      setError("同期するセクションが選択されていません");
      return false;
    }

    setSyncing(true);
    setError(null);

    try {
      const userId = portfolioUser.id || uid;
      const normalizedPortfolio = normalizePortfolio(portfolioUser.portfolio, userId);
      const nextPortfolio = {
        ...normalizedPortfolio,
        projects: normalizedPortfolio.projects.map(cloneProject),
      };

      const sectionMap = new Map<string, SectionReviewFeedback>();
      result.sections.forEach(section => {
        sectionMap.set(section.sectionId, section);
      });

      actionable.forEach(assignment => {
        const section = sectionMap.get(assignment.sectionId);
        if (!section) return;
        const text = section.revisedText?.trim();
        if (!text) return;

        switch (assignment.field) {
          case "selfIntroduction":
            nextPortfolio.selfIntroduction = text;
            break;
          case "experience":
            nextPortfolio.experience = text;
            break;
          case "internship":
            nextPortfolio.internship = text;
            break;
          case "extracurricular":
            nextPortfolio.extracurricular = text;
            break;
          case "awards":
            nextPortfolio.awards = text;
            break;
          case "customQuestions":
            nextPortfolio.customQuestions = text;
            break;
          case "additionalInfo":
            nextPortfolio.additionalInfo = text;
            break;
          case "projects": {
            const projectName = assignment.projectName?.trim() || section.sectionTitle || "AI提案プロジェクト";
            nextPortfolio.projects.push({
              id: createUniqueId(),
              name: projectName,
              description: text,
              url: undefined,
            });
            break;
          }
          default:
            break;
        }
      });

      const payload = {
        user_id: userId,
        user: {
          id: portfolioUser.id,
          uid,
          name: portfolioUser.name,
          email: portfolioUser.email,
          phone: portfolioUser.phone ?? "",
          address: portfolioUser.address ?? "",
        },
        portfolio: {
          ...nextPortfolio,
          user_id: userId,
          skillTags: Array.isArray(nextPortfolio.skillTags) ? nextPortfolio.skillTags : [],
          projects: nextPortfolio.projects,
          visibilitySettings: nextPortfolio.visibilitySettings ?? {},
        },
        projects: nextPortfolio.projects,
        visibilitySettings: nextPortfolio.visibilitySettings ?? {},
      };

      const response = await fetch("/api/portfolio/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const body = await response.json().catch(() => ({}));
        throw new Error(body.error || "ポートフォリオの更新に失敗しました");
      }

      setPortfolioUser(prev => {
        if (!prev) return prev;
        const updatedPortfolio = {
          ...nextPortfolio,
          rawProjects: JSON.stringify(nextPortfolio.projects),
        } as Portfolio & { projects: Project[] };
        return {
          ...prev,
          selfIntroduction: updatedPortfolio.selfIntroduction ?? prev.selfIntroduction,
          portfolio: updatedPortfolio,
        };
      });
      setLastUpdatedAt(new Date().toISOString());
      return true;
    } catch (err) {
      console.error("Failed to sync AI review with portfolio", err);
      const message = err instanceof Error ? err.message : "ポートフォリオの同期に失敗しました";
      setError(message);
      return false;
    } finally {
      setSyncing(false);
    }
    return false;
  }, [portfolioUser, uid]);

  return useMemo(() => ({
    loading,
    syncing,
    error,
    portfolioUser,
    lastUpdatedAt,
    refresh,
    applyAssignments,
  }), [loading, syncing, error, portfolioUser, lastUpdatedAt, refresh, applyAssignments]);
}
