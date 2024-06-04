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

export default router;
