import { ObjectId } from "mongodb";
import express from "express";
import {
  addProduct,
  getProducts,
  getProductById,
  editProduct,
  deleteProductById,
} from "../data/productos.js";

const router = express.Router();

import auth from "../middleware/auth.js";

// Ruta /createProd, encargada de crear un producto nuevo.
router.post("/createProducto", auth, async (req, res) => {
  try {
    const { nombre, descripcion, precio, stock, destacado, categoriaId } =
      req.body;

    const product = {
      nombre: nombre,
      descripcion: descripcion,
      precio: precio,
      stock: stock,
      destacado: destacado,
      categoriaId: categoriaId,
    };

    const result = await addProduct(product);

    if (result instanceof Error) {
      return res.status(400).json({ success: false, message: result.message });
    }

    res.status(201).json({
      success: true,
      message: `Producto agregado exitosamente`,
      result,
    });
  } catch (error) {
    res.status(500).send(error);
  }
});

// Ruta /getProductos que recibe filtros, en caso de no recibir filtros devuelve todos los productos
router.get("/getProductos", auth, async (req, res) => {
  const { categoria, destacado } = req.query;
  try {
    const products = await getProducts(categoria, destacado);

    if (products.products.length == 0) {
      return res.status(404).json({
        success: false,
        message: "No hay productos que cumplan con la petición",
      });
    }

    res.status(200).json(products);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Ruta /getProductos/:id recibe un ID.
router.get("/getProductos/:id", auth, async (req, res) => {
  const id = req.params.id;
  if (!ObjectId.isValid(id)) {
    return res.status(400).send({ success: false, message: "ID inválido" });
  }

  try {
    const producto = await getProductById(id);
    if (producto) {
      res.status(200).json({ success: true, producto });
    } else {
      res
        .status(404)
        .json({ success: false, message: `Producto (id:${id}) no encontrado` });
    }
  } catch (error) {
    console.error("Error al obtener producto por ID:", error);
    res.status(500).send(error);
  }
});

// Ruta /editProd, recibe un producto actualizado.
router.put("/editProducto", auth, async (req, res) => {
  if (!ObjectId.isValid(req.body._id)) {
    return res.status(400).send({ success: false, message: "ID inválido" });
  }

  try {
    const { _id, nombre, descripcion, precio, stock, destacado, categoria } =
      req.body;

    const product = {
      _id: _id,
      nombre: nombre,
      descripcion: descripcion,
      precio: precio,
      stock: stock,
      destacado: destacado,
      categoria: categoria,
    };

    const result = await editProduct(product);

    if (result.matchedCount === 0) {
      return res.status(404).json({
        success: false,
        message: `Producto (id: ${_id}) no encontrado`,
      });
    }

    res.status(200).json({
      success: true,
      message: `Producto (id: ${_id}) editado exitosamente`,
      result,
    });
  } catch (error) {
    console.error("El producto no pudo ser actualizado : ", error);
    res.status(500).send(error);
  }
});

// Ruta /deleteProd/:id, recibe un ID y elimina el producto correspondiente.
router.get("/deleteProducto/:id", auth, async (req, res) => {
  if (!ObjectId.isValid(req.body._id)) {
    return res.status(400).send({ success: false, message: "ID inválido" });
  }

  try {
    const id = req.params.id;
    const result = await deleteProductById(id);
    if (result.deletedCount === 0) {
      return res.status(404).json({
        success: false,
        message: `Producto (id: ${id}) no encontrado`,
      });
    }
    res.status(200).json({
      success: true,
      message: `Se eliminó el producto exitosamente`,
      result,
    });
  } catch (error) {
    console.error("El producto no pudo ser eliminado : ", error);
    res.status(500).send(error);
  }
});

export default router;
