import axios from 'axios';
import Swal from 'sweetalert2';
import { Icon } from '@iconify/react';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import {
  Box,
  Button,
  Select,
  styled,
  MenuItem,
  TextField,
  InputLabel,
  FormControl,
  OutlinedInput,
  InputAdornment,
} from '@mui/material';

import './style.css';

const ProductForm = () => {
  const [rawname, setRawname] = useState('');
  const [rawunitprice, setRawunitprice] = useState('');
  const [rawquantity, setRawquantity] = useState(0);
  const [rawunit, setRawunit] = useState('');
  const navigate = useNavigate();

  const categories = [
    { value: 'KG', label: 'กิโลกรัม' },
    { value: 'Grams', label: 'กรัม' },
    { value: 'Liters', label: 'ลิตร' },
    { value: 'Pieces', label: 'ชิ้น' },
    { value: 'ซอง', label: 'ซอง' },
    { value: 'ถุง', label: 'ถุง' },
  ];

  const CustomOutlinedInput = styled(OutlinedInput)({
    '& input': {
      textAlign: 'center',
    },
  });

  const handleBack = () => {
    navigate('/raw');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('rawname', rawname);
    formData.append('rawquantity', rawquantity);
    formData.append('rawunit', rawunit);
    formData.append('rawunitprice', rawunitprice);

    try {
      const response = await axios.post(
        'https://cafe-project-server11.onrender.com/api/raws/insertReact',
        { rawname, rawquantity, rawunit, rawunitprice },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.data.success) {
        Swal.fire({
          icon: 'success',
          title: `เพิ่ม ${rawname} สำเร็จ`,
          showConfirmButton: false,
          timer: 1500,
        });
      }
      navigate('/raw');
      console.log(response.data);
    } catch (error) {
      console.error('Error uploading the product:', error);
    }
  };

  const handleIncrement = () => {
    setRawquantity((prevQuantity) => prevQuantity + 1);
  };

  const handleDecrement = () => {
    setRawquantity((prevQuantity) => Math.max(prevQuantity - 1, 0)); // Prevents negative values
  };

  return (
    <div className="form-container">
      <div className="container">
        <div className="frame">
          <h2>เพิ่มวัตถุดิบ</h2>
          <form onSubmit={handleSubmit}>
            <TextField
              type="text"
              value={rawname}
              onChange={(e) => setRawname(e.target.value)}
              label="ชื่อวัตถุดิบ"
              variant="outlined"
              fullWidth
              required
              sx={{ mb: 2 }}
            />
            <FormControl fullWidth variant="outlined" required sx={{ mb: 2 }}>
              <InputLabel>หน่วยนับ</InputLabel>
              <Select value={rawunit} onChange={(e) => setRawunit(e.target.value)} label="หน่วยนับ">
                {categories.map((category) => (
                  <MenuItem key={category.value} value={category.value}>
                    {category.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              type="number"
              value={rawunitprice}
              onChange={(e) => setRawunitprice(e.target.value)}
              label="ราคาต่อหน่วย"
              variant="outlined"
              fullWidth
              required
              sx={{ mb: 2 }}
            />
            <Box display="flex" justifyContent="center" alignItems="center" sx={{ mb: 2 }}>
              <FormControl fullWidth required sx={{ mb: 2 }} variant="outlined">
                <InputLabel htmlFor="raw-quantity">จำนวน</InputLabel>
                <CustomOutlinedInput
                  id="raw-quantity"
                  type="number"
                  value={rawquantity}
                  onChange={(e) => setRawquantity(Number(e.target.value))}
                  startAdornment={
                    <InputAdornment position="start">
                      <Button onClick={handleDecrement}>
                        <Icon icon="mdi:minus" />
                      </Button>
                    </InputAdornment>
                  }
                  endAdornment={
                    <InputAdornment position="end">
                      <Button onClick={handleIncrement}>
                        <Icon icon="mdi:plus" />
                      </Button>
                    </InputAdornment>
                  }
                  label="จำนวน"
                />
              </FormControl>
            </Box>
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
