import "dotenv/config";
import { ObjectId } from "mongodb";
import getConnection from "./conn.js";
const DATABASE = process.env.DATABASE;
const PRODUCTOS = process.env.PRODUCTOS;

const conndb = await getConnection();

export async function addProduct(product) {
  try {
    const result = await getProductByName(product.nombre);

    if (result != null) {
      return new Error(`El producto '${product.nombre}' ya existe`);
    } else {
      const addedP = await conndb
        .db(DATABASE)
        .collection(PRODUCTOS)
        .insertOne(product);
      return { success: true, result: addedP };
    }
  } catch (error) {
    console.error("Error al crear un producto : ", error);
    throw { success: false, errorMessage: error.message };
  }
}

async function getProductByName(nombre) {
  try {
    const producto = await conndb
      .db(DATABASE)
      .collection(PRODUCTOS)
      .findOne({ nombre: nombre });
    return producto;
  } catch (error) {
    console.error("Error al obtener producto por nombre:", error);
    throw { success: false, errorMessage: error.message };
  }
}

export async function getProductById(id) {
  try {
    const producto = await conndb
      .db(DATABASE)
      .collection(PRODUCTOS)
      .findOne({ _id: new ObjectId(id) });
    return producto;
  } catch (error) {
    throw { success: false, errorMessage: error.message };
  }
}

export async function getProducts(categoriaId, destacado) {
  try {
    let products = await conndb
      .db(DATABASE)
      .collection(PRODUCTOS)
      .find({})
      .toArray();

    if (categoriaId) {
      products = products.filter((p) => p.categoriaId == categoriaId);
    }
    if (destacado !== undefined) {
      const b = destacado === "true";
      products = products.filter((p) => p.destacado == b);
    }

    return { success: true, products };
  } catch (error) {
    console.error("Error al obtener productos:", error);
    throw { success: false, errorMessage: error.message };
  }
}

export async function editProduct(product) {
  try {
    const filter = { _id: new ObjectId(product._id) };
    const updateDoc = {
      $set: {
        nombre: product.nombre,
        descripcion: product.descripcion,
        precio: product.precio,
        stock: product.stock,
        categoria: product.categoria,
        destacado: product.destacado,
      },
    };

    const result = await conndb
      .db(DATABASE)
      .collection(PRODUCTOS)
      .updateOne(filter, updateDoc);

    return result;
  } catch (error) {
    throw { success: false, errorMessage: error.message };
  }
}

export async function deleteProductById(id) {
  try {
    const result = await conndb
      .db(DATABASE)
      .collection(PRODUCTOS)
      .deleteOne({ _id: new ObjectId(id) });
    return result;
  } catch (error) {
    throw { success: false, errorMessage: error.message };
  }
}
