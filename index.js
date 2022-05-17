const express = require("express");
const cors = require("cors");
const path = require("path");

const { dbConecction } = require("./dataBase/config");
const { join } = require("path");
require("dotenv").config();

//crear el servidor/aplicacion de express
const app = express();

//base de datos
dbConecction();

//Directorio public
app.use(express.static(path.join(__dirname, "uploads")));

//CORS
app.use(cors());

//Lectura y parseo del body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Rutas
app.use("/api/home", require("./routes/auth"));
app.use("/api", require("./routes/upload"));

app.listen(process.env.PORT, () => {
  console.log(`servidor corriendo en puerto ${process.env.PORT}`);
});

/*
// File upload settings
const PATH = "./uploads";
let storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, PATH);
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + "-" + Date.now());
  },
});
let upload = multer({
  storage: storage,
});

// Express settings
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);
app.get("/api", function (req, res) {
  res.end("File catcher");
});

// POST File
app.post("/api/upload", upload.single("image"), function (req, res) {
  if (!req.file) {
    console.log("No file is available!");
    return res.send({
      success: false,
    });
  } else {
    console.log("File is available!");
    return res.send({
      success: true,
    });
  }
});
*/
