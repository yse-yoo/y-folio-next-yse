import { Building2, Search, Star, Mail, Briefcase, User, Handshake, Eye } from 'lucide-react';

const RecruiterHomePage = () => {
  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <nav className="bg-white shadow-lg fixed w-full z-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <Building2 className="text-indigo-600 w-7 h-7 mr-2" />
              <h1 className="text-2xl font-bold text-gray-800">Y-folio</h1>
              <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">採用担当者向け</span>
            </div>
            <div className="hidden md:flex space-x-6">
              <a href="#features" className="text-gray-600 hover:text-indigo-600 transition">主な機能</a>
              <a href="#achievements" className="text-gray-600 hover:text-indigo-600 transition">実績</a>
            </div>
            <div className="flex space-x-3">
              <button className="px-4 py-2 text-indigo-600 border border-indigo-600 rounded-lg hover:bg-indigo-50 transition">ログイン</button>
              <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition">新規登録</button>
            </div>
          </div>
        </div>
      </nav>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-indigo-500 to-purple-500 text-white pt-24 pb-16">
        <div className="container mx-auto px-4 text-center">
          <div className="animate-fade-in">
            <h2 className="text-5xl font-bold mb-6">優秀な学生と出会う<br />新しい採用体験を</h2>
            <p className="text-xl mb-8 opacity-90">Y-folioは、企業の採用担当者が効率的に学生のポートフォリオを検索・管理できるプラットフォームです</p>
            <div className="flex justify-center space-x-4">
              <button className="bg-white text-indigo-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition animate-pulse">
                <Search className="w-5 h-5 mr-2 inline" />学生を探す
              </button>
              <button className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-indigo-600 transition">
                <Briefcase className="w-5 h-5 mr-2 inline" />企業アカウント登録
              </button>
            </div>
          </div>
        </div>
      </section>
      {/* Features Section */}
      <section id="features" className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-800 mb-4">採用担当者向けの主な機能</h3>
            <p className="text-gray-600 text-lg">Y-folioは採用活動を効率化し、最適な人材発掘をサポートします</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center bg-gray-50 p-8 rounded-lg shadow-sm hover:shadow-lg transition card-hover">
              <div className="bg-indigo-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-indigo-600" />
              </div>
              <h4 className="text-xl font-semibold mb-3 text-gray-800">詳細検索・フィルタ</h4>
              <p className="text-gray-600">スキル・大学・学部・キーワードなど多様な条件で学生を絞り込み、理想の人材を素早く発見できます</p>
            </div>
            <div className="text-center bg-gray-50 p-8 rounded-lg shadow-sm hover:shadow-lg transition card-hover">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="w-8 h-8 text-green-600" />
              </div>
              <h4 className="text-xl font-semibold mb-3 text-gray-800">お気に入り・管理</h4>
              <p className="text-gray-600">気になる学生をお気に入り登録し、リストで一括管理。比較やメモ機能も利用可能です</p>
            </div>
            <div className="text-center bg-gray-50 p-8 rounded-lg shadow-sm hover:shadow-lg transition card-hover">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="w-8 h-8 text-purple-600" />
              </div>
              <h4 className="text-xl font-semibold mb-3 text-gray-800">ダイレクトメッセージ</h4>
              <p className="text-gray-600">学生と直接やり取りできる安全なメッセージ機能を搭載。スムーズなコミュニケーションを実現します</p>
            </div>
          </div>
        </div>
      </section>
      {/* Achievements Section */}
      <section id="achievements" className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-800 mb-4">Y-folioの実績</h3>
            <p className="text-gray-600 text-lg">多くの企業・学生にご利用いただいています</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg shadow-md p-8 text-center card-hover">
              <div className="flex justify-center mb-4">
                <Building2 className="w-8 h-8 text-indigo-500" />
              </div>
              <h4 className="text-xl font-semibold mb-2 text-gray-800">導入企業数</h4>
              <p className="text-3xl font-bold text-indigo-600 mb-2">120社以上</p>
              <p className="text-gray-500">大手からスタートアップまで幅広い企業が活用</p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-8 text-center card-hover">
              <div className="flex justify-center mb-4">
                <User className="w-8 h-8 text-green-500" />
              </div>
              <h4 className="text-xl font-semibold mb-2 text-gray-800">登録学生数</h4>
              <p className="text-3xl font-bold text-green-600 mb-2">5,000名以上</p>
              <p className="text-gray-500">全国の大学生・大学院生がポートフォリオを公開</p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-8 text-center card-hover">
              <div className="flex justify-center mb-4">
                <Handshake className="w-8 h-8 text-purple-500" />
              </div>
              <h4 className="text-xl font-semibold mb-2 text-gray-800">マッチング実績</h4>
              <p className="text-3xl font-bold text-purple-600 mb-2">1,200件以上</p>
              <p className="text-gray-500">Y-folio経由での企業・学生のマッチング数</p>
            </div>
          </div>
        </div>
      </section>
      {/* CTA Section */}
      <section className="py-16 bg-indigo-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-3xl font-bold mb-4">Y-folioで新しい採用を始めませんか？</h3>
          <p className="text-xl mb-8 opacity-90">今すぐ無料で企業アカウントを作成し、優秀な学生と出会いましょう</p>
          <button className="bg-white text-indigo-600 px-12 py-4 rounded-lg font-bold text-lg hover:bg-gray-100 transition">
            企業アカウント登録（無料）
          </button>
        </div>
      </section>
      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <Building2 className="w-7 h-7 text-indigo-400 mr-2" />
                <h4 className="text-xl font-bold">Y-folio</h4>
              </div>
              <p className="text-gray-400">就活生と企業をつなぐポートフォリオサービス</p>
            </div>
            <div>
              <h5 className="font-semibold mb-4">サービス</h5>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#features" className="hover:text-white transition">主な機能</a></li>
                <li><a href="#achievements" className="hover:text-white transition">実績</a></li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold mb-4">サポート</h5>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition">ヘルプ</a></li>
                <li><a href="#" className="hover:text-white transition">利用規約</a></li>
                <li><a href="#" className="hover:text-white transition">プライバシーポリシー</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 Y-folio. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default RecruiterHomePage; 