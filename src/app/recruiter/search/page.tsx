"use client";
import { Building2, LayoutDashboard, Search, Star, Mail, UserCog, LogOut, HelpCircle, Bell, Filter, MapPin, GraduationCap, Briefcase, Star as StarIcon, Heart, Eye, MoreVertical } from "lucide-react";
import React, { useState } from "react";
import Link from "next/link";

export default function RecruiterSearchPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilters, setSelectedFilters] = useState({
    university: "",
    skills: [] as string[],
    location: "",
    experience: "",
  });
  const [showFilters, setShowFilters] = useState(false);

  // ダミーデータ
  const searchResults = [
    {
      id: 1,
      name: "田中 太郎",
      university: "東京大学・情報科学科",
      location: "東京都",
      profile: "Web開発とAI技術に興味があり、複数のプロジェクトを手がけています。機械学習を使った画像認識システムの開発経験があります。",
      skills: ["JavaScript", "React", "Python", "TensorFlow", "Git"],
      experience: "インターンシップ2回、個人プロジェクト5件",
      isStarred: false,
      image: "/api/placeholder/40/40",
    },
    {
      id: 2,
      name: "佐藤 花子",
      university: "早稲田大学・商学部",
      location: "東京都",
      profile: "マーケティングとデータ分析を専攻。インターンシップでの実績多数。ExcelとPowerBIを使った分析が得意です。",
      skills: ["マーケティング", "Excel", "PowerBI", "SQL", "Python"],
      experience: "インターンシップ3回、研究プロジェクト2件",
      isStarred: true,
      image: "/api/placeholder/40/40",
    },
    {
      id: 3,
      name: "山田 次郎",
      university: "慶應大学・理工学部",
      location: "神奈川県",
      profile: "機械学習とロボティクスの研究に従事。国際学会での発表経験あり。C++とPythonを使った開発が得意です。",
      skills: ["機械学習", "TensorFlow", "C++", "Python", "ROS"],
      experience: "研究プロジェクト3件、学会発表2回",
      isStarred: false,
      image: "/api/placeholder/40/40",
    },
    {
      id: 4,
      name: "鈴木 美咲",
      university: "京都大学・工学部",
      location: "京都府",
      profile: "UX/UIデザインとフロントエンド開発を専門としています。Figmaを使ったデザインとReactでの実装が得意です。",
      skills: ["Figma", "React", "TypeScript", "CSS", "Adobe XD"],
      experience: "デザインプロジェクト4件、Web開発2件",
      isStarred: false,
      image: "/api/placeholder/40/40",
    },
    {
      id: 5,
      name: "高橋 健太",
      university: "大阪大学・工学部",
      location: "大阪府",
      profile: "バックエンド開発とDevOpsを専門としています。AWSとDockerを使ったインフラ構築が得意です。",
      skills: ["Node.js", "AWS", "Docker", "PostgreSQL", "Linux"],
      experience: "インターンシップ1回、個人プロジェクト3件",
      isStarred: false,
      image: "/api/placeholder/40/40",
    },
    {
      id: 6,
      name: "伊藤 さくら",
      university: "名古屋大学・情報学部",
      location: "愛知県",
      profile: "データサイエンスと統計分析を専攻。RとPythonを使ったデータ分析が得意です。",
      skills: ["R", "Python", "統計学", "SQL", "Tableau"],
      experience: "研究プロジェクト2件、データ分析コンペ参加",
      isStarred: false,
      image: "/api/placeholder/40/40",
    },
  ];

  const universities = [
    "東京大学", "早稲田大学", "慶應大学", "京都大学", "大阪大学", "名古屋大学",
    "東北大学", "九州大学", "北海道大学", "筑波大学", "東京工業大学", "一橋大学"
  ];

  const skillOptions = [
    "JavaScript", "React", "Python", "Java", "C++", "TypeScript",
    "Node.js", "AWS", "Docker", "Git", "SQL", "MongoDB",
    "TensorFlow", "機械学習", "データ分析", "マーケティング",
    "Figma", "Adobe XD", "Photoshop", "Illustrator"
  ];

  const locations = [
    "東京都", "神奈川県", "埼玉県", "千葉県", "大阪府", "京都府",
    "愛知県", "福岡県", "北海道", "宮城県", "広島県", "新潟県"
  ];

  const experienceOptions = [
    "インターンシップ経験あり",
    "研究プロジェクト経験あり",
    "個人プロジェクト経験あり",
    "学会発表経験あり",
    "コンペティション参加経験あり"
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // ダミー検索処理
    console.log("検索:", searchQuery, selectedFilters);
  };

  const toggleFilter = (filterType: string, value: string) => {
    if (filterType === 'skills') {
      setSelectedFilters(prev => ({
        ...prev,
        skills: prev.skills.includes(value)
          ? prev.skills.filter(skill => skill !== value)
          : [...prev.skills, value]
      }));
    } else {
      setSelectedFilters(prev => ({
        ...prev,
        [filterType]: prev[filterType as keyof typeof prev] === value ? "" : value
      }));
    }
  };

  const toggleStar = (id: number) => {
    // ダミーお気に入り処理
    console.log("お気に入り切り替え:", id);
  };

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
            <Link href="/recruiter/search" className="sidebar-item active flex items-center px-4 py-3 rounded-lg text-white bg-indigo-600 w-full">
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
              <h2 className="text-2xl font-bold text-gray-800">ポートフォリオ検索</h2>
              <p className="text-gray-600">学生のポートフォリオを検索・フィルタリングできます</p>
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
          {/* Search and Filters */}
          <div className="mb-6">
            <form onSubmit={handleSearch} className="mb-4">
              <div className="relative max-w-2xl">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-6 py-4 pl-12 pr-20 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="スキル・大学・名前で学生を検索..."
                />
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition"
                >
                  検索
                </button>
              </div>
            </form>

            <div className="flex items-center justify-between">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition"
              >
                <Filter className="w-4 h-4 mr-2" />
                フィルター
                {showFilters && <span className="ml-2 text-indigo-600">(表示中)</span>}
              </button>
              <div className="text-sm text-gray-600">
                検索結果: {searchResults.length}件
              </div>
            </div>

            {/* Filters Panel */}
            {showFilters && (
              <div className="mt-4 bg-white rounded-lg border border-gray-200 p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {/* University Filter */}
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
                      <GraduationCap className="w-4 h-4 mr-2" />
                      大学
                    </h4>
                    <select
                      value={selectedFilters.university}
                      onChange={(e) => toggleFilter('university', e.target.value)}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="">すべての大学</option>
                      {universities.map((university) => (
                        <option key={university} value={university}>{university}</option>
                      ))}
                    </select>
                  </div>

                  {/* Location Filter */}
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
                      <MapPin className="w-4 h-4 mr-2" />
                      地域
                    </h4>
                    <select
                      value={selectedFilters.location}
                      onChange={(e) => toggleFilter('location', e.target.value)}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="">すべての地域</option>
                      {locations.map((location) => (
                        <option key={location} value={location}>{location}</option>
                      ))}
                    </select>
                  </div>

                  {/* Experience Filter */}
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
                      <Briefcase className="w-4 h-4 mr-2" />
                      経験
                    </h4>
                    <select
                      value={selectedFilters.experience}
                      onChange={(e) => toggleFilter('experience', e.target.value)}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="">すべての経験</option>
                      {experienceOptions.map((experience) => (
                        <option key={experience} value={experience}>{experience}</option>
                      ))}
                    </select>
                  </div>

                  {/* Skills Filter */}
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-3">スキル</h4>
                    <div className="max-h-32 overflow-y-auto space-y-2">
                      {skillOptions.map((skill) => (
                        <label key={skill} className="flex items-center">
                          <input
                            type="checkbox"
                            checked={selectedFilters.skills.includes(skill)}
                            onChange={() => toggleFilter('skills', skill)}
                            className="mr-2 text-indigo-600 focus:ring-indigo-500"
                          />
                          <span className="text-sm text-gray-700">{skill}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Search Results */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {searchResults.map((portfolio) => (
              <div key={portfolio.id} className="portfolio-card bg-white rounded-lg shadow-md overflow-hidden border-2 border-transparent hover:border-indigo-200 transition-all">
                <div className="h-32 bg-gradient-to-r from-blue-400 to-purple-500 relative">
                  <div className="absolute top-3 right-3">
                    <button
                      onClick={() => toggleStar(portfolio.id)}
                      className={`p-1 rounded-full transition ${
                        portfolio.isStarred 
                          ? 'bg-yellow-400 text-yellow-800' 
                          : 'bg-white bg-opacity-80 text-gray-600 hover:text-yellow-600'
                      }`}
                    >
                      <Heart className={`w-4 h-4 ${portfolio.isStarred ? 'fill-current' : ''}`} />
                    </button>
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
                  <p className="text-gray-700 mb-4 text-sm line-clamp-3">{portfolio.profile}</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {portfolio.skills.slice(0, 3).map((skill, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs"
                      >
                        {skill}
                      </span>
                    ))}
                    {portfolio.skills.length > 3 && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                        +{portfolio.skills.length - 3}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">{portfolio.location}</span>
                    <div className="flex space-x-2">
                      <button className="text-indigo-600 hover:text-indigo-800 font-semibold text-sm">
                        詳細を見る
                      </button>
                      <button className="text-green-600 hover:text-green-800 font-semibold text-sm">
                        メッセージ
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {searchResults.length === 0 && (
            <div className="text-center py-12">
              <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">検索結果がありません</h3>
              <p className="text-gray-500 mb-6">検索条件を変更して再度お試しください</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
} 