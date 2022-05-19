const { response } = require("express");
const bcrypt = require("bcryptjs");
const Usuario = require("../models/Usuario");
const { generarJWT } = require("../helpers/jwt");
const { model } = require("mongoose");

const crearUsuario = async (req, res = response) => {
  const { name, email, password } = req.body;

  try {
    console.log(email, name, password);
    //verificar el email
    const UserEmail = await Usuario.findOne({ email });
    console.log(UserEmail);
    //verificar usuario
    const UserName = await Usuario.findOne({ name });
    console.log(UserName);
    if (UserEmail) {
      return res.status(400).json({
        ok: false,
        msg: "Ese email ya esta asociado a un Usuario",
      });
    }

    if (UserName) {
      return res.status(400).json({
        ok: false,
        msg: "Ese Usuario ya esta asociado a una cuenta",
      });
    }
    //crear el usuario con el modelo
    const dbUser = new Usuario(req.body);
    console.log(dbUser);

    //Encriptar la contraseña
    const salt = bcrypt.genSaltSync();
    dbUser.password = bcrypt.hashSync(password, salt);

    //generar json webtoken (JWT)
    const token = await generarJWT(dbUser.id, name, email);

    //crear usuario en BD
    await dbUser.save();

    //generar respuesta exitosa
    return res.status(201).json({
      ok: true,
      uid: dbUser.id,
      name,
      email,
      token,
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      msg: "Por favor hable con el administrador",
    });
  }
};

const loginUsuario = async (req, res = response) => {
  const { email, password } = req.body;

  try {
    const dbUser = await Usuario.findOne({ email });

    if (!dbUser) {
      return res.status(400).json({
        ok: false,
        msg: "El correo no es correcto",
      });
    }

    //confirmar si el password hace match
    const validPassword = bcrypt.compareSync(password, dbUser.password);

    if (!validPassword) {
      return res.status(400).json({
        ok: false,
        msg: "la contraseña no es correcta",
      });
    }
    //generar JWT
    const token = await generarJWT(dbUser.id, dbUser.name);

    //respuesta del servicio
    return res.json({
      ok: true,
      uid: dbUser.id,
      name: dbUser.name,
      email,
      token,
    });

    //
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      ok: false,
      msg: "Por favor hable con el administrador",
    });
  }
};

const revalidarToken = async (req, res = response) => {
  const { uid } = req;
  //leer la base de datos
  const dbUser = await Usuario.findById(uid);

  const token = await generarJWT(uid, dbUser.name);

  return res.json({
    ok: true,
    uid,
    name: dbUser.name,
    email: dbUser.email,
    carrito: dbUser.carrito,
    token,
  });
};

const editarCarrito = async (req, res = response) => {
  console.log(req.body, "body");

  const { carrito } = req.body;
  console.log(carrito, " carrito");
  try {
    let usuario = await Usuario.findById(req.params.id);

    if (!usuario) {
      res.status(404).json({
        ok: false,
        msg: "el usuario no existe",
      });
    }

    console.log(usuario);
    //usuario.carrito = carrito;
    //usuario.carrito = usuario.carrito.concat(carrito);
    usuario.carrito.push(carrito[0]);
    console.log(usuario, "usuario");

    usuario = await Usuario.findByIdAndUpdate({ _id: req.params.id }, usuario);
    res.status(200).json({ ok: true, usuario });
  } catch (error) {
    return res.status(400).json({
      ok: false,
      msg: "error al editar carrito",
    });
  }
};

module.exports = {
  crearUsuario,
  loginUsuario,
  revalidarToken,
  editarCarrito,
};
