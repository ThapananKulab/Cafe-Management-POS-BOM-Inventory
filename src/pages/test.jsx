import 'dayjs/locale/th';
import dayjs from 'dayjs';
import axios from 'axios';
import React, { useState, useEffect, useCallback } from 'react';

import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import {
  Paper,
  Table,
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
  const [incomeData, setIncomeData] = useState([]);
  const [expensesData, setExpensesData] = useState([]);
  const [purchaseReceiptData, setPurchaseReceiptData] = useState([]);
  const [saleOrderData, setSaleOrderData] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null); // Initialize with today's date
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
      .get('https://cafe-management-pos-bom-inventory-api.vercel.app/api/income/income')
      .then((response) => setIncomeData(response.data))
      .catch((error) => console.error('Error fetching income data:', error));

    axios
      .get('https://cafe-management-pos-bom-inventory-api.vercel.app/api/income/expenses')
      .then((response) => setExpensesData(response.data))
      .catch((error) => console.error('Error fetching expenses data:', error));

    axios
      .get('https://cafe-management-pos-bom-inventory-api.vercel.app/api/income/purchase-receipts')
      .then((response) => setPurchaseReceiptData(response.data))
      .catch((error) => console.error('Error fetching purchase receipt data:', error));

    axios
      .get('https://cafe-management-pos-bom-inventory-api.vercel.app/api/income/sale-orders')
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

  return (
    <Container>
      <LocalizationProvider dateAdapter={AdapterDateFns} locale="th">
        <Typography variant="h3" gutterBottom>
          กำไรสุทธิ
        </Typography>
        <DatePicker
          views={['year', 'month']}
          label="Select Month and Year"
          value={selectedDate}
          onChange={handleDateChange} // ใช้ handleDateChange แทน handleSearch
          renderInput={(props) => <TextField {...props} />}
        />

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
            </TableBody>
          </Table>
        </TableContainer>
      </LocalizationProvider>
    </Container>
  );
};

export default MyComponent;
