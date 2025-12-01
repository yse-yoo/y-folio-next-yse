'use client';

import React from 'react';
import {
    CheckCircle,
    X,
    Copy,
    Mail,
    Link,
} from "lucide-react";

type ShareModalProps = {
    closeShareModal: () => void;
    copied: boolean;
    handleCopyUrl: () => void;
};

export function ShareModal({
    closeShareModal,
    copied,
    handleCopyUrl,
}: ShareModalProps) {

    const shareOptions = [
        {
            name: 'URLをコピー',
            icon: Copy,
            color: 'text-blue-600',
            bgColor: 'bg-blue-50',
            hoverBg: 'hover:bg-blue-100',
            action: handleCopyUrl
        },
        {
            name: 'メールで共有',
            icon: Mail,
            color: 'text-green-600',
            bgColor: 'bg-green-50',
            hoverBg: 'hover:bg-green-100',
            action: () => { }
        },
        {
            name: 'QRコード',
            icon: Link,
            color: 'text-purple-600',
            bgColor: 'bg-purple-50',
            hoverBg: 'hover:bg-purple-100',
            action: () => { }
        }
    ];

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-800">ポートフォリオを共有</h3>
                    <button
                        onClick={closeShareModal}
                        className="text-gray-400 hover:text-gray-600 transition"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6">
                    {/* URL */}
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">共有URL</label>
                        <div className="flex">
                            <input
                                type="text"
                                value="https://y-folio.com/portfolio/tanaka-taro"
                                readOnly
                                className="flex-1 px-3 py-2 border border-gray-300 rounded-l-lg bg-gray-50 text-sm"
                            />
                            <button
                                onClick={handleCopyUrl}
                                className={`px-4 py-2 border border-l-0 border-gray-300 rounded-r-lg transition ${copied
                                    ? 'bg-green-500 text-white'
                                    : 'bg-white hover:bg-gray-50 text-gray-700'
                                    }`}
                            >
                                {copied ? (
                                    <CheckCircle className="w-4 h-4" />
                                ) : (
                                    <Copy className="w-4 h-4" />
                                )}
                            </button>
                        </div>
                        {copied && (
                            <p className="text-green-600 text-sm mt-2">URLをコピーしました！</p>
                        )}
                    </div>

                    {/* Share Options */}
                    <div className="mb-6">
                        <h4 className="text-sm font-medium text-gray-700 mb-3">共有方法を選択</h4>
                        <div className="grid grid-cols-2 gap-3">
                            {shareOptions.map((option, index) => {
                                const Icon = option.icon;
                                return (
                                    <button
                                        key={index}
                                        onClick={option.action}
                                        className={`flex items-center p-3 rounded-lg border border-gray-200 transition ${option.bgColor} ${option.hoverBg}`}
                                    >
                                        <Icon className={`w-5 h-5 mr-3 ${option.color}`} />
                                        <span className="text-sm font-medium text-gray-700">{option.name}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Settings */}
                    <div className="bg-gray-50 rounded-lg p-4">
                        <h4 className="text-sm font-medium text-gray-700 mb-2">共有設定</h4>
                        <div className="space-y-2">
                            <label className="flex items-center">
                                <input
                                    type="checkbox"
                                    className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                    defaultChecked
                                />
                                <span className="ml-2 text-sm text-gray-600">閲覧統計を公開する</span>
                            </label>
                            <label className="flex items-center">
                                <input
                                    type="checkbox"
                                    className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                />
                                <span className="ml-2 text-sm text-gray-600">コメントを許可する</span>
                            </label>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="flex justify-end p-6 border-t border-gray-200">
                    <button
                        onClick={closeShareModal}
                        className="px-4 py-2 text-gray-600 hover:text-gray-800 transition"
                    >
                        閉じる
                    </button>
                </div>
            </div>
        </div>
    );
}