const path = require("path");
const multer = require("multer");

//Image Storage
const imageStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../images"));
  },
  filename: function (req, file, cb) {
    if (file) {
      cb(null, new Date().toISOString().replace(/:/g, "-") + file.originalname);
    } else {
      cb(null, false);
    }
  },
});

//Upload Image

const imageUpload = multer({
  storage: imageStorage,
  fileFilter: function (req, file, cb) {
    if (file.mimetype.startsWith("image")) {
      cb(null, true);
    } else {
      cb(
        { message: "Unsupported file format, please upload image files only!" },
        false
      );
    }
  },
  limits: { fieldSize: 1024 * 1024 }, // 1 MB maximum
});

module.exports = imageUpload;
