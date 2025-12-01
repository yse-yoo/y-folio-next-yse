import { NextRequest, NextResponse } from 'next/server';

// データベース接続（実際の実装では適切なDBライブラリを使用）
const mockRecruiters = [
  {
    id: 'recruiter_001',
    company_name: '株式会社サンプル',
    name: '山田 花子',
    email: 'yamada@sample.co.jp',
    password_hash: '$2y$10$example_hash',
    position: '採用担当',
    department: '人事部'
  }
];

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    // バリデーション
    if (!email || !password) {
      return NextResponse.json(
        { error: 'メールアドレスとパスワードを入力してください' },
        { status: 400 }
      );
    }

    // 採用担当者検索
    const recruiter = mockRecruiters.find(r => r.email === email);
    if (!recruiter) {
      return NextResponse.json(
        { error: 'メールアドレスまたはパスワードが正しくありません' },
        { status: 401 }
      );
    }

    // パスワード検証（実際の実装ではbcrypt.compareを使用）
    const isValidPassword = password === 'password123'; // テスト用
    if (!isValidPassword) {
      return NextResponse.json(
        { error: 'メールアドレスまたはパスワードが正しくありません' },
        { status: 401 }
      );
    }

    // セッショントークン生成
    const sessionToken = `recruiter_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7日間有効

    // レスポンス用の採用担当者情報（パスワードは除外）
    const { password_hash, ...recruiterInfo } = recruiter;

    return NextResponse.json({
      success: true,
      recruiter: recruiterInfo,
      sessionToken,
      expiresAt: expiresAt.toISOString()
    });

  } catch (error) {
    console.error('Recruiter login error:', error);
    return NextResponse.json(
      { error: 'ログイン処理中にエラーが発生しました' },
      { status: 500 }
    );
  }
} 