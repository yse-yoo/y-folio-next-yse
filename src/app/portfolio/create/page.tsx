"use client";
import { Briefcase, Save, Eye, User, Code, Projector, Cog, Plus, X, EyeOff } from 'lucide-react';
import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";

type Project = { name: string; description: string; url: string };

type FormState = {
  name: string;
  university: string;
  faculty: string; // 追加
  grade: string;
  email: string;
  phone: string;
  address: string;
  selfIntroduction: string;
  skillTags: string[];
  skillInput: string;
  certifications: string;
  projects: Project[];
  projectInput: Project;
  experience: {
    internship: string;
    extracurricular: string;
    awards: string;
  };
  other: {
    customQuestions: string;
    additionalInfo: string;
  };
  publication: {
    isPublic: boolean;
    autoDeleteAfterOneYear: boolean;
  };
  visibilitySettings: {
    basicInfo: boolean;
    phone: boolean;
    address: boolean;
    skills: boolean;
    projects: boolean;
    experience: boolean;
    other: boolean;
  };
};

const initialForm: FormState = {
  name: '',
  university: '',
  faculty: '', // 追加
  grade: '',
  email: '',
  phone: '',
  address: '',
  selfIntroduction: '',
  skillTags: [],
  skillInput: '',
  certifications: '',
  projects: [],
  projectInput: { name: '', description: '', url: '' },
  experience: {
    internship: '',
    extracurricular: '',
    awards: '',
  },
  other: {
    customQuestions: '',
    additionalInfo: '',
  },
  publication: {
    isPublic: false,
    autoDeleteAfterOneYear: false,
  },
  visibilitySettings: {
    basicInfo: true,
    phone: false,
    address: false,
    skills: true,
    projects: true,
    experience: true,
    other: true,
  },
};

const LoadingScreen = () => (
  <div className="flex flex-col items-center gap-4">
    <div className="h-12 w-12 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600" />
    <p className="text-sm text-gray-600">読み込み中です…</p>
  </div>
);

