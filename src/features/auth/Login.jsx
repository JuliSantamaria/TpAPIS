import { useState } from "react";
import { useAuth } from "./context/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import '../assets/Login.css';


export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.get("http://localhost:3002/usuarios");
      const usuarios = res.data;

      const usuario = usuarios.find(
        (u) => u.email === email && u.password === password
      );

      if (usuario) {
        login(usuario); 
        navigate("/");
      } else {
        setError("Usuario o contraseña incorrectos");
      }
    } catch (err) {
      console.error("🔥 Error al intentar loguear:", err);
      setError("Ocurrió un error al iniciar sesión");
    }
  };

  return (
    <div className="login-container">
      <h2 className="login-title">Iniciar sesión</h2>
      <form className="form-box" onSubmit={handleSubmit}>
        <input
          className="login-input"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
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
