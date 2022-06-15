const { response } = require("express");
const Producto = require("../models/Producto");

//crear producto
const crearProducto = async (req, res = response) => {
  req.body.name = req.body.name.toLowerCase();
  const { name } = req.body;

  try {
    //verificar el producto
    const producto = await Producto.findOne({ name });

    if (producto) {
      return res.status(400).json({
        ok: false,
        msg: "Este producto ya esta cargado en el sistema",
      });
    }
    //crear el producto con el modelo
    const dbProduct = new Producto(req.body);
    //crear producto en BD
    await dbProduct.save();

    //generar respuesta exitosa
    return res.status(201).json({
      ok: true,
      dbProduct,
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      msg: "Por favor hable con el administrador",
    });
  }
};

//ver todos los productos
const verProductos = async (req, res = response) => {
  try {
    const productos = await Producto.find();
    return res.json(productos);
  } catch (error) {
    return res.status(400).json({
      ok: false,
      msg: "error",
    });
  }
};

//ver producto por id
const productoID = async (req, res = response) => {
  try {
    let producto = await Producto.findById(req.params.id);

    if (!producto) {
      res.status(404).json({
        msg: "no existe el producto",
      });
    }

    return res.json(producto);
  } catch (error) {
    return res.status(400).json({
      ok: false,
      msg: "error",
    });
  }
};

//ver producto sugerido
const sugerido = async (req, res) => {
  try {
    let product = req.query.product;
    const productos = await Producto.find({
      name: { $regex: product },
    });

    if (!productos) {
      res.status(404).json({
        msg: "no existe el producto",
      });
    }

    return res.json(productos);
  } catch (error) {
    return res.status(400).json({
      ok: false,
      msg: "error",
    });
  }
};

//productos de una categoria
const productosXcategoria = async (req, res) => {
  try {
    let pxc = req.query.pxc;
    const prod = await Producto.find({
      categoria: { $regex: pxc },
    });

    if (!prod) {
      res.status(404).json({
        msg: "no existe la categoria",
      });
    }

    return res.json(prod);
  } catch (error) {
    return res.status(400).json({
      ok: false,
      msg: "error",
      error,
    });
  }
};

//editar producto
const editarProducto = async (req, res) => {
  try {
    const { name, price, description, stock, categoria, img } = req.body;

    let producto = await Producto.findById(req.params.id);

    if (!producto) {
      res.status(404).json({
        msg: "no existe el Producto",
      });
    }

    producto.name = name;
    producto.price = price;
    producto.description = description;
    producto.stock = stock;
    producto.categoria = categoria;
    producto.img = img;

    producto = await Producto.findOneAndUpdate(
      { _id: req.params.id },
      producto,
      { new: true }
    );
    res.status(200).json({ ok: true, producto });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      ok: false,
      msg: "error",
      error,
    });
  }
};

//eliminar producto
const eliminarProducto = async (req, res) => {
  try {
    let producto = await Producto.findById(req.params.id);

    if (!producto) {
      res.status(404).json({
        msg: "no existe el producto",
      });
    }

    await Producto.findOneAndRemove({ _id: req.params.id });
    res.json({ msg: "Producto eliminado con exito" });
  } catch (error) {
    return res.status(400).json({
      ok: false,
      msg: "error",
      error,
    });
  }
};

module.exports = {
  crearProducto,
  verProductos,
  productoID,
  sugerido,
  productosXcategoria,
  editarProducto,
  eliminarProducto,
};
