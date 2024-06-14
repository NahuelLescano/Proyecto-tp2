import "dotenv/config";
import { ObjectId } from "mongodb";
import getConnection from "./conn.js";
const DATABASE = process.env.DATABASE;
const CATEGORIAS = process.env.CATEGORIAS;
const ERROR_INSERTAR = "Error al insertar la categoría: ";
const ERROR_OBTENER = "Error al obtener las categorías";
const ERROR_OBTENER_ID = (id) => `Error al obtener categoría (id ${id})`;

//obtiene el la base la coleccion categorias de la base de datos
async function getCliente() {
    try {
        const conndb = await getConnection();
        const cliente = await conndb.db(DATABASE).collection(CATEGORIAS);
        return cliente;
    } catch (error) {
        console.error("Error al obtener la colección de categorías:", error);
        throw error;
    }
}

//valida que el objeto categoria tenga .nombre
function categoriaValida(categoria) {
    return categoria.nombre ? true : false;
}

//funcion interna para encontrar categoria por nombre
async function getCategoria(nombreCat) {
    try {
        const cliente = await getCliente();
        const result = await cliente.findOne({ nombre: nombreCat });
        return result;
    } catch (error) {
        throw error;
    }
}

//funcion para POST que crea una categoria nueva, a partir de un objeto recibido por parametro.
//categoria debe ser { nombre: ... }
export async function createCategoria(categoria) {
    if (!categoriaValida(categoria)) {
        return new Error(ERROR_INSERTAR + "Datos de categoria invalidos");
    }

    const verificaCat = await getCategoria(categoria.nombre);
    //verifica si recibe un objeto, si lo recibe, significa que existe una categoria con ese nombre.
    if (verificaCat) {
        return new Error(
            ERROR_INSERTAR + `Categoria <<${categoria.nombre}>> ya existe`
        );
    }

    try {
        const cliente = await getCliente();
        const result = await cliente.insertOne(categoria);
        return result;
    } catch (error) {
        throw new Error(ERROR_INSERTAR + error.message);
    }
}

//devuelve todos los registros en la coleccion categorias
export async function getCategorias() {
    try {
        const cliente = await getCliente();
        const result = await cliente.find({}).toArray();
        return result;
    } catch (error) {
        throw new Error({ message: ERROR_OBTENER, error: error });
    }
}

export async function getCategoriaById(id) {
    try {
        const cliente = await getCliente();
        const result = await cliente.findOne({ _id: new ObjectId(id) });
        return result;
    } catch (error) {
        throw new Error({ message: ERROR_OBTENER_ID(id), error: error });
    }
}

//recibe un objeto el cual debe tener el _id de la categoria a editar para luego sobrescribir los nuevos datos
export async function editCategoria(categoriaEditada) {
    try {
        const query = { _id: new ObjectId(categoriaEditada._id) };
        const edit = {
            $set: {
                nombre: categoriaEditada.nombre,
            },
        };
        const cliente = await getCliente();
        const result = await cliente.updateOne(query, edit);
        return result;
    } catch (error) {
        throw new Error({
            message: `Error al editar categoria ${categoriaEditada._id}`,
            error: error,
        });
    }
}

//recibe un id por parametro y elimina el registro que coincida con el id
export async function deleteCategoria(id) {
    try {
        const cliente = await getCliente();
        const result = await cliente.deleteOne({ _id: new ObjectId(id) });
        return result;
    } catch (error) {
        throw new Error({
            message: `Error al eliminar categoría (id: ${id})`,
            error: error,
        });
    }
}
