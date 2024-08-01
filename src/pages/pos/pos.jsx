import axios from 'axios';
import { Icon } from '@iconify/react';
import styled1 from 'styled-components';
import { Helmet } from 'react-helmet-async';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';

import {
  Box,
  Grid,
  Card,
  Paper,
  Button,
  AppBar,
  Toolbar,
  CardMedia,
  Container,
  Typography,
  CardContent,
} from '@mui/material';

const CartTemplate = () => {
  const StyledDiv = styled1.div`
    font-family: 'Prompt', sans-serif;
  `;
  const [products, setProducts] = useState([]);
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('ทั้งหมด');

  useEffect(() => {
    const timer = setInterval(() => {
      const options = { hour12: false };
      setCurrentTime(new Date().toLocaleTimeString('en-US', options));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const categories = [
    { name: 'ทั้งหมด', icon: 'eva:layers-fill' },
    { name: 'เย็น', icon: 'icon-park:drink' },
    { name: 'ร้อน', icon: 'fluent:drink-coffee-20-filled' },
    { name: 'ปั่น', icon: 'mdi:blender' },
    { name: 'ทั่วไป', icon: 'ic:baseline-category' },
  ];

  const filteredProducts = products.filter(
    (product) => selectedCategory === 'ทั้งหมด' || product.type === selectedCategory
  );

  useEffect(() => {
    axios
      .get('https://cafe-management-pos-bom-inventory-api.vercel.app/api/menus/allMenus')
      .then((response) => {
        console.log('Sample product:', response.data[0]); // Log the first product to check its structure
        setProducts(response.data);
      })
      .catch((err) => {
        console.error('Error fetching product data:', err);
      });
  }, []);

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
            style={{ cursor: 'pointer' }}
            onClick={() => navigate('/dashboard')}
          >
            <Icon icon="mdi:network-pos" style={{ marginRight: 8 }} />
            รายการเมนู
          </Typography>
          <Box display="flex" justifyContent="right" flexGrow={1}>
            <Typography variant="h6" color="inherit" noWrap>
              <Icon icon="teenyicons:clock-outline" />
              &nbsp;{currentTime}
            </Typography>
          </Box>
          <Button color="inherit" onClick={() => navigate('/')}>
            Login
          </Button>
        </Toolbar>
      </AppBar>
      <Container maxWidth="lg" style={{ marginTop: '10px' }}>
        <Box
          sx={{
            my: 1,
            display: 'flex',
            justifyContent: 'center',
            flexWrap: 'wrap',
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
              <Icon icon={category.icon} style={{ marginRight: 8, marginBottom: -2 }} />
              {category.name}
            </Button>
          ))}
        </Box>
      </Container>
      <Container maxWidth="lg" style={{ marginTop: '80px' }}>
        <Grid container spacing={4}>
          {filteredProducts.map((product) => (
            <Grid item xs={12} sm={6} md={4} key={product._id}>
              <Paper elevation={3} style={{ borderRadius: 16 }}>
                <Card>
                  <CardMedia style={{ height: 250 }} image={product.image} title={product.name} />
                  <CardContent style={{ height: '180px', overflow: 'auto' }}>
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
                </Card>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>
    </>
  );
};

export default CartTemplate;
