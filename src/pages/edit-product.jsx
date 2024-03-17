import axios from 'axios';
import { Icon } from '@iconify/react';
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import { Box, Button, Select, MenuItem, TextField, InputLabel, FormControl } from '@mui/material';

import './style.css';

const ProductForm = () => {
  const [productname, setProductname] = useState('');
  const [type, setType] = useState('');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState(null);

  const navigate = useNavigate();
  const { productId } = useParams();

  useEffect(() => {
    if (productId) {
      console.log('Fetching product data for ID:', productId);
      axios
        .get(`https://cafe-project-server11.onrender.com/api/products/${productId}`)
        .then((response) => {
          console.log('Product data:', response.data);
          setProductname(response.data.productname);
          setType(response.data.type);
          setPrice(response.data.price.toString());
          console.log('States after set:', {
            productname: response.data.productname,
            type: response.data.type,
            price: response.data.price.toString(),
          });
        })
        .catch((error) => {
          console.error('Error fetching product:', error);
        });
    }
  }, [productId]);

  const handleBack = () => {
    navigate('/product');
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('productname', productname);
    formData.append('type', type);
    formData.append('price', price);
    if (image) {
      formData.append('image', image);
    }

    try {
      const API_URL = `https://cafe-project-server11.onrender.com/api/products/updateProduct/${productId}`;
      await axios.post(`${API_URL}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      navigate('/product');
    } catch (error) {
      console.error('Error updating product:', error);
    }
  };

  return (
    <div className="form-container">
      <div className="container">
        <div className="frame">
          <h2>แก้ไขสินค้า</h2>
          {/* แสดง Product ID ที่นี่ */}
          {/* <div>Product ID: {productId}</div> */}
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
                <MenuItem value="เย็น">เย็น</MenuItem>
                <MenuItem value="ร้อน">ร้อน</MenuItem>
                <MenuItem value="ปั่น">ปั่น</MenuItem>
                <MenuItem value="ทั่วไป">ทั่วไป</MenuItem>
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
            <input type="file" onChange={handleImageChange} />
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
