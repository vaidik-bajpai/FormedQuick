import { v2 as cloudinary } from "cloudinary";
import fs from "fs"

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME as string,
    api_key: process.env.CLOUDINARY_API_KEY as string,
    api_secret: process.env.CLOUDINARY_API_SECRET as string,
});

export const uploadOnCloudinary = async (localFilePath: string) => {
    try {
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"
        })
        console.log("file uploaded successfully: ", response.url)
        return response.url
    } catch(err) {
        fs.unlinkSync(localFilePath)
        return ""
    }
}

export default cloudinary;
