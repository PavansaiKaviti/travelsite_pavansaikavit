//require cloudinary and cloudinary storage
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

// configured cloudinary
cloudinary.config({
  api_key: process.env.Api_key,
  api_secret: process.env.Api_secret,
  cloud_name: process.env.Cloud_name,
});
// cloudinary storage
const storage = new CloudinaryStorage({
  cloudinary,
  allowedFormats: ["jpg", "jpeg", "png"],
  params: {
    folder: "profile_images",
    public_id: (req, file) => file.fieldname + "_" + Date.now(),
    transformation: [{ width: 500, height: 500, crop: "limit" }],
  },
});

module.exports = storage;
