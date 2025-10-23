# Formed Quick Setup Guide

## Step 1: Create .env files for Web and Backend

You should mimic the `.env.sample` configuration files from both your **web** and **backend** projects to create your own `.env` files.

### For Web

- Copy `.env.sample` in the web directory:  
  ```
  cp web/.env.sample web/.env
  ```
- Open `.env` and fill in necessary environment variables such as:
  - `NEXT_PUBLIC_API_BASE_URL`=http://localhost:8000/api/v1
  - Any other values specific to your frontend app.

### For Backend

- Copy `.env.sample` in the backend directory:  
  ```
  cp backend/.env.sample backend/.env
  ```
- Open `.env` and provide your variables like:
  - `MONGODB_URI` (e.g., mongodb://localhost:27017/your-db)
  - `GEMINI_API_KEY` (your Google Gemini API key)
  - Any auth secrets or tokens.

## Step 2: Start MongoDB Container

If you are using Docker, start a MongoDB container:

```
docker run -d --name formed-mongo -p 27017:27017 mongo:latest
```

This will run MongoDB on your local machine accessible via `mongodb://localhost:27017`.

Make sure your backend `.env` `MONGODB_URI` matches this connection URL, e.g.:

```
MONGODB_URI=mongodb://localhost:27017/
```

## Step 3: Start Backend Server

Navigate to your backend directory and install dependencies, then start the server:

```
cd backend
npm install
npm run dev
```

## Step 4: Start Web (Frontend) Server

Navigate to your web directory and install dependencies, then start the frontend:

```
cd web
npm install
npm run dev
```

## Example Prompt to Generate a Form


- prompt:
```
Create a contact form that collects the following fields:
Full Name: required text input with a maximum length of 100 characters
Email Address: required input validated as an email format
Phone Number: optional text input, validated for typical phone number formats
Message: required multi-line textarea input with a maximum length of 1000 characters
Please return this form as a JSON schema.
```

- form schema:
```
{
  "title": "Contact Us",
  "description": "Please fill out this form to get in touch with us.",
  "fields": [
    {
      "name": "fullName",
      "label": "Full Name",
      "type": "text",
      "placeholder": "Enter your full name",
      "required": true,
      "validations": {
        "minLength": 1,
        "maxLength": 100
      }
    },
    {
      "name": "emailAddress",
      "label": "Email Address",
      "type": "email",
      "placeholder": "your.name@example.com",
      "required": true,
      "validations": {
        "regex": "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$"
      }
    },
    {
      "name": "phoneNumber",
      "label": "Phone Number",
      "type": "text",
      "placeholder": "e.g., +1 (555) 123-4567",
      "required": false,
      "validations": {
        "maxLength": 25,
        "regex": "^(\\+\\d{1,3}[-. ]?)?\\(?\\d{2,3}\\)?[ -. ]?\\d{3}[-. ]?\\d{4,9}$"
      }
    },
    {
      "name": "message",
      "label": "Message",
      "type": "textarea",
      "placeholder": "Type your message here...",
      "required": true,
      "validations": {
        "minLength": 1,
        "maxLength": 1000
      }
    }
  ]
}
```

----------

## Limitations

1.  **Gemini API limitations**
    
    -   May require external file upload management.
        
    -   Response format depends on AI's output—may need sanitization.
        
    -   Large or complex prompts can result in slower responses or partial results.
        
2.  **Form Validation**
    
    -   Validation rules rely on Gemini-generated schema and can vary.
        
    -   Edge cases, complex custom validations, and dynamic conditional logic are currently limited.
        
3.  **File Handling**
    
    -   File uploads are reset on submit; no client-side persistent cache.
        
    -   Files are stored temporarily unless backend persists them—this may affect user experience.
        
4.  **Error Handling and UX**
    
    -   Minimal user feedback on API failures or partial form generation.
        
    -   Limited retry or save draft functionality.
        
5.  **Security**
    
    -   Authentication relies on JWT with no role-based access control.
        
    -   Input sanitization and rate limiting may need improvement.
        

----------

## Future Improvements

1.  **Enhanced Gemini integration**
    
    -   Support for more input types, e.g., file content analysis.
        
    -   Better prompt engineering for more consistent schema output.
        
    -   Streaming partial generation for improved performance.
        
2.  **Improved Form Features**
    
    -   Support complex conditional fields, repeaters, calculated fields.
        
    -   More robust client-side and server-side validation.
        
    -   UI customization options for generated forms.
        
3.  **User Experience Enhancements**
    
    -   Allow saving drafts, auto-save during creation.
        
    -   Persist uploaded files with previews across sessions.
        
    -   More detailed error reporting and user guidance.
        
4.  **Security and Authorization**
    
    -   Implement role and permission-based access control.
        
    -   Harden backend input validation and rate limiting.
        
    -   Audit logging for form creation and edits.
        
5.  **Scalability and Deployment**
    
    -   Support multi-tenant environments.
        
    -   CI/CD pipelines for easier updates.
        
    -   Monitoring and alerting for production stability.
        

----------