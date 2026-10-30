import pool from "../db.js";

async function consultarServicios(condicion, parametros) {
  const [filas] = await pool.query(
    `
        SELECT
        s.id, s.nombre, s.descripcion,
        s.precio, s.duracion_minutos,
        s.activo, s.imagen_url,
        c.id AS categoria_id,
        c.nombre AS categoria, 
        i.item AS incluye_item
    FROM servicios s
    JOIN categorias c ON c.id = s.categoria_id
    LEFT JOIN servicio_incluye i ON i.servicio_id = s.id
    ${condicion}
    ORDER BY s.id, i.orden
  `, parametros
  );

  const servicios = [];

  filas.forEach(function (fila) {
    let servicio = servicios.find(function (s) {
      return s.id === fila.id;
    });

    if (!servicio) {
      servicio = {
        categoriaId: fila.categoria_id,
        id: fila.id,
        nombre: fila.nombre,
        descripcion: fila.descripcion,
        precio: fila.precio,
        duracion: fila.duracion_minutos,
        categoria: fila.categoria,
        incluye: [],
        activo: Boolean(fila.activo),
        imagen: fila.imagen_url,
      };
      servicios.push(servicio);
    }

    if (fila.incluye_item) {
      servicio.incluye.push(fila.incluye_item);
    }
  });

  return servicios;
}
export async function obtenerServicios({ incluirInactivos = false } = {}) {
    const condicion = incluirInactivos ? "" : "WHERE s.activo = TRUE";
    return consultarServicios(condicion,[])
}

export async function obtenerServicioPorId(id) {
  const servicios = await consultarServicios("WHERE s.id = ? AND s.activo = TRUE", [id]);
  return servicios[0] || null;
}

export async function crearServicio(datos, id = null) {
  const { categoriaId, nombre, descripcion, precio, duracion, incluye } = datos;
  const conexion = await pool.getConnection();

  try {
    await conexion.beginTransaction();

    const payload = {
      categoria_id: categoriaId,
      nombre,
      descripcion,
      precio,
      duracion_minutos: duracion || null,
    };

    let servicioId = id;

    if (id) {
      const [resultado] = await conexion.query(
        "UPDATE servicios SET ? WHERE id=?",
        [payload, id],
      );

      if (resultado.affectedRows === 0) {
        const errorNoEncontrado = new Error("El servicio no existe");
        errorNoEncontrado.code = "SERVICIO_NO_ENCONTRADO";
        throw errorNoEncontrado;
      }
      await conexion.query(
        "DELETE FROM servicio_incluye WHERE servicio_id = ?",
        [id],
      );
    } else {
      const [resultado] = await conexion.query("INSERT INTO servicios SET ?", [
        payload,
      ]);
      servicioId = resultado.insertId;
    }

    if (incluye.length > 0) {
      const filasIncluye = incluye.map(function (item, i) {
        return [servicioId, item, i + 1];
      });
      await conexion.query(
        "INSERT INTO servicio_incluye (servicio_id, item, orden) VALUES ?",
        [filasIncluye],
      );
    }

    await conexion.commit();
    return servicioId;
  } catch (error) {
    await conexion.rollback();
    throw error;
  } finally {
    conexion.release();
  }
}

export async function cambiarEstadoServicio(id, activo) {
    
    const [resultado] = await pool.query(
      "UPDATE servicios SET activo = ? WHERE id=?",
      [activo ? 1 : 0, id],
    );
    
    if (resultado.affectedRows === 0) {
      const errorNoEncontrado = new Error("El servicio no existe");
      errorNoEncontrado.code = "SERVICIO_NO_ENCONTRADO";
      throw errorNoEncontrado;
    }
    
}

export async function guardarImagen(id, ruta) {
  
  const [resultado] = await pool.query(
    "UPDATE servicios SET imagen_url = ? WHERE id= ?",
    [ruta,id]
  );

  if (resultado.affectedRows === 0) {
      const errorNoEncontrado = new Error("El servicio no existe");
      errorNoEncontrado.code = "SERVICIO_NO_ENCONTRADO";
      throw errorNoEncontrado;
    }
    
  
}