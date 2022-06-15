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
  roll: {
    type: String,
    required: false,
  },
  carrito: [
    {
      IDproducto: String,
      unidades: Number,
      _id: String,
      precio: Number,
    },
  ],
  compras: [
    {
      compra: [
        {
          IDproducto: String,
          unidades: Number,
          _id: String,
          precio: Number,
        },
      ],
      fecha: {
        type: Date,
        default: Date.now(),
      },
      precio: {
        type: Number,
      },
    },
  ],
});

module.exports = model("Usuario", UsuarioSchema);
