import rateLimit from "express-rate-limit";

export const limitarLogin = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  skipSuccessfulRequests: true,
  message: {
    ok: false,
    mensaje: "Demasiados intentos. Intenta de nuevo en unos minutos.",
  },
});