import React, { useEffect, useState } from "react";
import "./Product.css";
import { HeaderMenu } from "./components/HeaderMenu.jsx";
import { Box } from "./utiles/Box.jsx";
import "./components/BuyButton.css";

function StarRating({ rating }) {
  return (
    <div className="star-rating">
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          style={{
            fontSize: "24px",
            color: star <= Math.floor(rating) ? "gold" : "gray",
            position: "relative",
          }}
        >
          ★
          {star === Math.ceil(rating) && rating % 1 !== 0 && (
            <span
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "50%",
                overflow: "hidden",
                color: "gold",
              }}
            >
              ★
            </span>
          )}
        </span>
      ))}
    </div>
  );
}

function ProductPage() {
  const [products, setProducts] = useState([]);
  const [similarProducts, setSimilarProducts] = useState([]);
  const [price, setPrice] = useState(0);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [selectedRating, setSelectedRating] = useState(0);

  const productId = new URLSearchParams(window.location.search).get("id");
  const API_URL = `http://127.0.0.1:8000/product/${productId}`;

  useEffect(() => {
    fetch(API_URL)
      .then((response) => response.json())
      .then((data) => {
        setProducts(Array.isArray(data) ? data : [data]); // Asegúrate de que siempre sea un array
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }, [API_URL]);


  const API_URL_SIMILAR = `http://127.0.0.1:8000/products?category=${products[0]?.category}`;


  // fetch para los productos similares
  useEffect(() => {
    if (products.length > 0) {
      fetch(API_URL_SIMILAR)
        .then((response) => response.json())
        .then((data) => {
          setSimilarProducts(Array.isArray(data) ? data : [data]); // Asegúrate de que siempre sea un array
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    }
  }, [products, API_URL_SIMILAR]);

  const handleBuyNow = (price) => {
    alert(`You have purchased this product for $${price.toFixed(2)}`);
    // Hacer que mande a la api quien a comprado el producto que producto y cuando lo ha comprado
    
  };

  useEffect(() => {
    if (products.length > 0) {
      const product = products[0];
      const finalPrice = product.discount > 0
        ? product.price * (1 - product.discount / 100)
        : product.price;
      setPrice(Number(finalPrice.toFixed(2)));
    }
  }, [products]);
  

  

  return (
    <main
      style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      <HeaderMenu />

      <br />
      <br />

      {products.map((product) => (
        <div
          key={product.id}
          className="product-card"
          style={{ marginBottom: "20px" }}
        >
          <img
            className="product-image"
            src={product.image}
            alt={product.name}
          />
          <div className="product-description">
            <h3>{product.name}</h3> 
            
            <p style={{ fontSize: "22px" }}>
            <strong>Price:</strong>{" "}
            {product.discount > 0 ? (
              <>
                <span style={{ textDecoration: "line-through", color: "grey" }}>
                  ${product.price.toFixed(2)}
                </span> {" "}
                <span style={{ color: "red", fontWeight: "bold" }}>
                  ${(
                    product.price *
                    (1 - product.discount / 100)
                  ).toFixed(2)}
                </span>{" "}
                <span style={{ color: "green" }}>(-{product.discount}%)</span>
              </>
            ) : (
              <>${product.price.toFixed(2)}</>
            )}
          </p>

            <p style={{ fontSize: "20px" }}>
              <strong>Category:</strong> {product.category}
            </p>
            <p style={{ fontSize: "18px" }}>
              <strong>Description:</strong> {product.description}
            </p>
            <StarRating rating={product.rating || 0} />
            <button
              className="button-rating"
              onClick={() => setShowRatingModal(true)}
            >
              Rate
            </button>
          </div>
        </div>
      ))}

      {showRatingModal && (
        <div
          className="rating-modal-overlay"
          onClick={() => setShowRatingModal(false)}
        >
          <div
            className="rating-modal-content"
            onClick={(e) => e.stopPropagation()} // Evita cerrar el modal al hacer clic dentro
          >
            <h3>Rate this Product</h3>
            <div className="rating-stars">
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  onClick={() => setSelectedRating(star)}
                  className={star <= selectedRating ? "selected" : ""}
                >
                  ★
                </span>
              ))}
            </div>
            <button
              className="button-rating"
              onClick={() => {
                alert(`You rated this product ${selectedRating} star(s).`);
                setShowRatingModal(false);
                setSelectedRating(0);
              }}
            >
              Submit Rating
            </button>
            <br />
            <button
              onClick={() => setShowRatingModal(false)}
              style={{ marginTop: "10px" }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div data-tooltip={`Price: $${price}`} className="button">
        <div className="button-wrapper" onClick={() => handleBuyNow(price)}>
          <div className="text">Buy Now</div>
          <span className="icon">
            <svg
              viewBox="0 0 16 16"
              className="bi bi-cart2"
              fill="currentColor"
              height="16"
              width="16"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M0 1.5A.5.5 0 0 1 .5 1h1a.5.5 0 0 1 .485.379L2.89 6H14.5a.5.5 0 0 1 .491.592l-1.5 8A.5.5 0 0 1 13 15H4a.5.5 0 0 1-.491-.408L1.01 1.607 0 1.5zM3.14 6l1.25 6h8.22l1.25-6H3.14zM5 12a1 1 0 1 0 0 2 1 1 0 0 0 0-2zm6 0a1 1 0 1 0 0 2 1 1 0 0 0 0-2z" />
            </svg>
          </span>
        </div>
      </div>
      <br />
      {/* productos similares */}
      <h2 style={{ fontSize: "30px" }}>Other Products</h2>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(5, 1fr)",
          gap: "1rem",
          justifyContent: "center",
        }}
      >
        {similarProducts
          .filter((product) => product.id !== products[0]?.id) // Filtrar productos similares que no sean el mismo
          .map((product) => (
            <div key={product.id}>
              <a href={`/product?id=${product.id}`}>
                <Box title={product.name} image={product.image} />
              </a>
            </div>
          ))}
      </div>
    </main>
  );
}

export default ProductPage;
