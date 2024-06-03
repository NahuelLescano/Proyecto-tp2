import { Router } from "express";
import { getAllProducts } from "../data/products.js";

const router = Router();

router.get("/", async (_req, res) => {
    try {
        const categorias = await getAllProducts();
        return res.status(200).json(categorias);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
});

export default router;
