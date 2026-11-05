import { Router } from "express";
import { login, perfil } from "../controller/auth.controlador.js";
import { verifyToken } from "../middleware/auth.middleware.js";
import { limitarLogin } from "../middleware/limitarLogin.middleware.js";

const authRoutes= Router()

authRoutes.post('/login', limitarLogin,login)
authRoutes.get('/perfil', verifyToken, perfil)

export default authRoutes