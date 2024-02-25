import axios from 'axios';
import Swal from 'sweetalert2';
import { Icon } from '@iconify/react';
import styled from 'styled-components';
import React, { useState, useEffect } from 'react';

import {
  Box,
  Grid,
  Paper,
  Table,
  Stack,
  Modal,
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

export default function ProductPage() {
  const StyledDiv = styled.div`
    font-family: 'Prompt', sans-serif;
  `;
  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper', // สามารถเปลี่ยนเป็นสีที่ต้องการ เช่น 'white', '#f7f7f7'
    borderRadius: '16px', // ทำให้มุมโค้งมน
    border: 'none', // ถ้าต้องการลบขอบด้านนอกออก หรือปรับเป็น '1px solid #e0e0e0' เพื่อดูเรียบร้อย
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', // ปรับค่าเงาให้ดูนุ่มนวลขึ้น
    p: 4,
  };

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState(''); // สร้าง state สำหรับจัดการคำค้นหา

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('https://cafe-project-server11.onrender.com/api/products');
        setProducts(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchProducts();
  }, []);

  const confirmDelete = (productId) => {
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
            `https://cafe-project-server11.onrender.com/api/products/${productId}`
          ); // Ensure this URL matches your actual API endpoint
          Swal.fire('ลบสำเร็จ!', 'สินค้าถูกลบเรียบร้อยแล้ว', 'success');
          setProducts(products.filter((product) => product._id !== productId));
        } catch (error) {
          console.error('There was an error deleting the product:', error);
          Swal.fire('Error!', 'There was an error deleting your product.', 'error');
        }
      }
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log('Form submitted');
    handleClose();
  };

  const filteredProducts = products.filter(
    (product) =>
      product.productname.toLowerCase().includes(search.toLowerCase()) ||
      product.price.toString().toLowerCase().includes(search.toLowerCase()) ||
      product.type.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4">
            <StyledDiv>สินค้า</StyledDiv>
          </Typography>
          <StyledDiv>
            <Button
              variant="contained"
              color="inherit"
              startIcon={<Iconify icon="eva:plus-fill" />}
              onClick={handleOpen}
            >
              <StyledDiv>เพิ่มสินค้า </StyledDiv>
            </Button>
            <Modal
              open={open}
              onClose={handleClose}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
            >
              <Box
                sx={style}
                component="form"
                onSubmit={handleSubmit}
                noValidate
                autoComplete="off"
              >
                <Typography id="modal-modal-title" variant="h6" component="h2">
                  <StyledDiv>เพิ่มสินค้า</StyledDiv>
                </Typography>
                <TextField fullWidth margin="normal" label="ชื่อสินค้า" variant="outlined" />
                <TextField
                  fullWidth
                  margin="normal"
                  label="ราคา"
                  type="number"
                  variant="outlined"
                />
                <TextField
                  fullWidth
                  margin="normal"
                  label="ประเภท"
                  variant="outlined"
                  required // เพิ่ม required ที่นี่
                />
                <Button
                  variant="outlined" // แก้ไขจาก "contained" เป็น "outlined"
                  component="label"
                  sx={{ mt: 2, mr: 2 }} // เพิ่มระยะห่างด้านขวา (mr)
                >
                  <StyledDiv style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Icon icon="mdi:file-image" style={{ fontSize: 'inherit' }} />
                    อัปโหลด
                  </StyledDiv>
                  <input type="file" hidden /> {/* เพิ่ม required ที่นี่ */}
                </Button>
                {/* ใช้ Box เพื่อเว้นบรรทัด */}
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                  <Button type="submit" variant="contained" color="primary" sx={{ width: '50%' }}>
                    <StyledDiv>บันทึก</StyledDiv>
                  </Button>
                </Box>{' '}
                {/* ตรวจสอบให้แน่ใจว่ามีการปิดแท็ก <Box> ที่นี่ */}
              </Box>
            </Modal>
          </StyledDiv>
        </Stack>

        <TextField
          label="ค้นหาสินค้า เช่น ชาไทย"
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
                    <TableCell>ID</TableCell>
                    <TableCell>รูปภาพ</TableCell>
                    <TableCell>ชื่อสินค้า</TableCell>
                    <TableCell align="right">ราคา</TableCell>
                    <TableCell align="center">ประเภทสินค้า</TableCell>
                    <TableCell align="left">จัดการ</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredProducts.length > 0 ? (
                    filteredProducts.map((product, index) => (
                      <TableRow
                        key={product._id}
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
                        <TableCell>{product._id}</TableCell>
                        <TableCell>
                          {/* Placeholder for product image */}
                          <img
                            src={product.imageUrl || 'placeholder.jpg'}
                            alt={product.productname}
                            style={{ width: 50, height: 50 }}
                          />
                        </TableCell>
                        <TableCell>{product.productname}</TableCell>
                        <TableCell align="right">{product.price}</TableCell>
                        <TableCell align="center">{product.type}</TableCell>
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
                            onClick={() => confirmDelete(product._id)}
                          />
                          <a
                            href="#"
                            style={{ marginRight: '8px', display: 'inline-block' }}
                            onClick={(e) => {
                              e.preventDefault();
                              // Implement edit functionality or redirect here
                            }}
                          >
                            {/* Use an appropriate icon component or element for editing */}
                          </a>
                          {/* Use the product._id from the map function */}
                          <Icon
                            icon="mingcute:delete-fill"
                            width="2em"
                            height="2em"
                            onClick={() => confirmDelete(product._id)}
                          />
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} align="center">
                        <Typography variant="subtitle1" gutterBottom>
                          <StyledDiv>ไม่พบสินค้า</StyledDiv>
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
