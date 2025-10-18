import type { Request, Response } from "express";
import { GenerateFormSchema } from "../types/zod.js";
import { ApiError } from "../utils/ApiError.js";
import { StatusCodes } from "http-status-codes";
import { generateJSONSchemaFromPrompt } from "../services/gemini.service.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const generateForm = async (req: Request, res: Response) => {
    const body = GenerateFormSchema.safeParse(req.body)
    if(!body.success) {
        throw new ApiError(StatusCodes.BAD_REQUEST, "invalid request body")
    }

    const { prompt } = req.body
    const userId = req.user._id

    const formSchema = await generateJSONSchemaFromPrompt(prompt)
    res.status(200).json(
        new ApiResponse(StatusCodes.OK, "form schema generated successfully", { form: formSchema })
    ) 
}

export {
    generateForm
}