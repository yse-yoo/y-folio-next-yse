'use client';

import { LineChart } from "lucide-react";


const Analytics = () => {
    return (
        <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
                閲覧数アナリティクス (過去30日間)
            </h3>
            <div className="h-72 flex items-center justify-center text-gray-500 bg-gray-50 rounded-lg">
                <div className="text-center">
                    <LineChart className="w-10 h-10 mx-auto mb-2 text-gray-400" />
                    <p>チャート表示エリア</p>
                    <p className="text-sm">実装予定</p>
                </div>
            </div>
        </div>
    );
};

export default Analytics;
