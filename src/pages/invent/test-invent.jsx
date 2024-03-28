import axios from 'axios';
import { Icon } from '@iconify/react';
import styled1 from 'styled-components';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';

// import { styled } from '@mui/styles';
import {
  Box,
  Grid,
  Card,
  List,
  Button,
  Select,
  ListItem,
  MenuItem,
  Container,
  TextField,
  InputLabel,
  Typography,
  FormControl,
  CardContent,
  ListItemText,
  ListItemIcon,
} from '@mui/material';

function InventoryManager() {
  const StyledDiv = styled1.div`
  font-family: 'Prompt', sans-serif;
`;
  const navigate = useNavigate();

  // const MyButton = styled(Button)({
  //   background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
  //   border: 0,
  //   borderRadius: 3,
  //   boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
  //   color: 'white',
  //   height: 48,
  //   padding: '0 30px',
  // });

  const goBack = () => navigate(-1);
  const [inventoryItems, setInventoryItems] = useState([]);
  const [newItem, setNewItem] = useState({
    name: '',
    unit: '',
    realquantity: '',
    quantityInStock: '',
    unitPrice: '',
    piecesPerUnit: '', // จำนวนชิ้นต่อหน่วย
    numberOfUnits: '', // จำนวนหน่วย
  });

  const handleCancel = () => {
    navigate('/invent'); // แทนที่ '/path-to-navigate' ด้วยเส้นทางที่คุณต้องการไป
  };

  useEffect(() => {
    fetchInventoryItems();
  }, []);

  const fetchInventoryItems = async () => {
    try {
      const response = await axios.get('http://localhost:3333/api/inventoryitems/all');
      setInventoryItems(response.data);
    } catch (error) {
      console.error('Error fetching inventory items:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    console.log(`Name: ${name}, Value: ${value}`);

    if (name === 'realquantity') {
      const realQuantityValue = parseInt(value, 10) || 0;
      let totalQuantity = realQuantityValue;

      if (
        ['ถุง', 'ซอง'].includes(newItem.unit) &&
        newItem.numberOfUnits > 0 &&
        newItem.piecesPerUnit > 0
      ) {
        totalQuantity = newItem.numberOfUnits * newItem.piecesPerUnit;
      }

      setNewItem((prev) => ({
        ...prev,
        realquantity: value,
        quantityInStock: totalQuantity.toString(),
      }));
    } else {
      setNewItem((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const itemExists = inventoryItems.some(
      (item) => item.name.toLowerCase() === newItem.name.toLowerCase()
    );

    if (itemExists) {
      toast.error(`มี "${newItem.name}" อยู่แล้ว`);
      return; // Stop the function from proceeding further
    }
    let totalQuantity = parseInt(newItem.quantityInStock, 10); // แปลงเป็นตัวเลขฐานสิบ

    // ตรวจสอบถ้า 'numberOfUnits' หรือ 'piecesPerUnit' เป็น 0 หรือเป็นค่าที่ไม่ถูกต้อง
    if (
      ['ถุง', 'ซอง'].includes(newItem.unit) &&
      newItem.numberOfUnits > 0 &&
      newItem.piecesPerUnit > 0
    ) {
      totalQuantity = newItem.numberOfUnits * newItem.piecesPerUnit;
    } else if (['ถุง', 'ซอง'].includes(newItem.unit)) {
      toast.error('กรุณาตรวจสอบจำนวนหน่วยและชิ้นต่อหน่วย');
      return; // หยุดการทำงานถัดไปหากมีค่าไม่ถูกต้อง
    }

    const itemToAdd = {
      ...newItem,
      quantityInStock: totalQuantity,
    };

    try {
      await axios.post('http://localhost:3333/api/inventoryitems/add', itemToAdd);
      toast.success(`เพิ่ม "${newItem.name}" สำเร็จ`);
      fetchInventoryItems(); // Reload data
      // Reset form fields
      setNewItem({
        name: '',
        unit: '',
        realquantity: '',
        quantityInStock: '',
        unitPrice: '',
        piecesPerUnit: '',
        numberOfUnits: '',
      });
    } catch (error) {
      console.error('Error adding inventory item:', error);
      toast.error('ยังกรอกข้อมูลไม่ครบ');
    }
  };

  return (
    <Container maxWidth="md">
      <Typography variant="h3" gutterBottom component="div" sx={{ mt: 4, mb: 2 }}>
        <Button variant="outline" onClick={goBack} sx={{ mb: 2 }}>
          <Icon icon="ep:back" style={{ fontSize: '24px' }} />
        </Button>
        <StyledDiv>เพิ่มวัตถุดิบ</StyledDiv>
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Typography variant="h6" gutterBottom>
            <StyledDiv>รายการวัตถุดิบ</StyledDiv>
          </Typography>
          <StyledDiv>
            <List>
              {inventoryItems.map((item) => (
                <ListItem key={item._id}>
                  <ListItemIcon>
                    <Icon icon="material-symbols:inventory" />
                  </ListItemIcon>
                  <ListItemText
                    primary={item.name}
                    secondary={`Unit: ${item.unit}, Quantity: ${item.quantityInStock}, Price: บาท ${item.unitPrice} บาท`}
                  />
                </ListItem>
              ))}
            </List>
          </StyledDiv>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                <StyledDiv>เพิ่มรายการวัตถุดิบ</StyledDiv>
              </Typography>
              <Box component="form" noValidate autoComplete="off" onSubmit={handleSubmit}>
                <TextField
                  label="ชื่อวัตถุดิบ"
                  name="name"
                  value={newItem.name}
                  onChange={handleChange}
                  fullWidth
                  margin="normal"
                />
                <TextField
                  label="ปริมาณตามฉลาก เช่น 325 กรัม"
                  name="realquantity"
                  value={newItem.realquantity}
                  onChange={handleChange}
                  fullWidth
                  margin="normal"
                />
                <FormControl fullWidth margin="normal">
                  <InputLabel id="unit-label">หน่วยนับ</InputLabel>
                  <Select
                    labelId="unit-label"
                    id="unit"
                    name="unit"
                    value={newItem.unit}
                    label="หน่วยนับ"
                    onChange={handleChange}
                  >
                    <MenuItem value="มิลลิลิตร">มิลลิลิตร</MenuItem>
                    <MenuItem value="กรัม">กรัม</MenuItem>
                    <MenuItem value="ชิ้น">ชิ้น</MenuItem>
                    <MenuItem value="ซอง">ซอง</MenuItem>
                    <MenuItem value="ถุง">ถุง</MenuItem>
                  </Select>
                </FormControl>

                {['กรัม', 'ชิ้น', 'มิลลิลิตร'].includes(newItem.unit) && (
                  <TextField
                    type="number"
                    label="ปริมาณตามฉลาก"
                    name="quantityInStock"
                    value={newItem.quantityInStock}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                    disabled
                  />
                )}

                {['ถุง', 'ซอง'].includes(newItem.unit) && (
                  <>
                    <TextField
                      type="number"
                      label="จำนวนชิ้นต่อหน่วย (เช่น ในถุงมีกี่ชิ้น)"
                      name="piecesPerUnit"
                      value={newItem.piecesPerUnit}
                      onChange={handleChange}
                      fullWidth
                      margin="normal"
                    />

                    <TextField
                      type="number"
                      label="จำนวนหน่วย (เช่น กี่ถุง)"
                      name="numberOfUnits"
                      value={newItem.numberOfUnits}
                      onChange={handleChange}
                      fullWidth
                      margin="normal"
                    />
                  </>
                )}

                <TextField
                  type="number"
                  label="ราคาต่อหน่วย"
                  name="unitPrice"
                  value={newItem.unitPrice}
                  onChange={handleChange}
                  fullWidth
                  margin="normal"
                />
                {/* <MyButton type="submit" sx={{ mt: 3 }}>
                  <StyledDiv>เพิ่มวัตถุดิบ</StyledDiv>
                </MyButton> */}
                <Button variant="contained" type="submit" sx={{ mt: 3 }}>
                  <StyledDiv>เพิ่มวัตถุดิบ</StyledDiv>
                </Button>
                <Button
                  variant="contained"
                  type="submit"
                  sx={{ mt: 3, ml: 1, bgcolor: 'error.main', color: 'error.contrastText' }}
                  onClick={handleCancel}
                >
                  <StyledDiv>ยกเลิก</StyledDiv>
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      <ToastContainer />
    </Container>
  );
}

export default InventoryManager;
