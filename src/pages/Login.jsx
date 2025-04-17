import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Obtenemos todos los usuarios registrados desde el JSON
      const res = await axios.get("http://localhost:3001/usuarios");
      const usuarios = res.data;

      // Buscamos si existe un usuario que coincida
      const usuario = usuarios.find(
        (u) => u.email === email && u.password === password
      );

      if (usuario) {
        login(usuario); // Guardamos el usuario en el contexto
        // Redirigimos al home
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
    <div>
      <h2>Iniciar Sesión</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        /><br/>

        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        /><br/>

        <button type="submit">Entrar</button>
      </form>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}


