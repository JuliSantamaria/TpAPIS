package com.BandUp.Backend.controller;

import com.BandUp.Backend.auth.AuthenticationRequest;
import com.BandUp.Backend.auth.AuthenticationResponse;
import com.BandUp.Backend.model.Usuario;
import com.BandUp.Backend.repository.UsuarioRepository;
import com.BandUp.Backend.service.JwtService;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired private AuthenticationManager authenticationManager;
    @Autowired private JwtService jwtService;
    @Autowired private UsuarioRepository usuarioRepository;
    @Autowired private PasswordEncoder passwordEncoder;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AuthenticationRequest request) {
        try {
            authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
            );

            String token = jwtService.generateToken(request.getUsername());

            System.out.println("✅ Login exitoso para usuario: " + request.getUsername());
            System.out.println("🔐 Token generado: " + token);

            return ResponseEntity.ok(new AuthenticationResponse(token));

        } catch (BadCredentialsException e) {
            System.out.println("❌ Credenciales inválidas");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Usuario o contraseña incorrectos"));
        } catch (Exception e) {
            System.out.println("❗ Error inesperado en login: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Error al iniciar sesión, por favor intente nuevamente"));
        }
    }


    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Usuario usuario) {
        try {
            // Validar existencia de username o email
            if (usuarioRepository.existsByUsername(usuario.getUsername()) || usuarioRepository.existsByEmail(usuario.getEmail())) {
                // Mensaje genérico para no delatar info
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(Map.of("error", "No se pudo registrar el usuario. Verifique los datos ingresados."));
            }
            usuario.setPassword(passwordEncoder.encode(usuario.getPassword()));
            Usuario nuevoUsuario = usuarioRepository.save(usuario);
            return ResponseEntity.ok(nuevoUsuario);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "No se pudo registrar el usuario. Intente nuevamente."));
        }
    }
}
