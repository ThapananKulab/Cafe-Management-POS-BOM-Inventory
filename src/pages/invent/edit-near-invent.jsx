import axios from 'axios';
import { Icon } from '@iconify/react';
import styled1 from 'styled-components';
import React, { useState, useEffect } from 'react';

import {
  Table,
  Stack,
  TableRow,
  TableCell,
  TableHead,
  TableBody,
  TextField,
  Container,
  Typography,
  IconButton,
  TableContainer,
} from '@mui/material';

const InventoryList = () => {
  const [items, setItems] = useState([]);
  const [isLowerMap, setIsLowerMap] = useState({});
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [selectedItemIsLower, setSelectedItemIsLower] = useState('');
  const [setOriginalItemIsLower] = useState('');

  const StyledDiv = styled1.div`
  font-family: 'Prompt', sans-serif;
`;

  useEffect(() => {
    fetchItems();
  }, [isLowerMap]);

  const fetchItems = async () => {
    try {
      const response = await axios.get(
        'https://cafe-management-pos-bom-inventory-api.vercel.app/api/inventoryitems/all'
      );
      setItems(response.data);
      setIsLowerMap(
        response.data.reduce((acc, item) => {
          acc[item._id] = item.islower;
          return acc;
        }, {})
      );
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleUpdate = async () => {
    try {
      await axios.put(
        `https://test-api-01.azurewebsites.net/api/inventoryitems/islower/${selectedItemId}`,
        {
          islower: selectedItemIsLower,
        }
      );
      alert('Data updated successfully!');
      fetchItems();
      setSelectedItemId(null); // รีเซ็ตการเลือกแถวที่ถูกเลือก
    } catch (error) {
      console.error('Error updating data:', error);
    }
  };

  const handleCancel = () => {
    setSelectedItemId(null);
    setSelectedItemIsLower('');
  };

  const handleEdit = (itemId, islower) => {
    setSelectedItemId(itemId);
    setSelectedItemIsLower(islower.toString());
    setOriginalItemIsLower(islower.toString());
  };

  const handleChangeIsLower = (value) => {
    setSelectedItemIsLower(value);
  };

  const GreenText = styled1.span`
    color: green;
  `;

  return (
    <Container>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <Typography variant="h4" gutterBottom>
          <StyledDiv>ปริมาณที่ต้องการให้แจ้งเตือน</StyledDiv>
        </Typography>
      </Stack>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ชื่อวัตถุดิบ</TableCell>
              <TableCell>ปริมาณจริง</TableCell>
              <TableCell>ปริมาณใน Stock</TableCell>
              <TableCell>หน่วย</TableCell>
              <TableCell>ปริมาณที่ต้องการให้แจ้งเตือน</TableCell>
              <TableCell>จัดการ</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map((item) => (
              <TableRow key={item._id}>
                <TableCell>{item.name}</TableCell>
                <TableCell>{item.realquantity}</TableCell>
                <TableCell>{item.quantityInStock}</TableCell>
                <TableCell>{item.unit}</TableCell>
                <TableCell align="center">
                  {selectedItemId === item._id ? (
                    <TextField
                      fullWidth
                      type="number"
                      label="ปริมาณ"
                      value={selectedItemIsLower}
                      onChange={(e) => handleChangeIsLower(e.target.value)}
                    />
                  ) : (
                    <GreenText>{item.islower}</GreenText>
                  )}
                </TableCell>
                <TableCell>
                  {selectedItemId === item._id ? (
                    <>
                      <IconButton onClick={() => handleUpdate()} color="primary">
                        <Icon icon="heroicons-outline:save" style={{ fontSize: '32px' }} />
                      </IconButton>
                      <IconButton onClick={() => handleCancel()} style={{ color: '#ff1744' }}>
                        <Icon icon="mdi:cancel-bold" style={{ fontSize: '32px' }} />
                      </IconButton>
                    </>
                  ) : (
                    <IconButton onClick={() => handleEdit(item._id, item.islower)} color="primary">
                      <Icon icon="mingcute:edit-line" style={{ fontSize: '32px' }} />
                    </IconButton>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default InventoryList;
