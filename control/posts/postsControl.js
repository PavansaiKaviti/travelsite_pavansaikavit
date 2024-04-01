const Posts = require("../../model/posts/Posts");
const User = require("../../model/user/User");
const appEr = require("../../utils/appEr");

const postcreatedControl = async (req, res, next) => {
  try {
    const { title, description, category } = req.body;
    const foundUser = await User.findById(req.session.userId);
    console.log(req.file);
    if (title && description && category && req.file.path) {
      const createdpost = await Posts.create({
        title,
        description,
        category,
        user: foundUser._id,
        image: req.file.path,
      });
      foundUser.posts.push(createdpost._id);
      await foundUser.save();
      // res.json({ status: "success", user: createdpost });
      res.redirect("/api/v1/users/profile-page");
    } else {
      return res.render("posts/addPost.ejs", {
        error: "please provide all fields to create a post",
      });
    }
  } catch (error) {
    return res.render("posts/addPost.ejs", {
      error: error.message,
    });
  }
};

const postlistControl = async (req, res, next) => {
  try {
    const postsfound = await Posts.find().populate("comments").populate("user");
    res.json({ status: "success", user: postsfound });
  } catch (error) {
    return next(appEr(error.message));
  }
};
const singlepostidControl = async (req, res, next) => {
  try {
    const id = req.params.id;
    const postfound = await Posts.findById(id)
      .populate({
        path: "comments",
        populate: {
          path: "user",
        },
      })
      .populate("user");
    // res.json({ status: "success", user: postfound });
    res.render("posts/postDetails.ejs", { postfound });
  } catch (error) {
    return next(appEr(error.message));
  }
};

const postdeletedConrol = async (req, res, next) => {
  const id = req.params.id;
  try {
    const fetchpost = await Posts.findById(id);
    if (fetchpost.user.toString() !== req.session.userId.toString()) {
      // return next(appEr("you are not a valid user to delete the post"));
      res.render("users/notAuthorize.ejs");
    } else {
      const deletepost = await Posts.findByIdAndDelete(id);
      // res.json({ status: "success", user: deletepost });
      res.redirect("/");
    }
  } catch (error) {
    res.json({ error_found: error });
  }
};
const postupdatedControl = async (req, res, next) => {
  try {
    const id = req.params.id;
    const { title, description, category } = req.body;
    console.log(id, title, category);
    const fetchpost = await Posts.findById(id);
    if (fetchpost.user.toString() !== req.session.userId.toString()) {
      // return next(appEr("you are not a valid user to update the post"));
      return res.render("posts/updatePosts.ejs", {
        error: " not authorized",
        post: "",
      });
    }
    if (req.file) {
      await Posts.findByIdAndUpdate(
        id,
        {
          title,
          description,
          category,
          image: req.file.path,
        },
        { new: true }
      );
      // res.json({ status: "success", user: updatepost });
      res.redirect("/api/v1/users/profile-page");
    } else {
      await Posts.findByIdAndUpdate(
        id,
        {
          title,
          description,
          category,
        },
        { new: true }
      );
      // res.json({ status: "success", user: updatepost });
      res.redirect("/api/v1/users/profile-page");
    }
  } catch (error) {
    return res.render("posts/updatePost.ejs", {
      post: "",
      error: error.message,
    });
  }
};

module.exports = {
  postcreatedControl,
  postlistControl,
  singlepostidControl,
  postdeletedConrol,
  postupdatedControl,
};
