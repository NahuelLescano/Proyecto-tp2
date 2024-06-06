import { Router } from "express";
import { createUsuarios, getUsuarios } from "../data/Usuarios.js";

const router = Router();

router.get("/", async (_req, res) => {
    try {
        const usuarios = await getUsuarios();
        if (!usuarios || usuarios.length === 0) {
            return res
                .status(400)
                .json({ message: "Sin usuarios registrados" });
        }
        return res.status(200).json(usuarios);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
});

router.post("/", async (req, res) => {
    try {
        const { _id, nombre, email, password } = req.body;
        const usuarioCreado = await createUsuarios({
            _id,
            nombre,
            email,
            password,
        });

        return res
            .status(201)
            .json({ message: "Usuario creado exitosamente", usuarioCreado });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
});

export default router;
