// app/api/auth/signup/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

// データベース接続（実際の実装では適切なDBライブラリを使用）
let mockUsers = [
  {
    id: 'user_001',
    email: 'tanaka@example.com',
    password_hash: '$2y$10$example_hash',
    name: '田中 太郎',
    university: '東京大学 情報科学科',
    grade: '4年生',
    birth_date: '2000-01-01',
    self_introduction: 'Web開発とAI技術に興味があり、複数のプロジェクトを手がけています。'
  }
];

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      email,
      password,
      name,
      university,
      grade,
      birthDate,
      selfIntroduction,
    } = body;

    // バリデーション（最低限）
    if (!email || !password || !name) {
      return NextResponse.json(
        { error: "必須項目が不足しています" },
        { status: 400 }
      );
    }

    // 重複チェック
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json(
        { error: "このメールアドレスは既に登録されています" },
        { status: 400 }
      );
    }

    // パスワードハッシュ化
    const passwordHash = await bcrypt.hash(password, 10);
    // DB 保存
    await prisma.user.create({
      data: {
        email,
        passwordHash,
        name,
        university,
        grade,
        birthDate: new Date(birthDate),
        selfIntroduction,
      },
    });

    return NextResponse.json({ message: "登録成功" }, { status: 201 });
  } catch (e: any) {
    console.error(e);
    return NextResponse.json(
      { error: "サーバーエラーが発生しました" },
      { status: 500 }
    );
  }
}
