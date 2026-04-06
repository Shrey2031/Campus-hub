import {asyncHandler} from '../utils/asynchandler.js';
import {ApiError} from '../utils/apiError.js';
import {User} from '../models/user.model.js'
import {uploadOnCloudinary} from '../utils/cloudinary.js';
import { ApiResponse } from '../utils/apiResponse.js';
import jwt from "jsonwebtoken";
import mongoose from 'mongoose';

// const generateAccessAndRefreshToken = async(userId) =>{
//     try {
//        const user = await User.findById(userId)
//        const accessToken = user.generateAccessToken()
//        const refreshToken = user.generateRefreshToken()

//        user.refreshToken = refreshToken;
//       await  user.save({validateBeforeSave: false})

//        return {accessToken,refreshToken}

//     } catch (error) {
//         throw new ApiError(500,'something went wrong while generating refresh and access token')
//     }
// }

const generateAccessAndRefreshToken = async (userId) => {
    try {
        const user = await User.findById(userId);

        if (!user) {
            throw new Error("User not found");
        }

        if (!user.generateAccessToken || !user.generateRefreshToken) {
            throw new Error("Token methods not defined in model");
        }

        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        user.refreshToken = refreshToken;

        await user.save({ validateBeforeSave: false });

        return { accessToken, refreshToken };

    } catch (error) {
        console.log("REAL ERROR 👉", error);
        throw new Error("Token generation failed");
    }
};

const registerUser = asyncHandler(async (req,resp) => {
   // get user details from frontend
   //validation - not empty
   // check if user already exists: username, email
   // check for images , check for avatar
   //upload them to cloudinary , avatar
   // create user object - create entry in db
   // remove password and refresh token field from response
   //check for user creation
   // return res

   const {fullname,email,username,password,semester,branch} = req.body


   if(
       [fullname,username,email,password].some((field) => field?.trim() === "" )

   ){
             throw new ApiError (400,"all fields are mandatory")
   }

   const existedUser = await User.findOne({
     $or: [{ username: username }, { email: email }] 
    })

    if(existedUser){
        throw new  ApiError(409, "user with email and password already exist")
    }

   const avatarLocalPath = req.files?.avatar[0]?.path;

if(!avatarLocalPath){

        throw new  ApiError(400, "avtarlocalpath  file is required ")
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath);
    
    if(!avatar){
        throw new  ApiError(400, "avtar file is required ");

    }

     const user = await User.create({
        fullname,
        avatar: avatar.url,
        email,
        password,
        username: username,
        semester,
        branch
    })

    const createdUser = await  User.findById(user._id).select(
        "-password -refreshToken"
    )

    if(!createdUser){
        throw new ApiError(500, "user not found")
    }

    return resp.status(201).json(
        new ApiResponse(200,createdUser,"user register successfully")
    )

})



const loginUser = asyncHandler(async(req,resp) => {
   // req.body -> data
   //username or  email
   // find the user
   // password check
   // access and refresh token
   // send cookie


   const {email,password} = req.body;
   console.log(email);
   if( !email){
    throw new ApiError(400,'email is required')
   }

   const user = await User.findOne({
    $or:[{email}]
   })

   if(!user){
    throw new ApiError(404,'user does not exist')
   }

   const isPasswordValid = await user.isPasswordCorrect(password);
   if(!isPasswordValid){
    throw new ApiError(401,'invalid password')
   }

   const {accessToken,refreshToken} = await generateAccessAndRefreshToken(user._id);

   const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

   const options = {
    httpOnly: true,
    secure: true

   }

   return resp.status(200)
   .cookie("accessToken",accessToken,options)
   .cookie("refreshToken",refreshToken,options)
   .json(
     new ApiResponse(
        200,
        {
            user:loggedInUser,accessToken,refreshToken
        },
        "user login Successfully"
     )
   )
   
})

const logoutUser = ( async (req,resp) => {
    await  User.findByIdAndUpdate(
        req.user._id,
        {
            $unset:{
                refreshToken: 1
            }
        },
        {
            new:true
        }
    )

    const options = {
        httpOnly: true,
        secure: true
    
       }

   return resp.status(200)
    .clearCookie("accessToken",options)
    .clearCookie("refreshToken",options)
    .json(new ApiResponse(200,{},"user logged Out"))

})


const refreshAccessToken = asyncHandler(async (req,resp) => {
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken

    if(!incomingRefreshToken){
        throw new ApiError(401,"unauthorized request")
    }

   try {
    const decodedToken =  jwt.verify(
         incomingRefreshToken,
         process.env.REFRESH_TOKEN_SECRET
 
     )
 
     const user = User.findById(decodedToken?._id);
 
     if(!user){
         throw new ApiError("invalid refreshToken")
     }
 
     if(incomingRefreshToken !== user?.refreshToken){
         throw new ApiError(401,"Refresh Token is expired or used")
     }
 
     const options ={
         httpOnly: true,
         secure: true
     }
 
    const {accessToken,newRefreshToken} = await generateAccessAndRefreshToken(user._id)
    return resp.status(200)
    .cookie("accessToken",accessToken,options)
    .cookie("refreshToken",newRefreshToken,options)
    .json(
     new ApiResponse(
        200,
        
            {accessToken, refreshToken:newRefreshToken},
            "access Token refreshed"
        
        
     )
   )
   } catch (error) {
      throw new ApiError(401,error?.message || "Invalid refresh Token")
   }



})

const Changepassword = asyncHandler(async(req,resp) => {
    const {oldPassword,newPassword} = req.body
    const user = await User.findById(req.user?._id);
    const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);


    if(!isPasswordCorrect){
        throw new ApiError(400,"invalid old password")
    }

    user.password = newPassword;
    await user.save({validateBeforeSave: false});

    return resp
    .status(200)
    .json(new ApiResponse(200,{},"password changed successfully"))
})

const getCurrentUser = asyncHandler(async(req,resp) => {
     return resp
     .status(200)
     .json(200,req.user,"current user fetched successfully")
})
const updateUserAvatar = asyncHandler(async(req,resp) => {
    const avtarLocalpath =  req.file?.path

    if(!avtarLocalpath){
        throw new ApiError(400,"avatar file is missing")

    }

    const avatar = await uploadOnCloudinary(avtarLocalpath)
    if(!avatar.url){
        throw new ApiError(400,"error while uploading on  avatar")
    }

  const user =   await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set:{
                avatar : avatar.url
            }
        },{new:true}
    ).select("-password")

    return resp
    .status(200)
    .json(
        new ApiResponse(200,req.user,"coverImage updated  successfully")
    )
})
const updateAccountDetails  = asyncHandler(async(req,resp) => {
    const {fullName,email} = req.body

    if(!fullName || !email){
        throw new ApiError(400,"all fields are required")
    }

    const user = User.findByIdAndUpdate(
        req.user?._id,
        {
            $set:{
                fullName,
                email:email
            }
        },
        {new:true}
    ).select("-password")
    
    return resp
    .status(200)
    .json(
        new ApiResponse(200,req.user,"Account details update successfully")
    )
    // .json(new ApiResponse(200,user,"Account details update successfully"))
})

export {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    Changepassword,
    getCurrentUser,
    updateUserAvatar,
    updateAccountDetails
}