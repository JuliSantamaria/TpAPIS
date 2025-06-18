import { useState } from "react";
import { useAuth } from "./context/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "./axiosInstance.jsx";
//import axios from "axios";
import '../../assets/Login.css';


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
    localStorage.setItem("token", token); // ✅ Guardar token JWT en localStorage

    login({ username }); // o como estés manejando el usuario
    navigate("/");
 
    navigate("/");
  } catch (err) {
    console.error("🔥 Error al intentar loguear:", err);
    setError("Error al iniciar sesión: " + (err.response?.data?.error || err.message));
  }
};
  return (
    <div className="login-container">
      <h2 className="login-title">Iniciar sesión</h2>
      <form className="form-box" onSubmit={handleSubmit}>
        <input
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
      {error && <p className="login-error">{error}</p>}
    </div>
  );
  }
