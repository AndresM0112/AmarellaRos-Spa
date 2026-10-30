import { useState, useRef } from 'react'
import { ToastContext } from './ToastContext'
import './Toast.css'

function ToastProvider({ children }) {
  const [toast, setToast] = useState(null)
  const temporizador = useRef(null)

  function mostrarToast(texto, tipo = 'exito') {
    clearTimeout(temporizador.current)
    setToast({ texto, tipo })
    temporizador.current = setTimeout(function () {
      setToast(null)
    }, 3000)
  }

  return (
    <ToastContext.Provider value={{ mostrarToast }}>
      {children}
      {toast && (
        <div className={`toast toast--${toast.tipo}`} role="status">
          {toast.texto}
        </div>
      )}
    </ToastContext.Provider>
  )
}

export default ToastProvider