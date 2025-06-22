import React, { useEffect, useState } from 'react';
import { useAuth } from '../auth/context/AuthContext.jsx';
import axios from 'axios';
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
        const res = await axios.get('http://localhost:8080/api/productos');
        const data = res.data;
        const productosDelUsuario = data.filter(
          producto => producto.usuario && producto.usuario.id === user?.id
        );
        setProductos(productosDelUsuario);
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
              {Object.keys(user)
                .filter(key => !claveExcluida.includes(key))
                .map(key => (
                  <tr key={key}>
                    <th>{key.toUpperCase()}</th>
                    <td>{user[key]}</td>
                  </tr>
                ))}
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
                  <ul>
                    {productos.map(prod => (
                      <li key={prod.id} className="producto-item">
                        <strong>{prod.nombre}</strong> - ${prod.precio}
                        <p>{prod.descripcion}</p>
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
