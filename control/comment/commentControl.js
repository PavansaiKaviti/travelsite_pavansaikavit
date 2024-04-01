const Comments = require("../../model/comment/Comment");
const Posts = require("../../model/posts/Posts");
const User = require("../../model/user/User");
const appEr = require("../../utils/appEr");
const commentcreatedControl = async (req, res, next) => {
  try {
    const { message } = req.body;
    console.log(message);
    const user = req.session.userId;
    const postfound = await Posts.findById(req.params.id);
    const userfound = await User.findById(user);
    const commentCreated = await Comments.create({
      message,
      user,
      post: postfound._id,
    });
    postfound.comments.push(commentCreated._id);
    userfound.comments.push(commentCreated._id);
    //disablevalidation
    await postfound.save({ validateBeforeSave: false });
    await userfound.save({ validateBeforeSave: false });
    res.redirect(`/api/v1/posts/${req.params.id}`); //check
  } catch (error) {
    return next(appEr(error.message), 500);
  }
};
const commentdetailControl = async (req, res, next) => {
  try {
    const commentfound = await Comments.findById(req.params.id);
    // res.json({ status: "success", user: commentfound });
    res.render("comments/updateComment.ejs", { commentfound });
  } catch (error) {
    return next(appEr(error.message), 500);
  }
};
const commentdeletedControl = async (req, res, next) => {
  try {
    const user = await User.findById(req.session.userId);
    const comment = await Comments.findById(req.params.id);
    if (user._id.toString() !== comment.user.toString()) {
      return next(appEr("you are not authorized to edit the comment"));
    }
    await Comments.findByIdAndDelete(req.params.id);
    // res.json({ status: "success", user: deleteComment });
    res.redirect(`/api/v1/posts/${req.query.postId}`);
  } catch (error) {
    return next(appEr(error.message), 500);
  }
};
const commentupdatedControl = async (req, res, next) => {
  try {
    const { message } = req.body;
    const user = await User.findById(req.session.userId);
    const comment = await Comments.findById(req.params.id);
    if (user._id.toString() !== comment.user.toString()) {
      return next(appEr("you are not authorized to edit the comment"));
    }
    const commentupdate = await Comments.findByIdAndUpdate(
      req.params.id,
      { message },
      { new: true }
    );
    // res.json({ status: "success", user: commentupdate });
    res.redirect(`/api/v1/posts/${req.query.postId}`);
  } catch (error) {
    return next(appEr(error.message), 500);
  }
};

module.exports = {
  commentcreatedControl,
  commentdeletedControl,
  commentdetailControl,
  commentupdatedControl,
};
