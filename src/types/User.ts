import type { Portfolio } from "./Portforio";

export interface User {
    id: string;
    uid?: string;
    name: string;
    email: string;
    phone?: string;
    address?: string;
    university?: string;
    department?: string;
    grade?: string;
    birthDate?: Date | string | null;
    selfIntroduction?: string;
    github?: string;
    education?: string;
    profile?: string;
    careers?: Career[];
    skills?: {
        programming: string[];
        frameworks: string[];
    };
    certifications?: string[] | string;
    awards?: string;
    portfolio?: Portfolio | null;
    password_hash?: string;
    is_active?: boolean;
    email_verified?: boolean;
    verification_token?: string | null;
    reset_token?: string | null;
    reset_token_expires?: Date | string | null;
    created_at?: Date | string;
    updated_at?: Date | string;
}

export interface DbUser {
    id: string;
    email: string | null;
    name: string | null;
    phone?: string | null;
    address?: string | null;
    uid?: string;
}

interface Career {
    company: string;
    position?: string;
    startDate: string;
    endDate?: string;
    descriptions: string[];
}