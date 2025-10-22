import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../services/cloudinary.services.js";
import type { Request } from "express";

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: async (req: Request, file: Express.Multer.File) => ({
        folder: "form_uploads",
        public_id: `${Date.now()}-${file.originalname}`,
        format: file.mimetype.split("/")[1],
    }),
});

const parser = multer({ storage });

export default parser;
