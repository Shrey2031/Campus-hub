import { Router } from "express";
import { Changepassword,
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

const router =  Router();

router.route('/register').post(
    upload.fields([
        {
            name: "avatar",
            maxCount: 1
        },
    ]),
    registerUser

)

router.route('/login').post(loginUser);
router.route('/logout').post(verifyJWT,logoutUser);
router.route("/refresh-token").post(refreshAccessToken);
router.route("/change-password").post(verifyJWT,Changepassword);
router.route("/current-user").get(verifyJWT,getCurrentUser);
router.route("/update-account").patch(verifyJWT,updateAccountDetails);
router.route("/avatar").patch(verifyJWT,upload.single("avatar"),updateUserAvatar);
router.route("/active").get(verifyJWT,getActiveUsers);
router.route("/:id/stats").get(verifyJWT,getUserStats);





export default router;
