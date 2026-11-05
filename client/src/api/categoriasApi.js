import { BASE_URL } from "./config";

export async function getCategoriasAPI() {
    const respuesta = await fetch(`${BASE_URL}/api/categorias`)
    const datos = await respuesta.json()
    return datos
    
}