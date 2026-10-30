import './App.css'
import { Routes, Route } from 'react-router'
import Login from './Login';
import Catalogo from './Catalogo';
import RutaProtegida from './RutaProtegida';
import Panel from './Panel';
import ServicioDetalle from './ServicioDetalle';
import VigilanteSesion from './VigilanteSesion';
import Footer from './Footer';
import Inicio from './Inicio';
import Header from './Header';

function App() {
 
  return (
    <>
    <VigilanteSesion/>
    <Header/>
    <Routes>
     <Route path="/" element={<Inicio />} />
     <Route path="/servicios" element={<Catalogo />} />
     <Route path="/servicio/:id" element={<ServicioDetalle />} />
     <Route path="/admin/login" element={<Login />} />
      <Route path="/admin" element={ <RutaProtegida> <Panel /></RutaProtegida>  }
      />
      <Route path="*" element={<p>Página no encontrada</p>} />
    </Routes>
    <Footer />
    </>

    // <Login></Login>
  );
}

export default App;
