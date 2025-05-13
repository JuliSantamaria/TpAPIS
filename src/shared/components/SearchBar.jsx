import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../assets/Navbar.css';

export default function SearchBar() {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/?q=${encodeURIComponent(searchTerm.trim())}`);
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