package model;

import java.util.List;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.Data;

@Data
@Entity

public class Producto {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private int userId;
    private String nombre;
    private String descripcion;
    private String descripcionDetallada;
    private String categoria;
    private Double precio;
    private int stock;
    private List<String> imagenes;
}
