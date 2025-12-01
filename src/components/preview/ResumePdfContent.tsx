'use client';

import { PortfolioPdfData } from '@/types/PortfolioPdf';

interface Props {
    data: PortfolioPdfData;
}

export default function ResumePdfContent({ data }: Props) {
    const { user, portfolio } = data;
    const displayName = portfolio?.name || user?.name || '氏名未設定';
    const address = portfolio?.address || user?.address || '未登録';
    const phone = portfolio?.phone || user?.phone || '未登録';
    const email = portfolio?.email || user?.email || '未登録';
    const university = [portfolio?.university || user?.university, portfolio?.faculty || user?.faculty]
        .filter(Boolean)
        .join(' / ');
    const grade = portfolio?.grade || user?.grade || '';
    const certifications = portfolio?.certifications ?? [];
    const other = portfolio?.other ?? {};
    const selfIntroduction = portfolio?.selfIntroduction || user?.selfIntroduction || '自己PRが登録されていません。';
    const hopeNote =
        (typeof other.additionalInfo === 'string' && other.additionalInfo.trim().length > 0
            ? other.additionalInfo
            : '') ||
        (typeof other.customQuestions === 'string' && other.customQuestions.trim().length > 0
            ? other.customQuestions
            : '特記事項はありません。');

    const createdAt = new Date().toLocaleDateString('ja-JP');

    return (
        <div className="w-full bg-white border border-gray-400 rounded-lg p-8 shadow-inner text-gray-900 text-sm">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold">履歴書</h1>
                </div>
                <div className="text-right text-sm">
                    <div>作成日: {createdAt}</div>
                </div>
            </div>

            {/* 氏名・写真・基本情報 */}
            <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="col-span-2">
                    <div className="mb-2"><span className="font-semibold">氏名</span>: {displayName}</div>
                    {university && (
                        <div className="mb-2"><span className="font-semibold">学校・学部</span>: {university}</div>
                    )}
                    {grade && (
                        <div className="mb-2"><span className="font-semibold">学年</span>: {grade}</div>
                    )}
                </div>
                <div className="flex items-center justify-center">
                    <div className="w-24 h-28 bg-gray-200 rounded border border-gray-400 flex items-center justify-center text-gray-400">
                        写真
                    </div>
                </div>
            </div>

            {/* 住所・連絡先 */}
            <div className="mb-4">
                <span className="font-semibold">現住所</span>: {address}
            </div>
            <div className="mb-4">
                <span className="font-semibold">電話番号</span>: {phone}
            </div>
            <div className="mb-4">
                <span className="font-semibold">メールアドレス</span>: {email}
            </div>

            {/* 学歴・職歴 */}
            {university && (
                <div className="mb-6">
                    <span className="font-semibold">学歴・職歴</span>:
                    <table className="w-full border border-collapse mt-2">
                        <tbody>
                            <tr>
                                <td className="border px-2 py-1 w-1/3 align-top">学歴</td>
                                <td className="border px-2 py-1 align-top">{university}</td>
                            </tr>
                            {grade && (
                                <tr>
                                    <td className="border px-2 py-1 align-top">在籍状況</td>
                                    <td className="border px-2 py-1 align-top">{grade}</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}

            {/* 資格・免許 */}
            <div className="mb-6">
                <span className="font-semibold">資格・免許</span>:
                {certifications.length > 0 ? (
                    <ul className="list-disc ml-6 mt-2 space-y-1 leading-relaxed">
                        {certifications.map((cert) => (
                            <li key={cert}>{cert}</li>
                        ))}
                    </ul>
                ) : (
                    <div className="mt-2 text-gray-500">資格情報が登録されていません。</div>
                )}
            </div>

            {/* 志望動機・自己PR */}
            <div className="mb-6">
                <span className="font-semibold">志望動機・自己PR</span>:
                <div className="mt-2 p-3 border rounded bg-gray-50 leading-relaxed whitespace-pre-line">
                    {selfIntroduction}
                </div>
            </div>

            {/* 本人希望欄 */}
            <div className="mb-2">
                <span className="font-semibold">本人希望欄</span>:
                <div className="mt-2 p-3 border rounded bg-gray-50 leading-relaxed whitespace-pre-line">
                    {hopeNote}
                </div>
            </div>
        </div>
    );
}