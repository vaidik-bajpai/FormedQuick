import { z } from 'zod';
import type { ZodIssue } from 'zod'

const email = z.email("invalid email address").max(100).trim().toLowerCase();
const username = z.string().min(2, "name must contain at least 2 characters").max(50, "name is too long").trim();
const password = z.string().min(8, "password must be at least 8 characters").max(72, "password is too long")
// .regex(/[a-z]/, "password must contain at least one lowercase letter").regex(/[A-Z]/, "password must contain at least one uppercase letter").regex(/[0-9]/, "password must contain at least one number").regex(/[^a-zA-Z0-9]/, "password must contain at least one special character");

export const RegisterSchema = z.object({
    username,
    email,
    password,
}).strict();

export const LoginSchema = z.object({
    email,
    password
}).strict();

export const ParamsSchema = z.object({
    id: z.uuid(),
});

export function getZodError(issues: ZodIssue[]): Record<string, string> {
    const errorMap: Record<string, string> = {};
    issues.forEach(issue => {
        const key = issue.path.join('.') || "error";
        if (!errorMap[key]) {
            errorMap[key] = issue.message;
        }
    });

    return errorMap
}