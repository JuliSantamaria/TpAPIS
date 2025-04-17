import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/"); // redirige al home
  };

  return (
    <nav style={{ padding: '10px', borderBottom: '1px solid #ccc' }}>
      <Link to="/">Inicio</Link> |{" "}
      <Link to="/cart">Carrito</Link> |{" "}
      {!user && (
        <>
          <Link to="/login">Login</Link> |{" "}
          <Link to="/register">Registro</Link>
        </>
      )}
      {user && (
        <>
          <span style={{ marginLeft: "10px" }}>
            Bienvenido, <strong>{user.nombre}</strong>
          </span>{" "}
          |{" "}
          <Link to="/profile">Perfil</Link> |{" "}
          {user.rol === "admin" && (
            <>
              <Link to="/admin">Panel Admin</Link> |{" "}
            </>
          )}
          <button onClick={handleLogout} style={{ marginLeft: "10px" }}>
            Cerrar sesión
          </button>
        </>
      )}
    </nav>
  );
}


