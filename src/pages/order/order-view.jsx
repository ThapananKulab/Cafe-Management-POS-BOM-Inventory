import React, { useState, useEffect } from 'react';

import { List, Paper, ListItem, Typography, ListItemText } from '@mui/material';

function generateFakeOrder() {
  return {
    id: Math.floor(Math.random() * 1000),
    quantity: Math.floor(Math.random() * 10) + 1,
  };
}

function RealTimeOrderPage() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fakeOrderGenerator = setInterval(() => {
      const newOrder = generateFakeOrder();
      console.log('New order generated:', newOrder); // Check the console for this log
      setOrders((currentOrders) => [...currentOrders, newOrder]);
    }, 1000);

    return () => clearInterval(fakeOrderGenerator); // Clean up on component unmount
  }, []);

  return (
    <Paper sx={{ maxWidth: 600, margin: 'auto', padding: 2 }}>
      <Typography variant="h4" sx={{ mb: 2 }}>
        Real-Time Orders (Simulated)
      </Typography>
      <List>
        {orders.map((order, index) => (
          <ListItem key={index}>
            <ListItemText
              primary={`Order #${order.id}`}
              secondary={`Quantity: ${order.quantity}`}
            />
          </ListItem>
        ))}
      </List>
    </Paper>
  );
}

export default RealTimeOrderPage;
