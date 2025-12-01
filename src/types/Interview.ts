export interface InterviewEvaluation {
  score?: number;
  summary?: string;
  strengths?: string[];
  improvements?: string[];
  [key: string]: unknown;
}

export interface InterviewCompanyContext {
  url?: string;
  summary?: string;
  highlights?: string[];
  extraNotes?: string;
  rawTextSnippet?: string;
}
