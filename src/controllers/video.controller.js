import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Video } from "../models/video.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.service.js";


// req.files using multer and get the local path of file using video[0].path and thumbnail
// use the local path of file and thumbnail to upload it on cloudinary
// also save fields like title, description, duration(cloudinay object), views(mongo pipelines), isPublished(boolean), videoPublisher(req.user)
// get the url from cloudinary and save it in video.url and thumbnail url , save rest of the feilds in video model using Video.create

const videoUpload = asyncHandler(async (req, res) => {
    const { title, description, isPublished } = req.body

    try {
        if (!title) {
            throw new ApiError(401, "Title can't be empty")
        }

        const videoFileLocalPath = req?.files?.videoFile[0]?.path
        const thumbNailLocalPath = req?.files?.thumbNail[0]?.path

        if (!videoFileLocalPath) {
            throw new ApiError(400, "Video required")
        }
        if (!thumbNailLocalPath) {
            throw new ApiError(400, "Thumbnail required")
        }

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
    } catch (error) {
        throw new ApiError(500, "Something went wrong while uploading video")
    }

})

// unpublishing a video

const switchVideoPrivacy = asyncHandler(async (req, res) => {

    try {
        const { videoFile, thumbNail } = req.body
    
        if (!videoFile && !thumbNail) {
            throw new ApiError(400, "file not selected")
        }
    
        const video = await Video.findOne({
            $or: [{ videoFile }, { thumbNail }]
        })
    
        if (!video) {
            throw new ApiError(404, "File not found")
        }
    
        const switchPublished = !video.isPublished
    
        await Video.findByIdAndUpdate(
            video._id,
            {
                $set: {
                    isPublished: switchPublished
                }
            },
            { new: true }
        )
    
        if (switchPublished) {
            
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

export {
    videoUpload,
    switchVideoPrivacy
}