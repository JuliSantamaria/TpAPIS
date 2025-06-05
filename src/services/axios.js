import axios from 'axios';
import { API_BASE_URL } from '../config/api';

// Crear una instancia de axios con la configuración base
const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Interceptor para las solicitudes
axiosInstance.interceptors.request.use(
    (config) => {
        // Aquí puedes agregar lógica como tokens de autenticación
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Interceptor para las respuestas
axiosInstance.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response) {
            // Manejar errores específicos
            switch (error.response.status) {
                case 401:
                    // Manejar error de autenticación
                    break;
                case 403:
                    // Manejar error de autorización
                    break;
                case 404:
                    // Manejar error de recurso no encontrado
                    break;
                case 500:
                    // Manejar error del servidor
                    break;
                default:
                    break;
            }
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;
