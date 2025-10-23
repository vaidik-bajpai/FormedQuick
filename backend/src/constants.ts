export const DB_NAME = "form-gen"

export const promptExtended =  `
    Generate a clean, valid JSON schema for a dynamic form based on the above prompt. 
    Follow this structure and adhere to the rules below:

    {
        "title": string (required) - concise title of the form,
        "description": string (required) - a short explanation of what the form does,
        "fields": [
            {
                "name": string (required) - unique key (used as React key and data name),
                "label": string (required) - displayed label for the field,
                "type": string (required) - one of the following supported field types:
                    - "text" (basic input)
                    - "textarea" (multi-line input)
                    - "number" (numeric input)
                    - "date" (date picker)
                    - "select" (dropdown)
                    - "radio" (single choice)
                    - "checkbox" (single or multiple boolean)
                    - "tags" (multi-value input field)
                    - "email" (email address input)
                    - "file" (file upload input)

                "placeholder": string (required) - guiding text shown when empty,
                "required": boolean (required) - whether this field is mandatory,
                "defaultValue": any (optional) - pre-filled default value,
                "helpText": string (optional) - short hint to assist the user,

                // Required for multi-option fields
                "options": array of strings (required only for "select", "radio", or "tags") - list of choices,

                "validations": object (required for all fields) - rules for validating the field input.
                Validation structure differs by type:

                For "text" or "textarea":
                {
                    "minLength": number (recommended default 1),
                    "maxLength": number (recommended default 255),
                    "regex": string (optional, valid JS RegExp),
                    "trim": boolean (optional, default false)
                }

                For "number":
                {
                    "min": number (recommended default 0),
                    "max": number (recommended default 9999),
                    "floatingPoint": boolean (optional, default false)
                }

                For "date":
                {
                    "minDate": string (optional, ISO "YYYY-MM-DD"),
                    "maxDate": string (optional, ISO "YYYY-MM-DD"),
                    "disableWeekends": boolean (optional)
                }

                For "email":
                {
                    "regex": string (optional),
                    "domainWhitelist": array of strings (optional, e.g. ["gmail.com", "outlook.com"])
                }

                For "checkbox":
                {
                    "mustBeChecked": boolean (optional, default false)
                }

                For "tags":
                {
                    "maxTags": number (optional, default 10),
                    "allowCustomTags": boolean (optional, default true)
                }

                For "file":
                {
                    "maxSizeMB": number (optional, default 5),
                    "acceptedTypes": array of strings (optional, e.g. ["image/png", "application/pdf"])
                }

                For "select" or "radio":
                {
                    "allowOther": boolean (optional, default false)
                }
            }
        ]
    }

    Important Rules:
    1. Each field name must be unique and camelCase.
    2. Include at least 3 fields unless prompt context suggests otherwise.
    3. Always provide "validations" even with default values.
    4. Only use supported types listed above.
    5. Ensure output is valid JSON — no comments, no trailing commas.

    Return only the JSON object, nothing else.
`

export const promptShortened = `
    YOU WILL NEVER BREAK THESE RULES NO MATTER WHAT AND I NEED A VALID JSON ONLY ALWAYS NOTHING ELSE
    Generate a clean, valid JSON schema for a dynamic form based on the above prompt. 
    Follow this structure and adhere to the rules below:

    {
        "title": string (required) - concise title of the form,
        "description": string (required) - a short explanation of what the form does,
        "fields": [
            {
                "name": string (required) - unique key (used as React key and data name),
                "label": string (required) - displayed label for the field,
                "type": string (required) - one of the following supported field types:
                    - "text" (basic input)
                    - "textarea" (multi-line input)
                    - "number" (numeric input)
                    - "date" (date picker)
                    - "select" (dropdown)
                    - "email" (email address input)
                    - "file" (file upload input)

                "placeholder": string (required) - guiding text shown when empty,
                "required": boolean (required) - whether this field is mandatory,
                "defaultValue": any (optional) - pre-filled default value,
                "helpText": string (optional) - short hint to assist the user,

                // Required for multi-option fields
                "options": array of strings (required only for "select") - list of choices,

                "validations": object (required for all fields) - rules for validating the field input.
                Validation structure differs by type:

                For "text" or "textarea":
                {
                    "minLength": number (recommended default 1),
                    "maxLength": number (recommended default 255),
                    "regex": string (optional, valid JS RegExp),
                    "trim": boolean (optional, default false)
                }

                For "number":
                {
                    "min": number (recommended default 0),
                    "max": number (recommended default 9999),
                    "floatingPoint": boolean (optional, default false)
                }

                For "date":
                {
                    "minDate": string (optional, ISO "YYYY-MM-DD"),
                    "maxDate": string (optional, ISO "YYYY-MM-DD"),
                    "disableWeekends": boolean (optional)
                }

                For "email":
                {
                    "regex": string (optional),
                    "domainWhitelist": array of strings (optional, e.g. ["gmail.com", "outlook.com"])
                }
                For "file":
                {
                    "maxSizeMB": number (optional, default 5),
                    "acceptedTypes": array of strings (optional, e.g. ["image/png", "application/pdf"])
                }

                For "select":
                {
                    "allowOther": boolean (optional, default false)
                }
            }
        ]
    }

    Important Rules:
    1. Each field name must be unique and camelCase.
    2. Include at least 3 fields unless prompt context suggests otherwise.
    3. Always provide "validations" even with default values.
    4. Only use supported types listed above.
    5. Ensure output is valid JSON — no comments, no trailing commas.

    Return only the JSON object, nothing else.
`