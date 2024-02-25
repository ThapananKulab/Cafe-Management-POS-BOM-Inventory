import axios from 'axios';
import { Icon } from '@iconify/react';
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

  // ฟังก์ชั่นสำหรับกรองผลลัพธ์ตามคำค้นหา
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
          <Typography variant="h4">สินค้า</Typography>

          <Button variant="contained" color="inherit" startIcon={<Iconify icon="eva:plus-fill" />}>
            เพิ่มสินค้า
          </Button>
        </Stack>
        <TextField
          label="ค้นหาสินค้า"
          variant="outlined"
          fullWidth
          margin="normal"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
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
                      <TableRow key={product.id}>
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
                        <TableCell align="center">{product.type} </TableCell>
                        <TableCell>
                          <a
                            href="http://example.com/edit"
                            style={{ marginRight: '8px', display: 'inline-block' }}
                          >
                            <Icon icon="mingcute:edit-fill" width="2em" height="2em" />
                          </a>
                          <a href="http://example.com/delete">
                            <Icon icon="mingcute:delete-fill" width="2em" height="2em" />
                          </a>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} align="center">
                        <Typography variant="subtitle1" gutterBottom>
                          ไม่เจอสินค้า
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
