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
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();

  const handleEditClick = () => {
    setIsEditing(!isEditing);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setUser({ ...user, [name]: value });
  };

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
    navigate('/dashboard');
  };

  const renderForm = (
    <form>
      <Stack spacing={3}>
        <TextField
          name="username"
          label="ชื่อบัญชีผู้ใช้"
          value={user ? user.username : ''}
          InputProps={{
            readOnly: true,
          }}
          disabled
        />
        <TextField
          name="role"
          label="ตำแหน่ง"
          value={user ? user.role : ''}
          InputProps={{
            readOnly: true,
          }}
          disabled
        />
        {/* Make other fields editable based on isEditing state */}
        <TextField
          name="firstname"
          label="ชื่อจริง"
          value={user ? user.firstname : ''}
          onChange={handleChange}
          disabled={!isEditing}
        />
        <TextField
          name="lastname"
          label="นามสกุล"
          value={user ? user.lastname : ''}
          onChange={handleChange}
          disabled={!isEditing}
        />
        <TextField
          name="phone"
          label="เบอร์โทรศัพท์"
          value={user ? user.phone : ''}
          onChange={handleChange}
          disabled={!isEditing}
        />
        <TextField
          name="address"
          label="ที่อยู่"
          value={user ? user.address : ''}
          onChange={handleChange}
          disabled={!isEditing}
        />
      </Stack>

      <Box marginTop={3} display="flex" justifyContent="space-between" gap={2}>
        <Button
          onClick={handleEditClick}
          variant="outlined"
          sx={{ width: 'fit-content', flexGrow: 1, mr: 1 }} // Ensure button adjusts to its content with some flexibility
        >
          {isEditing ? 'Cancel' : 'Edit'}
        </Button>
        <LoadingButton
          size="large"
          type="submit"
          variant="contained"
          color="warning"
          sx={{ width: 'fit-content', flexGrow: 1, ml: 1, color: 'white' }} // Match the flexibility and margin adjustments
          disabled={!isEditing} // Disable the submit button if not in editing mode
        >
          <StyledDiv>Save Changes</StyledDiv>
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
              <Card
                sx={{
                  p: 5,
                  width: 1,
                  maxWidth: 420,
                  position: 'relative', // Make sure the card is positioned relatively
                }}
              >
                <Button
                  onClick={handleBack}
                  variant="outlined"
                  color="primary"
                  sx={{
                    position: 'absolute',
                    left: 6,
                    top: 25, // Adjust if necessary for better placement
                    zIndex: 10, // Ensure the button is above all other elements in the card
                    opacity: 0.9,
                    '&:hover': {
                      opacity: 1,
                    },
                  }}
                >
                  <Icon icon="mingcute:back-fill" /> กลับสู่หน้าหลัก
                </Button>
                {/* The rest of your component */}
              </Card>

              <StyledDiv>แก้ไขโปรไฟล์</StyledDiv>
            </Typography>
          </Box>

          {renderForm}
        </Card>
      </Stack>
    </Box>
  );
}
