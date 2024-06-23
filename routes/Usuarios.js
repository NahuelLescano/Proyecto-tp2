import { Router } from "express";
import { ObjectId } from "mongodb";
import {
    createUsuarios,
    deleteUsuarios,
    getUsuarios,
    getUsuariosId,
    updateUsuarios,
} from "../data/Usuarios.js";

import auth from "../middleware/auth.js";

const router = Router();

router.get("/getUsuarios", auth, async (req, res) => {
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

//USAR DESDE BACK PARA CREAR USUARIOS HARDCODED - PARA REGISTER USAR EL DE registroUsuarios.js
router.post("/createUsuarios", auth, async (req, res) => {
    try {
        const { nombre, email, password } = req.body;
        const usuarioCreado = await createUsuarios({
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

router.put("/editUsuario", auth, async (req, res) => {
    try {
        const { _id, nombre, email, password } = req.body;
        const usuarioActualizado = await updateUsuarios({
            _id,
            nombre,
            email,
            password,
        });
        return res.status(202).json(usuarioActualizado);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
});

router.get("/getUsuarios/:id", auth, async (req, res) => {
    try {
        const { id } = req.params;
        if (!ObjectId.isValid(id)) {
            return res.status(404).json({ message: "ID inválido" });
        }

        const usuariosId = await getUsuariosId(id);
        if (!usuariosId) {
            return res
                .status(404)
                .json({ message: "No existen usuarios con ese ID" });
        }

        return res.status(200).json(usuariosId);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
});

router.delete("/deleteUsuarios/:id", auth, async (req, res) => {
    try {
        const { id } = req.params;
        if (!ObjectId.isValid(id)) {
            return res.status(404).json({ message: "ID inválido" });
        }

        const usuarioEliminado = await deleteUsuarios(id);
        return res
            .status(203)
            .json({ message: "El usuario fue eliminado", usuarioEliminado });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
});

export default router;
