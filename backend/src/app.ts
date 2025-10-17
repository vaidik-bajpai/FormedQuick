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
import errorHandler from './middlewares/errorHandler.middleware.js';

app.use("/api/v1/auth/", authRouter)

app.use(errorHandler)

export default app;
