'use client';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import {
    Briefcase,
    LayoutDashboard,
    Edit,
    Eye,
    User,
    UserCog,
    LogOut,
    HelpCircle,
} from 'lucide-react';

type SidebarProps = {
    onInterviewClick: () => void;
};

const Sidebar = ({ onInterviewClick }: SidebarProps) => {
    const { user, loading } = useAuth();

    if (loading) return <p>Loading...</p>;

    if (!user) return (
        <div className="space-y-3">
            <p>このページはログインが必要です。</p>
            <Link href="/" className="underline">トップへ戻る</Link>
        </div>
    );

    return (
        <aside className="fixed inset-y-0 left-0 w-64 bg-white shadow-lg z-50 flex flex-col">
            <div className="flex items-center justify-center h-16 border-b border-gray-200 shrink-0">
                <div className="flex items-center">
                    <Briefcase className="w-7 h-7 text-indigo-600" />
                    <h1 className="text-xl font-bold text-gray-800 ml-2">Y-folio</h1>
                </div>
            </div>

            <nav className="mt-6 flex-1">
                <div className="px-4 mb-4">
                    <div className="flex items-center">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                            {user.displayName ? user.displayName.charAt(0).toUpperCase() : 'U'}
                        </div>
                        <div className="ml-3">
                            <p className="text-sm font-medium text-gray-700">
                                {user.displayName}
                            </p>
                            <p className="text-sm font-medium text-gray-700">
                                {user.email}
                            </p>
                            <p className="text-xs text-gray-500">
                                年
                            </p>
                        </div>
                    </div>
                </div>

                <div className="px-4 mt-6 mb-4">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        メニュー
                    </p>
                </div>

                <div className="px-4 space-y-2">
                    <a href="#" className="flex items-center px-4 py-3 rounded-lg text-white bg-indigo-600">
                        <LayoutDashboard className="w-5 h-5 mr-3" />
                        <span>ダッシュボード</span>
                    </a>
                    <a href="/portfolio/edit" className="flex items-center px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100">
                        <Edit className="w-5 h-5 mr-3" />
                        <span>ポートフォリオ編集</span>
                    </a>
                    <a href="/ai-review" className="flex items-center px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100">
                        <Eye className="w-5 h-5 mr-3" />
                        <span>AIレビュー</span>
                    </a>
                    <button
                        onClick={onInterviewClick}
                        className="w-full text-left flex items-center px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100"
                    >
                        <User className="w-5 h-5 mr-3" />
                        <span>面接シミュレーション</span>
                    </button>
                </div>

                <div className="px-4 mt-8 mb-4">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        アカウント
                    </p>
                </div>

                <div className="px-4 space-y-2">
                    <a href="/account" className="flex items-center px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100">
                        <UserCog className="w-5 h-5 mr-3" />
                        <span>アカウント設定</span>
                    </a>
                    <a href="#" className="flex items-center px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100">
                        <LogOut className="w-5 h-5 mr-3" />
                        <span>ログアウト</span>
                    </a>
                </div>
            </nav>

            <div className="p-4 border-t border-gray-200 shrink-0">
                <a href="#" className="flex items-center text-sm text-gray-600 hover:text-indigo-600 transition">
                    <HelpCircle className="w-5 h-5 mr-2" />
                    ヘルプ & サポート
                </a>
            </div>
        </aside>
    );
};

export default Sidebar;