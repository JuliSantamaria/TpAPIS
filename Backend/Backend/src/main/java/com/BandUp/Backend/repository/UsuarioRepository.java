package com.BandUp.Backend.repository;

import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import com.BandUp.Backend.model.Usuario;

public interface UsuarioRepository extends JpaRepository<Usuario, Long> {
    Optional<Usuario> findByUsername(String username);
    
    Optional<Usuario> findByEmail(String email);
    
    boolean existsByUsername(String username);
    
    boolean existsByEmail(String email);
}
