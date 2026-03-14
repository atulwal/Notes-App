import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
import mongoose from "mongoose"
import {asyncHandler} from "../utils/asyncHandler.js"
import { ApiError } from "../utils/apiError.js"
import { ApiRes } from "../utils/ApiRes.js"
import {User} from "../models/user.model.js"

const generateAccessAndRfreshTokens = asyncHandler(async (userId) => {
    try {
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken
        user.save = ({ validateBeforeSave: true})
        return {accessToken, refreshToken}
    } catch (error) {
        throw new ApiError(500, "Something went wrong");
        
    }
})

const registerUser = asyncHandler(async (req, res) => {
    //get user details from frontend
    // validate - non empty
    // check if any user already exists - username, email
    // create user object for to create entry in db
    // remove password and refreh token field from response
    // check for user creation
    // return res

    const {username, fullName, email, password} = req.body
    console.log("email: ", email); //1

    const existedUser = await User.findOne({
        $or: [{username}, {email}, ]
    })
    if (existedUser) {
        throw new ApiError(409, "User already exists");
        
    }

    if (
        [fullName, email, username, password].some((field) => field?.trim() === "")
    ) {
        throw new ApiError(400, "All fields are required");
    }
    if(!email.includes('@')){
        throw new ApiError(400, "Invalid email adddress");
    }

    const user = await User.create({
        fullName,
        email,
        password,
        username: username.toLowerCase()
    })

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )
    if(!createdUser){
        throw new ApiError(500, "Something went wrong while registering");
    }

    return res.status(201).json(
        new ApiRes(200, createdUser, "User registered successfullly")
    )

})

const loginUser = asyncHandler(async (req, res) => {
    // req body -> data
    // username or email
    // find the user
    // password check

    const {username, password, email} = req.body

    if(!username && !email){
        throw new ApiError(400, "Username or email required");
    }

    const user = await User.findOne({
        $or: [{username}, {email}]
    })

    if(!user){
        throw new ApiError(400, "User does not exist");
    }
     
    const isPasswordValid = await user.isPasswordCorrect(password)

    if(!isPasswordValid){
        throw new ApiError(401, "Invalid user credentials");
    }

    const {accessToken, refreshToken} = generateAccessAndRfreshTokens(user_id)
    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

    const options = {
        httpOnly: true,
        secure: true
    }
    return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken)
    .json(
        new ApiRes(
            200, 
            {
                user: loggedInUser, accessToken, refreshToken
            },
            "User logged in successfully"
        )
    )
})


export {
    registerUser,
    loginUser,
}