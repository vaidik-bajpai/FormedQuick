import type { Request, Response } from "express"

const userRegistration = (req: Request, res: Response) => {
    res.status(200).json({
        "message": "response from user registration endpoint",
    })
}

const userSignin = (req: Request, res: Response) => {
    res.status(200).json({
        "message": "response from user signin endpoint"
    })
}

const userLogout = (req: Request, res: Response) => {
    res.status(200).json({
        "message": "response from user logout endpoint"
    })
}

export {
    userRegistration,
    userSignin,
    userLogout
}