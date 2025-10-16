import { Router } from "express";
import { userLogout, userRegistration, userSignin } from "../controllers/auth.controller.js";

const router = Router()

router.route("/register").post(userRegistration)
router.route("/signin").post(userSignin)
router.route("/logout").post(userLogout)

export default router