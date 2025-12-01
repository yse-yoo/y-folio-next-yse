"use client";
import { Building2, LayoutDashboard, Search, Star, Mail, UserCog, LogOut, HelpCircle, Bell, Save, Eye, EyeOff } from "lucide-react";
import React, { useState } from "react";
import Link from "next/link";

export default function RecruiterAccountSettingsPage() {
  const [form, setForm] = useState({
    name: "田中 リクルーター",
    email: "recruiter@company.com",
    company: "テック企業株式会社",
    position: "採用担当者",
    phone: "03-1234-5678",
    password: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveMessage("");
    // ダミー保存処理
    setTimeout(() => {
      setIsSaving(false);
      setSaveMessage("設定を保存しました");
    }, 1000);
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
            <Link href="/recruiter/account-settings" className="sidebar-item active flex items-center px-4 py-3 rounded-lg text-white bg-indigo-600 w-full">
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
              <h2 className="text-2xl font-bold text-gray-800">アカウント設定</h2>
              <p className="text-gray-600">アカウント情報の確認・変更ができます</p>
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
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-lg shadow-md p-8">
              <h3 className="text-lg font-semibold text-gray-800 mb-6">アカウント情報</h3>
              
              {saveMessage && (
                <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded-lg text-sm">
                  {saveMessage}
                </div>
              )}

              <form className="space-y-6" onSubmit={handleSave}>
                {/* Basic Information */}
                <div className="border-b border-gray-200 pb-6">
                  <h4 className="text-md font-semibold text-gray-800 mb-4">基本情報</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">氏名</label>
                      <input
                        type="text"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="例: 田中 リクルーター"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">メールアドレス</label>
                      <input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="例: recruiter@company.com"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">企業名</label>
                      <input
                        type="text"
                        name="company"
                        value={form.company}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="例: テック企業株式会社"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">役職</label>
                      <input
                        type="text"
                        name="position"
                        value={form.position}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="例: 採用担当者"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">電話番号</label>
                      <input
                        type="tel"
                        name="phone"
                        value={form.phone}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="例: 03-1234-5678"
                      />
                    </div>
                  </div>
                </div>

                {/* Password Change */}
                <div className="border-b border-gray-200 pb-6">
                  <h4 className="text-md font-semibold text-gray-800 mb-4">パスワード変更</h4>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">現在のパスワード</label>
                      <div className="relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          name="password"
                          value={form.password}
                          onChange={handleChange}
                          className="w-full border border-gray-300 rounded-md px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          placeholder="現在のパスワードを入力"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">新しいパスワード</label>
                      <div className="relative">
                        <input
                          type={showNewPassword ? "text" : "password"}
                          name="newPassword"
                          value={form.newPassword}
                          onChange={handleChange}
                          className="w-full border border-gray-300 rounded-md px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          placeholder="新しいパスワードを入力"
                        />
                        <button
                          type="button"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">新しいパスワード（確認）</label>
                      <input
                        type="password"
                        name="confirmPassword"
                        value={form.confirmPassword}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="新しいパスワードを再入力"
                      />
                    </div>
                  </div>
                </div>

                {/* Save Button */}
                <div className="flex justify-end">
                  <button
                    type="submit"
                    className={`flex items-center bg-indigo-600 text-white px-6 py-2 rounded-md font-semibold transition ${
                      isSaving ? 'opacity-60 cursor-not-allowed' : 'hover:bg-indigo-700'
                    }`}
                    disabled={isSaving}
                  >
                    <Save className="w-4 h-4 mr-2" />
                    {isSaving ? "保存中..." : "保存"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
} 