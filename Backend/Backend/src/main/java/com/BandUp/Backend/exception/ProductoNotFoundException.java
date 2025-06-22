package com.BandUp.Backend.exception;

public class ProductoNotFoundException extends RuntimeException {
    public ProductoNotFoundException(Long id) {
        super("Producto no encontrado con id: " + id);
    }
}
// Esta excepción se lanza cuando un producto no se encuentra en la base de datos por su ID.
// Se extiende de RuntimeException para indicar que es una excepción no verificada.