const { Schema, model, default: mongoose } = require("mongoose");

const UsuarioSchema = Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  carrito: [
    {
      IDproducto: String,
      unidades: Number,
      _id: String,
    },
  ],
});
/*
carrito: [
  {
    producto: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Productos",
    },
  },
],

const productosCarritoSchema = Schema({
  idProducto: {
    type: String,
    required: false,
  },
  unidades: {
    type: Number,
    required: false,
  },
});
*/
module.exports = model("Usuario", UsuarioSchema);
//module.exports = model("Productos", productosCarritoSchema);
