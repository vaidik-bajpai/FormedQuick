import type { Request, Response } from "express"
import { ApiResponse } from "../utils/ApiResponse.js"
import { ApiError } from "../utils/ApiError.js"
import { getZodError, RegisterSchema, SigninSchema } from "../types/zod.js"
import { StatusCodes } from "http-status-codes"
import { User, type IUser } from "../models/auth.model.js"
import { ValidationError } from "../utils/ValidationError.js"
import jwt from "jsonwebtoken"
import { getErrorMessage } from "../utils/error.js"

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

const userSignin = async (req: Request, res: Response) => {
    const body = SigninSchema.safeParse(req.body)
    if(!body.success) {
        throw new ValidationError(StatusCodes.BAD_REQUEST, "invalid signin credentials", getZodError(body.error.issues))
    }

    const { email, password } = req.body
    const user = await User.findOne({ email })
    if(!user) {
        throw new ApiError(StatusCodes.BAD_REQUEST, "invalid user credentials")
    }

    const isPasswordValid = await user.isPasswordCorrect(password)
    if(!isPasswordValid) {
        throw new ApiError(StatusCodes.BAD_REQUEST, "invalid user credentials")
    }

    const [accessToken, refreshToken] = await Promise.all([
        user.generateAccessToken(),
        user.generateRefreshToken()
    ]);

    user.refreshToken = refreshToken

    user.save({ validateBeforeSave: false })

    const safeUser = user.toObject() as Partial<IUser>;
    delete safeUser.password;
    delete safeUser.refreshToken;

     const options = {
        httpOnly: true,
        secure: true
    }

    return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
        new ApiResponse(
            200, 
            "user logged In successfully",
            {
                user: {...safeUser, accessToken, refreshToken}, 
            },
        )
    )
}

const userLogout = async (req: Request, res: Response) => {
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $unset: {
                refreshToken: 1
            }
        },
        {
            new: true
        }
    )

    const options = {
        httpOnly: true,
        secure: true
    }

    res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(new ApiResponse(200, "user logged out"))
}

const refreshToken = async (req: Request, res: Response) => {
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken
    if(!incomingRefreshToken) {
        throw new ApiError(StatusCodes.UNAUTHORIZED, "unauthorised request")
    }

    try {
        const decodedToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET!)
        if(typeof decodedToken !== "object" || !("_id" in decodedToken)) {
            throw new ApiError(StatusCodes.UNAUTHORIZED, "invalid access token")
        }

        const user = await User.findById(decodedToken?._id)
        if(!user) {
            throw new ApiError(StatusCodes.UNAUTHORIZED, "invalid access token")
        }

        const options = {
            httpOnly: true,
            secure: true
        }

        const [accessToken, newRefreshToken] = await Promise.all([
            user.generateAccessToken(),
            user.generateRefreshToken()
        ]);
        
        return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", newRefreshToken, options)
        .json(
            new ApiResponse(
                200, 
                "access token refreshed",
                {
                    accessToken,
                    refreshToken: newRefreshToken
                }
            )
        )
    } catch (err) {
        throw new ApiError(StatusCodes.UNAUTHORIZED, getErrorMessage(err) || "invalid access token")
    }
}

export {
    userRegistration,
    userSignin,
    userLogout,
    refreshToken
}