"use client";
import { Building2, Mail, Lock, Eye, EyeOff, User, Building } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function RecruiterSignupPage() {
  const [formData, setFormData] = useState({
    companyName: "",
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    position: "",
    department: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // パスワード確認
    if (formData.password !== formData.confirmPassword) {
      setError("パスワードが一致しません");
      setIsLoading(false);
      return;
    }

    // パスワード強度チェック
    if (formData.password.length < 8) {
      setError("パスワードは8文字以上で入力してください");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/auth/recruiter/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          companyName: formData.companyName,
          name: formData.name,
          email: formData.email,
          password: formData.password,
          position: formData.position,
          department: formData.department
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // 新規登録成功
        alert("アカウントが正常に作成されました。ログインページに移動します。");
        router.push("/recruiter/login");
      } else {
        setError(data.error || "新規登録に失敗しました");
      }
    } catch (error) {
      setError("ネットワークエラーが発生しました");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen flex items-center justify-center py-8">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
        <div className="flex flex-col items-center mb-8">
          <Building2 className="w-10 h-10 text-indigo-600 mb-2" />
          <h1 className="text-2xl font-bold text-gray-800 mb-1">Y-folio</h1>
          <span className="text-sm text-blue-700 bg-blue-100 px-2 py-1 rounded-full">採用担当者専用</span>
        </div>
        <h2 className="text-xl font-semibold text-gray-700 mb-6 text-center">新規登録</h2>
        
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-600 mb-1" htmlFor="company">会社名 *</label>
            <div className="relative">
              <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                id="company"
                name="companyName"
                type="text"
                value={formData.companyName}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-200"
                placeholder="株式会社サンプル"
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-gray-600 mb-1" htmlFor="name">担当者名 *</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-200"
                placeholder="山田 太郎"
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-gray-600 mb-1" htmlFor="email">メールアドレス *</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-200"
                placeholder="example@company.co.jp"
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-gray-600 mb-1" htmlFor="password">パスワード *</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={handleChange}
                className="w-full pl-10 pr-12 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-200"
                placeholder="8文字以上で入力"
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
          <div>
            <label className="block text-gray-600 mb-1" htmlFor="confirmPassword">パスワード確認 *</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full pl-10 pr-12 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-200"
                placeholder="パスワードを再入力"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>
          <div>
            <label className="block text-gray-600 mb-1" htmlFor="position">役職</label>
            <input
              id="position"
              name="position"
              type="text"
              value={formData.position}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-200"
              placeholder="採用担当"
            />
          </div>
          <div>
            <label className="block text-gray-600 mb-1" htmlFor="department">部署</label>
            <input
              id="department"
              name="department"
              type="text"
              value={formData.department}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-200"
              placeholder="人事部"
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-indigo-600 text-white py-2 rounded-lg font-semibold mt-2 hover:bg-indigo-700 transition disabled:bg-indigo-400 disabled:cursor-not-allowed"
          >
            {isLoading ? "登録中..." : "新規登録"}
          </button>
        </form>
        <div className="flex justify-end mt-4 text-sm">
          <a href="/recruiter/login" className="text-indigo-600 hover:underline">ログインはこちら</a>
        </div>
        <div className="my-6 flex items-center">
          <div className="flex-grow h-px bg-gray-200"></div>
          <span className="mx-3 text-gray-400">または</span>
          <div className="flex-grow h-px bg-gray-200"></div>
        </div>
        <div className="space-y-3">
          <button className="w-full flex items-center justify-center border border-gray-300 rounded-lg py-2 hover:bg-gray-50 transition">
            <FcGoogle className="mr-2 w-5 h-5" />Googleで登録
          </button>
          <button className="w-full flex items-center justify-center border border-gray-300 rounded-lg py-2 hover:bg-gray-50 transition">
            <FaGithub className="mr-2 w-5 h-5" />GitHubで登録
          </button>
        </div>
        <div className="mt-6 text-center">
          <a href="/signup" className="text-sm text-gray-500 hover:text-indigo-600">
            学生の方はこちら
          </a>
        </div>
      </div>
    </div>
  );
} 