import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { generateForm, saveForm, listForms, getForm } from "../controllers/forms.controller.js";

const router = Router()

router.route("/generate").post(verifyJWT, generateForm)
router.route("/save").post(verifyJWT, saveForm)
router.route("/list").get(verifyJWT, listForms)
router.route("/get/:formID").get(getForm)

export default router;