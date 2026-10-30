export async function loginAPI(correo, clave) {
    const respuesta = await fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ correo, clave }),
    })
    
    const datos = await respuesta.json()
    return datos;
}