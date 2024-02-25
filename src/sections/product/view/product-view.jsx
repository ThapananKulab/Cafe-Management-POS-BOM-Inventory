import axios from 'axios';
import React, { useState, useEffect } from 'react';

import {
  Grid,
  Paper,
  Table,
  TableRow,
  TableBody,
  TableCell,
  TableHead,
  TextField,
  TableContainer,
} from '@mui/material';

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
  const filteredProducts = products.filter((product) =>
    product.productname.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
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
                  <TableCell>รูปภาพ</TableCell>
                  <TableCell>ชื่อสินค้า</TableCell>
                  <TableCell align="right">ราคา</TableCell>
                  <TableCell align="right">ประเภทสินค้า</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredProducts.map((product) => (
                  <TableRow
                    key={product.id}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      {product.productname}
                    </TableCell>
                    <TableCell align="right">{product.price}</TableCell>
                    <TableCell align="right">{product.category}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>
    </div>
  );
}
