import axios from 'axios';
import Swal from 'sweetalert2';
import { Icon } from '@iconify/react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';

import {
  Box,
  Grid,
  Badge,
  Paper,
  Table,
  Stack,
  Button,
  MenuItem,
  TableRow,
  Container,
  TableBody,
  TableCell,
  TableHead,
  TextField,
  IconButton,
  Typography,
  TableContainer,
} from '@mui/material';

import Iconify from 'src/components/iconify';

export default function InventPage() {
  const StyledDiv = styled.div`
    font-family: 'Prompt', sans-serif;
  `;

  const editRaw = (rawId) => {
    navigate(`/edit-invent/${rawId}`);
  };

  // const categories = [
  //   { value: 'เย็น', label: 'เย็น' },
  //   { value: 'ร้อน', label: 'ร้อน' },
  //   { value: 'ปั่น', label: 'ปั่น' },
  // ];

  const [raws, setRaws] = useState([]);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();
  const [setUser] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedUnit, setSelectedUnit] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('https://test-api-01.azurewebsites.net/api/authen', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const result = await response.json();
        if (result.status === 'ok') {
          setUser(result.decoded.user);
        } else {
          localStorage.removeItem('token');
          Swal.fire({
            icon: 'error',
            title: 'กรุณา Login ก่อน',
            text: result.message,
          });
          navigate('/');
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };
    fetchData();
  }, [navigate, setUser]);

  useEffect(() => {
    const fetchRaws = async () => {
      try {
        const response = await axios.get(
          'https://test-api-01.azurewebsites.net/api/inventoryitems/all'
        );
        setRaws(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchRaws();
  }, []);

  const confirmDelete = (rawId) => {
    Swal.fire({
      title: 'คุณต้องการลบหรือไม่ ?',
      icon: 'warning',
      showCancelButton: true,
      cancelButtonText: 'ยกเลิก',
      confirmButtonText: 'ใช่',
      reverseButtons: true,
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(
            `https://test-api-01.azurewebsites.net/api/inventoryitems/inventory/delete/${rawId}`
          );
          Swal.fire('ลบสำเร็จ!', 'สินค้าถูกลบเรียบร้อยแล้ว', 'success');
          setRaws(raws.filter((raw) => raw._id !== rawId));
        } catch (error) {
          console.error('ลบไม่ได้เนื่องจากมีข้อมูลวัตถุดิบอยู่กับสูตร', error);
          Swal.fire('ยังลบไม่ได้!', 'เนื่องจากมีข้อมูลวัตถุดิบอยู่กับสูตร', 'error');
        }
      }
    });
  };

  const filteredRaws = raws.filter(
    (raw) =>
      (selectedCategory === '' || raw.type === selectedCategory) &&
      (selectedUnit === '' || raw.unit === selectedUnit) &&
      (raw.name.toLowerCase().includes(search.toLowerCase()) ||
        raw.quantityInStock.toString().toLowerCase().includes(search.toLowerCase()) ||
        raw.unitPrice.toString().toLowerCase().includes(search.toLowerCase()))
  );

  const renderStatus = (quantity) => {
    if (quantity === 0) {
      return (
        <Badge
          badgeContent=" "
          color="error"
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
          overlap="circle"
        />
      );
    }

    if (quantity <= 5) {
      return (
        <Badge
          badgeContent=" "
          color="warning"
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
          overlap="circle"
        />
      );
    }

    return (
      <Badge
        badgeContent=" "
        color="success"
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        overlap="circle"
      />
    );
  };

  const renderStockStatus = (quantityInStock) => {
    if (quantityInStock === 0) {
      return (
        <Typography component="span" sx={{ color: 'red', fontWeight: 'bold' }}>
          0
        </Typography>
      );
    }
    if (quantityInStock < 10) {
      return (
        <Typography component="span" sx={{ color: '#ff9800', fontWeight: 'bold' }}>
          {quantityInStock}
        </Typography>
      );
    }
    return quantityInStock;
  };

  return (
    <div>
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4">
            <StyledDiv>วัตถุดิบ</StyledDiv>
          </Typography>
          <StyledDiv>
            <Button
              variant="contained"
              color="inherit"
              startIcon={<Iconify icon="eva:plus-fill" />}
              onClick={() => navigate('/manage/invent')}
            >
              <StyledDiv>เพิ่มวัตถุดิบใหม่</StyledDiv>
            </Button>
          </StyledDiv>
        </Stack>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            '& > :not(style)': { m: 1, width: '25ch' },
          }}
        >
          <TextField
            label="ค้นหาวัตถุดิบ เช่น น้ำตาล"
            variant="outlined"
            size="small" // ทำให้ TextField มีขนาดเล็กลง
            margin="normal"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            sx={{ maxWidth: '50%' }}
          />
          <TextField
            select
            label="เลือกประเภทวัตถุดิบ"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            variant="outlined"
            size="small"
            margin="normal"
            sx={{ maxWidth: '50%' }}
          >
            <MenuItem value="">ทั้งหมด</MenuItem>
            <MenuItem value="ถุง">ถุง</MenuItem>
            <MenuItem value="กระปุก">กระปุก</MenuItem>
            <MenuItem value="ทั่วไป">ทั่วไป</MenuItem>
            <MenuItem value="กระป๋อง">กระป๋อง</MenuItem>
            <MenuItem value="แก้ว">แก้ว</MenuItem>
            <MenuItem value="ขวด">ขวด</MenuItem>
          </TextField>

          <TextField
            select
            label="เลือกหน่วยนับ"
            value={selectedUnit}
            onChange={(e) => setSelectedUnit(e.target.value)}
            variant="outlined"
            size="small"
            margin="normal"
            sx={{ maxWidth: '50%' }}
          >
            <MenuItem value="">ทั้งหมด</MenuItem>
            <MenuItem value="ชิ้น">ชิ้น</MenuItem>
            <MenuItem value="กรัม">กรัม</MenuItem>
            <MenuItem value="ลิตร">ลิตร</MenuItem>
          </TextField>
        </Box>

        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>ลำดับ</TableCell>
                    {/* <TableCell align="center">ID</TableCell> */}
                    <TableCell>ชื่อวัตถุดิบ</TableCell>
                    <TableCell>ปริมาณ</TableCell>
                    <TableCell align="center">ปริมาณใน Stock (น้ำหนัก)</TableCell>
                    {/* <TableCell align="center">ปริมาณที่นับได้</TableCell> */}
                    <TableCell align="center">ปริมาณที่ใช้ไป</TableCell>
                    <TableCell align="center">ประเภท</TableCell>
                    <TableCell align="center">หน่วยนับ</TableCell>
                    <TableCell align="center">ราคาต่อหน่วย</TableCell>
                    <TableCell align="center">สถานะ</TableCell>
                    {/* {user && user.role === 'เจ้าของร้าน' && ( */}
                    <TableCell align="left">จัดการ</TableCell>
                    {/* )} */}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredRaws.length > 0 ? (
                    filteredRaws.map((raw, index) => (
                      <TableRow
                        key={raw._id}
                        sx={{
                          '&:nth-of-type(odd)': {
                            backgroundColor: 'rgba(0, 0, 0, 0.02)',
                          },
                          '&:nth-of-type(even)': {
                            backgroundColor: 'rgba(0, 0, 0, 0.04)',
                          },
                        }}
                      >
                        <TableCell>{index + 1}</TableCell>
                        {/* <TableCell>{raw._id}</TableCell> */}
                        <TableCell>{raw.name}</TableCell>

                        <TableCell align="center">{raw.realquantity}</TableCell>
                        <TableCell align="center">
                          {renderStockStatus(raw.quantityInStock)}
                        </TableCell>
                        {/* <TableCell align="center">
                          {raw.quantityInStock !== 0
                            ? (raw.realquantity / raw.quantityInStock).toFixed(0)
                            : 0}
                        </TableCell> */}

                        <TableCell align="center">{raw.useInStock}</TableCell>
                        <TableCell align="center">{raw.unit}</TableCell>
                        <TableCell align="center">{raw.type}</TableCell>
                        <TableCell align="center">{raw.unitPrice} ฿</TableCell>
                        <TableCell align="center">{renderStatus(raw.quantityInStock)}</TableCell>
                        <TableCell>
                          <Grid
                            container
                            alignItems="center"
                            justifyContent="flex-start"
                            spacing={1}
                          >
                            {/* {user && user.role === 'เจ้าของร้าน' && ( */}
                            <>
                              <Grid item>
                                <IconButton
                                  aria-label="edit"
                                  onClick={() => editRaw(raw._id)}
                                  color="primary"
                                >
                                  <Icon icon="mingcute:edit-line" style={{ fontSize: '24px' }} />
                                </IconButton>
                              </Grid>
                              <Grid item>
                                <IconButton
                                  aria-label="delete"
                                  onClick={() => confirmDelete(raw._id)}
                                  style={{ color: '#ff1744' }} // กำหนดสีโดยตรง
                                >
                                  <Icon icon="bi:trash-fill" style={{ fontSize: '24px' }} />
                                </IconButton>
                              </Grid>
                            </>
                            {/* )} */}
                          </Grid>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} align="center">
                        <Typography variant="subtitle1" gutterBottom>
                          <StyledDiv>ไม่พบวัตถุดิบ</StyledDiv>
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        </Grid>
      </Container>
    </div>
  );
}
