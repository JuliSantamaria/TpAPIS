package com.BandUp.Backend.service;

import java.util.List;
import org.springframework.stereotype.Service;
import com.BandUp.Backend.exception.ResourceNotFoundException;
import com.BandUp.Backend.model.Producto;
import com.BandUp.Backend.model.Usuario;
import com.BandUp.Backend.repository.ProductoRepository;
import com.BandUp.Backend.repository.UsuarioRepository;

import jakarta.transaction.Transactional;

@Service
@Transactional
public class ProductoService {
    private final ProductoRepository productoRepository;
    private final UsuarioRepository usuarioRepository;

    public ProductoService(ProductoRepository productoRepository, UsuarioRepository usuarioRepository) {
        this.productoRepository = productoRepository;
        this.usuarioRepository = usuarioRepository;
    }

    public List<Producto> getAllProductos() {
        return productoRepository.findAll();
    }

    public Producto getProductoById(Long id) {
        if (id == 0) {
            throw new IllegalArgumentException("ID 0 no es válido");
        }
        return productoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Producto no encontrado con id: " + id));
    }

    public List<Producto> getProductosByCategoria(String categoria) {
        if (categoria == null || categoria.trim().isEmpty()) {
            throw new IllegalArgumentException("La categoría no puede estar vacía");
        }
        return productoRepository.findByCategoria(categoria);
    }

    public List<Producto> searchProductosByNombre(String nombre) {
        if (nombre == null || nombre.trim().isEmpty()) {
            throw new IllegalArgumentException("El nombre de búsqueda no puede estar vacío");
        }
        return productoRepository.findByNombreContainingIgnoreCase(nombre);
    }

    public List<Producto> getProductosByPriceRange(Double minPrecio, Double maxPrecio) {
        if (minPrecio == null || maxPrecio == null) {
            throw new IllegalArgumentException("Los precios no pueden ser nulos");
        }
        if (minPrecio < 0 || maxPrecio < 0) {
            throw new IllegalArgumentException("Los precios no pueden ser negativos");
        }
        if (minPrecio > maxPrecio) {
            throw new IllegalArgumentException("El precio mínimo no puede ser mayor al precio máximo");
        }
        return productoRepository.findByPrecioRange(minPrecio, maxPrecio);
    }

    public Producto createProducto(Producto producto, String username) {
    validarProducto(producto);
    if (productoRepository.existsByNombre(producto.getNombre())) {
        throw new IllegalArgumentException("Ya existe un producto con ese nombre");
    }

    Usuario usuario = usuarioRepository.findByUsername(username)
        .orElseThrow(() -> new IllegalArgumentException("Usuario no encontrado"));

    producto.setUsuario(usuario);
    return productoRepository.save(producto);
}

    public Producto updateProducto(Long id, Producto productoDetails) {
        Producto producto = getProductoById(id);
        validarProducto(productoDetails);
        
        // Verificar si el nuevo nombre ya existe en otro producto
        if (!producto.getNombre().equals(productoDetails.getNombre()) && 
            productoRepository.existsByNombre(productoDetails.getNombre())) {
            throw new IllegalArgumentException("Ya existe un producto con ese nombre");
        }

        producto.setNombre(productoDetails.getNombre());
        producto.setDescripcion(productoDetails.getDescripcion());
        producto.setDescripcionDetallada(productoDetails.getDescripcionDetallada());
        producto.setCategoria(productoDetails.getCategoria());
        producto.setPrecio(productoDetails.getPrecio());
        producto.setStock(productoDetails.getStock());
        producto.setImagenes(productoDetails.getImagenes());
        producto.setUsuario(productoDetails.getUsuario());

        return productoRepository.save(producto);
    }

    public void deleteProducto(Long id) {
        Producto producto = getProductoById(id);
        productoRepository.delete(producto);
    }

    public Producto updateStock(Long id, int cantidad) {
        if (cantidad < 0) {
            throw new IllegalArgumentException("La cantidad no puede ser negativa");
        }
        Producto producto = getProductoById(id);
        producto.setStock(cantidad);
        return productoRepository.save(producto);
    }

    public Producto addImageToProduct(Long id, String fileName) {
        Producto producto = getProductoById(id);
        producto.getImagenes().add(fileName);
        return productoRepository.save(producto);
    }

    public Producto removeImageFromProduct(Long id, String fileName) {
        Producto producto = getProductoById(id);
        producto.getImagenes().remove(fileName);
        return productoRepository.save(producto);
    }

    private void validarProducto(Producto producto) {
        if (producto.getNombre() == null || producto.getNombre().trim().isEmpty()) {
            throw new IllegalArgumentException("El nombre del producto es requerido");
        }
        if (producto.getPrecio() == null || producto.getPrecio() <= 0) {
            throw new IllegalArgumentException("El precio debe ser mayor a 0");
        }
        if (producto.getStock() < 0) {
            throw new IllegalArgumentException("El stock no puede ser negativo");
        }
        if (producto.getCategoria() == null || producto.getCategoria().trim().isEmpty()) {
            throw new IllegalArgumentException("La categoría es requerida");
        }
    }
}

