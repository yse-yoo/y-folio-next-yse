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

export default function StandardPdfContent({ data }: Props) {
  const { user, portfolio } = data;
  const displayName = portfolio?.name || user?.name || '氏名未設定';
  const universityParts = [portfolio?.university || user?.university, portfolio?.faculty || user?.faculty]
    .filter(Boolean)
    .join(' / ');
  const grade = portfolio?.grade || user?.grade;
  const contactEmail = portfolio?.email || user?.email || '未登録';
  const contactPhone = portfolio?.phone || user?.phone || '未登録';
  const contactAddress = portfolio?.address || user?.address || '未登録';
  const profileText = portfolio?.selfIntroduction || user?.selfIntroduction || '自己紹介が登録されていません。';
  const skills = portfolio?.skillTags?.length ? portfolio.skillTags : [];
  const certifications = portfolio?.certifications?.length ? portfolio.certifications : [];
  const projects = portfolio?.projects?.length ? portfolio.projects : [];
  const experience = portfolio?.experience ?? {};

  return (
    <>
      {/* Header */}
      <div className="text-center mb-8 pb-6 border-b-2 border-gray-200">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">{displayName}</h1>
        {universityParts && (
          <p className="text-lg text-gray-600 mb-1">{universityParts}</p>
        )}
        {grade && <p className="text-sm text-gray-500">{grade}</p>}
      </div>

      {/* Contact */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b border-gray-300 pb-2">連絡先</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div><span className="font-medium text-gray-700">メール:</span> {contactEmail}</div>
          <div><span className="font-medium text-gray-700">電話:</span> {contactPhone}</div>
          <div className="md:col-span-2"><span className="font-medium text-gray-700">住所:</span> {contactAddress}</div>
        </div>
      </div>

      {/* Profile */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b border-gray-300 pb-2">プロフィール</h2>
        <p className="text-gray-700 leading-relaxed whitespace-pre-line">
          {profileText}
        </p>
      </div>

      {/* Skills */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b border-gray-300 pb-2">スキル</h2>
        {skills.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {skills.map((skill) => (
              <span
                key={skill}
                className="px-3 py-1 bg-indigo-100 text-indigo-800 text-sm rounded-full"
              >
                {skill}
              </span>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500">スキル情報が登録されていません。</p>
        )}
      </div>

      {/* Projects / Experience */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b border-gray-300 pb-2">プロジェクト・経験</h2>
        {projects.length > 0 ? (
          <div className="space-y-4">
            {projects.map((project, index) => (
              <div key={`${project.name}-${index}`}>
                <h3 className="font-medium text-gray-800">{project.name || 'タイトル未設定'}</h3>
                {project.period && (
                  <p className="text-sm text-gray-600 mb-1">{project.period}</p>
                )}
                {project.role && (
                  <p className="text-sm text-gray-600 mb-1">役割: {project.role}</p>
                )}
                {project.technologies && project.technologies.length > 0 && (
                  <p className="text-sm text-gray-600 mb-1">
                    使用技術: {project.technologies.join(', ')}
                  </p>
                )}
                {project.description && (
                  <p className="text-gray-700 text-sm whitespace-pre-line">{project.description}</p>
                )}
                {project.url && (
                  <p className="text-sm text-indigo-600 break-all">{project.url}</p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500">プロジェクト情報が登録されていません。</p>
        )}
      </div>

      {/* Additional Experience */}
      {Object.keys(experience).length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b border-gray-300 pb-2">その他の経験</h2>
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

      {/* Education */}
      {universityParts && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b border-gray-300 pb-2">学歴</h2>
          <div>
            <h3 className="font-medium text-gray-800">{universityParts}</h3>
            {grade && <p className="text-sm text-gray-600">{grade}</p>}
          </div>
        </div>
      )}

      {/* Certifications */}
      <div>
        <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b border-gray-300 pb-2">資格・認定</h2>
        {certifications.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {certifications.map((cert) => (
              <span
                key={cert}
                className="px-3 py-1 bg-emerald-100 text-emerald-800 text-sm rounded-full"
              >
                {cert}
              </span>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500">資格情報が登録されていません。</p>
        )}
      </div>
    </>
  );
}