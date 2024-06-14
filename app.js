import "dotenv/config";
import express from "express";
import morgan from "morgan";
import usuariosRoutes from "./routes/Usuarios.js";
import categoriasRouter from "./routes/categorias.js";
import usuariosRouter from "./routes/usuarios.js";

const PORT = process.env.PORT || 3000;
const app = express();
app.use(express.json());
app.use(morgan("dev"));
app.use("/api/usuarios", usuariosRoutes);
app.use("/api/categorias", categoriasRouter);
app.use("/api/usuarios", usuariosRouter);

app.listen(PORT, () => {
    console.log(`Server running in http://localhost:${PORT}`);
});
