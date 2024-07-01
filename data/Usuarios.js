import "dotenv/config";
import bcryptjs from "bcryptjs";
import { ObjectId } from "mongodb";
import getConnection from "./conn.js";

const DATABASE = process.env.DATABASE || "componentes-ort";
const COLLECTION = process.env.USUARIOS || "usuarios";

// Helper function
// TODO: Capas puede estar en una carpeta aparte para que cualquiera lo use.
const getCliente = async () => {
  const conn = await getConnection();
  const usuarios = await conn.db(DATABASE).collection(COLLECTION);
  return usuarios;
};

export const getUsuarios = async () => {
  try {
    const conn = await getCliente();
    const usuarios = await conn.find({}).toArray();
    return usuarios;
  } catch (error) {
    console.error("Error al obtener usuarios: ", error);
    throw { success: false, errorMessage: error.message };
  }
};

export const createUsuario = async ({ nombre, email, password }) => {
  try {
    if (!nombre || !email || !password) {
      return new Error("Faltan datos del usuario");
    }

    const conn = await getCliente();

    const usuario = await conn.findOne({ email });
    if (usuario) {
      return new Error("El usuario ya existe");
    }

    // password tiene que ser string para hashearlo con bcryptjs
    if (typeof password !== "string") {
      return new Error("La contraseña debe ser un string");
    }

    // password no tiene que estar vacia
    if (password.trim() === "") {
      return new Error("La contraseña no puede estar vacía.");
    }

    // password tiene que tener al mennos 6 caracteres
    if (password.length < 6) {
      return new Error("La contraseña debe tener al menos 8 caracteres.");
    }

    const saltLength = 10;
    password = await bcryptjs.hash(password, saltLength);

    const usuarioCreado = await conn.insertOne({
      nombre,
      email,
      password,
    });

    return usuarioCreado;
  } catch (error) {
    console.error("Error al crear un usuario: ", error);
    throw { success: false, errorMessage: error.message };
  }
};

export const getUsuarioById = async (userId) => {
  try {
    const conn = await getCliente();
    const usuarioId = await conn.findOne({ _id: new ObjectId(userId) });
    return usuarioId;
  } catch (error) {
    console.error(`Error al obtener usuario ${userId}: `, error);
    throw { success: false, errorMessage: error.message };
  }
};

export const deleteUsuario = async (userId) => {
  try {
    const conn = await getCliente();
    const usuarioEliminado = await conn.deleteOne({
      _id: new ObjectId(userId),
    });
    return usuarioEliminado;
  } catch (error) {
    console.error("Error al crear un usuario: ", error);
    throw { success: false, errorMessage: error.message };
  }
};

export const updateUsuario = async ({ _id, nombre, email, password }) => {
  try {
    if (!_id || !nombre || !email || !password) {
      return new Error("Faltan datos del usuario");
    }

    const conn = await getCliente();
    const query = { _id: new ObjectId(_id) };
    const usuario = await conn.findOne(query);
    if (!usuario) {
      return new Error("No hay usuarios registrados con ese id");
    }

    if (typeof password !== "string") {
      return new Error("La contraseña debe ser un string");
    }

    if (password.trim() === "") {
      return new Error("La contraseña no puede estar vacía.");
    }

    if (password.length < 6) {
      return new Error("La contraseña debe tener al menos 8 caracteres.");
    }

    const saltLength = 10;
    password = await bcryptjs.hash(password, saltLength);

    const usuarioActualizado = await conn.updateOne(query, {
      $set: {
        nombre,
        email,
        password,
      },
    });

    return usuarioActualizado;
  } catch (error) {
    console.error(`Error al actualizar usuario ${_id}: `, error);
    throw { success: false, errorMessage: error.message };
  }
};
