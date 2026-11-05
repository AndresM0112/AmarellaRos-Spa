import express from 'express'
import serviciosRoutes from './routes/servicio.routes.js'
import helmet from "helmet";
import cors from 'cors'
import authRoutes from './routes/auth.routes.js'
import categoriasRoutes from './routes/categorias.routes.js'
import { CARPETA_UPLOADS } from './middleware/upload.middleware.js'


const app = express()
const PUERTO = process.env.PORT || 3000;

app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));

const origenesPermitidos = (process.env.CORS_ORIGIN || "http://localhost:5173")
  .split(",")
  .map((origen) => origen.trim());

app.use(cors({ origin: origenesPermitidos }));

app.use(express.json({ limit: "10kb" }));
// cors({ origin: 'https://amarellarosespa.com' })
app.use('/api/servicios', serviciosRoutes)
app.use('/api/auth', authRoutes)
app.use('/api/categorias', categoriasRoutes)
app.use("/uploads", express.static(CARPETA_UPLOADS));

app.use((req, res) => {
  res.status(404).json({ ok: false, mensaje: "Ruta no encontrada" });
});

app.use((err, req, res, next) => {
  if (err.type === "entity.parse.failed") {
    return res.status(400).json({ ok: false, mensaje: "El cuerpo de la petición no es un JSON válido" });
  }
  if (err.type === "entity.too.large") {
    return res.status(413).json({ ok: false, mensaje: "La petición es demasiado grande" });
  }
  console.error("[error interno]", err);
  res.status(500).json({ ok: false, mensaje: "Error interno del servidor" });
});

app.listen(PUERTO, function () {
  console.log(`Servidor corriendo en http://localhost:${PUERTO}`)
})