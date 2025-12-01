import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import type { ReminderChannel, ReminderStatus, ReminderType } from "@/types/AiReview";

const REMINDER_TYPES: ReminderType[] = [
  "follow_up_review",
  "interview_preparation",
  "interview_followup",
  "custom",
];

const REMINDER_STATUSES: ReminderStatus[] = ["pending", "sent", "dismissed", "snoozed"];
const REMINDER_CHANNELS: ReminderChannel[] = ["in-app", "email", "push"];

const isReminderType = (value: unknown): value is ReminderType =>
  typeof value === "string" && REMINDER_TYPES.includes(value as ReminderType);

const isReminderStatus = (value: unknown): value is ReminderStatus =>
  typeof value === "string" && REMINDER_STATUSES.includes(value as ReminderStatus);

const isReminderChannel = (value: unknown): value is ReminderChannel =>
  typeof value === "string" && REMINDER_CHANNELS.includes(value as ReminderChannel);

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId")?.trim();
    const status = searchParams.get("status")?.trim() ?? "pending";
    const limitParam = searchParams.get("limit");

    if (!userId) {
      return NextResponse.json({ error: "userId is required" }, { status: 400 });
    }

    if (status && !isReminderStatus(status)) {
      return NextResponse.json({ error: "status is invalid" }, { status: 400 });
    }

    const limit = Math.min(Math.max(Number.parseInt(limitParam ?? "", 10) || 10, 1), 30);

    const where: Record<string, unknown> = {
      userId,
      status: status as ReminderStatus,
    };

    if (status === "pending") {
      where.scheduledAt = { gte: new Date(Date.now() - 60 * 60 * 1000) };
    }

    const reminders = await prisma.reviewReminder.findMany({
      where: where as Parameters<typeof prisma.reviewReminder.findMany>[0]["where"],
      orderBy: { scheduledAt: "asc" },
      take: limit,
    });

    return NextResponse.json({
      reminders: reminders.map(item => ({
        id: item.id,
        type: item.type as ReminderType,
        status: item.status as ReminderStatus,
        channel: (item.channel as ReminderChannel) ?? "in-app",
        scheduledAt: item.scheduledAt.toISOString(),
        payload: item.payload as Record<string, unknown> | null,
        createdAt: item.createdAt.toISOString(),
        updatedAt: item.updatedAt.toISOString(),
      })),
    });
  } catch (error) {
    console.error("Failed to fetch review reminders", error);
    return NextResponse.json({ error: "リマインダーの取得に失敗しました" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json() as {
      userId?: string;
      type?: ReminderType;
      scheduledAt?: string;
      channel?: ReminderChannel;
      payload?: Record<string, unknown> | null;
    };

    if (!body.userId || body.userId.trim().length === 0) {
      return NextResponse.json({ error: "userId is required" }, { status: 400 });
    }

    if (!isReminderType(body.type)) {
      return NextResponse.json({ error: "type is invalid" }, { status: 400 });
    }

    if (!body.scheduledAt) {
      return NextResponse.json({ error: "scheduledAt is required" }, { status: 400 });
    }

    const scheduledAt = new Date(body.scheduledAt);
    if (Number.isNaN(scheduledAt.getTime())) {
      return NextResponse.json({ error: "scheduledAt must be a valid ISO date" }, { status: 400 });
    }

    const channel = isReminderChannel(body.channel) ? body.channel : "in-app";

    const reminder = await prisma.reviewReminder.create({
      data: {
        userId: body.userId.trim(),
        type: body.type,
        channel,
        scheduledAt,
        payload: body.payload ?? null,
      },
    });

    return NextResponse.json({
      reminder: {
        id: reminder.id,
        type: reminder.type as ReminderType,
        status: reminder.status as ReminderStatus,
        channel: reminder.channel as ReminderChannel,
        scheduledAt: reminder.scheduledAt.toISOString(),
        payload: reminder.payload as Record<string, unknown> | null,
        createdAt: reminder.createdAt.toISOString(),
        updatedAt: reminder.updatedAt.toISOString(),
      },
    }, { status: 201 });
  } catch (error) {
    console.error("Failed to create review reminder", error);
    return NextResponse.json({ error: "リマインダーの作成に失敗しました" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const reminderId = searchParams.get("id")?.trim();
    if (!reminderId) {
      return NextResponse.json({ error: "id is required" }, { status: 400 });
    }

    const body = await request.json() as {
      status?: ReminderStatus;
      scheduledAt?: string;
    };

    const data: { status?: ReminderStatus; scheduledAt?: Date } = {};

    if (body.status) {
      if (!isReminderStatus(body.status)) {
        return NextResponse.json({ error: "status is invalid" }, { status: 400 });
      }
      data.status = body.status;
    }

    if (body.scheduledAt) {
      const scheduledAt = new Date(body.scheduledAt);
      if (Number.isNaN(scheduledAt.getTime())) {
        return NextResponse.json({ error: "scheduledAt must be a valid ISO date" }, { status: 400 });
      }
      data.scheduledAt = scheduledAt;
    }

    if (Object.keys(data).length === 0) {
      return NextResponse.json({ error: "No changes were provided" }, { status: 400 });
    }

    const reminder = await prisma.reviewReminder.update({
      where: { id: reminderId },
      data,
    });

    return NextResponse.json({
      reminder: {
        id: reminder.id,
        type: reminder.type as ReminderType,
        status: reminder.status as ReminderStatus,
        channel: reminder.channel as ReminderChannel,
        scheduledAt: reminder.scheduledAt.toISOString(),
        payload: reminder.payload as Record<string, unknown> | null,
        createdAt: reminder.createdAt.toISOString(),
        updatedAt: reminder.updatedAt.toISOString(),
      },
    });
  } catch (error) {
    console.error("Failed to update review reminder", error);
    return NextResponse.json({ error: "リマインダーの更新に失敗しました" }, { status: 500 });
  }
}
