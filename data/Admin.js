import "dotenv/config";
import { ObjectId } from "mongodb";
import getConnection from "./conn.js";
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const DATABASE = process.env.DATABASE;
const USUARIOS = process.env.USUARIOS;
const ERROR_INSERTAR = "Error al insertar la categoría: ";
const ERROR_OBTENER = "Error al obtener las categorías";
const ERROR_OBTENER_ID = (id) => `Error al obtener categoría (id ${id})`;

//funcion para POST que crea una categoria nueva, a partir de un objeto recibido por parametro.
//categoria debe ser { nombre: ... }
export async function loginAdmin(userEmail, userPassword) {
    try{
        const usuario = {email: userEmail, password: userPassword}
        const verificarUsuario = await getUsuario(usuario);

        if (!usuarioAdmin(verificarUsuario)) {
        return new Error("El usuario no es admin.");
        } 
        const token = await generarAuthToken(verificarUsuario);
        return token;
    }catch(error){
        return new Error(error.message);
    }
}

//valida que el objeto categoria tenga .nombre
function usuarioAdmin(usuario) {
    return usuario.admin ? true : false;
  }


async function getUsuario(usuario){
    const conndb = await getConnection();
    const user = await conndb.db(DATABASE).COLLECTION(USUARIOS).findOne({email: usuario.email});
    
    if(!user){
        throw new Error("Usuario o contraseña incorrecta.");
    }

    const isMatch = await bcrypt.compare(usuario.password, user.password)
    if(!isMatch){
        throw new Error("Usuario o contraseña incorrecta.");
    }

    return usuario;
}

export async function generarAuthToken(usuario) {
    const token = await jwt.sign(
      { _id: usuario._id, email: usuario.email },
      process.env.CLAVE_SECRETA,
      { expiresIn: "2h" }
    );
    return token;
};
