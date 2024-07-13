import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { getSubscriptions, toggleSubscription } from "../controllers/subscription.controller.js";

const subscriptionRouter = Router()

subscriptionRouter.route("/toggle-subscription/:videoId").post(verifyJWT, toggleSubscription)
subscriptionRouter.route("/get-channel-subscriptions/:channel").post(verifyJWT, getSubscriptions)

export default subscriptionRouter