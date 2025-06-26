import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:8080", // o usa API_BASE_URL si tenés un archivo config
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor de request: agregar token si existe y no es login/register
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    const isAuthRoute =
      config.url.includes("/auth/login") ||
      config.url.includes("/auth/register");

    if (token && !isAuthRoute) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log("✅ Se agregó token al header:", config.headers.Authorization);
    } else {
      console.warn("⚠️ No se agregó token al header:", config.url);
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor de respuesta
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      switch (error.response.status) {
        case 401:
        case 403:
          console.warn(`Error ${error.response.status}: Token expirado o acceso prohibido`);
          // Limpiar token y redirigir al login
          localStorage.removeItem("token");
          if (window.location.pathname !== "/login") {
            window.location.href = "/login";
          }
          break;
        case 404:
          console.warn("Error 404: No encontrado");
          break;
        case 500:
          console.error("Error 500: Error interno del servidor");
          break;
        default:
          console.warn("Error desconocido");
          break;
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
