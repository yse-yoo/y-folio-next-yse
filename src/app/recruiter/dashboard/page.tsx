"use client";
import { Building2, LayoutDashboard, Search, Star, Mail, UserCog, LogOut, HelpCircle, Bell, Users, FileText, Star as StarIcon } from "lucide-react";
import React from "react";
import Link from "next/link";

export default function RecruiterDashboardPage() {
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
            <Link href="/recruiter/dashboard" className="sidebar-item active flex items-center px-4 py-3 rounded-lg text-white bg-indigo-600 w-full">
              <LayoutDashboard className="w-5 h-5 mr-3" />
              <span>ダッシュボード</span>
            </Link>
            <Link href="/recruiter/search" className="sidebar-item flex items-center px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100 w-full">
              <Search className="w-5 h-5 mr-3" />
              <span>ポートフォリオ検索</span>
            </Link>
            <Link href="/recruiter/favorites" className="sidebar-item flex items-center px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100 w-full">
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
              <h2 className="text-2xl font-bold text-gray-800">こんにちは、リクルーターさん！</h2>
              <p className="text-gray-600">学生のポートフォリオを検索・管理できます</p>
            </div>
            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-400 hover:text-gray-600 transition" disabled>
                <Bell className="w-6 h-6" />
              </button>
            </div>
          </div>
        </header>
        {/* Dashboard Content */}
        <main className="p-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="stat-card bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Users className="text-blue-600 w-6 h-6" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">学生数</p>
                  <p className="text-2xl font-bold text-gray-800">1,234</p>
                </div>
              </div>
            </div>
            <div className="stat-card bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <FileText className="text-green-600 w-6 h-6" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">公開ポートフォリオ</p>
                  <p className="text-2xl font-bold text-gray-800">856</p>
                </div>
              </div>
            </div>
            <div className="stat-card bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <StarIcon className="text-yellow-600 w-6 h-6" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">お気に入り</p>
                  <p className="text-2xl font-bold text-gray-800">45</p>
                </div>
              </div>
            </div>
            <div className="stat-card bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Mail className="text-purple-600 w-6 h-6" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">新着メッセージ</p>
                  <p className="text-2xl font-bold text-gray-800">3</p>
                </div>
              </div>
            </div>
          </div>
          {/* Search Bar */}
          <div className="mb-8">
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <input
                  type="text"
                  className="search-input w-full px-6 py-4 pl-12 pr-20 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                  placeholder="スキル・大学・名前で学生を検索..."
                />
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <button className="absolute right-2 top-1/2 -translate-y-1/2 bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition">
                  検索
                </button>
              </div>
            </div>
          </div>
          {/* Portfolio Cards Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6" id="portfolioGrid">
            {/* Portfolio Card 1 */}
            <div className="portfolio-card bg-white rounded-lg shadow-md overflow-hidden border-2 border-transparent">
              <div className="h-32 bg-gradient-to-r from-blue-400 to-purple-500" />
              <div className="p-6">
                <div className="flex items-center mb-3">
                  <div className="w-10 h-10 bg-gray-300 rounded-full mr-3" />
                  <div>
                    <h4 className="font-semibold text-gray-800">田中 太郎</h4>
                    <p className="text-sm text-gray-600">東京大学・情報科学科</p>
                  </div>
                </div>
                <p className="text-gray-700 mb-4">Web開発とAI技術に興味があり、複数のプロジェクトを手がけています。</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">JavaScript</span>
                  <span className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">React</span>
                  <span className="px-3 py-1 bg-purple-100 text-purple-800 text-sm rounded-full">Python</span>
                </div>
                <div className="flex justify-between items-center">
                  <button className="text-indigo-600 hover:text-indigo-800 font-semibold cursor-not-allowed" disabled>詳細を見る</button>
                  <button className="text-yellow-500 hover:text-yellow-600 font-semibold cursor-not-allowed" disabled><StarIcon className="inline w-4 h-4 mr-1" />お気に入り</button>
                </div>
              </div>
            </div>
            {/* Portfolio Card 2 */}
            <div className="portfolio-card bg-white rounded-lg shadow-md overflow-hidden border-2 border-transparent">
              <div className="h-32 bg-gradient-to-r from-green-400 to-blue-500" />
              <div className="p-6">
                <div className="flex items-center mb-3">
                  <div className="w-10 h-10 bg-gray-300 rounded-full mr-3" />
                  <div>
                    <h4 className="font-semibold text-gray-800">佐藤 花子</h4>
                    <p className="text-sm text-gray-600">早稲田大学・商学部</p>
                  </div>
                </div>
                <p className="text-gray-700 mb-4">マーケティングとデータ分析を専攻。インターンシップでの実績多数。</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="px-3 py-1 bg-red-100 text-red-800 text-sm rounded-full">マーケティング</span>
                  <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-sm rounded-full">Excel</span>
                  <span className="px-3 py-1 bg-indigo-100 text-indigo-800 text-sm rounded-full">PowerBI</span>
                </div>
                <div className="flex justify-between items-center">
                  <button className="text-indigo-600 hover:text-indigo-800 font-semibold cursor-not-allowed" disabled>詳細を見る</button>
                  <button className="text-yellow-500 hover:text-yellow-600 font-semibold cursor-not-allowed" disabled><StarIcon className="inline w-4 h-4 mr-1" />お気に入り</button>
                </div>
              </div>
            </div>
            {/* Portfolio Card 3 */}
            <div className="portfolio-card bg-white rounded-lg shadow-md overflow-hidden border-2 border-transparent">
              <div className="h-32 bg-gradient-to-r from-purple-400 to-pink-500" />
              <div className="p-6">
                <div className="flex items-center mb-3">
                  <div className="w-10 h-10 bg-gray-300 rounded-full mr-3" />
                  <div>
                    <h4 className="font-semibold text-gray-800">山田 次郎</h4>
                    <p className="text-sm text-gray-600">慶應大学・理工学部</p>
                  </div>
                </div>
                <p className="text-gray-700 mb-4">機械学習とロボティクスの研究に従事。国際学会での発表経験あり。</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="px-3 py-1 bg-orange-100 text-orange-800 text-sm rounded-full">機械学習</span>
                  <span className="px-3 py-1 bg-teal-100 text-teal-800 text-sm rounded-full">TensorFlow</span>
                  <span className="px-3 py-1 bg-gray-100 text-gray-800 text-sm rounded-full">C++</span>
                </div>
                <div className="flex justify-between items-center">
                  <button className="text-indigo-600 hover:text-indigo-800 font-semibold cursor-not-allowed" disabled>詳細を見る</button>
                  <button className="text-yellow-500 hover:text-yellow-600 font-semibold cursor-not-allowed" disabled><StarIcon className="inline w-4 h-4 mr-1" />お気に入り</button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
} 