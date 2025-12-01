"use client";
import { Building2, LayoutDashboard, Search, Star, Mail, UserCog, LogOut, HelpCircle, Bell, Send, MoreVertical, Phone, Video, Paperclip, Smile } from "lucide-react";
import React, { useState } from "react";
import Link from "next/link";

export default function RecruiterMessagesPage() {
  const [selectedChat, setSelectedChat] = useState(1);
  const [messageText, setMessageText] = useState("");

  // ダミーデータ
  const conversations = [
    {
      id: 1,
      name: "田中 太郎",
      university: "東京大学・情報科学科",
      lastMessage: "ありがとうございます。面接の日程について確認させていただきます。",
      lastMessageTime: "14:30",
      unreadCount: 2,
      isOnline: true,
    },
    {
      id: 2,
      name: "佐藤 花子",
      university: "早稲田大学・商学部",
      lastMessage: "ポートフォリオについて質問があります。",
      lastMessageTime: "12:15",
      unreadCount: 0,
      isOnline: false,
    },
    {
      id: 3,
      name: "山田 次郎",
      university: "慶應大学・理工学部",
      lastMessage: "インターンシップの応募について詳しく教えてください。",
      lastMessageTime: "昨日",
      unreadCount: 1,
      isOnline: true,
    },
    {
      id: 4,
      name: "鈴木 美咲",
      university: "京都大学・工学部",
      lastMessage: "面接の準備を進めています。",
      lastMessageTime: "2日前",
      unreadCount: 0,
      isOnline: false,
    },
  ];

  const messages = [
    {
      id: 1,
      sender: "recruiter",
      message: "こんにちは！ポートフォリオを拝見しました。とても興味深いプロジェクトですね。",
      time: "14:00",
    },
    {
      id: 2,
      sender: "student",
      message: "ありがとうございます！どのプロジェクトが特に印象に残りましたか？",
      time: "14:05",
    },
    {
      id: 3,
      sender: "recruiter",
      message: "特に機械学習を使った画像認識プロジェクトが素晴らしいと思いました。技術的な詳細について聞かせてください。",
      time: "14:10",
    },
    {
      id: 4,
      sender: "student",
      message: "ありがとうございます。面接の日程について確認させていただきます。",
      time: "14:30",
    },
  ];

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (messageText.trim()) {
      // ダミー送信処理
      console.log("送信:", messageText);
      setMessageText("");
    }
  };

  const selectedConversation = conversations.find(conv => conv.id === selectedChat);

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 w-64 bg-white shadow-lg z-50 flex flex-col">
        <div className="flex items-center justify-center h-16 border-b border-gray-200">
          <div className="flex items-center">
            <Building2 className="w-7 h-7 text-indigo-600 mr-2" />
            <h1 className="text-xl font-bold text-gray-800">Y-folio</h1>
            <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">採用担当者</span>
          </div>
        </div>
        <nav className="mt-6 flex-1 overflow-y-auto">
          <div className="px-4 mb-4">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">R</div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-700">リクルーター名</p>
                <p className="text-xs text-gray-500">企業名</p>
              </div>
            </div>
          </div>
          <div className="px-4 mt-6 mb-4">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">メニュー</p>
          </div>
          <div className="px-4 space-y-2">
            <Link href="/recruiter/dashboard" className="sidebar-item flex items-center px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100 w-full">
              <LayoutDashboard className="w-5 h-5 mr-3" />
              <span>ダッシュボード</span>
            </Link>
            <Link href="/recruiter/search" className="sidebar-item flex items-center px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100 w-full">
              <Search className="w-5 h-5 mr-3" />
              <span>ポートフォリオ検索</span>
            </Link>
            <Link href="/recruiter/favorites" className="sidebar-item flex items-center px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100 w-full">
              <Star className="w-5 h-5 mr-3" />
              <span>お気に入り</span>
            </Link>
            <Link href="/recruiter/messages" className="sidebar-item active flex items-center px-4 py-3 rounded-lg text-white bg-indigo-600 w-full">
              <Mail className="w-5 h-5 mr-3" />
              <span>メッセージ</span>
            </Link>
          </div>
          <div className="px-4 mt-8 mb-4">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">アカウント</p>
          </div>
          <div className="px-4 space-y-2">
            <Link href="/recruiter/account-settings" className="sidebar-item flex items-center px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100 w-full">
              <UserCog className="w-5 h-5 mr-3" />
              <span>アカウント設定</span>
            </Link>
            <Link href="/recruiter/logout" className="sidebar-item flex items-center px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100 w-full">
              <LogOut className="w-5 h-5 mr-3" />
              <span>ログアウト</span>
            </Link>
          </div>
        </nav>
        <div className="p-4 border-t border-gray-200">
          <Link href="/recruiter/help" className="flex items-center text-sm text-gray-600 hover:text-indigo-600 transition w-full">
            <HelpCircle className="w-5 h-5 mr-2" />
            ヘルプ & サポート
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="ml-64 h-screen flex">
        {/* Conversations List */}
        <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800">メッセージ</h2>
            <p className="text-sm text-gray-600">学生とのやり取り</p>
          </div>
          
          <div className="flex-1 overflow-y-auto">
            {conversations.map((conversation) => (
              <div
                key={conversation.id}
                onClick={() => setSelectedChat(conversation.id)}
                className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition ${
                  selectedChat === conversation.id ? 'bg-indigo-50 border-indigo-200' : ''
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    <div className="relative">
                      <div className="w-10 h-10 bg-gray-300 rounded-full mr-3" />
                      {conversation.isOnline && (
                        <div className="absolute bottom-0 right-3 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                      )}
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800">{conversation.name}</h4>
                      <p className="text-xs text-gray-500">{conversation.university}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-gray-500">{conversation.lastMessageTime}</span>
                    {conversation.unreadCount > 0 && (
                      <div className="mt-1 w-5 h-5 bg-indigo-600 text-white text-xs rounded-full flex items-center justify-center">
                        {conversation.unreadCount}
                      </div>
                    )}
                  </div>
                </div>
                <p className="text-sm text-gray-600 truncate">{conversation.lastMessage}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col">
          {selectedConversation ? (
            <>
              {/* Chat Header */}
              <div className="bg-white border-b border-gray-200 p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="relative">
                      <div className="w-10 h-10 bg-gray-300 rounded-full mr-3" />
                      {selectedConversation.isOnline && (
                        <div className="absolute bottom-0 right-3 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                      )}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800">{selectedConversation.name}</h3>
                      <p className="text-sm text-gray-500">{selectedConversation.university}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button className="p-2 text-gray-400 hover:text-gray-600 transition">
                      <Phone className="w-5 h-5" />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-gray-600 transition">
                      <Video className="w-5 h-5" />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-gray-600 transition">
                      <MoreVertical className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.sender === 'recruiter' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                          message.sender === 'recruiter'
                            ? 'bg-indigo-600 text-white'
                            : 'bg-white text-gray-800 border border-gray-200'
                        }`}
                      >
                        <p className="text-sm">{message.message}</p>
                        <p className={`text-xs mt-1 ${
                          message.sender === 'recruiter' ? 'text-indigo-200' : 'text-gray-500'
                        }`}>
                          {message.time}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Message Input */}
              <div className="bg-white border-t border-gray-200 p-4">
                <form onSubmit={handleSendMessage} className="flex items-center space-x-2">
                  <button type="button" className="p-2 text-gray-400 hover:text-gray-600 transition">
                    <Paperclip className="w-5 h-5" />
                  </button>
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      value={messageText}
                      onChange={(e) => setMessageText(e.target.value)}
                      placeholder="メッセージを入力..."
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                      <Smile className="w-5 h-5" />
                    </button>
                  </div>
                  <button
                    type="submit"
                    className="p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
                    disabled={!messageText.trim()}
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </form>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <Mail className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-600 mb-2">メッセージを選択してください</h3>
                <p className="text-gray-500">左側のリストから会話を選択してメッセージを開始できます</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 