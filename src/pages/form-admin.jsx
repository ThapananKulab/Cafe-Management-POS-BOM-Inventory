import Swal from 'sweetalert2';
import { Icon } from '@iconify/react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';

export default function LoginView() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
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
  const StyledDiv = styled.div`
    font-family: 'Prompt', sans-serif;
  `;

  const handleBack = () => {
    navigate('/dashboard'); // เปลี่ยนจาก `router.push('/dashboard');`
  };

  const renderForm = (
    <form>
      <Stack spacing={3}>
        <TextField name="username" label="ชื่อบัญชีผู้ใช้" />
        Welcome, {user.username}!
        <TextField name="username" label="ชื่อบัญชีผู้ใช้" />
        <TextField name="username" label="ชื่อบัญชีผู้ใช้" />
        <TextField name="username" label="ชื่อบัญชีผู้ใช้" />
      </Stack>

      <Box marginTop={3}>
        <LoadingButton
          fullWidth
          size="large"
          type="submit"
          variant="contained"
          color="warning"
          sx={{ color: 'white' }}
        >
          <StyledDiv>แก้ไข</StyledDiv>
        </LoadingButton>
      </Box>
    </form>
  );

  return (
    <Box
      sx={{
        height: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
      }}
    >
      <br />

      <Stack alignItems="center" sx={{ flexGrow: 1, justifyContent: 'center', marginTop: '-10vh' }}>
        <Card
          sx={{
            p: 5,
            width: 1,
            maxWidth: 420,
          }}
        >
          <Button
            onClick={handleBack}
            variant="outlined"
            color="primary"
            sx={{
              position: 'absolute',
              left: 16, // ย้ายจากขอบซ้ายเล็กน้อย เพื่อป้องกันไม่ให้ปุ่มและข้อความทับซ้อนกัน
              top: 25, // ตั้งค่าตำแหน่งด้านบนเพื่อให้ปุ่มอยู่เหนือข้อความ
              transform: 'translateY(-50%)',
              opacity: 2.8,
              '&:hover': {
                opacity: 1,
              },
            }}
          >
            <Icon icon="mingcute:back-fill" /> กลับสู่หน้าหลัก
          </Button>

          <Box>
            <Typography
              variant="h4"
              component="div"
              textAlign="center"
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'column',
              }}
            >
              <br />
              <StyledDiv>แก้ไขโปรไฟล์</StyledDiv>
            </Typography>
          </Box>

          {renderForm}
        </Card>
      </Stack>
    </Box>
  );
}
