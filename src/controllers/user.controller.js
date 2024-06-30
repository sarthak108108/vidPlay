import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.service.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";

//Global const
const options = {
    httpOnly: true,
    secure: true
}

const generateAccessAndRefreshToken = async (userId) => {
    try {
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken
        user.save({ validateBeforeSave: false })

        return { accessToken, refreshToken }

    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating tokens")
    }
}

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

const userLogin = asyncHandler(async (req, res) => {

    // todos:
    // get data from body (username||email and password)
    // check if username && email not entered
    // check if user exixts
    // check isPasswordCorrect
    // generate accesstoken / refreshtoken and pass to user as cookies
    // send response as "user logged in"

    const { email, username, password} = req.body  // getting data from body
    console.log(username)

    if (!username && !email) {  // validation on entered fields
        throw new ApiError(400, "username or email is required")
    }
    const user = await User.findOne({
        $or: [{ username }, { email }]
    })

    console.log(user)

    if (!user) {
        throw new ApiError(404, "user not found")
    }

    const passwordCompare = await user.isPasswordCorrect(password)

    if (!passwordCompare) {
        throw new ApiError(401, "invalid login details")
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id)
    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")
    console.log(refreshToken, accessToken)


    res.status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(
                200,
                {
                    user: loggedInUser, refreshToken, accessToken
                },
                "User logged in"
            )
        )

})

const logoutUser = asyncHandler(async (req, res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $set: {
                refreshToken: undefined
            }
        },
        {
            new: true
        }
    )

    return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(
            new ApiResponse(200, {}, "User logged out")
        )
})

const refreshAccessToken = asyncHandler(async(req, res) => {
    //request refresh token from user (Cookies)
    //run a databse call and get refresh token from user schema
    //compare the two and if refresh token from user and db matches run generateaccessandrefreshtoken
    //send new cookies

    try {
        const userRefreshToken = req.cookies?.refreshToken || req.body?.refreshToken    //request refresh token from user (Cookies)
    
    
        if(!userRefreshToken){
            throw new ApiError(401, "Unauthorised Request")
        }
    
        const refrenceRefreshToken = jwt.verify(userRefreshToken, process.env.REFRESH_TOKEN_SECRET)
    
        const user = await User.findById(refrenceRefreshToken._id)    //run a databse call and get refresh token from user schema
    
        if(!user){
            throw new ApiError(404, "User not found")
        }
    
        if(userRefreshToken !== user?.refreshToken){
            throw new ApiError(401, "Token already used/expired")
        }
    
        const {accessToken, refreshToken} = await generateAccessAndRefreshToken(user._id)    //compare the two and if refresh token from user and db matches run generateaccessandrefreshtoken
    
    
        return res    //send new cookies
        .status(200)
        .cookie("accessToken",accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(200,{
            accessToken, refreshToken
        }, "accessToken refreshed")
    } catch (error) {
        throw new ApiError(500, "Internal Server Error")
    }
})

const changePassword = asyncHandler(async (req, res) => {
    // take old password new password and confirm password fields from body
    // validate if newpass and confpass are same
    // run isPasswordCorrect to compare oldpass and password stored in db
    // update user.password with newpass and save
    // return a response

    const {oldPass, newPass, confPass} = req.body

    if (newPass !== confPass){
        throw new ApiError(409, "New password and Confirm password must be same")
    }

    const user = await User.findById(req.user?._id)

    const passwordCompare = await user.isPasswordCorrect(oldPass)

    if(!passwordCompare){
        throw new ApiError(409, "Invalid old password")
    }

    user.password = newPass
    await user.save({validateBeforeSave: false})

    return res
    .status(200)
    .json(new ApiResponse(201, {passwordCompare}, "Password changed successfully"))

})

const getCurrentUser = asyncHandler(async(req, res) => {
    return res
    .status(200)
    .json(new ApiResponse(
        200,
        req.user,
        "User fetched successfully"
    ))
})

const updateUser = asyncHandler(async(req, res) => {
    const {fullName, email} = req.body

    if (!fullName || !email){
        throw new ApiError(408, "fullName and email are required")
    }

    const updatedUser = await User.findByIdAndUpdate(
        req.user?._id,
        {
            fullName: fullName,
            email: email
        },
        {new: true}
    ).select("-password -refreshToken")

    return res
    .status(200)
    .json(new ApiResponse(201, updatedUser, "User details Updated"))
})


export {
    registerUser,
    userLogin,
    logoutUser,
    refreshAccessToken,
    changePassword,
    getCurrentUser,
    updateUser
}