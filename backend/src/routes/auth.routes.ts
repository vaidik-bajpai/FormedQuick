import { Router } from "express";
import { refreshToken, userLogout, userRegistration, userSignin } from "../controllers/auth.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router()

router.route("/register").post(userRegistration)
router.route("/signin").post(userSignin)
router.route("/logout").post(verifyJWT, userLogout)
router.route("/refreshToken").post(refreshToken)

export default router