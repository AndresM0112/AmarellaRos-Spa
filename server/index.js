import express from 'express'
import serviciosRoutes from './routes/servicio.routes.js'
import cors from 'cors'
import authRoutes from './routes/auth.routes.js'
import categoriasRoutes from './routes/categorias.routes.js'
import { CARPETA_UPLOADS } from './middleware/upload.middleware.js'

const app = express()
const PUERTO = 3000

app.use(cors())
app.use(express.json())
// cors({ origin: 'https://amarellarosespa.com' })
app.use('/api/servicios', serviciosRoutes)
app.use('/api/auth', authRoutes)
app.use('/api/categorias', categoriasRoutes)
app.use("/uploads", express.static(CARPETA_UPLOADS));

app.listen(PUERTO, function () {
  console.log(`Servidor corriendo en http://localhost:${PUERTO}`)
})