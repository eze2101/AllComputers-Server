const { response } = require("express");
const bcrypt = require("bcryptjs");
const Usuario = require("../models/Usuario");
const Producto = require("../models/Producto");
const { generarJWT } = require("../helpers/jwt");
const { model } = require("mongoose");

const crearUsuario = async (req, res = response) => {
  const { name, email, password } = req.body;

  try {
    //verificar el email
    const UserEmail = await Usuario.findOne({ email });

    //verificar usuario
    const UserName = await Usuario.findOne({ name });

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
      roll: dbUser.roll,
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
      roll: dbUser.roll,
      email,
      token,
    });

    //
  } catch (error) {
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
    compras: dbUser.compras,
    roll: dbUser.roll,
    token,
  });
};

const agregarACarrito = async (req, res = response) => {
  const { carrito } = req.body;

  try {
    let usuario = await Usuario.findById(req.params.id);

    if (!usuario) {
      res.status(404).json({
        ok: false,
        msg: "el usuario no existe",
      });
    }

    let index = usuario.carrito.findIndex((el) => el._id == carrito[0]._id);

    if (index != -1) {
      let producto = await Producto.findById(carrito[0]._id);
      console.log(producto);

      if (
        usuario.carrito[index].unidades + carrito[0].unidades >
        producto.stock
      ) {
        console.log("fallo");
        let uniadesDisponibles =
          producto.stock - usuario.carrito[index].unidades;
        return res.status(404).json({
          ok: false,
          msg:
            "Las unidades agregadas superan las unidades disponibles, puede comprar:" +
            uniadesDisponibles.toString(),
        });
      }

      usuario.carrito[index].unidades += carrito[0].unidades;
    } else {
      usuario.carrito.push(carrito[0]);
    }

    usuario = await Usuario.findByIdAndUpdate({ _id: req.params.id }, usuario);
    res.status(200).json({ ok: true, usuario });
  } catch (error) {
    return res.status(400).json({
      ok: false,
      msg: "error al editar carrito",
    });
  }
};

const editarUnidadesCarrito = async (req, res = response) => {
  const { carrito } = req.body;

  try {
    let usuario = await Usuario.findById(req.params.id);

    if (!usuario) {
      res.status(404).json({
        ok: false,
        msg: "el usuario no existe",
      });
    }

    let index = usuario.carrito.findIndex((el) => el._id == carrito[0]._id);
    usuario.carrito[index].unidades = carrito[0].unidades;

    usuario = await Usuario.findByIdAndUpdate({ _id: req.params.id }, usuario);
    res.status(200).json({ ok: true, usuario });
  } catch (error) {
    return res.status(400).json({
      ok: false,
      msg: "error al editar carrito",
    });
  }
};

const eliminarProdcutoCarrito = async (req, res = response) => {
  try {
    const { carrito } = req.body;

    let usuario = await Usuario.findById(req.params.id);

    if (!usuario) {
      res.status(404).json({
        msg: "no existe el usuario",
      });
    }

    let index = usuario.carrito.findIndex((el) => el._id == carrito[0]._id);
    usuario.carrito.splice(index, 1);

    usuario = await Usuario.findByIdAndUpdate({ _id: req.params.id }, usuario);
    res.status(200).json({ ok: true, usuario });
  } catch (error) {
    return res.status(400).json({
      ok: false,
      msg: "error",
      error,
    });
  }
};

const agregarCompra = async (req, res = response) => {
  const { carrito } = req.body;

  try {
    let usuario = await Usuario.findById(req.params.id);

    if (!usuario) {
      res.status(404).json({
        ok: false,
        msg: "el usuario no existe",
      });
    }
    const COMPRA = {
      compra: carrito,
      fecha: Date.now(),
    };

    usuario.compras.push(COMPRA);
    console.log(usuario);

    usuario = await Usuario.findByIdAndUpdate({ _id: req.params.id }, usuario);
    res.status(200).json({ ok: true, usuario });
  } catch (error) {
    return res.status(400).json({
      ok: false,
      msg: "error al editar carrito",
    });
  }
};

const vaciarCarrito = async (req, res = response) => {
  try {
    console.log("entro");
    let usuario = await Usuario.findById(req.params.id);
    console.log(usuario.carrito);

    if (!usuario) {
      res.status(404).json({
        msg: "no existe el usuario",
      });
    }

    const total = usuario.carrito.length;

    console.log(total);
    usuario.carrito.splice(0, total);
    console.log(usuario.carrito);

    usuario = await Usuario.findByIdAndUpdate({ _id: req.params.id }, usuario);
    res.status(200).json({ ok: true, usuario });
  } catch (error) {
    return res.status(400).json({
      ok: false,
      msg: "error",
      error,
    });
  }
};

const procesarCompra = async (req, res = response) => {
  try {
    let usuario = await Usuario.findById(req.params.id);

    if (!usuario) {
      res.status(404).json({
        ok: false,
        msg: "el usuario no existe",
      });
    }

    let estados = await Promise.all(
      usuario.carrito.map(async (prod) => {
        let producto = await Producto.findById(prod._id);
        if (prod.unidades > producto.stock) {
          throw new Error(
            "el stock de " +
              producto.name.toString() +
              " cambio, unidades disponibles actualmente: " +
              producto.stock.toString()
          );
        }
        //     console.log("paso");
        return false;
      })
    );
    //   console.log(estados);
    await usuario.carrito.forEach(async (prod) => {
      let product = await Producto.findById(prod._id);
      //      console.log(product);
      product.stock -= prod.unidades;
      //    console.log("producto stock:", product.stock);
      await Producto.findByIdAndUpdate({ _id: prod._id }, product);
    });

    res.status(200).json({ ok: true, usuario });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      ok: false,
      msg: error.message,
    });
  }
};

module.exports = {
  crearUsuario,
  loginUsuario,
  revalidarToken,
  agregarACarrito,
  editarUnidadesCarrito,
  eliminarProdcutoCarrito,
  agregarCompra,
  vaciarCarrito,
  procesarCompra,
};
