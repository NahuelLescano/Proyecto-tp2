import "dotenv/config";
import getConnection from "./conn.js";

const DATABASE = process.env.DATABASE || "componentes-ort";
const CATEGORIAS = process.env.CATEGORIAS || "categorias";

const getClient = async () => {
    const connectiondb = await getConnection();
    const client = await connectiondb.db(DATABASE).collection(CATEGORIAS);
    return client;
};

export const getAllProducts = async () => {
    const client = await getClient();
    const categorias = await client.find().toArray();

    return categorias;
};
