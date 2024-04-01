const express = require("express");
const {
  registerContol,
  loginControl,
  useridControl,
  profileidControl,
  profileuploadControl,
  coverimageControl,
  passwordControl,
  user_updateControl,
  logoutControl,
  loginform,
  registerform,
  // profilepage,
  uploadprofilepic,
  uploadcoverphoto,
  passwordupdate,
} = require("../../control/user/userControl");
const Authentication = require("../../middleware/Authentication");
const uplodimage = require("../../config/multer");
const userRouter = express.Router();
//!
// render loginform
userRouter.get("/login", loginform);
userRouter.get("/register", registerform);
// userRouter.get("/profile-page", profilepage);
userRouter.get("/upload-profile-pic", uploadprofilepic);
userRouter.get("/upload-cover-pic", uploadcoverphoto);
userRouter.get("/password-change", passwordupdate);
//!
//api for register
userRouter.post("/register", registerContol);
//api for login
userRouter.post("/login", loginControl);
//api for profile:id
userRouter.get("/profile-page", profileidControl);
//api for single user
userRouter.put(
  "/profile-upload",
  Authentication,
  uplodimage.single("profile"),
  profileuploadControl
);
//api for cover
userRouter.put(
  "/cover-upload",
  Authentication,
  uplodimage.single("coverimage"),
  coverimageControl
);
//api for change password
userRouter.put("/update-password", Authentication, passwordControl);
userRouter.put("/update", Authentication, user_updateControl);
userRouter.get("/logout", logoutControl);
//api for single user
userRouter.get("/:id", useridControl);
//api for ser logout

module.exports = userRouter;
