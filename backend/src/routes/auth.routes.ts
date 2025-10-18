import { Router } from "express";
import { userLogout, userRegistration, userSignin } from "../controllers/auth.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router()

router.route("/register").post(userRegistration)
router.route("/signin").post(userSignin)
router.route("/logout").post(verifyJWT, userLogout)

export default router