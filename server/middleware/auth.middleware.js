import jwt from 'jsonwebtoken'

export function verifyToken(req, res, next){
    const cabecera = req.headers.authorization

    if(!cabecera|| !cabecera.startsWith('Bearer ')){
    return res.status(401).json({ ok: false, mensaje: 'Token requerido' })
  }

  const token = cabecera.split(' ')[1]

  try {
       const payload = jwt.verify(token, process.env.JWT_SECRET, { algorithms: ["HS256"] })
    req.usuario = payload
    next()
  } catch (error) {
    return res.status(401).json({ ok: false, mensaje: 'Token inválido o expirado' })
  }

}