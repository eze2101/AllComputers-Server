const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../uploads"));
  },
  filename: (req, file, cb) => {
    console.log(file.mimetype);
    cb(null, `${req.body.name}.${file.mimetype.split("/")[1]}`);
  },
});

module.exports = storage;
