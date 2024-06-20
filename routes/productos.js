import express from "express";
import { addProduct, getProducts, getFilteredProducts, getProductById, editProduct, deleteProductById } from "../data/productos.js";

const router = express.Router();

// Ruta /createProd, encargada de crear un producto nuevo.
router.post('/createProd', async (req, res) => {
    try {
        const { nombre, precio, stock, destacado, categoria } = req.body;

        const product = {
            nombre: nombre,
            precio: precio,
            stock: stock,
            destacado: destacado,
            categoria: categoria
        }

        let result = await addProduct(product);

        res.send(result);
    } catch (error) {
        console.error("Error al crear un producto : ", error);
        res.send(result)
    }
})

// Ruta /getProductos, encargada de traer todos los productos.
router.get('/getProductos', async (req, res) => {
    try {
        const products = await getProducts();
        res.json({ products });
    } catch (error) {
        console.error("Error al obtener todos los productos : ", error);
        res.send("Error al obtener todos los productos");
    }
})

// Ruta /getProductos que recibe filtros.
router.get('/getProductos', (req, res) => {

})

// Ruta /getProductos/:id recibe un ID.
router.get('/getProductos/:id', async (req, res) => {
    const id = req.params.id;

    try {
        const producto = await getProductById(id);
        if (producto) {
            res.json({ success: true, producto });
        } else {
            res.status(404).json({ success: false, message: 'Producto no encontrado' });
        }
    } catch (error) {
        console.error('Error al obtener producto por ID:', error);
        res.status(500).json({ success: false, message: 'Error al obtener producto por ID' });
    }
});

// Ruta /editProd, recibe un producto actualizado.
router.put('/editProd', async (req, res) => {

    try {
        const { id, nombre, precio, stock, destacado, categoria } = req.body;

        const product = {
            id: id,
            nombre: nombre,
            precio: precio,
            stock: stock,
            destacado: destacado,
            categoria: categoria
        }

        let result = await editProduct(product);

        res.send("El producto fue actualizado");
    } catch (error) {
        console.error("El producto no pudo ser actualizado : ", error);
        res.send("Error al intentar actualizar el producto.");
    }

})

// Ruta /deleteProd/:id, recibe un ID y elimina el producto correspondiente.
router.get('/deleteProd/:id', async (req, res) => {
    try {
        const id = req.params.id;
        await deleteProductById(id);

        res.send("El producto fue eliminado con exito");
    } catch (error) {
        console.error("El producto no pudo ser eliminado : ", error);
        res.send("Error al intentar eliminar el producto.");
    }
})

export default router;