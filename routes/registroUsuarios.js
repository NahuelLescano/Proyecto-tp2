import express from "express";
import {
  addUsuario,
  getPorCredencial,
  generarAuthToken,
  verificarToken,
} from "../data/registroUsuarios.js";

const routerUsuario = express.Router();

routerUsuario.post("/register", async (req, res) => {
  try {
    const result = await addUsuario(req.body);

    if (result instanceof Error) {
      return res.status(400).json({
        success: false,
        message: result.message,
      });
    }

    res.status(201).json({
      success: true,
      message: `Registro exitoso!`,
      result,
    });
  } catch (error) {
    res.status(500).json(error);
  }
});

routerUsuario.post("/login", async (req, res) => {
  try {
    const usuario = await getPorCredencial(req.body.email, req.body.password);
    if (usuario instanceof Error) {
      return res.status(401).json({
        success: false,
        message: usuario.message,
      });
    }
    const token = await generarAuthToken(usuario);
    res.status(202).json({ token });
  } catch (error) {
    res.status(500).send(error);
  }
});

routerUsuario.post("/verificarToken", async (req, res) => {
  try {
    const result = await verificarToken(req.body.token);

    if (result === "el token ha expirado") {
      res.status(401).send({ success: false, error: "el token ha expirado" });
    }
    res.status(200).send({ success: true, result });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

export default routerUsuario;
