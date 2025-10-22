import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
import { promptShortened } from "../constants.js";

dotenv.config()

const geminiApiKey = process.env.GEMINI_API_KEY
const model = new GoogleGenerativeAI(geminiApiKey!).getGenerativeModel({ model: "gemini-2.0-flash" });

export async function generateJSONSchemaFromPrompt(prompt: string): Promise<Record<string, any>> {
    const detailedPrompt = `
        ${prompt}
        ${promptShortened}
    `

    const result = await model.generateContent({
        contents: [{ role: "user", parts: [{ text: detailedPrompt }] }],
        generationConfig: { responseMimeType: "application/json" },
    });

    const jsonText = result.response.text();
    return JSON.parse(jsonText);
}