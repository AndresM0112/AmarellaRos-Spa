import {
  obtenerServicios,
  crearServicio,
  cambiarEstadoServicio,
  obtenerServicioPorId,
  guardarImagen,
} from "../services/servicios.service.js";
import { unlink } from "node:fs/promises";

async function descartarArchivo(archivo) {
  if (!archivo) return;
  try {
    await unlink(archivo.path);
  } catch (error) {
    console.error(error);
  }
}

export async function listarServicios(req, res) {
  try {
    const servicios = await obtenerServicios();
    res.json({ ok: true, servicios });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ ok: false, mensaje: "Error al consultar los servicios" });
  }
}
export async function verServicio(req, res) {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id <= 0) {
    return res
      .status(400)
      .json({ ok: false, mensaje: "El id del servicio no es válido" });
  }
  try {
    const servicio = await obtenerServicioPorId(id);
    if (!servicio) {
      return res
        .status(404)
        .json({ ok: false, mensaje: "El servicio no existe" });
    }
    res.json({ ok: true, servicio });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ ok: false, mensaje: `Error al consultar el servicio ${id}` });
  }
}
export async function listarServiciosAdmin(req, res) {
  try {
    const servicios = await obtenerServicios({ incluirInactivos: true });
    res.json({ ok: true, servicios });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ ok: false, mensaje: "Error al consultar los servicios" });
  }
}
function validarServicio(cuerpo) {
  const { categoriaId, nombre, precio, incluye } = cuerpo;

  if (!nombre || !nombre.trim()) return "El nombre es obligatorio";
  if (!Number.isInteger(categoriaId) || categoriaId <= 0)
    return "Selecciona una categoría válida";
  if (!Number.isInteger(precio) || precio <= 0)
    return "El precio debe ser un número entero mayor que 0";
  if (
    !Array.isArray(incluye) ||
    !incluye.every(function (item) {
      return typeof item === "string";
    })
  ) {
    return 'La lista "incluye" debe ser un array de textos';
  }

  return null;
}

function limpiarDatos(cuerpo) {
  return {
    categoriaId: cuerpo.categoriaId,
    nombre: cuerpo.nombre.trim(),
    descripcion: cuerpo.descripcion || null,
    precio: cuerpo.precio,
    duracion: cuerpo.duracion,
    incluye: cuerpo.incluye
      .map(function (item) {
        return item.trim();
      })
      .filter(function (item) {
        return item !== "";
      }),
  };
}
export async function nuevoServicio(req, res) {
  const mensaje = validarServicio(req.body);
  if (mensaje) {
    return res.status(400).json({ ok: false, mensaje });
  }

  try {
    const id = await crearServicio(limpiarDatos(req.body));
    res.status(201).json({ ok: true, id });
  } catch (error) {
    if (error.code === "ER_NO_REFERENCED_ROW_2") {
      return res
        .status(400)
        .json({ ok: false, mensaje: "La categoría indicada no existe" });
    }

    console.error(error);
    res.status(500).json({ ok: false, mensaje: "Error al crear el servicio" });
  }
}

export async function actualizarServicio(req, res) {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id <= 0) {
    return res
      .status(400)
      .json({ ok: false, mensaje: "El id del servicio no es válido" });
  }

  const mensaje = validarServicio(req.body);
  if (mensaje) {
    return res.status(400).json({ ok: false, mensaje });
  }

  try {
    await crearServicio(limpiarDatos(req.body), id);
    res.json({ ok: true, id });
  } catch (error) {
    if (error.code === "SERVICIO_NO_ENCONTRADO") {
      return res
        .status(404)
        .json({ ok: false, mensaje: "El servicio no existe" });
    }
    if (error.code === "ER_NO_REFERENCED_ROW_2") {
      return res
        .status(400)
        .json({ ok: false, mensaje: "La categoría indicada no existe" });
    }
    console.error(error);
    res
      .status(500)
      .json({ ok: false, mensaje: "Error al actualizar el servicio" });
  }
}

export async function actualizarEstadoServicio(req, res) {
  const id = Number(req.params.id);
  const { activo } = req.body;

  if (!Number.isInteger(id) || id <= 0) {
    return res
      .status(400)
      .json({ ok: false, mensaje: "El id del servicio no es válido" });
  }

  if (typeof activo !== "boolean") {
    return res
      .status(400)
      .json({ ok: false, mensaje: "Activo debe ser true o false" });
  }

  try {
    await cambiarEstadoServicio(id, activo);
    res.json({ ok: true });
  } catch (error) {
    if (error.code === "SERVICIO_NO_ENCONTRADO") {
      return res
        .status(404)
        .json({ ok: false, mensaje: "El servicio no existe" });
    }
    console.error(error);
    res
      .status(500)
      .json({
        ok: false,
        mensaje: `Error al actualizar el estado del servicio ${id}`,
      });
  }
}

export async function actualizarImagen(req,res) {
 const id = Number(req.params.id);
 
 if (!Number.isInteger(id) || id <= 0) {
   await descartarArchivo(req.file);
   return res
   .status(400)
   .json({ ok: false, mensaje: "El id del servicio no es válido" });
  }
  
  if (!req.file) {
    return res
      .status(400)
      .json({ ok: false, mensaje: "Envía una imagen JPG, PNG o WEBP" });
    }
  
  const rutaImagen  = "/uploads/" + req.file.filename
    
  try {
    await guardarImagen(id,rutaImagen)
    res.json({ ok: true , imagen: rutaImagen});
  } catch (error) {
    await descartarArchivo(req.file);
    if (error.code === "SERVICIO_NO_ENCONTRADO") {
      return res
        .status(404)
        .json({ ok: false, mensaje: "El servicio no existe" });
    }
    console.error(error);
    res
      .status(500)
      .json({
        ok: false,
        mensaje: `Error al actualizar la imagen ${id}`,
      });

  }
}