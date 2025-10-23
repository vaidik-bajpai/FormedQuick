import type { Request, Response } from "express";
import { FormPayloadSchema, FormSchemaZod, GenerateFormSchema, getZodError } from "../types/zod.js";
import { ApiError } from "../utils/ApiError.js";
import { StatusCodes } from "http-status-codes";
import { generateJSONSchemaFromPrompt } from "../services/gemini.service.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Form } from "../models/forms.model.js";
import mongoose from "mongoose";
import { ValidationError } from "../utils/ValidationError.js";

const generateForm = async (req: Request, res: Response) => {
  console.log("generateForm called");

  const body = GenerateFormSchema.safeParse(req.body);
  if (!body.success) {
    console.error("Invalid request body:", body.error);
    throw new ApiError(StatusCodes.BAD_REQUEST, "invalid request body");
  }

  const { prompt } = body.data;
  console.log("Prompt received:", prompt);

  const files = req.files as Express.Multer.File[] | undefined;
  console.log(`Files received: ${files ? files.length : 0}`);
  if (files) {
    files.forEach((file, idx) =>
      console.log(`File[${idx}]: ${file.originalname} (${file.mimetype}, ${file.size} bytes) at ${file.path}`)
    );
  }

  const filePaths = files?.map((file) => file.path) || [];
  console.log("File paths to upload:", filePaths);

  const formSchema = await generateJSONSchemaFromPrompt(prompt, filePaths);
  console.log("Form schema generated successfully");

  res.status(StatusCodes.OK).json(
    new ApiResponse(StatusCodes.OK, "form schema generated successfully", { form: formSchema, prompt })
  );
};

const saveForm = async (req: Request, res: Response) => {
    const safe = FormPayloadSchema.safeParse(req.body)
    if (!safe.success) {
        throw new ValidationError(StatusCodes.BAD_REQUEST, "invalid request body", getZodError(safe.error.issues))
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
        throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, "failed to fetch the forms")
    }
}; 

const getForm = async (req: Request, res: Response) => {
    const { formID } = req.params;

    try {
        const form = await Form.findOne({ publicId: formID }).lean()
        if (!form) {
            throw new ApiError(StatusCodes.NOT_FOUND, "Form not found");
        }

        console.log("form fetched successfully:", form);

        res.status(StatusCodes.OK).json(
            new ApiResponse(StatusCodes.OK, "form data fetched successfully", {
                form,                    
            })
        )
    } catch (err) {
        console.log(err)
        throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, "failed to get the form")
    }
}

export {
    generateForm,
    saveForm,
    listForms,
    getForm
}