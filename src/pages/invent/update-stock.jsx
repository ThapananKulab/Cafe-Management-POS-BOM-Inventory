import axios from 'axios';
import Swal from 'sweetalert2';
import { Icon } from '@iconify/react';
import styled from 'styled-components';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';

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
  const StyledDiv = styled.div`
    font-family: 'Prompt', sans-serif;
  `;

  const navigate = useNavigate();
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

  useEffect(() => {
    // This effect is used to update the details of the selected item
    const selectedItem = inventoryItems.find((item) => item._id === selectedItemId);
    if (selectedItem) {
      setCurrentStock(selectedItem.quantityInStock); // Assuming this is the current stock level from your inventory
      setUnit(selectedItem.unit); // Ensure this reflects the unit of measurement
      setAdjustment(selectedItem.realquantity); // Assuming this reflects some base quantity for calculations
    }
  }, [selectedItemId, inventoryItems]);

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
    Swal.fire({
      title: 'คุณแน่ใจไหม?',
      text: 'คุณต้องการอัปเดตสต็อกสินค้าหรือไม่?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'ใช่, อัปเดตเลย!',
      cancelButtonText: 'ไม่, ยกเลิก',
    }).then((result) => {
      if (result.isConfirmed) {
        (async () => {
          try {
            const response = await axios.patch(
              `http://localhost:3333/api/inventoryitems/update-stock/${selectedItemId}`,
              { adjustment: multipliedResult }
            );
            toast.success(`${response.data.message}`, {
              autoClose: 1500, // ตั้งค่าให้ Toast แสดงเป็นเวลา 1 วินาที
            });
            const newStock = response.data.message.match(/จำนวนคงเหลือ (\d+)/)[1];
            setCurrentStock(parseInt(newStock, 10));
          } catch (error) {
            toast.error(`อัปเดตไม่สำเร็จ`, {
              autoClose: 500, // ตั้งค่าให้ Toast แสดงเป็นเวลา 1 วินาที
            });
          }
        })();
      }
    });
  };

  // เมื่อมีการเลือก item, อัพเดทยอด stock คงเหลือให้แสดง
  useEffect(() => {
    const selectedItem = inventoryItems.find((item) => item._id === selectedItemId);
    if (selectedItem) {
      setCurrentStock(selectedItem.quantityInStock); // Assuming quantityInStock is the correct field
      setUnit(selectedItem.unit); // Update this line to match your data structure
    }
  }, [selectedItemId, inventoryItems]);

  useEffect(() => {
    const newResult = adjustment * unitPerContainer;
    setMultipliedResult(newResult);
    // Assuming you want to dynamically update the current stock based on this operation
    // Note: You might need to adjust logic based on how you calculate current stock from these values
  }, [adjustment, unitPerContainer]);

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
        <StyledDiv>Update วัตถุดิบ</StyledDiv>
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
            onChange={handleAdjustmentChange} // ใช้งาน handleAdjustmentChange ที่นี่
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
            <StyledDiv>
              จำนวนปริมาณที่เพิ่ม (หน่วย): {multipliedResult} {unit}
            </StyledDiv>
          </Typography>
          <Typography variant="h6" sx={{ mt: 2 }}>
            <StyledDiv>
              {' '}
              คงเหลือ: {currentStock} {unit}
            </StyledDiv>
          </Typography>
        </CardContent>
        <Grid container spacing={2} justifyContent="center" sx={{ mt: 1, mb: 2 }}>
          <Grid item>
            <Button
              variant="contained"
              onClick={handleUpdate}
              size="large"
              style={{ backgroundColor: 'black', color: 'white', padding: '10px 20px' }} // เพิ่ม padding เพื่อขยายขนาด
            >
              <Icon icon="ic:round-system-update-alt" width="32" height="32" />{' '}
              {/* ปรับขนาดไอคอน */}
            </Button>
          </Grid>
          <Grid item>
            <Button
              variant="contained"
              onClick={() => navigate('/invent')}
              size="large"
              style={{ backgroundColor: 'red', color: 'white', padding: '10px 20px' }}
            >
              <Icon icon="ic:twotone-cancel" width="32" height="32" />
            </Button>
            <ToastContainer />
          </Grid>
        </Grid>
      </Card>
    </Container>
  );
}
export default UpdateStock;
