import express from "express";
import {
  addUsuario,
  getPorCredencial,
  generarAuthToken,
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
    res.status(401).send(error.message);
  }
});

export default routerUsuario;
