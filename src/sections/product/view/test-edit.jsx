// src/components/ProductForm.js
import axios from 'axios';
import React, { useState } from 'react';

const ProductForm = () => {
  const [productname, setProductname] = useState('');
  const [type, setType] = useState('');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('productname', productname);
    formData.append('type', type);
    formData.append('price', price);
    formData.append('image', image);

    try {
      const response = await axios.post(
        'https://cafe-project-server11.onrender.com/api/products/insertReact',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      console.log(response.data);
    } catch (error) {
      console.error('Error uploading the product:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={productname}
        onChange={(e) => setProductname(e.target.value)}
        placeholder="Product Name"
        required
      />
      <input
        type="text"
        value={type}
        onChange={(e) => setType(e.target.value)}
        placeholder="Type"
        required
      />
      <input
        type="number"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        placeholder="Price"
        required
      />
      <input type="file" onChange={(e) => setImage(e.target.files[0])} required />
      <button type="submit">Submit</button>
    </form>
  );
};

export default ProductForm;
