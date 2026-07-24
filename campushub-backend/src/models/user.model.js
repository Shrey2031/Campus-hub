import mongoose, { Schema } from "mongoose";
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      lowercase: true,
      unique: true,
      trim: true,
      index: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    fullname: {
      type: String,
      required: true,
      trim: true,
      index: true
    },
    avatar: {
      type: String,
    },
    phone: {
      type: String,
      trim: true
    },
    bio: {
      type: String,
      trim: true,
      maxlength: 300
    },
    branch: {
      type: String,
      required: true
    },
    semester: {
      type: Number,
      required: true,
      min: 1,
      max: 8
    },
    password: {
      type: String,
      required: [true, "password is required"],
      select: false
    },

    postCount: { type: Number, default: 0 },
    commentsCount: { type: Number, default: 0 },
    resourcesCount: { type: Number, default: 0 },
    refreshToken: {
      type: String,
      select: false
    },
    isOnline: {
      type: Boolean,
      default: false
    },
    lastActive: {
      type: Date,
      default: Date.now
    },
    socketId: {
      type: String
    },
    status: {
      type: String,
      enum: ['online', 'away', 'busy', 'offline'],
      default: 'offline'
    },
    isDeleted: {
      type: Boolean,
      default: false
    }
  },

  { timestamps: true }
);

userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 10);
});


userSchema.pre(/^find/, function () {
  if (this.getFilter().isDeleted === undefined) {
    this.where({ isDeleted: { $ne: true } });
  }
});

userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY
    }
  );
};

userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      _id: this._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY
    }
  );
};

export const User = mongoose.model('User', userSchema);