import "dotenv/config";
import { ObjectId } from "mongodb";
import getConnection from "./conn.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
const DATABASE = process.env.DATABASE;
const USUARIOS = process.env.USUARIOS;

function usuarioValido(usuario) {
  let resultado = true;
  if (!usuario.nombre || !usuario.email || !usuario.password) {
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
    return new Error("Datos del usuario invalidos");
  }

  try {
    const usuarios = await getUsuarios();
    const usuarioAEncontrar = await usuarios.findOne({ email: usuario.email });
    if (usuarioAEncontrar) {
      return new Error("Email ya registrado");
    }
    usuario.password = await bcryptjs.hash(usuario.password, 10);
    const nuevoUsuario = await usuarios.insertOne(usuario);
    return nuevoUsuario;
  } catch (error) {
    console.error("Error al registrar un usuario: ", error);
    throw { success: false, errorMessage: error.message };
  }
}

export async function getPorCredencial(email, password) {
  try {
    const usuarios = await getUsuarios();
    const usuarioAEncontrar = await usuarios.findOne({ email: email });
    if (!usuarioAEncontrar) {
      return new Error("Credenciales Invalidas");
    }

    const coincidencia = await bcryptjs.compare(
      password,
      usuarioAEncontrar.password
    );

    if (!coincidencia) {
      return new Error("Credenciales Invalidas");
    }

    return usuarioAEncontrar;
  } catch (error) {
    console.error("Error al loguear un usuario: ", error);
    throw { success: false, errorMessage: error.message };
  }
}

export async function generarAuthToken(usuario) {
  try {
    const token = await jwt.sign(
      { _id: usuario._id, email: usuario.email },
      process.env.CLAVE_SECRETA,
      { expiresIn: "2h" }
    );
    return token;
  } catch (error) {
    console.error("Error al crear Auth Token: ", error);
    throw { success: false, errorMessage: error.message };
  }
}

export async function verificarToken(token) {
  try {
    const result = await jwt.verify(
      token,
      process.env.CLAVE_SECRETA,
      (err, res) => {
        if (err) {
          return "el token ha expirado";
        }
        return res;
      }
    );
    return result;
  } catch (error) {
    console.error("Error al verificar Auth Token: ", error);
    throw { success: false, errorMessage: error.message };
  }
}
