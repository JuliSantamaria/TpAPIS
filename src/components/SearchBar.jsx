import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';

export default function SearchBar() {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchParams, setSearchParams] = useSearchParams();
  const scrollPosition = useRef(0);

  // Inicializar searchTerm con el valor de la URL si existe
  useEffect(() => {
    const query = searchParams.get('q');
    if (query) setSearchTerm(query);
  }, []);

  const handleChange = (e) => {
    // Guardar la posición actual del scroll
    scrollPosition.current = window.scrollY;
    
    const value = e.target.value;
    setSearchTerm(value);
    
    // Actualizar URL y restaurar la posición del scroll
    if (value.trim()) {
      setSearchParams({ q: value.trim() }, { replace: true });
    } else {
      setSearchParams({}, { replace: true });
    }

    // Restaurar la posición del scroll después de un pequeño retraso
    requestAnimationFrame(() => {
      window.scrollTo(0, scrollPosition.current);
    });
  };

  return (
    <form className="search-form" onSubmit={(e) => e.preventDefault()}>
      <input
        type="text"
        value={searchTerm}
        onChange={handleChange}
        placeholder="Buscar productos"
        className="search-input"
      />
      <button type="button" className="search-btn">🔍</button>
    </form>
  );
}