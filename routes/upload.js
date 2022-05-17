const router = require("express").Router();
const Image = require("../models/image");
const storage = require("../multer/multer");
const multer = require("multer");

const uploader = multer({
  storage,
}).single("file");

router.post("/upload", uploader, async (req, res) => {
  const { body, file } = req;
  if (file && body) {
    const newImage = new Image({
      fileName: body.name,
      fileUrl: `http://localhost:4000/${file.filename}`,
    });
    console.log(newImage);
    await newImage.save();
    res.json({
      newImage,
    });
  }
});
// router.get("/dowload", async (req, res) => {
//   const images = await Image.find();
//   res.json(images);
// });

router.get("/dowload", async (req, res) => {
  try {
    let img = req.query.img;
    const image = await Image.find({ fileName: { $regex: img } });

    if (!image) {
      res.status(404).json("no funco");
    }
    return res.status(200).json(image);
  } catch (error) {
    return res.status(400).json("no funciona");
  }
});

module.exports = router;
