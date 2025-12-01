export type ReviewTone = "keigo" | "futsukei" | "business" | "casual";
export type ReviewLanguage = "ja" | "en";
export type ReviewWritingStyle = "formal" | "neutral" | "story";
export type ReviewHonorific = "standard" | "respectful" | "none";
export type ReviewAudience = "internal" | "external";

export interface ResumeSectionInput {
  id: string;
  title: string;
  text: string;
}

export type ReviewCategoryId =
  | "clarity"
  | "structure"
  | "quantitative"
  | "story"
  | "fit"
  | "tone"
  | "grammar"
  | "other";

export interface ReviewCategoryFeedback {
  id: ReviewCategoryId;
  label: string;
  comment: string;
  suggestion: string;
  example?: string;
  priority: "high" | "medium" | "low";
}

export interface SectionReviewFeedback {
  sectionId: string;
  sectionTitle: string;
  summary: string;
  score?: number;
  revisedText: string;
  categories: ReviewCategoryFeedback[];
}

export interface ResumeReviewResponse {
  overallSummary: string;
  overallScore?: number;
  sections: SectionReviewFeedback[];
  suggestions?: string[];
  styleCompliance?: ReviewStyleCompliance;
  followUpQuestions?: FollowUpQuestion[];
}

export interface ResumeReviewRequestPayload {
  sections: ResumeSectionInput[];
  tone?: ReviewTone;
  language?: ReviewLanguage;
  companyContext?: string;
  writingStyle?: ReviewWritingStyle;
  honorific?: ReviewHonorific;
  audience?: ReviewAudience;
  answeredFollowUps?: FollowUpAnswer[];
  userId?: string;
}

export interface ResumeReviewHistoryEntry {
  id: string;
  createdAt: string;
  tone: ReviewTone;
  language: ReviewLanguage;
  companyContext?: string;
  writingStyle?: ReviewWritingStyle;
  honorific?: ReviewHonorific;
  audience?: ReviewAudience;
  sections: ResumeSectionInput[];
  result: ResumeReviewResponse;
}

export interface ReviewStyleOptions {
  tone: ReviewTone;
  language: ReviewLanguage;
  writingStyle: ReviewWritingStyle;
  honorific: ReviewHonorific;
  audience: ReviewAudience;
}

export interface ReviewStyleCompliance {
  matched: boolean;
  notes?: string;
}

export interface FollowUpQuestion {
  id: string;
  sectionId?: string;
  question: string;
  reason?: string;
  missingInfoHint?: string;
}

export interface FollowUpAnswer {
  id: string;
  answer: string;
}

export interface ResumeReviewLogEntry {
  id: string;
  createdAt: string;
  tone: ReviewTone;
  language: ReviewLanguage;
  writingStyle?: ReviewWritingStyle;
  overallScore?: number | null;
  averageSectionScore?: number | null;
  totalSections: number;
  sectionStats: Array<{
    sectionId: string;
    sectionTitle: string;
    score?: number | null;
  }>;
}

export interface ResumeReviewTrendPoint {
  date: string;
  count: number;
  averageScore?: number | null;
}

export type ReminderStatus = "pending" | "sent" | "dismissed" | "snoozed";

export type ReminderChannel = "in-app" | "email" | "push";

export type ReminderType =
  | "follow_up_review"
  | "interview_preparation"
  | "interview_followup"
  | "custom";

export interface ReviewReminderEntry {
  id: string;
  type: ReminderType;
  status: ReminderStatus;
  channel: ReminderChannel;
  scheduledAt: string;
  payload?: Record<string, unknown> | null;
  createdAt: string;
  updatedAt: string;
}
