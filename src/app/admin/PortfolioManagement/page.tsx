'use client';

import { useState } from 'react';
import { 
  FileText, 
  Eye, 
  Heart, 
  Edit, 
  Search, 
  Filter, 
  Plus, 
  Check, 
  Ban, 
  Star, 
  Download,
  ChevronLeft,
  ChevronRight,
  Users,
  Tags,
  BarChart3,
  Settings,
  Shield,
  List,
  Briefcase
} from 'lucide-react';

export default function AdminPortfolioManagement() {
  const [selectedPortfolios, setSelectedPortfolios] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState(false);

  const handleSelectAll = (checked: boolean) => {
    setSelectAll(checked);
    if (checked) {
      setSelectedPortfolios(['1', '2', '3', '4', '5']);
    } else {
      setSelectedPortfolios([]);
    }
  };

  const handleSelectPortfolio = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedPortfolios([...selectedPortfolios, id]);
    } else {
      setSelectedPortfolios(selectedPortfolios.filter(p => p !== id));
    }
  };

  const portfolios = [
    {
      id: '1',
      title: 'Eコマースサイト開発',
      technology: 'React + Node.js',
      thumbnail: 'Web',
      author: '田中太郎',
      username: '@tanaka_taro',
      category: 'Web開発',
      status: 'public',
      views: '1,234',
      likes: '89',
      createdDate: '2024/01/15'
    },
    {
      id: '2',
      title: 'フィットネスアプリ',
      technology: 'Flutter + Firebase',
      thumbnail: 'App',
      author: '佐藤花子',
      username: '@sato_hanako',
      category: 'モバイル開発',
      status: 'public',
      views: '856',
      likes: '67',
      createdDate: '2024/01/12'
    },
    {
      id: '3',
      title: 'ブランドデザイン',
      technology: 'Figma + Adobe',
      thumbnail: 'UI',
      author: '山田次郎',
      username: '@yamada_jiro',
      category: 'デザイン',
      status: 'draft',
      views: '-',
      likes: '-',
      createdDate: '2024/01/18'
    },
    {
      id: '4',
      title: 'データ分析レポート',
      technology: 'Python + Pandas',
      thumbnail: 'Data',
      author: '伊藤美咲',
      username: '@ito_misaki',
      category: 'データ分析',
      status: 'private',
      views: '-',
      likes: '-',
      createdDate: '2024/01/10'
    },
    {
      id: '5',
      title: 'ブログシステム',
      technology: 'Vue.js + Laravel',
      thumbnail: 'Web',
      author: '渡辺健太',
      username: '@watanabe_kenta',
      category: 'Web開発',
      status: 'public',
      views: '567',
      likes: '34',
      createdDate: '2024/01/08'
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'public':
        return <span className="status-public px-2 py-1 text-xs font-medium rounded-full">公開中</span>;
      case 'private':
        return <span className="status-private px-2 py-1 text-xs font-medium rounded-full">非公開</span>;
      case 'draft':
        return <span className="status-draft px-2 py-1 text-xs font-medium rounded-full">下書き</span>;
      default:
        return null;
    }
  };

  const getCategoryBadge = (category: string) => {
    const colors = {
      'Web開発': 'bg-blue-100 text-blue-800',
      'モバイル開発': 'bg-green-100 text-green-800',
      'デザイン': 'bg-purple-100 text-purple-800',
      'データ分析': 'bg-orange-100 text-orange-800'
    };
    
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800'}`}>
        {category}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 w-64 bg-white shadow-lg z-50">
        <div className="flex items-center justify-center h-16 border-b border-gray-200">
          <div className="flex items-center">
            <Briefcase className="text-2xl text-indigo-600 mr-2" />
            <h1 className="text-xl font-bold text-gray-800">Y-folio</h1>
            <span className="ml-2 px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">管理者</span>
          </div>
        </div>
        
        <nav className="mt-6">
          <div className="px-4 mb-4">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">メインメニュー</p>
          </div>
          
          <div className="px-4 space-y-2">
            <a href="/admin" className="sidebar-item flex items-center px-4 py-3 rounded-lg text-gray-700 hover:bg-indigo-50 hover:translate-x-1 transition-all duration-300">
              <BarChart3 className="w-5 h-5 mr-3" />
              <span>ダッシュボード</span>
            </a>
            <a href="/admin/user" className="sidebar-item flex items-center px-4 py-3 rounded-lg text-gray-700 hover:bg-indigo-50 hover:translate-x-1 transition-all duration-300">
              <Users className="w-5 h-5 mr-3" />
              <span>ユーザー管理</span>
            </a>
            <a href="/admin/PortfolioManagement" className="sidebar-item active flex items-center px-4 py-3 rounded-lg text-white bg-indigo-600">
              <FileText className="w-5 h-5 mr-3" />
              <span>ポートフォリオ管理</span>
            </a>
            <a href="/admin/tags" className="sidebar-item flex items-center px-4 py-3 rounded-lg text-gray-700 hover:bg-indigo-50 hover:translate-x-1 transition-all duration-300">
              <Tags className="w-5 h-5 mr-3" />
              <span>タグ管理</span>
            </a>
            <a href="#reports" className="sidebar-item flex items-center px-4 py-3 rounded-lg text-gray-700 hover:bg-indigo-50 hover:translate-x-1 transition-all duration-300">
              <BarChart3 className="w-5 h-5 mr-3" />
              <span>レポート</span>
            </a>
          </div>
          
          <div className="px-4 mt-8 mb-4">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">システム</p>
          </div>
          
          <div className="px-4 space-y-2">
            <a href="#settings" className="sidebar-item flex items-center px-4 py-3 rounded-lg text-gray-700 hover:bg-indigo-50 hover:translate-x-1 transition-all duration-300">
              <Settings className="w-5 h-5 mr-3" />
              <span>設定</span>
            </a>
            <a href="#security" className="sidebar-item flex items-center px-4 py-3 rounded-lg text-gray-700 hover:bg-indigo-50 hover:translate-x-1 transition-all duration-300">
              <Shield className="w-5 h-5 mr-3" />
              <span>セキュリティ</span>
            </a>
            <a href="#logs" className="sidebar-item flex items-center px-4 py-3 rounded-lg text-gray-700 hover:bg-indigo-50 hover:translate-x-1 transition-all duration-300">
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
      <div className="ml-64">
        {/* Top Header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="flex items-center justify-between px-6 py-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">ポートフォリオ管理</h2>
              <p className="text-gray-600">ポートフォリオの管理と監視</p>
            </div>
            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-400 hover:text-gray-600 transition">
                <Eye className="w-5 h-5" />
              </button>
              <button className="p-2 text-gray-400 hover:text-gray-600 transition">
                <Settings className="w-5 h-5" />
              </button>
            </div>
          </div>
        </header>

        {/* Portfolio Management Content */}
        <main className="p-6">
          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-md p-6 animate-fade-in">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <FileText className="text-blue-600 text-xl" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">総ポートフォリオ数</p>
                  <p className="text-2xl font-bold text-gray-800">856</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 animate-fade-in">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Eye className="text-green-600 text-xl" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">公開中</p>
                  <p className="text-2xl font-bold text-gray-800">723</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 animate-fade-in">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <Edit className="text-yellow-600 text-xl" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">下書き</p>
                  <p className="text-2xl font-bold text-gray-800">98</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 animate-fade-in">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Heart className="text-purple-600 text-xl" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">総いいね数</p>
                  <p className="text-2xl font-bold text-gray-800">2,456</p>
                </div>
              </div>
            </div>
          </div>

          {/* Search and Filter Section */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6 animate-fade-in">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
              <div className="flex-1 max-w-md">
                <div className="relative">
                  <input 
                    type="text" 
                    placeholder="ポートフォリオタイトル、ユーザー名で検索..." 
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                  <Search className="absolute left-3 top-3 text-gray-400 w-4 h-4" />
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
                <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent">
                  <option value="">ステータス</option>
                  <option value="public">公開中</option>
                  <option value="private">非公開</option>
                  <option value="draft">下書き</option>
                </select>
                
                <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent">
                  <option value="">カテゴリ</option>
                  <option value="web">Web開発</option>
                  <option value="mobile">モバイル開発</option>
                  <option value="design">デザイン</option>
                  <option value="data">データ分析</option>
                </select>
                
                <button className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition flex items-center">
                  <Filter className="w-4 h-4 mr-2" />
                  フィルター
                </button>
              </div>
            </div>
          </div>

          {/* Portfolios Table */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden animate-fade-in">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-800">ポートフォリオ一覧</h3>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">856件中 1-20件を表示</span>
                  <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex items-center">
                    <Plus className="w-4 h-4 mr-2" />
                    新規ポートフォリオ
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
                        checked={selectAll}
                        onChange={(e) => handleSelectAll(e.target.checked)}
                      />
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ポートフォリオ
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      作成者
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      カテゴリ
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ステータス
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      閲覧数
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      いいね数
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
                  {portfolios.map((portfolio) => (
                    <tr key={portfolio.id} className="hover:bg-gray-50 transition-colors duration-200">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input 
                          type="checkbox" 
                          className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                          checked={selectedPortfolios.includes(portfolio.id)}
                          onChange={(e) => handleSelectPortfolio(portfolio.id, e.target.checked)}
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-15 h-10 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold mr-3">
                            {portfolio.thumbnail}
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">{portfolio.title}</div>
                            <div className="text-sm text-gray-500">{portfolio.technology}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{portfolio.author}</div>
                        <div className="text-sm text-gray-500">{portfolio.username}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getCategoryBadge(portfolio.category)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(portfolio.status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {portfolio.views}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {portfolio.likes}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {portfolio.createdDate}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          <button className="text-indigo-600 hover:text-indigo-900 transition">
                            <Eye className="w-4 h-4" />
                          </button>
                          <button className="text-yellow-600 hover:text-yellow-900 transition">
                            <Edit className="w-4 h-4" />
                          </button>
                          {portfolio.status === 'public' ? (
                            <button className="text-red-600 hover:text-red-900 transition">
                              <Ban className="w-4 h-4" />
                            </button>
                          ) : (
                            <button className="text-green-600 hover:text-green-900 transition">
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
                  <button className="px-3 py-1 text-sm text-gray-500 hover:text-gray-700 transition">
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button className="px-3 py-1 text-sm bg-indigo-600 text-white rounded">1</button>
                  <button className="px-3 py-1 text-sm text-gray-500 hover:text-gray-700 transition">2</button>
                  <button className="px-3 py-1 text-sm text-gray-500 hover:text-gray-700 transition">3</button>
                  <span className="px-2 text-sm text-gray-500">...</span>
                  <button className="px-3 py-1 text-sm text-gray-500 hover:text-gray-700 transition">43</button>
                  <button className="px-3 py-1 text-sm text-gray-500 hover:text-gray-700 transition">
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
          <div className="bg-white rounded-lg shadow-md p-6 mt-6 animate-fade-in">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">一括操作</h3>
            <div className="flex flex-wrap items-center space-x-4">
              <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex items-center">
                <Check className="w-4 h-4 mr-2" />
                選択ポートフォリオを公開
              </button>
              <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition flex items-center">
                <Ban className="w-4 h-4 mr-2" />
                選択ポートフォリオを非公開
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
        </main>
      </div>

      <style jsx>{`
        .animate-fade-in {
          animation: fadeIn 0.6s ease-in;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .status-public {
          background-color: #dcfce7;
          color: #166534;
        }
        .status-private {
          background-color: #fef2f2;
          color: #dc2626;
        }
        .status-draft {
          background-color: #fef3c7;
          color: #d97706;
        }
      `}</style>
    </div>
  );
} 