import 'dayjs/locale/th';
import dayjs from 'dayjs';
import axios from 'axios';
import styled1 from 'styled-components';
import { useNavigate } from 'react-router-dom';
import React, { useState, useEffect, useCallback } from 'react';

import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import {
  Box,
  Paper,
  Table,
  Stack,
  Select,
  MenuItem,
  TableRow,
  Container,
  TableCell,
  TableHead,
  TableBody,
  TextField,
  Typography,
  TableContainer,
} from '@mui/material';

const MyComponent = () => {
  const StyledDiv = styled1.div`
    font-family: 'Prompt', sans-serif;
  `;
  const navigate = useNavigate();
  const [incomeData, setIncomeData] = useState([]);
  const [expensesData, setExpensesData] = useState([]);
  const [purchaseReceiptData, setPurchaseReceiptData] = useState([]);
  const [saleOrderData, setSaleOrderData] = useState([]);
  const [selectedDate, setSelectedDate] = useState(dayjs().startOf('month').format('MMMM YYYY')); // เริ่มต้นที่เดือนและปีปัจจุบัน
  const [filteredProfitData, setFilteredProfitData] = useState([]);

  const calculateProfit = useCallback(() => {
    const profitData = {};

    // Function to format the date to 'YYYY-MM-DD'
    const formatToDate = (date) => dayjs(date).locale('th').format('YYYY-MM-DD');

    // Group data by date
    incomeData.forEach((item) => {
      const date = formatToDate(item.date);
      profitData[date] = {
        date,
        salesRevenue: item.salesRevenue,
        purchaseCost: 0,
        expenses: 0,
        profit: 0,
      };
    });

    saleOrderData.forEach((item) => {
      const date = formatToDate(item.date);
      profitData[date] = profitData[date] || {
        date,
        salesRevenue: 0,
        purchaseCost: 0,
        expenses: 0,
        profit: 0,
      };
      profitData[date].salesRevenue += item.total;
    });

    purchaseReceiptData.forEach((item) => {
      const date = formatToDate(item.received);
      profitData[date] = profitData[date] || {
        date,
        salesRevenue: 0,
        purchaseCost: 0,
        expenses: 0,
        profit: 0,
      };
      profitData[date].purchaseCost += item.total;
    });

    expensesData.forEach((item) => {
      const date = formatToDate(item.date);
      profitData[date] = profitData[date] || {
        date,
        salesRevenue: 0,
        purchaseCost: 0,
        expenses: 0,
        profit: 0,
      };
      profitData[date].expenses += item.amount;
    });

    // Calculate profit for each date
    Object.values(profitData).forEach((item) => {
      item.profit = item.salesRevenue - item.purchaseCost - item.expenses;
    });

    // Convert object to array and sort by date
    const sortedProfitData = Object.values(profitData).sort(
      (a, b) => dayjs(a.date).unix() - dayjs(b.date).unix() // Sort in ascending order by date
    );

    return sortedProfitData;
  }, [incomeData, expensesData, purchaseReceiptData, saleOrderData]);

  useEffect(() => {
    axios
      .get('http://localhost:3333/api/income/income')
      .then((response) => setIncomeData(response.data))
      .catch((error) => console.error('Error fetching income data:', error));

    axios
      .get('http://localhost:3333/api/income/expenses')
      .then((response) => setExpensesData(response.data))
      .catch((error) => console.error('Error fetching expenses data:', error));

    axios
      .get('http://localhost:3333/api/income/purchase-receipts')
      .then((response) => setPurchaseReceiptData(response.data))
      .catch((error) => console.error('Error fetching purchase receipt data:', error));

    axios
      .get('http://localhost:3333/api/income/sale-orders')
      .then((response) => setSaleOrderData(response.data))
      .catch((error) => console.error('Error fetching sale order data:', error));
  }, []);

  useEffect(() => {
    const profitData = calculateProfit();
    setFilteredProfitData(profitData);
  }, [incomeData, expensesData, purchaseReceiptData, saleOrderData, calculateProfit]);

  const handleSearch = (date) => {
    setSelectedDate(date);
    if (date) {
      const selectedMonth = dayjs(date).month(); // Get the zero-indexed month
      const selectedYear = dayjs(date).year(); // Get the year
      const filteredData = calculateProfit().filter(
        (row) =>
          dayjs(row.date).month() === selectedMonth && dayjs(row.date).year() === selectedYear
      );
      setFilteredProfitData(filteredData);
    } else {
      setFilteredProfitData(calculateProfit());
    }
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
    handleSearch(date);
  };

  const totalSalesRevenue = filteredProfitData.reduce((total, row) => total + row.salesRevenue, 0);
  const totalPurchaseCost = filteredProfitData.reduce((total, row) => total + row.purchaseCost, 0);
  const totalExpenses = filteredProfitData.reduce((total, row) => total + row.expenses, 0);
  const totalProfit = filteredProfitData.reduce((total, row) => total + row.profit, 0);

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
              defaultValue="/report/profit-month"
              inputProps={{ 'aria-label': 'select' }}
            >
              {/* <MenuItem value="/report/daily">รายงานยอดขาย 7 วันย้อนหลัง</MenuItem> */}
              <MenuItem value="/report/profit-month">รายงานขายรายเดือน</MenuItem>
              <MenuItem value="/report/salemenu">ประวัติการขายสินค้า</MenuItem>
              <MenuItem value="/report/payment">รายงานการขายจำแนกตามประเภทการชำระเงิน</MenuItem>
              <MenuItem value="/report/cost">รายชื่อวัตถุดิบราคาต้นทุนสูงสุด</MenuItem>
              <MenuItem value="/purchase/withdraw-out">รายงานเบิกวัตถุดิบ</MenuItem>
              <MenuItem value="/purchase/report">ประวัติใบสั่งซื้อ</MenuItem>
            </Select>
          </Paper>
        </Stack>
        <LocalizationProvider dateAdapter={AdapterDateFns} locale="th">
          <DatePicker
            views={['year', 'month']}
            label="Select Month and Year"
            value={selectedDate}
            onChange={handleDateChange}
            renderInput={(props) => <TextField {...props} />}
          />
        </LocalizationProvider>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>วันที่</TableCell>
                <TableCell>ยอดขาย</TableCell>
                <TableCell>สั่งซื้อวัตถุดิบ</TableCell>
                <TableCell>ค่าใช้จ่าย</TableCell>
                <TableCell>กำไร</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredProfitData.map((row) => (
                <TableRow key={row.date}>
                  <TableCell>{dayjs(row.date).locale('th').format('DD MMMM YYYY')}</TableCell>
                  <TableCell>{row.salesRevenue}</TableCell>
                  <TableCell>{row.purchaseCost}</TableCell>
                  <TableCell>{row.expenses}</TableCell>
                  <TableCell>{row.profit}</TableCell>
                </TableRow>
              ))}
              <TableRow>
                <TableCell>
                  <strong>รวมทั้งสิ้น</strong>
                </TableCell>
                <TableCell>
                  <strong>{totalSalesRevenue}</strong>
                </TableCell>
                <TableCell>
                  <strong>{totalPurchaseCost}</strong>
                </TableCell>
                <TableCell>
                  <strong>{totalExpenses}</strong>
                </TableCell>
                <TableCell>
                  <strong>{totalProfit}</strong>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Container>
  );
};

export default MyComponent;
