import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

interface PortfolioResponse {
  user: {
    id: string;
    name: string | null;
    email: string | null;
    phone: string | null;
    address: string | null;
    university: string | null;
    faculty: string | null;
    grade: string | null;
    selfIntroduction: string | null;
  } | null;
  portfolio: {
    id: string | null;
    name: string;
    university: string;
    faculty: string;
    grade: string;
    email: string;
    phone: string;
    address: string;
    selfIntroduction: string;
    skillTags: string[];
    certifications: string[];
    projects: Array<{
      name: string;
      description?: string;
      url?: string;
      role?: string;
      period?: string;
      technologies?: string[];
    }>;
    experience: {
      internship?: string;
      extracurricular?: string;
      awards?: string;
      [key: string]: unknown;
    };
    other: {
      customQuestions?: string;
      additionalInfo?: string;
      [key: string]: unknown;
    };
    publication: Record<string, unknown>;
    visibilitySettings: Record<string, unknown>;
  } | null;
}

const parseJson = <T>(value: unknown, fallback: T): T => {
  if (Array.isArray(value) || (value && typeof value === 'object')) {
    return value as T;
  }

  if (typeof value !== 'string') {
    return fallback;
  }

  try {
    const parsed = JSON.parse(value);
    if (Array.isArray(parsed) || (parsed && typeof parsed === 'object')) {
      return parsed as T;
    }
  } catch (error) {
    console.warn('Failed to parse JSON field', { value, error });
  }

  return fallback;
};

const parseStringArray = (value: unknown): string[] => {
  if (!value) return [];
  if (Array.isArray(value)) return value.map((item) => String(item)).filter(Boolean);

  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value);
      if (Array.isArray(parsed)) {
        return parsed.map((item) => String(item)).filter(Boolean);
      }
    } catch {
      // treat as delimited string
    }

    return value
      .split(/[\n,]/)
      .map((item) => item.trim())
      .filter((item) => item.length > 0);
  }

  return [];
};

const parseProjects = (value: unknown) => {
  const projects = parseJson<Array<Record<string, unknown>>>(value, []);
  return projects.map((project) => ({
    name: String(project?.name ?? project?.title ?? 'プロジェクト'),
    description:
      project?.description !== undefined
        ? String(project.description)
        : project?.summary !== undefined
          ? String(project.summary)
          : undefined,
    url: project?.url ? String(project.url) : undefined,
    role: project?.role ? String(project.role) : undefined,
    period: project?.period ? String(project.period) : undefined,
    technologies: Array.isArray(project?.technologies)
      ? (project?.technologies as unknown[]).map((tech) => String(tech)).filter(Boolean)
      : undefined,
  }));
};

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId')?.trim();

    if (!userId) {
      return NextResponse.json(
        { error: 'userId query parameter is required' },
        { status: 400 }
      );
    }

    let resolvedUser = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        portfolios: {
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
        accounts: true,
      },
    });

    if (!resolvedUser) {
      const account = await prisma.account.findFirst({ where: { providerUserId: userId } });

      if (account) {
        resolvedUser = await prisma.user.findUnique({
          where: { id: account.userId },
          include: {
            portfolios: {
              orderBy: { createdAt: 'desc' },
              take: 1,
            },
            accounts: true,
          },
        });
      }
    }

    if (!resolvedUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

  const [portfolio] = resolvedUser.portfolios ?? [];

    const response: PortfolioResponse = {
      user: {
        id: resolvedUser.id,
        name: resolvedUser.name,
        email: resolvedUser.email,
  phone: portfolio?.phone ?? null,
  address: portfolio?.address ?? null,
        university: portfolio?.university ?? null,
        faculty: portfolio?.faculty ?? null,
        grade: portfolio?.grade ?? null,
        selfIntroduction: portfolio?.selfIntroduction ?? null,
      },
      portfolio: portfolio
        ? {
            id: portfolio.id,
            name: portfolio.name,
            university: portfolio.university,
            faculty: portfolio.faculty,
            grade: portfolio.grade,
            email: portfolio.email,
            phone: portfolio.phone,
            address: portfolio.address,
            selfIntroduction: portfolio.selfIntroduction,
            skillTags: parseStringArray(portfolio.skillTags),
            certifications: parseStringArray(portfolio.certifications),
            projects: parseProjects(portfolio.projects),
            experience: parseJson(portfolio.experience, {}),
            other: parseJson(portfolio.other, {}),
            publication: parseJson(portfolio.publication, {}),
            visibilitySettings: parseJson(portfolio.visibilitySettings, {}),
          }
        : null,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Failed to load portfolio data', error);
    return NextResponse.json(
      { error: 'Failed to load portfolio data' },
      { status: 500 }
    );
  }
}
