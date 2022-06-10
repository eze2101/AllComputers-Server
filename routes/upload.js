const router = require("express").Router();
const Image = require("../models/image");
const storage = require("../multer/multer");
const multer = require("multer");
const cloudinary = require("cloudinary");
const fs = require("fs-extra");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploader = multer({
  storage,
}).single("file");

router.post("/upload", uploader, async (req, res) => {
  const { body, file } = req;

  console.log("body", body);
  console.log("file", file);

  try {
    let image = await Image.findById(req.body.name);

    if (image) {
      await cloudinary.v2.uploader.destroy(image.public_id);
      const result = await cloudinary.v2.uploader.upload(file.path);
      image.fileUrl = result.secure_url;
      image.public_id = result.public_id;

      image = await Image.findOneAndUpdate({ _id: req.body.name }, image, {
        new: true,
      });
      //await fs.unlink(file.path);
      return res.status(200).json({ ok: true, image });
    } else {
      console.log(file);
      const result = await cloudinary.v2.uploader.upload(file.path);
      const newImage = new Image({
        fileName: body.name,
        fileUrl: result.secure_url,
        _id: body.name,
        public_id: result.public_id,
      });
      console.log(newImage);
      await newImage.save();

      //await fs.unlink(file.path);

      return res.json({
        newImage,
      });
    }
  } catch (error) {
    return res.status(400).json("no funciona");
  }
});

router.get("/dowload/:id", async (req, res) => {
  try {
    const image = await Image.findById(req.params.id);

    if (!image) {
      res.status(404).json("no funco");
    }
    return res.status(200).json(image);
  } catch (error) {
    return res.status(400).json("no funciona");
  }
});

module.exports = router;
