import "./ServicioCard.css";
import { Link } from "react-router";
import { urlImagen } from "./api/serviciosApi";
import { formatearDuracion } from "./utils/formato";


function ServicioCard({
  id,
  nombre,
  descripcion,
  precio,
  duracion,
  categoria,
  imagen,
}) {
  const precioFormateado = precio.toLocaleString("es-CO");

  return (
    <Link to={`/servicio/${id}`} className="servicio-enlace">
    <article className="servicio">
      <div className="servicio-imagen">
      {duracion > 0 && <span className="duracion"> {formatearDuracion(duracion)}</span>}
      {imagen ? <img src={urlImagen(imagen)} alt="" loading="lazy" />: <span className="servicio-sinfoto">Sin foto</span>}
    </div>
      <div className="servicio-cuerpo">
      <span className="categoria">{categoria}</span>
      <h3>{nombre}</h3>
      <p className="descripcion">{descripcion}</p>
      <span className="precio-desde">Desde</span>${precioFormateado}
      </div>
    </article>
    </Link>
  );
}

export default ServicioCard;
