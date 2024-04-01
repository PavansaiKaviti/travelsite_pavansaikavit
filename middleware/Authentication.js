const appEr = require("../utils/appEr");

const Authentication = (req, res, next) => {
  if (req.session.userId) {
    return next();
  } else {
    // return next(appEr("user not logged in "));
    return next(res.render("users/notAuthorize.ejs"));
  }
};

module.exports = Authentication;
