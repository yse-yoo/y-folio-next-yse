"use client";
import { Building2, Mail, Lock, Eye, EyeOff } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function RecruiterLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/auth/recruiter/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // ログイン成功
        localStorage.setItem("recruiterSessionToken", data.sessionToken);
        localStorage.setItem("recruiter", JSON.stringify(data.recruiter));
        router.push("/recruiter/dashboard");
      } else {
        setError(data.error || "ログインに失敗しました");
      }
    } catch (error) {
      setError("ネットワークエラーが発生しました");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
        <div className="flex flex-col items-center mb-8">
          <Building2 className="w-10 h-10 text-indigo-600 mb-2" />
          <h1 className="text-2xl font-bold text-gray-800 mb-1">Y-folio</h1>
          <span className="text-sm text-blue-700 bg-blue-100 px-2 py-1 rounded-full">採用担当者専用</span>
        </div>
        <h2 className="text-xl font-semibold text-gray-700 mb-6 text-center">ログイン</h2>
        
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-600 mb-1" htmlFor="email">メールアドレス</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-200"
                placeholder="example@company.co.jp"
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-gray-600 mb-1" htmlFor="password">パスワード</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-12 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-200"
                placeholder="パスワード"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-indigo-600 text-white py-2 rounded-lg font-semibold mt-2 hover:bg-indigo-700 transition disabled:bg-indigo-400 disabled:cursor-not-allowed"
          >
            {isLoading ? "ログイン中..." : "ログイン"}
          </button>
        </form>
        <div className="flex justify-between mt-4 text-sm">
          <a href="#" className="text-indigo-600 hover:underline">パスワードをお忘れですか？</a>
          <a href="/recruiter/signup" className="text-indigo-600 hover:underline">新規登録はこちら</a>
        </div>
        <div className="my-6 flex items-center">
          <div className="flex-grow h-px bg-gray-200"></div>
          <span className="mx-3 text-gray-400">または</span>
          <div className="flex-grow h-px bg-gray-200"></div>
        </div>
        <div className="space-y-3">
          <button className="w-full flex items-center justify-center border border-gray-300 rounded-lg py-2 hover:bg-gray-50 transition">
            <FcGoogle className="mr-2 w-5 h-5" />Googleでログイン
          </button>
          <button className="w-full flex items-center justify-center border border-gray-300 rounded-lg py-2 hover:bg-gray-50 transition">
            <FaGithub className="mr-2 w-5 h-5" />GitHubでログイン
          </button>
        </div>
        <div className="mt-6 text-center">
          <a href="/login" className="text-sm text-gray-500 hover:text-indigo-600">
            学生の方はこちら
          </a>
        </div>
      </div>
    </div>
  );
} 