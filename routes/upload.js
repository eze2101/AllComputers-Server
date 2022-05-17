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
      fileUrl: `http://localhost:4000/${file.filename}`,
      _id: body.name,
    });
    console.log(newImage);
    await newImage.save();
    res.json({
      newImage,
    });
  }
});
/*
router.put("upload/:id", uploader, async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  const { path } = req.file;
  try {
    let imagen = await Image.findById(req.params.id);

    console.log(imagen);
    if (!imagen) {
      res.status(404).json({
        ok: false,
        msg: "no existe la imagen",
      });
    }

    imagen.fileName = name;
    imagen.img = `http://localhost:4000/${name}.${
      req.file.mimetype.split("/")[1]
    }`;
    console.log(imagen);
    imagen = await Image.findOneAndUpdate(id, imagen);
    console.log(categoria);
    res.status(200).json({ ok: true, categoria: imagen });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      ok: false,
      msg: "error",
      error,
    });
  }
});
*/
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
