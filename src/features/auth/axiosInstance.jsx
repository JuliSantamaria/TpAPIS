import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:8080", // o usa API_BASE_URL si tenés un archivo config
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor de request: agregar token si existe y no es una ruta pública
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    const isPublic = config.url.includes("/auth/login") || config.url.includes("/auth/register");

    if (token && !isPublic) {
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
          console.warn("Error 401: No autorizado");
          break;
        case 403:
          console.warn("Error 403: Acceso prohibido");
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
