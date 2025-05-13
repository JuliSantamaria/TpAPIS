import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import '../assets/perfil.css';

export default function Profile() {
  const { user } = useAuth();
  const [productos, setProductos] = useState([]);
  const [mostrarProductos, setMostrarProductos] = useState(false);
  const claveExcluida = ['id', 'password'];

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const res = await fetch('http://localhost:3002/productos');
        const data = await res.json();
        const productosDelUsuario = data.filter(
          producto => String(producto.userId) === String(user?.id)
        );
        setProductos(productosDelUsuario);
      } catch (error) {
        console.error("Error al obtener productos:", error);
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
