import type { Project } from "./Project";

export interface Portfolio {
    id: string;
    user_id: string;
    name?: string | null;
    university?: string | null;
    faculty?: string | null;
    grade?: string | null;
    email?: string | null;
    selfIntroduction?: string | null;
    skills?: string[] | null;
    skillTags?: string[] | string | null;
    certifications?: string | null;
    projects?: Project[] | null;
    internship?: string | null;
    extracurricular?: string | null;
    experience?: string | null;
    awards?: string | null;
    customQuestions?: string | null;
    additionalInfo?: string | null;
    isPublic: boolean;
    autoDeleteAfterOneYear?: boolean | null;
    publication?: Record<string, unknown> | null;
    visibilitySettings?: Record<string, unknown> | null;
    rawProjects?: string | null;
}
