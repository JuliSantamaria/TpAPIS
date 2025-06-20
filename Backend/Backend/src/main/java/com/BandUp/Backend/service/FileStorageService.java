package com.BandUp.Backend.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

@Service
public class FileStorageService {    @Value("${app.upload.dir:uploads}")
    private String uploadDir;

    public String storeFile(MultipartFile file) throws IOException {
        Path uploadPath = Paths.get(uploadDir).toAbsolutePath().normalize();

        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        // Limpiar el nombre del archivo
        String originalFileName = file.getOriginalFilename();
        String cleanFileName = originalFileName.replaceAll("[^a-zA-Z0-9.-]", "_");
        
        // Generar nombre único para el archivo
        String fileName = UUID.randomUUID().toString() + "_" + cleanFileName;

        // Copiar archivo al directorio de uploads
        Path targetLocation = uploadPath.resolve(fileName);
        Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);

        return fileName;
    }
}
