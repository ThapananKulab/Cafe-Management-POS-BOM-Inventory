import axios from 'axios';
import { Icon } from '@iconify/react';
import styled1 from 'styled-components';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';

import {
  Box,
  List,
  Grid,
  Card,
  Paper,
  Badge,
  Modal,
  Button,
  AppBar,
  Divider,
  Toolbar,
  Snackbar,
  ListItem,
  CardMedia,
  Container,
  IconButton,
  Typography,
  CardContent,
  CardActions,
  ListItemText,
} from '@mui/material';

const CartTemplate = () => {
  const StyledDiv = styled1.div`
  font-family: 'Prompt', sans-serif;
`;
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());
  const [cartItems, setCartItems] = useState(() => {
    const savedCartItems = localStorage.getItem('cartItems');
    return savedCartItems ? JSON.parse(savedCartItems) : [];
  });
  const [totalPrice, setTotalPrice] = useState(0);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [openAddSnackbar, setOpenAddSnackbar] = useState(false);
  const [addMessage, setAddMessage] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ทั้งหมด');

  const categories = [
    { name: 'ทั้งหมด', icon: 'eva:layers-fill' },
    { name: 'เย็น', icon: 'icon-park:drink' },
    { name: 'ร้อน', icon: 'fluent:drink-coffee-20-filled' },
    { name: 'ปั่น', icon: 'mdi:blender' },
    { name: 'ทั่วไป', icon: 'ic:baseline-category' },
  ];
  useEffect(() => {
    const timer = setInterval(() => {
      const options = { hour12: false };
      setCurrentTime(new Date().toLocaleTimeString('en-US', options));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const filteredProducts = products.filter(
    (product) => selectedCategory === 'ทั้งหมด' || product.type === selectedCategory
  );

  useEffect(() => {
    axios
      .get('http://localhost:3333/api/menus/allMenus')
      .then((response) => {
        console.log('Sample product:', response.data[0]); // Log the first product to check its structure
        setProducts(response.data);
      })
      .catch((err) => {
        console.error('Error fetching product data:', err);
      });
  }, []);

  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
    setTotalPrice(calculateTotalPrice(cartItems));
  }, [cartItems]);

  const handleAddToCart = (productToAdd, sweetLevel) => {
    let productExists = false;
    let newCartItems = [];

    const updatedCartItems = cartItems.map((cartItem) => {
      if (cartItem._id === productToAdd._id && cartItem.sweetLevel === sweetLevel) {
        productExists = true;
        return { ...cartItem, quantity: cartItem.quantity + 1 };
      }
      return cartItem;
    });

    if (!productExists) {
      newCartItems = [...updatedCartItems, { ...productToAdd, quantity: 1, sweetLevel }]; // Add sweetLevel here
    } else {
      newCartItems = [...updatedCartItems];
    }

    setCartItems(newCartItems);

    setOpenAddSnackbar(true);
    setAddMessage(`${productToAdd.name} added to cart`);
  };

  const calculateTotalPrice = (items) =>
    items.reduce((total, item) => total + item.price * item.quantity, 0);

  const handleRemoveItem = (itemId) => {
    const updatedCart = cartItems.filter((item) => item._id !== itemId);
    setCartItems(updatedCart);
    setTotalPrice(calculateTotalPrice(updatedCart));
    setOpenSnackbar(true);
  };

  const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
  };
  const goToDashboard = () => {
    navigate('/dashboard');
  };

  const endpoint = 'http://localhost:3333/api/saleorder/saleOrders'; // Correct as per your backend setup

  const handleSubmitOrder = async () => {
    try {
      const orderData = {
        user: '6561b321f67031c2e591ec2a',
        paymentMethod: 'PromptPay', // Confirm this is a valid enum value in your backend
        total: totalPrice,
        orderNumber: '1',
        items: cartItems.map((item) => ({
          menuItem: item._id, // Change this from menu to menuItem to align with your backend's schema
          price: item.price,
          quantity: item.quantity,
        })),
      };

      const response = await axios.post(endpoint, orderData);
      console.log('Order response:', response.data);
      alert('Order placed successfully');
      // Here you could clear the cart or navigate the user to a success page
    } catch (error) {
      console.error('Order submission failed:', error);
      // Here you could inform the user about the failure to place the order
    }
  };

  return (
    <>
      <Helmet>
        <title>POS</title>
      </Helmet>
      {/* AppBar component for header */}
      <AppBar position="static">
        <Toolbar style={{ justifyContent: 'space-between' }}>
          {/* Logo and title */}
          <Typography
            variant="h6"
            color="inherit"
            noWrap
            style={{ cursor: 'pointer' }}
            onClick={() => navigate('/dashboard')}
          >
            <Icon icon="mdi:network-pos" style={{ marginRight: 8 }} />
            POS
          </Typography>

          {/* Current time display */}
          <Box display="flex" justifyContent="right" flexGrow={1}>
            <Typography variant="h6" color="inherit" noWrap>
              <Icon icon="teenyicons:clock-outline" />
              &nbsp;{currentTime}
            </Typography>
          </Box>

          {/* Shopping cart icon */}
          <IconButton
            color="inherit"
            onClick={() => setIsModalOpen(true)}
            style={{ marginLeft: 'auto' }}
          >
            <Badge badgeContent={cartItems.length} color="secondary">
              <Icon icon="ic:round-shopping-bag" />
            </Badge>
          </IconButton>
        </Toolbar>
      </AppBar>

      <Container>
        <Button onClick={goToDashboard}>
          <Icon icon="material-symbols:arrow-back" style={{ fontSize: '2rem' }} />
        </Button>
      </Container>

      <Container maxWidth="lg" style={{ marginTop: '10px' }}>
        <Box
          sx={{
            my: 1,
            display: 'flex',
            justifyContent: 'center',
            flexWrap: 'wrap',
          }}
        >
          {/* Category buttons */}
          {categories.map((category) => (
            <Button
              key={category.name}
              variant={selectedCategory === category.name ? 'contained' : 'outlined'}
              onClick={() => setSelectedCategory(category.name)}
              sx={{
                m: 1,
                padding: '5px 15px',
                fontSize: '0.8rem',
                minWidth: '100px',
              }}
            >
              <Icon icon={category.icon} style={{ marginRight: 8, marginBottom: -2 }} />
              {category.name}
            </Button>
          ))}
        </Box>
      </Container>

      {/* Display the products dynamically */}
      <Container maxWidth="lg" style={{ marginTop: '80px' }}>
        <Grid container spacing={4}>
          {/* Map through filteredProducts and display cards */}
          {filteredProducts.map((product) => (
            <Grid item xs={12} sm={6} md={4} key={product._id}>
              {/* Card component with Paper for styling */}
              <Paper elevation={3} style={{ borderRadius: 16 }}>
                <Card>
                  <CardMedia style={{ height: 140 }} image={product.image} title={product.name} />

                  <CardContent>
                    <Typography gutterBottom variant="h5" component="h2">
                      <StyledDiv> {product.name}</StyledDiv>
                    </Typography>
                    <Typography variant="body2" color="textSecondary" component="p">
                      {product.type}
                    </Typography>
                    {product.type !== 'ทั่วไป' && (
                      <Typography variant="body2" color="textSecondary" component="p">
                        <StyledDiv>ประเภท: {product.type}</StyledDiv>
                      </Typography>
                    )}
                    <Typography variant="body2" color="textSecondary" component="p">
                      {product.sweetLevel !== 'ทั่วไป' && (
                        <StyledDiv>รสชาติ: {product.sweetLevel}</StyledDiv>
                      )}
                    </Typography>

                    <Typography
                      variant="h6"
                      component="p"
                      style={{ color: 'green', fontWeight: 'bold', marginTop: '8px' }}
                    >
                      <StyledDiv>ราคา {product.price} ฿</StyledDiv>
                    </Typography>
                  </CardContent>
                  <CardActions>
                    {/* Button to add item to cart */}
                    <Button
                      size="medium"
                      color="primary"
                      onClick={() => handleAddToCart(product, product.sweetLevel)} // Assuming sweetLevel is part of your product object
                      style={{ minWidth: 'auto', padding: '6px 12px' }}
                    >
                      <Icon icon="charm:arrow-right" style={{ fontSize: '1.25rem' }} />
                    </Button>
                  </CardActions>
                </Card>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Cart Modal */}
      <Modal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        <Box sx={modalStyle}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            <StyledDiv>รายการเมนู</StyledDiv>
          </Typography>
          <List>
            {cartItems.map((item) => (
              <ListItem
                key={item._id}
                secondaryAction={
                  <IconButton
                    edge="end"
                    aria-label="delete"
                    onClick={() => handleRemoveItem(item._id)}
                  >
                    <Icon icon="clarity:remove-solid" />
                  </IconButton>
                }
              >
                <StyledDiv>
                  <ListItemText
                    primary={`${item.name} x ${item.quantity} (${item.sweetLevel})`}
                    secondary={`ประเภท: ${item.type}, ราคา: ฿ ${item.price}`}
                  />
                </StyledDiv>
              </ListItem>
            ))}
            <Divider />
            <ListItem>
              <StyledDiv>
                <ListItemText
                  primary={
                    <Typography variant="h6" style={{ fontWeight: 'bold' }}>
                      Total
                    </Typography>
                  }
                  secondary={
                    <Typography component="span" style={{ color: 'green', fontWeight: 'bold' }}>
                      ฿ {totalPrice}
                    </Typography>
                  }
                />
              </StyledDiv>
            </ListItem>
          </List>
          <Button
            variant="contained"
            style={{
              backgroundColor: '#4CAF50',
              marginTop: '10px',
              width: '150px',
              height: '40px',
              borderRadius: '0',
              margin: '0 auto',
              display: 'block',
            }}
            onClick={handleSubmitOrder}
          >
            <Icon icon="heroicons:arrow-right-16-solid" style={{ fontSize: '24px' }} />
          </Button>
        </Box>
      </Modal>

      <Snackbar
        open={openAddSnackbar}
        severity="success"
        autoHideDuration={1000}
        onClose={(event, reason) => {
          if (reason === 'clickaway') {
            return; // Keeps the Snackbar open if the reason is a clickaway
          }
          setOpenAddSnackbar(false);
        }}
        message={addMessage}
      />

      <Snackbar
        open={openSnackbar}
        autoHideDuration={1000}
        onClose={(event, reason) => {
          if (reason === 'clickaway') {
            return; // Keeps the Snackbar open if the reason is a clickaway
          }
          setOpenSnackbar(false);
        }}
        message="ลบออกจากตะกร้าเรียบร้อย"
      />
    </>
  );
};

export default CartTemplate;
