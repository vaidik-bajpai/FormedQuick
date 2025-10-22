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
        if (v.minLength !== undefined) s = (s as z.ZodString).min(v.minLength, { message: `${name} must be at least ${v.minLength} characters` });
        if (v.maxLength !== undefined) s = (s as z.ZodString).max(v.maxLength, { message: `${name} must be at most ${v.maxLength} characters` });
        if (v.regex) s = (s as z.ZodString).regex(new RegExp(v.regex), { message: `${name} is invalid` });
        if (!f.required) s = s.optional();
        break;
      }

      case "email": {
        s = z.string().email({ message: `${name} must be a valid email` });
        if (v.minLength !== undefined) s = (s as z.ZodString).min(v.minLength, { message: `${name} must be at least ${v.minLength} characters` });
        if (v.maxLength !== undefined) s = (s as z.ZodString).max(v.maxLength, { message: `${name} must be at most ${v.maxLength} characters` });
        if (!f.required) s = s.optional();
        break;
      }

      case "number": {
        s = z.preprocess(
          (val) => {
            if (typeof val === "string" && val.trim() !== "") return Number(val);
            return val;
          },
          z.number({ message: `${name} must be a number` })
        );
        if (v.minLength !== undefined) s = (s as z.ZodNumber).min(v.minLength, { message: `${name} must be >= ${v.minLength}` });
        if (v.maxLength !== undefined) s = (s as z.ZodNumber).max(v.maxLength, { message: `${name} must be <= ${v.maxLength}` });
        if (!f.required) s = s.optional();
        break;
      }

      case "select": {
        if (f.options && f.options.length > 0) {
          // Create tuple of string literals for z.enum
          const tupleOptions = f.options as [string, ...string[]];
          s = z.enum(tupleOptions);
        } else {
          s = z.string();
        }
        if (!f.required) s = s.optional();
        break;
      }

      case "date": {
        s = z.preprocess(
          (val) => (typeof val === "string" && val.trim() !== "" ? new Date(val) : val),
          z.date().refine((val) => val instanceof Date && !isNaN(val.getTime()), { message: `${name} must be a valid date` })
        );
        if (!f.required) s = s.optional();
        break;
      }

      case "file": {
        s = z.preprocess(
          (val) => {
            if (val instanceof FileList && val.length > 0) return val[0];
            return val;
          },
          z.instanceof(File, { message: `${name} must be a valid file` })
        );
        if (!f.required) s = s.optional();
        break;
      }

      default:
        s = z.any();
        break;
    }

    fields[name] = s;
  });

  return z.object(fields);
};
