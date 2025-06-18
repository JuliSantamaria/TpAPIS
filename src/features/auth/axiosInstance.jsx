import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:8080", 
});


axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    // No agregar token si es una ruta pública
    const isPublic = config.url.includes("/auth/login") || config.url.includes("/auth/register");

    if (token && !isPublic) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);


export default axiosInstance;
