import axios from 'axios';
import Swal from 'sweetalert2';
import { Icon } from '@iconify/react';
import styled from 'styled-components';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';

import {
  Box,
  Card,
  Grid,
  Stack,
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
        const response = await axios.get(
          'https://test-api-01.azurewebsites.net/api/inventoryitems/all'
        );
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
              `http://localhost:3333/api/inventoryitems/adjust-stock/${selectedItemId}`,
              { adjustment: multipliedResult }
            );
            toast.success(`${response.data.message}`, {
              autoClose: 1500,
            });
            const newStock = response.data.message.match(/จำนวนคงเหลือ (\d+)/)[1];
            setCurrentStock(parseInt(newStock, 10));
          } catch (error) {
            toast.error(`อัปเดตไม่สำเร็จ`, {
              autoClose: 500,
            });
          }
        })();
      }
    });
  };

  useEffect(() => {
    const selectedItem = inventoryItems.find((item) => item._id === selectedItemId);
    if (selectedItem) {
      setCurrentStock(selectedItem.quantityInStock);
      setUnit(selectedItem.unit);
    }
  }, [selectedItemId, inventoryItems]);

  useEffect(() => {
    const newResult = adjustment * unitPerContainer;
    setMultipliedResult(newResult);
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
      <Box sx={{ width: '100%', overflow: 'hidden' }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={4}>
          <Typography variant="h4" sx={{ mt: 2, mb: 3, textAlign: 'center' }}>
            <StyledDiv>ปรับปรุงวัตถุดิบ</StyledDiv>
          </Typography>
          <StyledDiv>
            <Button
              variant="contained"
              color="error"
              startIcon={<Icon icon="ic:baseline-history" />}
              onClick={() => navigate('/manage/invent/history-adjust-stock')}
            >
              <StyledDiv>ประวัติการปรับปรุงวัตถุดิบ</StyledDiv>
            </Button>
          </StyledDiv>
        </Stack>

        <Card sx={{ mb: 2 }}>
          <CardContent>
            <FormControl fullWidth margin="normal">
              <InputLabel id="inventory-item-label">ชื่อวัตถุดิบ</InputLabel>
              <Select
                labelId="inventory-item-label"
                value={selectedItemId}
                label="Inventory Item"
                onChange={(e) => setSelectedItemId(e.target.value)}
                inputProps={{ style: { textAlign: 'center' } }}
              >
                {inventoryItems.map((item) => (
                  <MenuItem
                    key={item._id}
                    value={item._id}
                    inputProps={{ style: { textAlign: 'center' } }}
                  >
                    {item.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              fullWidth
              type="number"
              label="ปริมาณที่ต้องการลด"
              value={adjustment}
              onChange={handleAdjustmentChange}
              margin="normal"
              inputProps={{ style: { textAlign: 'center' } }}
            />

            <TextField
              fullWidth
              type="number"
              label="จำนวณ"
              value={unitPerContainer}
              onChange={(e) => setUnitPerContainer(Number(e.target.value))}
              margin="normal"
              inputProps={{ style: { textAlign: 'center' } }}
              disabled
              style={{ display: 'none' }} // CSS inline style
            />

            <Grid
              container
              spacing={1}
              sx={{ mb: 2, mt: 1 }}
              style={{ display: 'none' }} // CSS inline style
            >
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
                จำนวนปริมาณที่ต้องการลด (หน่วย): {multipliedResult} {unit}
              </StyledDiv>
            </Typography>
            <Typography variant="h6" sx={{ mt: 2 }}>
              <StyledDiv>
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
      </Box>
    </Container>
  );
}
export default UpdateStock;
