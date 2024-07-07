import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import { changePassword, getCurrentUser, logoutUser, refreshAccessToken, registerUser, updateUser, updateUserAvatar, updateUserCoverImage, userLogin } from "../controllers/user.controller.js";
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
userRouter.route("/change-pass").post(verifyJWT, changePassword)
userRouter.route("/refresh-access-token").post(verifyJWT, refreshAccessToken)
userRouter.route("/fetch-user").post(verifyJWT, getCurrentUser)
userRouter.route("/update-user").post(verifyJWT, updateUser)
userRouter.route("/update-user-avatar").post(verifyJWT, upload.single("avatar"), updateUserAvatar)
userRouter.route("/update-user-coverImage").post(verifyJWT, upload.single("coverImage"), updateUserCoverImage)

export default userRouter