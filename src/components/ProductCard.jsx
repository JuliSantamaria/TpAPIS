import { useCart } from "../context/CartContext"; 

export default function ProductCard({ product }) {
  const { nombre, descripcion, precio, stock, imagenes } = product;
  const { addToCart } = useCart(); 

  return (
    <div style={{ border: "1px solid #ccc", padding: "1rem", borderRadius: "8px" }}>
    
      <img
        src={`/img/${imagenes[0]}`}
        alt={nombre}
        style={{ width: "100%", maxHeight: "150px", objectFit: "cover", borderRadius: "8px" }}
      />
      <h3 >{nombre}</h3>
      <p >{descripcion}</p>
      <p >Stock: {stock}</p>
      <p >${precio}</p>
      {stock > 0 ? (
        <button
          
          onClick={() => {
            console.log("Click en agregar al carrito");
            addToCart(product);
          }}
        >
          Agregar al carrito
        </button>
      ) : (
        <p >Sin stock</p>
      )}
    </div>
  );
}