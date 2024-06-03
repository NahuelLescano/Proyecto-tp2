import getConnection from "./conn.js";

const DATABASE = "componentes-ort";
const CATEGORIAS = "categorias";

const getConnectionClient = async () => {
    const connectiondb = await getConnection();
    const categorias = await connectiondb
        .db(DATABASE)
        .collection(CATEGORIAS);

    return categorias;
};

export const getAllProducts = async () => {
    const client = await getConnectionClient()
    const categorias = client
        .find({})
        .toArray();

    return categorias;
};
