import React, { useState, useEffect } from 'react';

import { createTheme, ThemeProvider } from '@mui/material/styles';
import { List, Paper, ListItem, Typography, ListItemText } from '@mui/material';

function generateFakeOrder() {
  return {
    id: Math.floor(Math.random() * 1000),
    quantity: Math.floor(Math.random() * 10) + 1,
  };
}

const theme = createTheme({
  palette: {
    primary: {
      main: '#007BFF', // A vibrant blue
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#FFA500', // A warm orange
    },
    // Add more colors as needed
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    fontSize: 14,
    h4: {
      fontWeight: 600,
    },
    subtitle2: {
      fontWeight: 500,
    },
    caption: {
      fontSize: 12,
      color: '#6c757d',
    },
    // Customize as needed
  },
  shadows: [
    'none',
    '0px 2px 4px -1px rgba(0,0,0,0.2), 0px 4px 5px 0px rgba(0,0,0,0.14), 0px 1px 10px 0px rgba(0,0,0,0.12)',
  ],
  // Customize other aspects like transitions, spacing, etc., as needed
});

function RealTimeOrderPage() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fakeOrderGenerator = setInterval(() => {
      const newOrder = generateFakeOrder();
      console.log('New order generated:', newOrder); // Check the console for this log
      setOrders((currentOrders) => [...currentOrders, newOrder]);
    }, 1000); // Adjusted for demonstration purposes

    return () => clearInterval(fakeOrderGenerator); // Clean up on component unmount
  }, []);

  return (
    <ThemeProvider theme={theme}>
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
    </ThemeProvider>
  );
}

export default RealTimeOrderPage;
