'use client';

import { useCallback, useEffect, useMemo, useState } from "react";
import type {
  ReminderChannel,
  ReminderType,
  ResumeReviewLogEntry,
  ResumeReviewTrendPoint,
  ReviewReminderEntry,
} from "@/types/AiReview";

interface ReviewInsightsCardProps {
  userId: string;
}

interface LogsResponse {
  entries: ResumeReviewLogEntry[];
  trend: ResumeReviewTrendPoint[];
}

interface RemindersResponse {
  reminders: ReviewReminderEntry[];
}

const formatDateTime = (iso: string) => {
  try {
    const date = new Date(iso);
    return `${date.getFullYear()}/${`${date.getMonth() + 1}`.padStart(2, "0")}/${`${date.getDate()}`.padStart(2, "0")} ${`${date.getHours()}`.padStart(2, "0")}:${`${date.getMinutes()}`.padStart(2, "0")}`;
  } catch {
    return iso;
  }
};

const formatDate = (iso: string) => {
  try {
    const date = new Date(iso);
    return `${date.getFullYear()}/${`${date.getMonth() + 1}`.padStart(2, "0")}/${`${date.getDate()}`.padStart(2, "0")}`;
  } catch {
    return iso;
  }
};

const toneLabelMap: Record<string, string> = {
  keigo: "丁寧語",
  futsukei: "常体",
  business: "ビジネス",
  casual: "カジュアル",
};

const languageLabelMap: Record<string, string> = {
  ja: "日本語",
  en: "英語",
};

