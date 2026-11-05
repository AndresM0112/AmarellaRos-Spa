// const BASE_URL = "http://localhost:3000";
// const BASE_URL = "http://192.168.1.146:3000";
// const BASE_URL = import.meta.env.VITE_API_URL;
import { BASE_URL } from "./config";

export function urlImagen(ruta) {
  return ruta ? BASE_URL + ruta : null;
}

async function fetchAdmin(url, opciones = {}) {
  const token = localStorage.getItem("token")
  const respuesta = await fetch(url, {
    ...opciones,
    headers: { ...opciones.headers, Authorization: `Bearer ${token}` },
  });

  if (respuesta.status === 401) {
    localStorage.removeItem("token");
    window.dispatchEvent(new Event("sesion-expirada"));
  }

  return await respuesta.json();
}
export async function getServiciosAPI() {
  const respuesta = await fetch(`${BASE_URL}/api/servicios`)
  const datos = await respuesta.json()
  return datos
}

export async function getServicioAPI(id) {
  const respuesta = await fetch(`${BASE_URL}/api/servicios/${id}`)
  const datos = await respuesta.json()
  return datos
}


export function crearServicioAPI(datos, token) {
  return fetchAdmin(
    `${BASE_URL}/api/servicios`, 
    {
    method : 'POST',
    headers: {
     'Content-Type': 'application/json',},
    body: JSON.stringify(datos),
  },token,)
  
}
export function actualizarServicioAPI(id, datos, token) {
  return fetchAdmin(`${BASE_URL}/api/servicios/${id}`, {
    method : 'PUT',
    headers: {
     'Content-Type': 'application/json',},
    body: JSON.stringify(datos),
  },
  token,)
  
}
export function getServiciosAdminAPI(token) {
  return fetchAdmin(`${BASE_URL}/api/servicios/admin`, {}, token)
 
}

export function cambiarEstadoAPI(id, activo, token) {
  return fetchAdmin(`${BASE_URL}/api/servicios/${id}/activo`, {
    method : 'PATCH',
    headers: {
     'Content-Type': 'application/json',
    },
    body: JSON.stringify({activo}),
  }, token)

}

export function subirImagenAPI(id,archivo,token) {
  const formData = new FormData();
  formData.append("imagen",archivo)
  return fetchAdmin(`${BASE_URL}/api/servicios/${id}/imagen`, {
    method : 'POST',
    body: formData,
    
  },token)
 
  
}

