import "dotenv/config";
import express from "express";
import morgan from "morgan";
import ProductsRoute from "./routes/products.js";

const PORT = process.env.PORT || 3000;
const app = express();
app.use(express.json());
app.use(morgan("dev"));
app.use("/api/products", ProductsRoute);

app.listen(PORT, () => {
    console.log(`Server running in http://localhost:${PORT}`);
});
