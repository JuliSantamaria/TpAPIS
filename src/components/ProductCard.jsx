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
      <h3 className="text-lg font-semibold mt-2">{nombre}</h3>
      <p className="text-sm text-gray-600">{descripcion}</p>
      <p className="text-sm text-gray-600 mt-1">Stock: {stock}</p>
      <p className="font-bold mt-1">${precio}</p>
      {stock > 0 ? (
        <button
          className="mt-2 bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
          onClick={() => {
            console.log("Click en agregar al carrito");
            addToCart(product);
          }}
        >
          Agregar al carrito
        </button>
      ) : (
        <p className="text-red-600 font-semibold mt-2">Sin stock</p>
      )}
    </div>
  );
}