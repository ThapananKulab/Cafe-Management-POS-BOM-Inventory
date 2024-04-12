import axios from 'axios';
import React, { useState, useEffect } from 'react';

import {
  Paper,
  Table,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  TableContainer,
} from '@mui/material';

const SalesReportPage = () => {
  const [dailySales, setDailySales] = useState([]); // Initialize dailySales state with an empty array

  useEffect(() => {
    const fetchDailySales = async () => {
      try {
        const response = await axios.get('http://localhost:3333/api/saleorder/report/dailySales');
        setDailySales(response.data.dailySales);
      } catch (error) {
        console.error('Error fetching daily sales:', error);
      }
    };

    fetchDailySales();
  }, []);

  return (
    <div>
      <h1>รายงานยอดขายประจำวัน</h1>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>วัน</TableCell>
              <TableCell align="right">ยอดขายทั้งหมด</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {dailySales.map((sale) => (
              <TableRow key={sale.date}>
                <TableCell component="th" scope="row">
                  {sale.date}
                </TableCell>
                <TableCell align="right">{sale.totalSales}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default SalesReportPage;
