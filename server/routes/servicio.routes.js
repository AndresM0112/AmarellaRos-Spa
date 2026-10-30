import { Router } from "express";
import { listarServicios, listarServiciosAdmin,
nuevoServicio,actualizarServicio,
actualizarEstadoServicio,
verServicio, actualizarImagen} from "../controller/servicios.controlador.js";
import { verifyToken } from "../middleware/auth.middleware.js";
import { subirImagenSegura } from "../middleware/upload.middleware.js";



const serviciosRoutes = Router()

serviciosRoutes.get('/', listarServicios)
serviciosRoutes.get('/admin', verifyToken, listarServiciosAdmin)
serviciosRoutes.get('/:id', verServicio)
serviciosRoutes.post('/', verifyToken,nuevoServicio)
serviciosRoutes.put('/:id', verifyToken, actualizarServicio)
serviciosRoutes.patch("/:id/activo", verifyToken, actualizarEstadoServicio)
serviciosRoutes.post('/:id/imagen', verifyToken, subirImagenSegura,actualizarImagen)

export default serviciosRoutes