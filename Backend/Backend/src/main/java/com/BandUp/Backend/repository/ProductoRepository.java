package com.BandUp.Backend.repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import com.BandUp.Backend.model.Producto;

public interface ProductoRepository extends JpaRepository<Producto, Long> {
    List<Producto> findByCategoria(String categoria);
    
    List<Producto> findByNombreContainingIgnoreCase(String nombre);
    
    @Query("SELECT p FROM productos p WHERE p.precio BETWEEN :minPrecio AND :maxPrecio")
    List<Producto> findByPrecioRange(@Param("minPrecio") Double minPrecio, @Param("maxPrecio") Double maxPrecio);
    
    List<Producto> findByStock(int stock);
    
    boolean existsByNombre(String nombre);
}
=======
package com.BandUp.Backend.repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import com.BandUp.Backend.model.Producto;

public interface ProductoRepository extends JpaRepository<Producto, Long> {
    List<Producto> findByCategoria(String categoria);
    
    List<Producto> findByNombreContainingIgnoreCase(String nombre);
    
    @Query("SELECT p FROM productos p WHERE p.precio BETWEEN :minPrecio AND :maxPrecio")
    List<Producto> findByPrecioRange(@Param("minPrecio") Double minPrecio, @Param("maxPrecio") Double maxPrecio);
    
    List<Producto> findByStock(int stock);
    
    boolean existsByNombre(String nombre);
}
