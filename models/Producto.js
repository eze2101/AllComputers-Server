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
    require: true,
  },
  categoria: {
    type: String,
    require: true,
  },
});

module.exports = model("Producto", ProductoSchema);
