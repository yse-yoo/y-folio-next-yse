import { VisibilitySettings } from "@prisma/client";

export const testVisibilitySettings: VisibilitySettings = {
    id: 1,
    basicInfo: true,
    phone: false,
    address: false,
    skills: true,
    projects: true,
    experience: true,
    other: true,
    userId: 1,
}