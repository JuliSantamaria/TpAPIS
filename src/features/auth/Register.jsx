import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../../assets/Register.css';

export default function Register() {
  const [user, setUser] = useState({
    username: '',
    email: '',
    password: '',
    nombre: '',
    apellido: '',
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:8080/auth/register', user);
      alert('Usuario registrado correctamente');
      navigate('/login');
    } catch (error) {
      console.error("🔥 Error en el registro:", error);
      setError(error.response?.data?.error || "Error al registrar usuario");
    }
  };

  return (
    <div className="register-container">
      <h2 className="register-title">Registro de Usuario</h2>
  
      <form className="form-box" onSubmit={handleSubmit}>
        <input
          className="register-input"
          type="text"
          name="username"
          placeholder="Usuario"
          onChange={handleChange}
          required
        />
  
        <input
          className="register-input"
          type="email"
          name="email"
          placeholder="Email"
          onChange={handleChange}
          required
        />
  
        <input
          className="register-input"
          type="password"
          name="password"
          placeholder="Contraseña"
          onChange={handleChange}
          required
        />
  
        <input
          className="register-input"
          type="text"
          name="nombre"
          placeholder="Nombre"
          onChange={handleChange}
          required
        />
  
        <input
          className="register-input"
          type="text"
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
  );}