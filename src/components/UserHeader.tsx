'use client';

import { User } from '@/types/User';
import { Bell, Plus } from 'lucide-react';

type HeaderProps = {
  user: User;
};

export const UserHeader = ({ user }: HeaderProps) => {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0">
      <div className="flex items-center justify-between px-6 py-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">
            こんにちは、{user.name}さん！
          </h2>
          <p className="text-gray-600">あなたのポートフォリオの状況です</p>
        </div>
        <div className="flex items-center space-x-4">
          <button className="p-2 text-gray-400 hover:text-gray-600 transition">
            <Bell className="w-6 h-6" />
          </button>
          <a
            href="/portfolio/create"
            className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
          >
            <Plus className="w-5 h-5 mr-2" />
            ポートフォリオ作成
          </a>
        </div>
      </div>
    </header>
  );
};