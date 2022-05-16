const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const { dbConecction } = require("./dataBase/config");
require("dotenv").config();

//crear el servidor/aplicacion de express
const app = express();

//base de datos
dbConecction();

//Directorio public
app.use(express.static("public"));

//CORS
app.use(cors());

//Lectura y parseo del body
app.use(express.json());

//Rutas
app.use("/api/home", require("./routes/auth"));

app.listen(process.env.PORT, () => {
  console.log(`servidor corriendo en puerto ${process.env.PORT}`);
});
