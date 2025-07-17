package com.BandUp.Backend.repository;

import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import com.BandUp.Backend.model.Marca;

public interface MarcaRepository extends JpaRepository<Marca, Long> {
    Optional<Marca> findByNombre(String nombre);
    boolean existsByNombre(String nombre);
}
