import "dotenv/config";
import { ObjectId } from "mongodb";
import getConnection from "./conn.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
const DATABASE = process.env.DATABASE;
const USUARIOS = process.env.USUARIOS;

function usuarioValido(usuario) {
  let resultado = true;
  if (!usuario.email || !usuario.password) {
    resultado = false;
  }
  return resultado;
}

export async function getUsuarios() {
  const conndb = await getConnection();
  const clientes = await conndb.db(DATABASE).collection(USUARIOS);
  return clientes;
}

export async function addUsuario(usuario) {
  if (!usuarioValido(usuario)) {
    throw new Error("Usuario Invalido");
  }

  try {
    const usuarios = await getUsuarios();
  const usuarioAEncontrar = await usuarios.findOne({ email: usuario.email });
  if (usuarioAEncontrar) {
    throw new Error("Email ya registrado");
  }
    usuario.password = await bcryptjs.hash(usuario.password, 10);
    const nuevoUsuario = await usuarios.insertOne(usuario);
    return nuevoUsuario;

  } catch (error) {
    throw error;
  }
}

export async function getPorCredencial(email, password) {
  const usuarios = await getUsuarios();
  const usuarioAEncontrar = await usuarios.findOne({ email: email });
  if (!usuarioAEncontrar) {
    throw new Error("Credenciales Invalidas");
  }

  const coincidencia = await bcryptjs.compare(
    password,
    usuarioAEncontrar.password
  );

  if (!coincidencia) {
    throw new Error("Credenciales Invalidas");
  }
  return usuarioAEncontrar;
}

export async function generarAuthToken(usuario) {
  const token = await jwt.sign(
    { _id: usuario._id, email: usuario.email },
    process.env.CLAVE_SECRETA,
    { expiresIn: "2h" }
  );
  return token;
}
