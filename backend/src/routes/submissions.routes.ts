import { Router } from "express"
import { submitForm } from "../controllers/submissions.controller.js"
import upload from "../middlewares/multer.middleware.js"

const router = Router()

router.route("/submit/:formID").post(upload.any(), submitForm)

export default router