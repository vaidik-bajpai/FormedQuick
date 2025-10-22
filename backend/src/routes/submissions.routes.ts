import { Router } from "express"
import { listSubmissions, submitForm } from "../controllers/submissions.controller.js"
import upload from "../middlewares/multer.middleware.js"
import { verifyJWT } from "../middlewares/auth.middleware.js"

const router = Router()

router.route("/submit/:formID").post(upload.any(), submitForm)
router.route("/list/:formID").get(verifyJWT, listSubmissions)

export default router