import { User } from "@/types/User";

export const testUser: User = {
    id: '00000000-0000-0000-0000-000000000001',
    name: '横浜 太郎',
    university: '早稲田大学',
    department: '情報科学科',
    grade: '3',
    email: 'testuser@example.com',
    password_hash: '$2b$10$exampleexampleexampleexampleexamp',
    phone: '090-1234-5678',
    address: '東京都文京区本郷7-3-1',
    birthDate: new Date('2002-05-15'),
    selfIntroduction: 'ポートフォリオ用のテストユーザーです。',
    is_active: true,
    email_verified: true,
    verification_token: null,
    reset_token: null,
    reset_token_expires: null,
    certifications: '応用情報技術者',
    awards: '学内ハッカソン優勝 (2023) AtCoder Grand Contest 100位 (2022)',
    created_at: new Date('2025-01-01T00:00:00Z'),
    updated_at: new Date('2025-01-01T00:00:00Z'),
}
