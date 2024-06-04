import "dotenv/config";
import getConnection from "../conn.js";
const DATABASE = process.env.DATABASE;
const CATEGORIAS = process.env.CATEGORIAS;
const ERROR_INSERTAR = "Error al insertar la categoría: ";

async function getCliente() {
  const conndb = await getConnection();
  const cliente = await conndb.db(DATABASE).collection(CATEGORIAS);
  return cliente;
}

//valida que el objeto categoria tenga .nombre
function categoriaValida(categoria) {
  return categoria.nombre ? true : false;
}

//funcion interna para encontrar categoria por nombre
async function getCategoria(nombreCat) {
  try {
    const cliente = await getCliente();
    const result = await cliente.find({ nombre: nombreCat }).toArray();

    return result;
  } catch (error) {
    return new Error(ERROR_INSERTAR + error.message);
  }
}

//funcion para POST que crea una categoria nueva
export async function createCategoria(categoria) {
  if (!categoriaValida(categoria)) {
    throw new Error(ERROR_INSERTAR + "Datos de categoria invalidos");
  }

  const verificaCat = await getCategoria(categoria.nombre);
  //verifica si recibe un array con datos, osea que existe una categoria con ese nombre.
  if (verificaCat.length !== 0) {
    throw new Error(
      ERROR_INSERTAR + `Categoria <<${categoria.nombre}>> ya existe`
    );
  }

  try {
    const cliente = await getCliente();
    const result = await cliente.insertOne(categoria);
    return result;
  } catch (error) {
    throw new Error(ERROR_INSERTAR + error.message);
  }
}
