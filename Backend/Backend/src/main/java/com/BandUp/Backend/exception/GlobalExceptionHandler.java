package com.BandUp.Backend.exception;
import com.BandUp.Backend.exception.PrecioNegativoException;
import com.BandUp.Backend.exception.ProductoNotFoundException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<Object> manejarResourceNotFound(ResourceNotFoundException ex) {
        System.err.println("[404] " + ex.getMessage());
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(new ErrorResponse(ex.getMessage()));
    }

    @ExceptionHandler(ProductoNotFoundException.class)
    public ResponseEntity<Object> manejarProductoNoEncontrado(ProductoNotFoundException ex) {
        System.err.println("[404] " + ex.getMessage());
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(new ErrorResponse(ex.getMessage()));
    }

    @ExceptionHandler(PrecioNegativoException.class)
    public ResponseEntity<Object> manejarPrecioNegativo(PrecioNegativoException ex) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(new ErrorResponse(ex.getMessage()));
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<Object> manejarArgumentoInvalido(IllegalArgumentException ex) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(new ErrorResponse(ex.getMessage()));
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<Object> manejarErroresGenerales(Exception ex) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ErrorResponse("Error interno: " + ex.getMessage()));
    }

    // Clase interna para respuesta de error consistente
    static class ErrorResponse {
        public String error;
        public ErrorResponse(String error) { this.error = error; }
    }
}