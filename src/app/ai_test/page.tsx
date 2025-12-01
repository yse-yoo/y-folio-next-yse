'use client';

import { useState } from 'react';

export default function JobInterview() {
    const [question, setQuestion] = useState('就職面接での自己紹介のコツは？');
    const [answer, setAnswer] = useState('');
    const [loading, setLoading] = useState(false);

    const handleAsk = async () => {
        setLoading(true);
        setAnswer('');
        try {
            const res = await fetch('/api/ai/job-interview', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ question }),
            });

            const data = await res.json();
            setAnswer(data.reply || data.error);
        } catch (error) {
            console.error('Error:', error);
            setAnswer('エラーが発生しました。');
        } finally {
            setLoading(false);  // 通信終了
        }
    };

    return (
        <div className="p-4 max-w-xl mx-auto mt-10 pt-24">
            <h1 className="text-xl font-bold mb-2">就職面接の質問</h1>
            <textarea
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                className="w-full border p-2 rounded mb-4"
                rows={3}
            />
            <button
                onClick={handleAsk}
                className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
                disabled={loading}
            >
                {loading ? '考え中…' : '質問する'}
            </button>

            <div className="mt-4 whitespace-pre-line bg-gray-100 p-4 rounded min-h-[100px]">
                {loading ? '回答を生成中です。しばらくお待ちください...' : answer}
            </div>
        </div>
    );
}