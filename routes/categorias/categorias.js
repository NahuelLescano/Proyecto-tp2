import express from "express";
import { createCategoria } from "../../data/categorias/categorias.js";

const router = express.Router();

router.get("/", (req, res) => {
  res.send("funcionando...");
});

//debe recibir un objeto categoria --> {nombre: "nombre categoria"}
router.post("/createCategoria", async (req, res) => {
  try {
    const result = await createCategoria(req.body);
    res.status(201).send(result);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

router.get("/getCategorias", async (req, res) => {});

router.get("/getCategorias/:id", async (req, res) => {});

router.put("/editCategoria", (req, res) => {});

router.delete("deleteCategoria/:id", (req, res) => {});

export default router;
