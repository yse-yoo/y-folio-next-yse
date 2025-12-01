import { Search, Heart, Eye, MessageCircle, LayoutGrid, List, Plus } from 'lucide-react';

const portfolioItems = [
  {
    id: 1,
    author: '田中 太郎',
    university: '東京大学・情報科学科',
    grade: '4年生',
    description: 'Web開発とAI技術に興味があり、複数のプロジェクトを手がけています。React、Node.js、Pythonを使用した開発経験があります。',
    tags: ['JavaScript', 'React', 'Python'],
    views: '1.2k',
    likes: 45,
    comments: 12,
    avatarInitial: '田',
    imageGradient: 'from-blue-400 to-purple-500',
    avatarGradient: 'from-blue-500 to-purple-600',
    isLiked: true,
  },
  {
    id: 2,
    author: '佐藤 花子',
    university: '早稲田大学・商学部',
    grade: '3年生',
    description: 'マーケティングとデータ分析を専攻。インターンシップでの実績多数。Excel、PowerBI、Pythonを使用した分析経験があります。',
    tags: ['マーケティング', 'Excel', 'PowerBI'],
    views: '856',
    likes: 32,
    comments: 8,
    avatarInitial: '佐',
    imageGradient: 'from-green-400 to-blue-500',
    avatarGradient: 'from-green-500 to-blue-600',
    isLiked: false,
  },
  {
    id: 3,
    author: '山田 次郎',
    university: '慶應大学・理工学部',
    grade: '修士1年',
    description: '機械学習とロボティクスの研究に従事。国際学会での発表経験あり。TensorFlow、PyTorch、C++を使用した開発経験があります。',
    tags: ['機械学習', 'TensorFlow', 'C++'],
    views: '2.1k',
    likes: 89,
    comments: 23,
    avatarInitial: '山',
    imageGradient: 'from-purple-400 to-pink-500',
    avatarGradient: 'from-purple-500 to-pink-600',
    isLiked: true,
  },
  {
    id: 4,
    author: '鈴木 美咲',
    university: '京都大学・文学部',
    grade: '4年生',
    description: 'デザインとユーザー体験に興味があり、WebデザインとUI/UXデザインの経験があります。Figma、Adobe Creative Suiteを活用。',
    tags: ['デザイン', 'Figma', 'UI/UX'],
    views: '743',
    likes: 28,
    comments: 5,
    avatarInitial: '鈴',
    imageGradient: 'from-yellow-400 to-orange-500',
    avatarGradient: 'from-yellow-500 to-orange-600',
    isLiked: false,
  },
  {
    id: 5,
    author: '高橋 健太',
    university: '大阪大学・経済学部',
    grade: '3年生',
    description: '金融テクノロジーに興味があり、ブロックチェーン技術の研究を行っています。Solidity、JavaScript、Pythonを使用。',
    tags: ['ブロックチェーン', 'Solidity', 'FinTech'],
    views: '567',
    likes: 19,
    comments: 3,
    avatarInitial: '高',
    imageGradient: 'from-red-400 to-pink-500',
    avatarGradient: 'from-red-500 to-pink-600',
    isLiked: false,
  },
  {
    id: 6,
    author: '田中 愛',
    university: '名古屋大学・医学部',
    grade: '5年生',
    description: '医療AIの研究に従事。画像認識技術を用いた診断支援システムの開発を行っています。Python、TensorFlow、OpenCVを使用。',
    tags: ['医療AI', '画像認識', 'OpenCV'],
    views: '1.8k',
    likes: 67,
    comments: 15,
    avatarInitial: '田',
    imageGradient: 'from-indigo-400 to-purple-500',
    avatarGradient: 'from-indigo-500 to-purple-600',
    isLiked: true,
  },
];

