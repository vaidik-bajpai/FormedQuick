import type { Request, Response } from "express"
import { StatusCodes } from "http-status-codes"
import { ApiResponse } from "../utils/ApiResponse.js"
import { ApiError } from "../utils/ApiError.js"
import { FormSubmission, type FieldResponse } from "../models/submisstions.model.js"
import { Form } from "../models/forms.model.js"
import { buildZodSchema } from "../lib/zod.lib.js"
import z from "zod"
import { ValidationError } from "../utils/ValidationError.js"
import { uploadOnCloudinary } from "../services/cloudinary.services.js"
import fs from "fs"
import { getZodError } from "../types/zod.js"

const submitForm = async (req: Request, res: Response) => {
    try {
        const formID = req.params.formID;

        const formDoc = await Form.findOne({ publicId: formID }).lean();
        if (!formDoc) throw new ApiError(StatusCodes.NOT_FOUND, "Form not found");

        const formSchema = formDoc.formSchema;
        const validationShape = buildZodSchema(formSchema);
        const validationSchema = z.object(validationShape);

        console.log("req.files:", req.files);

        const payload: Record<string, any> = { ...req.body };
        const filesArr = req.files as Express.Multer.File[] | undefined;

        let fileUrls: Record<string, string[]> = {};
        if (filesArr && filesArr.length > 0) {
            for (const file of filesArr) {
                const url = await uploadOnCloudinary(file.path);
                fileUrls[file.fieldname] = [url];
                fs.unlinkSync(file.path);
                payload[file.fieldname] = url;
            }
        }

        const parsed = validationSchema.safeParse(payload);
        if (!parsed.success) {
            throw new ValidationError(
                StatusCodes.BAD_REQUEST,
                "Validation failed",
                getZodError(parsed.error.issues)
            );
        }

        const unifiedPayload = {...payload, ...fileUrls}
        console.log("unifiedPayload: ", unifiedPayload)

        const responses = Object.entries(unifiedPayload).map(([key, value]) => ({
            name: key,
            value: value
        }));

        const submissionData = {
            formPublicId: formID,
            form: formDoc._id,
            user: req.user?._id,
            responses,
            submittedAt: new Date(),
        };

        const newSubmission = await FormSubmission.create(submissionData);

        console.log("Saved submission:", newSubmission);

        res.status(StatusCodes.CREATED).json(
            new ApiResponse(
                StatusCodes.CREATED,
                "Submission saved successfully",
                { submissionID: newSubmission._id }
            )
        );
    } catch (error) {
        console.error(error);
        if (error instanceof ValidationError) {
            res.status(error.statusCode).json({
                message: error.message,
                errors: error.errors,
            });
        } else {
            throw new ApiError(
                StatusCodes.INTERNAL_SERVER_ERROR,
                "Failed to save submission"
            );
        }
    }
};

const listSubmissions = async (req: Request, res: Response) => {
    try {
        const user = req.user
        const formId = req.params.formID

        // Verify the user owns the form
        const formDoc = await Form.findOne({ publicId: formId }).lean()
        if (!formDoc) throw new ApiError(StatusCodes.NOT_FOUND, "Form not found")
        if (String(formDoc.user) !== String(user._id)) {
            throw new ApiError(StatusCodes.FORBIDDEN, "Unauthorized user for this form")
        }

        const page = parseInt(req.query.page as string) || 1
        const pageSize = parseInt(req.query.pageSize as string) || 10

        const totalSubmissions = await FormSubmission.countDocuments({ formPublicId: formId })

        const submissions = await FormSubmission.find({ formPublicId: formId })
            .sort({ createdAt: -1 })
            .skip((page - 1) * pageSize)
            .limit(pageSize)
            .lean()

        res.status(StatusCodes.OK).json(
            new ApiResponse(StatusCodes.OK, "submissions fetched successfully", {
                formSchema: formDoc.formSchema,
                submissions,
                meta: {
                    total: totalSubmissions,
                    page,
                    pageSize,
                    totalPages: Math.ceil(totalSubmissions / pageSize),
                },
            })
        )
    } catch (err) {
        console.error(err)
        throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, "failed to fetch the submissions")
    }
}

export {
    submitForm,
    listSubmissions
}

