import type { Request, Response, NextFunction } from "express"
import { StatusCodes } from "http-status-codes"
import { ApiError } from "../utils/ApiError.js"
import jwt from "jsonwebtoken"
import { User } from "../models/auth.model.js"
import { getErrorMessage } from "../utils/error.js"

export const verifyJWT = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")
        if(!token) {
            throw new ApiError(StatusCodes.UNAUTHORIZED, "unauthorised request")
        }

        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!)
        if(typeof decodedToken !== "object" || !("_id" in decodedToken)) {
            throw new ApiError(StatusCodes.UNAUTHORIZED, "invalid access token")
        }

        const user = await User.findById(decodedToken?._id).select("-password -refreshToken")
        if(!user) {
            throw new ApiError(StatusCodes.UNAUTHORIZED, "invalid access token")
        }

        req.user = user;
        next()
    } catch (err) {
        throw new ApiError(StatusCodes.UNAUTHORIZED, getErrorMessage(err) || "invalid access token")
    }
}