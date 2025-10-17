import type { Request, Response } from "express"
import { ApiResponse } from "../utils/ApiResponse.js"
import { ApiError } from "../utils/ApiError.js"
import { getZodError, RegisterSchema } from "../types/zod.js"
import { StatusCodes } from "http-status-codes"
import { User } from "../models/auth.model.js"
import { ValidationError } from "../utils/ValidationError.js"

const userRegistration = async (req: Request, res: Response) => {
    const body = RegisterSchema.safeParse(req.body)
    if(!body.success) {
        throw new ValidationError(StatusCodes.BAD_REQUEST, "invalid registration credentials", getZodError(body.error.issues))
    }

    const { username, email, password } = req.body

    const existedUser = await User.findOne({
        $or: [{ username }, { email }]
    })
    if(existedUser) {
        throw new ApiError(StatusCodes.CONFLICT, "user already registered")
    }

    const user = await User.create({
        username,
        email,
        password,
    })

    const safeUser = {
        username: user.username,
        email: user.email,
    }

    res.status(StatusCodes.CREATED).json(
        new ApiResponse(200, "user created successfully", {user: safeUser})
    )
}

const userSignin = (req: Request, res: Response) => {
    res.status(200).json(
        new ApiResponse(200, "response from user signin endpoint", null)
    )
}

const userLogout = (req: Request, res: Response) => {
    res.status(200).json(
        new ApiResponse(200, "response from user logout endpoint", null)
    )
}

export {
    userRegistration,
    userSignin,
    userLogout
}