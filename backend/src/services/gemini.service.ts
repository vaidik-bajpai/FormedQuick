import dotenv from "dotenv";
import { promptShortened } from "../constants.js";
import { GoogleGenAI, createPartFromUri, type PartUnion } from "@google/genai";

dotenv.config();

const geminiApiKey = process.env.GEMINI_API_KEY;
if (!geminiApiKey) throw new Error("GEMINI_API_KEY is required");

const ai = new GoogleGenAI({ apiKey: geminiApiKey });

export async function generateJSONSchemaFromPrompt(prompt: string, filePaths: string[] = []): Promise<Record<string, any>> {
    console.log("generateJSONSchemaFromPrompt called with prompt:", prompt);
    console.log("filePaths:", filePaths);

    const detailedPrompt = `
            ${prompt}
            ${promptShortened}
        `;

    const parts: PartUnion[] = [{ text: detailedPrompt }];

    for (const path of filePaths) {
        console.log("Uploading file:", path);
        const mimeType = "image/jpeg";
        const uploadedFile = await ai.files.upload({
        file: path,
        config: { mimeType },
        });

        if (uploadedFile.uri && uploadedFile.mimeType) {
        console.log("Uploaded file URI:", uploadedFile.uri);
        parts.push(createPartFromUri(uploadedFile.uri, uploadedFile.mimeType));
        }
    }

    const result = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: parts,
    });

    if (!result.text) throw new Error("No response text from Gemini");

    let jsonText = result.text.substring(7, result.text.length-3)
    console.log("Gemini response text:", jsonText);

    return JSON.parse(jsonText);
}
