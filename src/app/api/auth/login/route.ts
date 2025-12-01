import { NextRequest, NextResponse } from 'next/server';
// import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

// データベース接続（実際の実装では適切なDBライブラリを使用）
const mockUsers = [
  {
    id: 'user_001',
    email: 'tanaka@example.com',
    name: '田中 太郎',
    university: '東京大学 情報科学科',
    grade: '4年生',
    birth_date: '2000-01-01',
    self_introduction: 'Web開発とAI技術に興味があり、複数のプロジェクトを手がけています。'
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

    // ユーザー検索
    const user = mockUsers.find(u => u.email === email);
    if (!user) {
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
    const sessionToken = uuidv4();
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7日間有効

    return NextResponse.json({
      success: true,
      user: user,
      sessionToken,
      expiresAt: expiresAt.toISOString()
    });

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'ログイン処理中にエラーが発生しました' },
      { status: 500 }
    );
  }
} 