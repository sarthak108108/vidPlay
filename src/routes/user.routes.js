import { Router } from "express";
import {upload} from "../middlewares/multer.middleware.js";
import {logoutUser, registerUser, userLogin} from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const userRouter = Router()

userRouter.route("/register").post(
        upload.fields([
            {
                name: "avatar",
                maxCount: 1
            },
            {
                name: "coverImage",
                maxCount: 1
            }
        ]),
        registerUser
    )

userRouter.route("/login").post(userLogin)

// secured routes 

userRouter.route("/logout").post(verifyJWT, logoutUser)
export default userRouter