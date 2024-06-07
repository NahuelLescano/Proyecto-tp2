import "dotenv/config";
import bcryptjs from "bcryptjs";
import { ObjectId } from "mongodb";
import jwt from "jsonwebtoken";
import getConnection from "./conn.js";

const DATABASE = process.env.DATABASE || "componentes-ort";
const COLLECTION = process.env.USUARIOS || "usuarios";

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

export const buscarPorCredenciales = async (email, password) => {
    const conn = await getCliente();

    const usuario = await conn.findOne({ email });
    if (!usuario) {
        throw new Error("Usuario o contraseña inválida");
    }

    const match = await bcryptjs.compare(password, usuario.password);
    if (!match) {
        throw new Error("Usuario o contraseña inválida");
    }

    return user;
};

export const generarTokenAuth = ({ _id, email }) => {
    const token = jwt.sign({ _id, email }, process.env.CLAVE_SECRETA, {
        expiresIn: "1h",
    });
    return token;
};
