import axios from 'axios';
import Swal from 'sweetalert2';
import { Icon } from '@iconify/react';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Box, Button, Select, MenuItem, TextField, InputLabel, FormControl } from '@mui/material';

import './style.css';

const ProductForm = () => {
  const [productname, setProductname] = useState('');
  const [type, setType] = useState('');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState(null);
  const navigate = useNavigate();

  const categories = [
    { value: 'เย็น', label: 'เย็น' },
    { value: 'ร้อน', label: 'ร้อน' },
    { value: 'ปั่น', label: 'ปั่น' },
    { value: 'ทั่วไป', label: 'ทั่วไป' },
  ];

  const handleBack = () => {
    navigate('/product');
  };

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
        // 'http://localhost:3333/api/products/insertReact',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      if (response.data.success) {
        Swal.fire({
          icon: 'success',
          title: `เพิ่ม ${productname} สำเร็จ`,
          showConfirmButton: false,
          timer: 1500,
        });
      }
      navigate('/add-product');
      console.log(response.data);
    } catch (error) {
      console.error('Error uploading the product:', error);
    }
  };

  return (
    <div className="form-container">
      <div className="container">
        <div className="frame">
          <h2>เพิ่มสินค้า</h2>
          <form onSubmit={handleSubmit}>
            <TextField
              type="text"
              value={productname}
              onChange={(e) => setProductname(e.target.value)}
              label="Product Name"
              variant="outlined"
              fullWidth
              required
              sx={{ mb: 2 }}
            />
            <FormControl fullWidth variant="outlined" required sx={{ mb: 2 }}>
              <InputLabel>Type</InputLabel>
              <Select value={type} onChange={(e) => setType(e.target.value)} label="Type">
                {categories.map((category) => (
                  <MenuItem key={category.value} value={category.value}>
                    {category.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              label="Price"
              variant="outlined"
              fullWidth
              required
              sx={{ mb: 2 }}
            />
            <input type="file" onChange={(e) => setImage(e.target.files[0])} required />
            <br />
            <br />
            <Box display="flex" justifyContent="flex-end" gap={2} sx={{ mb: 2 }}>
              <Button
                onClick={handleBack}
                variant="contained"
                color="error"
                size="large"
                sx={{ width: '180px', fontSize: 28 }}
              >
                <Icon icon="material-symbols:cancel-outline" sx={{ fontSize: 28 }} />
              </Button>
              <Button
                type="submit"
                variant="outlined"
                color="primary"
                size="large"
                sx={{ width: '180px', fontSize: 28 }}
              >
                <Icon icon="formkit:submit" sx={{ fontSize: 28 }} />
              </Button>
            </Box>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProductForm;
