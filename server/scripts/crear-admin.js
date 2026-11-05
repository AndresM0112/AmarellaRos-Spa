import "dotenv/config";
import readline from "node:readline/promises";
import { Writable } from "node:stream";
import bcrypt from "bcrypt";
import pool from "../db.js"; 
const LARGO_MINIMO = 8;

// Un solo lector para todo el script; "silenciado" apaga el eco al escribir la clave
let silenciado = false;
const salida = new Writable({
  write(fragmento, codificacion, siguiente) {
    if (!silenciado) process.stdout.write(fragmento, codificacion);
    siguiente();
  },
});
const rl = readline.createInterface({
  input: process.stdin,
  output: salida,
  terminal: true,
});

async function preguntar(texto, { oculto = false } = {}) {
  silenciado = false;
  const respuesta = rl.question(texto);
  silenciado = oculto;
  const valor = await respuesta;
  silenciado = false;
  if (oculto) process.stdout.write("\n");
  return valor;
}

async function main() {
  const correo = (await preguntar("Correo: ")).trim().toLowerCase();
  if (!/^\S+@\S+\.\S+$/.test(correo)) {
    throw new Error("El correo no parece válido");
  }

  const clave = await preguntar(`Clave (mínimo ${LARGO_MINIMO} caracteres): `, { oculto: true });
  const repetida = await preguntar("Repite la clave: ", { oculto: true });
  if (clave !== repetida) throw new Error("Las claves no coinciden");
  if (clave.length < LARGO_MINIMO) {
    throw new Error(`La clave debe tener al menos ${LARGO_MINIMO} caracteres`);
  }

  const hash = await bcrypt.hash(clave, 8);

  const [filas] = await pool.query("SELECT id FROM usuarios WHERE correo = ?", [correo]);
  if (filas.length > 0) {
    await pool.query("UPDATE usuarios SET clave = ? WHERE correo = ?", [hash, correo]);
    console.log(`Clave actualizada para ${correo}`);
  } else {
    await pool.query("INSERT INTO usuarios (correo, clave) VALUES (?, ?)", [correo, hash]);
    console.log(`Administradora creada: ${correo}`);
  }
}

main()
  .catch((error) => {
    console.error("Error:", error.message);
    process.exitCode = 1;
  })
  .finally(() => {
    rl.close();
    return pool.end();
  });