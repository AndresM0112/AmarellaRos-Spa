export const NEGOCIO = {
  nombre: "Amarella Rosé Spa",
  telefono: "3116095786",
  correo: "",
  direccion: "",
  horario: "Atención bajo agendamiento",
  instagram: "https://www.instagram.com/spaamarellarose/",
  tiktok: "https://www.tiktok.com/@spaamarella",
  mapaEmbedUrl: "",
};

const NUMERO_WHATSAPP = import.meta.env.VITE_WHATSAPP_NUMERO;

export function enlaceWhatsapp(mensaje = "Hola, quiero agendar una cita") {
  if (!NUMERO_WHATSAPP) return null;
  return `https://wa.me/${NUMERO_WHATSAPP}?text=${encodeURIComponent(mensaje)}`;
}