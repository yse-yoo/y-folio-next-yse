"use client";
import { Building2, LayoutDashboard, Search, Star, Mail, UserCog, LogOut, HelpCircle, Bell, Users, FileText, Star as StarIcon, Filter, SortAsc, MoreVertical } from "lucide-react";
import React from "react";
import Link from "next/link";

export default function RecruiterFavoritesPage() {
  // ダミーデータ
  const favoritePortfolios = [
    {
      id: 1,
      name: "田中 太郎",
      university: "東京大学・情報科学科",
      profile: "Web開発とAI技術に興味があり、複数のプロジェクトを手がけています。",
      skills: ["JavaScript", "React", "Python"],
      addedDate: "2024-01-15",
      isStarred: true,
    },
    {
      id: 2,
      name: "佐藤 花子",
      university: "早稲田大学・商学部",
      profile: "マーケティングとデータ分析を専攻。インターンシップでの実績多数。",
      skills: ["マーケティング", "Excel", "PowerBI"],
      addedDate: "2024-01-10",
      isStarred: true,
    },
    {
      id: 3,
      name: "山田 次郎",
      university: "慶應大学・理工学部",
      profile: "機械学習とロボティクスの研究に従事。国際学会での発表経験あり。",
      skills: ["機械学習", "TensorFlow", "C++"],
      addedDate: "2024-01-08",
      isStarred: true,
    },
    {
      id: 4,
      name: "鈴木 美咲",
      university: "京都大学・工学部",
      profile: "UX/UIデザインとフロントエンド開発を専門としています。",
      skills: ["Figma", "React", "TypeScript"],
      addedDate: "2024-01-05",
      isStarred: true,
    },
  ];

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 w-64 bg-white shadow-lg z-50 flex flex-col">
        <div className="flex items-center justify-center h-16 border-b border-gray-200">
          <div className="flex items-center">
            <Building2 className="w-7 h-7 text-indigo-600 mr-2" />
            <h1 className="text-xl font-bold text-gray-800">Y-folio</h1>
            <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">採用担当者</span>
          </div>
        </div>
        <nav className="mt-6 flex-1 overflow-y-auto">
          <div className="px-4 mb-4">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">R</div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-700">リクルーター名</p>
                <p className="text-xs text-gray-500">企業名</p>
              </div>
            </div>
          </div>
          <div className="px-4 mt-6 mb-4">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">メニュー</p>
          </div>
          <div className="px-4 space-y-2">
            <Link href="/recruiter/dashboard" className="sidebar-item flex items-center px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100 w-full">
              <LayoutDashboard className="w-5 h-5 mr-3" />
              <span>ダッシュボード</span>
            </Link>
            <Link href="/recruiter/search" className="sidebar-item flex items-center px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100 w-full">
              <Search className="w-5 h-5 mr-3" />
              <span>ポートフォリオ検索</span>
            </Link>
            <Link href="/recruiter/favorites" className="sidebar-item active flex items-center px-4 py-3 rounded-lg text-white bg-indigo-600 w-full">
              <Star className="w-5 h-5 mr-3" />
              <span>お気に入り</span>
            </Link>
            <Link href="/recruiter/messages" className="sidebar-item flex items-center px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100 w-full">
              <Mail className="w-5 h-5 mr-3" />
              <span>メッセージ</span>
            </Link>
          </div>
          <div className="px-4 mt-8 mb-4">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">アカウント</p>
          </div>
          <div className="px-4 space-y-2">
            <Link href="/recruiter/account-settings" className="sidebar-item flex items-center px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100 w-full">
              <UserCog className="w-5 h-5 mr-3" />
              <span>アカウント設定</span>
            </Link>
            <Link href="/recruiter/logout" className="sidebar-item flex items-center px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100 w-full">
              <LogOut className="w-5 h-5 mr-3" />
              <span>ログアウト</span>
            </Link>
          </div>
        </nav>
        <div className="p-4 border-t border-gray-200">
          <Link href="/recruiter/help" className="flex items-center text-sm text-gray-600 hover:text-indigo-600 transition w-full">
            <HelpCircle className="w-5 h-5 mr-2" />
            ヘルプ & サポート
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="ml-64">
        {/* Top Header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="flex items-center justify-between px-6 py-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">お気に入り</h2>
              <p className="text-gray-600">お気に入りに登録した学生のポートフォリオ</p>
            </div>
            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-400 hover:text-gray-600 transition">
                <Bell className="w-6 h-6" />
              </button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="p-6">
          {/* Stats and Controls */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className="bg-white rounded-lg shadow-md px-4 py-2">
                <span className="text-sm text-gray-600">お気に入り数: </span>
                <span className="font-bold text-indigo-600">{favoritePortfolios.length}</span>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button className="flex items-center px-3 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition">
                <Filter className="w-4 h-4 mr-2" />
                フィルター
              </button>
              <button className="flex items-center px-3 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition">
                <SortAsc className="w-4 h-4 mr-2" />
                並び替え
              </button>
            </div>
          </div>

          {/* Favorites Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {favoritePortfolios.map((portfolio) => (
              <div key={portfolio.id} className="portfolio-card bg-white rounded-lg shadow-md overflow-hidden border-2 border-yellow-200 hover:border-yellow-300 transition-all">
                <div className="h-32 bg-gradient-to-r from-yellow-400 to-orange-500 relative">
                  <div className="absolute top-3 right-3">
                    <StarIcon className="w-6 h-6 text-yellow-600 fill-current" />
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-gray-300 rounded-full mr-3" />
                      <div>
                        <h4 className="font-semibold text-gray-800">{portfolio.name}</h4>
                        <p className="text-sm text-gray-600">{portfolio.university}</p>
                      </div>
                    </div>
                    <button className="text-gray-400 hover:text-gray-600">
                      <MoreVertical className="w-5 h-5" />
                    </button>
                  </div>
                  <p className="text-gray-700 mb-4 text-sm">{portfolio.profile}</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {portfolio.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">追加日: {portfolio.addedDate}</span>
                    <div className="flex space-x-2">
                      <button className="text-indigo-600 hover:text-indigo-800 font-semibold text-sm">
                        詳細を見る
                      </button>
                      <button className="text-red-600 hover:text-red-800 font-semibold text-sm">
                        削除
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {favoritePortfolios.length === 0 && (
            <div className="text-center py-12">
              <StarIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">お気に入りがありません</h3>
              <p className="text-gray-500 mb-6">気になる学生のポートフォリオをお気に入りに追加してみましょう</p>
              <Link href="/recruiter/search" className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition">
                <Search className="w-4 h-4 mr-2" />
                ポートフォリオを検索
              </Link>
            </div>
          )}
        </main>
      </div>
    </div>
  );
} 