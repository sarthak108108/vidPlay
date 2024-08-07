import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
// import { User } from "../models/user.model.js";
import { Video } from "../models/video.model.js";
import { Like } from "../models/like.model.js";

// toggle like on video

const toggleLike = asyncHandler (async( req, res) => {
    const { videoId } = req.params
    const userId = req.user._id
    const video = await Video.findById(videoId)

    if(!videoId){
        throw new ApiError(404, "video not found")
    }

    const isLiked = await Like.aggregate([
        {
            $match: {
                likedBy : userId
            }
        },
        {
            $match: {
                video: video._id
            }
        },
        {
            $count: "liked"
        }
    ])


    if(isLiked[0]){
        const like = await Like.aggregate([
            {
                $match: {
                    likedBy : userId
                }
            },
            {
                $match: {
                    video: video._id
                }
            }
        ])
        await Like.deleteOne(like[0])

        return res
        .status(200)
        .json(new ApiResponse(200, {}, "video removed from liked videos"))
    }else {
        const likedVideo = await Like.create({
            video: videoId,
            likedBy: userId
        })

        return res
        .status(200)
        .json(new ApiResponse(200, likedVideo, "added to liked videos"))
    }
})

const getLikedVideos = asyncHandler(async(req, res) => {
    const userId = req.user._id

    const likedVideos = await Like.aggregate([
        {
            $match: {
                likedBy : userId
            }
        }
    ])

    console.log(likedVideos)

    if(likedVideos.length == 0){
        return res
        .status(200)
        .json({"message": "No liked videos"})
    } else {
        return res
        .status(200)
        .json(new ApiResponse(200, likedVideos, "liked videos fetched successfully"))
    }
})

const getVideoLikes = asyncHandler(async(req, res, next) => {
    const { videoId } = req.params
    const video = await Video.findById(videoId)

    const likestemp = await Like.aggregate([
        {
            $match: {
                video: video._id
            }
        },
        {
            $count: "likes"
        }
    ])

    const likes = likestemp[0]


    req.params = {likes, videoId}
    
    next()

})

export {
    toggleLike,
    getLikedVideos,
    getVideoLikes
}