export async function getCategoriasAPI() {
    const respuesta = await fetch('http://localhost:3000/api/categorias')
    const datos = await respuesta.json()
    return datos
    
}