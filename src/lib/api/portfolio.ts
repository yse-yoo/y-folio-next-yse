import { PortfolioPdfData } from '@/types/PortfolioPdf';

export const fetchPortfolioPdfData = async (
  userId: string,
  init?: RequestInit
): Promise<PortfolioPdfData> => {
  const response = await fetch(`/api/portfolio/by-user?userId=${encodeURIComponent(userId)}`, init);

  if (response.status === 404) {
    return { user: null, portfolio: null };
  }

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || 'ポートフォリオ情報の取得に失敗しました');
  }

  return (await response.json()) as PortfolioPdfData;
};
