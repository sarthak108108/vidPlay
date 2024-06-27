import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.service.js";
import { ApiResponse } from "../utils/ApiResponse.js";


const registerUser = asyncHandler(async (req, res) => {
    // get user details from user-frontend/postman
    // validate data feilds - check if empty
    // check if user already exists - username || email
    // check if avatar and cover images uploaded to cloudinary successfully
    // create user in mongoDB - user object
    // remove password and refresh token from response before sending it
    // check for user creation
    // return res

    const { email, username, password, fullName } = req.body  // user details taken

    if (email === "" || username === "" || password === "" || fullName === "") {
        throw new ApiError(400, "All feilds are required")  // validation checked
    }

    const existedUser = await User.findOne({  // checking if user already exists
        $or: [{ username }, { email }]
    })
    if (existedUser) {
        throw new ApiError(409, "User with email or username already exists")
    }

    const avatarLocalPath = req?.files?.avatar[0]?.path;
    //const coverImageLocalPath = req.files?.coverImage[0]?.path;

    let coverImageLocalPath;
    if (!(req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0)) {
        user.remove?.coverImageLocalPath
    } else {
        coverImageLocalPath = req.files.coverImage[0].path
    }


    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar required")
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath);
    const coverImage = await uploadOnCloudinary(coverImageLocalPath);
    if (!avatar) {
        throw new ApiError(400, "avatar not uploaded")
    }

    const user = await User.create({
        fullName,
        avatar: avatar.url,
        coverImage: coverImage.url,
        email,
        username: username.toLowerCase(),
        password
    })

    const createdUser = await User.findById(user._id).select("-password -refreshToken")

    if (!createdUser) {
        throw new ApiError(500, "Something went wrong")
    }

    return res.status(200).json(
        new ApiResponse(201, createdUser, "User registered successfully")
    )

})



export { registerUser }