import axios from 'axios';
import { Icon } from '@iconify/react';
import 'react-toastify/dist/ReactToastify.css';
import React, { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import { useParams, useNavigate } from 'react-router-dom';

import {
  Box,
  Grid,
  Paper,
  Button,
  Select,
  MenuItem,
  Container,
  TextField,
  IconButton,
  InputLabel,
  Typography,
  FormControl,
} from '@mui/material';

import './style.css';

const RawForm = () => {
  const [name, setName] = useState('');
  const [realquantity, setRealquantity] = useState('');
  const [quantityInStock, setQuantityInStock] = useState('');
  const [unit, setUnit] = useState('');
  const [unitPrice, setUnitPrice] = useState('');
  const [initialName, setInitialName] = useState('');
  const [editableStock, setEditableStock] = useState(false);
  const [previousQuantityInStock, setPreviousQuantityInStock] = useState('');

  const navigate = useNavigate();
  const { rawId } = useParams();

  const handleZeroButtonClick = () => {
    if (quantityInStock !== '0') {
      setPreviousQuantityInStock(quantityInStock); // บันทึกค่าปัจจุบันก่อนเปลี่ยน
      setQuantityInStock('0');
    } else {
      setQuantityInStock(previousQuantityInStock || ''); // กลับไปใช้ค่าเดิม หรือเป็นสตริงว่างถ้าไม่มีค่าเดิม
    }
  };

  useEffect(() => {
    if (rawId) {
      axios
        .get(`http://localhost:3333/api/inventoryitems/${rawId}`)
        .then((response) => {
          setName(response.data.name);
          setInitialName(response.data.name); // ตั้งค่าชื่อเริ่มต้น
          setRealquantity(response.data.realquantity);
          setQuantityInStock(response.data.quantityInStock.toString());
          setUnit(response.data.unit);
          setUnitPrice(response.data.unitPrice.toString());
        })
        .catch((error) => console.error('Error fetching inventory item:', error));
    }
  }, [rawId]);

  const units = [
    { value: 'กรัม', label: 'กรัม' },
    { value: 'มิลลิลิตร', label: 'มิลลิลิตร' },
    { value: 'ชิ้น', label: 'ชิ้น' },
    { value: 'ซอง', label: 'ซอง' },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // เฉพาะเมื่อเป็นการเพิ่มรายการใหม่หรือมีการเปลี่ยนชื่อวัตถุดิบ เราจึงตรวจสอบชื่อที่ซ้ำ
      if (!rawId || (rawId && name !== initialName)) {
        const response = await axios.get(
          `http://localhost:3333/api/inventoryitems/check-name-exists`,
          {
            params: {
              name,
              excludeId: rawId,
            },
          }
        );

        if (response.data.exists) {
          toast.error('ชื่อนี้มีอยู่แล้วในฐานข้อมูล และไม่สามารถใช้ชื่อนี้ได้');
          return;
        }
      }

      // อัปเดตรายการในฐานข้อมูล
      const inventoryData = {
        name,
        unit,
        realquantity: Number(realquantity),
        quantityInStock: Number(quantityInStock),
        unitPrice: Number(unitPrice),
      };

      await axios.patch(`http://localhost:3333/api/inventoryitems/update/${rawId}`, inventoryData, {
        headers: { 'Content-Type': 'application/json' },
      });
      toast.success('แก้ไขวัตถุดิบสำเร็จ', {
        autoClose: 1000,
      });
    } catch (error) {
      console.error('Error updating inventory item:', error);
      toast.error('มีชื่อวัตถุดิบนี้อยู่แล้ว');
    }
  };

  return (
    <Container maxWidth="md">
      <Paper elevation={3} sx={{ p: 4, margin: 'auto', maxWidth: 500, flexGrow: 1 }}>
        <Typography variant="h4" gutterBottom component="div" sx={{ mb: 4 }}>
          แก้ไขวัตถุดิบ
        </Typography>
        <ToastContainer />
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                label="ชื่อวัตถุดิบ"
                variant="outlined"
                fullWidth
                required
                sx={{ mb: 2 }}
              />
              <TextField
                type="number"
                value={realquantity}
                onChange={(e) => setRealquantity(e.target.value)}
                label="ปริมาณ"
                variant="outlined"
                fullWidth
                required
                sx={{ mb: 2 }}
              />
              <Box display="flex" alignItems="center" gap={2} sx={{ mb: 2 }}>
                <TextField
                  type="number"
                  value={quantityInStock}
                  onChange={(e) => {
                    if (!editableStock) {
                      setPreviousQuantityInStock(e.target.value); // อัปเดตค่าก่อนหน้าทุกครั้งที่มีการเปลี่ยนแปลง
                    }
                    setQuantityInStock(e.target.value);
                  }}
                  label="ปริมาณใน Stock"
                  variant="outlined"
                  fullWidth
                  required
                  disabled={!editableStock}
                />
                <IconButton color="primary" onClick={() => setEditableStock(!editableStock)}>
                  {editableStock ? (
                    <Icon icon="icon-park-outline:change-date-sort" />
                  ) : (
                    <Icon icon="icon-park-solid:change-date-sort" />
                  )}
                </IconButton>
                {/* ปุ่มใหม่สำหรับตั้งค่า quantityInStock เป็นศูนย์ */}
                {editableStock && (
                  <IconButton color="secondary" onClick={handleZeroButtonClick}>
                    <Icon
                      icon={
                        quantityInStock !== '0' ? 'mdi:numeric-0-box-outline' : 'mdi:backup-restore'
                      }
                    />
                  </IconButton>
                )}
              </Box>
              <FormControl fullWidth variant="outlined" required sx={{ mb: 2 }}>
                <InputLabel>หน่วยนับ</InputLabel>
                <Select value={unit} onChange={(e) => setUnit(e.target.value)} label="Unit">
                  {units.map((unitOption) => (
                    <MenuItem key={unitOption.value} value={unitOption.value}>
                      {unitOption.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <TextField
                type="number"
                value={unitPrice}
                onChange={(e) => setUnitPrice(e.target.value)}
                label="ราคาต่อหน่วย"
                variant="outlined"
                fullWidth
                required
                sx={{ mb: 2 }}
              />
            </Grid>
          </Grid>
          <Box display="flex" justifyContent="flex-end" gap={2} sx={{ mt: 3 }}>
            <Button
              onClick={() => navigate('/invent')}
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
      </Paper>
    </Container>
  );
};

export default RawForm;
