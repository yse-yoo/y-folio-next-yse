import { Search, Flame, Code, LayoutGrid, List } from "lucide-react";

const popularTags = [
  {
    id: 1,
    name: "JavaScript",
    description: "Web開発の基本言語",
    count: "1,234件",
    icon: <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center"><Code className="w-8 h-8 text-blue-500" /></div>,
  },
  {
    id: 2,
    name: "React",
    description: "UIライブラリ",
    count: "987件",
    icon: <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center"><Code className="w-8 h-8 text-green-500" /></div>,
  },
  {
    id: 3,
    name: "Python",
    description: "汎用プログラミング言語",
    count: "856件",
    icon: <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center"><Code className="w-8 h-8 text-yellow-500" /></div>,
  },
  {
    id: 4,
    name: "デザイン",
    description: "UI/UXデザイン",
    count: "742件",
    icon: <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center"><Code className="w-8 h-8 text-purple-500" /></div>,
  },
];


const TagsPage = () => {
  return (
    <div className="bg-white">
      {/* Header */}
      <header className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white text-center py-16">
        <h1 className="text-4xl font-bold">タグ一覧</h1>
        <p className="mt-2 text-lg">スキルや技術でポートフォリオを発見しよう</p>
        <div className="mt-8 max-w-xl mx-auto">
          <div className="flex items-center bg-white rounded-full shadow-md">
            <Search className="w-5 h-5 text-gray-400 mx-4" />
            <input
              type="text"
              placeholder="タグを検索..."
              className="w-full py-3 pr-4 bg-transparent focus:outline-none text-gray-800"
            />
            <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-6 m-1 rounded-full">
              検索
            </button>
          </div>
        </div>
      </header>

      {/* Filters */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4">
            <div className="flex justify-between items-center py-4">
                <div className="flex items-center space-x-2">
                    <span className="font-semibold">カテゴリ:</span>
                    <button className="px-4 py-2 text-sm font-semibold text-white bg-indigo-600 rounded-full">すべて</button>
                    <button className="px-4 py-2 text-sm font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-full">プログラミング</button>
                    <button className="px-4 py-2 text-sm font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-full">デザイン</button>
                    <button className="px-4 py-2 text-sm font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-full">ビジネス</button>
                    <button className="px-4 py-2 text-sm font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-full">研究・学術</button>
                    <button className="px-4 py-2 text-sm font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-full">その他</button>
                </div>
                <div className="flex items-center space-x-2">
                    <label htmlFor="sort-by" className="text-sm text-gray-600">並び順:</label>
                    <select id="sort-by" className="border rounded-md px-2 py-1 text-sm">
                        <option>人気順</option>
                        <option>新着順</option>
                        <option>名前順</option>
                    </select>
                </div>
            </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-10">
        <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">タグ一覧</h2>
            <div className="flex items-center space-x-2 border rounded-md p-1">
                <button className="p-1 rounded-md bg-gray-200"><LayoutGrid className="w-5 h-5 text-gray-700"/></button>
                <button className="p-1 rounded-md"><List className="w-5 h-5 text-gray-500"/></button>
            </div>
        </div>
        <p className="text-gray-500 mb-8">全 156 個のタグ</p>

        {/* Popular Tags */}
        <section>
          <h3 className="text-xl font-bold flex items-center mb-6">
            <Flame className="w-6 h-6 mr-2 text-orange-500" />
            人気のタグ
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {popularTags.map((tag, index) => (
              <div key={tag.id} className="bg-white border rounded-lg p-6 shadow-sm hover:shadow-lg transition-shadow relative">
                 <span className="absolute top-4 right-4 text-sm font-bold text-gray-400">#{index + 1}</span>
                 <div className="mb-4">{tag.icon}</div>
                 <h4 className="font-bold text-lg">{tag.name}</h4>
                 <p className="text-gray-500 text-sm my-2">{tag.description}</p>
                 <p className="text-gray-400 text-xs mb-4">{tag.count}のポートフォリオ</p>
                 <a href="#" className="font-semibold text-indigo-600 hover:underline text-sm">詳細</a>
              </div>
            ))}
          </div>
        </section>
        
        {/* Placeholder for All tags */}
        <section className="mt-16">
            <h3 className="text-xl font-bold flex items-center mb-6">すべてのタグ</h3>
            {/* This would be dynamically generated */}
            <div className="text-center text-gray-400 p-8 border-dashed border-2 rounded-lg">
                <p>すべてのタグセクションはここに表示されます。</p>
                <p>(デザインに基づいた静的プレースホルダー)</p>
            </div>
        </section>

        {/* Load More Button */}
        <div className="text-center mt-12">
            <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-8 rounded-full transition-colors">
                さらに読み込む
            </button>
        </div>
      </main>
    </div>
  );
};

export default TagsPage; 