const express = require("express");
const cors = require("cors");
const path = require("path");
const { dbConecction } = require("./dataBase/config");

if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

var fs = require("fs");
var https = require("https");

//crear el servidor/aplicacion de express
const app = express();

//base de datos
dbConecction();

//Directorio public
app.use(express.static(path.join(__dirname, "uploads")));
app.use(express.static(path.join(__dirname, "public")));

//CORS
app.use(cors());

//Lectura y parseo del body
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
//true

//Rutas
app.use("/api/home", require("./routes/auth"));
app.use("/api", require("./routes/upload"));

//manejar demas rutas (para produccion)
app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "public/index.html"));
});

app.listen(process.env.PORT, () => {
  console.log(`servidor corriendo en puerto ${process.env.PORT}`);
});
