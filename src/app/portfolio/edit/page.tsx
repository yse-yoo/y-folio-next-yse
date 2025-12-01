"use client";

import { Briefcase, ArrowLeft, Save, Code, UserIcon, Projector, Cog, Plus, X, Eye, EyeOff, Trash2 }
  from 'lucide-react';
import React, { useState, useRef, useEffect } from 'react';
import { User } from '@/types/User';
import { Project } from '@/types/Project';
import { Portfolio } from '@/types/Portforio';
import { fetchUser } from '@/lib/api/user';
import { useAuth } from '@/hooks/useAuth';

// フォーム状態の型定義
interface PortfolioForm {
  user: User;
  portfolio: Portfolio;
  projects: Project[];
  isDirty: boolean;
  isSubmitting: boolean;
}

// 可視性設定の型定義
interface VisibilitySettings {
  basicInfo: boolean;  // ユーザー情報の可視性
  phone: boolean; // 電話番号の可視性
  address: boolean; // 所在地の可視性
  skills: boolean; // スキルの可視性
  projects: boolean; // プロジェクトの可視性
  experience: boolean; // 経験・活動の可視性
  other: boolean; // その他の自由記述欄の可視性
}

const createEmptyUser = (): User => ({
  id: "",
  name: "",
  email: "",
  phone: "",
  address: "",
  university: "",
  department: "",
  grade: "",
  selfIntroduction: "",
});

const createEmptyPortfolio = (userId = ""): Portfolio => ({
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
  internship: "",
  extracurricular: "",
  experience: "",
  awards: "",
  customQuestions: "",
  additionalInfo: "",
  isPublic: false,
  autoDeleteAfterOneYear: false,
  visibilitySettings: {},
  projects: [],
});

const createEmptyProject = (): Project => ({
  id: typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
    ? crypto.randomUUID()
    : `project-${Date.now()}-${Math.random().toString(16).slice(2)}`,
  name: "",
  description: "",
  url: "",
});

const defaultVisibilitySettings: VisibilitySettings = {
  basicInfo: true,
  phone: false,
  address: false,
  skills: true,
  projects: true,
  experience: true,
  other: true,
};

const initialForm: PortfolioForm = {
  user: createEmptyUser(),
  portfolio: createEmptyPortfolio(),
  projects: [],
  isDirty: false,
  isSubmitting: true,
};

const ensureString = (value: unknown, fallback: string | null | undefined = ""): string => {
  const fallbackString = typeof fallback === "string" ? fallback : fallback == null ? "" : String(fallback);
  if (typeof value === "string") return value;
  if (value == null) return fallbackString;
  return String(value);
};

const ensureBoolean = (value: unknown, fallback: boolean | null | undefined = false): boolean => {
  if (typeof value === "boolean") return value;
  if (typeof fallback === "boolean") return fallback;
  return false;
};

const ensureStringArray = (value: unknown): string[] => {
  if (Array.isArray(value)) {
    return value
      .filter((item): item is string => typeof item === "string")
      .map((item) => item.trim())
      .filter(Boolean);
  }
  if (typeof value === "string") {
    return value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }
  return [];
};

const parseProjectsFromSource = (source: unknown): Project[] => {
  const normalizeProject = (record: Record<string, unknown>, index: number): Project => {
    const fallbackId = typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
      ? crypto.randomUUID()
      : `project-${index}`;
    const id = ensureString(record.id, fallbackId) || fallbackId;
    const name = ensureString(record.name);
    const description = ensureString(record.description);
    const urlValue = record.url;

    return {
      id,
      name,
      description,
      url: urlValue == null ? undefined : ensureString(urlValue),
    };
  };

  const handleArray = (arr: unknown[]): Project[] =>
    arr
      .map((item, index) => (item && typeof item === "object" && !Array.isArray(item)
        ? normalizeProject(item as Record<string, unknown>, index)
        : null))
      .filter((item): item is Project => item !== null);

  if (typeof source === "string") {
    try {
      const parsed = JSON.parse(source);
      return parseProjectsFromSource(parsed);
    } catch {
      return [];
    }
  }

  if (Array.isArray(source)) {
    return handleArray(source);
  }

  if (source && typeof source === "object" && !Array.isArray(source)) {
    return handleArray([source]);
  }

  return [];
};

