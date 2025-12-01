import React from 'react';

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      {/* ランディングページ */}
      <section className="gradient-bg text-white pt-24 pb-16">
        <div className="container mx-auto px-4 text-center">
          <div className="fade-in">
            <h2 className="text-5xl font-bold mb-6">
              あなたの就活を<br />次のレベルへ
            </h2>
            <p className="text-xl mb-8 opacity-90">
              簡単にポートフォリオを作成・共有し、企業にアピールしよう
            </p>
            <div className="flex justify-center space-x-4">
              <button className="bg-white text-indigo-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition pulse-animation">
                <i className="fas fa-plus mr-2"></i>ポートフォリオを作成
              </button>
              <button className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-indigo-600 transition">
                <i className="fas fa-search mr-2"></i>ポートフォリオを探す
              </button>
            </div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section id="features" className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-800 mb-4">なぜY-folioを選ぶのか</h3>
            <p className="text-gray-600 text-lg">就活から転職まで、長く使えるポートフォリオサービス</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center card-hover bg-gray-50 p-8 rounded-lg">
              <div className="bg-indigo-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-edit text-2xl text-indigo-600"></i>
              </div>
              <h4 className="text-xl font-semibold mb-3 text-gray-800">簡単作成</h4>
              <p className="text-gray-600">直感的なエディターで、誰でも簡単にプロフェッショナルなポートフォリオを作成できます</p>
            </div>
            <div className="text-center card-hover bg-gray-50 p-8 rounded-lg">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-share-alt text-2xl text-green-600"></i>
              </div>
              <h4 className="text-xl font-semibold mb-3 text-gray-800">簡単共有</h4>
              <p className="text-gray-600">URLひとつで企業や採用担当者に簡単にポートフォリオを共有できます</p>
            </div>
            <div className="text-center card-hover bg-gray-50 p-8 rounded-lg">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-file-pdf text-2xl text-purple-600"></i>
              </div>
              <h4 className="text-xl font-semibold mb-3 text-gray-800">PDF出力</h4>
              <p className="text-gray-600">作成したポートフォリオをPDFとして出力し、印刷して持参することも可能です</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}