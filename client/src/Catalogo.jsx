import { useState, useEffect } from "react";
import { getServiciosAPI } from "./api/serviciosApi";
import ServicioCard from "./ServicioCard";
import "./Catalogo.css"

function normalizar(texto) {
  return texto.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

function Catalogo() {
  const [servicios, setServicios] = useState([]);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(null);
  const [busqueda, setBusqueda] = useState("")

  useEffect(function () {
    async function cargar() {
      const datos = await getServiciosAPI();
      if (datos.ok) setServicios(datos.servicios);
    }
    cargar();
  }, []);

  const categorias = [];

  servicios.forEach(function (servicio) {
    let categoria = categorias.find(function (c) {
      return c.id === servicio.categoriaId;
    });

    if (!categoria) {
      categoria = {
        id: servicio.categoriaId,
        nombre: servicio.categoria,
      };
      categorias.push(categoria);
    }
  });

  const textoBusqueda = normalizar(busqueda.trim());

  const visibles = servicios.filter(function (servicio) {

  const coincideCategoria = categoriaSeleccionada === null || servicio.categoriaId === categoriaSeleccionada;
  const textoServicio = normalizar([servicio.nombre, servicio.descripcion, servicio.categoria, ...servicio.incluye].join(" "));
  const coincideTexto = textoBusqueda === "" || textoServicio.includes(textoBusqueda);
    return coincideCategoria && coincideTexto;
  })
  return (
    <div>
      {/* <h1 className="catalogo-titulo">
        Amarella Rosé<span className="guion">Spa</span>
        </h1> */}
        <h1 className="catalogo-titulo">Nuestros servicios</h1>
      <div className="buscador-contenedor">
     <input
       type="search"
       className="buscador"
       placeholder="Buscar un servicio..."
       aria-label="Buscar un servicio"
       value={busqueda}
       onChange={(e) => setBusqueda(e.target.value)}
     />
   </div>
      <div className="filtro-categorias">
      <button
        className={
          categoriaSeleccionada === null
            ? "filtro-boton filtro-boton--activo"
            : "filtro-boton"
        }
        aria-pressed={categoriaSeleccionada === null}
        onClick={() => setCategoriaSeleccionada(null)}
      >
        Todos los servicios
      </button>
      {categorias.map(function (categoria) {
        return (
          <button
            key={categoria.id}
            className={
              categoriaSeleccionada === categoria.id
                ? "filtro-boton filtro-boton--activo"
                : "filtro-boton"
            }
            aria-pressed={categoriaSeleccionada === categoria.id}
            onClick={() => setCategoriaSeleccionada(categoria.id)}
          >
            {categoria.nombre}
          </button>
        );
      })}
      </div>
      <div className="lista-servicios">
        {visibles.map(function (servicio) {
          return (
            <ServicioCard
              key={servicio.id}
              id={servicio.id}
              nombre={servicio.nombre}
              descripcion={servicio.descripcion}
              precio={servicio.precio}
              duracion={servicio.duracion}
              categoria={servicio.categoria}
              incluye={servicio.incluye}
              imagen={servicio.imagen}
            />
          );
        })}
      </div>
      {servicios.length > 0 && visibles.length === 0 && (
     <p className="sin-resultados">No encontramos servicios con esa búsqueda.</p>
   )}
    </div>
  );
}

export default Catalogo;
