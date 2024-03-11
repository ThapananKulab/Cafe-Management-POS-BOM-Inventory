import axios from 'axios';
import { Icon } from '@iconify/react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';

import {
  Grid,
  List,
  Paper,
  Avatar,
  Button,
  Divider,
  ListItem,
  Container,
  Typography,
  ListItemText,
  ListItemSecondaryAction,
} from '@mui/material';

const CartTemplate = () => {
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch product data from your API
    axios.get('https://cafe-project-server11.onrender.com/api/products')
      .then((response) => {
        setCartItems(response.data);
        setTotalPrice(calculateTotalPrice(response.data));
      })
      .catch((err) => {
        console.error('Error fetching product data:', err);
        setError('Error fetching product data');
      });
  }, []);

  const handleRemoveItem = (itemId) => {
    const updatedCart = cartItems.filter((item) => item._id !== itemId);
    setCartItems(updatedCart);
    setTotalPrice(calculateTotalPrice(updatedCart));
  };

  const calculateTotalPrice = (items) => items.reduce((total, item) => total + item.price, 0);

  return (
    <>

    <Helmet>
        <title> ขายสินค้า </title>
      </Helmet>

    <Container maxWidth="md">
      <Typography variant="h4" align="center" gutterBottom>
        Shopping Cart
      </Typography>
      <Button variant="outlined" size="large" onClick={() => navigate('/dashboard')}>
          กลับ
        </Button>
        <br />
      <Divider />
      <Grid container spacing={2} justifyContent="flex-end">
        <Grid item xs={12} sm={6}>
          <Paper elevation={3} style={{ marginTop: '20px' }}>
            <List>
              {error ? (
                <Typography variant="body1" color="error" align="center">
                  {error}
                </Typography>
              ) : (
                cartItems.map((item) => (
                  <ListItem key={item._id}>
                    <Avatar
                      alt={item.productname}
                      src={`https://cafe-project-server11.onrender.com/images-product/${item.image}`}
                      style={{ width: '80px', height: '80px', marginRight: '16px' }}
                    /> 
                    <ListItemText primary={item.productname} secondary={`$${item.price}`} />
                    <ListItemSecondaryAction>
                      <Icon icon="material-symbols:delete-sharp" onClick={() => handleRemoveItem(item._id)} />
                    </ListItemSecondaryAction>
                  </ListItem>
                ))
              )}
            </List>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Paper elevation={3} style={{ marginTop: '20px', padding: '10px' }}>
            <Typography variant="h6" gutterBottom>
              Summary
            </Typography>
            <Typography variant="subtitle1" gutterBottom>
              Total: ${totalPrice}
            </Typography>
            <Button variant="contained" color="primary" size="large" style={{ marginTop: '20px' }}>
              Checkout
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </Container>

      </>
  );
};
export default CartTemplate;
