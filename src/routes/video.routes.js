import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

import { videoUpload, switchVideoPrivacy, getVideo } from "../controllers/video.controller.js";

const videoRouter = Router()

videoRouter.route("/video-upload").post(
    verifyJWT,
    upload.fields([
        {
            name: "videoFile",
            maxCount: 1
        },
        {
            name: "thumbNail",
            maxCount: 1
        }
    ]),
    videoUpload)

videoRouter.route("/watch/:videoId").get(verifyJWT, getVideo)
videoRouter.route("/switch-privacy/:videoId").post(verifyJWT, switchVideoPrivacy)

export default videoRouter