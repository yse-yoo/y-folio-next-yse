"use client";

import {
  Briefcase,
  LayoutDashboard,
  Edit,
  Eye,
  Share2,
  UserCog,
  LogOut,
  HelpCircle,
  Bell,
  Plus,
  ArrowLeft,
  Download,
  Mail,
  Linkedin,
  Github,
  Globe,
  Calendar,
  MapPin,
  Phone,
} from "lucide-react";
import React from "react";

const PortfolioPreviewPage = () => {
  // ダミーデータ
  const portfolioData = {
    basicInfo: {
      name: "田中 太郎",
      email: "tanaka@example.com",
      phone: "090-1234-5678",
      birthDate: "1998-05-15",
      location: "東京都",
      profile: "東京大学工学部情報工学科の学生です。Web開発とAIに興味があり、新しい技術を学ぶことが好きです。",
    },
    education: [
      {
        school: "東京大学",
        degree: "工学部情報工学科",
        period: "2020-2024",
        description: "コンピュータサイエンスとソフトウェアエンジニアリングを専攻",
      },
    ],
    experience: [
      {
        company: "テックスタートアップ株式会社",
        position: "フロントエンド開発インターン",
        period: "2023年6月 - 2023年9月",
        description: "React.jsとTypeScriptを使用したWebアプリケーション開発",
      },
    ],
    skills: [
      "JavaScript", "TypeScript", "React", "Next.js", "Node.js", "Python", "Git", "Docker"
    ],
    projects: [
      {
        title: "ポートフォリオサイト",
        description: "Next.jsとTailwind CSSを使用した個人ポートフォリオサイト",
        technologies: ["Next.js", "TypeScript", "Tailwind CSS"],
        link: "https://github.com/example/portfolio",
      },
    ],
  };

  return (
    <div className="flex bg-gray-50 text-gray-800">
      {/* Sidebar */}
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
                田
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-700">田中 太郎</p>
                <p className="text-xs text-gray-500">東京大学</p>
              </div>
            </div>
          </div>
          <div className="px-4 mt-6 mb-4">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">メニュー</p>
          </div>
          <div className="px-4 space-y-2">
            <a href="/dashboard" className="flex items-center px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100">
              <LayoutDashboard className="w-5 h-5 mr-3" />
              <span>ダッシュボード</span>
            </a>
            <a href="/portfolio/edit" className="flex items-center px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100">
              <Edit className="w-5 h-5 mr-3" />
              <span>ポートフォリオ編集</span>
            </a>
            <a href="#" className="flex items-center px-4 py-3 rounded-lg text-white bg-indigo-600">
              <Eye className="w-5 h-5 mr-3" />
              <span>プレビュー</span>
            </a>
            <a href="/interview" className="flex items-center px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100">
              <Share2 className="w-5 h-5 mr-3" />
              <span>面接シミュレーション</span>
            </a>
          </div>
          <div className="px-4 mt-8 mb-4">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">アカウント</p>
          </div>
          <div className="px-4 space-y-2">
            <a href="/dashboard/account-settings" className="flex items-center px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100">
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

      {/* Main Content */}
      <div className="ml-64 flex-1">
        <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center space-x-4">
              <a href="/dashboard" className="flex items-center text-gray-600 hover:text-indigo-600 transition">
                <ArrowLeft className="w-5 h-5 mr-2" />
                ダッシュボードに戻る
              </a>
              <div>
                <h2 className="text-2xl font-bold text-gray-800">ポートフォリオプレビュー</h2>
                <p className="text-gray-600">公開されるポートフォリオの表示確認</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-400 hover:text-gray-600 transition">
                <Bell className="w-6 h-6" />
              </button>
              <button className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition">
                <Download className="w-5 h-5 mr-2" />
                PDF出力
              </button>
            </div>
          </div>
        </header>

        {/* Portfolio Preview */}
        <main className="p-6">
          <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-8">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold mb-2">{portfolioData.basicInfo.name}</h1>
                  <p className="text-xl opacity-90 mb-4">フロントエンド開発者</p>
                  <p className="text-lg opacity-80 max-w-2xl">{portfolioData.basicInfo.profile}</p>
                </div>
                <div className="flex space-x-3">
                  <button className="p-2 bg-white bg-opacity-20 rounded-full hover:bg-opacity-30 transition">
                    <Mail className="w-5 h-5" />
                  </button>
                  <button className="p-2 bg-white bg-opacity-20 rounded-full hover:bg-opacity-30 transition">
                    <Linkedin className="w-5 h-5" />
                  </button>
                  <button className="p-2 bg-white bg-opacity-20 rounded-full hover:bg-opacity-30 transition">
                    <Github className="w-5 h-5" />
                  </button>
                  <button className="p-2 bg-white bg-opacity-20 rounded-full hover:bg-opacity-30 transition">
                    <Globe className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            <div className="p-8">
              {/* Contact Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="space-y-3">
                  <div className="flex items-center text-gray-600">
                    <Mail className="w-5 h-5 mr-3" />
                    <span>{portfolioData.basicInfo.email}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Phone className="w-5 h-5 mr-3" />
                    <span>{portfolioData.basicInfo.phone}</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center text-gray-600">
                    <MapPin className="w-5 h-5 mr-3" />
                    <span>{portfolioData.basicInfo.location}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Calendar className="w-5 h-5 mr-3" />
                    <span>生年月日: {portfolioData.basicInfo.birthDate}</span>
                  </div>
                </div>
              </div>

              {/* Skills */}
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">スキル</h3>
                <div className="flex flex-wrap gap-2">
                  {portfolioData.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Experience */}
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">職歴</h3>
                <div className="space-y-6">
                  {portfolioData.experience.map((exp, index) => (
                    <div key={index} className="border-l-4 border-indigo-500 pl-6">
                      <h4 className="text-lg font-semibold text-gray-800">{exp.position}</h4>
                      <p className="text-indigo-600 font-medium">{exp.company}</p>
                      <p className="text-gray-600 text-sm mb-2">{exp.period}</p>
                      <p className="text-gray-700">{exp.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Education */}
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">学歴</h3>
                <div className="space-y-4">
                  {portfolioData.education.map((edu, index) => (
                    <div key={index} className="border-l-4 border-green-500 pl-6">
                      <h4 className="text-lg font-semibold text-gray-800">{edu.school}</h4>
                      <p className="text-green-600 font-medium">{edu.degree}</p>
                      <p className="text-gray-600 text-sm mb-2">{edu.period}</p>
                      <p className="text-gray-700">{edu.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Projects */}
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">プロジェクト</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {portfolioData.projects.map((project, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition">
                      <h4 className="text-lg font-semibold text-gray-800 mb-2">{project.title}</h4>
                      <p className="text-gray-600 mb-4">{project.description}</p>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {project.technologies.map((tech, techIndex) => (
                          <span
                            key={techIndex}
                            className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                      <a
                        href={project.link}
                        className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        プロジェクトを見る →
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default PortfolioPreviewPage; 