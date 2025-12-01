import {
  Eye,
  Heart,
  CheckCircle,
  Calendar,
} from "lucide-react";

export const StatsCard = () => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center"><Eye className="text-blue-600 w-6 h-6" /></div>
                    <div className="ml-4"><p className="text-sm font-medium text-gray-600">総閲覧数</p><p className="text-2xl font-bold text-gray-800">1,234</p></div>
                </div>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center">
                    <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center"><Heart className="text-red-600 w-6 h-6" /></div>
                    <div className="ml-4"><p className="text-sm font-medium text-gray-600">いいね数</p><p className="text-2xl font-bold text-gray-800">45</p></div>
                </div>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center"><CheckCircle className="text-green-600 w-6 h-6" /></div>
                    <div className="ml-4"><p className="text-sm font-medium text-gray-600">公開ステータス</p><p className="text-xl font-bold text-gray-800">公開中</p></div>
                </div>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center">
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center"><Calendar className="text-purple-600 w-6 h-6" /></div>
                    <div className="ml-4"><p className="text-sm font-medium text-gray-600">最終更新日</p><p className="text-xl font-bold text-gray-800">2日前</p></div>
                </div>
            </div>
        </div>
    );
};
