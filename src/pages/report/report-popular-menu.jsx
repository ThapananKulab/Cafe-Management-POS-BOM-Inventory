import axios from 'axios';
import styled1 from 'styled-components';
import { useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';

import {
  Box,
  Table,
  Stack,
  Paper,
  Select,
  MenuItem,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  Container,
  Typography,
} from '@mui/material';

const SalesAnalysisPage = () => {
  const [salesData, setSalesData] = useState(null);
  const navigate = useNavigate();
  const StyledDiv = styled1.div`
    font-family: 'Prompt', sans-serif;
  `;

  useEffect(() => {
    const fetchSalesData = async () => {
      try {
        const response = await axios.get(
          'https://cafe-management-pos-bom-inventory-api.vercel.app/api/saleorder/report/sales-analysis'
        );
        setSalesData(response.data);
      } catch (error) {
        console.error('Error fetching sales data:', error);
      }
    };
    fetchSalesData();
  }, []);

  if (!salesData) {
    return <div>กำลังโหลด</div>;
  }

  return (
    <Container>
      <Box sx={{ width: '100%', overflow: 'hidden' }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4">
            <StyledDiv>ยอดขายที่ขายดีสุดตามเวลา</StyledDiv>
          </Typography>
        </Stack>
        <Stack direction="row" spacing={2} justifyContent="center" marginBottom={4}>
          <Paper>
            <Select
              onChange={(event) => navigate(event.target.value)}
              defaultValue="/report/popular-menu"
              inputProps={{ 'aria-label': 'select' }}
            >
              {/* <MenuItem value="/report/daily">รายงานยอดขาย 7 วันย้อนหลัง</MenuItem> */}
              <MenuItem value="/report/cancelbill">รายงานการยกเลิกบิล</MenuItem>
              <MenuItem value="/report/salemenu">ประวัติการขายสินค้า</MenuItem>
              <MenuItem value="/report/payment">รายงานการขายจำแนกตามประเภทการชำระเงิน</MenuItem>
              <MenuItem value="/report/cost">รายชื่อวัตถุดิบราคาต้นทุนสูงสุด</MenuItem>
              {/* <MenuItem value="/report/popular-menu">ยอดขายที่ขายดีสุดตามเวลา</MenuItem> */}
            </Select>
          </Paper>
        </Stack>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ช่วงเวลา</TableCell>
              <TableCell>จำนวน</TableCell>
              <TableCell>เมนูที่ขายดีที่สุด</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {salesData.map((data, index) => (
              <TableRow key={index}>
                <TableCell>{data.timeSlot}</TableCell>
                <TableCell>{data.totalSales}</TableCell>
                <TableCell>
                  <ul>
                    {data.topItems.map((item, itemIndex) => (
                      <li key={itemIndex}>{`${item[0]} (${item[1]})`}</li>
                    ))}
                  </ul>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Box>
    </Container>
  );
};

export default SalesAnalysisPage;
