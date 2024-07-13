import express from "express"
import cookieParser from "cookie-parser"
import cors from "cors"



const app = express()

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
}))

app.use(express.json({limit: "16kb"}))
app.use(express.urlencoded({
    extended: true,
    limit: "16kb"
}))
app.use(express.static("public"))

app.use(cookieParser())

//importing userRouter

import userRouter from "./routes/user.routes.js"

// routes declaration

app.use("/users", userRouter)

//  http://localhost:5000/users/register

//videoRouter

import videoRouter from "./routes/video.routes.js"

// routes declaration

app.use("/videos", videoRouter)

// import likeRouter

import likeRouter from "./routes/like.routes.js"

// like router route declaration

app.use("/likes", likeRouter)

export { app }