import { useState, useEffect, useMemo } from "react";
import { getCategoriasAPI } from "./api/categoriasApi";
import {
  crearServicioAPI,
  actualizarServicioAPI,
  subirImagenAPI,
  urlImagen,
} from "./api/serviciosApi";
import "./FormularioServicio.css";

function FormularioServicio({ servicio, alGuardar }) {
  const [categorias, setCategorias] = useState([]);
  const [categoriaId, setCategoriaId] = useState(
    servicio ? String(servicio.categoriaId) : "",
  );
  const [nombre, setNombre] = useState(servicio ? servicio.nombre : "");
  const [descripcion, setDescripcion] = useState(
    servicio && servicio.descripcion ? servicio.descripcion : "",
  );
  const [precio, setPrecio] = useState(servicio ? String(servicio.precio) : "");
  const [duracion, setDuracion] = useState(
    servicio && servicio.duracion ? String(servicio.duracion) : "",
  );
  const [incluye, setIncluye] = useState(servicio ? servicio.incluye : []);
  const [nuevoItem, setNuevoItem] = useState("");
  const [error, setError] = useState("");
  const [archivo, setArchivo] = useState(null);

  useEffect(function () {
    async function cargar() {
      const datos = await getCategoriasAPI();

      if (datos.ok) {
        setCategorias(datos.categorias);
      }
    }
    cargar();
  }, []);

  function agregarItem() {
    const texto = nuevoItem.trim();
    if (texto === "") return;
    setIncluye([...incluye, texto]);
    setNuevoItem("");
  }

  function quitarItem(indice) {
    setIncluye(
      incluye.filter(function (item, i) {
        return i !== indice;
      }),
    );
  }

  async function manejarEnvio(e) {
    e.preventDefault();
    setError("");

    const token = localStorage.getItem("token");

    const datos = {
      categoriaId: Number(categoriaId),
      nombre,
      descripcion,
      precio: Number(precio),
      duracion: duracion === "" ? null : Number(duracion),
      incluye,
    };

    let respuesta;
    try {
      if (servicio) {
        respuesta = await actualizarServicioAPI(servicio.id, datos, token);
      } else {
        respuesta = await crearServicioAPI(datos, token);
      }
      if (respuesta.ok) {
        let fotoFallo = false;
        if (archivo) {
          try {
            const id = servicio ? servicio.id : respuesta.id;
            const resultado = await subirImagenAPI(id, archivo, token);
            if (!resultado.ok) fotoFallo = true;
          } catch (err) {
            console.error(err);
            fotoFallo = true;
          }
        }
        alGuardar(fotoFallo);
      } else {
        setError(respuesta.mensaje);
      }
    } catch (err) {
      console.error(err);
      setError("No se pudo conectar con el servidor");
    }
  }
  const urlArchivo = useMemo(
    function () {
      return archivo ? URL.createObjectURL(archivo) : null;
    },
    [archivo],
  );

  useEffect(
    function () {
      return function () {
        if (urlArchivo) URL.revokeObjectURL(urlArchivo);
      };
    },
    [urlArchivo],
  );

  const fotoMostrada =
    urlArchivo || urlImagen(servicio ? servicio.imagen : null);

  return (
    <form className="form-servicio" onSubmit={manejarEnvio}>
      <div className="form-campo">
        <label htmlFor="categoria">Categoría</label>
        <select
          id="categoria"
          value={categoriaId}
          onChange={(e) => setCategoriaId(e.target.value)}
        >
          <option value="">Selecciona una categoría</option>
          {categorias.map(function (categoria) {
            return (
              <option key={categoria.id} value={categoria.id}>
                {categoria.nombre}
              </option>
            );
          })}
        </select>
      </div>

      <div className="form-campo">
        <label htmlFor="nombre">Nombre</label>
        <input
          id="nombre"
          type="text"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
        />
      </div>

      <div className="form-campo">
        <label htmlFor="descripcion">Descripción</label>
        <textarea
          id="descripcion"
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
        />
      </div>

      <div className="form-fila">
        <div className="form-campo">
          <label htmlFor="precio">Precio</label>
          <input
            id="precio"
            type="number"
            value={precio}
            onChange={(e) => setPrecio(e.target.value)}
          />
        </div>
        <div className="form-campo">
          <label htmlFor="duracion">Duración (min, opcional)</label>
          <input
            id="duracion"
            type="number"
            value={duracion}
            onChange={(e) => setDuracion(e.target.value)}
          />
        </div>
      </div>

      <div className="form-campo">
        <label htmlFor="nuevoItem">Qué incluye</label>
        <div className="form-agregar">
          <input
            id="nuevoItem"
            type="text"
            value={nuevoItem}
            onChange={(e) => setNuevoItem(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                agregarItem();
              }
            }}
          />
          <button
            type="button"
            className="panel-boton panel-boton--secundario"
            onClick={agregarItem}
          >
            Agregar
          </button>
        </div>

        <ul className="form-items">
          {incluye.map(function (item, indice) {
            return (
              <li key={indice} className="form-item">
                <span>{item}</span>
                <button
                  type="button"
                  className="form-item-quitar"
                  onClick={() => quitarItem(indice)}
                  aria-label={`Quitar ${item}`}
                >
                  ✕
                </button>
              </li>
            );
          })}
        </ul>
      </div>
      <div className="form-campo">
        <label htmlFor="imagen">Foto</label>
        <input
          id="imagen"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={(e) => setArchivo(e.target.files[0] || null)}
        />
        {fotoMostrada && (
          <img
            className="form-vista-previa"
            src={fotoMostrada}
            alt="Vista previa de la foto"
          />
        )}
      </div>

      {error && <p className="form-mensaje form-mensaje--error">{error}</p>}

      <button type="submit" className="panel-boton form-enviar">
        {servicio ? "Guardar cambios" : "Crear servicio"}
      </button>
    </form>
  );
}

export default FormularioServicio;
