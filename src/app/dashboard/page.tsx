'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';

import SideBar from '@/components/SideBar';
import { UserHeader } from '@/components/UserHeader';
import { StatsCard } from '@/components/StatsCard';
import PortfolioPreview from '@/components/PortfolioPreview';
import PdfPreviewModal from '@/components/PdfPreviewModal';
import ReviewInsightsCard from '@/components/ai-review/ReviewInsightsCard';
import { useAuth } from '@/hooks/useAuth';
import { fetchUser } from '@/lib/api/user';
import type { User } from '@/types/User';

const createEmptyUser = (): User => ({
  id: '',
  uid: '',
  name: '',
  email: '',
  phone: '',
  address: '',
  university: '',
  department: '',
  grade: '',
  selfIntroduction: '',
});

const LoadingScreen = () => (
  <div className="flex min-h-screen items-center justify-center bg-gray-50">
    <div className="flex flex-col items-center gap-4">
      <div className="h-12 w-12 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600" />
      <p className="text-sm text-gray-600">読み込み中です…</p>
    </div>
  </div>
);

const DashboardPage = () => {
  const router = useRouter();
  const { user: authUser, loading: authLoading } = useAuth();
  const [dbUser, setDbUser] = useState<User | null>(null);
  const [userError, setUserError] = useState('');
  const [userLoading, setUserLoading] = useState(true);
  const [showPdfPreview, setShowPdfPreview] = useState(false);
  const [pdfFormat, setPdfFormat] = useState<'standard' | 'table' | 'resume' | 'career'>('standard');

  useEffect(() => {
    let isMounted = true;

    if (authLoading) {
      return () => {
        isMounted = false;
      };
    }

    if (!authUser?.uid) {
      if (isMounted) {
        setDbUser(null);
        setUserError('ログインが必要です。');
        setUserLoading(false);
      }
      return () => {
        isMounted = false;
      };
    }

    setUserLoading(true);
    setUserError('');

    fetchUser(authUser.uid)
      .then((fetched) => {
        if (!isMounted) return;

        if (!fetched?.id) {
          setDbUser(null);
          setUserError('データベース上のユーザーIDが取得できませんでした。');
          return;
        }

        const normalized: User = {
          ...createEmptyUser(),
          ...fetched,
          id: fetched.id,
          uid: fetched.uid ?? authUser.uid,
          name: fetched.name ?? '',
          email: fetched.email ?? '',
          university: fetched.university ?? '',
          grade: fetched.grade ?? '',
        };

        setDbUser(normalized);
      })
      .catch((error) => {
        console.error('Failed to load dashboard user:', error);
        if (!isMounted) return;
        setDbUser(null);
        setUserError('ユーザー情報の取得に失敗しました。');
      })
      .finally(() => {
        if (!isMounted) return;
        setUserLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [authLoading, authUser?.uid]);

  const hasUser = useMemo(() => Boolean(dbUser?.id), [dbUser]);

  const handlePdfPreview = () => {
    if (hasUser) {
      setShowPdfPreview(true);
    }
  };

  const closePdfPreview = () => {
    setShowPdfPreview(false);
  };

  const handleInterviewClick = () => {
    router.push('/interview');
  };

  const renderContent = () => {
    if (authLoading || userLoading) {
      return <LoadingScreen />;
    }

    if (userError) {
      return <div className="p-6 text-red-500">{userError}</div>;
    }

    if (!dbUser) {
      return <div className="p-6 text-gray-600">ユーザー情報が利用できません。</div>;
    }

    return (
      <>
        <UserHeader user={dbUser} />

        <main className="p-6">
          <StatsCard />

          <PortfolioPreview
            user={dbUser}
            handleShareClick={handleInterviewClick}
            handlePdfPreview={handlePdfPreview}
          />

          {authUser?.uid && (
            <div className="mt-8">
              <ReviewInsightsCard userId={authUser.uid} />
            </div>
          )}
        </main>
      </>
    );
  };

  return (
    <div className="flex bg-gray-50 text-gray-800">
      <SideBar onInterviewClick={handleInterviewClick} />

      {/* Main Content */}
      <div className="ml-64 flex-1">{renderContent()}</div>

      {/* PDF Preview Modal */}
      {showPdfPreview && hasUser && dbUser && (
        <PdfPreviewModal
          pdfFormat={pdfFormat}
          setPdfFormat={setPdfFormat}
          userId={dbUser.id}
          close={closePdfPreview}
          onPrint={() => window.print()}
        />
      )}
    </div>
  );
};

export default DashboardPage;