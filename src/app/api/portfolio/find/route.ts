import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
    try {
        const data = await request.json();
        
        console.log('Received request with data:', data); // デバッグログ

        const { uid } = data;

        if (!uid) {
            return NextResponse.json(
                { error: 'ユーザーIDが必要です' },
                { status: 400 }
            );
        }

        console.log('Searching for user with uid:', uid); // デバッグログ

        const account = await prisma.account.findUnique({
            where: {
                provider_providerUserId: {
                    provider: "google",
                    providerUserId: uid
                }
            },
            include: {
                user: {
                    include: {
                        portfolios: true
                    }
                }
            }
        });

        console.log('Database query result:', account); // デバッグログ

        if (!account || !account.user) {
            return NextResponse.json(
                { error: 'ユーザーが見つかりません' },
                { status: 404 }
            );
        }

        // ユーザーデータを整形
        const rawPortfolio = account.user.portfolios?.[0] ?? null;

        const safeJsonParse = <T>(value: string | null | undefined, fallback: T): T => {
            if (!value) return fallback;
            try {
                const parsed = JSON.parse(value);
                return (parsed ?? fallback) as T;
            } catch {
                return fallback;
            }
        };

        const getStringFromRecord = (record: Record<string, unknown>, key: string): string | undefined => {
            const value = record?.[key];
            return typeof value === "string" ? value : undefined;
        };

        const getBooleanFromRecord = (record: Record<string, unknown>, key: string): boolean | undefined => {
            const value = record?.[key];
            return typeof value === "boolean" ? value : undefined;
        };

        const parseStringArray = (value: string | null | undefined): string[] => {
            const fallback: string[] = [];
            const parsed = safeJsonParse<string[] | string>(value, fallback);
            if (Array.isArray(parsed)) {
                return parsed;
            }
            if (typeof parsed === "string") {
                return parsed
                    .split(",")
                    .map((item) => item.trim())
                    .filter(Boolean);
            }
            return fallback;
        };

        const experienceData = safeJsonParse<Record<string, unknown>>(rawPortfolio?.experience, {});
        const otherData = safeJsonParse<Record<string, unknown>>(rawPortfolio?.other, {});
        const publicationData = safeJsonParse<Record<string, unknown>>(rawPortfolio?.publication, {});
        const visibilitySettingsData = safeJsonParse<Record<string, unknown>>(rawPortfolio?.visibilitySettings, {});

        const normalizedPortfolio = rawPortfolio
            ? {
                id: rawPortfolio.id,
                user_id: rawPortfolio.userId,
                university: rawPortfolio.university,
                faculty: rawPortfolio.faculty,
                grade: rawPortfolio.grade,
                email: rawPortfolio.email || account.user.email,
                selfIntroduction: rawPortfolio.selfIntroduction,
                skills: parseStringArray(rawPortfolio.skillTags),
                certifications: typeof rawPortfolio.certifications === "string"
                    ? rawPortfolio.certifications
                    : "",
                internship: getStringFromRecord(experienceData, "internship"),
                extracurricular: getStringFromRecord(experienceData, "extracurricular"),
                awards: getStringFromRecord(experienceData, "awards"),
                experience: getStringFromRecord(experienceData, "summary")
                    ?? (typeof rawPortfolio.experience === "string" ? rawPortfolio.experience : undefined),
                customQuestions: getStringFromRecord(otherData, "customQuestions"),
                additionalInfo: getStringFromRecord(otherData, "additionalInfo"),
                isPublic: getBooleanFromRecord(publicationData, "isPublic") ?? false,
                autoDeleteAfterOneYear: getBooleanFromRecord(publicationData, "autoDeleteAfterOneYear") ?? false,
                visibilitySettings: visibilitySettingsData,
                rawProjects: rawPortfolio.projects,
            }
            : null;

        const userData = {
            ...account.user,
            uid,
            selfIntroduction: normalizedPortfolio?.selfIntroduction ?? null,
            portfolio: normalizedPortfolio,
        };

        console.log('Sending response:', userData); // デバッグログ

        return NextResponse.json(userData);

    } catch (error) {
        console.error('API Error:', {
            error,
            message: error instanceof Error ? error.message : 'Unknown error',
            stack: error instanceof Error ? error.stack : undefined
        });

        return NextResponse.json(
            { 
                error: 'データの取得に失敗しました',
                details: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        );
    }
}