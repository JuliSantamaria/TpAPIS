import { useEffect } from "react";
import { useAuth } from "./context/AuthContext";
import { useEffect } from "react";
import axiosInstance from "./axiosInstance";

// Hook para inicializar el interceptor con logout del contexto
export function useAxiosAuthInterceptor() {
  const { logout } = useAuth();

  // Solo se agrega una vez
  useEffect(() => {
    const interceptor = axiosInstance.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
          logout();
          localStorage.removeItem("token");
          if (window.location.pathname !== "/login") {
            window.location.href = "/login";
          }
        }
        return Promise.reject(error);
      }
    );
    return () => axiosInstance.interceptors.response.eject(interceptor);
  }, [logout]);
}
