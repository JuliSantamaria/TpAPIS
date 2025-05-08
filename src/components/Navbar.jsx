import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState, useEffect } from "react";
import '../assets/Navbar.css';
import { useCart } from "../context/CartContext.jsx";
import SearchBar from "./SearchBar.jsx";


export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showCategorias, setShowCategorias] = useState(false);
  const [categorias, setCategorias] = useState([]);
  const { total, toggleCart } = useCart();

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
    <nav className="navbar">
      <div className="navbar-left">
      <Link to="/" className="logo">
        <img src="/img/logobandup.png" alt="Logo Band Up" className="logo-img" />
      </Link>
        <div className="categoria-dropdown">
          <button onClick={() => setShowCategorias(!showCategorias)}>
            ☰ CATEGORÍAS
          </button>
          {showCategorias && (
            <div className="dropdown-menu">
              {categorias.map((categoria, i) => (
                <Link key={i} to={`/categoria/${categoria.toLowerCase()}`} onClick={() => setShowCategorias(false)}>
                  {categoria}
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="navbar-center">
        <SearchBar></SearchBar>
      </div>

      <div className="navbar-right">
        {!user ? (
          <>
            <Link to="/login">INGRESAR</Link> / <Link to="/register">REGISTRARSE</Link>
          </>
        ) : (
          <>
            <span>Hola, {user.nombre}</span>
            <Link to="/profile">Mi cuenta</Link>
            <Link to="/gestion-productos">Gestion de productos</Link>
            <button  onClick={handleLogout}>Cerrar sesion
            </button>
          </>
        )}
        <button onClick={toggleCart} className="cart-button">
        🛒 ${total.toFixed(2)}
        </button>

      </div>
    </nav>
  );
}
