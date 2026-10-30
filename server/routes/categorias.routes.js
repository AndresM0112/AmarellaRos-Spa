import { Router } from "express";
import { listarCategorias } from "../controller/categorias.controlador.js";

const categoriasRoutes = Router()

categoriasRoutes.get('/', listarCategorias)

export default categoriasRoutes