const mapVisibilitySettings = (source: Record<string, unknown> | null | undefined): VisibilitySettings => ({
  basicInfo: ensureBoolean(source?.basicInfo, defaultVisibilitySettings.basicInfo),
  phone: ensureBoolean(source?.phone, defaultVisibilitySettings.phone),
  address: ensureBoolean(source?.address, defaultVisibilitySettings.address),
  skills: ensureBoolean(source?.skills, defaultVisibilitySettings.skills),
  projects: ensureBoolean(source?.projects, defaultVisibilitySettings.projects),
  experience: ensureBoolean(source?.experience, defaultVisibilitySettings.experience),
  other: ensureBoolean(source?.other, defaultVisibilitySettings.other),
});

const mapPortfolioResponse = (portfolio: Portfolio | null | undefined, userId: string): Portfolio => {
  const base = createEmptyPortfolio(userId);
  if (!portfolio) return base;

  const skills = ensureStringArray(portfolio.skills ?? portfolio.skillTags);
  const projects = parseProjectsFromSource(portfolio.projects as unknown);
  return {
    ...base,
    ...portfolio,
    id: ensureString(portfolio.id, base.id),
    user_id: ensureString(portfolio.user_id, userId),
    name: ensureString(portfolio.name, base.name),
    university: ensureString(portfolio.university, base.university),
    faculty: ensureString(portfolio.faculty, base.faculty),
    grade: ensureString(portfolio.grade, base.grade),
    email: ensureString(portfolio.email, base.email),
    selfIntroduction: ensureString(portfolio.selfIntroduction, base.selfIntroduction),
    skills,
    skillTags: skills,
    certifications: ensureString(portfolio.certifications, base.certifications),
    internship: ensureString(portfolio.internship, base.internship),
    extracurricular: ensureString(portfolio.extracurricular, base.extracurricular),
    experience: ensureString(portfolio.experience, base.experience),
    awards: ensureString(portfolio.awards, base.awards),
    customQuestions: ensureString(portfolio.customQuestions, base.customQuestions),
    additionalInfo: ensureString(portfolio.additionalInfo, base.additionalInfo),
    isPublic: ensureBoolean(portfolio.isPublic, base.isPublic),
    autoDeleteAfterOneYear: ensureBoolean(portfolio.autoDeleteAfterOneYear, !!base.autoDeleteAfterOneYear),
    visibilitySettings: portfolio.visibilitySettings ?? base.visibilitySettings,
    projects,
  };
};

const mapUserResponse = (data: Partial<User> | undefined, fallbackId: string): User => {
  const base = createEmptyUser();
  if (!data) {
    return { ...base, id: fallbackId };
  }

  return {
    ...base,
    ...data,
    id: ensureString(data.id, fallbackId || base.id),
    name: ensureString(data.name, base.name),
    email: ensureString(data.email, base.email),
    phone: ensureString(data.phone, base.phone),
    address: ensureString(data.address, base.address),
    university: ensureString(data.university, base.university),
    department: ensureString(data.department, base.department),
    grade: ensureString(data.grade, base.grade),
    selfIntroduction: ensureString(data.selfIntroduction, base.selfIntroduction),
  };
};

type UserWithPortfolio = User & {
  portfolio?: Portfolio | null;
};

const LoadingScreen = () => (
  <div className="flex min-h-screen items-center justify-center bg-gray-50">
    <div className="flex flex-col items-center gap-4">
      <div className="h-12 w-12 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600" />
      <p className="text-sm text-gray-600">読み込み中です…</p>
    </div>
  </div>
);