export default function ReviewInsightsCard({ userId }: ReviewInsightsCardProps) {
  const [logs, setLogs] = useState<ResumeReviewLogEntry[]>([]);
  const [trend, setTrend] = useState<ResumeReviewTrendPoint[]>([]);
  const [reminders, setReminders] = useState<ReviewReminderEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [reminderLoading, setReminderLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reminderError, setReminderError] = useState<string | null>(null);
  const [actionMessage, setActionMessage] = useState<string | null>(null);
  const [scheduleType, setScheduleType] = useState<ReminderType>("follow_up_review");
  const [scheduleChannel, setScheduleChannel] = useState<ReminderChannel>("in-app");
  const [scheduleDate, setScheduleDate] = useState("");
  const [scheduleBusy, setScheduleBusy] = useState(false);

  const loadLogs = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/ai/resume-review/logs?userId=${encodeURIComponent(userId)}&limit=10`, {
        cache: "no-store",
      });
      if (!response.ok) {
        const body = await response.json().catch(() => ({}));
        throw new Error(body.error || "レビュー履歴の取得に失敗しました");
      }
      const data = (await response.json()) as LogsResponse;
      setLogs(data.entries ?? []);
      setTrend(data.trend ?? []);
    } catch (err) {
      console.error("Failed to load review logs", err);
      setError(err instanceof Error ? err.message : "レビュー履歴の取得に失敗しました");
    } finally {
      setLoading(false);
    }
  }, [userId]);

  const loadReminders = useCallback(async () => {
    if (!userId) return;
    setReminderLoading(true);
    setReminderError(null);
    try {
      const response = await fetch(`/api/ai/resume-review/reminders?userId=${encodeURIComponent(userId)}&status=pending&limit=10`, {
        cache: "no-store",
      });
      if (!response.ok) {
        const body = await response.json().catch(() => ({}));
        throw new Error(body.error || "リマインダーの取得に失敗しました");
      }
      const data = (await response.json()) as RemindersResponse;
      setReminders(data.reminders ?? []);
    } catch (err) {
      console.error("Failed to load review reminders", err);
      setReminderError(err instanceof Error ? err.message : "リマインダーの取得に失敗しました");
    } finally {
      setReminderLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    void loadLogs();
    void loadReminders();
  }, [loadLogs, loadReminders]);

  const handleCompleteReminder = useCallback(async (reminderId: string) => {
    try {
      setActionMessage(null);
      const response = await fetch(`/api/ai/resume-review/reminders?id=${encodeURIComponent(reminderId)}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "sent" }),
      });
      if (!response.ok) {
        const body = await response.json().catch(() => ({}));
        throw new Error(body.error || "リマインダーの更新に失敗しました");
      }
      setReminders(prev => prev.filter(item => item.id !== reminderId));
      setActionMessage("リマインダーを完了にしました");
    } catch (err) {
      console.error("Failed to update reminder", err);
      setActionMessage(err instanceof Error ? err.message : "リマインダーの更新に失敗しました");
    }
  }, []);

  const handleSnoozeReminder = useCallback(async (reminderId: string) => {
    try {
      setActionMessage(null);
      const newDate = new Date();
      newDate.setDate(newDate.getDate() + 2);
      const response = await fetch(`/api/ai/resume-review/reminders?id=${encodeURIComponent(reminderId)}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "snoozed", scheduledAt: newDate.toISOString() }),
      });
      if (!response.ok) {
        const body = await response.json().catch(() => ({}));
        throw new Error(body.error || "リマインダーのスヌーズに失敗しました");
      }
      setReminders(prev => prev.filter(item => item.id !== reminderId));
      setActionMessage("リマインダーを2日後にスヌーズしました");
    } catch (err) {
      console.error("Failed to snooze reminder", err);
      setActionMessage(err instanceof Error ? err.message : "リマインダーの更新に失敗しました");
    }
  }, []);

  const handleScheduleReminder = useCallback(async () => {
    if (!userId) return;
    if (!scheduleDate) {
      setActionMessage("日時を入力してください");
      return;
    }
    try {
      setScheduleBusy(true);
      setActionMessage(null);
      const scheduledAt = new Date(scheduleDate);
      if (Number.isNaN(scheduledAt.getTime())) {
        throw new Error("日時の形式が正しくありません");
      }
      const response = await fetch("/api/ai/resume-review/reminders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          type: scheduleType,
          channel: scheduleChannel,
          scheduledAt: scheduledAt.toISOString(),
          payload: scheduleType === "interview_preparation" || scheduleType === "interview_followup"
            ? { note: "interview", scheduledAt: scheduledAt.toISOString() }
            : null,
        }),
      });
      if (!response.ok) {
        const body = await response.json().catch(() => ({}));
        throw new Error(body.error || "リマインダーの登録に失敗しました");
      }
      setScheduleDate("");
      setScheduleType("follow_up_review");
      await loadReminders();
      setActionMessage("リマインダーを登録しました");
    } catch (err) {
      console.error("Failed to schedule reminder", err);
      setActionMessage(err instanceof Error ? err.message : "リマインダーの登録に失敗しました");
    } finally {
      setScheduleBusy(false);
    }
  }, [userId, scheduleChannel, scheduleDate, scheduleType, loadReminders]);

  const latestAverage = useMemo(() => {
    if (logs.length === 0) return null;
    const scores = logs
      .map(log => (typeof log.overallScore === "number" ? log.overallScore : null))
      .filter((value): value is number => value !== null);
    if (scores.length === 0) return null;
    const total = scores.reduce((sum, value) => sum + value, 0);
    return Math.round((total / scores.length) * 10) / 10;
  }, [logs]);

  return (
    <section className="grid gap-6 md:grid-cols-2">
      <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <header className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-semibold text-slate-900">最近の添削</h2>
            <p className="text-xs text-slate-500">直近のAI添削リクエストとスコア推移</p>
          </div>
          <button
            type="button"
            onClick={() => void loadLogs()}
            className="rounded border border-slate-200 px-3 py-1 text-xs text-slate-600 hover:bg-slate-50"
            disabled={loading}
          >
            更新
          </button>
        </header>
        <div className="mt-3 space-y-2 text-xs text-slate-500">
          {latestAverage !== null && (
            <p>直近平均スコア: <span className="font-semibold text-slate-700">{latestAverage}</span></p>
          )}
          {error && <p className="text-rose-600">{error}</p>}
        </div>
        <div className="mt-4">
          {loading ? (
            <p className="text-sm text-slate-500">読み込み中...</p>
          ) : logs.length === 0 ? (
            <p className="text-sm text-slate-500">まだ添削ログがありません。</p>
          ) : (
            <ul className="space-y-3">
              {logs.map(log => (
                <li key={log.id} className="rounded border border-slate-100 bg-slate-50 p-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="text-sm font-semibold text-slate-800">{formatDateTime(log.createdAt)}</span>
                    <span className="text-xs text-slate-500">{toneLabelMap[log.tone] ?? log.tone} / {languageLabelMap[log.language] ?? log.language}</span>
                  </div>
                  <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-slate-600">
                    <span>セクション数: {log.totalSections}</span>
                    {typeof log.overallScore === "number" && (
                      <span>総合スコア: <span className="font-semibold text-slate-800">{log.overallScore}</span></span>
                    )}
                    {typeof log.averageSectionScore === "number" && (
                      <span>平均セクションスコア: {log.averageSectionScore}</span>
                    )}
                  </div>
                  {log.sectionStats.length > 0 && (
                    <dl className="mt-2 grid gap-1 text-xs text-slate-500">
                      {log.sectionStats.slice(0, 3).map(section => (
                        <div key={section.sectionId} className="flex items-center justify-between gap-3">
                          <dt className="truncate">{section.sectionTitle}</dt>
                          {typeof section.score === "number" ? (
                            <dd className="font-semibold text-slate-700">{section.score}</dd>
                          ) : (
                            <dd>-</dd>
                          )}
                        </div>
                      ))}
                    </dl>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-5">
        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <header className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-semibold text-slate-900">改善トレンド</h2>
              <p className="text-xs text-slate-500">日ごとのスコア平均とリクエスト数</p>
            </div>
          </header>
          <div className="mt-4">
            {loading ? (
              <p className="text-sm text-slate-500">読み込み中...</p>
            ) : trend.length === 0 ? (
              <p className="text-sm text-slate-500">表示できるトレンドがありません。</p>
            ) : (
              <table className="w-full table-fixed border-collapse text-xs text-slate-600">
                <thead>
                  <tr className="border-b border-slate-200 text-left text-slate-500">
                    <th className="py-2">日付</th>
                    <th className="py-2">リクエスト数</th>
                    <th className="py-2">平均スコア</th>
                  </tr>
                </thead>
                <tbody>
                  {trend.slice(-7).map(point => (
                    <tr key={point.date} className="border-b border-slate-100">
                      <td className="py-2">{formatDate(point.date)}</td>
                      <td className="py-2">{point.count}</td>
                      <td className="py-2">{typeof point.averageScore === "number" ? point.averageScore : "-"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <header className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-semibold text-slate-900">リマインダー</h2>
              <p className="text-xs text-slate-500">面接前後や再添削の通知予定</p>
            </div>
            <button
              type="button"
              onClick={() => void loadReminders()}
              className="rounded border border-slate-200 px-3 py-1 text-xs text-slate-600 hover:bg-slate-50"
              disabled={reminderLoading}
            >
              更新
            </button>
          </header>
          <div className="mt-3 text-xs text-slate-500">
            {reminderError && <p className="text-rose-600">{reminderError}</p>}
            {actionMessage && <p className="text-emerald-600">{actionMessage}</p>}
          </div>
          <div className="mt-4">
            {reminderLoading ? (
              <p className="text-sm text-slate-500">読み込み中...</p>
            ) : reminders.length === 0 ? (
              <p className="text-sm text-slate-500">予定されているリマインダーはありません。</p>
            ) : (
              <ul className="space-y-3">
                {reminders.map(reminder => (
                  <li key={reminder.id} className="rounded border border-slate-100 bg-slate-50 p-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div>
                        <p className="text-sm font-semibold text-slate-800">{formatDateTime(reminder.scheduledAt)}</p>
                        <p className="text-xs text-slate-500">種別: {reminder.type}</p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => void handleCompleteReminder(reminder.id)}
                          className="rounded bg-emerald-600 px-3 py-1 text-xs font-semibold text-white hover:bg-emerald-700"
                        >
                          完了
                        </button>
                        <button
                          type="button"
                          onClick={() => void handleSnoozeReminder(reminder.id)}
                          className="rounded border border-slate-300 px-3 py-1 text-xs text-slate-600 hover:bg-slate-100"
                        >
                          後で通知
                        </button>
                      </div>
                    </div>
                    {reminder.payload && Object.keys(reminder.payload).length > 0 && (
                      <pre className="mt-2 whitespace-pre-wrap break-all rounded bg-white/80 p-2 text-[11px] text-slate-500">
                        {JSON.stringify(reminder.payload, null, 2)}
                      </pre>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="mt-4 rounded border border-slate-200 bg-slate-50 p-3">
            <h3 className="text-sm font-semibold text-slate-800">リマインダーを追加</h3>
            <p className="mt-1 text-xs text-slate-500">面接前日のリマインダーや、再添削のフォローアップを登録できます。</p>
            <div className="mt-3 grid gap-2 md:grid-cols-2">
              <div>
                <label className="text-xs font-semibold text-slate-600">種別</label>
                <select
                  value={scheduleType}
                  onChange={event => setScheduleType(event.target.value as ReminderType)}
                  className="mt-1 w-full rounded border border-slate-300 px-3 py-2 text-sm"
                >
                  <option value="follow_up_review">再添削フォロー</option>
                  <option value="interview_preparation">面接前リマインド</option>
                  <option value="interview_followup">面接後フォロー</option>
                  <option value="custom">カスタム</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-600">通知チャネル</label>
                <select
                  value={scheduleChannel}
                  onChange={event => setScheduleChannel(event.target.value as ReminderChannel)}
                  className="mt-1 w-full rounded border border-slate-300 px-3 py-2 text-sm"
                >
                  <option value="in-app">アプリ内</option>
                  <option value="email">メール</option>
                  <option value="push">プッシュ通知</option>
                </select>
              </div>
            </div>
            <div className="mt-3">
              <label className="text-xs font-semibold text-slate-600">通知日時</label>
              <input
                type="datetime-local"
                value={scheduleDate}
                onChange={event => setScheduleDate(event.target.value)}
                className="mt-1 w-full rounded border border-slate-300 px-3 py-2 text-sm"
              />
            </div>
            <div className="mt-3 flex justify-end">
              <button
                type="button"
                onClick={() => void handleScheduleReminder()}
                className="rounded bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
                disabled={scheduleBusy}
              >
                {scheduleBusy ? "登録中..." : "リマインダーを登録"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
