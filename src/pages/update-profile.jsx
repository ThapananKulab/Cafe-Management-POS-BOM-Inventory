import axios from 'axios';
import Swal from 'sweetalert2';
import { Icon } from '@iconify/react';
import { Helmet } from 'react-helmet-async';
import { Link, useNavigate } from 'react-router-dom';
import React, { useRef, useState, useEffect } from 'react';

import { Box, Card, Grid, Button, TextField, Container, Typography } from '@mui/material';

const UpdateUserPage = () => {
  const [updateP_id, setUpdateP_id] = useState('');
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [role, setRole] = useState('');
  const [image, setCurrentImage] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const fileInputRef = useRef(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(
          'https://cafe-management-pos-bom-inventory-api.vercel.app/api/authen',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const result = await response.json();
        if (result.status === 'ok') {
          const userData = result.decoded.user;
          setUpdateP_id(userData.id || '');
          setFirstname(userData.firstname || '');
          setLastname(userData.lastname || '');
          setEmail(userData.email || '');
          setPhone(userData.phone || '');
          setAddress(userData.address || '');
          setRole(userData.role || '');
          setCurrentImage(userData.image ? userData.image.url : null);
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

    fetchUserData();
  }, [navigate]);

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      setCurrentImage(URL.createObjectURL(file));
      console.log(e.target.files); // Here's the change
    }
  };

  const handleUpdateUser = async () => {
    try {
      const formData = new FormData();
      formData.append('updateP_id', updateP_id);
      formData.append('firstname', firstname);
      formData.append('lastname', lastname);
      formData.append('email', email);
      formData.append('phone', phone);
      formData.append('address', address);
      formData.append('role', role);
      if (selectedImage) {
        formData.append('image', selectedImage);
      }
      const token = localStorage.getItem('token');
      const response = await axios.post(
        'https://cafe-management-pos-bom-inventory-api.vercel.app/api/employees/update-profile',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(response.data);
      Swal.fire({
        icon: 'success',
        title: 'สำเร็จ',
        text: 'อัปเดตสำเร็จ',
      });
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <Box
      sx={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      {' '}
      <Container maxWidth="sm">
        <Card
          sx={{
            p: 5,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: 1,
          }}
        >
          <Typography variant="h4" component="h1" gutterBottom>
            แก้ไขโปรไฟล์
          </Typography>
          <Grid item xs={12}>
            <Box mt={2} textAlign="center">
              {image && (
                <img
                  src={image}
                  alt="Current"
                  style={{
                    width: '100px', // กำหนดขนาดกว้าง
                    height: '100px', // กำหนดขนาดสูงให้เท่ากับกว้างเพื่อให้เป็นวงกลม
                    borderRadius: '50%', // ทำให้ภาพเป็นรูปวงกลม
                    objectFit: 'cover',
                    border: '2px solid #ddd',
                    padding: '5px',
                    backgroundColor: '#fff',
                    display: 'block',
                    marginLeft: 'auto',
                    marginRight: 'auto',
                  }}
                />
              )}
              <input
                ref={fileInputRef}
                type="file"
                style={{ display: 'none' }}
                onChange={handleImageChange}
              />
              <Button
                variant="outlined"
                component="span"
                onClick={handleButtonClick}
                style={{ display: 'block', margin: '10px auto 0' }}
              >
                Upload
              </Button>
            </Box>
          </Grid>

          <Box mt={3}>{}</Box>
          <Grid container spacing={2} justify="center">
            <Grid item xs={12} style={{ display: 'none' }}>
              <TextField
                fullWidth
                label="User ID"
                value={updateP_id}
                onChange={(e) => setUpdateP_id(e.target.value)}
                variant="outlined"
                disabled
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="ตำแหน่ง"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                variant="outlined"
                disabled
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="ชื่อ"
                value={firstname}
                onChange={(e) => setFirstname(e.target.value)}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="นามสกุล"
                value={lastname}
                onChange={(e) => setLastname(e.target.value)}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="เบอร์โทรศัพท์"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="ที่อยู่"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12}>
              <Box marginTop={3} display="flex" justifyContent="space-between" gap={2}>
                <Link to="/dashboard" style={{ textDecoration: 'none' }}>
                  <Button
                    size="large"
                    variant="outlined"
                    color="primary"
                    sx={{ width: 'fit-content', flexGrow: 1, ml: 1, color: 'black' }}
                  >
                    <Icon icon="icon-park-solid:back" /> กลับ
                  </Button>
                </Link>
                <Button
                  size="large"
                  variant="contained"
                  color="warning"
                  sx={{ width: 'fit-content', flexGrow: 1, ml: 1, color: 'white' }}
                  onClick={handleUpdateUser}
                >
                  แก้ไขโปรไฟล์
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Card>
      </Container>
      <Helmet>
        <title>แก้ไขโปรไฟล์</title>
      </Helmet>
    </Box>
  );
};

export default UpdateUserPage;
