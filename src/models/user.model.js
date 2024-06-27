import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt"

const UserSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        index: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    fullName: {
        type: String,
        required: true,
        trim: true,
        index: true
    },
    avatar: {
        type: String,  //cloudinary link
        required: true
    },
    coverImage: {
        type: String,  //cloudinary link
        unique: true
    },
    watchHistory:
        [
            {
                type: Schema.Types.ObjectId,
                ref: "Video"
            }
        ],
    password: {
        type: String,
        required: [true, "Password is Required"]
    },
    refreshToken: {
        type : String,
        // required: true
    }
}, { timestamps: true })

UserSchema.pre("save", async function (next) {
    if(!this.isModified("password")) return next();

    this.password = await bcrypt.hash(this.password, 10)
    next()
})

UserSchema.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password, this.password)
}

UserSchema.methods.generateAccessToken = async function(){
    jwt.sign({
        _id: this._id,
        email: this.email,
        username: this.username,
        fullName: this.fullName
    },
    process.env.ACCESS_TOKEM_SECRET,
    {
        expiresIn: process.env.ACCESS_TOKEM_EXPIRY
    }
)
}
UserSchema.methods.generateRefreshToken = async function(){
    jwt.sign({
        _id: this._id,
    },
    process.env.REFRESH_TOKEM_SECRET,
    {
        expiresIn: process.env.REFRESH_TOKEM_EXPIRY
    }
)
}

export const User = mongoose.model("User", UserSchema)