import { asyncHandler } from "../utils/asyncHandler.js";

const registerUser = asyncHandler(async (req, res) => {
    // get user details from user
    // validate data feilds - check if empty
    // check if user already exists - username || email
    // check if avatar and cover images uploaded to cloudinary successfully
    // create user in mongoDB - user object
    // remove password and refresh token from respons before sending it
    // check for user creation
    // return res

    const { email, username, password, fullName } = req.body
    console.log(email, username)
    })

export { registerUser }