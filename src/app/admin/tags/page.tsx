'use client';

import { useState } from 'react';
import { 
  Search, 
  Filter, 
  Plus, 
  Eye, 
  Edit, 
  Trash, 
  Check, 
  Star, 
  Download,
  ChevronLeft,
  ChevronRight,
  Tags,
  CheckCircle,
  FileText,
  TrendingUp,
  Settings,
  Shield,
  List,
  Bell,
  Cog,
  BarChart3,
  Users,
  Briefcase
} from 'lucide-react';

export default function AdminTagManagement() {
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedTags(['react', 'flutter', 'figma', 'python', 'tensorflow', 'unity']);
    } else {
      setSelectedTags([]);
    }
  };

  const handleSelectTag = (tagId: string, checked: boolean) => {
    if (checked) {
      setSelectedTags([...selectedTags, tagId]);
    } else {
      setSelectedTags(selectedTags.filter(id => id !== tagId));
    }
  };

  const tags = [
    {
      id: 'react',
      name: 'React',
      category: 'Web開発',
      description: 'Facebookが開発したJavaScriptライブラリ',
      usageCount: 234,
      status: 'active',
      createdAt: '2023/12/01',
      color: 'blue'
    },
    {
      id: 'flutter',
      name: 'Flutter',
      category: 'モバイル開発',
      description: 'Googleが開発したクロスプラットフォームフレームワーク',
      usageCount: 156,
      status: 'active',
      createdAt: '2023/11/15',
      color: 'green'
    },
    {
      id: 'figma',
      name: 'Figma',
      category: 'デザイン',
      description: 'クラウドベースのデザインツール',
      usageCount: 189,
      status: 'active',
      createdAt: '2023/10/20',
      color: 'purple'
    },
    {
      id: 'python',
      name: 'Python',
      category: 'データ分析',
      description: '汎用プログラミング言語、データ分析に特化',
      usageCount: 298,
      status: 'active',
      createdAt: '2023/09/10',
      color: 'orange'
    },
    {
      id: 'tensorflow',
      name: 'TensorFlow',
      category: 'AI/ML',
      description: 'Googleが開発した機械学習ライブラリ',
      usageCount: 67,
      status: 'active',
      createdAt: '2023/08/25',
      color: 'red'
    },
    {
      id: 'unity',
      name: 'Unity',
      category: 'ゲーム開発',
      description: 'ゲーム開発エンジン',
      usageCount: 45,
      status: 'inactive',
      createdAt: '2023/07/15',
      color: 'pink'
    }
  ];

  const popularTags = [
    { name: 'React', count: 234, color: 'blue' },
    { name: 'Python', count: 298, color: 'orange' },
    { name: 'Figma', count: 189, color: 'purple' },
    { name: 'Flutter', count: 156, color: 'green' },
    { name: 'Vue.js', count: 145, color: 'blue' },
    { name: 'TensorFlow', count: 67, color: 'red' }
  ];

  const getTagColorClasses = (color: string) => {
    const colorMap = {
      blue: 'bg-blue-600',
      green: 'bg-green-600',
      purple: 'bg-purple-600',
      orange: 'bg-orange-600',
      red: 'bg-red-600',
      pink: 'bg-pink-600'
    };
    return colorMap[color as keyof typeof colorMap] || 'bg-gray-600';
  };

  const getCategoryColorClasses = (category: string) => {
    const categoryMap = {
      'Web開発': 'bg-blue-100 text-blue-800',
      'モバイル開発': 'bg-green-100 text-green-800',
      'デザイン': 'bg-purple-100 text-purple-800',
      'データ分析': 'bg-orange-100 text-orange-800',
      'AI/ML': 'bg-red-100 text-red-800',
      'ゲーム開発': 'bg-pink-100 text-pink-800'
    };
    return categoryMap[category as keyof typeof categoryMap] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 w-64 bg-white shadow-lg z-50">
        <div className="flex items-center justify-center h-16 border-b border-gray-200">
          <div className="flex items-center">
            <Briefcase className="w-6 h-6 text-indigo-600 mr-2" />
            <h1 className="text-xl font-bold text-gray-800">Y-folio</h1>
            <span className="ml-2 px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">管理者</span>
          </div>
        </div>
        
        <nav className="mt-6">
          <div className="px-4 mb-4">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">メインメニュー</p>
          </div>
          
          <div className="px-4 space-y-2">
            <a href="/admin" className="flex items-center px-4 py-3 rounded-lg text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 transition">
              <BarChart3 className="w-5 h-5 mr-3" />
              <span>ダッシュボード</span>
            </a>
            <a href="/admin/user" className="flex items-center px-4 py-3 rounded-lg text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 transition">
              <Users className="w-5 h-5 mr-3" />
              <span>ユーザー管理</span>
            </a>
            <a href="/admin/PortfolioManagement" className="flex items-center px-4 py-3 rounded-lg text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 transition">
              <FileText className="w-5 h-5 mr-3" />
              <span>ポートフォリオ管理</span>
            </a>
            <a href="/admin/tags" className="flex items-center px-4 py-3 rounded-lg bg-indigo-600 text-white">
              <Tags className="w-5 h-5 mr-3" />
              <span>タグ管理</span>
            </a>
          </div>
          
          <div className="px-4 mt-8 mb-4">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">システム</p>
          </div>
          
          <div className="px-4 space-y-2">
            <a href="/admin/settings" className="flex items-center px-4 py-3 rounded-lg text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 transition">
              <Settings className="w-5 h-5 mr-3" />
              <span>設定</span>
            </a>
            <a href="/admin/security" className="flex items-center px-4 py-3 rounded-lg text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 transition">
              <Shield className="w-5 h-5 mr-3" />
              <span>セキュリティ</span>
            </a>
            <a href="/admin/logs" className="flex items-center px-4 py-3 rounded-lg text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 transition">
              <List className="w-5 h-5 mr-3" />
              <span>ログ</span>
            </a>
          </div>
        </nav>
        
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
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
      <div className="ml-64 flex-1">
        {/* Top Header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="flex items-center justify-between px-6 py-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">タグ管理</h2>
              <p className="text-gray-600">ポートフォリオタグの管理とカテゴリ分類</p>
            </div>
            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-400 hover:text-gray-600 transition">
                <Bell className="w-5 h-5" />
              </button>
              <button className="p-2 text-gray-400 hover:text-gray-600 transition">
                <Cog className="w-5 h-5" />
              </button>
            </div>
          </div>
        </header>

        {/* Tag Management Content */}
        <main className="p-6">
          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-md p-6 fade-in">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Tags className="w-6 h-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">総タグ数</p>
                  <p className="text-2xl font-bold text-gray-800">156</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 fade-in">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">アクティブタグ</p>
                  <p className="text-2xl font-bold text-gray-800">142</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 fade-in">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <FileText className="w-6 h-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">使用中ポートフォリオ</p>
                  <p className="text-2xl font-bold text-gray-800">856</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 fade-in">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-yellow-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">人気タグ</p>
                  <p className="text-2xl font-bold text-gray-800">23</p>
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
                    placeholder="タグ名で検索..." 
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                  <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
                <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent">
                  <option value="">カテゴリ</option>
                  <option value="web">Web開発</option>
                  <option value="mobile">モバイル開発</option>
                  <option value="design">デザイン</option>
                  <option value="data">データ分析</option>
                  <option value="ai">AI/ML</option>
                  <option value="game">ゲーム開発</option>
                </select>
                
                <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent">
                  <option value="">ステータス</option>
                  <option value="active">アクティブ</option>
                  <option value="inactive">非アクティブ</option>
                </select>
                
                <button className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition flex items-center">
                  <Filter className="w-4 h-4 mr-2" />
                  フィルター
                </button>
              </div>
            </div>
          </div>

          {/* Tags Table */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden fade-in">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-800">タグ一覧</h3>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">156件中 1-20件を表示</span>
                  <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex items-center">
                    <Plus className="w-4 h-4 mr-2" />
                    新規タグ
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
                        className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                        onChange={(e) => handleSelectAll(e.target.checked)}
                      />
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      タグ名
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      カテゴリ
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      説明
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      使用数
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ステータス
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      作成日
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      アクション
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {tags.map((tag) => (
                    <tr key={tag.id} className="table-row">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input 
                          type="checkbox" 
                          className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                          checked={selectedTags.includes(tag.id)}
                          onChange={(e) => handleSelectTag(tag.id, e.target.checked)}
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`tag-badge ${getTagColorClasses(tag.color)}`}>
                          {tag.name}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getCategoryColorClasses(tag.category)}`}>
                          {tag.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {tag.description}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {tag.usageCount}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          tag.status === 'active' 
                            ? 'tag-status-active' 
                            : 'tag-status-inactive'
                        }`}>
                          {tag.status === 'active' ? 'アクティブ' : '非アクティブ'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {tag.createdAt}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          <button className="text-indigo-600 hover:text-indigo-900">
                            <Eye className="w-4 h-4" />
                          </button>
                          <button className="text-yellow-600 hover:text-yellow-900">
                            <Edit className="w-4 h-4" />
                          </button>
                          {tag.status === 'active' ? (
                            <button className="text-red-600 hover:text-red-900">
                              <Trash className="w-4 h-4" />
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
                  <button className="px-3 py-1 text-sm text-gray-500 hover:text-gray-700">8</button>
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
              <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex items-center">
                <Check className="w-4 h-4 mr-2" />
                選択タグを有効化
              </button>
              <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition flex items-center">
                <Trash className="w-4 h-4 mr-2" />
                選択タグを無効化
              </button>
              <button className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition flex items-center">
                <Star className="w-4 h-4 mr-2" />
                おすすめに設定
              </button>
              <button className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition flex items-center">
                <Download className="w-4 h-4 mr-2" />
                CSVエクスポート
              </button>
            </div>
          </div>

          {/* Popular Tags Section */}
          <div className="bg-white rounded-lg shadow-md p-6 mt-6 fade-in">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">人気タグ</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {popularTags.map((tag, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className={`tag-badge ${getTagColorClasses(tag.color)}`}>
                    {tag.name}
                  </span>
                  <span className="text-sm text-gray-600">{tag.count}</span>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .fade-in {
          animation: fadeIn 0.6s ease-in;
        }
        .tag-badge {
          display: inline-flex;
          align-items: center;
          padding: 0.25rem 0.75rem;
          border-radius: 9999px;
          font-size: 0.75rem;
          font-weight: 500;
          color: white;
        }
        .table-row {
          transition: all 0.3s ease;
        }
        .table-row:hover {
          background-color: #f8fafc;
        }
        .tag-status-active {
          background-color: #dcfce7;
          color: #166534;
        }
        .tag-status-inactive {
          background-color: #fef2f2;
          color: #dc2626;
        }
      `}</style>
    </div>
  );
} 