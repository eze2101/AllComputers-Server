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
    console.log(body.name);
    const newImage = new Image({
      fileName: body.name,
      fileUrl: `https://all-computers.vercel.app/${file.filename}`,
      _id: body.name,
    });
    console.log(newImage);
    await newImage.save();
    return res.json({
      newImage,
    });
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
