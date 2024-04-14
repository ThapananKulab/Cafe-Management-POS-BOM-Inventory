import axios from 'axios';
import Swal from 'sweetalert2';
import styled1 from 'styled-components';
import React, { useState, useEffect } from 'react';

import {
  Box,
  Chip,
  Stack,
  Table,
  Select,
  Button,
  TableRow,
  MenuItem,
  TableBody,
  TableCell,
  TextField,
  Container,
  TableHead,
  Typography,
  TableContainer,
} from '@mui/material';

const CreatePurchaseReceiptPage = () => {
  const StyledDiv = styled1.div`
    font-family: 'Prompt', sans-serif;
  `;
  const [inventoryItems, setInventoryItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [purchaseItems, setPurchaseItems] = useState([]);

  useEffect(() => {
    const fetchInventoryItems = async () => {
      try {
        const response = await axios.get(
          'https://test-api-01.azurewebsites.net/api/inventoryitems/all'
        );
        setInventoryItems(response.data);
      } catch (error) {
        console.error('Error fetching inventory items:', error);
      }
    };
    fetchInventoryItems();
  }, []);

  const handleAddItem = () => {
    // เพิ่มรายการสั่งซื้อโดยใช้ข้อมูลจาก Inventory
    const newItem = selectedItems.map((itemId) => {
      const selectedItem = inventoryItems.find((item) => item._id === itemId);
      return {
        item: selectedItem,
        quantity: 1, // ตั้งค่าจำนวนที่สั่งซื้อเป็น 1 ตามความต้องการ
        unitPrice: selectedItem.unitPrice, // ใช้ราคาต่อหน่วยจาก Inventory
        total: selectedItem.unitPrice, // ให้ totalPrice เริ่มต้นเป็นราคารวมของรายการเดียวกัน
      };
    });

    setPurchaseItems([...purchaseItems, ...newItem]);
    setSelectedItems([]);
  };

  const handleQuantityChange = (index, quantity) => {
    const newPurchaseItems = [...purchaseItems];
    newPurchaseItems[index].quantity = quantity;
    newPurchaseItems[index].total = quantity * newPurchaseItems[index].unitPrice; // คำนวณค่ารวมใหม่
    setPurchaseItems(newPurchaseItems);
  };

  const handleCreatePurchaseReceipt = async () => {
    try {
      // แสดง Confirm Dialog ด้วย SweetAlert
      const result = await Swal.fire({
        icon: 'question',
        title: 'ยืนยันการสร้างใบสั่งซื้อ',
        text: 'คุณต้องการสร้างใบสั่งซื้อหรือไม่?',
        showCancelButton: true,
        confirmButtonText: 'Yes',
        cancelButtonText: 'No',
      });

      // หากผู้ใช้กด Yes
      if (result.isConfirmed) {
        // ส่งข้อมูลไปยังเซิร์ฟเวอร์
        const response = await axios.post(
          'https://test-api-01.azurewebsites.net/api/purchaseitem/add',
          {
            items: purchaseItems,
          }
        );
        console.log('Purchase receipt created:', response.data);
        setPurchaseItems([]);
        // แสดง SweetAlert เมื่อสร้างใบสั่งซื้อสำเร็จ
        Swal.fire({
          icon: 'success',
          title: 'สร้างใบสั่งซื้อสำเร็จ',
          text: 'ใบสั่งซื้อถูกสร้างเรียบร้อยแล้ว',
        });
      }
    } catch (error) {
      console.error('Error creating purchase receipt:', error);
      // แสดง SweetAlert เมื่อเกิดข้อผิดพลาดในการสร้างใบสั่งซื้อ
      Swal.fire({
        icon: 'error',
        title: 'เกิดข้อผิดพลาด',
        text: 'ไม่สามารถสร้างใบสั่งซื้อได้ โปรดลองอีกครั้ง',
      });
    }
  };

  const handleRemoveItem = (index) => {
    const newPurchaseItems = [...purchaseItems];
    newPurchaseItems.splice(index, 1);
    setPurchaseItems(newPurchaseItems);
  };

  const getTotalPrice = () => purchaseItems.reduce((total, item) => total + item.total, 0);

  return (
    <Container>
      <Box sx={{ width: '100%', overflow: 'hidden' }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={4}>
          <Typography variant="h4" gutterBottom>
            <StyledDiv>สร้างใบสั่งซื้อ</StyledDiv>
          </Typography>
        </Stack>
        <Select
          multiple
          value={selectedItems}
          onChange={(e) => setSelectedItems(e.target.value)}
          fullWidth
          sx={{ marginBottom: 2, minWidth: 200 }} // เพิ่ม minWidth เพื่อกำหนดขนาดของ Select
          renderValue={(selected) => (
            <div style={{ display: 'flex', flexWrap: 'wrap' }}>
              {selected.map((value) => (
                <Chip
                  key={value}
                  label={inventoryItems.find((item) => item._id === value)?.name}
                  style={{ margin: 2 }}
                />
              ))}
            </div>
          )}
        >
          <MenuItem disabled value="">
            เพิ่มวัตถุดิบ
          </MenuItem>
          {inventoryItems.map((item) => (
            <MenuItem key={item._id} value={item._id}>
              {item.name}
            </MenuItem>
          ))}
        </Select>

        <Button variant="contained" onClick={handleAddItem} sx={{ marginBottom: 2 }}>
          <StyledDiv>เพิ่มวัตถุดิบ</StyledDiv>
        </Button>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>รหัสสินค้า</TableCell>
                <TableCell>ชื่อวัตถุดิบ</TableCell>
                <TableCell>จำนวน</TableCell>
                <TableCell>ราคาต่อหน่วย</TableCell>
                <TableCell>ยอดรวม</TableCell>
                <TableCell align="center">จัดการ</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {purchaseItems.map((item, index) => (
                <TableRow key={index}>
                  <TableCell>{item.item._id}</TableCell>
                  <TableCell>{item.item.name}</TableCell>
                  <TableCell>
                    <TextField
                      type="number"
                      value={item.quantity}
                      onChange={(e) => handleQuantityChange(index, e.target.value)}
                      fullWidth
                      label="Quantity"
                    />
                  </TableCell>
                  <TableCell>{item.unitPrice}</TableCell>
                  <TableCell>{item.total}</TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      onClick={() => handleRemoveItem(index)}
                      sx={{ bgcolor: '#ff1744', color: '#ffffff' }}
                    >
                      ลบ
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Container sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            variant="contained"
            onClick={handleCreatePurchaseReceipt}
            sx={{ bgcolor: '#4caf50', color: '#ffffff' }}
          >
            <StyledDiv>เพิ่มใบสั่งซื้อสินค้า (Total: {getTotalPrice()})</StyledDiv>
          </Button>
        </Container>
      </Box>
    </Container>
  );
};

export default CreatePurchaseReceiptPage;
