import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
}))

app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(cookieParser())

import authRouter from "./routes/auth.routes.js"
import formRouter from "./routes/forms.routes.js"
import errorHandler from './middlewares/errorHandler.middleware.js';

app.use("/api/v1/auth/", authRouter)
app.use("/api/v1/form/", formRouter)

app.use(errorHandler)

export default app;
