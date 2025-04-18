
export default function ProductCard({ product }) {
    const { name, description, image, price, stock } = product;
  
    return (
      <div style={{ border: "1px solid #ccc", padding: "1rem", borderRadius: "8px" }}>
        <img src={image} alt={name} style={{ width: "100%", maxHeight: "150px", objectFit: "cover" }} />
        <h3>{name}</h3>
        <p>{description}</p>
        <p><strong>${price}</strong></p>
        {stock > 0 ? (
          <button>Agregar al carrito</button>
        ) : (
          <p style={{ color: "red" }}>Sin stock</p>
        )}
      </div>
    );
  }
  