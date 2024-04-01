const mongoose = require("mongoose");
const dotenv = require("dotenv");
const User = require("../model/user/User");
const Posts = require("../model/posts/Posts");
const Comments = require("../model/comment/Comment");
dotenv.config();
User;
Posts;
Comments;
const connectdb = async () => {
  try {
    await mongoose.connect(process.env.mongoodb_url);
    console.log("data base connected");
  } catch (error) {
    console.log("error in connecting mongoose: ", error);
  }
};
module.exports = connectdb;
