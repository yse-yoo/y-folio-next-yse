'use client';

import { PortfolioPdfData } from '@/types/PortfolioPdf';

interface Props {
  data: PortfolioPdfData;
}

export default function TablePdfContent({ data }: Props) {
  const { user, portfolio } = data;
  const displayName = portfolio?.name || user?.name || '氏名未設定';
  const university = [portfolio?.university || user?.university, portfolio?.faculty || user?.faculty]
    .filter(Boolean)
    .join(' / ');
  const contactEmail = portfolio?.email || user?.email || '未登録';
  const contactPhone = portfolio?.phone || user?.phone || '未登録';
  const contactAddress = portfolio?.address || user?.address || '未登録';
  const skills = portfolio?.skillTags ?? [];
  const projects = portfolio?.projects ?? [];
  const certifications = portfolio?.certifications ?? [];
  const grade = portfolio?.grade || user?.grade || '';

  const renderEmptyRow = (colSpan: number, message: string) => (
    <tr>
      <td className="border border-gray-300 px-4 py-4 text-center text-gray-500" colSpan={colSpan}>
        {message}
      </td>
    </tr>
  );

  return (
    <>
      {/* Header */}
      <div className="text-center mb-8 pb-6 border-b-2 border-gray-200">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">{displayName}</h1>
        {university && <p className="text-lg text-gray-600 mb-1">{university}</p>}
        {grade && <p className="text-sm text-gray-500">{grade}</p>}
      </div>

      {/* Contact Info */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b border-gray-300 pb-2">連絡先</h2>
        <table className="w-full border-collapse border border-gray-300 text-sm">
          <tbody>
            <tr className="bg-gray-50">
              <td className="border border-gray-300 px-4 py-2 font-medium text-gray-700 w-1/3">メール</td>
              <td className="border border-gray-300 px-4 py-2">{contactEmail}</td>
            </tr>
            <tr>
              <td className="border border-gray-300 px-4 py-2 font-medium text-gray-700">電話</td>
              <td className="border border-gray-300 px-4 py-2">{contactPhone}</td>
            </tr>
            <tr className="bg-gray-50">
              <td className="border border-gray-300 px-4 py-2 font-medium text-gray-700">住所</td>
              <td className="border border-gray-300 px-4 py-2">{contactAddress}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Skills */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b border-gray-300 pb-2">スキル</h2>
        <table className="w-full border-collapse border border-gray-300 text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-4 py-2 text-left font-medium text-gray-700 w-1/3">No.</th>
              <th className="border border-gray-300 px-4 py-2 text-left font-medium text-gray-700">スキル名</th>
            </tr>
          </thead>
          <tbody>
            {skills.length > 0
              ? skills.map((skill, index) => (
                  <tr key={skill} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="border border-gray-300 px-4 py-2 font-medium text-gray-700">{index + 1}</td>
                    <td className="border border-gray-300 px-4 py-2">{skill}</td>
                  </tr>
                ))
              : renderEmptyRow(2, 'スキル情報が登録されていません。')}
          </tbody>
        </table>
      </div>

      {/* Experience */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b border-gray-300 pb-2">経験・実績</h2>
        <table className="w-full border-collapse border border-gray-300 text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-4 py-2 text-left font-medium text-gray-700">期間</th>
              <th className="border border-gray-300 px-4 py-2 text-left font-medium text-gray-700">プロジェクト名</th>
              <th className="border border-gray-300 px-4 py-2 text-left font-medium text-gray-700">詳細</th>
            </tr>
          </thead>
          <tbody>
            {projects.length > 0
              ? projects.map((project, index) => (
                  <tr key={`${project.name}-${index}`} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="border border-gray-300 px-4 py-2">{project.period || '期間未設定'}</td>
                    <td className="border border-gray-300 px-4 py-2 font-medium">{project.name || 'タイトル未設定'}</td>
                    <td className="border border-gray-300 px-4 py-2">
                      <div className="space-y-1">
                        {project.role && <p className="text-sm text-gray-600">役割: {project.role}</p>}
                        {project.technologies && project.technologies.length > 0 && (
                          <p className="text-sm text-gray-600">使用技術: {project.technologies.join(', ')}</p>
                        )}
                        {project.description && (
                          <p className="text-sm text-gray-700 whitespace-pre-line">{project.description}</p>
                        )}
                        {project.url && (
                          <p className="text-sm text-indigo-600 break-all">{project.url}</p>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              : renderEmptyRow(3, 'プロジェクト情報が登録されていません。')}
          </tbody>
        </table>
      </div>

      {/* Education */}
      {university && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b border-gray-300 pb-2">学歴</h2>
          <table className="w-full border-collapse border border-gray-300 text-sm">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 px-4 py-2 text-left font-medium text-gray-700">期間</th>
                <th className="border border-gray-300 px-4 py-2 text-left font-medium text-gray-700">学校・専攻</th>
                <th className="border border-gray-300 px-4 py-2 text-left font-medium text-gray-700">備考</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-gray-300 px-4 py-2">{grade || '在籍中'}</td>
                <td className="border border-gray-300 px-4 py-2 font-medium">{university}</td>
                <td className="border border-gray-300 px-4 py-2">&nbsp;</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {/* Certifications */}
      <div>
        <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b border-gray-300 pb-2">資格・認定</h2>
        <table className="w-full border-collapse border border-gray-300 text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-4 py-2 text-left font-medium text-gray-700">No.</th>
              <th className="border border-gray-300 px-4 py-2 text-left font-medium text-gray-700">資格名</th>
            </tr>
          </thead>
          <tbody>
            {certifications.length > 0
              ? certifications.map((cert, index) => (
                  <tr key={cert} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="border border-gray-300 px-4 py-2 font-medium text-gray-700">{index + 1}</td>
                    <td className="border border-gray-300 px-4 py-2">{cert}</td>
                  </tr>
                ))
              : renderEmptyRow(2, '資格情報が登録されていません。')}
          </tbody>
        </table>
      </div>
    </>
  );
}