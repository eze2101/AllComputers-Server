const { Router } = require("express");
const { check } = require("express-validator");
const {
  crearUsuario,
  loginUsuario,
  revalidarToken,
  editarCarrito,
  agregarACarrito,
  editarUnidadesCarrito,
  eliminarProdcutoCarrito,
  agregarCompra,
  vaciarCarrito,
  procesarCompra,
  usuarioID,
} = require("../controllers/User");
const {
  crearProducto,
  verProductos,
  productoID,
  sugerido,
  productosXcategoria,
  editarProducto,
  eliminarProducto,
} = require("../controllers/Product");
const {
  crearCategoria,
  verCategorias,
  categoriaSugerida,
  editarCategoria,
  eliminarCategoria,
  categoriaID,
} = require("../controllers/Category");
const { validarCampos } = require("../middlewares/validar-campos");
const { validarJWT } = require("../middlewares/validar-jwt");
const { route } = require("express/lib/application");

const router = Router();

//crear un nuevo usuario
router.post(
  "/register",
  [
    check("name", "El nombre es obligatorio")
      .not()
      .isEmpty()
      .isLength({ min: 4, max: 12 }),
    check("email", "El email es obligatorio").isEmail(),
    check("password", "La contraseña es obligatoria").isLength({
      min: 6,
      max: 15,
    }),
    validarCampos,
  ],
  crearUsuario
);

//Login de usuario
router.post(
  "/",
  [
    check("email", "El email es obligatorio").isEmail(),
    check("password", "La contraseña es obligatoria").isLength({ min: 6 }),
    validarCampos,
  ],
  loginUsuario
);

//Validar token
router.get("/renew", validarJWT, revalidarToken);

//ver usuario por ID
router.get("/user/:id", usuarioID);

//agregar a carrito
router.put("/carrito/:id", agregarACarrito);

//editar unidades del carrito
router.put("/carrito/unidades/:id", editarUnidadesCarrito);

//eliminar producto del carrito
router.put("/carrito/eliminar/:id", eliminarProdcutoCarrito);

//agregar compra a Compras
router.put("/compras/:id", agregarCompra);

//vaciar carrito
router.put("/carrito/vaciar/:id", vaciarCarrito);

//comprar lo del carrito
router.put("/carrito/comprar/:id", procesarCompra);

//Crear Producto
router.post(
  "/newProduct",
  [
    check("name", "El nombre es obligatorio")
      .not()
      .isEmpty()
      .isLength({ min: 4 }),
    check("price", "El precio es obligatorio").isNumeric({ min: 0 }),
    check("description", "La descripcion es obligatoria").isLength({
      min: 6,
      max: 200,
    }),
    check("stock", "El stock es obligatorio").isNumeric({ min: 0 }),
    validarCampos,
  ],
  crearProducto
);

//Ver productos
router.get("/products", verProductos);

//ver producto por ID
router.get("/products/:id", productoID);

//productos de una categoria
router.get("/productoscategoria", productosXcategoria);

//ver producto sugerido
router.get("/productos", sugerido);

//editar producto
router.put("/producto/:id", editarProducto);

//eliminar producto
router.delete("/producto/:id", eliminarProducto);

//Crear categoria
router.post(
  "/newCategoria",
  [
    check("name", "El nombre es obligatorio")
      .not()
      .isEmpty()
      .isLength({ min: 4 }),
  ],
  crearCategoria
);

//ver todas las categorias
router.get("/categorias", verCategorias);

//ver categoria por ID
router.get("/categoria/:id", categoriaID);

//ver categoria sugeridas
router.get("/categoria", categoriaSugerida);

//editar categoria
router.put("/categoria/:id", editarCategoria);

//eliminar categoria
router.delete("/categoria/:id", eliminarCategoria);

module.exports = router;
