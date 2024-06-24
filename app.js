import "dotenv/config";
import express from "express";
import morgan from "morgan";
import usuariosRoutes from "./routes/Usuarios.js";
import categoriasRouter from "./routes/categorias.js";
import productosRouter from "./routes/productos.js";
import registroRouter from "./routes/registroUsuarios.js";
import adminRouter from "./routes/Admin.js";
import cors from "cors";

const PORT = process.env.PORT || 3000;
const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));
app.use("/api/usuarios", usuariosRoutes);
app.use("/api/categorias", categoriasRouter);
app.use("/api/productos", productosRouter);
app.use("/api/admin", adminRouter);
app.use("/api/", registroRouter);

app.listen(PORT, () => {
  console.log(`Server running in http://localhost:${PORT}`);
});
