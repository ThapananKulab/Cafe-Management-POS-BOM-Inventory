import axios from 'axios';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';

import {Box,Grid,Button,TextField, Container, Typography } from '@mui/material';

const UpdateUserPage = () => {
  const [updateP_id, setUpdateP_id] = useState('');
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [role, setRole] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('https://cafe-project-server11.onrender.com/api/authen', {
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
          const userData = result.decoded.user;
          setUpdateP_id(userData.id || '');
          setFirstname(userData.firstname || '');
          setLastname(userData.lastname || '');
          setEmail(userData.email || '');
          setPhone(userData.phone || '');
          setAddress(userData.address || '');
          setRole(userData.role || '');
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


  const handleUpdateUser = async () => {
    try {
      const response = await axios.post('http://localhost:3333/api/users/updateProfile', {
        updateP_id,
        firstname,
        lastname,
        email,
        phone,
        address,
        role,
      });
      console.log(response.data);
      Swal.fire({
        icon: 'success',
        title: 'สำเร็จ',
        text: 'การอัปเดตโปรไฟล์ผู้ใช้เสร็จสมบูรณ์',
      });
    } catch (error) {
      console.error('Error:', error);
    }
  };
  

return (
  <Box mt={5}>
  <Container maxWidth="sm" style={{ margin: 'auto' }}>
    <Typography variant="h4" component="h1" gutterBottom>
      แก้ไขโปรไฟล์
    </Typography>
    <Box mt={3}>{}</Box>
    <Grid container spacing={2} justify="center">
      <Grid item xs={12} style={{ display: 'none' }}>
        <TextField
          fullWidth
          label="User ID"
          value={updateP_id}
          onChange={(e) => setUpdateP_id(e.target.value)}
          variant="outlined"
          disabled  // ที่นี่ใช้ disabled prop เพื่อปิดการแก้ไข
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
        <TextField
          fullWidth
          label="ตำแหน่ง"
          value={role}
          onChange={(e) => setRole(e.target.value)}
          variant="outlined"
        />
      </Grid>
      <Grid item xs={12}>
  <Button
    fullWidth
    variant="contained"
    style={{ color: 'white', backgroundColor: 'orange' }} // Change 'orange' to the desired color
    onClick={handleUpdateUser}
  >
    แก้ไขโปรไฟล์
  </Button>
</Grid>

    </Grid>
  </Container>
</Box>
);
};


export default UpdateUserPage;
