import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState, useEffect } from "react";
import '../assets/Navbar.css';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showCategorias, setShowCategorias] = useState(false);
  const [categorias, setCategorias] = useState([]); // Estado para las categorías

  // Obtener categorías dinámicamente desde el backend
  useEffect(() => {
    fetch("http://localhost:3002/productos")
      .then((res) => res.json())
      .then((data) => {
        const categoriasUnicas = [...new Set(data.map((prod) => prod.categoria))];
        setCategorias(categoriasUnicas);
      })
      .catch((err) => console.error("Error al cargar categorías:", err));
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav style={{ padding: "10px", borderBottom: "1px solid #ccc", display: "flex", gap: "15px", alignItems: "center" }}>
      <Link to="/">Inicio</Link>

      {/* Categorías con dropdown */}
      <div style={{ position: "relative" }}>
        <button
          onClick={() => setShowCategorias(!showCategorias)}
          style={{ cursor: "pointer", background: "none", border: "none", color: "orange" }}
        >
          Categorías ⏷
        </button>
        {showCategorias && (
          <div
            style={{
              position: "absolute",
              backgroundColor: "#fff",
              border: "1px solid #ccc",
              padding: "10px",
              top: "47px",
              zIndex: 1000,
              
            }}
          >
            {categorias.map((categoria, index) => (
              <Link
                key={index}
                to={`/categoria/${categoria.toLowerCase()}`}
                onClick={() => setShowCategorias(false)}
                style={{ display: "block", marginBottom: "5px" }}
              >
                {categoria}
              </Link>
            ))}
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
