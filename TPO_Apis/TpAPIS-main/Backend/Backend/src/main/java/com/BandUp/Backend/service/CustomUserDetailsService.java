package com.BandUp.Backend.service;

import com.BandUp.Backend.model.Usuario;
import com.BandUp.Backend.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.*;
import org.springframework.stereotype.Service;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        // Buscar usuario y lanzar excepción inmediatamente si no existe
        Usuario usuario = usuarioRepository.findByUsername(username)
            .orElseThrow(() -> new UsernameNotFoundException("Usuario o contraseña incorrectos"));

        // Devolver UserDetails sin roles
        return User.builder()
                .username(usuario.getUsername())
                .password(usuario.getPassword())
                .roles() // Sin roles
                .build();
    }
}