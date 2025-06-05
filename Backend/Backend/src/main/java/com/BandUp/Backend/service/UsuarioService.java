package com.BandUp.Backend.service;

import java.util.List;

import org.springframework.stereotype.Service;
import com.BandUp.Backend.exception.ResourceNotFoundException;
import com.BandUp.Backend.model.Usuario;
import com.BandUp.Backend.repository.UsuarioRepository;
import jakarta.transaction.Transactional;

@Service
@Transactional
public class UsuarioService {
    private final UsuarioRepository usuarioRepository;

    public UsuarioService(UsuarioRepository usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }

    public List<Usuario> getAllUsuarios() {
        return usuarioRepository.findAll();
    }

    public Usuario getUsuarioById(Long id) {
        return usuarioRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado con id: " + id));
    }

    public Usuario getUsuarioByUsername(String username) {
        return usuarioRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado con username: " + username));
    }

    public Usuario createUsuario(Usuario usuario) {
        if (usuarioRepository.existsByUsername(usuario.getUsername())) {
            throw new IllegalArgumentException("El nombre de usuario ya está en uso");
        }
        if (usuarioRepository.existsByEmail(usuario.getEmail())) {
            throw new IllegalArgumentException("El email ya está registrado");
        }
        return usuarioRepository.save(usuario);
    }

    public Usuario updateUsuario(Long id, Usuario usuarioDetails) {
        Usuario usuario = getUsuarioById(id);
        
        // Si el username está cambiando, verificar que no exista
        if (!usuario.getUsername().equals(usuarioDetails.getUsername()) && 
            usuarioRepository.existsByUsername(usuarioDetails.getUsername())) {
            throw new IllegalArgumentException("El nombre de usuario ya está en uso");
        }
        
        // Si el email está cambiando, verificar que no exista
        if (!usuario.getEmail().equals(usuarioDetails.getEmail()) && 
            usuarioRepository.existsByEmail(usuarioDetails.getEmail())) {
            throw new IllegalArgumentException("El email ya está registrado");
        }

        usuario.setUsername(usuarioDetails.getUsername());
        usuario.setEmail(usuarioDetails.getEmail());
        usuario.setNombre(usuarioDetails.getNombre());
        usuario.setApellido(usuarioDetails.getApellido());
        // No actualizamos la contraseña aquí por seguridad
        
        return usuarioRepository.save(usuario);
    }

    public void deleteUsuario(Long id) {
        if (!usuarioRepository.existsById(id)) {
            throw new ResourceNotFoundException("Usuario no encontrado con id: " + id);
        }
        usuarioRepository.deleteById(id);
    }

    public Usuario updatePassword(Long id, String oldPassword, String newPassword) {
        Usuario usuario = getUsuarioById(id);
        
        // Aquí deberías agregar la lógica de verificación de la contraseña antigua
        // y el hash de la nueva contraseña antes de guardarla
        
        usuario.setPassword(newPassword);
        return usuarioRepository.save(usuario);
    }
}
