import axios from 'axios';
import moment from 'moment-timezone';
import styled1 from 'styled-components';
import { useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';

import {
  Box,
  Stack,
  Paper,
  Table,
  Select,
  MenuItem,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  Container,
  Typography,
  TableContainer,
} from '@mui/material';

// Thai month names
const thaiMonths = [
  'มกราคม',
  'กุมภาพันธ์',
  'มีนาคม',
  'เมษายน',
  'พฤษภาคม',
  'มิถุนายน',
  'กรกฎาคม',
  'สิงหาคม',
  'กันยายน',
  'ตุลาคม',
  'พฤศจิกายน',
  'ธันวาคม',
];

const SalesReportPage = () => {
  const StyledDiv = styled1.div`
    font-family: 'Prompt', sans-serif;
  `;

  const StyledDiv1 = styled1.div`
   font-family: 'Prompt', sans-serif;
    font-weight: bold;
  color: #ff5722; /* เปลี่ยนสีตามที่ต้องการ */
  `;

  const [weeklySales, setWeeklySales] = useState([]);
  const [totalSales, setTotalSales] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchWeeklySales = async () => {
      try {
        const response = await axios.get(
          'https://test-api-01.azurewebsites.net/api/saleorder/report/weeklySales'
        );
        setWeeklySales(response.data.weeklySales);
        setTotalSales(response.data.totalSales); // Set total sales for the week
      } catch (error) {
        console.error('Error fetching weekly sales:', error);
      }
    };

    fetchWeeklySales();
  }, []);

  return (
    <Container>
      <Box sx={{ width: '100%', overflow: 'hidden' }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4">
            <StyledDiv>รายงานยอดขาย 7 วันย้อนหลัง</StyledDiv>
          </Typography>
          <Typography variant="h6">
            <StyledDiv1>ยอดขาย: {totalSales}</StyledDiv1>
          </Typography>
        </Stack>
        <Stack direction="row" spacing={2} justifyContent="center" marginBottom={4}>
          <Paper>
            <Select
              onChange={(event) => navigate(event.target.value)}
              defaultValue="/report/daily"
              inputProps={{ 'aria-label': 'select' }}
            >
              <MenuItem value="/report/daily">รายงานยอดขาย 7 วันย้อนหลัง</MenuItem>
              <MenuItem value="/report/cancelbill">รานงานการยกเลิกบิล</MenuItem>
              <MenuItem value="/report/salemenu">ประวัติการขายสินค้า</MenuItem>
              <MenuItem value="/report/payment">รายงานการขายจำแนกตามประเภทการชำระเงิน</MenuItem>
              <MenuItem value="/report/cost">รายชื่อวัตถุดิบราคาต้นทุนสูงสุด</MenuItem>
              <MenuItem value="/report/popular-menu">ยอดขายที่ขายดีสุดตามเวลา</MenuItem>
              <MenuItem value="/open-order">ประวัติการปิด-เปิดร้าน</MenuItem>
            </Select>
          </Paper>
        </Stack>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>วัน</TableCell>
                <TableCell align="right">ยอดขายประจำวัน</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {weeklySales.map((sale) => (
                <TableRow key={sale.date}>
                  <TableCell component="th" scope="row">
                    {moment(sale.date).format(`D ${thaiMonths[moment(sale.date).month()]} YYYY`)}
                  </TableCell>
                  <TableCell align="right">{sale.dailySales}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Container>
  );
};

export default SalesReportPage;
