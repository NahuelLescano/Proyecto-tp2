import express from "express";
import {
  createCategoria,
  deleteCategoria,
  editCategoria,
  getCategoriaById,
  getCategorias,
} from "../data/categorias.js";
import { ObjectId } from "mongodb";
import auth from "../middleware/auth.js";
const router = express.Router();

//funcion para generar un objeto q va a ser retornado en create, edit y delete. Informando un mensaje y el resultado
const generateResult = (message, result) => ({
  message: message,
  result: result,
});

//debe recibir un objeto categoria por el req.body --> {nombre: "nombre categoria"}
router.post("/createCategoria", auth, async (req, res) => {
  try {
    const result = await createCategoria(req.body);
    if (result instanceof Error) {
      return res.status(400).json({ success: false, message: result.message });
    }
    res.status(201).json({
      success: true,
      message: `Categoría agregada exitosamente`,
      result,
    });
  } catch (error) {
    res.status(500).send(error);
  }
});

//SIN AUTH POR REGLA DE NEGOCIO DE PNT2 (las categorias pueden ser vistas por usuarios no logueados, pero los productos no)
//obtiene todas las categorias
router.get("/getCategorias", async (req, res) => {
  try {
    const result = await getCategorias();
    if (result.length === 0)
      return res.status(404).json({
        success: false,
        message: "No hay categorias",
      });

    res.status(200).json(result);
  } catch (error) {
    res.status(500).send(error);
  }
});

//SIN AUTH POR REGLA DE NEGOCIO DE PNT2 (las categorias pueden ser vistas por usuarios no logueados, pero los productos no)
//obtiene una categoria que coincida con el id enviado por url param
router.get("/getCategorias/:id", async (req, res) => {
  if (!ObjectId.isValid(req.params.id)) {
    return res.status(400).send("ID inválido");
  }

  try {
    const result = await getCategoriaById(req.params.id);

    if (!result) {
      return res.status(404).json({
        success: false,
        message: `Categoría (id: ${req.params.id}) no encontrada`,
      });
    }

    res.status(200).json({ success: true, result });
  } catch (error) {
    res.status(500).send(error);
  }
});

//en el body se debe enviar el objeto editado
router.put("/editCategoria", auth, async (req, res) => {
  if (!ObjectId.isValid(req.body._id)) {
    return res.status(400).send("ID inválido");
  }

  try {
    const result = await editCategoria(req.body);

    if (result.matchedCount === 0) {
      return res.status(404).json({
        success: false,
        message: `Categoría (id: ${req.body._id}) no encontrada`,
      });
    }

    res.status(200).json({
      success: true,
      message: `Se editó la categoría (id:${req.body._id}) exitosamente`,
      result,
    });
  } catch (error) {
    res.status(500).send(error);
  }
});

router.delete("/deleteCategoria/:id", auth, async (req, res) => {
  if (!ObjectId.isValid(req.params.id)) {
    return res.status(400).send("ID inválido");
  }

  try {
    const result = await deleteCategoria(req.params.id);

    if (result.deletedCount === 0) {
      return res.status(404).send({
        success: false,
        message: `Categoría (id: ${req.params.id}) no encontrada`,
      });
    }
    res.status(200).send({
      success: true,
      message: `Se eliminó la categoría exitosamente`,
      result,
    });
  } catch (error) {
    res.status(500).send(error);
  }
});

export default router;
