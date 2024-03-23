import axios from 'axios';
import React, { useState } from 'react';

function CreateProductForm() {
  const [productData, setProductData] = useState({
    productname: '',
    type: '', // เพิ่ม field นี้
    price: '',
    quantity: '', // เพิ่ม field นี้
    image: null,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProductData({
      ...productData,
      [name]: value,
    });
  };

  const handleImageChange = (e) => {
    setProductData({
      ...productData,
      image: e.target.files[0],
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('productname', productData.productname);
    formData.append('type', productData.type); // เพิ่ม type
    formData.append('price', productData.price);
    formData.append('quantity', productData.quantity); // เพิ่ม quantity
    formData.append('image', productData.image);

    try {
      const response = await axios.post('http://localhost:3333/api/test/createProduct', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log(response.data);
      // Handle success (e.g., showing a success message, redirecting, etc.)
    } catch (error) {
      console.error(error);
      // Handle error (e.g., showing an error message)
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        name="productname"
        value={productData.productname}
        onChange={handleChange}
        placeholder="Product Name"
        required
      />
      <input
        type="text"
        name="type"
        value={productData.type}
        onChange={handleChange}
        placeholder="Type"
        required
      />
      <input
        type="number"
        name="price"
        value={productData.price}
        onChange={handleChange}
        placeholder="Price"
        required
      />
      <input
        type="number"
        name="quantity"
        value={productData.quantity}
        onChange={handleChange}
        placeholder="Quantity"
        required
      />
      <input type="file" name="image" onChange={handleImageChange} required />
      <button type="submit">Create Product</button>
    </form>
  );
}

export default CreateProductForm;
