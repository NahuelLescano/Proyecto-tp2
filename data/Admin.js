import "dotenv/config";
import { ObjectId } from "mongodb";
import getConnection from "./conn.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
const DATABASE = process.env.DATABASE;
const USUARIOS = process.env.USUARIOS;

export async function loginAdmin(userEmail, userPassword) {
  try {
    const usuario = { email: userEmail, password: userPassword };
    const verificarUsuario = await getUsuario(usuario);

    if (!usuarioAdmin(verificarUsuario)) {
      return new Error("El usuario no es admin.");
    }
    const token = await generarAuthToken(verificarUsuario);
    return token;
  } catch (error) {
    return new Error(error.message);
  }
}

//valida que el objeto categoria tenga .nombre
function usuarioAdmin(usuario) {
  let esAdmin = false;
  if (usuario.admin != undefined) {
    esAdmin = usuario.admin;
  }
  return esAdmin;
}

async function getUsuario(usuario) {
  const conndb = await getConnection();
  const user = await conndb
    .db(DATABASE)
    .collection(USUARIOS)
    .findOne({ email: usuario.email });

  if (!user) {
    throw new Error("Usuario o contraseña incorrecta.");
  }

  const isMatch = await bcryptjs.compare(usuario.password, user.password);
  if (!isMatch) {
    throw new Error("Usuario o contraseña incorrecta.");
  }

  return user;
}

export async function generarAuthToken(usuario) {
  const token = await jwt.sign(
    { _id: usuario._id, email: usuario.email },
    process.env.CLAVE_SECRETA,
    { expiresIn: "2h" }
  );
  return token;
}
