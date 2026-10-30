import { useNavigate } from "react-router";
import { getServiciosAdminAPI, cambiarEstadoAPI } from "./api/serviciosApi";
import FormularioServicio from "./FormularioServicio";
import { useEffect, useState } from "react";
import "./Panel.css";
import Modal from "./Modal";
import { useToast } from "./toast/ToastContext";

function Panel() {
  const navigate = useNavigate();
  const { mostrarToast } = useToast();
  const [servicios, setServicios] = useState([]);
  const [servicioEnEdicion, setServicioEnEdicion] = useState(null);
  const [modalAbierto, setModalAbierto] = useState(false);
  const token = localStorage.getItem("token");

  function cerrarSesion() {
    localStorage.removeItem("token");
    navigate("/admin/login");
  }

  useEffect(
    function () {
      async function cargar() {
        const datos = await getServiciosAdminAPI(token);
        if (datos.ok) setServicios(datos.servicios);
      }
      cargar();
    },
    [token],
  );

  async function cambiarEstado(servicio) {
    try {
      const respuesta = await cambiarEstadoAPI(
        servicio.id,
        !servicio.activo,
        token,
      );
      if (respuesta.ok) {
        cargarServicios();
        const mensaje = servicio.activo
          ? "Servicio desactivado correctamente"
          : "Servicio activado correctamente";
        mostrarToast(mensaje);
      } else {
        mostrarToast(respuesta.mensaje, "error");
      }
    } catch (err) {
      console.log(err);
      mostrarToast("No se pudo conectar con el servidor", "error");
    }
  }

  async function cargarServicios() {
    // para alGuardar
    const datos = await getServiciosAdminAPI(token);
    if (datos.ok) setServicios(datos.servicios);
  }

  function abrirNuevo() {
    setServicioEnEdicion(null);
    setModalAbierto(true);
  }

  function abrirEdicion(servicio) {
    setServicioEnEdicion(servicio);
    setModalAbierto(true);
  }

  function cerrarModal() {
    setModalAbierto(false);
    setServicioEnEdicion(null);
  }

  function alGuardar(fotoFallo) {
    const mensaje = servicioEnEdicion
      ? "Servicio actualizado correctamente"
      : "Servicio creado correctamente";
    cerrarModal();
    cargarServicios();
    if (fotoFallo) {
      mostrarToast(
        "El servicio se guardó, pero la foto no se pudo subir. Edítalo para intentarlo de nuevo.",
        "error",
      );
    } else {
      mostrarToast(mensaje);
    }
  }

  return (
    <div className="panel">
      <div className="panel-encabezado">
        <h1>Panel de administración</h1>
        <button
          className="panel-boton panel-boton--secundario"
          onClick={cerrarSesion}
        >
          Cerrar sesión
        </button>
      </div>

      <section className="panel-tarjeta">
        <div className="panel-tarjeta-encabezado">
          <h2>Servicios</h2>
          <button
            className="panel-boton panel-boton-mas"
            onClick={abrirNuevo}
            aria-label="Nuevo servicio"
            title="Nuevo servicio"
          >
            +
          </button>
        </div>

        <ul className="panel-lista">
          {servicios.map(function (servicio) {
            return (
              <li
                key={servicio.id}
                className={
                  servicio.activo
                    ? "panel-servicio"
                    : "panel-servicio panel-servicio--inactivo"
                }
              >
                <div>
                  {!servicio.activo && (
                    <span className="panel-etiqueta">Inactivo</span>
                  )}
                  <div className="panel-servicio-nombre">{servicio.nombre}</div>
                  <div className="panel-servicio-meta">
                    {servicio.categoria} · $
                    {servicio.precio.toLocaleString("es-CO")}
                  </div>
                </div>
                <input
                  type="checkbox"
                  aria-label="Activo"
                  checked={servicio.activo}
                  onChange={() => cambiarEstado(servicio)}
                />
                <button
                  className="panel-boton panel-boton--secundario"
                  onClick={() => abrirEdicion(servicio)}
                >
                  Editar
                </button>
              </li>
            );
          })}
        </ul>
      </section>

      {modalAbierto && (
        <Modal
          titulo={servicioEnEdicion ? "Editar servicio" : "Nuevo servicio"}
          onCerrar={cerrarModal}
        >
          <FormularioServicio
            servicio={servicioEnEdicion}
            alGuardar={alGuardar}
          />
        </Modal>
      )}
    </div>
  );
}

export default Panel;
