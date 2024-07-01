import { Router } from "express";
import { ObjectId } from "mongodb";
import {
  createUsuario,
  deleteUsuario,
  getUsuarios,
  getUsuarioById,
  updateUsuario,
} from "../data/Usuarios.js";

import auth from "../middleware/auth.js";

const router = Router();

router.get("/getUsuarios", auth, async (req, res) => {
  try {
    const usuarios = await getUsuarios();
    if (!usuarios || usuarios.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Sin usuarios registrados",
      });
    }
    return res.status(200).json(usuarios);
  } catch (error) {
    return res.status(500).json(error);
  }
});

//USAR DESDE BACK PARA CREAR USUARIOS HARDCODED - PARA REGISTER USAR EL DE registroUsuarios.js
router.post("/createUsuario", auth, async (req, res) => {
  try {
    const { nombre, email, password } = req.body;
    const usuarioCreado = await createUsuario({
      nombre,
      email,
      password,
    });

    if (usuarioCreado instanceof Error) {
      return res.status(400).json({
        success: false,
        message: usuarioCreado.message,
      });
    }

    return res.status(201).json({
      success: true,
      message: "Usuario creado exitosamente",
      result: usuarioCreado,
    });
  } catch (error) {
    return res.status(500).json(error);
  }
});

router.put("/editUsuario", auth, async (req, res) => {
  try {
    const { _id, nombre, email, password } = req.body;
    if (!ObjectId.isValid(_id)) {
      return res.status(400).json({ success: false, message: "ID inválido" });
    }
    const usuarioActualizado = await updateUsuario({
      _id,
      nombre,
      email,
      password,
    });

    if (usuarioActualizado instanceof Error) {
      return res.status(400).json({
        success: false,
        message: usuarioActualizado.message,
      });
    }

    return res.status(200).json({
      success: true,
      message: `Usuario ${_id} actualizado exitosamente`,
      result: usuarioActualizado,
    });
  } catch (error) {
    return res.status(500).json(error);
  }
});

router.get("/getUsuarios/:id", auth, async (req, res) => {
  try {
    const { id } = req.params;
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "ID inválido" });
    }

    const result = await getUsuarioById(id);
    if (!result) {
      return res.status(404).json({
        success: false,
        message: `Usuario (id: ${req.params.id}) no encontrado`,
      });
    }

    return res.status(200).json({ success: true, result });
  } catch (error) {
    return res.status(500).json(error);
  }
});

router.delete("/deleteUsuario/:id", auth, async (req, res) => {
  try {
    const { id } = req.params;
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "ID inválido" });
    }

    const usuarioEliminado = await deleteUsuario(id);

    if (usuarioEliminado.deleteCount === 0) {
      return res.status(404).json({
        success: false,
        message: `Usuario (id: ${id}) no encontrado`,
      });
    }

    return res.status(202).json({
      success: true,
      message: "El usuario fue eliminado",
      result: usuarioEliminado,
    });
  } catch (error) {
    return res.status(500).json(error);
  }
});

export default router;
