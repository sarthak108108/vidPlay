import { Router } from "express";
import {upload} from "../middlewares/multer.middleware.js"
import registerUser from "../controllers/user.controller.js";

const userRouter = Router()

userRouter.route("/register").post(
    // upload.fields([
    //     {
    //         name: "avatar",
    //         maxCount: 1
    //     }, 
    //     {
    //         name: "coverImage",
    //         maxCount: 1
    //     }
    // ]),
    // registerUser
    (req, res) =>{
        res.send("router working")
        const {email, username, password, fullName} = req.body
    }
    )

export default userRouter