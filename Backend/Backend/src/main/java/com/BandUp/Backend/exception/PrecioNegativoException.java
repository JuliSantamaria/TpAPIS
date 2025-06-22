package com.BandUp.Backend.exception;

/**
 * Excepción lanzada cuando se intenta establecer un precio negativo.
 */
public class PrecioNegativoException extends IllegalArgumentException {
    public PrecioNegativoException(String message) {
        super(message);
}
}
