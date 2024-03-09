import axios from 'axios';
import React, { useState, useEffect } from 'react';

const ProductsPage = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:3333/api/products');
        setProducts(response.data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div>
      <h1>Products List</h1>
      <div>
        {products.map((product, index) => (
          <div key={index} style={{ margin: '20px', border: '1px solid #ccc', padding: '10px' }}>
            <h2>{product.productname}</h2>
            <p>Type: {product.type}</p>
            <p>Price: ${product.price}</p>
            <img
              src={`http://localhost:3333/images/${product.image}`}
              alt={product.productname}
              style={{ width: '200px', height: 'auto' }}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductsPage;