const PortfolioListPage = () => {
  return (
    <div className="bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white pt-24 pb-12">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h2 className="text-4xl font-bold mb-4">ポートフォリオ一覧</h2>
            <p className="text-xl opacity-90 mb-8">就活生の素晴らしいポートフォリオを発見しよう</p>
            
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <input 
                  type="text" 
                  placeholder="スキル、大学、名前で検索..." 
                  className="w-full px-6 py-4 pl-12 pr-20 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all duration-300 ease-in-out focus:-translate-y-0.5 focus:shadow-lg"
                />
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <button className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition">
                  検索
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Filters Section */}
      <section className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-wrap items-center gap-4">
            <span className="text-sm font-medium text-gray-700">フィルター:</span>
            <div className="flex flex-wrap gap-2">
              <button className="px-4 py-2 bg-indigo-600 text-white rounded-full text-sm font-medium transition-all duration-300 ease-in-out">すべて</button>
              <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm font-medium hover:bg-gray-200 transition-all duration-300 ease-in-out hover:-translate-y-0.5">JavaScript</button>
              <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm font-medium hover:bg-gray-200 transition-all duration-300 ease-in-out hover:-translate-y-0.5">React</button>
              <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm font-medium hover:bg-gray-200 transition-all duration-300 ease-in-out hover:-translate-y-0.5">Python</button>
              <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm font-medium hover:bg-gray-200 transition-all duration-300 ease-in-out hover:-translate-y-0.5">デザイン</button>
              <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm font-medium hover:bg-gray-200 transition-all duration-300 ease-in-out hover:-translate-y-0.5">マーケティング</button>
            </div>
            <div className="ml-auto flex items-center space-x-4">
              <span className="text-sm text-gray-600">並び順:</span>
              <select className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent">
                <option value="latest">最新順</option>
                <option value="popular">人気順</option>
                <option value="name">名前順</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Portfolio Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h3 className="text-2xl font-bold text-gray-800">ポートフォリオ一覧</h3>
              <p className="text-gray-600 mt-1">全 {portfolioItems.length} 件のポートフォリオ</p>
            </div>
            <div className="flex items-center space-x-2">
              <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition bg-gray-100">
                <LayoutGrid className="w-5 h-5" />
              </button>
              <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition">
                <List className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {portfolioItems.map((item) => (
              <div key={item.id} className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 ease-in-out hover:-translate-y-2 hover:shadow-2xl">
                <div className={`h-48 bg-gradient-to-r ${item.imageGradient} relative`}>
                  <div className="absolute top-4 right-4">
                    <button className="bg-white/20 backdrop-blur-sm text-white p-2 rounded-full hover:bg-white/30 transition">
                      <Heart className={`w-5 h-5 ${item.isLiked ? 'text-red-500 fill-current' : ''}`} />
                    </button>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-center mb-3">
                    <div className={`w-12 h-12 bg-gradient-to-r ${item.avatarGradient} rounded-full mr-3 flex items-center justify-center text-white font-semibold`}>
                      {item.avatarInitial}
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800">{item.author}</h4>
                      <p className="text-sm text-gray-600">{item.university}</p>
                      <p className="text-xs text-gray-500">{item.grade}</p>
                    </div>
                  </div>
                  <p className="text-gray-700 mb-4 h-12 overflow-hidden">{item.description}</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {item.tags.map(tag => (
                      <span key={tag} className="px-3 py-1 bg-gray-100 text-gray-800 text-sm rounded-full transition-transform duration-300 ease-in-out hover:scale-105">{tag}</span>
                    ))}
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span className="flex items-center"><Eye className="w-4 h-4 mr-1" />{item.views}</span>
                      <span className="flex items-center"><Heart className="w-4 h-4 mr-1" />{item.likes}</span>
                      <span className="flex items-center"><MessageCircle className="w-4 h-4 mr-1" />{item.comments}</span>
                    </div>
                    <button className="text-indigo-600 hover:text-indigo-800 font-semibold">詳細を見る</button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <button className="bg-indigo-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition hover:scale-105">
              <Plus className="w-5 h-5 mr-2 inline" />さらに読み込む
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PortfolioListPage; 