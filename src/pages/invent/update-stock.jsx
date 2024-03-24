import axios from 'axios';
import { Icon } from '@iconify/react';
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
  const [unit, setUnit] = useState(); // Add this state variable to hold the unit
  const [adjustment, setAdjustment] = useState('');
  const [currentStock, setCurrentStock] = useState(0); // สำหรับแสดงยอด stock คงเหลือ
  const [unitPerContainer, setUnitPerContainer] = useState(1);
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

  const incrementUnitPerContainer = () => {
    setUnitPerContainer((prevValue) => prevValue + 1);
    const newResult = adjustment * (unitPerContainer + 1);
    setMultipliedResult(newResult);
  };

  const decrementUnitPerContainer = () => {
    if (unitPerContainer > 0) {
      setUnitPerContainer((prevValue) => prevValue - 1);
      const newResult = adjustment * (unitPerContainer - 1);
      setMultipliedResult(newResult);
    }
  };

  const handleUpdate = async () => {
    try {
      const response = await axios.patch(
        `http://localhost:3333/api/inventoryitems/update-stock/${selectedItemId}`,
        { adjustment: multipliedResult }
      );
      alert(`Stock updated: ${response.data.message}`);
      const newStock = response.data.message.match(/New stock is (\d+)/)[1];
      setCurrentStock(parseInt(newStock, 10));
    } catch (error) {
      alert(`Failed to update stock: ${error.response?.data?.message || error.message}`);
    }
  };

  // เมื่อมีการเลือก item, อัพเดทยอด stock คงเหลือให้แสดง
  useEffect(() => {
    const selectedItem = inventoryItems.find((item) => item._id === selectedItemId);
    if (selectedItem) {
      setCurrentStock(selectedItem.quantityInStock); // Assuming quantityInStock is the correct field
      setUnit(selectedItem.unit); // Update this line to match your data structure
    }
  }, [selectedItemId, inventoryItems]);

  // คำนวณผลลัพธ์การคูณและการแสดงผล
  const handleAdjustmentChange = (e) => {
    const newAdjustment = e.target.value;
    setAdjustment(newAdjustment);

    const result = newAdjustment * unitPerContainer;
    setMultipliedResult(result);
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" sx={{ mt: 2, mb: 3, textAlign: 'center' }}>
        Update วัตถุดิบ
      </Typography>
      <Card sx={{ mb: 2 }}>
        <CardContent>
          <FormControl fullWidth margin="normal">
            <InputLabel id="inventory-item-label">ชื่อวัตถุดิบ</InputLabel>
            <Select
              labelId="inventory-item-label"
              value={selectedItemId}
              label="Inventory Item"
              onChange={(e) => setSelectedItemId(e.target.value)}
              inputProps={{ style: { textAlign: 'center' } }} // This centers the text
            >
              {inventoryItems.map((item) => (
                <MenuItem
                  key={item._id}
                  value={item._id}
                  inputProps={{ style: { textAlign: 'center' } }} // This centers the text
                >
                  {item.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            fullWidth
            type="number"
            label="ปริมาณตามฉลาก"
            value={adjustment}
            onChange={handleAdjustmentChange}
            margin="normal"
            inputProps={{ style: { textAlign: 'center' } }} // This centers the text
          />

          <TextField
            fullWidth
            type="number"
            label="จำนวณ"
            value={unitPerContainer}
            onChange={(e) => setUnitPerContainer(Number(e.target.value))}
            margin="normal"
            inputProps={{ style: { textAlign: 'center' } }} // This centers the text
            disabled
          />

          <Grid container spacing={1} sx={{ mb: 2, mt: 1 }}>
            <Grid item xs={6}>
              <Button fullWidth variant="outlined" onClick={decrementUnitPerContainer}>
                -
              </Button>
            </Grid>
            <Grid item xs={6}>
              <Button fullWidth variant="outlined" onClick={incrementUnitPerContainer}>
                +
              </Button>
            </Grid>
          </Grid>
          <Typography variant="h6" sx={{ mt: 2 }}>
            จำนวนปริมาณที่เพิ่ม (หน่วย): {multipliedResult} {unit}
          </Typography>
          <Typography variant="h6" sx={{ mt: 2 }}>
            คงเหลือ: {currentStock} {unit}
          </Typography>
        </CardContent>
        <Grid container spacing={2} justifyContent="center" sx={({ mt: 5 }, { mb: 2 })}>
          <Button
            variant="contained"
            onClick={handleUpdate}
            size="large"
            style={{ backgroundColor: 'black', color: 'white' }}
          >
            <Icon icon="ic:round-system-update-alt" />
          </Button>
        </Grid>
      </Card>
    </Container>
  );
}
export default UpdateStock;
