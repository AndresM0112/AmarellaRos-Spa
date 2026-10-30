import { useState, useEffect } from "react";
import { useParams, Link } from "react-router";
import { getServicioAPI, urlImagen } from "./api/serviciosApi";
import "./ServicioDetalle.css";
import { formatearDuracion } from "./utils/formato";
const NUMERO_WHATSAPP = import.meta.env.VITE_WHATSAPP_NUMERO;

function ServicioDetalle() {
  const [servicio, setServicio] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  const { id } = useParams();

  useEffect(
    function () {
      async function cargarServicio() {
        setCargando(true);
        setError(null);
        try {
          const datos = await getServicioAPI(id);
          if (datos.ok) {
            setServicio(datos.servicio);
          } else {
            setError(datos.mensaje);
          }
        } catch (err) {
          console.error(err);
          setError("No se pudo conectar con el servidor");
        } finally {
          setCargando(false);
        }
      }
      cargarServicio();
    },
    [id],
  );
  if (cargando) return <p>Cargando...</p>;
  if (error)
    return (
      <div>
        <p>{error}</p>
        <Link to="/servicios">← Volver al catálogo</Link>
      </div>
    );
  const precioFormateado = servicio.precio.toLocaleString("es-CO");

  const mensaje = `Hola, quiero agendar una cita para: ${servicio.nombre}`;
  const enlaceWhatsapp = NUMERO_WHATSAPP ? `https://wa.me/${NUMERO_WHATSAPP}?text=${encodeURIComponent(mensaje)}`
    : null;

  return (
    <main className="detalle">
      <Link to="/servicios" className="detalle-volver" aria-label="Volver al catálogo">
        ←
      </Link>

      <p className="detalle-categoria">{servicio.categoria}</p>
      <h1>{servicio.nombre}</h1>
      <div className="detalle-linea"></div>

      <div className="detalle-foto-marco">
        <div className="detalle-foto">
          {servicio.imagen ? (
            <img src={urlImagen(servicio.imagen)} alt={servicio.nombre} />
          ) : (
            <span className="detalle-sinfoto">Sin foto</span>
          )}
        </div>
        {servicio.duracion > 0 && (
          <span className="detalle-duracion"> {formatearDuracion(servicio.duracion)}</span>
        )}
      </div>

      <p className="detalle-descripcion">{servicio.descripcion}</p>

      {servicio.incluye.length > 0 && (
        <section>
          <h2>Este servicio incluye</h2>
          <ul className="detalle-chips">
            {servicio.incluye.map(function (item, indice) {
              return (
                <li key={indice} className="detalle-chip">
                  {item}
                </li>
              );
            })}
          </ul>
        </section>
      )}

      <div
        className={
          enlaceWhatsapp
            ? "detalle-barra detalle-barra--con-boton"
            : "detalle-barra"
        }
      >
        <p>
          <span className="guion">desde</span>
          <span className="detalle-barra-valor">${precioFormateado}</span>
        </p>
        {enlaceWhatsapp && (
          <a
            href={enlaceWhatsapp}
            className="detalle-barra-boton"
            target="_blank"
            rel="noopener noreferrer"
          >
            Agendar cita
          </a>
        )}
      </div>
    </main>
  );
}

export default ServicioDetalle;
