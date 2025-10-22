import type { Request, Response } from "express"
import { StatusCodes } from "http-status-codes"
import { ApiResponse } from "../utils/ApiResponse.js"
import { ApiError } from "../utils/ApiError.js"
import { FormSubmission } from "../models/submisstions.model.js"
import { Form } from "../models/forms.model.js"
import { buildZodSchema } from "../lib/zod.lib.js"
import z from "zod"
import { ValidationError } from "../utils/ValidationError.js"

type CloudinaryFile = Express.Multer.File & {
    secure_url?: string
    path?: string
}

const submitForm = async (req: Request, res: Response) => {
    try {
        const formID = req.params.formID

        const formDoc = await Form.findOne({ publicId: formID }).lean()
        if (!formDoc) throw new ApiError(StatusCodes.NOT_FOUND, "Form not found")

        const formSchema = formDoc.formSchema

        const validationShape = buildZodSchema(formSchema)
        const validationSchema = z.object(validationShape)

        const payload: Record<string, any> = { ...req.body }
        const filesMap = req.files as { [fieldname: string]: CloudinaryFile[] } | undefined

        if (filesMap) {
            Object.entries(filesMap).forEach(([fieldname, fileArray]) => {
                payload[fieldname] = fileArray[0] || null
            })
        }

        const parsed = validationSchema.safeParse(payload)
        if (!parsed.success) {
            throw new ValidationError(StatusCodes.BAD_REQUEST, "Validation failed", parsed.error.format())
        }

        const fileUrls: Record<string, string[]> = {}
        if (filesMap) {
            for (const [fieldname, fileArray] of Object.entries(filesMap) as [string, CloudinaryFile[]][]) {
                fileUrls[fieldname] = fileArray
                    .map((file) => (file as CloudinaryFile).path ?? (file as CloudinaryFile).secure_url ?? '')
                    .filter(Boolean)
            }
        }

        console.log("Payload before validation", payload)
        console.log("Parsed data", parsed.data)
        console.log("Extracted file URLs", fileUrls)


        const responses = Object.entries(parsed.data).map(([key, value]) => ({
            name: key,
            value: value instanceof Object && ('originalname' in value) ? null : value,
            fileUrl: fileUrls[key]?.[0],
        }))

        const submissionData = {
            formPublicId: formID,
            form: formDoc._id,
            user: req.user?._id,
            responses,
            submittedAt: new Date(),
        }

        const newSubmission = await FormSubmission.create(submissionData)

        res.status(StatusCodes.CREATED).json(
            new ApiResponse(StatusCodes.CREATED, "Submission saved successfully", { submissionID: newSubmission._id })
        )
    } catch (error) {
        console.error(error)
        if (error instanceof ValidationError) {
            res.status(error.statusCode).json({
                message: error.message,
                errors: error.errors,
            })
        } else {
            throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, "Failed to save submission")
        }
    }
}

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
