import { NextRequest, NextResponse } from 'next/server';

// データベース接続（実際の実装では適切なDBライブラリを使用）
let mockRecruiters = [
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
    const { companyName, name, email, password, position, department } = await request.json();

    // バリデーション
    if (!companyName || !name || !email || !password) {
      return NextResponse.json(
        { error: '必須項目を入力してください' },
        { status: 400 }
      );
    }

    // メールアドレスの重複チェック
    const existingRecruiter = mockRecruiters.find(r => r.email === email);
    if (existingRecruiter) {
      return NextResponse.json(
        { error: 'このメールアドレスは既に登録されています' },
        { status: 409 }
      );
    }

    // パスワード強度チェック
    if (password.length < 8) {
      return NextResponse.json(
        { error: 'パスワードは8文字以上で入力してください' },
        { status: 400 }
      );
    }

    // 新しい採用担当者作成
    const newRecruiter = {
      id: `recruiter_${Date.now()}`,
      company_name: companyName,
      name,
      email,
      password_hash: `$2y$10$hashed_${password}`, // 実際の実装ではbcrypt.hashSyncを使用
      position: position || '',
      department: department || ''
    };

    // 採用担当者を保存（実際の実装ではデータベースに保存）
    mockRecruiters.push(newRecruiter);

    // レスポンス用の採用担当者情報（パスワードは除外）
    const { password_hash, ...recruiterInfo } = newRecruiter;

    return NextResponse.json({
      success: true,
      recruiter: recruiterInfo,
      message: 'アカウントが正常に作成されました'
    }, { status: 201 });

  } catch (error) {
    console.error('Recruiter signup error:', error);
    return NextResponse.json(
      { error: '新規登録処理中にエラーが発生しました' },
      { status: 500 }
    );
  }
} 