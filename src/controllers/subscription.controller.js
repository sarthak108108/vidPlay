import { Subscription } from "../models/subscription.model.js";
import { Video } from "../models/video.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const isSubscribed = async (videoId, user) => {
    const video = await Video.findById(videoId)
    const channel = video.videoPublisher

    const isSubscribed = await Subscription.aggregate([  // will return a number 
        {
            $match: {
                subscriber: user
            }
        },
        {
            $match: {
                channel: channel
            }
        }
    ])

    console.log(isSubscribed)

    if (isSubscribed[0]) {
        return isSubscribed[0]
    } else {
        return 0
    }
}

const toggleSubscription = asyncHandler(async (req, res) => {
    try {
    const { videoId } = req.params
    const user = req.user._id

    const video = await Video.findById(videoId)
    const channel = video.videoPublisher

    const subTemp = await isSubscribed(videoId, user)

    console.log(subTemp)

    if (subTemp) {
        // remove subscription

        await Subscription.deleteOne(subTemp)


        return res
            .status(200)
            .json(new ApiResponse(200, {}, "subscription removed"))
    } else {
        // add subscription
        const subscription = await Subscription.create({
            subscriber: user,
            channel
        })

        return res
            .status(200)
            .json(new ApiResponse(200, subscription, "new subscription added"))
    }
    } catch (error) {
    throw new ApiError(500, "something went wrong")
    }

})

const getSubscriptions = asyncHandler(async (req, res) => {
    
    try {
        const { channel } = req.params
        const user = await User.findById(channel)
    
        const subscriptions = await Subscription.aggregate([
            {
                $match: {
                    subscriber: user._id
                }
            }
        ])
    
        const totalSubscriptions = subscriptions.length
    
        console.log(subscriptions, totalSubscriptions, channel)
    
        return res
        .status(200)
        .json(new ApiResponse(200, {subscriptions,totalSubscriptions}, "subscriptions fetched succesfully"))
    } catch (error) {
        throw new ApiError(400, "channel not found")
    }
})

const getSubscribers = asyncHandler(async (req, res) => {
    try {
        const { channel } = req.params
        const user = await User.findById(channel)
    
        const subscribers = await Subscription.aggregate([
            {
                $match: {
                    channel: user._id
                }
            }
        ])
    
        const totalSubscribers = subscribers.length
    
        return res
        .status(200)
        .json(new ApiResponse(200, {totalSubscribers}, "subscribers fetched succesfully"))
    } catch (error) {
        throw new ApiError(400, "channel not found")
    }
})


export {
    toggleSubscription,
    getSubscriptions,
    getSubscribers,
    isSubscribed


}