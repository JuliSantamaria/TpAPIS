package com.BandUp.Backend.controller;


import java.security.Principal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import java.io.IOException;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import com.BandUp.Backend.exception.PrecioNegativoException;
import com.BandUp.Backend.model.Producto;
import com.BandUp.Backend.service.ProductoService;
import com.BandUp.Backend.service.FileStorageService;



@RestController
@RequestMapping("/api/productos")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000", "http://127.0.0.1:5173"})
public class ProductoController {

    private final ProductoService productoService;
    private final FileStorageService fileStorageService;

    public ProductoController(ProductoService productoService, FileStorageService fileStorageService) {
        this.productoService = productoService;
        this.fileStorageService = fileStorageService;
    }

    @GetMapping
    public ResponseEntity<List<Producto>> getAllProductos() {
        List<Producto> productos = productoService.getAllProductos();
        productos.forEach(this::setFullImageUrls);
        return ResponseEntity.ok(productos);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Producto> getProductoById(@PathVariable Long id) {
        Producto producto = productoService.getProductoById(id);
        setFullImageUrls(producto);
        return ResponseEntity.ok(producto);
    }

    @GetMapping("/categoria/{categoria}")
    public ResponseEntity<List<Producto>> getProductosByCategoria(@PathVariable String categoria) {
        List<Producto> productos = productoService.getProductosByCategoria(categoria);
        productos.forEach(this::setFullImageUrls);
        return ResponseEntity.ok(productos);
    }

    @GetMapping("/search")
    public ResponseEntity<List<Producto>> searchProductos(
            @RequestParam(required = false) String nombre,
            @RequestParam(required = false) Double minPrecio,
            @RequestParam(required = false) Double maxPrecio) {
        List<Producto> productos;
        if (nombre != null && !nombre.trim().isEmpty()) {
            productos = productoService.searchProductosByNombre(nombre);
        } else if (minPrecio != null && maxPrecio != null) {
            productos = productoService.getProductosByPriceRange(minPrecio, maxPrecio);
        } else {
            productos = productoService.getAllProductos();
        }
        productos.forEach(this::setFullImageUrls);
        return ResponseEntity.ok(productos);
    }

    @PostMapping
    public ResponseEntity<Producto> createProducto(@RequestBody Producto producto, Principal principal) {
        if (producto.getPrecio() < 0) {
            throw new PrecioNegativoException("El precio no puede ser negativo");
        }
        Producto nuevoProducto = productoService.createProducto(producto, principal.getName());
        return new ResponseEntity<>(nuevoProducto, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Producto> updateProducto(@PathVariable Long id, @RequestBody Producto producto) {
        Producto updatedProducto = productoService.updateProducto(id, producto);
        // Forzar carga del usuario para que no venga null en la respuesta
        if (updatedProducto.getUsuario() != null) {
            updatedProducto.getUsuario().getId();
        }
        return ResponseEntity.ok(updatedProducto);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Boolean>> deleteProducto(@PathVariable Long id) {
        productoService.deleteProducto(id);
        Map<String, Boolean> response = new HashMap<>();
        response.put("deleted", Boolean.TRUE);
        return ResponseEntity.ok(response);
    }

    @PatchMapping("/{id}/stock")
    public ResponseEntity<Producto> updateStock(@PathVariable Long id, @RequestParam int cantidad) {
        Producto updatedProducto = productoService.updateStock(id, cantidad);
        return ResponseEntity.ok(updatedProducto);
    }

   @PostMapping("/{id}/imagenes")
public ResponseEntity<Map<String, String>> uploadImage(
        @PathVariable Long id,
        @RequestParam("file") MultipartFile file) throws IOException {
    String fileName = fileStorageService.storeFile(file);
    productoService.addImageToProduct(id, fileName);

    Map<String, String> response = new HashMap<>();
    response.put("fileName", fileName);
    response.put("message", "Imagen subida exitosamente");

    return ResponseEntity.ok(response);
}
    @GetMapping("/{id}/imagenes")
    public ResponseEntity<List<String>> getProductImages(@PathVariable Long id) {
        Producto producto = productoService.getProductoById(id);
        return ResponseEntity.ok(producto.getImagenes());
    }

    @DeleteMapping("/{id}/imagenes/{fileName}")
    public ResponseEntity<Void> deleteImage(
            @PathVariable Long id,
            @PathVariable String fileName) {
        productoService.removeImageFromProduct(id, fileName);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/mis-productos")
    public ResponseEntity<List<Producto>> getMisProductos(Principal principal) {
        List<Producto> productos = productoService.getProductosByUsuario(principal.getName());
        productos.forEach(this::setFullImageUrls);
        return ResponseEntity.ok(productos);
    }

    private String buildImageUrl(String fileName) {
        return "http://localhost:8080/uploads/" + fileName;
    }

    private void setFullImageUrls(Producto producto) {
        if (producto.getImagenes() != null) {
            List<String> fullUrls = producto.getImagenes().stream()
                    .map(this::buildImageUrl)
                    .collect(Collectors.toList());
            producto.setImagenes(fullUrls);
        }
    }
}