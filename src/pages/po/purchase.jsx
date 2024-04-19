import axios from 'axios';
import Swal from 'sweetalert2';
import { Icon } from '@iconify/react';
import styled1 from 'styled-components';
import { useNavigate } from 'react-router-dom';
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
  const [suppliers, setSuppliers] = useState([]);
  const [selectedSupplier, setSelectedSupplier] = useState('');

  const navigate = useNavigate();
  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        const response = await axios.get(
          'https://test-api-01.azurewebsites.net/api/supplier/suppliers'
        );
        setSuppliers(response.data);
      } catch (error) {
        console.error('Error fetching suppliers:', error);
      }
    };
    fetchSuppliers();
  }, []);

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
    const newItem = selectedItems.map((itemId) => {
      const selectedItem = inventoryItems.find((item) => item._id === itemId);
      return {
        item: selectedItem,
        quantity: 1,
        unitPrice: selectedItem.unitPrice,
        realquantity: selectedItem.realquantity,
        total: selectedItem.unitPrice,
      };
    });

    setPurchaseItems([...purchaseItems, ...newItem]);
    setSelectedItems([]);
  };

  const handleQuantityChange = (index, quantity) => {
    if (quantity <= 0) {
      return;
    }
    const newPurchaseItems = [...purchaseItems];
    newPurchaseItems[index].quantity = quantity;
    newPurchaseItems[index].total = quantity * newPurchaseItems[index].unitPrice;
    setPurchaseItems(newPurchaseItems);
  };

  const handleCreatePurchaseReceipt = async () => {
    try {
      const result = await Swal.fire({
        icon: 'question',
        title: 'ยืนยันการสร้างใบสั่งซื้อ',
        text: 'คุณต้องการสร้างใบสั่งซื้อหรือไม่?',
        showCancelButton: true,
        confirmButtonText: 'Yes',
        cancelButtonText: 'No',
      });
      if (result.isConfirmed) {
        const response = await axios.post(
          'https://test-api-01.azurewebsites.net/api/purchaseitem/add',
          {
            items: purchaseItems,
            supplier: selectedSupplier,
          }
        );

        console.log('Purchase receipt created:', response.data);
        setPurchaseItems([]);
        Swal.fire({
          icon: 'success',
          title: 'สร้างใบสั่งซื้อสำเร็จ',
          text: 'ใบสั่งซื้อถูกสร้างเรียบร้อยแล้ว',
        });
      }
    } catch (error) {
      console.error('Error creating purchase receipt:', error);
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
          <StyledDiv>
            <Button
              variant="contained"
              color="inherit"
              startIcon={<Icon icon="ic:baseline-history" />}
              onClick={() => navigate('/purchase/report')}
            >
              <StyledDiv>ประวัติ PO</StyledDiv>
            </Button>
          </StyledDiv>
        </Stack>
        <Select
          value={selectedSupplier}
          onChange={(e) => setSelectedSupplier(e.target.value)}
          fullWidth
          sx={{ marginBottom: 2, minWidth: 200 }}
        >
          <MenuItem disabled value="">
            เลือก Supplier
          </MenuItem>
          {suppliers.map((supplier) => (
            <MenuItem key={supplier._id} value={supplier._id}>
              {supplier.name}
            </MenuItem>
          ))}
        </Select>

        <Select
          multiple
          value={selectedItems}
          onChange={(e) => setSelectedItems(e.target.value)}
          fullWidth
          sx={{ marginBottom: 2, minWidth: 200 }}
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
                <TableCell>ปริมาณ</TableCell>
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
                    <TableCell>
                      <TextField
                        type="number"
                        value={item.quantity}
                        onChange={(e) => handleQuantityChange(index, parseInt(e.target.value, 10))}
                        fullWidth
                        label="จำนวน"
                        disabled
                        InputProps={{ inputProps: { style: { textAlign: 'center' } } }}
                      />
                    </TableCell>
                  </TableCell>{' '}
                  <TableCell>{item.realquantity}</TableCell>
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
