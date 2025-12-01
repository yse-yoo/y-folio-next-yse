'use client';

import Link from 'next/link';
import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { logout } from '@/lib/firebase.client';

export default function NavBar() {
    const { user, loading } = useAuth();
    const [signingOut, setSigningOut] = useState(false);

    return (
        <nav className="bg-white shadow-lg fixed w-full z-50">
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-center py-4">
                    <div className="flex items-center">
                        <i className="fas fa-briefcase text-2xl text-indigo-600 mr-2"></i>
                        <h1 className="text-2xl font-bold text-gray-800">
                            <Link href="/" className="">
                                Y-folio
                            </Link>
                            </h1>
                    </div>
                    <div className="hidden md:flex space-x-6">
                        <Link href="/#features" className="text-gray-600 hover:text-indigo-600 transition">機能</Link>                        
                        <Link href="/tags" className="text-gray-600 hover:text-indigo-600 transition">タグ一覧</Link>
                        <Link href="/dashboard" className="text-gray-600 hover:text-indigo-600 transition">ダッシュボード</Link>
                    </div>
                    <div>
                        {loading ? (
                            <span className="px-4 py-2 text-sm text-gray-400">読み込み中...</span>
                        ) : user ? (
                            <div className="flex items-center gap-3">
                                <Link
                                    href="/dashboard"
                                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
                                >
                                    ダッシュボードへ
                                </Link>
                                <button
                                    type="button"
                                    onClick={async () => {
                                        if (signingOut) return;
                                        setSigningOut(true);
                                        try {
                                            await logout();
                                        } catch (error) {
                                            console.error('Failed to sign out:', error);
                                        } finally {
                                            setSigningOut(false);
                                        }
                                    }}
                                    className="px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-100 transition disabled:opacity-60"
                                    disabled={signingOut}
                                >
                                    {signingOut ? 'ログアウト中...' : 'ログアウト'}
                                </button>
                            </div>
                        ) : (
                            <Link
                                href="/login"
                                className="px-4 py-2 text-indigo-600 border border-indigo-600 rounded-lg hover:bg-indigo-50 transition"
                            >
                                ログイン
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}
