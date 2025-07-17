package com.BandUp.Backend.model;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity(name = "marcas")
public class Marca {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String nombre;

    private String descripcion;
}
