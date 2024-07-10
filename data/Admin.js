import "dotenv/config";
import getConnection from "./conn.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
const DATABASE = process.env.DATABASE;
const USUARIOS = process.env.USUARIOS;

export async function loginAdmin(userEmail, userPassword) {
  try {
    const usuario = { email: userEmail, password: userPassword };
    const verificarUsuario = await getUsuario(usuario);

    if (verificarUsuario instanceof Error) {
      //devuelve  un Error con mensaje explicativo
      return verificarUsuario;
    }

    if (!usuarioAdmin(verificarUsuario)) {
      return new Error("El usuario no es admin.");
    }
    const token = await generarAuthToken(verificarUsuario);
    return { token, _id: verificarUsuario._id };
  } catch (error) {
    console.error("Error al loguear usuario admin: ", error);
    throw { success: false, errorMessage: error.message };
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
    return new Error("Credenciales invalidas");
  }

  const isMatch = await bcryptjs.compare(usuario.password, user.password);
  if (!isMatch) {
    return new Error("Credenciales invalidas");
  }

  return user;
}

export async function generarAuthToken(usuario) {
  try {
    const token = await jwt.sign(
      { _id: usuario._id, email: usuario.email },
      process.env.CLAVE_SECRETA,
      { expiresIn: "1h" }
    );
    return token;
  } catch (error) {
    console.error("Error al crear Admin Auth Token: ", error);
    throw { success: false, errorMessage: error.message };
  }
}
