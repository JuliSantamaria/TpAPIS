import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../../assets/Register.css';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

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
    await MySwal.fire({
      icon: 'success',
      title: '¡Registro exitoso!',
      text: 'Tu cuenta ha sido creada correctamente.',
      confirmButtonColor: '#6c63ff',
      confirmButtonText: 'Ir a iniciar sesión',
      footer: '<b>¡Bienvenido a la plataforma!</b>',
      customClass: {
        popup: 'swal2-border-radius'
      }
    });
    navigate('/login');
  } catch (error) {
    let errorMsg = error.response?.data?.error || "Error al registrar usuario";
    await MySwal.fire({
      icon: 'error',
      title: 'No se pudo registrar',
      text: errorMsg,
      confirmButtonColor: '#dc3545',
      confirmButtonText: 'Intentar de nuevo',
      footer: errorMsg.includes('correo') ? '<b>¿Ya tienes una cuenta?</b>' : ''
    });
    setError(errorMsg);
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