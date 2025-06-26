import { createContext, useState, useContext, useEffect } from 'react';
import axiosInstance from "../axiosInstance";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); 

  const login = async ({ username }, token) => {
    localStorage.setItem("token", token);
    try {
      const res = await axiosInstance.get(`/api/usuarios/username/${username}`);
      setUser(res.data);
      localStorage.setItem("usuario", JSON.stringify(res.data));
    } catch (err) {
      setUser(null);
      localStorage.removeItem("usuario");
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("usuario");
    localStorage.removeItem("token");
  };

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

export const useAuth = () => useContext(AuthContext);

