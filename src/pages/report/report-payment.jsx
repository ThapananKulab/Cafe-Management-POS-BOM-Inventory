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
  TableBody,
  TableCell,
  TableHead,
  Container,
  Typography,
  TableContainer,
} from '@mui/material';

import PaymentMethodPieChart from './graph-pie-payment';

function PaymentMethodReport() {
  const StyledDiv = styled1.div`
    font-family: 'Prompt', sans-serif;
  `;
  const navigate = useNavigate();
  const [reportData, setReportData] = useState([]);

  useEffect(() => {
    async function fetchReport() {
      try {
        const response = await fetch(
          'https://cafe-management-pos-bom-inventory-api.vercel.app/api/saleorder/report/payment-methods'
        );
        if (!response.ok) {
          throw new Error('Failed to fetch payment method report');
        }
        const data = await response.json();
        setReportData(data);
      } catch (error) {
        console.error('Error fetching payment method report:', error);
      }
    }

    fetchReport();
  }, []);

  return (
    <Container>
      <Box sx={{ width: '100%', overflow: 'hidden' }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={4}>
          <Typography variant="h4">
            <StyledDiv>ประวัติการขายสินค้า</StyledDiv>
          </Typography>
        </Stack>
        <Stack direction="row" spacing={2} justifyContent="center" marginBottom={4}>
          <Paper>
            <Select
              onChange={(event) => navigate(event.target.value)}
              defaultValue="/report/payment"
              inputProps={{ 'aria-label': 'select' }}
            >
              {/* <MenuItem value="/report/daily">รายงานยอดขาย 7 วันย้อนหลัง</MenuItem> */}
              {/* <MenuItem value="/report/cancelbill">รายงานการยกเลิกบิล</MenuItem> */}
              <MenuItem value="/report/profit-month">รายงานขายรายเดือน</MenuItem>
              <MenuItem value="/report/salemenu">ประวัติการขายสินค้า</MenuItem>
              <MenuItem value="/report/payment">รายงานการขายจำแนกตามประเภทการชำระเงิน</MenuItem>
              <MenuItem value="/report/cost">รายชื่อวัตถุดิบราคาต้นทุนสูงสุด</MenuItem>
              <MenuItem value="/purchase/withdraw-out">รายงานเบิกวัตถุดิบ</MenuItem>
              <MenuItem value="/purchase/report">ประวัติใบสั่งซื้อ</MenuItem>
              {/* <MenuItem value="/report/popular-menu">ยอดขายที่ขายดีสุดตามเวลา</MenuItem> */}
            </Select>
          </Paper>
        </Stack>

        <PaymentMethodPieChart data={reportData} />

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ประเภทการชำระเงิน</TableCell>
                <TableCell>รายการทั้งหมด</TableCell>
                <TableCell>จำนวนรวม</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {reportData.map((item, index) => (
                <TableRow key={index}>
                  <TableCell>{item._id}</TableCell>
                  <TableCell>{item.count}</TableCell>
                  <TableCell>{item.totalAmount}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Container>
  );
}

export default PaymentMethodReport;