const PortfolioCreatePage = () => {
  const [form, setForm] = useState<FormState>(initialForm);
  const skillInputRef = useRef<HTMLInputElement>(null);
  const { user, loading: authLoading } = useAuth();
  const [initializing, setInitializing] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (user) {
      setForm((prev) => ({
        ...prev,
        name: user.displayName || "",
        email: user.email || "",
      }));
    }

    if (!authLoading) {
      setInitializing(false);
    }
  }, [authLoading, user]);

  // 基本情報
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value,  } = e.target;
    if (name in form.experience) {
      setForm((prev) => ({ ...prev, experience: { ...prev.experience, [name]: value } }));
    } else if (name in form.other) {
      setForm((prev) => ({ ...prev, other: { ...prev.other, [name]: value } }));
    } else if (name in form.publication) {
      const checked = (e.target as HTMLInputElement).checked;
      setForm((prev) => ({ ...prev, publication: { ...prev.publication, [name]: checked } }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  // 可視性設定の変更
  const handleVisibilityChange = (section: keyof FormState['visibilitySettings']) => {
    setForm((prev) => ({
      ...prev,
      visibilitySettings: {
        ...prev.visibilitySettings,
        [section]: !prev.visibilitySettings[section],
      },
    }));
  };

  // スキルタグ
  const handleSkillInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, skillInput: e.target.value }));
  };
  const handleSkillInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && form.skillInput.trim()) {
      e.preventDefault();
      if (!form.skillTags.includes(form.skillInput.trim())) {
        setForm((prev) => ({ ...prev, skillTags: [...prev.skillTags, prev.skillInput.trim()], skillInput: '' }));
      } else {
        setForm((prev) => ({ ...prev, skillInput: '' }));
      }
    }
  };
  const handleRemoveSkillTag = (idx: number) => {
    setForm((prev) => ({ ...prev, skillTags: prev.skillTags.filter((_, i) => i !== idx) }));
    setTimeout(() => skillInputRef.current?.focus(), 0);
  };

  // プロジェクト
  const handleProjectChange = (idx: number, field: keyof Project, value: string) => {
    setForm((prev) => {
      const newProjects = prev.projects.map((p, i) =>
        i === idx ? { ...p, [field]: value } : p
      );
      return { ...prev, projects: newProjects };
    });
  };
  const handleAddProject = () => {
    setForm((prev) => ({
      ...prev,
      projects: [...prev.projects, { ...prev.projectInput }],
      projectInput: { name: '', description: '', url: '' },
    }));
  };
  const handleRemoveProject = (idx: number) => {
    setForm((prev) => ({ ...prev, projects: prev.projects.filter((_, i) => i !== idx) }));
  };
  const handleProjectInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, projectInput: { ...prev.projectInput, [name]: value } }));
  };

  // 可視性トグルコンポーネント
  const VisibilityToggle = ({isVisible, onChange }: { section: string; isVisible: boolean; onChange: () => void }) => (
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
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
          isVisible ? 'bg-indigo-600' : 'bg-gray-200'
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
            isVisible ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
    </div>
  );

  const handleSave = async () => {
    if (!user) return;

    const sanitizeProject = (project: Project): Project | null => {
      const name = project.name.trim();
      const description = project.description.trim();
      const url = project.url.trim();
      const hasContent = name.length > 0 || description.length > 0 || url.length > 0;
      if (!hasContent) {
        return null;
      }
      return {
        name,
        description,
        url,
      };
    };

    const sanitizedProjects = (() => {
      const committedProjects = form.projects
        .map(sanitizeProject)
        .filter((project): project is Project => project !== null);

      const pendingProject = sanitizeProject(form.projectInput);
      if (pendingProject) {
        committedProjects.push(pendingProject);
      }
      return committedProjects;
    })();

    const sanitizedExperience = {
      internship: form.experience.internship.trim(),
      extracurricular: form.experience.extracurricular.trim(),
      awards: form.experience.awards.trim(),
    };

    const sanitizedOther = {
      customQuestions: form.other.customQuestions.trim(),
      additionalInfo: form.other.additionalInfo.trim(),
    };

    const sanitizedSkillTags = form.skillTags
      .map((tag) => tag.trim())
      .filter((tag) => tag.length > 0);

    try {
      const resolvedUserId = user.uid;

      const payload = {
        user_id: resolvedUserId,
        user: {
          id: resolvedUserId,
          uid: resolvedUserId,
          name: form.name.trim(),
          email: form.email.trim(),
          phone: form.phone.trim(),
          address: form.address.trim(),
          university: form.university.trim(),
          department: form.faculty.trim(),
          grade: form.grade.trim(),
          selfIntroduction: form.selfIntroduction.trim(),
        },
        portfolio: {
          name: form.name.trim(),
          university: form.university.trim(),
          faculty: form.faculty.trim(),
          grade: form.grade.trim(),
          email: form.email.trim(),
          phone: form.phone.trim(),
          address: form.address.trim(),
          selfIntroduction: form.selfIntroduction.trim(),
          skillTags: sanitizedSkillTags,
          certifications: form.certifications.trim(),
          projects: sanitizedProjects,
          experience: sanitizedExperience,
          other: sanitizedOther,
          publication: form.publication,
          visibilitySettings: form.visibilitySettings,
        },
        projects: sanitizedProjects,
        visibilitySettings: form.visibilitySettings,
      };

      const res = await fetch("/api/portfolio/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const responseBody = await res.json().catch(() => null);
      if (!res.ok) {
        const message = typeof responseBody?.error === "string"
          ? responseBody.error
          : `保存に失敗しました (status ${res.status})`;
        throw new Error(message);
      }
      const data = responseBody;
      // 保存成功時にプレビュー画面へ遷移
      router.push(`/portfolio/preview?id=${data.portfolio.id}`);
    } catch (e) {
      console.error("保存エラー:", e);
      const message = e instanceof Error ? e.message : "保存に失敗しました";
      alert(message);
    }
  };

  if (authLoading || initializing) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <LoadingScreen />
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <nav className="bg-white shadow-md">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <a href="#" className="flex items-center">
                <Briefcase className="w-7 h-7 text-indigo-600 mr-2" />
                <h1 className="text-2xl font-bold text-gray-800">Y-folio</h1>
              </a>
            </div>
            <div className="flex items-center space-x-4">
              <button className="text-gray-600 hover:text-indigo-600 transition flex items-center">
                <Save className="w-5 h-5 mr-1" />下書き保存
              </button>
              <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition flex items-center">
                <Eye className="w-5 h-5 mr-1" />プレビュー
              </button>
              <a href="#" className="text-gray-600 hover:text-gray-800 transition">
                <X className="w-6 h-6" />
              </a>
            </div>
          </div>
        </div>
      </nav>
      <div className="flex min-h-screen">
        {/* Left Sidebar - Form */}
        <div className="w-1/2 bg-white border-r border-gray-200">
          <div className="form-section p-6 max-h-[calc(100vh-120px)] overflow-y-auto">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">ポートフォリオを作成</h2>
            {/* Progress Steps */}
            <div className="mb-8">
              <div className="flex items-center space-x-4">
                <div className="step-item active flex items-center">
                  <div className="w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center text-sm font-semibold">1</div>
                  <span className="ml-2 text-sm font-medium text-indigo-600">基本情報</span>
                </div>
                <div className="flex-1 h-px bg-gray-300"></div>
                <div className="step-item flex items-center">
                  <div className="w-8 h-8 bg-gray-300 text-gray-600 rounded-full flex items-center justify-center text-sm font-semibold">2</div>
                  <span className="ml-2 text-sm font-medium text-gray-600">経歴・実績</span>
                </div>
                <div className="flex-1 h-px bg-gray-300"></div>
                <div className="step-item flex items-center">
                  <div className="w-8 h-8 bg-gray-300 text-gray-600 rounded-full flex items-center justify-center text-sm font-semibold">3</div>
                  <span className="ml-2 text-sm font-medium text-gray-600">公開設定</span>
                </div>
              </div>
            </div>
            {/* Form Sections */}
            <form onSubmit={e => e.preventDefault()}>
              {/* 基本情報 */}
              <div className="section-card active p-6 rounded-lg mb-6 border-l-4 border-indigo-600 bg-slate-50">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                    <User className="w-5 h-5 mr-2 text-indigo-600" />基本情報
                  </h3>
                  <VisibilityToggle
                    section="basicInfo"
                    isVisible={form.visibilitySettings.basicInfo}
                    onChange={() => handleVisibilityChange('basicInfo')}
                  />
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">お名前</label>
                    <input type="text" name="name" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent" placeholder="山田 太郎" value={form.name} onChange={handleChange} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">大学名</label>
                    <input type="text" name="university" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent" placeholder="東京大学" value={form.university} onChange={handleChange} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">学部・学科</label>
                    <input type="text" name="faculty" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent" placeholder="工学部" value={form.faculty} onChange={handleChange} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">学年</label>
                    <select name="grade" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent" value={form.grade} onChange={handleChange}>
                      <option value="">選択してください</option>
                      <option value="1年生">1年生</option>
                      <option value="2年生">2年生</option>
                      <option value="3年生">3年生</option>
                      <option value="4年生">4年生</option>
                      <option value="修士1年">修士1年</option>
                      <option value="修士2年">修士2年</option>
                      <option value="博士課程">博士課程</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">メールアドレス</label>
                    <input type="email" name="email" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent" placeholder="yamada@example.com" value={form.email} onChange={handleChange} />
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700 mb-2">電話番号</label>
                      <input type="tel" name="phone" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent" placeholder="090-1234-5678" value={form.phone} onChange={handleChange} />
                    </div>
                    <VisibilityToggle
                      section="phone"
                      isVisible={form.visibilitySettings.phone}
                      onChange={() => handleVisibilityChange('phone')}
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700 mb-2">所在地</label>
                      <input type="text" name="address" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent" placeholder="東京都新宿区" value={form.address} onChange={handleChange} />
                    </div>
                    <VisibilityToggle
                      section="address"
                      isVisible={form.visibilitySettings.address}
                      onChange={() => handleVisibilityChange('address')}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">自己紹介</label>
                    <textarea name="selfIntroduction" rows={4} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent" placeholder="あなたの強みや興味のある分野について教えてください" value={form.selfIntroduction} onChange={handleChange}></textarea>
                  </div>
                </div>
              </div>
              {/* スキル・技術 */}
              <div className="section-card p-6 rounded-lg mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                  <Code className="w-5 h-5 mr-2 text-indigo-600" />スキル・技術
                </h3>
                  <VisibilityToggle
                    section="skills"
                    isVisible={form.visibilitySettings.skills}
                    onChange={() => handleVisibilityChange('skills')}
                  />
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">スキルタグ</label>
                    <div className="flex flex-wrap gap-2 p-2 border border-gray-300 rounded-lg min-h-[42px]">
                      {form.skillTags.map((tag, idx) => (
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
                        value={form.skillInput}
                        onChange={handleSkillInputChange}
                        onKeyDown={handleSkillInputKeyDown}
                        placeholder="スキルを入力してEnterキーを押してください"
                        className="flex-1 outline-none bg-transparent min-w-32"
                      />
                    </div>
                    <p className="text-sm text-gray-500 mt-1">例：JavaScript, React, Python, デザイン思考</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">資格・検定</label>
                    <textarea name="certifications" rows={3} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent" placeholder="例：TOEIC 850点、基本情報技術者試験 合格" value={form.certifications} onChange={handleChange}></textarea>
                  </div>
                </div>
              </div>
              {/* プロジェクト・実績 */}
              <div className="section-card p-6 rounded-lg mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                  <Projector className="w-5 h-5 mr-2 text-indigo-600" />プロジェクト・実績
                </h3>
                  <VisibilityToggle
                    section="projects"
                    isVisible={form.visibilitySettings.projects}
                    onChange={() => handleVisibilityChange('projects')}
                  />
                </div>
                <div className="space-y-4">
                  {form.projects.map((project, idx) => (
                    <div key={idx} className="project-item border border-gray-200 rounded-lg p-4 mb-4">
                      <div className="flex justify-between items-start mb-3">
                        <h4 className="font-medium text-gray-800">プロジェクト #{idx + 1}</h4>
                        <button type="button" className="text-red-500 hover:text-red-700" onClick={() => handleRemoveProject(idx)}>
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="space-y-3">
                        <input type="text" name="name" placeholder="プロジェクト名" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent" value={project.name} onChange={e => handleProjectChange(idx, 'name', e.target.value)} />
                        <textarea name="description" placeholder="プロジェクトの説明、使用技術、成果など" rows={3} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent" value={project.description} onChange={e => handleProjectChange(idx, 'description', e.target.value)}></textarea>
                        <input type="url" name="url" placeholder="プロジェクトURL（任意）" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent" value={project.url || ''} onChange={e => handleProjectChange(idx, 'url', e.target.value)} />
                      </div>
                    </div>
                  ))}
                  <div className="project-item border border-gray-200 rounded-lg p-4 mb-4">
                    <div className="flex justify-between items-start mb-3">
                      <h4 className="font-medium text-gray-800">新規プロジェクト</h4>
                    </div>
                    <div className="space-y-3">
                      <input type="text" name="name" placeholder="プロジェクト名" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent" value={form.projectInput.name} onChange={handleProjectInputChange} />
                      <textarea name="description" placeholder="プロジェクトの説明、使用技術、成果など" rows={3} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent" value={form.projectInput.description} onChange={handleProjectInputChange}></textarea>
                      <input type="url" name="url" placeholder="プロジェクトURL（任意）" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent" value={form.projectInput.url} onChange={handleProjectInputChange} />
                    </div>
                    <button type="button" className="w-full py-2 border-2 border-dashed border-indigo-400 rounded-lg text-indigo-600 flex items-center justify-center mt-2 hover:bg-indigo-50" onClick={handleAddProject}>
                      <Plus className="w-5 h-5 mr-2" />プロジェクトを追加
                    </button>
                  </div>
                </div>
              </div>
              {/* 経験・活動 */}
              <div className="section-card p-6 rounded-lg mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                  <Briefcase className="w-5 h-5 mr-2 text-indigo-600" />経験・活動
                </h3>
                  <VisibilityToggle
                    section="experience"
                    isVisible={form.visibilitySettings.experience}
                    onChange={() => handleVisibilityChange('experience')}
                  />
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">インターンシップ経験</label>
                    <textarea name="internship" rows={3} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent" placeholder="インターンシップでの経験や学んだことを記載してください" value={form.experience.internship} onChange={handleChange}></textarea>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">課外活動・サークル</label>
                    <textarea name="extracurricular" rows={3} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent" placeholder="サークル活動、ボランティア、アルバイトなど" value={form.experience.extracurricular} onChange={handleChange}></textarea>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">受賞歴・表彰</label>
                    <textarea name="awards" rows={2} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent" placeholder="コンテスト受賞、学術表彰など" value={form.experience.awards} onChange={handleChange}></textarea>
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
                    section="other"
                    isVisible={form.visibilitySettings.other}
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
                      value={form.other.customQuestions} 
                      onChange={handleChange}
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
                      value={form.other.additionalInfo} 
                      onChange={handleChange}
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
                      <input type="checkbox" name="isPublic" className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" checked={form.publication.isPublic} onChange={handleChange} />
                      <span className="ml-2 text-sm text-gray-700">ポートフォリオを公開する</span>
                    </label>
                    <p className="text-sm text-gray-500 mt-1">公開すると他のユーザーがあなたのポートフォリオを閲覧できます</p>
                  </div>
                  <div>
                    <label className="flex items-center">
                      <input type="checkbox" name="autoDeleteAfterOneYear" className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" checked={form.publication.autoDeleteAfterOneYear} onChange={handleChange} />
                      <span className="ml-2 text-sm text-gray-700">1年後に自動削除する</span>
                    </label>
                    <p className="text-sm text-gray-500 mt-1">チェックを外すと、手動で削除するまでポートフォリオが保持されます</p>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
        {/* Right Side - Preview */}
        <div className="w-1/2 bg-gray-50">
          <div className="preview-section p-6 max-h-[calc(100vh-120px)] overflow-y-auto">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              {/* Preview Header */}
              <div className="bg-gradient-to-br from-indigo-500 to-purple-500 text-white p-8">
                <div className="text-center">
                  <div className="w-20 h-20 bg-white/20 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <User className="w-10 h-10 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold mb-2">{form.name || 'お名前を入力してください'}</h2>
                  <p className="text-lg opacity-90">{form.university || '大学名を入力してください'}</p>
                  <p className="text-lg opacity-90">{form.faculty || '学部・学科を入力してください'}</p>
                  <p className="text-sm opacity-75">{form.grade}</p>
                </div>
              </div>
              {/* Preview Content */}
              <div className="p-6">
                {/* Introduction */}
                {form.visibilitySettings.basicInfo && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                    <User className="w-5 h-5 mr-2 text-indigo-600" />自己紹介
                  </h3>
                  <p className="text-gray-700">{form.selfIntroduction || '自己紹介を入力してください'}</p>
                </div>
                )}
                {form.visibilitySettings.phone && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                      <User className="w-5 h-5 mr-2 text-indigo-600" />電話番号
                    </h3>
                    <p className="text-gray-700">{form.phone || '電話番号を入力してください'}</p>
                  </div>
                )}
                {form.visibilitySettings.address && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                      <User className="w-5 h-5 mr-2 text-indigo-600" />所在地
                    </h3>
                    <p className="text-gray-700">{form.address || '所在地を入力してください'}</p>
                  </div>
                )}
                {/* Skills */}
                {form.visibilitySettings.skills && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                    <Code className="w-5 h-5 mr-2 text-indigo-600" />スキル
                  </h3>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {form.skillTags.length === 0 ? (
                      <span className="px-3 py-1 bg-gray-100 text-gray-500 rounded-full text-sm">スキルを追加してください</span>
                    ) : (
                      form.skillTags.map((tag, idx) => (
                        <span key={idx} className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm">{tag}</span>
                      ))
                    )}
                  </div>
                </div>
                )}
                {/* Certifications */}
                {form.visibilitySettings.skills && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                    <Code className="w-5 h-5 mr-2 text-indigo-600" />資格・検定
                  </h3>
                  <p className="text-gray-700">{form.certifications}</p>
                </div>
                )}
                {/* Projects */}
                {form.visibilitySettings.projects && (
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
                {/* Experience & Activities */}
                {form.visibilitySettings.experience && (form.experience.internship || form.experience.extracurricular || form.experience.awards) && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                      <Briefcase className="w-5 h-5 mr-2 text-indigo-600" />経験・活動
                    </h3>
                    {form.experience.internship && (
                      <div className="mb-4">
                        <h4 className="font-medium text-gray-700 mb-2">インターンシップ経験</h4>
                        <p className="text-gray-700 whitespace-pre-wrap">{form.experience.internship}</p>
                      </div>
                    )}
                    {form.experience.extracurricular && (
                      <div className="mb-4">
                        <h4 className="font-medium text-gray-700 mb-2">課外活動・サークル</h4>
                        <p className="text-gray-700 whitespace-pre-wrap">{form.experience.extracurricular}</p>
                      </div>
                    )}
                    {form.experience.awards && (
                      <div className="mb-4">
                        <h4 className="font-medium text-gray-700 mb-2">受賞歴・表彰</h4>
                        <p className="text-gray-700 whitespace-pre-wrap">{form.experience.awards}</p>
                      </div>
                    )}
                  </div>
                )}
                {/* Contact */}
                {form.visibilitySettings.basicInfo && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                    <User className="w-5 h-5 mr-2 text-indigo-600" />連絡先
                  </h3>
                  <p className="text-gray-700">{form.email || 'メールアドレスを入力してください'}</p>
                </div>
                )}
                {/* Other Information */}
                {form.visibilitySettings.other && (form.other.customQuestions || form.other.additionalInfo) && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                      <Plus className="w-5 h-5 mr-2 text-indigo-600" />その他
                    </h3>
                    {form.other.customQuestions && (
                      <div className="mb-4">
                        <h4 className="font-medium text-gray-700 mb-2">企業のオリジナル設問</h4>
                        <p className="text-gray-700 whitespace-pre-wrap">{form.other.customQuestions}</p>
                      </div>
                    )}
                    {form.other.additionalInfo && (
                      <div className="mb-4">
                        <h4 className="font-medium text-gray-700 mb-2">その他の追加情報</h4>
                        <p className="text-gray-700 whitespace-pre-wrap">{form.other.additionalInfo}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Floating Action Button */}
      <div className="fixed bottom-5 right-5 z-50">
        <button className="bg-indigo-600 text-white p-4 rounded-full shadow-lg hover:bg-indigo-700 transition hover:scale-105 flex items-center" onClick={handleSave}>
          <Save className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
};

export default PortfolioCreatePage;