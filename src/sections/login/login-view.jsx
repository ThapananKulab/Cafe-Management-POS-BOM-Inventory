import Swal from 'sweetalert2';
import { jwtDecode } from 'jwt-decode';
import styled from 'styled-components';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import LoadingButton from '@mui/lab/LoadingButton';
import { alpha, useTheme } from '@mui/material/styles';
import InputAdornment from '@mui/material/InputAdornment';

import { useRouter } from 'src/routes/hooks';

import { bgGradient } from 'src/theme/css';

import Iconify from 'src/components/iconify';

export default function LoginView() {
  const navigate = useNavigate();
  const StyledDiv = styled.div`
    font-family: 'Prompt', sans-serif;
  `;
  const theme = useTheme();
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleClick = async (event) => {
    event.preventDefault();

    try {
      // const response = await fetch('http://localhost:3333/api/login', {
      const response = await fetch('https://test-api-01.azurewebsites.net/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorResponse = await response.json();
        throw new Error(errorResponse.message || 'Network response was not ok');
      }

      const result = await response.json();

      if (result.message === 'Success') {
        localStorage.setItem('token', result.token);

        const decodedToken = jwtDecode(result.token);
        if (decodedToken.user.role === 'เจ้าของร้าน') {
          router.push('/dashboard');
        } else {
          router.push('/sale/pos');
        }
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Username หรือ Password <br> ไม่ถูกต้อง',
          text: result.message,
        });
      }
    } catch (error) {
      console.error('Network Error:', error);
      Swal.fire({
        icon: 'error',
        title: 'Network Error',
        text:
          error.message || 'There was an issue connecting to the server. Please try again later.',
      });
    }
  };

  const handleNavigate = () => {
    navigate('/menus');
  };

  const renderForm = (
    <form>
      <Stack spacing={3}>
        <TextField
          name="username"
          label="ชื่อบัญชีผู้ใช้"
          value={formData.username}
          onChange={handleChange}
        />
        <TextField
          name="password"
          label="รหัสผ่าน"
          type={showPassword ? 'text' : 'password'}
          value={formData.password}
          onChange={handleChange}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                  <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Stack>

      <Box marginTop={3}>
        <LoadingButton
          fullWidth
          size="large"
          type="submit"
          variant="contained"
          color="inherit"
          onClick={handleClick}
        >
          <StyledDiv>เข้าสู่ระบบ</StyledDiv>
        </LoadingButton>
      </Box>
    </form>
  );

  return (
    <Box
      sx={{
        ...bgGradient({
          color: alpha(theme.palette.background.default, 0.9),
          imgUrl: '/assets/background/overlay_4.jpg',
        }),
        height: 1,
      }}
    >
      <Stack alignItems="center" justifyContent="center" sx={{ height: 1 }}>
        <Card
          sx={{
            p: 5,
            width: 1,
            maxWidth: 420,
          }}
        >
          <Box mb={4}>
            <Typography variant="h4" component="div" textAlign="center">
              <StyledDiv>เข้าสู่ระบบ</StyledDiv>
            </Typography>
          </Box>
          {renderForm}
        </Card>
        <Box mt={2} textAlign="center">
          <Typography variant="body2" style={{ cursor: 'pointer' }} onClick={handleNavigate}>
            <Link>
              <StyledDiv>ดูเมนู</StyledDiv>
            </Link>
          </Typography>
        </Box>
      </Stack>
    </Box>
  );
}
