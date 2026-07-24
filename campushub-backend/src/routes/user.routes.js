import { Router } from "express";
import rateLimit from "express-rate-limit";
import {
  Changepassword,
  getCurrentUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  registerUser,
  updateAccountDetails,
  updateUserAvatar,
  getActiveUsers,
  getUserStats
} from "../controllers/user.controllers.js";
import { upload } from "../middleware/multer.middleware.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

const router = Router();

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many attempts, please try again later.' }
});

router.route('/register').post(
  authLimiter,
  upload.fields([
    { name: "avatar", maxCount: 1 },
  ]),
  registerUser
);

router.route('/login').post(authLimiter, loginUser);
router.route('/logout').post(verifyJWT, logoutUser);
router.route("/refresh-token").post(refreshAccessToken);
router.route("/change-password").post(verifyJWT, Changepassword);
router.route("/current-user").get(verifyJWT, getCurrentUser);
router.route("/update-account").patch(verifyJWT, upload.none(), updateAccountDetails);


router.route("/profile").put(verifyJWT, upload.none(), updateAccountDetails);

router.route("/avatar").patch(verifyJWT, upload.single("avatar"), updateUserAvatar);
router.route("/active").get(verifyJWT, getActiveUsers);
router.route("/:id/stats").get(verifyJWT, getUserStats);

export default router;
