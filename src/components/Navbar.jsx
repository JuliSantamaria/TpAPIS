// src/components/Navbar.jsx
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav>
      <Link to="/">Inicio</Link> |{' '}
      <Link to="/cart">Carrito</Link> |{' '}
      {!user && <>
        <Link to="/login">Login</Link> | <Link to="/register">Registro</Link>
      </>}
      {user && (
        <>
          <span>Hola, {user.username}</span> |{' '}
          {user.role === 'admin' && <Link to="/admin">Admin</Link>} |{' '}
          <button onClick={logout}>Logout</button>
        </>
      )}
    </nav>
  );
}
