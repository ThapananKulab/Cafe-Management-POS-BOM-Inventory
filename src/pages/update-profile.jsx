import axios from 'axios';
import Swal from 'sweetalert2';
import { Icon } from '@iconify/react';
import React, { useState, useEffect } from 'react';
import { Link,useNavigate } from 'react-router-dom';

import {Box,Card,Grid,Button,TextField, Container, Typography } from '@mui/material';

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
      const confirmed = await Swal.fire({
        title: 'ยืนยันการอัปเดตข้อมูล',
        text: 'คุณแน่ใจหรือไม่ว่าต้องการอัปเดตข้อมูล?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'ใช่',
        cancelButtonText: 'ไม่',
      });
  
      if (confirmed.isConfirmed) {
        const response = await axios.post('https://cafe-project-server11.onrender.com/api/users/updateProfile', {
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
          text: 'อัปเดตสำเร็จ',
        });
      } else {
        console.log('User canceled the update.');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };
  

  return (
    <Box sx={{height: 1,display: 'flex',flexDirection: 'column',justifyContent: 'center',}}>
      <Container maxWidth="sm" style={{ margin: 'auto' }}>
      <Card
          sx={{
            p: 5,
            width: 1,
            maxWidth: 420,
          }}
        >
      <Grid item xs={3}> {/* ทำการย่อขนาดของ Grid item เป็น xs={3} */}
        <Link to="/dashboard" style={{ textDecoration: 'none' }}>
            <Button  variant="outlined" color="primary">
            <Icon icon="icon-park-solid:back" /> กลับ
            </Button>
          </Link>
        </Grid>
        <Box mt={2}>{}</Box>
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
            <TextField
              fullWidth
              label="ตำแหน่ง"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12}>
          <Box marginTop={3} display="flex" justifyContent="space-between" gap={2}>
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
    </Box>
  );
};  


export default UpdateUserPage;
