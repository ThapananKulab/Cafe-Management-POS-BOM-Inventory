import axios from 'axios';
import { Icon } from '@iconify/react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';

import {
  Box,
  List,
  Grid,
  Card,
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
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString()); // Keep this definition
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
      .get('https://cafe-project-server11.onrender.com/api/products')
      .then((response) => {
        console.log(response.data);
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

  const handleAddToCart = (productToAdd) => {
    let productExists = false;
    let newCartItems = [];

    const updatedCartItems = cartItems.map((cartItem) => {
      if (cartItem._id === productToAdd._id) {
        productExists = true;
        return { ...cartItem, quantity: cartItem.quantity + 1 };
      }
      return cartItem;
    });

    if (!productExists) {
      newCartItems = [{ ...productToAdd, quantity: 1 }, ...updatedCartItems];
    } else {
      newCartItems = [...updatedCartItems];
    }

    setCartItems(newCartItems);

    setOpenAddSnackbar(true);
    setAddMessage(`${productToAdd.productname} added to cart`);
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

  return (
    <>
      <Helmet>
        <title>POS</title>
      </Helmet>
      <AppBar position="static">
        <Toolbar style={{ justifyContent: 'space-between' }}>
          <Typography
            variant="h6"
            color="inherit"
            noWrap
            style={{ width: '100%', maxWidth: 'none' }}
          >
            POS
          </Typography>
          <Box display="flex" justifyContent="center" flexGrow={1}>
            <Typography variant="h6" color="inherit" noWrap>
              <Icon icon="teenyicons:clock-outline" />
              &nbsp;{currentTime}
            </Typography>
          </Box>
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
          {/* เพิ่มขนาดไอคอน */}
        </Button>
      </Container>

      <Container maxWidth="lg" style={{ marginTop: '10px' }}>
        <Box
          sx={{
            my: 1,
            display: 'flex', // Use Flexbox
            justifyContent: 'center', // Center horizontally
            flexWrap: 'wrap', // Allow the buttons to wrap on small screens
          }}
        >
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
              <Icon icon={category.icon} style={{ marginRight: 8, marginBottom: -2 }} />{' '}
              {category.name}
            </Button>
          ))}
        </Box>
      </Container>

      {/* Display the products dynamically */}
      <Container maxWidth="lg" style={{ marginTop: '80px' }}>
        <Grid container spacing={4}>
          {filteredProducts.map((product) => (
            <Grid item xs={12} sm={6} md={4} key={product._id}>
              <Card>
                <CardMedia
                  style={{ height: 140 }}
                  image={`https://cafe-project-server11.onrender.com/images-product/${product.image}`}
                  title={product.name}
                />
                <CardContent>
                  <Typography gutterBottom variant="h5" component="h2">
                    {product.productname}
                  </Typography>
                  <Typography
                    variant="h6"
                    component="p"
                    style={{ color: 'green', fontWeight: 'bold', marginTop: '8px' }}
                  >
                    ราคา {product.price} ฿
                  </Typography>
                  <Typography variant="body2" color="textSecondary" component="p">
                    {product.type}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button
                    size="medium" // หรือไม่ต้องใส่ size ไปเลยเพื่อให้ได้ขนาดมาตรฐาน
                    color="primary"
                    onClick={() => handleAddToCart(product)}
                    style={{ minWidth: 'auto', padding: '6px 12px' }} // ปรับขนาดและระยะห่างของ padding ตามต้องการ
                  >
                    <Icon icon="charm:arrow-right" style={{ fontSize: '1.25rem' }} />
                  </Button>
                </CardActions>
              </Card>
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
            สินค้าในตะกร้า
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
                <ListItemText
                  primary={`${item.productname} x ${item.quantity}`}
                  secondary={`฿ ${item.price}`}
                />
              </ListItem>
            ))}
            <Divider />
            <ListItem>
              <ListItemText primary="Total" secondary={`฿ ${totalPrice}`} />
            </ListItem>
          </List>
          <Button
            variant="contained"
            style={{
              backgroundColor: '#4CAF50', // Green color
              marginTop: '10px',
              width: '150px', // Increase the width as needed
              height: '40px', // Adjust the height as needed
              borderRadius: '0', // Makes it square-shaped
              margin: '0 auto', // Centers the button when it's within a flex container or similar
              display: 'block', // Necessary for centering without a flex container
            }}
            onClick={() => setIsModalOpen(false)}
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
