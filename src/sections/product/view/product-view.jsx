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

export default function ProductPage() {
  const StyledDiv = styled.div`
    font-family: 'Prompt', sans-serif;
  `;


  // const categories = [
  //   { value: 'เย็น', label: 'เย็น' },
  //   { value: 'ร้อน', label: 'ร้อน' },
  //   { value: 'ปั่น', label: 'ปั่น' },
  // ];

  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();


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
          );
          Swal.fire('ลบสำเร็จ!', 'สินค้าถูกลบเรียบร้อยแล้ว', 'success');
          setProducts(products.filter((product) => product._id !== productId));
        } catch (error) {
          console.error('There was an error deleting the product:', error);
          Swal.fire('Error!', 'There was an error deleting your product.', 'error');
        }
      }
    });
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
              onClick={() => navigate('/add-product')}

            >
              <StyledDiv>เพิ่มสินค้า </StyledDiv>
            </Button>
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
                        <img src={`https://cafe-project-server11.onrender.com/images-product/${product.image}`} alt={product.productname} 
                            style={{ width: 150, height: 'auto' }}
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
                            }}
                          >
                            {/* Use an appropriate icon component or element for editing */}
                          </a>
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
