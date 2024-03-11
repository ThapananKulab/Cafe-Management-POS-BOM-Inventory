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

export default function UpdateProfile() {
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();

  const handleEditClick = async () => {
    if (isEditing) {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:3333/api/users/updateUU', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            updateP_id: user.update_id,
            firstname: user.firstname,
            lastname: user.lastname,
            email: user.email,
            phone: user.phone,
            address: user.address,
          }),
        });
  
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
  
        const result = await response.json();
        if (result.success) {
          setIsEditing(false);
          Swal.fire({
            icon: 'success',
            title: 'บันทึกข้อมูลสำเร็จ',
            text: 'ข้อมูลของคุณได้รับการอัปเดตแล้ว',
          });
        } else {
          Swal.fire({
            icon: 'error',
            title: 'เกิดข้อผิดพลาด',
            text: result.message,
          });
        }
      } catch (error) {
        console.error('Error:', error);
      }
    } else {
      setIsEditing(true);
    }
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
  name="id"
  label="ชื่อบัญชีผู้ใช้"
  value={user ? user._id : ''}
  InputProps={{
    readOnly: true,
  }}
  disabled
/>

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
          sx={{ width: 'fit-content', flexGrow: 1, mr: 1 }}
        >
          {isEditing ? 'Cancel' : 'Edit'}
        </Button>
        <LoadingButton
          size="large"
          type="submit"
          variant="contained"
          color="warning"
          sx={{ width: 'fit-content', flexGrow: 1, ml: 1, color: 'white' }}
          disabled={!isEditing}
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
             
                <Button
                  onClick={handleBack}
                  variant="outlined"
                  color="primary"
                  sx={{
                    position: 'absolute',
                    left: 6,
                    top: 25,
                    zIndex: 10,
                    opacity: 0.9,
                    '&:hover': {
                      opacity: 1,
                    },
                  }}
                >
                  <Icon icon="mingcute:back-fill" /> กลับสู่หน้าหลัก
                </Button>


              <StyledDiv>แก้ไขโปรไฟล์</StyledDiv>
            </Typography>
          </Box>

          {renderForm}
        </Card>
      </Stack>
    </Box>
  );
}