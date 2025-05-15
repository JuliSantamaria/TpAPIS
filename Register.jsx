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
  const navigate = useNavigate();

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validación básica
    if (user.username.trim().length < 3) {
      alert("El nombre de usuario debe tener al menos 3 caracteres");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(user.email)) {
      alert("El email no es válido");
      return;
    }

    if (user.password.length < 6) {
      alert("La contraseña debe tener al menos 6 caracteres");
      return;
    }

    const soloLetras = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ ]+$/;
    if (!soloLetras.test(user.nombre.trim())) {
      alert("El nombre solo debe contener letras");
      return;
    }

    if (!soloLetras.test(user.apellido.trim())) {
      alert("El apellido solo debe contener letras");
      return;
    }

    try {
      // Verificar si ya existe un usuario con ese email
      const res = await axios.get("http://localhost:3002/usuarios");
      const existe = res.data.some(u => u.email === user.email);

      if (existe) {
        alert("Ya existe un usuario con este email");
        return;
      }

      const newUser = {
        ...user,
        id: Date.now().toString(),
        rol: 'user'
      };

      await axios.post('http://localhost:3002/usuarios', newUser);
      alert('Usuario registrado correctamente');
      navigate('/login'); 
    } catch (error) {
      console.error("🔥 Error en el registro:", error);
      alert(error.response?.data?.mensaje || "Error al registrar usuario");
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
  );
}
