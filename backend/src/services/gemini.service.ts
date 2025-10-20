import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config()

const geminiApiKey = process.env.GEMINI_API_KEY
const model = new GoogleGenerativeAI(geminiApiKey!).getGenerativeModel({ model: "gemini-2.0-flash" });

export async function generateJSONSchemaFromPrompt(prompt: string): Promise<Record<string, any>> {
    const detailedPrompt = `
        ${prompt}

        Generate a JSON schema for a form based on the above prompt with the following structure and strict rules.

        The output must be a single JSON object with the following structure:

        {
            "title": string (required) – a brief title for the form,
            "description": string (required) – a short explanation of the form,

            "fields": [  // array of field definitions
                {
                "name": string (required) – unique identifier for the field (used in data submission),
                "label": string (required) – label shown to the user,
                "type": string (required) – must be one of:
                    - "text"
                    - "textarea"
                    - "number"
                    - "date"
                    - "select"
                    - "radio"
                    - "checkbox"
                    - "tags"
                    - "email"
                    - "file"

                "placeholder": string (required) – shown when the field is empty,
                "required": boolean (required) – whether the field must be filled,
                "defaultValue": any (optional) – pre-filled value,
                "helpText": string (optional) – short helper text below the field,

                // Required if type is select, radio, or tags
                "options": array of strings (required for "select", "radio", "tags") – list of available choices,

                "validations": object (required for all types) – must follow type-specific validation rules:
                
                    For "text" or "textarea":
                    {
                        "minLength": number (required),
                        "maxLength": number (required),
                        "trim": boolean (optional, default: false),
                        "whitespace": boolean (optional, default: true),
                        "regex": string (optional, valid JS RegExp pattern)
                    }

                    For "number":
                    {
                        "min": number (required),
                        "max": number (required),
                        "floatingPoint": boolean (optional, default: false)
                    }

                    For "date":
                    {
                        "minDate": string (optional, ISO format "YYYY-MM-DD"),
                        "maxDate": string (optional, ISO format "YYYY-MM-DD"),
                        "disableWeekends": boolean (optional)
                    }

                    For "email":
                    {
                        "domainWhitelist": array of strings (optional, e.g. ["gmail.com"]),
                        "regex": string (optional)
                    }

                    For "checkbox":
                    {
                        "mustBeChecked": boolean (optional, default: false)
                    }

                    For "tags":
                    {
                        "maxTags": number (optional),
                        "allowCustomTags": boolean (optional)
                    }

                    For "file":
                    {
                        "maxSizeMB": number (optional),
                        "acceptedTypes": array of strings (optional, e.g. ["image/png", "application/pdf"])
                    }

                    For "select" or "radio":
                    {
                        "allowOther": boolean (optional)
                    }
                }
            ]
        }
    `;


    const result = await model.generateContent({
        contents: [{ role: "user", parts: [{ text: detailedPrompt }] }],
        generationConfig: { responseMimeType: "application/json" },
    });

    const jsonText = result.response.text();
    return JSON.parse(jsonText);
}