const PortfolioEditPage = () => {
  const [visibilitySettings, setVisibilitySettings] = useState<VisibilitySettings>(defaultVisibilitySettings);
  const [skillInput, setSkillInput] = useState("");
  const skillInputRef = useRef<HTMLInputElement>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");
  const [loadError, setLoadError] = useState("");

  const { user, loading } = useAuth();
  const [form, setForm] = useState<PortfolioForm>(initialForm);

  useEffect(() => {
    if (loading) return;

    let isMounted = true;
    const providerUid = user?.uid;

    if (!providerUid) {
      setLoadError("ユーザー情報を取得できませんでした。");
      setVisibilitySettings(defaultVisibilitySettings);
      setForm({
        user: mapUserResponse(undefined, ""),
        portfolio: createEmptyPortfolio(),
        projects: [],
        isDirty: false,
        isSubmitting: false,
      });
      return () => {
        isMounted = false;
      };
    }

    setLoadError("");
    setForm((prev) => ({ ...prev, isSubmitting: true }));

    fetchUser(providerUid)
      .then((apiResponse) => {
        if (!isMounted) return;

        const response = apiResponse as UserWithPortfolio;
        const mappedUser = mapUserResponse(response, providerUid);
        const resolvedUserId = mappedUser.id || providerUid;
        const mappedPortfolio = mapPortfolioResponse(response.portfolio, resolvedUserId);
        const nextVisibility = mapVisibilitySettings(mappedPortfolio.visibilitySettings as Record<string, unknown> | null | undefined);

        setVisibilitySettings(nextVisibility);
        setForm({
          user: mappedUser,
          portfolio: mappedPortfolio,
          projects: mappedPortfolio.projects ?? [],
          isDirty: false,
          isSubmitting: false,
        });
      })
      .catch((error) => {
        console.error("ユーザーデータの取得に失敗しました:", error);
        if (!isMounted) return;

        setLoadError("ユーザー情報の取得に失敗しました。");
        setVisibilitySettings(defaultVisibilitySettings);
        setForm({
          user: mapUserResponse(undefined, providerUid),
          portfolio: createEmptyPortfolio(providerUid),
          projects: [],
          isDirty: false,
          isSubmitting: false,
        });
      });

    return () => {
      isMounted = false;
    };
  }, [loading, user]);

  if (loading || form.isSubmitting) {
    return <LoadingScreen />;
  }

  const birthDateValue = (() => {
    const birthDate = form.user?.birthDate;
    if (!birthDate) return '';
    if (birthDate instanceof Date) {
      return birthDate.toISOString().slice(0, 10);
    }
    const parsed = new Date(birthDate);
    return Number.isNaN(parsed.getTime()) ? '' : parsed.toISOString().slice(0, 10);
  })();

  // 基本情報ハンドラ
  const handleBasicInfoChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      user: {
        ...prev.user,
        [name]: value,
      },
      isDirty: true,
    }));
  };

  const handlePortfolioChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    console.log("Portfolio Change:", name, value);
    setForm((prev) => ({
      ...prev,
      portfolio: {
        ...prev.portfolio,
        [name]: value,
      },
      isDirty: true,
    }));
  };

  const handleVisibilityChange = (selected: keyof VisibilitySettings) => {
    setVisibilitySettings((prev) => ({
      ...prev,
      [selected]: !prev[selected],
    }));
  };

  // スキルタグ追加
  const handleSkillInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSkillInput(e.target.value);
  };
  const handleSkillInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && skillInput.trim()) {
      e.preventDefault();
      const trimmed = skillInput.trim();
      if (!form?.portfolio?.skills?.includes(trimmed)) {
        setForm((prev) => {
          const updatedSkills = [...(prev.portfolio.skills ?? []), trimmed];
          return {
            ...prev,
            portfolio: {
              ...prev.portfolio,
              skills: updatedSkills,
              skillTags: updatedSkills,
            },
            isDirty: true,
          };
        });
      }
      setSkillInput("");
    }
  };
  // スキルタグ削除
  const handleRemoveSkillTag = (idx: number) => {
    setForm((prev) => {
      const currentSkills = prev.portfolio.skills ?? [];
      const updatedSkills = currentSkills.filter((_, i) => i !== idx);
      return {
        ...prev,
        portfolio: {
          ...prev.portfolio,
          skills: updatedSkills,
          skillTags: updatedSkills,
        },
        isDirty: true,
      };
    });
    // フォーカスを戻す
    setTimeout(() => skillInputRef.current?.focus(), 0);
  };

  // 資格・検定
  const handleSkillsChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      portfolio: {
        ...prev.portfolio,
        [name]: value,
      },
      isDirty: true,
    }));
  };

  // プロジェクト
  const handleProjectChange = (idx: number, field: string, value: string) => {
    setForm((prev) => {
      const newProjects = prev.projects.map((p, i) =>
        i === idx ? { ...p, [field]: value } : p
      );
      return {
        ...prev,
        projects: newProjects,
        portfolio: {
          ...prev.portfolio,
          projects: newProjects,
        },
        isDirty: true,
      };
    });
  };

  const handleAddProject = () => {
    setForm((prev) => {
      const newProject = createEmptyProject();
      const newProjects = [...(prev.projects ?? []), newProject];
      return {
        ...prev,
        projects: newProjects,
        portfolio: {
          ...prev.portfolio,
          projects: newProjects,
        },
        isDirty: true,
      };
    });
  };

  const handleRemoveProject = (idx: number) => {
    setForm((prev) => {
      const newProjects = prev.projects.filter((_, i) => i !== idx);
      return {
        ...prev,
        projects: newProjects,
        portfolio: {
          ...prev.portfolio,
          projects: newProjects,
        },
        isDirty: true,
      };
    });
  };

  // 経験・活動
  const handleExperienceChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      portfolio: {
        ...prev.portfolio,
        [name]: value,
      },
      isDirty: true,
    }));
  };

  // その他（自由記述欄）
  const handleOtherChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      portfolio: {
        ...prev.portfolio,
        [name]: value,
      },
      isDirty: true,
    }));
  };

  // 公開設定
  const handlePublicationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    console.log(name, checked)
    setForm((prev) => ({
      ...prev,
      portfolio: {
        ...prev.portfolio,
        [name]: checked,
      },
      isDirty: true,
    }));
  };

  // 可視性トグルコンポーネント
  const VisibilityToggle = ({ isVisible, onChange }: { isVisible: boolean; onChange: () => void }) => (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center">
        {isVisible ? <Eye className="w-4 h-4 text-green-600 mr-2" /> : <EyeOff className="w-4 h-4 text-gray-400 mr-2" />}
        <span className="text-sm font-medium text-gray-700">
          {isVisible ? '公開' : '非公開'}
        </span>
      </div>
      <button
        type="button"
        onClick={onChange}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${isVisible ? 'bg-indigo-600' : 'bg-gray-200'
          }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${isVisible ? 'translate-x-6' : 'translate-x-1'
            }`}
        />
      </button>
    </div>
  );

  // 保存処理
  const handleSave = async () => {
    setIsSaving(true);
    setSaveMessage("");
    try {
      if (!form?.user) {
        setSaveMessage("ユーザー情報の取得に失敗しました");
        return;
      }

      const resolvedUserId = form.user.id || form.user.uid || user?.uid || "";

      if (!resolvedUserId) {
        setSaveMessage("ユーザーIDが特定できません");
        return;
      }

      const payload = {
        user_id: resolvedUserId,
        user: {
          ...form.user,
          uid: form.user.uid || user?.uid || resolvedUserId,
        },
        portfolio: {
          ...form.portfolio,
          user_id: resolvedUserId,
          university: form.portfolio.university,
          grade: form.portfolio.grade,
          skillTags: form.portfolio.skills ?? [],
          projects: form.projects,
          visibilitySettings,
        },
        projects: form.projects,
        visibilitySettings,
      };

      const res = await fetch("/api/portfolio/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        const result = await res.json().catch(() => null);
        setSaveMessage("保存しました");
        setForm((prev) => ({
          ...prev,
          portfolio: {
            ...prev.portfolio,
            id: ensureString(result?.portfolio?.id, prev.portfolio.id),
            user_id: ensureString(result?.portfolio?.userId, resolvedUserId),
          },
          isDirty: false,
        }));
      } else {
        const errorText = await res.text();
        console.error("保存失敗:", errorText);
        setSaveMessage("保存に失敗しました");
      }
    } catch (e) {
      console.error("保存エラー:", e);
      setSaveMessage("保存時にエラーが発生しました");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <nav className="bg-white shadow-md">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <a href="/dashboard" className="flex items-center">
                <Briefcase className="w-7 h-7 text-indigo-600 mr-2" />
                <h1 className="text-2xl font-bold text-gray-800">Y-folio</h1>
              </a>
            </div>
            <div className="flex items-center space-x-4">
              <a href="/dashboard" className="text-gray-600 hover:text-indigo-600 transition flex items-center">
                <ArrowLeft className="w-5 h-5 mr-1" />ダッシュボードへ戻る
              </a>
              <button
                className={`px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition flex items-center ${isSaving || !form.isDirty ? 'opacity-60 cursor-not-allowed' : ''}`}
                onClick={handleSave}
                disabled={isSaving || !form.isDirty}
              >
                <Save className="w-5 h-5 mr-1" />
                {isSaving ? "保存中..." : "保存"}
              </button>
            </div>
          </div>
        </div>
      </nav>
      <main className="py-10">
        <div className="flex min-h-[70vh] gap-8 px-4">
          {/* Left: Form */}
          <div className="w-1/2">
            <div className="form-section bg-white rounded-lg shadow-md p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-8">ポートフォリオ編集</h2>
              {loadError && (
                <div className="mb-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded-lg text-sm">
                  {loadError}
                </div>
              )}
              {saveMessage && (
                <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded-lg text-sm">
                  {saveMessage}
                </div>
              )}
              {/* 基本情報 */}
              <div className="section-card active p-6 rounded-lg mb-6 border-l-4 border-indigo-600 bg-slate-50">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                    基本情報
                  </h3>
                  <VisibilityToggle
                    isVisible={visibilitySettings.basicInfo}
                    onChange={() => handleVisibilityChange('basicInfo')}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">お名前</label>
                    <input type="text" name="name"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      placeholder="山田 太郎"
                      value={form.user.name} onChange={handleBasicInfoChange} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">大学</label>
                    <input type="text" name="university"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      placeholder="東京大学"
                      value={form.portfolio.university || ''} onChange={handlePortfolioChange} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">学部</label>
                    <input type="text" name="faculty"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      placeholder="工学部"
                      value={form.portfolio.faculty || ''} onChange={handlePortfolioChange} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">学年</label>
                    <select name="grade" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      value={form.portfolio.grade || ''} onChange={handlePortfolioChange}>
                      <option value="">選択してください</option>
                      <option value="1">1年生</option>
                      <option value="2">2年生</option>
                      <option value="3">3年生</option>
                      <option value="4">4年生</option>
                      <option value="5">修士1年</option>
                      <option value="6">修士2年</option>
                      <option value="7">博士課程</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">生年月日</label>
                    <input type="date" name="birthDate"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      value={birthDateValue}
                      onChange={handleBasicInfoChange} />
                  </div>
                </div>
                <div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 my-2">メールアドレス（ポートフォリオ用）</label>
                    <input type="email" name="email"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      placeholder="yamada@example.com"
                      value={form.portfolio.email || ''} onChange={handlePortfolioChange} />
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700 my-2">所在地</label>
                      <input type="text" name="address"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        placeholder="東京都新宿区"
                        value={form.user.address || ''}
                        onChange={handleBasicInfoChange} />
                    </div>
                    <VisibilityToggle
                      isVisible={visibilitySettings.address}
                      onChange={() => handleVisibilityChange('address')}
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700 my-2">電話番号</label>
                      <input type="tel" name="phone"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        placeholder="090-1234-5678"
                        value={form.user.phone || ''} onChange={handleBasicInfoChange} />
                    </div>
                    <VisibilityToggle
                      isVisible={visibilitySettings.phone}
                      onChange={() => handleVisibilityChange('phone')}
                    />
                  </div>

                </div>
                <div className="mt-4">

                  <label className="block text-sm font-medium text-gray-700 mb-2">自己紹介</label>
                  <textarea name="selfIntroduction"
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent" placeholder="あなたの強みや興味のある分野について教えてください"
                    value={form.portfolio.selfIntroduction || ''}
                    onChange={handlePortfolioChange}></textarea>
                </div>
              </div>

              {/* スキル・技術 */}
              <div className="section-card p-6 rounded-lg mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                    <Code className="w-5 h-5 mr-2 text-indigo-600" />スキル・技術
                  </h3>
                  <VisibilityToggle
                    isVisible={visibilitySettings.skills}
                    onChange={() => handleVisibilityChange('skills')}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">スキルタグ</label>
                  <div className="flex flex-wrap gap-2 p-2 border border-gray-300 rounded-lg min-h-[42px]">
                    {form.portfolio?.skills?.map((tag, idx) => (
                      <span key={idx} className="bg-indigo-600 text-white px-3 py-1 rounded-full text-sm flex items-center">
                        {tag}
                        <button type="button" className="ml-1 hover:bg-indigo-800 rounded-full p-0.5" onClick={() => handleRemoveSkillTag(idx)} aria-label="タグ削除">
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                    <input
                      type="text"
                      ref={skillInputRef}
                      value={skillInput}
                      onChange={handleSkillInputChange}
                      onKeyDown={handleSkillInputKeyDown}
                      placeholder="スキルを追加"
                      className="flex-1 outline-none bg-transparent min-w-32"
                    />
                  </div>
                  <p className="text-sm text-gray-500 mt-1">例：JavaScript, React, Python, デザイン思考</p>
                </div>
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">資格・検定</label>
                  <textarea name="certifications"
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="例：TOEIC 850点、基本情報技術者試験 合格"
                    value={form.portfolio.certifications || ''}
                    onChange={handleSkillsChange}></textarea>
                </div>
              </div>

              {/* プロジェクト・実績 */}
              <div className="section-card p-6 rounded-lg mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                    <Projector className="w-5 h-5 mr-2 text-indigo-600" />プロジェクト・実績
                  </h3>
                  <VisibilityToggle
                    isVisible={visibilitySettings.projects}
                    onChange={() => handleVisibilityChange('projects')}
                  />
                </div>
                <div className="space-y-4">
                  {form.projects.map((project, idx) => (
                    <div key={project.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1 mr-2">
                          <label className="block text-sm font-medium text-gray-700 mb-2">プロジェクト名</label>
                          <input
                            type="text"
                            placeholder="プロジェクト名"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            value={project.name}
                            onChange={(e) => handleProjectChange(idx, 'name', e.target.value)}
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveProject(idx)}
                          className="text-gray-400 hover:text-red-500 transition"
                          aria-label="プロジェクトを削除"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                      <div className="mb-3">
                        <label className="block text-sm font-medium text-gray-700 mb-2">プロジェクトの説明</label>
                        <textarea
                          placeholder="プロジェクトの説明、使用技術、成果など"
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                          value={project.description}
                          onChange={(e) => handleProjectChange(idx, 'description', e.target.value)}
                        ></textarea>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">プロジェクトURL（任意）</label>
                        <input
                          type="url"
                          placeholder="https://example.com"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                          value={project.url || ''}
                          onChange={(e) => handleProjectChange(idx, 'url', e.target.value)}
                        />
                      </div>
                    </div>
                  ))}
                  <button
                    type="button"
                    className="w-full py-2 border-2 border-dashed border-indigo-400 rounded-lg text-indigo-600 mt-2 flex items-center justify-center hover:bg-indigo-50 transition"
                    onClick={handleAddProject}
                  >
                    <Plus className="w-5 h-5 mr-2" />プロジェクトを追加
                  </button>
                </div>
              </div>

              {/* 経験・活動 */}
              <div className="section-card p-6 rounded-lg mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                    <Briefcase className="w-5 h-5 mr-2 text-indigo-600" />経験・活動
                  </h3>
                  <VisibilityToggle
                    isVisible={visibilitySettings.experience}
                    onChange={() => handleVisibilityChange('experience')}
                  />
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">インターンシップ経験</label>
                    <textarea name="internship"
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      placeholder="インターンシップでの経験や学んだことを記載してください"
                      value={form.portfolio.internship || ''}
                      onChange={handleExperienceChange}></textarea>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">課外活動・サークル</label>
                    <textarea name="extracurricular"
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      placeholder="サークル活動、ボランティア、アルバイトなど"
                      value={form.portfolio.extracurricular || ''}
                      onChange={handleExperienceChange}></textarea>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">受賞歴・表彰</label>
                    <textarea name="awards"
                      rows={2}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      placeholder="コンテスト受賞、学術表彰など"
                      value={form.portfolio.awards || ''} onChange={handleExperienceChange}></textarea>
                  </div>
                </div>
              </div>

              {/* その他（自由記述欄） */}
              <div className="section-card p-6 rounded-lg mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                    <Plus className="w-5 h-5 mr-2 text-indigo-600" />その他（自由記述欄）
                  </h3>
                  <VisibilityToggle
                    isVisible={visibilitySettings.other}
                    onChange={() => handleVisibilityChange('other')}
                  />
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">企業のオリジナル設問</label>
                    <textarea
                      name="customQuestions"
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      placeholder="企業が設定したオリジナル設問があれば、ここに回答を記載してください。例：「当社のサービスについて知っていることを教えてください」「あなたの強みを活かせる職種は何だと思いますか？」"
                      value={form.portfolio.customQuestions || ''}
                      onChange={handleOtherChange}
                    ></textarea>
                    <p className="text-sm text-gray-500 mt-1">企業が設定したオリジナル設問への回答を記載してください</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">その他の追加情報</label>
                    <textarea
                      name="additionalInfo"
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      placeholder="その他、アピールしたい情報や企業に伝えたいことがあれば記載してください"
                      value={form.portfolio.additionalInfo || ''}
                      onChange={handleOtherChange}
                    ></textarea>
                    <p className="text-sm text-gray-500 mt-1">その他、アピールしたい情報や企業に伝えたいことがあれば記載してください</p>
                  </div>
                </div>
              </div>

              {/* 公開設定 */}
              <div className="section-card p-6 rounded-lg mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <Cog className="w-5 h-5 mr-2 text-indigo-600" />公開設定
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="flex items-center">
                      <input type="checkbox" name="isPublic"
                        className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                        checked={!!form.portfolio.isPublic}
                        onChange={handlePublicationChange} />
                      <span className="ml-2 text-sm text-gray-700">ポートフォリオを公開する</span>
                    </label>
                    <p className="text-sm text-gray-500 mt-1">公開すると他のユーザーがあなたのポートフォリオを閲覧できます</p>
                  </div>
                  <div>
                    <label className="flex items-center">
                      <input type="checkbox" name="autoDeleteAfterOneYear"
                        className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                        checked={!!form.portfolio.autoDeleteAfterOneYear}
                        onChange={handlePublicationChange} />
                      <span className="ml-2 text-sm text-gray-700">1年後に自動削除する</span>
                    </label>
                    <p className="text-sm text-gray-500 mt-1">チェックを外すと、手動で削除するまでポートフォリオが保持されます</p>
                  </div>
                </div>
              </div>

              <div className="flex justify-end mt-8">
                <button
                  className={`px-6 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition flex items-center ${isSaving || !form.isDirty ? 'opacity-60 cursor-not-allowed' : ''}`}
                  onClick={handleSave}
                  disabled={isSaving || !form.isDirty}
                >
                  <Save className="w-5 h-5 mr-2" />{isSaving ? "保存中..." : "保存"}
                </button>
              </div>
            </div>
          </div>
          {/* Right: Preview */}
          <div className="w-1/2 bg-gray-50">
            <div className="preview-section p-6">
              <div className="bg-white rounded-lg shadow-md overflow-hidden sticky top-8" style={{ maxHeight: 'calc(100vh - 64px)', overflowY: 'auto' }}>
                {/* Preview Header */}
                <div className="bg-gradient-to-br from-indigo-500 to-purple-500 text-white p-8">
                  <div className="text-center">
                    <div className="w-20 h-20 bg-white/20 rounded-full mx-auto mb-4 flex items-center justify-center">
                      <UserIcon className="w-10 h-10 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold mb-2">{form.user.name || 'お名前を入力してください'}</h2>
                    <p className="text-lg opacity-90">{form.user.university || '大学・学部を入力してください'}</p>
                    <p className="text-sm opacity-75">{form.user.grade}</p>
                  </div>
                </div>
                {/* Preview Content */}
                <div className="p-6">
                  {/* Introduction */}
                  {visibilitySettings.basicInfo && (
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                        <UserIcon className="w-5 h-5 mr-2 text-indigo-600" />自己紹介
                      </h3>
                      <p className="text-gray-700">{form.user.selfIntroduction || '自己紹介を入力してください'}</p>
                    </div>
                  )}
                  {visibilitySettings.phone && (
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                        <UserIcon className="w-5 h-5 mr-2 text-indigo-600" />電話番号
                      </h3>
                      <p className="text-gray-700">{form.user.phone || '電話番号を入力してください'}</p>
                    </div>
                  )}
                  {/* Contact */}
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                      <UserIcon className="w-5 h-5 mr-2 text-indigo-600" />連絡先
                    </h3>
                    <p className="text-gray-700">{form.user.email || 'メールアドレスを入力してください'}</p>
                  </div>
                  {visibilitySettings.address && (
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                        <UserIcon className="w-5 h-5 mr-2 text-indigo-600" />所在地
                      </h3>
                      <p className="text-gray-700">{form.user.address || '所在地を入力してください'}</p>
                    </div>
                  )}
                  {/* Skills */}
                  {visibilitySettings.skills && (
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                        <Code className="w-5 h-5 mr-2 text-indigo-600" />スキル
                      </h3>
                      <div className="flex flex-wrap gap-2 mb-3">
                        {form.portfolio?.skills?.length === 0 ? (
                          <span className="px-3 py-1 bg-gray-100 text-gray-500 rounded-full text-sm">スキルを追加してください</span>
                        ) : (
                          form.portfolio?.skills?.map((tag, idx) => (
                            <span key={idx} className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm">{tag}</span>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                  {visibilitySettings.skills && form.portfolio.certifications && (
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                        <Code className="w-5 h-5 mr-2 text-indigo-600" />資格・検定
                      </h3>
                      <p className="text-gray-700">{form.portfolio.certifications}</p>
                    </div>
                  )}
                  {/* Projects */}
                  {visibilitySettings.projects && (
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                        <Projector className="w-5 h-5 mr-2 text-indigo-600" />プロジェクト
                      </h3>
                      <div>
                        {form.projects.length === 0 ? (
                          <span className="px-3 py-1 bg-gray-100 text-gray-500 rounded-full text-sm">プロジェクトを追加してください</span>
                        ) : (
                          form.projects.map((project, idx) => (
                            <div key={idx} className="mb-2">
                              <div className="font-semibold text-indigo-700">{project.name}</div>
                              <div className="text-gray-700 text-sm">{project.description}</div>
                              {project.url && <a href={project.url} className="text-indigo-500 text-xs underline" target="_blank" rel="noopener noreferrer">{project.url}</a>}
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                  {visibilitySettings.experience && (
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                        <Briefcase className="w-5 h-5 mr-2 text-indigo-600" />経験・活動
                      </h3>
                      {form.portfolio.internship && (
                        <div className="mb-4">
                          <h4 className="font-medium text-gray-700 mb-2">インターンシップ経験</h4>
                          <p className="text-gray-700 whitespace-pre-wrap">{form.portfolio.internship}</p>
                        </div>
                      )}
                      {form.portfolio.extracurricular && (
                        <div className="mb-4">
                          <h4 className="font-medium text-gray-700 mb-2">課外活動・サークル</h4>
                          <p className="text-gray-700 whitespace-pre-wrap">{form.portfolio.extracurricular}</p>
                        </div>
                      )}
                      {form.portfolio.awards && (
                        <div className="mb-4">
                          <h4 className="font-medium text-gray-700 mb-2">受賞歴・表彰</h4>
                          <p className="text-gray-700 whitespace-pre-wrap">{form.portfolio.awards}</p>
                        </div>
                      )}
                    </div>
                  )}
                  {/* Other Information */}
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                      <Plus className="w-5 h-5 mr-2 text-indigo-600" />その他
                    </h3>
                    {form.portfolio.customQuestions && (
                      <div className="mb-4">
                        <h4 className="font-medium text-gray-700 mb-2">企業のオリジナル設問</h4>
                        <p className="text-gray-700 whitespace-pre-wrap">{form.portfolio.customQuestions}</p>
                      </div>
                    )}
                    {form.portfolio.additionalInfo && (
                      <div className="mb-4">
                        <h4 className="font-medium text-gray-700 mb-2">その他の追加情報</h4>
                        <p className="text-gray-700 whitespace-pre-wrap">{form.portfolio.additionalInfo}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PortfolioEditPage; 