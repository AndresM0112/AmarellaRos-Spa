import { useState } from "react";
import { loginAPI } from "./api/authApi";
import { useNavigate } from "react-router";
import "./Login.css";
import logo from "./assets/logo-vertical.png";

function Login() {
  const [correo, setCorreo] = useState("");
  const [clave, setClave] = useState("");
  const [error, setError] = useState(null);
  const [enviando, setEnviando] = useState(false);
  const navigate = useNavigate();

  async function manejarEnvio(e) {
    e.preventDefault();
    setError(null);
    setEnviando(true);
    try {
      const datos = await loginAPI(correo, clave);

      if (datos.ok) {
        localStorage.setItem("token", datos.token);
        navigate("/admin");
      } else {
        setError(datos.mensaje);
      }
    } catch (err) {
      console.error(err);
      setError("Error al iniciar sesión, no se pudo conectar con el servidor");
    } finally {
      setEnviando(false);
    }
  }

  return (
    <main className="login">
      <form className="login-tarjeta" onSubmit={manejarEnvio}>
        <h1 className="login-titulo">
          <img src={logo} alt="Amarella Rosé Spa" />
        </h1>
        <p className="login-subtitulo">Acceso administración</p>

        <div className="login-campo">
          <label htmlFor="correo">Correo</label>
          <input
            type="email"
            id="correo"
            value={correo}
            autoComplete="email"
            required
            onChange={(e) => setCorreo(e.target.value)}
          />
        </div>

        <div className="login-campo">
          <label htmlFor="clave">Clave</label>
          <input
            type="password"
            id="clave"
            value={clave}
            autoComplete="current-password"
            required
            onChange={(e) => setClave(e.target.value)}
          />
        </div>

        {error && (
          <p className="login-error" role="alert">
            {error}
          </p>
        )}

        <button type="submit" className="login-boton" disabled={enviando}>
          {enviando ? "Ingresando..." : "Iniciar sesión"}
        </button>
      </form>
    </main>
  );
}

export default Login;
