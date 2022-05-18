const { Schema, model } = require("mongoose");

const ProductoSchema = Schema({
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  stock: {
    type: Number,
    required: true,
  },
  categoria: {
    type: String,
    required: true,
  },
  img: {
    type: String,
    required: false,
  },
});

module.exports = model("Producto", ProductoSchema);
