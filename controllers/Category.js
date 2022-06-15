const { response } = require("express");
const Categoria = require("../models/Categoria");

//crear categorias
const crearCategoria = async (req, res = response) => {
  req.body.name = req.body.name.toLowerCase();
  const { name } = req.body;

  try {
    //verificar la categoria
    const categoria = await Categoria.findOne({ name });

    if (categoria) {
      return res.status(400).json({
        ok: false,
        msg: "Esta categoria ya esta cargado en el sistema",
      });
    }

    //crear el categoria con el modelo
    const dbCategoria = new Categoria(req.body);

    //crear categoria en BD
    await dbCategoria.save();

    //generar respuesta exitosa
    return res.status(201).json({
      ok: true,
      dbCategoria,
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      msg: "No se pudo crear la categoria",
      error,
    });
  }
};

//ver todas las categorias
const verCategorias = async (req, res = response) => {
  try {
    const categorias = await Categoria.find();
    return res.json(categorias);
  } catch (error) {
    return res.status(400).json({
      ok: false,
      msg: "error",
    });
  }
};

//ver categoria por ID
const categoriaID = async (req, res = response) => {
  try {
    let categoria = await Categoria.findById(req.params.id);

    if (!categoria) {
      res.status(404).json({
        ok: false,
        msg: "no existe la categoria",
      });
    }
    return res.json(categoria);
  } catch (error) {
    return res.status(400).json({
      ok: false,
      msg: "error",
    });
  }
};

//categoria sugerida
const categoriaSugerida = async (req, res) => {
  try {
    let cat = req.query.cat;
    const categorias = await Categoria.find({
      name: { $regex: cat },
    });

    if (!categorias) {
      res.status(404).json({
        msg: "no existe la categoria",
      });
    }
    return res.json(categorias);
  } catch (error) {
    return res.status(400).json({
      ok: false,
      msg: "error",
      error,
    });
  }
};

//editar categoria
const editarCategoria = async (req, res) => {
  try {
    const { name, img } = req.body;

    let categoria = await Categoria.findById(req.params.id);

    if (!categoria) {
      res.status(404).json({
        ok: false,
        msg: "no existe la categoria",
      });
    }

    categoria.name = name;
    categoria.img = img;
    categoria = await Categoria.findOneAndUpdate(
      { _id: req.params.id },
      categoria
    );
    res.status(200).json({ ok: true, categoria: categoria });
  } catch (error) {
    return res.status(400).json({
      ok: false,
      msg: "error al editar categoria",
    });
  }
};

//eliminar categoria
const eliminarCategoria = async (req, res) => {
  try {
    let categoria = await Categoria.findById(req.params.id);

    if (!categoria) {
      res.status(404).json({
        msg: "no existe la categoria",
      });
    }

    await Categoria.findOneAndRemove({ _id: req.params.id });
    res.json({ msg: "Categoria eliminada con exito" });
  } catch (error) {
    return res.status(400).json({
      ok: false,
      msg: "error",
      error,
    });
  }
};

module.exports = {
  categoriaSugerida,
  crearCategoria,
  verCategorias,
  editarCategoria,
  eliminarCategoria,
  categoriaID,
};
