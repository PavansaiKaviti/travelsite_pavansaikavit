const express = require("express");
const {
  commentcreatedControl,
  commentdetailControl,
  commentdeletedControl,
  commentupdatedControl,
} = require("../../control/comment/commentControl");
const Authentication = require("../../middleware/Authentication");
const commentRouter = express.Router();
//!
//!
commentRouter.post("/:id", Authentication, commentcreatedControl);
commentRouter.get("/:id", commentdetailControl);
commentRouter.delete("/:id", Authentication, commentdeletedControl);
commentRouter.put("/:id", Authentication, commentupdatedControl);

module.exports = commentRouter;
