import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config()

const geminiApiKey = process.env.GEMINI_API_KEY
const model = new GoogleGenerativeAI(geminiApiKey!).getGenerativeModel({ model: "gemini-2.0-flash" });

export async function generateJSONSchemaFromPrompt(prompt: string): Promise<Record<string, any>> {
    const detailedPrompt = `
        Generate a JSON object with these properties:
        - title: string describing the form’s title
        - description: string describing the form
        - schema: array of field objects with:

        field: (string) unique field identifier
        label: (string) human readable label
        type: one of ["text", "email", "select", "file", "number", "checkbox", "date"]
        required: boolean indicating if field is required
        validations: object, e.g. { minLength, maxLength, pattern }

        For type "select":
            selectOptions: array of strings for choices
            default: default selected value

        For type "file":
            acceptedMimeTypes: array of accepted MIME types (e.g. ["image/png","image/jpeg"])
            maxFileSizeMB: number - max file size in megabytes

        Return ONLY the JSON object without explanations.
        Prompt: ${prompt}
    `;

    const result = await model.generateContent({
        contents: [{ role: "user", parts: [{ text: detailedPrompt }] }],
        generationConfig: { responseMimeType: "application/json" },
    });

    const jsonText = result.response.text();
    return JSON.parse(jsonText);
}