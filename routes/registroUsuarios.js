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
    const resultado = await addUsuario(req.body);
    res.status(200).send(resultado);
  } catch (error) {
    res.status(401).send(error.message);
  }
});

routerUsuario.post("/login", async (req, res) => {
  try {
    const usuario = await getPorCredencial(req.body.email, req.body.password);
    const token = await generarAuthToken(usuario);
    res.status(200).send({ token });
  } catch (error) {
    res.status(401).send({ error: error.message });
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
