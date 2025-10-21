import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { generateForm, saveForm } from "../controllers/forms.controller.js";

const router = Router()

router.route("/generate").post(verifyJWT, generateForm)
router.route("/save").post(verifyJWT, saveForm)

export default router;