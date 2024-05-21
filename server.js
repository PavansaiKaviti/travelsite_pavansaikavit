//! creating a server
const express = require("express");
const connectdb = require("./config/mongoose");
const userRouter = require("./Routes/userRoute/userRoute");
const postRouter = require("./Routes/postRouter/postRouter");
const commentRouter = require("./Routes/commentRouter/commentRouter");
const globalErrMiddleware = require("./middleware/globalErrMiddleware");
const session = require("express-session");
const mongostore = require("connect-mongo");
const methodOverride = require("method-override");
const ejs = require("ejs");
const path = require("path");
const Posts = require("./model/posts/Posts");
const truncatePost = require("./utils/helpers");
// creating instance
const app = express();
//!middlewares

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.locals.truncatePost = truncatePost;
//!session config
app.use(
  session({
    secret: process.env.session_key,
    resave: false,
    saveUninitialized: true,
    store: new mongostore({
      mongoUrl: process.env.mongoodb_url,
      ttl: 24 * 60 * 60,
    }),
  })
);
connectdb();
app.use((req, res, next) => {
  if (req.session.userId) {
    res.locals.userId = req.session.userId;
  } else {
    res.locals.userId = null;
  }
  next();
});
//! home route
app.get("/", async (req, res) => {
  try {
    const posts = await Posts.find().populate("user");
    res.render("index", { posts });
  } catch (error) {
    return res.render("index", { error: error.message });
  }
});
//!user
app.use("/api/v1/users", userRouter);
//!post
app.use("/api/v1/posts", postRouter);
//!comment
app.use("/api/v1/comment", commentRouter);
//!global error handler
// always remember to place globalerrmiddleware at end of the  responses
app.use(globalErrMiddleware);

//server listing port
const port = process.env.domain || 3000;
app.listen(port, () => {
  try {
    console.log(`server starts at : http://localhost:${port}`);
  } catch (error) {
    console.log("error: ", error);
  }
});
