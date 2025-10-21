import type { Request, Response } from "express";
import { FormPayloadSchema, FormSchemaZod, GenerateFormSchema } from "../types/zod.js";
import { ApiError } from "../utils/ApiError.js";
import { StatusCodes } from "http-status-codes";
import { generateJSONSchemaFromPrompt } from "../services/gemini.service.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Form } from "../models/forms.model.js";
import mongoose from "mongoose";

const generateForm = async (req: Request, res: Response) => {
    const body = GenerateFormSchema.safeParse(req.body)
    if(!body.success) {
        throw new ApiError(StatusCodes.BAD_REQUEST, "invalid request body")
    }

    const { prompt } = req.body

    const formSchema = await generateJSONSchemaFromPrompt(prompt)
    res.status(200).json(
        new ApiResponse(StatusCodes.OK, "form schema generated successfully", { form: formSchema, prompt })
    ) 
}

const saveForm = async (req: Request, res: Response) => {
    const safe = FormPayloadSchema.safeParse(req.body)
    if (!safe.success) {
        throw new ApiError(StatusCodes.BAD_REQUEST, "invalid request body")
    }

    const { prompt, form } = safe.data

    const user = req.user

    try {
        const newForm = await Form.create({
            user: user._id,
            publicId: new mongoose.Types.ObjectId().toString(),
            prompt,
            title: form.title,
            description: form.description,
            formSchema: form,
            isPublic: true,
            tags: [],
            submissionCount: 0
        })
        console.log("form saved successfully: ", newForm)

        res.status(StatusCodes.CREATED).json(
            new ApiResponse(StatusCodes.CREATED, "form created successfully", {formID: newForm.publicId})
        )
    } catch (err) {
        console.log(err)
        throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, "failed to save the form")   
    }
}

const listForms = async (req: Request, res: Response) => {
    try {
        const user = req.user;

        const page = parseInt(req.query.page as string) || 1;
        const pageSize = parseInt(req.query.pageSize as string) || 10;

        const totalForms = await Form.countDocuments({ user: user._id });

        const forms = await Form.find({ user: user._id })
            .sort({ createdAt: -1 })
            .skip((page - 1) * pageSize)
            .limit(pageSize)
            .lean();

        res.status(StatusCodes.OK).json(
            new ApiResponse(StatusCodes.OK, "forms fetched successfully", {
                forms,
                meta: {
                    total: totalForms,
                    page,
                    pageSize,
                    totalPages: Math.ceil(totalForms / pageSize),
                },
            })
        );
    } catch (err) {
        console.error(err);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: "Failed to fetch forms",
        });
    }
}; 


export {
    generateForm,
    saveForm,
    listForms
}