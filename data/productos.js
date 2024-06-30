import "dotenv/config";
import { ObjectId } from "mongodb";
import getConnection from "./conn.js";
const DATABASE = process.env.DATABASE;
const PRODUCTOS = process.env.PRODUCTOS;

const conndb = await getConnection();

export async function addProduct(product) {

    let result = await getProductByName(product.nombre);
    let message = "";

    if (result != null) {
        message = "El producto ya existe.";
    } else {
        const result = await conndb.db(DATABASE).collection(PRODUCTOS).insertOne(product);
        message = "El producto fue agregado con exito";
    }

    return message;
}

async function getProductByName(nombre) {
    try {
        const producto = await conndb.db(DATABASE).collection(PRODUCTOS).findOne({ nombre: nombre });
        return producto;
    } catch (error) {
        console.error("Error al obtener producto por nombre:", error);
        return null;
    }
}

export async function getProductById(id) {
    try {
        const producto = await conndb.db(DATABASE).collection(PRODUCTOS).findOne({ _id: new ObjectId(id) });
        return producto;
    } catch (error) {
        console.error("Error al obtener producto por ID:", error);
        return null;
    }
}

export async function getProducts() {
    const products = await conndb.db(DATABASE).collection(PRODUCTOS).find({}).toArray();;
    return products;
}


export async function getFilteredProducts(categoriaId, destacado) {
    try {
        let filteredProducts = await getProducts();
        
        if (categoriaId) {
            filteredProducts = filteredProducts.filter(p => p.categoriaId == categoriaId);
        }
        if (destacado !== undefined) {
            const b = destacado === "true";
            filteredProducts = filteredProducts.filter(p => p.destacado == b);
        }
        
        return { success: true, filteredProducts };
    } catch (error) {
        console.error("Error al obtener productos filtrados:", error);
        return { success: false, message: "Error al obtener productos filtrados" };
    }
}

export async function editProduct(product) {
    const filter = { _id: new ObjectId(product.id) };
    const updateDoc = {
        $set: {
            nombre: product.nombre,
            descripcion: product.descripcion,
            precio: product.precio,
            stock: product.stock,
            categoria: product.categoria,
            destacado: product.destacado
        },
    };

    const result = await conndb.db(DATABASE).collection(PRODUCTOS).findOneAndUpdate(filter, updateDoc, {
        returnOriginal: false,
    });

    return result;
}

export async function deleteProductById(id) {
    const result = await conndb.db(DATABASE).collection(PRODUCTOS).deleteOne({ _id: new ObjectId(id) });
}