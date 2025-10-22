import { FormSchema } from "@/types/form.types";
import z from "zod";

export const buildZodSchema = (schema: FormSchema) => {
    const fields: Record<string, z.ZodTypeAny> = {};

    schema.fields.forEach((f) => {
        const name = f.name;
        const v = f.validations || {};

         let s: z.ZodTypeAny;

        switch (f.type) {
            case "text":
            case "textarea": {   
                s = z.string();
                if(typeof v.minLength === "number" && s instanceof z.ZodString) s = s.min(v.minLength, `${name} must be atleast ${v.minLength} characters`)
                if(typeof v.maxLength === "number" && s instanceof z.ZodString) s = s.max(v.maxLength, `${name} must be not more than ${v.maxLength} characters`)
                if (!f.required) s = s.optional();
                fields[name] = s;
                break;
            }

            case "email": {
                s = z.email(`${name} must be a valid email`)
                if(typeof v.minLength === "number" && s instanceof z.ZodString) s = s.min(v.minLength, `${name} must be atleast ${v.minLength} characters`)
                if(typeof v.maxLength === "number" && s instanceof z.ZodString) s = s.max(v.maxLength, `${name} must be not more than ${v.maxLength} characters`)
                if (!f.required) s = s.optional();
                fields[name] = s;
                break;
            }

            case "number": {
                s = z.number()

                if (typeof v.minLength === "number" && s instanceof z.ZodNumber) s = s.min(v.minLength, `${name} must be greater than ${v.minLength}`);
                if (typeof v.maxLength === "number" && s instanceof z.ZodNumber) s = s.max(v.maxLength, `${name} must be smaller than ${v.maxLength}`);
                if (!f.required) s = s.optional();
                fields[name] = s;
                break;
            }
            
            case "select": {
                if (f.options && f.options.length > 0) {
                    s = z.enum(f.options as [string, ...string[]]).refine(
                        (val) => f.options!.includes(val),
                        `${name} must be one of ${f.options.join(", ")}`
                    );
                } else {
                    s = z.string();
                }

                if (!f.required) s = s.optional();
                fields[name] = s;
                break;
            }

            case "date": {
                s = z.date(`${name} must be a valid date`)
                if(!f.required) s = s.optional()
                fields[name] = s
                break;
            }

            case "file": {
                s = z
                    .instanceof(File, { message: `${name} must be a valid file` })
                    .optional();
                if (f.required) s = s.refine((file) => file instanceof File, `${name} is required`);
                fields[name] = s;
                break;
            }

            default:
                break;
        }
    })

    return z.object(fields)
}