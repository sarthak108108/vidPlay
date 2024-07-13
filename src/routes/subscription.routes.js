import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { toggleSubscription } from "../controllers/subscription.controller.js";

const subscriptionRouter = Router()

subscriptionRouter.route("/toggle-subscription/:videoId").post(verifyJWT, toggleSubscription)

export default subscriptionRouter