import mongoose, {Schema} from "mongoose";
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
import ms from "ms"

export interface IUser extends Document {
    username: string;
    email: string;
    password: string;
    refreshToken?: string; 
    fullName?: string;

    isPasswordCorrect(password: string): Promise<boolean>;
    generateAccessToken(): string;
    generateRefreshToken(): string;
}

const userSchema = new Schema<IUser>(
    {
        username: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        }, 
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true
        },
        password: {
            type: String,
            required: [true, "password is required"]
        },
        refreshToken: {
            type: String,
        }, 
    },
    {
        timestamps: true    
    }
)

userSchema.pre("save", async function (next) {
    if(!this.isModified("password")) return next()

    this.password = await bcrypt.hash(this.password, 10)
    next()
})

userSchema.methods.isPasswordCorrect = async function(password: string) {
    return await bcrypt.compare(password, this.password)
}

userSchema.methods.isPasswordCorrect = async function(password: string) {
    return await bcrypt.compare(password, this.password)
}

userSchema.methods.generateAccessToken = function() {
    const accessTokenExpiry = process.env.ACCESS_TOKEN_EXPIRY
    const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET
    if (!accessTokenExpiry || !accessTokenSecret) {
        throw new Error("ACCESS_TOKEN_EXPIRY or ACCESS_TOKEN_SECRET is not defined");
    }

    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            username: this.username,
            fullName: this.fullName
        },
        accessTokenSecret,
        { expiresIn: accessTokenExpiry as ms.StringValue}
    )
}

userSchema.methods.generateRefreshToken = function() {
    const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET
    const refreshTokenExpiry = process.env.REFRESH_TOKEN_EXPIRY
    if (!refreshTokenExpiry || !refreshTokenSecret) {
        throw new Error("REFRESH_TOKEN_SECRET or REFRESH_TOKEN_EXPIRY is not defined")
    }

    return jwt.sign(
        {
            _id: this._id,
        },
        refreshTokenSecret,
        {
            expiresIn: refreshTokenExpiry as ms.StringValue
        }
    )
}

export const User = mongoose.model("User", userSchema)