import { Link, NavLink, useLocation } from "react-router";
import { enlaceWhatsapp } from "./config/negocio";
import "./Header.css";
import logo from "./assets/logo-horizontal.png";

function claseEnlace({ isActive }) {
  return isActive ? "header-enlace header-enlace--activo" : "header-enlace";
}

function Header() {
  const { pathname } = useLocation();
  if (pathname.startsWith("/admin")) return null;

  const enlaceCita = enlaceWhatsapp();

  return (
    <header className="header">
      <Link to="/" className="header-marca">
        <img src={logo} alt="Amarella Rosé Spa, ir al inicio" width="154" height="60" />
      </Link>
      <nav className="header-nav" aria-label="Principal">
        <NavLink to="/" end className={claseEnlace}>
          Inicio
        </NavLink>
        <NavLink to="/servicios" className={claseEnlace}>
          Servicios
        </NavLink>
        {enlaceCita && (
          <a
            href={enlaceCita}
            className="header-cita"
            target="_blank"
            rel="noopener noreferrer"
          >
            Agendar cita
          </a>
        )}
      </nav>
    </header>
  );
}

export default Header;