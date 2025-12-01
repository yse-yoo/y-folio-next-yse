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
} from "lucide-react";
import React, { useState } from "react";

const AccountSettingsPage = () => {
  const [form, setForm] = useState({
    name: "田中 太郎",
    email: "tanaka@example.com",
    password: "",
  });
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");

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
      setSaveMessage("保存しました");
    }, 1000);
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
            <a href="/portfolio/preview" className="flex items-center px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100">
              <Eye className="w-5 h-5 mr-3" />
              <span>プレビュー</span>
            </a>
            <a href="#" className="flex items-center px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100">
              <Share2 className="w-5 h-5 mr-3" />
              <span>共有</span>
            </a>
          </div>
          <div className="px-4 mt-8 mb-4">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">アカウント</p>
          </div>
          <div className="px-4 space-y-2">
            <a href="#" className="flex items-center px-4 py-3 rounded-lg text-white bg-indigo-600">
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
            <div>
              <h2 className="text-2xl font-bold text-gray-800">アカウント設定</h2>
              <p className="text-gray-600">アカウント情報の確認・変更ができます</p>
            </div>
            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-400 hover:text-gray-600 transition">
                <Bell className="w-6 h-6" />
              </button>
              <a href="#" className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition">
                <Plus className="w-5 h-5 mr-2" />
                新規作成
              </a>
            </div>
          </div>
        </header>
        <main className="p-6">
          <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-6">アカウント情報</h3>
            {saveMessage && (
              <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded-lg text-sm">
                {saveMessage}
              </div>
            )}
            <form className="space-y-6" onSubmit={handleSave}>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">氏名</label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="例: 田中 太郎"
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
                  placeholder="例: example@mail.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">パスワード</label>
                <input
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="変更する場合のみ入力"
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="submit"
                  className={`bg-indigo-600 text-white px-6 py-2 rounded-md font-semibold transition ${isSaving ? 'opacity-60 cursor-not-allowed' : ''}`}
                  disabled={isSaving}
                >
                  {isSaving ? "保存中..." : "保存"}
                </button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AccountSettingsPage; 