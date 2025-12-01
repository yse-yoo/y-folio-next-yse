import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
  // JSONデータを受信
  const data = await request.json()
  // console.log('API受信データ:', data)

  const resolvedUserId = data.user_id ?? data.userId ?? data.user?.id ?? data.user?.uid

  if (!resolvedUserId) {
    return NextResponse.json(
      { success: false, error: 'user_id is required' },
      { status: 400 }
    )
  }

  const toNullableString = (value: unknown) => {
    if (typeof value !== 'string') return value == null ? null : String(value)
    const trimmed = value.trim()
    return trimmed.length > 0 ? trimmed : null
  }

  const toStringOrEmpty = (value: unknown) => {
    if (typeof value === 'string') return value
    if (value == null) return ''
    return String(value)
  }

  const userName = toNullableString(data.user?.name ?? data.name)
  const userEmail = toNullableString(data.user?.email ?? data.email)
  const userPhone = toNullableString(data.user?.phone ?? data.phone)
  const userAddress = toNullableString(data.user?.address ?? data.address)

  console.log("portfolio: ", data.portfolio)

  const portfolioSource = data.portfolio ?? {
    id: data.id,
    university: data.university,
    faculty: data.faculty ?? data.department,
    grade: data.grade,
    email: data.email,
    selfIntroduction: data.selfIntroduction,
    skillTags: data.skillTags,
    certifications: data.certifications,
    projects: data.projects,
    experience: data.experience,
    other: data.other,
    publication: data.publication,
    visibilitySettings: data.visibilitySettings,
  }

  const skillTags = Array.isArray(portfolioSource.skillTags)
    ? portfolioSource.skillTags
    : Array.isArray(data.skillTags)
      ? data.skillTags
      : []

  const projects = Array.isArray(portfolioSource.projects)
    ? portfolioSource.projects
    : Array.isArray(data.projects)
      ? data.projects
      : []

  const parseObject = (value: unknown, fallbackFromString?: (raw: string) => Record<string, unknown>) => {
    if (typeof value === 'string') {
      const trimmed = value.trim()
      if (!trimmed) {
        return {}
      }
      try {
        const parsed = JSON.parse(trimmed)
        if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
          return { ...(parsed as Record<string, unknown>) }
        }
      } catch (error) {
        if (fallbackFromString) {
          return fallbackFromString(trimmed)
        }
        console.warn('Failed to parse JSON object field', { value: trimmed, error })
      }
      if (fallbackFromString) {
        return fallbackFromString(trimmed)
      }
      return {}
    }

    if (value && typeof value === 'object' && !Array.isArray(value)) {
      return { ...(value as Record<string, unknown>) }
    }

    return {}
  }

  const experienceInput = portfolioSource.experience ?? data.experience
  const experienceObject = parseObject(experienceInput, (raw) => ({ summary: raw }))
  const summaryString = toNullableString(experienceObject.summary)
  if (summaryString !== null) {
    experienceObject.summary = summaryString
  } else if ('summary' in experienceObject) {
    delete experienceObject.summary
  }
  const internshipString = toNullableString(
    portfolioSource.internship ?? data.internship ?? experienceObject.internship ?? undefined
  )
  if (internshipString !== null) {
    experienceObject.internship = internshipString
  } else if ('internship' in experienceObject) {
    delete experienceObject.internship
  }
  const extracurricularString = toNullableString(
    portfolioSource.extracurricular ?? data.extracurricular ?? experienceObject.extracurricular ?? undefined
  )
  if (extracurricularString !== null) {
    experienceObject.extracurricular = extracurricularString
  } else if ('extracurricular' in experienceObject) {
    delete experienceObject.extracurricular
  }
  const awardsString = toNullableString(
    portfolioSource.awards ?? data.awards ?? experienceObject.awards ?? undefined
  )
  if (awardsString !== null) {
    experienceObject.awards = awardsString
  } else if ('awards' in experienceObject) {
    delete experienceObject.awards
  }

  const otherInput = portfolioSource.other ?? data.other
  const otherObject = parseObject(otherInput)
  const customQuestionsString = toNullableString(
    portfolioSource.customQuestions ?? data.customQuestions ?? otherObject.customQuestions ?? undefined
  )
  if (customQuestionsString !== null) {
    otherObject.customQuestions = customQuestionsString
  } else if ('customQuestions' in otherObject) {
    delete otherObject.customQuestions
  }
  const additionalInfoString = toNullableString(
    portfolioSource.additionalInfo ?? data.additionalInfo ?? otherObject.additionalInfo ?? undefined
  )
  if (additionalInfoString !== null) {
    otherObject.additionalInfo = additionalInfoString
  } else if ('additionalInfo' in otherObject) {
    delete otherObject.additionalInfo
  }

  const publication = parseObject(portfolioSource.publication ?? data.publication)
  const visibilitySettings = parseObject(
    portfolioSource.visibilitySettings ?? data.visibilitySettings
  )

  try {
    let targetUserId = resolvedUserId

    const existingUserById = await prisma.user.findUnique({
      where: { id: targetUserId },
    })

    if (!existingUserById && userEmail) {
      const existingUserByEmail = await prisma.user.findUnique({
        where: { email: userEmail },
      })

      if (existingUserByEmail) {
        targetUserId = existingUserByEmail.id
      }
    }

    const userRecord = await prisma.user.upsert({
      where: { id: targetUserId },
      update: {
        email: userEmail ?? undefined,
        name: userName ?? undefined,
        phone: userPhone ?? undefined,
        address: userAddress ?? undefined,
      },
      create: {
        id: targetUserId,
        email: userEmail,
        name: userName,
        phone: "",
        address: "",
      },
    })

    const portfolioData = {
      userId: userRecord.id,
      university: portfolioSource.university ?? '',
      faculty: portfolioSource.faculty ?? '',
      grade: portfolioSource.grade ?? '',
      email: toStringOrEmpty(portfolioSource.email ?? userEmail),
      selfIntroduction: toStringOrEmpty(portfolioSource.selfIntroduction),
      skillTags: JSON.stringify(skillTags),
      certifications: toStringOrEmpty(portfolioSource.certifications),
      projects: JSON.stringify(projects),
  experience: JSON.stringify(experienceObject),
  other: JSON.stringify(otherObject),
      publication: JSON.stringify(publication),
      visibilitySettings: JSON.stringify(visibilitySettings),
    }

    const portfolioId: string | undefined = portfolioSource.id ?? data.id ?? undefined

    console.log(data.portfolio)
    // SQL: UPDATE portfolios SET ... WHERE id = portfolioId
    // SQL: INSERT INTO portfolios (...) VALUES (...)
    const portfolio = portfolioId
      ? await prisma.portfolio.upsert({
        where: { id: portfolioId },
        update: portfolioData,
        create: {
          id: portfolioId,
          ...portfolioData,
        },
      })
      : await prisma.portfolio.create({
        data: portfolioData,
      })

    return NextResponse.json({ success: true, portfolio })
  } catch (error) {
    console.error('保存エラー:', error)
    const message = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}
