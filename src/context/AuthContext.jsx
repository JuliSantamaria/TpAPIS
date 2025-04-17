import { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Usuario logueado

  // Login: guarda el usuario completo
  const login = (userData) => {
    setUser(userData);
    localStorage.setItem("usuario", JSON.stringify(userData)); // persistencia opcional
  };

  // Logout: limpia todo
  const logout = () => {
    setUser(null);
    localStorage.removeItem("usuario");
  };

  // Recuperar usuario desde localStorage al recargar
  useEffect(() => {
    const storedUser = localStorage.getItem("usuario");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook personalizado para acceder fácilmente
export const useAuth = () => useContext(AuthContext);

