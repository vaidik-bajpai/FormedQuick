import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { generateForm } from "../controllers/forms.controller.js";

const router = Router()

router.route("/generate").post(verifyJWT, generateForm)

export default router;