import "dotenv/config";
import bcryptjs from "bcryptjs";
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

    const saltLength = 10;
    password = await bcryptjs.hash(password, saltLength);

    const usuarioCreado = await conn.insertOne({
        nombre,
        email,
        password,
    });

    return usuarioCreado;
};

export const getUsuariosId = async (_id) => {
    const conn = await getCliente();
    const usuariosId = conn.findOne({ _id }).toArray();
    return usuariosId;
};
