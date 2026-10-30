import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import pool from "../db.js";

export async function autenticar(correo, clave) {
  const [filas] = await pool.query(
    "SELECT id, correo, clave, activo FROM usuarios WHERE correo = ?",
    [correo],
  );

  const usuario = filas[0];
  if(!usuario) return null;

  const claveCorrecta = await bcrypt.compare(clave, usuario.clave);

  if (!claveCorrecta) {
    return null;
  }

    const token = jwt.sign(
      { id: usuario.id, correo: usuario.correo },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    )

    return token
}
