import pool from "../db.js";

export async function obtenerCategorias() {
    const [filas] = await pool.query(
        'SELECT id, nombre FROM categorias ORDER BY nombre')
        return filas
}
