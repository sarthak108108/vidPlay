import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { getLikedVideos, toggleLike } from "../controllers/like.controller.js";

const likeRouter = Router()

likeRouter.route("/toggle-like/:videoId").post(verifyJWT, toggleLike)
likeRouter.route("/get-liked-videos").post(verifyJWT, getLikedVideos)

export default likeRouter