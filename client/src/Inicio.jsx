import { Link } from "react-router";
import { enlaceWhatsapp } from "./config/negocio";
import "./Inicio.css";
import logo from "./assets/isotipo.png";

function Inicio() {
  const enlaceCita = enlaceWhatsapp();

  return (
    <main className="inicio">
      <div className="inicio-texto-bloque">
        <p className="inicio-etiqueta">Belleza, bienestar y cuidado integral</p>
        <h1>Donde tu belleza florece</h1>
        <div className="inicio-linea"></div>
        <p className="inicio-texto">
          Un espacio dedicado a resaltar tu belleza auténtica,cuidar de tu piel y cuerpo 
          y brindarte experiencias de bienestar a través de tratamientos personalizados.
        </p>
        <div className="inicio-botones">
          <Link to="/servicios" className="inicio-boton inicio-boton--lleno">
            Ver servicios
          </Link>
          {enlaceCita && (
            <a
              href={enlaceCita}
              className="inicio-boton inicio-boton--borde"
              target="_blank"
              rel="noopener noreferrer"
            >
              Agendar cita
            </a>
          )}
        </div>
      </div>

      <div className="inicio-marco inicio-marco--logo">
        <div className="inicio-foto inicio-foto--logo">
          <img src={logo} alt="" />
        </div>
      </div>
    </main>
  );
}

export default Inicio;
