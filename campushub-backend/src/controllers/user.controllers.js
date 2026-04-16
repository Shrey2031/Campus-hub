import {asyncHandler} from '../utils/asynchandler.js';
import {ApiError} from '../utils/apiError.js';
import {User} from '../models/user.model.js'
import {uploadOnCloudinary} from '../utils/cloudinary.js';
import { ApiResponse } from '../utils/apiResponse.js';
import jwt from "jsonwebtoken";


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

// const getCurrentUser = asyncHandler(async(req,resp) => {
//      return resp
//      .status(200)
//      .json(200,req.user,"current user fetched successfully")
// })
const getCurrentUser = asyncHandler(async (req, res) => {
  try {
    // ✅ Fetch complete user (exclude password)
    const user = await User.findById(req.user.id).select('-password');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // ✅ CORRECT response format
    res.status(200).json({
      success: true,
      message: 'Current user fetched successfully',
      data: {
        user: {
          id: user._id,
          username: user.username,
          fullname: user.fullname,
          email: user.email,
          avatar: user.avatar,
          branch: user.branch,
          semester: user.semester,
          stats: user.stats // If you have stats
        }
      }
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
});
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

// controllers/userController.js
//  const getActiveUsers = async (req, res) => {
//   try {
//     const fifteenMinutesAgo = new Date(Date.now() - 15 * 60 * 1000);
    
//     const activeUsers = await User.find({
//       $or: [
//         { isOnline: true },
//         { lastActive: { $gte: fifteenMinutesAgo } }
//       ],
//       isDeleted: false
//     })
//     .select('fullname avatar branch semester isOnline lastActive status')
//     .sort({ 
//       isOnline: -1,
//       lastActive: -1 
//     })
//     .limit(8)
//     .lean();

//     const formatted = activeUsers.map(user => ({
//       _id: user._id,
//       fullname: user.fullname,
//       avatar: user.avatar || '/default-avatar.png',
//       branch: user.branch,
//       semester: `${user.semester}th Sem`,
//       status: user.isOnline ? 'online' : 'recent'
//     }));

//     res.json({
//       success: true,
//       users: formatted,
//       total: formatted.length
//     });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };
// controllers/userController.js - Include recent users too
const getActiveUsers = async (req, res) => {
  try {
    const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000);
    
    const activeUsers = await User.find({
      $or: [
        { isOnline: true },
        { lastActive: { $gte: thirtyMinutesAgo } }
      ]
    })
    .select('fullname avatar branch semester isOnline')
    .sort({ isOnline: -1, lastActive: -1 })
    .limit(8)
    .lean();

    const formatted = activeUsers.map(user => ({
      _id: user._id,
      fullname: user.fullname,
      avatar: user.avatar || 'https://via.placeholder.com/44',
      branch: user.branch,
      semester: `${user.semester}th Sem`,
      status: user.isOnline ? 'online' : 'recent'
    }));

    console.log(`👥 Found ${formatted.length} active users`);  // ✅ Debug

    res.json({
      success: true,
      users: formatted,
      total: formatted.length
    });
  } catch (error) {
    console.error('Active users error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

 const getUserStats = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Total views across all posts/resources
    const totalViews = await Post.aggregate([
      { $match: { createdBy: id } },
      { $group: { _id: null, total: { $sum: '$views' } } }
    ]);

    res.json({
      success: true,
      totalViews: totalViews[0]?.total || 0
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
export {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    Changepassword,
    getCurrentUser,
    updateUserAvatar,
    updateAccountDetails,
    getActiveUsers,
    getUserStats
}