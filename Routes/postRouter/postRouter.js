const express = require("express");
const {
  postcreatedControl,
  postlistControl,
  singlepostidControl,
  postdeletedConrol,
  postupdatedControl,
} = require("../../control/posts/postsControl");
const Authentication = require("../../middleware/Authentication");
const uplodimage = require("../../config/multer");
const Posts = require("../../model/posts/Posts");
const postRouter = express.Router();
//!
postRouter.get("/create-post", (req, res) => {
  res.render("posts/addPost.ejs", { error: "" });
});
postRouter.get("/update-post/:id", async (req, res) => {
  try {
    const post = await Posts.findById(req.params.id);
    res.render("posts/updatePost.ejs", { post, error: "" });
  } catch (error) {
    res.render("posts/updatePost.ejs", { error: error.message });
  }
});
//!

postRouter.post(
  "/",
  Authentication,
  uplodimage.single("postImage"),
  postcreatedControl
);
postRouter.get("/", postlistControl);
postRouter.get("/:id", singlepostidControl);
postRouter.delete("/:id", Authentication, postdeletedConrol);
postRouter.put(
  "/:id",
  Authentication,
  uplodimage.single("updateImage"),
  postupdatedControl
);

module.exports = postRouter;
