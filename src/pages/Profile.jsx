import React from 'react';
import { useAuth } from '../context/AuthContext.jsx'; // Ajusta la ruta a tu AuthContext
import '../assets/perfil.css';

export default function Profile() {
  const { user } = useAuth();
  const claveExcluida = ['id', 'password'];

  return (
    <div className="profile-container">
      <h1>Perfil</h1>
      {user ? (
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
      ) : (
        <p>No hay usuario logueado.</p>
      )}
    </div>
  );
}