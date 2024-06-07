import "dotenv/config";
import express from "express";
import morgan from "morgan";
import usuariosRoutes from "./routes/Usuarios.js";
import ProductsRoute from "./routes/products.js";
import categoriasRouter from "./routes/categorias.js";

const PORT = process.env.PORT || 3000;
const app = express();
app.use(express.json());
app.use(morgan("dev"));
app.use("/api/usuarios", usuariosRoutes);
app.use("/api/products", ProductsRoute);
app.use("/api/categorias", categoriasRouter);

app.listen(PORT, () => {
    console.log(`Server running in http://localhost:${PORT}`);
});
