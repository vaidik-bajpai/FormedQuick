import type { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { Form } from "../models/forms.model.js";
import { FormSubmission } from "../models/submisstions.model.js";
import { buildZodSchema } from "../lib/zod.lib.js";
import { z } from "zod";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { ValidationError } from "../utils/ValidationError.js";
import { getZodError } from "../types/zod.js";

// Define your own Multer-aware Request interface
interface MulterRequest extends Request {
    files?: { [fieldname: string]: Express.Multer.File[] };
    user?: { _id?: string };
}

const submitForm = async (req: Request, res: Response) => {
    const { formID } = req.params;

    const form = await Form.findOne({ publicId: formID });
    if (!form) throw new ApiError(StatusCodes.NOT_FOUND, "Form not found");

    const zodSchemaFields = buildZodSchema(form.formSchema);
    const safeParseSchema = z.object(zodSchemaFields);

    const parsed = safeParseSchema.safeParse(req.body);
    if (!parsed.success) {
        throw new ValidationError(
            StatusCodes.BAD_REQUEST,
            "Invalid form submission",
            getZodError(parsed.error.issues)
        );
    }

    const filesMap = req.files ?? {};

    const responses = form.formSchema.fields.map((field) => {
        const data = parsed.data as Record<string, any>;
        const value = data[field.name];

        if (field.type === "file") {
            const fieldFiles = filesMap[field.name];
            if (fieldFiles && fieldFiles.length > 0) {
                const file = fieldFiles[0];
                return {
                    name: field.name,
                    value: null,
                    fileUrl: file?.path ?? null,
                };
            } else {
                return {
                    name: field.name,
                    value: null,
                    fileUrl: null,
                };
            }
        }

        return {
            name: field.name,
            value: value ?? null,
        };
    });


    const submission = await FormSubmission.create({
        form: form._id,
        formPublicId: form.publicId,
        user: req.user?._id,
        responses,
        submittedAt: new Date(),
        metadata: {
            ip: req.ip,
            userAgent: req.headers["user-agent"] ?? "",
        },
    });

    res.status(StatusCodes.CREATED).json(
        new ApiResponse(StatusCodes.CREATED, "Form submitted successfully", {
            submissionId: submission._id,
        })
    );
};

export { submitForm };
