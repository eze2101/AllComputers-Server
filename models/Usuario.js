const { Schema, model } = require("mongoose");

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
  carrito: [{ IDproduct: String, unit: Number }],
  required: false,
});

module.exports = model("Usuario", UsuarioSchema);
