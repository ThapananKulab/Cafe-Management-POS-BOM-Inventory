import axios from 'axios';
import Swal from 'sweetalert2';
import { Icon } from '@iconify/react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';

import {
  Grid,
  Paper,
  Table,
  Stack,
  Button,
  TableRow,
  Container,
  TableBody,
  TableCell,
  TableHead,
  TextField,
  Typography,
  TableContainer,
} from '@mui/material';

import Iconify from 'src/components/iconify';

export default function InventPage() {
  const StyledDiv = styled.div`
    font-family: 'Prompt', sans-serif;
  `;
  const editRaw = (rawId) => {
    navigate(`/edit-raw/${rawId}`);
  };

  // const categories = [
  //   { value: 'เย็น', label: 'เย็น' },
  //   { value: 'ร้อน', label: 'ร้อน' },
  //   { value: 'ปั่น', label: 'ปั่น' },
  // ];

  const [raws, setRaws] = useState([]);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRaws = async () => {
      try {
        const response = await axios.get(
          'https://cafe-project-server11.onrender.com/api/inventoryitems/all'
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
            `https://cafe-project-server11.onrender.com/api/inventoryitems/delete/${rawId}`
          );
          Swal.fire('ลบสำเร็จ!', 'สินค้าถูกลบเรียบร้อยแล้ว', 'success');
          setRaws(raws.filter((raw) => raw._id !== rawId));
        } catch (error) {
          console.error('There was an error deleting the product:', error);
          Swal.fire('Error!', 'There was an error deleting your product.', 'error');
        }
      }
    });
  };

  const filteredRaws = raws.filter(
    (raw) =>
      raw.name.toLowerCase().includes(search.toLowerCase()) || // Adjusted to 'name'
      raw.quantityInStock.toString().toLowerCase().includes(search.toLowerCase()) || // Adjusted to 'quantityInStock'
      raw.unit.toLowerCase().includes(search.toLowerCase()) || // No change needed here
      raw.unitPrice.toString().toLowerCase().includes(search.toLowerCase()) // Adjusted to 'unitPrice'
  );
  return (
    <div>
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4">
            <StyledDiv>วัตถุดิบ</StyledDiv>
          </Typography>
          <StyledDiv>
            {/* <Button
              variant="outlined"
              color="inherit"
              startIcon={<Iconify icon="eva:plus-fill" />}
              onClick={() => navigate('/manage/invent/update-stock')}
            >
              <StyledDiv>นำเข้าวัตถุดิบ</StyledDiv>
            </Button>
            &nbsp; */}
            <Button
              variant="contained"
              color="inherit"
              startIcon={<Iconify icon="eva:plus-fill" />}
              onClick={() => navigate('/manage/invent')}
            >
              <StyledDiv>เพิ่มวัตถุดิบ </StyledDiv>
            </Button>
          </StyledDiv>
        </Stack>

        <TextField
          label="ค้นหาวัตถุดิบ เช่น น้ำตาล"
          variant="outlined"
          size="small" // ทำให้ TextField มีขนาดเล็กลง
          margin="normal"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{ maxWidth: '50%' }}
        />

        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>ลำดับ</TableCell>
                    {/* <TableCell align="center">ID</TableCell> */}
                    <TableCell>ชื่อวัตถุดิบ</TableCell>
                    <TableCell align="center">จำนวน</TableCell>
                    <TableCell align="center">หน่วยนับ</TableCell>
                    <TableCell align="center">ราคาต่อหน่วย</TableCell>
                    <TableCell align="left">จัดการ</TableCell>
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
                        <TableCell align="center">{raw.quantityInStock}</TableCell>
                        <TableCell align="center">{raw.unit}</TableCell>
                        <TableCell align="center">{raw.unitPrice}</TableCell>

                        <TableCell>
                          <a
                            href="#"
                            style={{ marginRight: '8px', display: 'inline-block' }}
                            onClick={(e) => {
                              e.preventDefault();
                            }}
                          >
                            {}
                          </a>
                          {}
                          <Icon
                            icon="mingcute:edit-line"
                            width="2em"
                            height="2em"
                            onClick={() => editRaw(raw._id)}
                          />
                          <a
                            href="#"
                            style={{ marginRight: '8px', display: 'inline-block' }}
                            onClick={(e) => {
                              e.preventDefault();
                            }}
                          >
                            {/* Use an appropriate icon component or element for editing */}
                          </a>
                          <Icon
                            icon="mingcute:delete-fill"
                            width="2em"
                            height="2em"
                            onClick={() => confirmDelete(raw._id)}
                          />
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
