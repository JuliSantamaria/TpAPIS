const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

export const API_URLS = {
    // Productos
    PRODUCTOS: `${API_BASE_URL}/productos`,
    MIS_PRODUCTOS: `${API_BASE_URL}/productos/mis-productos`,PRODUCTO_BY_ID: (id) => `${API_BASE_URL}/productos/${id}`,
    PRODUCTOS_BY_CATEGORIA: (categoria) => `${API_BASE_URL}/productos/categoria/${categoria}`,
    PRODUCTO_STOCK: (id) => `${API_BASE_URL}/productos/${id}/stock`,
    PRODUCTO_IMAGENES: (id) => `${API_BASE_URL}/productos/${id}/imagenes`,
    PRODUCTO_IMAGEN: (id, fileName) => `${API_BASE_URL}/productos/${id}/imagenes/${fileName}`,

    // Usuarios
    USUARIOS: `${API_BASE_URL}/usuarios`,
    USUARIO_BY_ID: (id) => `${API_BASE_URL}/usuarios/${id}`,
    USUARIO_BY_USERNAME: (username) => `${API_BASE_URL}/usuarios/username/${username}`,
    REGISTER: `${API_BASE_URL.replace('/api','')}/auth/register`,
    UPDATE_PASSWORD: (id) => `${API_BASE_URL}/usuarios/${id}/password`,
};

export const handleApiError = (error) => {
    if (error.response) {
        // El servidor respondió con un código de estado fuera del rango 2xx
        return error.response.data.error || error.response.data.message || 'Error en la solicitud';
    } else if (error.request) {
        // La solicitud se hizo pero no se recibió respuesta
        return 'No se pudo conectar con el servidor';
    } else {
        // Algo sucedió en la configuración de la solicitud
        return 'Error al procesar la solicitud';
    }
};

export default API_URLS;
