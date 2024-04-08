import axios from 'axios';
import Swal from 'sweetalert2';
import QRCode from 'react-qr-code';
import { Icon } from '@iconify/react';
import styled1 from 'styled-components';
import { Helmet } from 'react-helmet-async';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';

import {
  Box,
  List,
  Grid,
  Card,
  Paper,
  Badge,
  Modal,
  Radio,
  Button,
  AppBar,
  Divider,
  Toolbar,
  Snackbar,
  ListItem,
  CardMedia,
  Container,
  TextField,
  Pagination,
  RadioGroup,
  IconButton,
  Typography,
  CardContent,
  CardActions,
  ListItemText,
  FormControlLabel,
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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [openAddSnackbar, setOpenAddSnackbar] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('ทั้งหมด');
  const [user, setUser] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('เงินสด');
  const [receivedAmount, setReceivedAmount] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [ingredientsAvailable, setIngredientsAvailable] = useState(true);
  const [unavailableIngredients, setUnavailableIngredients] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen1, setIsModalOpen1] = useState(false);
  const [recipes, setRecipes] = useState([]);
  const [inventoryItems, setInventoryItems] = useState([]); // เพิ่ม state สำหรับเก็บ inventory items

  useEffect(() => {
    // ดึงข้อมูล inventory items เมื่อคอมโพเนนต์โหลดเสร็จ
    const fetchInventoryItems = async () => {
      try {
        const response = await axios.get('http://localhost:3333/api/inventoryitems/all');
        setInventoryItems(response.data); // เซ็ตข้อมูล inventory items ใน state
      } catch (error) {
        console.error('Failed to fetch inventory items:', error);
      }
    };

    fetchInventoryItems();
  }, []);

  useEffect(() => {
    console.log('Recipes:', recipes);
  }, [recipes]);

  useEffect(() => {
    if (isModalOpen1 && selectedProduct) {
      fetchRecipes(selectedProduct._id); // Pass the menu item's ID
    }
  }, [isModalOpen1, selectedProduct]);

  const fetchRecipes = async (menuId) => {
    try {
      if (menuId) {
        const response = await axios.get(`http://localhost:3333/api/menus/menu/${menuId}`);
        setRecipes(response.data.recipe);
      }
    } catch (error) {
      console.error('Failed to fetch recipes:', error);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      toast.success('ข้อความที่ต้องการแสดง', {
        position: toast.POSITION.TOP_LEFT,
        autoClose: 1000,
      });
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const handlePaymentMethodChange = (event) => {
    setPaymentMethod(event.target.value);
  };
  const handleReceivedAmountChange = (event) => {
    setReceivedAmount(parseFloat(event.target.value));
  };

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };
  // const handleBackToPage1 = () => {
  //   setCurrentPage(1);
  // };

  const handleNextPage = () => {
    setCurrentPage(2);
  };

  const calculateChange = () => {
    if (Number.isNaN(receivedAmount)) {
      return 0;
    }
    const change = receivedAmount - totalPrice;
    return change >= 0 ? change : 0; // ถ้าเงินทอนน้อยกว่า 0 ให้แสดงเป็น 0
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('https://test-api-01.azurewebsites.net/api/authen', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const result = await response.json();
        if (result.status === 'ok') {
          setUser(result.decoded.user);
        } else {
          localStorage.removeItem('token');
          Swal.fire({
            icon: 'error',
            title: 'กรุณา Login ก่อน',
            text: result.message,
          });
          navigate('/');
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };
    fetchData();
  }, [navigate]);

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

    // ตรวจสอบว่ามีวัตถุดิบเพียงพอสำหรับการเพิ่มสินค้าหรือไม่
    const existingCartItem = cartItems.find(
      (item) => item._id === productToAdd._id && item.sweetLevel === sweetLevel
    );
    const quantityToAdd = existingCartItem ? existingCartItem.quantity + 1 : 1;

    axios
      .post('http://localhost:3333/api/menus/checkIngredients', {
        id: productToAdd._id,
        quantityToAdd,
      })
      .then((response) => {
        console.log('API Response:', response.data);
        if (response.data.success) {
          // Ingredients are available, proceed with adding the item to the cart
          const updatedCartItems = cartItems.map((cartItem) => {
            if (cartItem._id === productToAdd._id && cartItem.sweetLevel === sweetLevel) {
              productExists = true;
              return { ...cartItem, quantity: cartItem.quantity + 1 };
            }
            return cartItem;
          });

          if (!productExists) {
            newCartItems = [...cartItems, { ...productToAdd, quantity: 1, sweetLevel }];
          } else {
            newCartItems = [...updatedCartItems];
          }

          setCartItems(newCartItems);
          setIngredientsAvailable(true); // Set ingredientsAvailable to true
          setUnavailableIngredients([]); // Reset unavailableIngredients
          toast.success(`${productToAdd.name} added to cart`);
        } else {
          const { unavailableIngredients: serverUnavailableIngredients } = response.data;
          const errorMessage = serverUnavailableIngredients.reduce((message, ingredient) => {
            const additionalRequired = Math.max(
              0,
              ingredient.quantityRequired - ingredient.quantityInStock
            );
            return `${message}\n- ${
              ingredient.ingredientName || 'Unnamed Ingredient'
            } (Required: ${additionalRequired}, In Stock: ${ingredient.quantityInStock})`;
          }, 'วัตถุดิบไม่พร้อมใช้งาน:');

          console.log('Error Message:', errorMessage);

          Swal.mixin({
            icon: 'error',
            title: 'วัตถุดิบไม่พร้อมใช้งาน',
            html: errorMessage,
            confirmButtonText: 'ตกลง',
          }).fire();
        }
      })
      .catch((error) => {
        console.error('Error:', error);
        setUnavailableIngredients([]);

        let fullErrorMessage = 'เกิดข้อผิดพลาดในการตรวจสอบวัตถุดิบ';

        console.log('Error object:', error);

        if (error.response && error.response.data) {
          console.log('Response data:', error.response.data);

          const errorMessageFromResponse = error.response.data.message;
          const unavailableIngredientsFromResponse =
            error.response.data.unavailableIngredients || [];

          console.log('errorMessageFromResponse:', errorMessageFromResponse);
          console.log('unavailableIngredientsFromResponse:', unavailableIngredientsFromResponse);

          if (unavailableIngredientsFromResponse.length > 0) {
            fullErrorMessage = unavailableIngredientsFromResponse.reduce(
              (message, ingredient) =>
                `${message}<br>- ${ingredient.ingredientName} (Required: ${ingredient.quantityRequired}, In Stock: ${ingredient.quantityInStock})`,
              ``
            );
          } else {
            fullErrorMessage = errorMessageFromResponse || fullErrorMessage;
          }
        } else {
          console.log('No response data available');
          fullErrorMessage = 'เกิดข้อผิดพลาดในการเชื่อมต่อกับเซิร์ฟเวอร์';
        }

        console.log('Error Message:', fullErrorMessage);
        Swal.mixin({
          icon: 'error',
          title: 'วัตถุดิบไม่พร้อมใช้งาน',
          html: fullErrorMessage,
          confirmButtonText: 'ตกลง',
        }).fire();
      });
  };
  const calculateTotalPrice = (items) =>
    items.reduce((total, item) => total + item.price * item.quantity, 0);

  const handleRemoveItem = (itemId) => {
    const updatedCart = cartItems.filter((item) => item._id !== itemId);
    setCartItems(updatedCart);
    setTotalPrice(calculateTotalPrice(updatedCart));
    toast.error('ลบออกจากตะกร้าเรียบร้อย');
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
    navigate('/order');
  };

  const endpoint = 'http://localhost:3333/api/saleorder/saleOrders';

  const handleSubmitOrder = async () => {
    try {
      const change = calculateChange();
      const receivedAmountNumber = parseFloat(receivedAmount); // แปลงค่ารับเงินให้อยู่ในรูปแบบตัวเลข

      if (change < 0) {
        toast.error('จำนวนเงินทอนไม่เพียงพอ');
        return;
      }

      if (receivedAmountNumber < totalPrice) {
        toast.error('จำนวนเงินที่รับน้อยกว่าจำนวนเงินที่ต้องจ่าย');
        return;
      }
      if (cartItems.length === 0) {
        toast.error('ไม่มีสินค้าในตะกร้า');
        return;
      }

      if (totalPrice <= 0) {
        toast.error('กรุณาเพิ่มสินค้าลงในตะกร้าก่อน');
        return;
      }

      // ตรวจสอบว่าเงินทอนเป็นค่าว่างหรือไม่
      if (paymentMethod === 'เงินสด' && receivedAmount === '') {
        toast.error('กรุณากรอกจำนวนเงินที่รับ');
        return;
      }

      const userfullname = `${user.firstname} ${user.lastname}`;

      const orderData = {
        user: userfullname,
        paymentMethod,
        total: totalPrice,
        orderNumber: '1',
        items: cartItems.map((item) => ({
          menuItem: item._id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
        })),
        change,
      };

      setIsModalOpen(false);

      const response = await axios.post(endpoint, orderData);
      console.log('Order response:', response.data);
      Swal.fire({
        title: 'ยืนยัน Order',
        text: 'กำลังเตรียมเมนู',
        imageUrl: 'https://media.tenor.com/r_Gf5d2leQQAAAAi/cooking.gif',
        imageWidth: 250,
        imageHeight: 250,
        imageAlt: 'Custom image',
      });

      setTimeout(() => {
        window.location.reload();
      }, 2000);

      localStorage.removeItem('cartItems');
    } catch (error) {
      console.error('Order submission failed:', error);
      toast.error('การส่งคำสั่งของล้มเหลว กรุณาลองใหม่อีกครั้ง');
    }
  };
  const handleOpenModal1 = (product) => {
    setSelectedProduct(product);
    setIsModalOpen1(true);
    fetchRecipes(product._id); // Pass the menu item's ID
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
              <Paper
                elevation={3}
                style={{ borderRadius: 16, cursor: 'pointer' }}
                onClick={() => handleAddToCart(product, product.sweetLevel)}
              >
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
                    <IconButton
                      size="medium"
                      color="secondary"
                      onClick={() => handleOpenModal1(product)}
                      style={{ minWidth: 'auto', padding: '6px 12px' }}
                    >
                      <Icon icon="lets-icons:paper-duotone" />
                    </IconButton>

                    {ingredientsAvailable ? (
                      <IconButton
                        size="medium"
                        color="primary"
                        onClick={() => handleAddToCart(product, product.sweetLevel)}
                        style={{ minWidth: 'auto', padding: '6px 12px' }}
                      >
                        <Icon icon="solar:cart-4-bold" style={{ fontSize: '1.5rem' }} />
                      </IconButton>
                    ) : (
                      <Typography variant="body1" color="error">
                        <StyledDiv>วัตถุดิบไม่เพียงพอ:</StyledDiv>
                        <ul>
                          {unavailableIngredients.map((ingredient) => (
                            <li key={ingredient.name}>
                              {ingredient.name} (ต้องการ {ingredient.quantityRequired}, มีอยู่{' '}
                              {ingredient.quantityInStock})
                            </li>
                          ))}
                        </ul>
                      </Typography>
                    )}
                  </CardActions>
                </Card>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>
      {/* Cart Modal */}
      <Modal
        open={isModalOpen1}
        onClose={() => setIsModalOpen1(false)}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflowY: 'scroll',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: 'background.paper',
            border: '2px solid #000',
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography variant="h6" sx={{ mb: '20px' }}>
            <StyledDiv>{selectedProduct && selectedProduct.name}</StyledDiv>
          </Typography>
          {selectedProduct && (
            <StyledDiv>
              <Box>
                <Typography variant="body1" sx={{ mb: 1 }}>
                  <StyledDiv>ประเภท: {selectedProduct.type}</StyledDiv>
                </Typography>
                <Typography variant="body1" sx={{ mb: 1 }}>
                  <StyledDiv>ระดับความหวาน: {selectedProduct.sweetLevel}</StyledDiv>
                </Typography>
                <Typography variant="body1" sx={{ mb: 1 }}>
                  <StyledDiv>ราคา: {selectedProduct.price} ฿</StyledDiv>
                </Typography>
                {/* <Typography variant="body1" sx={{ fontWeight: 'bold', mb: 1 }}>
                Description: {selectedProduct.description}
              </Typography> */}
                <Typography variant="body1" sx={{ mb: 1 }}>
                  <StyledDiv>สูตร:</StyledDiv>
                </Typography>
                <ul>
                  <li>
                    <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                      <StyledDiv>{selectedProduct.recipe.name}</StyledDiv>
                    </Typography>
                    <ul>
                      {selectedProduct.recipe.ingredients.map((ingredient) => (
                        <li key={ingredient._id}>
                          <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                            {`${
                              inventoryItems.find((item) => item._id === ingredient.inventoryItemId)
                                ?.name || 'Unnamed Ingredient'
                            }`}
                          </Typography>
                          {` ปริมาณ: ${ingredient.quantity} กรัม `}
                        </li>
                      ))}
                    </ul>
                  </li>
                </ul>
              </Box>
            </StyledDiv>
          )}
        </Box>
      </Modal>

      <Modal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflowY: 'scroll', // เพิ่ม overflowY เป็น scroll เพื่อให้มีการเลื่อนเนื้อหาเมื่อมีเนื้อหามากเกินไป
        }}
      >
        <Box sx={modalStyle}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            <StyledDiv>รายการเมนู</StyledDiv>
          </Typography>
          {currentPage === 1 && (
            <>
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
              <Pagination
                count={2}
                page={currentPage}
                onChange={handlePageChange}
                style={{ marginBottom: '10px' }}
              />
            </>
          )}
          {currentPage === 2 && (
            <>
              {/* Radio group for payment method */}
              <RadioGroup
                aria-label="payment-method"
                name="payment-method"
                value={paymentMethod}
                onChange={handlePaymentMethodChange}
                row
              >
                <FormControlLabel
                  value="เงินสด"
                  control={<Radio />}
                  label={
                    <>
                      เงินสด
                      <Icon icon="ri:cash-fill" width={24} height={24} />
                    </>
                  }
                  labelPlacement="end"
                />
                <FormControlLabel
                  value="PromptPay"
                  control={<Radio />}
                  label={
                    <>
                      PromptPay
                      <Icon icon="material-symbols:qr-code" width={24} height={24} />
                    </>
                  }
                  labelPlacement="end"
                />
              </RadioGroup>

              {/* Show received amount field only when payment method is 'เงินสด' */}
              {paymentMethod === 'เงินสด' && (
                <>
                  <Typography
                    variant="h4"
                    component="span"
                    style={{
                      color: 'green',
                      fontWeight: 'bold',
                      display: 'block',
                      textAlign: 'center',
                      marginBottom: '10px',
                    }}
                  >
                    ฿ {totalPrice}
                  </Typography>
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  >
                    <TextField
                      id="received-amount"
                      label="จำนวนเงินที่รับ (บาท)"
                      type="number"
                      value={paymentMethod === 'PromptPay' ? totalPrice : receivedAmount}
                      onChange={handleReceivedAmountChange}
                    />
                  </Box>

                  {/* Display change amount */}
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      marginBottom: '10px', // เพิ่มระยะห่างด้านล่างเพื่อความเป็นระเบียบ
                    }}
                  >
                    <Typography
                      variant="h6"
                      style={{
                        fontWeight: 'bold',
                        color: calculateChange() <= 0 ? 'red' : 'inherit',
                      }}
                    >
                      เงินทอน: {calculateChange()} บาท
                    </Typography>
                  </Box>
                </>
              )}

              {/* Show PromptPay details only when payment method is 'PromptPay' */}
              {paymentMethod === 'PromptPay' && (
                <>
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  >
                    <Typography variant="h6">เลขบัญชี PromptPay: </Typography>
                    <QRCode value={totalPrice.toString()} />
                  </Box>

                  {/* Enable the Submit button when PromptPay is selected */}
                </>
              )}

              {/* Pagination for going back to previous page */}
              <Pagination
                count={2}
                page={currentPage}
                onChange={handlePageChange}
                style={{ marginBottom: '10px' }}
              />
            </>
          )}

          {currentPage === 1 && (
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
              onClick={handleNextPage}
            >
              Next
            </Button>
          )}
          {currentPage === 2 && (
            <Button
              variant="contained"
              disabled={calculateChange() < 0}
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
              Submit
            </Button>
          )}
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
      />
      <ToastContainer position="top-left" className="toast-container" />
      {/* <Snackbar
        open={openAddSnackbar}
        autoHideDuration={1000}
        onClose={(event, reason) => {
          if (reason === 'clickaway') {
            return; // Keeps the Snackbar open if the reason is a clickaway
          }
          setOpenAddSnackbar(false);
        }}
      >
        <Alert severity="success" onClose={() => setOpenAddSnackbar(false)}>
          {addMessage}
        </Alert>
      </Snackbar>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={1000}
        onClose={(event, reason) => {
          if (reason === 'clickaway') {
            return; // Keeps the Snackbar open if the reason is a clickaway
          }
          setOpenSnackbar(false);
        }}
      >
        <Alert severity="success" onClose={() => setOpenSnackbar(false)}>
          ลบออกจากตะกร้าเรียบร้อย
        </Alert>
      </Snackbar> */}
    </>
  );
};

export default CartTemplate;
