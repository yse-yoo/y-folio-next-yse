"use client";
import { 
  Briefcase, 
  Users, 
  UserCheck, 
  Clock, 
  UserX, 
  Search, 
  Filter, 
  Plus, 
  Eye, 
  Edit, 
  Ban, 
  Check, 
  Mail, 
  Download,
  ChevronLeft,
  ChevronRight,
  Settings,
  Shield,
  FileText,
  ChartBar,
  Tags,
  File,
  Bell,
  Cog
} from "lucide-react";
import React, { useState } from "react";
import Link from "next/link";

export default function AdminUserManagementPage() {
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
  const [selectAll, setSelectAll] = useState(false);

  // ダミーデータ
  const users = [
    {
      id: 1,
      name: "田中太郎",
      username: "@tanaka_taro",
      email: "tanaka@example.com",
      type: "学生",
      status: "アクティブ",
      registeredDate: "2024/01/15",
      lastLogin: "2024/01/20 14:30",
      avatar: "T",
    },
    {
      id: 2,
      name: "佐藤花子",
      username: "@sato_hanako",
      email: "sato@example.com",
      type: "リクルーター",
      status: "アクティブ",
      registeredDate: "2024/01/10",
      lastLogin: "2024/01/19 09:15",
      avatar: "S",
    },
    {
      id: 3,
      name: "山田次郎",
      username: "@yamada_jiro",
      email: "yamada@example.com",
      type: "学生",
      status: "保留中",
      registeredDate: "2024/01/18",
      lastLogin: "-",
      avatar: "Y",
    },
    {
      id: 4,
      name: "伊藤美咲",
      username: "@ito_misaki",
      email: "ito@example.com",
      type: "学生",
      status: "無効化",
      registeredDate: "2024/01/05",
      lastLogin: "2024/01/15 16:45",
      avatar: "I",
    },
    {
      id: 5,
      name: "渡辺健太",
      username: "@watanabe_kenta",
      email: "watanabe@example.com",
      type: "リクルーター",
      status: "アクティブ",
      registeredDate: "2024/01/12",
      lastLogin: "2024/01/20 11:20",
      avatar: "W",
    },
  ];

  const stats = {
    totalUsers: 1234,
    activeUsers: 1156,
    pendingUsers: 45,
    inactiveUsers: 33,
  };

  const handleSelectAll = (checked: boolean) => {
    setSelectAll(checked);
    if (checked) {
      setSelectedUsers(users.map(user => user.id));
    } else {
      setSelectedUsers([]);
    }
  };

  const handleSelectUser = (userId: number, checked: boolean) => {
    if (checked) {
      setSelectedUsers(prev => [...prev, userId]);
    } else {
      setSelectedUsers(prev => prev.filter(id => id !== userId));
    }
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case "アクティブ":
        return "bg-green-100 text-green-800";
      case "無効化":
        return "bg-red-100 text-red-800";
      case "保留中":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getTypeClass = (type: string) => {
    switch (type) {
      case "学生":
        return "bg-blue-100 text-blue-800";
      case "リクルーター":
        return "bg-green-100 text-green-800";
      case "管理者":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 w-64 bg-white shadow-lg z-50 flex flex-col">
        <div className="flex items-center justify-center h-16 border-b border-gray-200">
          <div className="flex items-center">
            <Briefcase className="w-7 h-7 text-indigo-600 mr-2" />
            <h1 className="text-xl font-bold text-gray-800">Y-folio</h1>
            <span className="ml-2 px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">管理者</span>
          </div>
        </div>
        
        <nav className="mt-6 flex-1 overflow-y-auto">
          <div className="px-4 mb-4">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">メインメニュー</p>
          </div>
          
          <div className="px-4 space-y-2">
            <Link href="/admin" className="sidebar-item flex items-center px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100 w-full">
              <ChartBar className="w-5 h-5 mr-3" />
              <span>ダッシュボード</span>
            </Link>
            <Link href="/admin/user" className="sidebar-item active flex items-center px-4 py-3 rounded-lg text-white bg-indigo-600 w-full">
              <Users className="w-5 h-5 mr-3" />
              <span>ユーザー管理</span>
            </Link>
            <Link href="/admin/PortfolioManagement" className="sidebar-item flex items-center px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100 w-full">
              <File className="w-5 h-5 mr-3" />
              <span>ポートフォリオ管理</span>
            </Link>
            <Link href="/admin/tags" className="sidebar-item flex items-center px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100 w-full">
              <Tags className="w-5 h-5 mr-3" />
              <span>タグ管理</span>
            </Link>
            <Link href="/admin/reports" className="sidebar-item flex items-center px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100 w-full">
              <ChartBar className="w-5 h-5 mr-3" />
              <span>レポート</span>
            </Link>
          </div>
          
          <div className="px-4 mt-8 mb-4">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">システム</p>
          </div>
          
          <div className="px-4 space-y-2">
            <Link href="/admin/settings" className="sidebar-item flex items-center px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100 w-full">
              <Settings className="w-5 h-5 mr-3" />
              <span>設定</span>
            </Link>
            <Link href="/admin/security" className="sidebar-item flex items-center px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100 w-full">
              <Shield className="w-5 h-5 mr-3" />
              <span>セキュリティ</span>
            </Link>
            <Link href="/admin/logs" className="sidebar-item flex items-center px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100 w-full">
              <FileText className="w-5 h-5 mr-3" />
              <span>ログ</span>
            </Link>
          </div>
        </nav>
        
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
              A
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-700">管理者</p>
              <p className="text-xs text-gray-500">admin@y-folio.com</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="ml-64">
        {/* Top Header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="flex items-center justify-between px-6 py-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">ユーザー管理</h2>
              <p className="text-gray-600">ユーザーアカウントの管理と監視</p>
            </div>
            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-400 hover:text-gray-600 transition">
                <Bell className="w-6 h-6" />
              </button>
              <button className="p-2 text-gray-400 hover:text-gray-600 transition">
                <Cog className="w-6 h-6" />
              </button>
            </div>
          </div>
        </header>

        {/* User Management Content */}
        <main className="p-6">
          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-md p-6 fade-in">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Users className="text-blue-600 w-6 h-6" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">総ユーザー数</p>
                  <p className="text-2xl font-bold text-gray-800">{stats.totalUsers.toLocaleString()}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 fade-in">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <UserCheck className="text-green-600 w-6 h-6" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">アクティブユーザー</p>
                  <p className="text-2xl font-bold text-gray-800">{stats.activeUsers.toLocaleString()}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 fade-in">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <Clock className="text-yellow-600 w-6 h-6" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">保留中</p>
                  <p className="text-2xl font-bold text-gray-800">{stats.pendingUsers}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 fade-in">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                  <UserX className="text-red-600 w-6 h-6" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">無効化済み</p>
                  <p className="text-2xl font-bold text-gray-800">{stats.inactiveUsers}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Search and Filter Section */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6 fade-in">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
              <div className="flex-1 max-w-md">
                <div className="relative">
                  <input 
                    type="text" 
                    placeholder="ユーザー名、メールアドレスで検索..." 
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                  <Search className="absolute left-3 top-3 text-gray-400 w-4 h-4" />
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
                <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent">
                  <option value="">ステータス</option>
                  <option value="active">アクティブ</option>
                  <option value="inactive">無効化</option>
                  <option value="pending">保留中</option>
                </select>
                
                <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent">
                  <option value="">ユーザータイプ</option>
                  <option value="student">学生</option>
                  <option value="recruiter">リクルーター</option>
                  <option value="admin">管理者</option>
                </select>
                
                <button className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition">
                  <Filter className="w-4 h-4 mr-2 inline" />
                  フィルター
                </button>
              </div>
            </div>
          </div>

          {/* Users Table */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden fade-in">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-800">ユーザー一覧</h3>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">{stats.totalUsers}件中 1-{users.length}件を表示</span>
                  <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition">
                    <Plus className="w-4 h-4 mr-2 inline" />
                    新規ユーザー
                  </button>
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <input 
                        type="checkbox" 
                        checked={selectAll}
                        onChange={(e) => handleSelectAll(e.target.checked)}
                        className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                      />
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ユーザー
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      メールアドレス
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      タイプ
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ステータス
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      登録日
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      最終ログイン
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      アクション
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {users.map((user) => (
                    <tr key={user.id} className="table-row hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input 
                          type="checkbox" 
                          checked={selectedUsers.includes(user.id)}
                          onChange={(e) => handleSelectUser(user.id, e.target.checked)}
                          className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold mr-3">
                            {user.avatar}
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">{user.name}</div>
                            <div className="text-sm text-gray-500">{user.username}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {user.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getTypeClass(user.type)}`}>
                          {user.type}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusClass(user.status)}`}>
                          {user.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {user.registeredDate}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {user.lastLogin}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          <button className="text-indigo-600 hover:text-indigo-900">
                            <Eye className="w-4 h-4" />
                          </button>
                          <button className="text-yellow-600 hover:text-yellow-900">
                            <Edit className="w-4 h-4" />
                          </button>
                          {user.status === "アクティブ" ? (
                            <button className="text-red-600 hover:text-red-900">
                              <Ban className="w-4 h-4" />
                            </button>
                          ) : (
                            <button className="text-green-600 hover:text-green-900">
                              <Check className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="px-6 py-4 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <button className="px-3 py-1 text-sm text-gray-500 hover:text-gray-700">
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button className="px-3 py-1 text-sm bg-indigo-600 text-white rounded">1</button>
                  <button className="px-3 py-1 text-sm text-gray-500 hover:text-gray-700">2</button>
                  <button className="px-3 py-1 text-sm text-gray-500 hover:text-gray-700">3</button>
                  <span className="px-2 text-sm text-gray-500">...</span>
                  <button className="px-3 py-1 text-sm text-gray-500 hover:text-gray-700">62</button>
                  <button className="px-3 py-1 text-sm text-gray-500 hover:text-gray-700">
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
                <div className="text-sm text-gray-500">
                  20件ずつ表示
                </div>
              </div>
            </div>
          </div>

          {/* Bulk Actions */}
          <div className="bg-white rounded-lg shadow-md p-6 mt-6 fade-in">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">一括操作</h3>
            <div className="flex flex-wrap items-center space-x-4">
              <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition">
                <Check className="w-4 h-4 mr-2 inline" />
                選択ユーザーを有効化
              </button>
              <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition">
                <Ban className="w-4 h-4 mr-2 inline" />
                選択ユーザーを無効化
              </button>
              <button className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition">
                <Mail className="w-4 h-4 mr-2 inline" />
                メール送信
              </button>
              <button className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition">
                <Download className="w-4 h-4 mr-2 inline" />
                CSVエクスポート
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
} 