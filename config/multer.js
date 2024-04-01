const multer = require("multer");
const storage = require("./cloudinary");
const appEr = require("../utils/appEr");
const uplodimage = multer({
  storage,
  limits: 1024 * 1024 * 5,
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(appEr("please use images only"), null);
    }
  },
});
module.exports = uplodimage;
