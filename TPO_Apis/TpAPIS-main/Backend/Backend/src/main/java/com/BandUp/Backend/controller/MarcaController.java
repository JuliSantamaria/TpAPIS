package com.BandUp.Backend.controller;

import com.BandUp.Backend.dto.MarcaRequestDTO;
import com.BandUp.Backend.dto.MarcaResponseDTO;
import com.BandUp.Backend.service.MarcaService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/marcas")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000", "http://127.0.0.1:5173"})
public class MarcaController {
    private final MarcaService marcaService;

    public MarcaController(MarcaService marcaService) {
        this.marcaService = marcaService;
    }

    @GetMapping
    public ResponseEntity<List<MarcaResponseDTO>> getAllMarcas() {
        return ResponseEntity.ok(marcaService.getAllMarcas());
    }

    @GetMapping("/{id}")
    public ResponseEntity<MarcaResponseDTO> getMarcaById(@PathVariable Long id) {
        return ResponseEntity.ok(marcaService.getMarcaById(id));
    }

    @PostMapping
    public ResponseEntity<MarcaResponseDTO> createMarca(@RequestBody MarcaRequestDTO dto) {
        return new ResponseEntity<>(marcaService.createMarca(dto), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<MarcaResponseDTO> updateMarca(@PathVariable Long id, @RequestBody MarcaRequestDTO dto) {
        return ResponseEntity.ok(marcaService.updateMarca(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMarca(@PathVariable Long id) {
        marcaService.deleteMarca(id);
        return ResponseEntity.noContent().build();
    }
}
