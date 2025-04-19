import { useState } from 'react';
import axios from 'axios';
import './Register.css'; // ✅ Importamos el CSS propio

export default function Register() {
  const [user, setUser] = useState({
    username: '',
    email: '',
    password: '',
    nombre: '',
    apellido: '',
    rol: 'user'
  });

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:3001/usuarios', user);
      alert('Usuario registrado correctamente');
    } catch (error) {
      console.error("🔥 Error en el registro:", error);
      alert(error.response?.data?.mensaje || "Error al registrar usuario");
    }
  };

  return (
    <div className="register-container">
      <h2 className="register-title">Registro de Usuario</h2>
      <form onSubmit={handleSubmit}>
        <input
          className="register-input"
          name="username"
          placeholder="Usuario"
          onChange={handleChange}
          required
        />
        <input
          className="register-input"
          name="email"
          type="email"
          placeholder="Email"
          onChange={handleChange}
          required
        />
        <input
          className="register-input"
          name="password"
          type="password"
          placeholder="Contraseña"
          onChange={handleChange}
          required
        />
        <input
          className="register-input"
          name="nombre"
          placeholder="Nombre"
          onChange={handleChange}
          required
        />
        <input
          className="register-input"
          name="apellido"
          placeholder="Apellido"
          onChange={handleChange}
          required
        />
        <button className="register-button" type="submit">
          Registrar
        </button>
      </form>
    </div>
  );
}

