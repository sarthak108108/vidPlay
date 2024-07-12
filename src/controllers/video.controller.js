import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Video } from "../models/video.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.service.js";
import { User } from "../models/user.model.js";
import { PassThrough } from "stream";


// req.files using multer and get the local path of file using video[0].path and thumbnail
// use the local path of file and thumbnail to upload it on cloudinary
// also save fields like title, description, duration(cloudinay object), views(mongo pipelines), isPublished(boolean), videoPublisher(req.user)
// get the url from cloudinary and save it in video.url and thumbnail url , save rest of the feilds in video model using Video.create

const videoUpload = asyncHandler(async (req, res) => {
    const { title, description, isPublished } = req.body

    if (!title) {
        throw new ApiError(401, "Title can't be empty")
    }
    if (!req.files?.videoFile[0]?.path) {
        throw new ApiError(400, "Video required")
    }
    if (!req?.files?.thumbNail[0]?.path) {
        throw new ApiError(400, "Thumbnail required")
    }

    const videoFileLocalPath = req?.files?.videoFile[0]?.path
    const thumbNailLocalPath = req?.files?.thumbNail[0]?.path


    
    const videoFile = await uploadOnCloudinary(videoFileLocalPath);
    const thumbNail = await uploadOnCloudinary(thumbNailLocalPath);

    const videoPublisher = req.user?._id

    const videoObject = await Video.create({
        videoFile: videoFile.url,
        thumbNail: thumbNail.url,
        title,
        description,
        isPublished,
        videoPublisher
    })

    const uploadedVideo = await Video.findById(videoObject._id).select("-videoPublisher")

    return res
        .status(200)
        .json(new ApiResponse(201, uploadedVideo, "Uploaded successfully"))

})

// unpublishing a video

const switchVideoPrivacy = asyncHandler(async (req, res) => {

    try {
        const { videoId } = req.params

        if (!videoId) {
            throw new ApiError(400, "file not selected")
        }

        const video = await Video.findById(videoId)

        if (!video) {
            throw new ApiError(404, "File not found")
        }

        const switchPublished = video.isPublished

        await Video.findByIdAndUpdate(
            video._id,
            {
                $set: {
                    isPublished: !switchPublished
                }
            },
            { returnOriginal: false }
        )

        if (!switchPublished) {

            return res
                .status(200)
                .json(new ApiResponse(200, {}, "video is set to public"))
        } else {

            return res
                .status(200)
                .json(new ApiResponse(200, {}, "Video set to private"))
        }

    } catch (error) {
        throw new ApiError(500, "error while updating")
    }
})

const updateVideoFields = asyncHandler(async (req, res) => {
    // get updated feilds from user and video url
    // get video url to search for video document in videos model
    // update feilds and save
})

const deleteVideo = asyncHandler(async (req, res) => {
    // get video url from user
    // find video document with url
    // delete document using id
})

const getVideo = asyncHandler(async (req,res) => {
    const { videoId } = req.params

    const user = await User.findById(req.user._id)
    const video = await Video.findById(videoId)
    const channel = await User.findById(video.videoPublisher).select("-password -refreshToken")

    if(!video){
        throw new ApiError(500, "Video not found")
    }

    const checkView = await user.watchHistory.includes(videoId)


    if(!checkView){  // updates video views and user wathHistory
        await User.updateOne(
        {_id: user._id},
        { $push: {watchHistory: videoId}}
    )
        const views = 1 + (await video.views)

        await Video.findByIdAndUpdate(
            videoId,
            {
                $set:{
                views: views
                }
            },
            {
                new: true
            }
        )
    }



    return res
    .status(200)
    .json(new ApiResponse(201, {video, channel}, "success"))
    
})

export {
    videoUpload,
    switchVideoPrivacy,
    updateVideoFields,
    deleteVideo,
    getVideo
}