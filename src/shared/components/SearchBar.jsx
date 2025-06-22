import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_URLS } from '../../config/api';
import '../../assets/Navbar.css';

export default function SearchBar() {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const handleSearch = async (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      try {
        // Usamos el endpoint de búsqueda directamente
        const response = await axios.get(`${API_URLS.PRODUCTOS}/search`, {
          params: {
            nombre: searchTerm.trim()
          }
        });
        
        // Navegamos a la página principal con el término de búsqueda
        navigate(`/?q=${encodeURIComponent(searchTerm.trim())}`);
      } catch (error) {
        console.error('Error en la búsqueda:', error);
      }
    } else {
      navigate('/');
    }
  };

  return (
    <form className="search-form" onSubmit={handleSearch}>
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Buscar productos"
        className="search-input"
      />
      <button type="submit" className="search-btn" aria-label="Buscar">
        🔍
      </button>
    </form>
  );
}