import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { getSubscriptions, getSubscribers, toggleSubscription } from "../controllers/subscription.controller.js";

const subscriptionRouter = Router()

subscriptionRouter.route("/toggle-subscription/:videoId").post(verifyJWT, toggleSubscription)
subscriptionRouter.route("/get-channel-subscriptions/:channel").post(verifyJWT, getSubscriptions)
subscriptionRouter.route("/get-channel-subscribers/:channel").post(verifyJWT, getSubscribers)


export default subscriptionRouter