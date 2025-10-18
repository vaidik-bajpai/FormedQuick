import { User } from "./src/models/auth.model.ts";

declare global {
    namespace Express {
        interface Request {
            user?: User,
        }
    }
}