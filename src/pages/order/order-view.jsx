import React, { useState, useEffect } from 'react';

import {
  Paper,
  Table,
  TableRow,
  TableBody,
  TableCell,
  TableHead,
  Container,
  Typography,
  TableContainer,
} from '@mui/material';

function RealTimeOrderPage() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch('http://localhost:3333/api/saleorder/saleOrders'); // Adjust URL as needed
        if (!response.ok) {
          throw new Error('Failed to fetch');
        }
        let data = await response.json();

        // Sort orders from most recent to oldest
        data = data.sort((a, b) => new Date(b.date) - new Date(a.date));

        setOrders(data);
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };

    fetchOrders();
  }, []);

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
  };

  return (
    <Container>
      <Typography variant="h4" sx={{ mb: 5 }}>
        Real-Time Orders
      </Typography>
      <Paper>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Order Number</TableCell>
                <TableCell align="right">User</TableCell>
                <TableCell align="right">Date and Time</TableCell>
                <TableCell align="right">Total</TableCell>
                <TableCell align="right">Status</TableCell>
                <TableCell align="right">Payment Method</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orders.map((order) => (
                <TableRow
                  key={order._id}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {order.orderNumber}
                  </TableCell>
                  <TableCell align="right">{order.user}</TableCell>
                  <TableCell align="right">{formatDateTime(order.date)}</TableCell>
                  <TableCell align="right">${order.total}</TableCell>
                  <TableCell align="right">{order.status}</TableCell>
                  <TableCell align="right">{order.paymentMethod}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Container>
  );
}

export default RealTimeOrderPage;
