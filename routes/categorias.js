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
            return res.status(400).send(result.message);
        }
        res.status(201).send(
            generateResult(`Se agrego la categoría exitosamente`, result)
        );
    } catch (error) {
        res.status(500).send(error);
    }
});

//obtiene todas las categorias
router.get("/getCategorias", auth, async (req, res) => {
    try {
        const result = await getCategorias();
        if (result.length === 0)
            return res.status(404).send("No hay categorias para devolver");
        res.status(200).json(result);
    } catch (error) {
        res.status(500).send(error);
    }
});

//obtiene una categoria que coincida con el id enviado por url param
router.get("/getCategorias/:id", auth, async (req, res) => {
    if (!ObjectId.isValid(req.params.id)) {
        return res.status(400).send("ID inválido");
    }

    try {
        const result = await getCategoriaById(req.params.id);

        if (!result) {
            return res
                .status(404)
                .send(`Categoría (id: ${req.params.id}) no encontrada`);
        }

        res.status(200).send(result);
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
            return res
                .status(404)
                .send(`Categoría (id: ${req.body._id}) no encontrada`);
        }

        res.status(200).json(
            generateResult(`Se editó la categoría exitosamente`, result)
        );
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
            return res
                .status(404)
                .send(`Categoría (id: ${req.params.id}) no encontrada`);
        }
        res.status(200).send(
            generateResult(`Se eliminó la categoría exitosamente`, result)
        );
    } catch (error) {
        res.status(500).send(error);
    }
});

export default router;
