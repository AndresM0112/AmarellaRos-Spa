import './Modal.css'
import { useEffect } from 'react'

function Modal({ titulo, onCerrar, children }) {

  useEffect(function(){
    function alPresionarTecla(e){
      if (e.key === "Escape") onCerrar()
    }
    document.addEventListener("keydown", alPresionarTecla)

    return function(){
      document.removeEventListener("keydown", alPresionarTecla)
    };
  },[onCerrar]);

  return (
    <div className="modal-fondo" onClick={onCerrar}>
      <div className="modal-caja" onClick={(e) => e.stopPropagation()}>
        <div className="modal-encabezado">
          <h2>{titulo}</h2>
          <button
            className="panel-boton panel-boton--secundario"
            onClick={onCerrar}
            aria-label="Cerrar"
          >
            ✕
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}

export default Modal