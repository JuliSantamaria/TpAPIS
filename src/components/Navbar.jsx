
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showCategorias, setShowCategorias] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav style={{ padding: '10px', borderBottom: '1px solid #ccc', display: 'flex', gap: '15px', alignItems: 'center' }}>
      <Link to="/">Inicio</Link>

      {/* Categorías con dropdown */}
      <div style={{ position: 'relative' }}>
        <button
          onClick={() => setShowCategorias(!showCategorias)}
          style={{ cursor: 'pointer', background: 'none', border: 'none', color: 'blue' }}
        >
          Categorías ⏷
        </button>
        {showCategorias && (
          <div
            style={{
              position: 'absolute',
              backgroundColor: '#fff',
              border: '1px solid #ccc',
              padding: '10px',
              top: '30px',
              zIndex: 1000
            }}
          >
            <Link to="/categoria/guitarras" onClick={() => setShowCategorias(false)}>Guitarras</Link><br />
            <Link to="/categoria/baterias" onClick={() => setShowCategorias(false)}>Baterías</Link><br />
            <Link to="/categoria/pianos" onClick={() => setShowCategorias(false)}>Pianos</Link>
          </div>
        )}
      </div>

      <Link to="/cart">Carrito</Link>

      {!user && (
        <>
          <Link to="/login">Login</Link>
          <Link to="/register">Registro</Link>
        </>
      )}
      {user && (
        <>
          <span style={{ marginLeft: "10px" }}>
            Bienvenido, <strong>{user.nombre}</strong>
          </span>
          <Link to="/profile">Perfil</Link>
          {user.rol === "admin" && <Link to="/admin">Panel Admin</Link>}
          <button onClick={handleLogout} style={{ marginLeft: "10px" }}>
            Cerrar sesión
          </button>
        </>
      )}
    </nav>
  );
}
