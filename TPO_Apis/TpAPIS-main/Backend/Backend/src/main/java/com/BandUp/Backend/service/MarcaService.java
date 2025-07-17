package com.BandUp.Backend.service;

import com.BandUp.Backend.dto.MarcaRequestDTO;
import com.BandUp.Backend.dto.MarcaResponseDTO;
import com.BandUp.Backend.exception.MarcaNoEncontradaException;
import com.BandUp.Backend.model.Marca;
import com.BandUp.Backend.repository.MarcaRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class MarcaService {
    private final MarcaRepository marcaRepository;

    public MarcaService(MarcaRepository marcaRepository) {
        this.marcaRepository = marcaRepository;
    }

    public List<MarcaResponseDTO> getAllMarcas() {
        return marcaRepository.findAll().stream().map(this::toResponseDTO).collect(Collectors.toList());
    }

    public MarcaResponseDTO getMarcaById(Long id) {
        Marca marca = marcaRepository.findById(id)
                .orElseThrow(() -> new MarcaNoEncontradaException("Marca no encontrada con id: " + id));
        return toResponseDTO(marca);
    }

    public MarcaResponseDTO createMarca(MarcaRequestDTO dto) {
        if (dto.getNombre() == null || dto.getNombre().trim().isEmpty()) {
            throw new IllegalArgumentException("El nombre no puede estar vacío");
        }
        if (marcaRepository.existsByNombre(dto.getNombre())) {
            throw new IllegalArgumentException("El nombre de la marca ya existe");
        }
        Marca marca = new Marca();
        marca.setNombre(dto.getNombre());
        marca.setDescripcion(dto.getDescripcion());
        Marca saved = marcaRepository.save(marca);
        return toResponseDTO(saved);
    }

    public MarcaResponseDTO updateMarca(Long id, MarcaRequestDTO dto) {
        Marca marca = marcaRepository.findById(id)
                .orElseThrow(() -> new MarcaNoEncontradaException("Marca no encontrada con id: " + id));
        if (!marca.getNombre().equals(dto.getNombre()) && marcaRepository.existsByNombre(dto.getNombre())) {
            throw new IllegalArgumentException("El nombre de la marca ya existe");
        }
        marca.setNombre(dto.getNombre());
        marca.setDescripcion(dto.getDescripcion());
        Marca updated = marcaRepository.save(marca);
        return toResponseDTO(updated);
    }

    public void deleteMarca(Long id) {
        if (!marcaRepository.existsById(id)) {
            throw new MarcaNoEncontradaException("Marca no encontrada con id: " + id);
        }
        marcaRepository.deleteById(id);
    }

    private MarcaResponseDTO toResponseDTO(Marca marca) {
        MarcaResponseDTO dto = new MarcaResponseDTO();
        dto.setId(marca.getId());
        dto.setNombre(marca.getNombre());
        dto.setDescripcion(marca.getDescripcion());
        return dto;
    }
}
