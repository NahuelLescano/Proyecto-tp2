import "dotenv/config";
import bcryptjs from "bcryptjs";
import { ObjectId } from "mongodb";
import jwt from "jsonwebtoken";
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
    const conn = await getCliente();
    const usuarios = await conn.find({}).toArray();
    return usuarios;
};

export const createUsuarios = async ({ nombre, email, password }) => {
    const conn = await getCliente();

    const usuario = await conn.findOne({ email });
    if (usuario) {
        throw new Error("El usuario ya existe");
    }

    // password tiene que ser string para hashearlo con bcryptjs
    if (typeof password !== "string") {
        throw new Error("La contraseña debe ser un string");
    }

    const saltLength = 10;
    password = await bcryptjs.hash(password, saltLength);

    const usuarioCreado = await conn.insertOne({
        nombre,
        email,
        password,
    });

    return usuarioCreado;
};

export const getUsuariosId = async (userId) => {
    const conn = await getCliente();
    const usuarioId = await conn.findOne({ _id: new ObjectId(userId) });
    return usuarioId;
};

export const deleteUsuarios = async (userId) => {
    const conn = await getCliente();
    const usuarioEliminado = await conn.deleteOne({
        _id: new ObjectId(userId),
    });
    return usuarioEliminado;
};

export const updateUsuarios = async ({ _id, nombre, email, password }) => {
    if (!_id || !nombre || !email || !password) {
        throw new Error("Faltan datos de usuarios");
    }

    const conn = await getCliente();
    const query = { _id: new ObjectId(_id) };
    const usuario = await conn.findOne(query);
    if (!usuario) {
        throw new Error("No hay usuarios registrados con ese id");
    }

    if (typeof password !== "string") {
        throw new Error("La contraseña debe ser un string");
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
};
