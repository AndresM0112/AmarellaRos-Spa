import multer from "multer";
import crypto from "node:crypto";
import path from "node:path";    

const TIPOS = { "image/jpeg": ".jpg", "image/png": ".png", "image/webp": ".webp" };

export const CARPETA_UPLOADS = path.join(import.meta.dirname, "..", "uploads");

const almacenamiento = multer.diskStorage({
    destination: CARPETA_UPLOADS,
    filename: (req, file, cb) => cb(null, crypto.randomUUID() + TIPOS[file.mimetype]),
});

 const subirImagen = multer({
  storage: almacenamiento,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => cb(null, file.mimetype in TIPOS),
}).single("imagen");

export function subirImagenSegura (req, res, next){
    subirImagen(req, res, function (err){
        if (err instanceof multer.MulterError) {
  return res.status(400).json({ ok: false, mensaje: "La imagen no es válida o pesa más de 5 MB" });
}
if (err) {
  console.error(err);
  return res.status(500).json({ ok: false, mensaje: "No se pudo guardar la imagen" });
}
        next();
    });
}