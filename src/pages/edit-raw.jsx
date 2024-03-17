import axios from 'axios';
import { Icon } from '@iconify/react';
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import { Box, Button, Select, MenuItem, TextField, InputLabel, FormControl } from '@mui/material';

import './style.css';

const RawForm = () => {
  const [rawname, setRawname] = useState('');
  const [rawquantity, setRawquantity] = useState('');
  const [rawunit, setRawunit] = useState('');
  const [rawunitprice, setRawunitprice] = useState('');

  const navigate = useNavigate();
  const { rawId } = useParams();

  useEffect(() => {
    if (rawId) {
      console.log('Fetching raw material data for ID:', rawId);
      axios
        .get(`https://cafe-project-server11.onrender.com/api/raws/${rawId}`)
        .then((response) => {
          setRawname(response.data.rawname);
          setRawquantity(response.data.rawquantity.toString());
          setRawunit(response.data.rawunit);
          setRawunitprice(response.data.rawunitprice.toString());
        })
        .catch((error) => {
          console.error('Error fetching raw material:', error);
        });
    }
  }, [rawId]);

  const categories = [
    { value: 'กิโลกรัม', label: 'กิโลกรัม' },
    { value: 'กรัม', label: 'กรัม' },
    { value: 'ลิตร', label: 'ลิตร' },
    { value: 'ชิ้น', label: 'ชิ้น' },
    { value: 'ซอง', label: 'ซอง' },
    { value: 'ถุง', label: 'ถุง' },
  ];

  const handleBack = () => {
    navigate('/raw');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const rawData = {
      rawname,
      rawquantity,
      rawunit,
      rawunitprice,
    };

    try {
      // Adjust the URL to your actual server URL
      const API_URL = `https://cafe-project-server11.onrender.com/api/raws/updateRaw/${rawId}`;
      await axios.post(API_URL, rawData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      navigate('/raw');
    } catch (error) {
      console.error('Error updating raw material:', error);
    }
  };

  return (
    <div className="form-container">
      <div className="container">
        <div className="frame">
          <h2>แก้ไขวัตถุดิบ</h2>
          <form onSubmit={handleSubmit}>
            <TextField
              type="text"
              value={rawname}
              onChange={(e) => setRawname(e.target.value)}
              label="Raw Material Name"
              variant="outlined"
              fullWidth
              required
              sx={{ mb: 2 }}
            />
            <TextField
              type="number"
              value={rawquantity}
              onChange={(e) => setRawquantity(e.target.value)}
              label="Quantity"
              variant="outlined"
              fullWidth
              required
              sx={{ mb: 2 }}
            />
            <FormControl fullWidth variant="outlined" required sx={{ mb: 2 }}>
              <InputLabel>Unit</InputLabel>
              <Select value={rawunit} onChange={(e) => setRawunit(e.target.value)} label="Unit">
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
              label="Unit Price"
              variant="outlined"
              fullWidth
              required
              sx={{ mb: 2 }}
            />
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

export default RawForm;
