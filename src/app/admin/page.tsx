import {
  Users,
  LayoutDashboard,
  FileText,
  Tags,
  BarChart,
  Settings,
  Shield,
  Book,
  ArrowUp,
  ArrowDown,
  Eye,
  AlertTriangle,
  Briefcase,
  Bell,
} from "lucide-react";

const AdminPage = () => {
  return (
    <div className="flex min-h-screen bg-gray-100 text-gray-800">
      {/* Sidebar */}
      <aside className="w-64 bg-white p-6 shadow-md flex flex-col">
        <div className="flex items-center mb-8">
          <Briefcase className="w-8 h-8 text-indigo-600" />
          <span className="text-xl font-bold ml-2">Y-folio</span>
          <span className="ml-2 px-2 py-0.5 text-xs text-red-600 bg-red-100 rounded-full">
            管理者
          </span>
        </div>
        <nav className="flex-1">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
            メインメニュー
          </h2>
          <ul>
            <li className="mb-2">
              <a
                href="#"
                className="flex items-center p-2 text-white bg-indigo-600 rounded-lg"
              >
                <LayoutDashboard className="w-5 h-5" />
                <span className="ml-3">ダッシュボード</span>
              </a>
            </li>
            <li className="mb-2">
              <a
                href="/admin/user"
                className="flex items-center p-2 text-gray-700 hover:bg-gray-200 rounded-lg"
              >
                <Users className="w-5 h-5" />
                <span className="ml-3">ユーザー管理</span>
              </a>
            </li>
            <li className="mb-2">
              <a
                href="/admin/PortfolioManagement"
                className="flex items-center p-2 text-gray-700 hover:bg-gray-200 rounded-lg"
              >
                <FileText className="w-5 h-5" />
                <span className="ml-3">ポートフォリオ管理</span>
              </a>
            </li>
            <li className="mb-2">
              <a
                href="/admin/tags"
                className="flex items-center p-2 text-gray-700 hover:bg-gray-200 rounded-lg"
              >
                <Tags className="w-5 h-5" />
                <span className="ml-3">タグ管理</span>
              </a>
            </li>
            <li className="mb-2">
              <a
                href="#"
                className="flex items-center p-2 text-gray-700 hover:bg-gray-200 rounded-lg"
              >
                <BarChart className="w-5 h-5" />
                <span className="ml-3">レポート</span>
              </a>
            </li>
          </ul>
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mt-6 mb-4">
            システム
          </h2>
          <ul>
            <li className="mb-2">
              <a
                href="#"
                className="flex items-center p-2 text-gray-700 hover:bg-gray-200 rounded-lg"
              >
                <Settings className="w-5 h-5" />
                <span className="ml-3">設定</span>
              </a>
            </li>
            <li className="mb-2">
              <a
                href="#"
                className="flex items-center p-2 text-gray-700 hover:bg-gray-200 rounded-lg"
              >
                <Shield className="w-5 h-5" />
                <span className="ml-3">セキュリティ</span>
              </a>
            </li>
            <li className="mb-2">
              <a
                href="#"
                className="flex items-center p-2 text-gray-700 hover:bg-gray-200 rounded-lg"
              >
                <Book className="w-5 h-5" />
                <span className="ml-3">ログ</span>
              </a>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <header className="bg-white shadow-sm p-4 border-b">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">ダッシュボード</h1>
              <p className="text-sm text-gray-500">システムの概要と統計情報</p>
            </div>
            <div className="flex items-center space-x-4">
              <button className="text-gray-500 hover:text-gray-800">
                <Bell className="w-6 h-6" />
              </button>
              <button className="text-gray-500 hover:text-gray-800">
                <Settings className="w-6 h-6" />
              </button>
            </div>
          </div>
        </header>
        <main className="flex-1 p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Card 1: Total Users */}
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-gray-500">総ユーザー数</p>
                  <p className="text-3xl font-bold">1,234</p>
                </div>
                <div className="p-2 bg-blue-100 rounded-full">
                  <Users className="w-6 h-6 text-blue-500" />
                </div>
              </div>
              <div className="mt-2 flex items-center text-green-500">
                <ArrowUp className="w-4 h-4" />
                <span className="text-sm ml-1">12% 先月比</span>
              </div>
            </div>
            {/* Card 2: Portfolio Count */}
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-gray-500">ポートフォリオ数</p>
                  <p className="text-3xl font-bold">856</p>
                </div>
                <div className="p-2 bg-green-100 rounded-full">
                  <FileText className="w-6 h-6 text-green-500" />
                </div>
              </div>
              <div className="mt-2 flex items-center text-green-500">
                <ArrowUp className="w-4 h-4" />
                <span className="text-sm ml-1">8% 先月比</span>
              </div>
            </div>
            {/* Card 3: Total Views */}
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-gray-500">総閲覧数</p>
                  <p className="text-3xl font-bold">45,678</p>
                </div>
                <div className="p-2 bg-purple-100 rounded-full">
                  <Eye className="w-6 h-6 text-purple-500" />
                </div>
              </div>
              <div className="mt-2 flex items-center text-green-500">
                <ArrowUp className="w-4 h-4" />
                <span className="text-sm ml-1">15% 先月比</span>
              </div>
            </div>
            {/* Card 4: Reports */}
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-gray-500">報告件数</p>
                  <p className="text-3xl font-bold">23</p>
                </div>
                <div className="p-2 bg-red-100 rounded-full">
                  <AlertTriangle className="w-6 h-6 text-red-500" />
                </div>
              </div>
              <div className="mt-2 flex items-center text-red-500">
                <ArrowDown className="w-4 h-4" />
                <span className="text-sm ml-1">5% 先月比</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* User Registration Trends */}
            <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow">
              <h3 className="font-semibold mb-4">ユーザー登録推移</h3>
              <div className="flex items-center justify-center h-64 bg-gray-50 rounded-lg">
                <p className="text-gray-400">チャート表示エリア 実装予定</p>
              </div>
            </div>
            {/* Popular Tags */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="font-semibold mb-4">人気タグTOP10</h3>
              <ul>
                <li className="flex justify-between items-center mb-3">
                  <span>JavaScript</span>
                  <div className="flex items-center">
                    <div className="w-32 h-2 bg-gray-200 rounded-full mr-2">
                      <div
                        className="h-2 bg-blue-500 rounded-full"
                        style={{ width: "95%" }}
                      ></div>
                    </div>
                    <span>1,234</span>
                  </div>
                </li>
                <li className="flex justify-between items-center mb-3">
                  <span>React</span>
                  <div className="flex items-center">
                    <div className="w-32 h-2 bg-gray-200 rounded-full mr-2">
                      <div
                        className="h-2 bg-green-500 rounded-full"
                        style={{ width: "80%" }}
                      ></div>
                    </div>
                    <span>987</span>
                  </div>
                </li>
                <li className="flex justify-between items-center mb-3">
                  <span>Python</span>
                  <div className="flex items-center">
                    <div className="w-32 h-2 bg-gray-200 rounded-full mr-2">
                      <div
                        className="h-2 bg-yellow-500 rounded-full"
                        style={{ width: "70%" }}
                      ></div>
                    </div>
                    <span>856</span>
                  </div>
                </li>
                <li className="flex justify-between items-center mb-3">
                  <span>デザイン</span>
                  <div className="flex items-center">
                    <div className="w-32 h-2 bg-gray-200 rounded-full mr-2">
                      <div
                        className="h-2 bg-pink-500 rounded-full"
                        style={{ width: "60%" }}
                      ></div>
                    </div>
                    <span>743</span>
                  </div>
                </li>
                <li className="flex justify-between items-center">
                  <span>Node.js</span>
                  <div className="flex items-center">
                    <div className="w-32 h-2 bg-gray-200 rounded-full mr-2">
                      <div
                        className="h-2 bg-purple-500 rounded-full"
                        style={{ width: "45%" }}
                      ></div>
                    </div>
                    <span>543</span>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminPage; 