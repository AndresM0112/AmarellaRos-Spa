import { useLocation } from "react-router";
import { NEGOCIO } from "./config/negocio";
import "./Footer.css";
import logoClaro from "./assets/logo-vertical-claro.png";

const NUMERO_WHATSAPP = import.meta.env.VITE_WHATSAPP_NUMERO;

function Footer() {
  const { pathname } = useLocation();
  if (pathname.startsWith("/admin")) return null;

  const telefonoVisible = NEGOCIO.telefono.replace(
    /(\d{3})(\d{3})(\d{4})/,
    "$1 $2 $3",
  );
  const enlaceWhatsapp = NUMERO_WHATSAPP
    ? `https://wa.me/${NUMERO_WHATSAPP}`
    : null;
  const enlaceMapa = NEGOCIO.direccion
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(NEGOCIO.direccion)}`
    : null;

  return (
    <footer className="footer">
      <div className="footer-contenedor">
        
         <img className="footer-logo" src={logoClaro} alt="Amarella Rosé Spa" width="220" height="108" />
        
        <div className="footer-linea"></div>

        <div className="footer-columnas">
          <section>
            <h2>Contacto</h2>
            <p>
              <a href={`tel:+57${NEGOCIO.telefono}`}>{telefonoVisible}</a>
            </p>
            {enlaceWhatsapp && (
              <p>
                <a href={enlaceWhatsapp} target="_blank" rel="noopener noreferrer">
                  WhatsApp
                </a>
              </p>
            )}
            {NEGOCIO.correo && (
              <p>
                <a href={`mailto:${NEGOCIO.correo}`}>{NEGOCIO.correo}</a>
              </p>
            )}
          </section>

          <section>
            <h2>Horario</h2>
            <p>{NEGOCIO.horario}</p>
          </section>

          <section>
            <h2>Ubicación</h2>
            {NEGOCIO.direccion ? (
              <>
                <p>{NEGOCIO.direccion}</p>
                <p>
                  <a href={enlaceMapa} target="_blank" rel="noopener noreferrer">
                    Cómo llegar
                  </a>
                </p>
              </>
            ) : (
              <p>Dirección próximamente</p>
            )}
          </section>

          <section>
            <h2>Síguenos</h2>
            <p>
              <a href={NEGOCIO.instagram} target="_blank" rel="noopener noreferrer">
                Instagram
              </a>
            </p>
            <p>
              <a href={NEGOCIO.tiktok} target="_blank" rel="noopener noreferrer">
                TikTok
              </a>
            </p>
          </section>
        </div>

        {NEGOCIO.mapaEmbedUrl && (
          <iframe
            className="footer-mapa"
            src={NEGOCIO.mapaEmbedUrl}
            title={`Mapa de ubicación de ${NEGOCIO.nombre}`}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        )}

        <p className="footer-legal">
          © {new Date().getFullYear()} {NEGOCIO.nombre}
        </p>
      </div>
    </footer>
  );
}

export default Footer;