import { obtenerCategorias } from "../services/categorias.service.js";

export async function listarCategorias(req,res) {
   try {
    const categorias  = await obtenerCategorias()
    res.json({ok:true, categorias})
   } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ ok: false, mensaje: "Error al consultar las categorias" });
   }
    
}