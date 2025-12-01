'use client';

import { PortfolioPdfData } from '@/types/PortfolioPdf';

interface Props {
    data: PortfolioPdfData;
}

const EXPERIENCE_LABELS: Record<string, string> = {
    internship: 'インターンシップ',
    extracurricular: '課外活動',
    awards: '受賞歴',
};

export default function CareerPdfContent({ data }: Props) {
    const { user, portfolio } = data;
    const displayName = portfolio?.name || user?.name || '氏名未設定';
    const address = portfolio?.address || user?.address || '未登録';
    const phone = portfolio?.phone || user?.phone || '未登録';
    const email = portfolio?.email || user?.email || '未登録';
    const university = [portfolio?.university || user?.university, portfolio?.faculty || user?.faculty]
        .filter(Boolean)
        .join(' / ');
    const profile = portfolio?.selfIntroduction || user?.selfIntroduction || '自己紹介が登録されていません。';
    const skills = portfolio?.skillTags ?? [];
    const projects = portfolio?.projects ?? [];
    const experience = portfolio?.experience ?? {};
    const certifications = portfolio?.certifications ?? [];

    return (
        <div className="w-full">
            <h1 className="text-2xl font-bold text-center mb-8">職務経歴書</h1>

            {/* 基本情報 */}
            <div className="mb-8">
                <h2 className="text-xl font-bold mb-4 border-b-2 border-gray-200">基本情報</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div className="space-y-2">
                        <div className="text-lg font-semibold">{displayName}</div>
                        <div>{address}</div>
                        <div>{phone}</div>
                    </div>
                    <div className="space-y-2">
                        <div>{email}</div>
                        {university && <div>{university}</div>}
                    </div>
                </div>
                <div className="mt-4">
                    <p className="text-gray-700 leading-relaxed whitespace-pre-line">{profile}</p>
                </div>
            </div>

            {/* スキル */}
            <div className="mb-8">
                <h2 className="text-xl font-bold mb-4 border-b-2 border-gray-200">保有スキル</h2>
                {skills.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                        {skills.map((skill) => (
                            <span key={skill} className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm">
                                {skill}
                            </span>
                        ))}
                    </div>
                ) : (
                    <p className="text-sm text-gray-500">スキル情報が登録されていません。</p>
                )}
            </div>

            {/* プロジェクト */}
            <div className="mb-8">
                <h2 className="text-xl font-bold mb-4 border-b-2 border-gray-200">プロジェクト経験</h2>
                {projects.length > 0 ? (
                    <div className="space-y-4">
                        {projects.map((project, index) => (
                            <div key={`${project.name}-${index}`} className="border border-gray-200 rounded-lg p-4">
                                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-2">
                                    <h3 className="text-lg font-semibold text-gray-800">{project.name || 'タイトル未設定'}</h3>
                                    {project.period && <span className="text-sm text-gray-500">{project.period}</span>}
                                </div>
                                {project.role && <p className="text-sm text-gray-600 mb-1">役割: {project.role}</p>}
                                {project.technologies && project.technologies.length > 0 && (
                                    <p className="text-sm text-gray-600 mb-1">
                                        使用技術: {project.technologies.join(', ')}
                                    </p>
                                )}
                                {project.description && (
                                    <p className="text-sm text-gray-700 whitespace-pre-line">{project.description}</p>
                                )}
                                {project.url && (
                                    <p className="text-sm text-indigo-600 break-all mt-2">{project.url}</p>
                                )}
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-sm text-gray-500">プロジェクト情報が登録されていません。</p>
                )}
            </div>

            {/* その他の経験 */}
            {Object.keys(experience).length > 0 && (
                <div className="mb-8">
                    <h2 className="text-xl font-bold mb-4 border-b-2 border-gray-200">その他の経験</h2>
                    <div className="space-y-3 text-sm text-gray-700">
                        {Object.entries(experience).map(([key, value]) => (
                            value ? (
                                <div key={key}>
                                            <h3 className="font-medium text-gray-800 mb-1">{EXPERIENCE_LABELS[key] ?? key}</h3>
                                    <p className="whitespace-pre-line">{String(value)}</p>
                                </div>
                            ) : null
                        ))}
                    </div>
                </div>
            )}

            {/* 資格 */}
            <div className="mb-8">
                <h2 className="text-xl font-bold mb-4 border-b-2 border-gray-200">資格・免許</h2>
                {certifications.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                        {certifications.map((cert) => (
                            <span key={cert} className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-sm">
                                {cert}
                            </span>
                        ))}
                    </div>
                ) : (
                    <p className="text-sm text-gray-500">資格情報が登録されていません。</p>
                )}
            </div>
        </div>
    );
}