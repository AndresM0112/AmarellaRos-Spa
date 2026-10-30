import { useEffect } from "react";
import { useNavigate } from "react-router";
import { useToast } from "./toast/ToastContext";

function VigilanteSesion() {
  const navigate = useNavigate();
  const { mostrarToast } = useToast();

  useEffect(
    function () {
      function alExpirar() {
        mostrarToast("Tu sesión expiró. Inicia sesión de nuevo.", "error");
        navigate("/admin/login");
      }
      window.addEventListener("sesion-expirada", alExpirar);
      return function () {
        window.removeEventListener("sesion-expirada", alExpirar);
      };
    },
    [navigate, mostrarToast],
  );

  return null;
}

export default VigilanteSesion;