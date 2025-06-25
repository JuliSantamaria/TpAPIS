
import { useState } from "react";
import { useAuth } from "./context/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "./axiosInstance.jsx";
import '../../assets/Login.css';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post("http://localhost:8080/auth/login", {
        username,
        password
      });

      const token = res.data.token;
      localStorage.setItem("token", token);

      login({ username }); 

      await MySwal.fire({
        icon: 'success',
        title: `¡Sesión iniciada como "${username}"!`,
        text: 'Bienvenido de nuevo.',
        confirmButtonColor: '#28a745',
        confirmButtonText: 'Continuar',
        customClass: { popup: 'swal2-border-radius' }
      });

      navigate("/");
    } catch (err) {
      console.error("🔥 Error al intentar loguear:", err);
      setError("Error al iniciar sesión: " + (err.response?.data?.error || err.message));
      await MySwal.fire({
        icon: 'error',
        title: 'Error al iniciar sesión',
        text: err.response?.data?.error || err.message,
        confirmButtonColor: '#dc3545',
        confirmButtonText: 'Intentar de nuevo',
        customClass: { popup: 'swal2-border-radius' }
      });
    }
  };

  return (
    <div className="login-container">
      <h2 className="login-title">Iniciar sesión</h2>
      <form className="form-box" onSubmit={handleSubmit}>
        <input
          className="login-input"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Nombre de usuario"
          required
        />
        <input
          className="login-input"
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button className="login-button" type="submit">
          Entrar
        </button>
      </form>
      
    </div>
  );
}