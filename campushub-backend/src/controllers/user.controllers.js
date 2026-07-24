import { asyncHandler } from '../utils/asynchandler.js';
import { ApiError } from '../utils/apiError.js';
import { User } from '../models/user.model.js';
import { Post } from '../models/post.model.js';
import { uploadOnCloudinary } from '../utils/cloudinary.js';
import { ApiResponse } from '../utils/apiResponse.js';
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
};

const generateAccessAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId).select('+password +refreshToken');

    if (!user) {
      throw new Error("User not found");
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

const registerUser = asyncHandler(async (req, resp) => {
  const { fullname, email, username, password, semester, branch } = req.body;

  if ([fullname, username, email, password].some((field) => field?.trim() === "")) {
    throw new ApiError(400, "all fields are mandatory");
  }

  const normalizedEmail = email.toLowerCase().trim();
  const normalizedUsername = username.toLowerCase().trim();

  const existedUser = await User.findOne({
    $or: [{ username: normalizedUsername }, { email: normalizedEmail }]
  });

  if (existedUser) {
    throw new ApiError(409, "user with this email or username already exists");
  }

  const avatarLocalPath = req.files?.avatar?.[0]?.path;

  if (!avatarLocalPath) {
    throw new ApiError(400, "avatar file is required");
  }

  const avatar = await uploadOnCloudinary(avatarLocalPath, 'image');

  if (!avatar) {
    throw new ApiError(400, "avatar file upload failed");
  }

  const user = await User.create({
    fullname,
    avatar: avatar.url,
    email: normalizedEmail,
    password,
    username: normalizedUsername,
    semester,
    branch
  });

  const createdUser = await User.findById(user._id);

  if (!createdUser) {
    throw new ApiError(500, "user not found");
  }

  return resp.status(201).json(
    new ApiResponse(201, createdUser, "user register successfully")
  );
});

const loginUser = asyncHandler(async (req, resp) => {
  const { email, password } = req.body;

  if (!email) {
    throw new ApiError(400, 'email is required');
  }

  
  const user = await User.findOne({ email: email.toLowerCase().trim() }).select('+password');

  if (!user) {
    throw new ApiError(404, 'user does not exist');
  }

  const isPasswordValid = await user.isPasswordCorrect(password);
  if (!isPasswordValid) {
    throw new ApiError(401, 'invalid password');
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id);

  const loggedInUser = await User.findById(user._id);

  return resp.status(200)
    .cookie("accessToken", accessToken, cookieOptions)
    .cookie("refreshToken", refreshToken, cookieOptions)
    .json(
      new ApiResponse(
        200,
        { user: loggedInUser, accessToken, refreshToken },
        "user login Successfully"
      )
    );
});


const logoutUser = asyncHandler(async (req, resp) => {
  await User.findByIdAndUpdate(
    req.user._id,
    { $unset: { refreshToken: 1 } },
    { new: true }
  );

  return resp.status(200)
    .clearCookie("accessToken", cookieOptions)
    .clearCookie("refreshToken", cookieOptions)
    .json(new ApiResponse(200, {}, "user logged Out"));
});

const refreshAccessToken = asyncHandler(async (req, resp) => {
  const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken;

  if (!incomingRefreshToken) {
    throw new ApiError(401, "unauthorized request");
  }

  try {
    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );

    const user = await User.findById(decodedToken?._id).select('+refreshToken');

    if (!user) {
   
      throw new ApiError(401, "invalid refreshToken");
    }

    if (incomingRefreshToken !== user?.refreshToken) {
      throw new ApiError(401, "Refresh Token is expired or used");
    }

    const { accessToken, newRefreshToken } = await (async () => {
      const tokens = await generateAccessAndRefreshToken(user._id);
      return { accessToken: tokens.accessToken, newRefreshToken: tokens.refreshToken };
    })();

    return resp.status(200)
      .cookie("accessToken", accessToken, cookieOptions)
      .cookie("refreshToken", newRefreshToken, cookieOptions)
      .json(
        new ApiResponse(
          200,
          { accessToken, refreshToken: newRefreshToken },
          "access Token refreshed"
        )
      );
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid refresh Token");
  }
});

const Changepassword = asyncHandler(async (req, resp) => {
  const { oldPassword, newPassword } = req.body;
  const user = await User.findById(req.user?._id).select('+password');

  if (!user) {
    throw new ApiError(404, "user not found");
  }

  const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);

  if (!isPasswordCorrect) {
    throw new ApiError(400, "invalid old password");
  }

  user.password = newPassword;
  await user.save({ validateBeforeSave: false });

  return resp
    .status(200)
    .json(new ApiResponse(200, {}, "password changed successfully"));
});

const getCurrentUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);

  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  res.status(200).json(
    new ApiResponse(200, { user }, 'Current user fetched successfully')
  );
});

const updateUserAvatar = asyncHandler(async (req, resp) => {
  const avatarLocalPath = req.file?.path;

  if (!avatarLocalPath) {
    throw new ApiError(400, "avatar file is missing");
  }

  const avatar = await uploadOnCloudinary(avatarLocalPath, 'image');


  if (!avatar) {
    throw new ApiError(400, "error while uploading avatar");
  }

  const user = await User.findByIdAndUpdate(
    req.user?._id,
    { $set: { avatar: avatar.url } },
    { new: true }
  );

  return resp
    .status(200)
    .json(
   
      new ApiResponse(200, user, "avatar updated successfully")
    );
});

const updateAccountDetails = asyncHandler(async (req, resp) => {
  const { fullname, email, phone, branch, semester, bio } = req.body;

  if (!fullname || !email) {
    throw new ApiError(400, "fullname and email are required");
  }

  const updateFields = { fullname, email: email.toLowerCase().trim() };
  if (phone !== undefined) updateFields.phone = phone;
  if (branch !== undefined) updateFields.branch = branch;
  if (semester !== undefined) updateFields.semester = semester;
  if (bio !== undefined) updateFields.bio = bio;

 
  const user = await User.findByIdAndUpdate(
    req.user?._id,
    { $set: updateFields },
    { new: true, runValidators: true }
  );

  if (!user) {
    throw new ApiError(404, "user not found");
  }

  return resp
    .status(200)
    .json(
      new ApiResponse(200, user, "Account details updated successfully")
    );
});

const getActiveUsers = asyncHandler(async (req, res) => {
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

  res.json({
    success: true,
    users: formatted,
    total: formatted.length
  });
});

const getUserStats = asyncHandler(async (req, res) => {
  const { id } = req.params;

 
  const totalViews = await Post.aggregate([
    { $match: { createdBy: new mongoose.Types.ObjectId(id) } },
    { $group: { _id: null, total: { $sum: '$views' } } }
  ]);

  res.json({
    success: true,
    totalViews: totalViews[0]?.total || 0
  });
});

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
};