import { autenticar } from "../services/auth.Service.js";

export async function login(req, res) {
  const { correo, clave } = req.body;

  if (!correo || !clave) {
    return res.status(400).json({ ok: false, mensaje: "Correo y clave son obligatorios" });
  }

  try {
    const token = await autenticar(correo, clave);

    if (!token) {
      return res.status(401).json({ ok: false, mensaje: "Correo o clave incorrectos" });
    }

    res.json({ ok: true, token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false, mensaje: "Error al iniciar sesión" });
  }
}

export function perfil(req, res) {
  res.json({ ok: true, usuario: req.usuario })
}