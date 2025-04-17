import { useState } from 'react';
import axios from 'axios';

export default function Register() {
  const [user, setUser] = useState({
    username: '',
    email: '',
    password: '',
    nombre: '',
    apellido: '',
  });

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/register', user);
      alert('Usuario registrado correctamente');
    } catch (error) {
      console.error("🔥 Error en el registro:", error);
      alert(error.response?.data?.mensaje || "Error al registrar usuario");
    }
    
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="username" placeholder="Usuario" onChange={handleChange} required />
      <input name="email" placeholder="Email" type="email" onChange={handleChange} required />
      <input name="password" placeholder="Contraseña" type="password" onChange={handleChange} required />
      <input name="nombre" placeholder="Nombre" onChange={handleChange} required />
      <input name="apellido" placeholder="Apellido" onChange={handleChange} required />
      <button type="submit">Registrar</button>
    </form>
  );
}
