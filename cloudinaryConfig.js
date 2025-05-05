// config/cloudinaryConfig.js
const cloudinary = require("cloudinary").v2;

// Configure Cloudinary
cloudinary.config({
  cloud_name: "imgUploadNHD",  // Your cloud name from Cloudinary dashboard
  api_key: "838797957525126",       // Your API key from Cloudinary dashboard
  api_secret: "R0vQldWUShDInzDJ-9j9gU3LAck", // Your API secret from Cloudinary dashboard
});

module.exports = cloudinary;
