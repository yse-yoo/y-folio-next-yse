export interface PortfolioPdfProject {
  name: string;
  description?: string;
  url?: string;
  role?: string;
  period?: string;
  technologies?: string[];
}

export interface PortfolioPdfExperience {
  internship?: string;
  extracurricular?: string;
  awards?: string;
  [key: string]: unknown;
}

export interface PortfolioPdfOther {
  customQuestions?: string;
  additionalInfo?: string;
  [key: string]: unknown;
}

export interface PortfolioPdfData {
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
    projects: PortfolioPdfProject[];
    experience: PortfolioPdfExperience;
    other: PortfolioPdfOther;
    publication: Record<string, unknown>;
    visibilitySettings: Record<string, unknown>;
  } | null;
}
