import React, { useEffect, useState } from 'react';
import { useAuth } from '../auth/context/AuthContext.jsx';
import axiosInstance from '../auth/axiosInstance';
import { API_URLS } from '../../config/api';
import '../../assets/perfil.css';

export default function Profile() {
  const { user } = useAuth();
  const [productos, setProductos] = useState([]);
  const [mostrarProductos, setMostrarProductos] = useState(false);
  const [error, setError] = useState("");
  const claveExcluida = ['id', 'password'];

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        // Traer solo los productos del usuario autenticado, con imágenes completas
        const res = await axiosInstance.get(API_URLS.MIS_PRODUCTOS);
        setProductos(res.data);
      } catch (error) {
        console.error("Error al obtener productos:", error);
        setError("Error al cargar los productos: " + (error.response?.data?.error || error.message));
      }
    };
    if (user) {
      fetchProductos();
    }
  }, [user]);

  return (
    <div className="profile-container">
      <h1>Perfil</h1>
      {user ? (
        <>
          <table>
            <tbody>
              <tr>
                <th>NOMBRE</th>
                <td>{user.nombre}</td>
              </tr>
              <tr>
                <th>APELLIDO</th>
                <td>{user.apellido}</td>
              </tr>
              <tr>
                <th>EMAIL</th>
                <td>{user.email}</td>
              </tr>
              <tr>
                <th>USERNAME</th>
                <td>{user.username}</td>
              </tr>
            </tbody>
          </table>

          <div className="productos-toggle">
            <button
              className="toggle-button"
              onClick={() => setMostrarProductos(!mostrarProductos)}
            >
              {mostrarProductos ? 'Ocultar productos' : 'Mostrar mis productos publicados'}
            </button>

            {mostrarProductos && (
              <div className="productos-lista">
                {productos.length > 0 ? (
                  <ul className="productos-lista-grid">
                    {productos.map(prod => (
                      <li key={prod.id} className="producto-item">
                        <div className="producto-imagen">
                          <img
                            src={prod.imagenes && prod.imagenes.length > 0 ? prod.imagenes[0] : '/img/placeholder-image.png'}
                            alt={prod.nombre}
                            style={{ width: '80px', height: 'auto', borderRadius: '8px' }}
                            onError={e => { e.target.onerror = null; e.target.src = '/img/placeholder-image.png'; }}
                          />
                        </div>
                        <div className="producto-info">
                          <strong>{prod.nombre}</strong> - ${prod.precio}
                          <p>{prod.descripcion}</p>
                          <span className="producto-categoria">{prod.categoria}</span>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>No tienes productos publicados.</p>
                )}
              </div>
            )}
          </div>
        </>
      ) : (
        <p>No hay usuario logueado.</p>
      )}
    </div>
  );
}
