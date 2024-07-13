import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { toggleLike } from "../controllers/like.controller.js";

const likeRouter = Router()

likeRouter.route("/toggle-like/:videoId").post(verifyJWT, toggleLike)

export default likeRouter