import axios from 'axios';
import React, { useState, useEffect } from 'react';

import {
  Card,
  Grid,
  Button,
  Select,
  MenuItem,
  Container,
  TextField,
  Typography,
  InputLabel,
  FormControl,
  CardContent,
} from '@mui/material';

function UpdateStock() {
  const [inventoryItems, setInventoryItems] = useState([]);
  const [selectedItemId, setSelectedItemId] = useState('');
  const [adjustment, setAdjustment] = useState('');
  const [currentStock, setCurrentStock] = useState(0); // สำหรับแสดงยอด stock คงเหลือ
  const [unitPerContainer, setUnitPerContainer] = useState('');
  const [multipliedResult, setMultipliedResult] = useState(0);

  useEffect(() => {
    const fetchInventoryItems = async () => {
      try {
        const response = await axios.get('http://localhost:3333/api/inventoryitems/all');
        setInventoryItems(response.data);
      } catch (error) {
        alert(`Failed to fetch inventory items: ${error.message}`);
      }
    };

    fetchInventoryItems();
  }, []);

  const handleUpdate = async () => {
    try {
      const response = await axios.patch(
        `http://localhost:3333/api/inventoryitems/update-stock/${selectedItemId}`,
        {
          adjustment: multipliedResult, // ใช้ผลลัพธ์การคูณเป็น adjustment
        }
      );
      alert(`Stock updated: ${response.data.message}`);
      setCurrentStock(response.data.newStock); // อัพเดทยอด stock คงเหลือ
    } catch (error) {
      alert(`Failed to update stock: ${error.response?.data?.message || error.message}`);
    }
  };

  // เมื่อมีการเลือก item, อัพเดทยอด stock คงเหลือให้แสดง
  useEffect(() => {
    const selectedItem = inventoryItems.find((item) => item._id === selectedItemId);
    if (selectedItem) {
      setCurrentStock(selectedItem.stock);
    }
  }, [selectedItemId, inventoryItems]);

  // คำนวณผลลัพธ์การคูณและการแสดงผล
  const handleAdjustmentChange = (e) => {
    const newAdjustment = e.target.value;
    setAdjustment(newAdjustment);

    const result = newAdjustment * unitPerContainer;
    setMultipliedResult(result);
  };

  const handleUnitPerContainerChange = (e) => {
    const newUnitPerContainer = e.target.value;
    setUnitPerContainer(newUnitPerContainer);

    const result = adjustment * newUnitPerContainer;
    setMultipliedResult(result);
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" sx={{ mb: 4, textAlign: 'center' }}>
        Inventory Stock Update
      </Typography>

      <Card sx={{ mb: 2 }}>
        <CardContent>
          <FormControl fullWidth margin="normal">
            <InputLabel id="inventory-item-label">Inventory Item</InputLabel>
            <Select
              labelId="inventory-item-label"
              value={selectedItemId}
              label="Inventory Item"
              onChange={(e) => setSelectedItemId(e.target.value)}
            >
              {inventoryItems.map((item) => (
                <MenuItem key={item._id} value={item._id}>
                  {item.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            fullWidth
            type="number"
            label="Unit per Container"
            value={unitPerContainer}
            onChange={handleUnitPerContainerChange}
            margin="normal"
          />
          <TextField
            fullWidth
            type="number"
            label="Stock Adjustment (Containers)"
            value={adjustment}
            onChange={handleAdjustmentChange}
            margin="normal"
          />
          <Typography variant="h6" sx={{ mt: 2 }}>
            Multiplied Result (Units): {multipliedResult}
          </Typography>
          <Typography variant="h6" sx={{ mt: 2 }}>
            Current Stock: {currentStock}
          </Typography>
        </CardContent>
      </Card>
      <Grid container spacing={2} justifyContent="center" sx={{ mt: 2 }}>
        <Grid item>
          <Button variant="contained" color="primary" onClick={handleUpdate} size="large">
            Update Stock
          </Button>
        </Grid>
      </Grid>
    </Container>
  );
}
export default UpdateStock;
