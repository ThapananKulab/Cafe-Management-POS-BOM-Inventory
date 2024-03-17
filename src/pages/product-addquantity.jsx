import axios from 'axios';
import React, { useState, useEffect } from 'react';

import { Button } from '@mui/material';

const ProductList = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    // Fetch products from your API
    axios
      .get('http://localhost:3333/api/products')
      .then((response) => setProducts(response.data))
      .catch((error) => console.error('There was an error!', error));
  }, []);

  const increaseQuantity = (productId) => {
    axios
      .post(
        `https://cafe-project-server11.onrender.com/api/products/increaseQuantity/${productId}`,
        { increaseBy: 1 }
      )
      .then((response) => {
        // Update the product in the local state to reflect the new quantity
        setProducts(
          products.map((product) =>
            product._id === productId ? { ...product, quantity: response.data.quantity } : product
          )
        );
      })
      .catch((error) => console.error('There was an error!', error));
  };

  const decreaseQuantity = (productId) => {
    axios
      .post(
        `https://cafe-project-server11.onrender.com/api/products/decreaseQuantity/${productId}`,
        { decreaseBy: 1 }
      )
      .then((response) => {
        // Update the product in the local state to reflect the new quantity
        setProducts(
          products.map((product) =>
            product._id === productId
              ? { ...product, quantity: Math.max(0, response.data.quantity) }
              : product
          )
        );
      })
      .catch((error) => console.error('There was an error!', error));
  };

  return (
    <div>
      {products.map((product) => (
        <div key={product._id}>
          <span>
            {product.productname} - จำนวน: {product.quantity}
          </span>
          <Button onClick={() => increaseQuantity(product._id)}>Increase Quantity</Button>
          <Button onClick={() => decreaseQuantity(product._id)}>Decrease Quantity</Button>
        </div>
      ))}
    </div>
  );
};

export default ProductList;
