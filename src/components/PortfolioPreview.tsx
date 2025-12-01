'use client';

import { useMemo } from 'react';
import { User } from '@/types/User';
import { Edit, Eye, Share2, FileText } from 'lucide-react';

interface Props {
  user: User;
  handleShareClick: () => void;
  handlePdfPreview: () => void;
}

export default function PortfolioPreview({ user, handleShareClick, handlePdfPreview }: Props) {
  const avatarInitial = useMemo(() => {
    const rawName = user.portfolio?.name ?? user.name;
    const name = typeof rawName === 'string' ? rawName.trim() : '';
    if (!name) return '?';
    return name.charAt(0);
  }, [user.name, user.portfolio?.name]);

  const affiliationLabel = useMemo(() => {
    const parts: string[] = [];
    const university = user.portfolio?.university ?? user.university;
    const grade = user.portfolio?.grade ?? user.grade;
    if (university) parts.push(university);
    if (grade) parts.push(`${grade}年`);
    if (parts.length === 0) return '所属情報が登録されていません';
    return parts.join('・');
  }, [user.university, user.grade, user.portfolio?.university, user.portfolio?.grade]);

  const introduction = useMemo(() => {
    const fields = [
      user.portfolio?.selfIntroduction,
      user.profile,
      user.selfIntroduction,
      user.education,
    ];
    const text = fields.find((value): value is string => typeof value === 'string' && value.trim().length > 0);
    return text ?? '自己紹介がまだ登録されていません。プロフィールを更新して経歴や強みをアピールしましょう。';
  }, [user.profile, user.selfIntroduction, user.education, user.portfolio?.selfIntroduction]);

  const skillChips = useMemo(() => {
    const chipSet = new Set<string>();

    const pushArray = (items: unknown) => {
      if (!Array.isArray(items)) return;
      items
        .filter((item): item is string => typeof item === 'string' && item.trim().length > 0)
        .forEach((value) => chipSet.add(value.trim()));
    };

    const pushMaybeDelimited = (value: unknown) => {
      if (typeof value !== 'string') return;
      value
        .split(/[,、\s]+/u)
        .map((item) => item.trim())
        .filter((item) => item.length > 0)
        .forEach((item) => chipSet.add(item));
    };

    pushArray(user.portfolio?.skills);
    pushArray(user.skills?.programming);
    pushArray(user.skills?.frameworks);
    pushArray(user.certifications);
    pushMaybeDelimited(user.certifications);

    const portfolioSkillTags = user.portfolio?.skillTags;
    if (Array.isArray(portfolioSkillTags)) {
      pushArray(portfolioSkillTags);
    } else {
      pushMaybeDelimited(portfolioSkillTags);
    }

    pushMaybeDelimited(user.portfolio?.certifications);

    const chips = Array.from(chipSet).slice(0, 12);
    return chips;
  }, [
    user.skills?.programming,
    user.skills?.frameworks,
    user.certifications,
    user.portfolio?.skills,
    user.portfolio?.skillTags,
    user.portfolio?.certifications,
  ]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
      <div className="lg:col-span-1 bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">クイックアクション</h3>
        <div className="space-y-3">
          <a href="/portfolio/edit" className="flex items-center p-4 border-2 border-transparent rounded-lg hover:bg-gray-50 hover:border-indigo-500"><Edit className="text-blue-600 w-6 h-6 mr-4" /><div><p className="font-medium text-gray-800">ポートフォリオを編集</p><p className="text-sm text-gray-500">基本情報や実績を更新</p></div></a>
          <a href="/ai-review" className="flex items-center p-4 border-2 border-transparent rounded-lg hover:bg-gray-50 hover:border-indigo-500"><Eye className="text-green-600 w-6 h-6 mr-4" /><div><p className="font-medium text-gray-800">AIレビュー</p><p className="text-sm text-gray-500">履歴書・職務経歴書をAIで添削</p></div></a>
          <button onClick={handleShareClick} className="flex items-center p-4 border-2 border-transparent rounded-lg hover:bg-gray-50 hover:border-indigo-500 text-left w-full">
            <Share2 className="text-purple-600 w-6 h-6 mr-4" />
            <div>
              <a href='/interview' className="font-medium text-gray-800">面接シミュレーション</a>
              <p className="text-sm text-gray-500">AIを使った面接シミュレーション</p>
            </div>
          </button>
          <button onClick={handlePdfPreview} className="w-full flex items-center p-4 border-2 border-transparent rounded-lg hover:bg-gray-50 hover:border-indigo-500 text-left"><FileText className="text-red-600 w-6 h-6 mr-4" /><div><p className="font-medium text-gray-800">PDFで出力</p><p className="text-sm text-gray-500">印刷用のPDFをダウンロード</p></div></button>
        </div>
      </div>
      <div className="lg:col-span-2 bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">ポートフォリオプレビュー</h3>
        <div className="bg-gray-100 rounded-lg p-6">
          <div className="flex items-center mb-4">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mr-4 flex items-center justify-center text-white text-2xl font-semibold">
              {avatarInitial}
            </div>
            <div>
              <h4 className="text-xl font-bold text-gray-800">
                {user.portfolio?.name ?? user.name}
              </h4>
              <p className="text-gray-600">{affiliationLabel}</p>
            </div>
          </div>
          <p className="text-gray-700 mb-4 whitespace-pre-line">{introduction}</p>
          {skillChips.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {skillChips.map((chip) => (
                <span
                  key={chip}
                  className="px-3 py-1 bg-indigo-100 text-indigo-800 text-sm rounded-full"
                >
                  {chip}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">スキルが登録されていません。プロフィールから追加しましょう。</p>
          )}
        </div>
      </div>
    </div>
  );
}
