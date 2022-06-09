const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Image = new Schema({
  fileName: { type: String },
  fileUrl: { type: String },
  uploadDate: { type: Date, default: Date.now() },
  _id: { type: String },
  public_id: { type: String, required: false },
});

module.exports = mongoose.model("Image", Image);
