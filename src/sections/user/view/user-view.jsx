import axios from 'axios';
import Swal from 'sweetalert2';
import { th } from 'date-fns/locale';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import { format, formatDistanceToNow } from 'date-fns';

import {
  Grid,
  Card,
  Stack,
  Dialog,
  Button,
  Container,
  CardMedia,
  TextField,
  Typography,
  CardActions,
  CardContent,
  DialogTitle,
  DialogActions,
  DialogContent,
  CardActionArea,
} from '@mui/material';

import Iconify from 'src/components/iconify';

export default function UserPage() {
  const StyledDiv = styled.div`
    font-family: 'Prompt', sans-serif;
  `; // Commented out unused StyledDiv
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [userDetails, setUserDetails] = useState(null); // State to hold the selected user's details
  const [isModalOpen, setIsModalOpen] = useState(false); // State to control modal visibility

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(
          'https://cafe-management-pos-bom-inventory-api.vercel.app/api/users'
        );
        setUsers(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchUsers();
  }, []);

  const handleCardClick = (user) => {
    setUserDetails(user);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const confirmDelete = (userId) => {
    Swal.fire({
      title: 'คุณแน่ใจไหม?',
      text: 'คุณจะไม่สามารถกู้คืนข้อมูลนี้ได้!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'ใช่',
      cancelButtonText: 'ยกเลิก',
      reverseButtons: true,
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(
            `https://cafe-management-pos-bom-inventory-api.vercel.app/api/users/${userId}`
          );
          Swal.fire('ลบสำเร็จ!', 'ผู้ใช้ถูกลบเรียบร้อยแล้ว.', 'success');
          setUsers((prevUsers) => prevUsers.filter((user) => user._id !== userId));
        } catch (error) {
          console.error('There was an error deleting the user:', error);
          Swal.fire('Error!', 'ไม่สามารถลบผู้ใช้ได้.', 'error');
        }
      }
    });
  };

  const filteredUsers = users.filter(
    (user) =>
      user.username.toLowerCase().includes(search.toLowerCase()) ||
      user.firstname.toLowerCase().includes(search.toLowerCase()) ||
      user.lastname.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Container>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <Typography variant="h4">
          <StyledDiv>พนักงาน</StyledDiv>
        </Typography>
        <Button
          variant="contained"
          color="inherit"
          startIcon={<Iconify icon="eva:plus-fill" />}
          onClick={() => navigate('/add-user')}
        >
          <StyledDiv>เพิ่มพนักงาน</StyledDiv>
        </Button>
      </Stack>

      <TextField
        label="ค้นหาผู้ใช้งาน เช่น สมประสงค์"
        variant="outlined"
        margin="normal"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        sx={{
          marginBottom: '50px', // Adds a bottom margin to create spacing after the TextField
        }}
      />

      <Grid container spacing={3}>
        {filteredUsers.map((user, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card onClick={() => handleCardClick(user)} style={{ cursor: 'pointer' }}>
              <CardActionArea>
                <CardMedia component="img" height="140" image={user.image} alt={user.username} />
                <CardContent>
                  <Typography gutterBottom variant="h5" component="div">
                    {user.firstname} {user.lastname}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    บัญชีผู้ใช้: {user.username}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Email: {user.email}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    เบอร์โทรศัพท์: {user.phone}
                  </Typography>

                  <Typography
                    variant="body2"
                    style={{
                      color: '#000000', // ตั้งค่าสีเป็นสีดำ
                      fontWeight: 'bold', // คงความหนาของตัวอักษร
                      fontSize: '0.8rem', // ปรับขนาดตัวอักษรให้ใหญ่ขึ้น
                      // textShadow: '1px 1px 4px rgba(0,0,0,0.5)', // คงเอฟเฟกต์เงาไว้
                    }}
                  >
                    <StyledDiv>ตำแหน่ง: {user.role}</StyledDiv>
                  </Typography>
                </CardContent>
              </CardActionArea>
              <CardActions>
                {user.role !== 'เจ้าของร้าน' && (
                  <>
                    <Button
                      size="small"
                      color="primary"
                      onClick={(event) => {
                        event.stopPropagation();
                        navigate(`/edit-user/${user._id}`);
                      }}
                    >
                      <Iconify icon="eva:edit-fill" width={24} height={24} />
                    </Button>
                    <Button
                      size="small"
                      color="primary"
                      onClick={(event) => {
                        event.stopPropagation();
                        handleCardClick(user);
                      }}
                      style={{ margin: '0 auto' }} // Centers the button within CardActions
                    >
                      <Iconify icon="ic:outline-description" width={24} height={24} />
                    </Button>

                    <Button
                      size="small"
                      style={{ color: 'red' }}
                      onClick={(event) => {
                        event.stopPropagation();
                        confirmDelete(user._id);
                      }}
                    >
                      <Iconify icon="eva:trash-2-outline" width={24} height={24} />
                    </Button>
                  </>
                )}

                {user.role === 'เจ้าของร้าน' && (
                  <Button
                    size="small"
                    color="primary"
                    onClick={(event) => {
                      event.stopPropagation();
                      handleCardClick(user);
                    }}
                    style={{ margin: '0 auto' }} // Centers the button within CardActions
                  >
                    <Iconify icon="ic:outline-description" width={24} height={24} />
                  </Button>
                )}
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
      {/* Modal for displaying user details */}
      <Dialog open={isModalOpen} onClose={closeModal}>
        <DialogTitle>ข้อมูลผู้ใช้งาน</DialogTitle>
        <DialogContent>
          {userDetails && (
            <>
              <Typography gutterBottom>
                ชื่อ: {userDetails.firstname} {userDetails.lastname}
              </Typography>
              <Typography gutterBottom>Email: {userDetails.email}</Typography>
              <Typography gutterBottom>เบอร์โทรศัพท์: {userDetails.phone}</Typography>
              <Typography gutterBottom>ที่อยู่: {userDetails.address}</Typography>
              <Typography gutterBottom>ตำแหน่ง: {userDetails.role}</Typography>

              <Typography gutterBottom>
                วันที่เข้าร่วม:{' '}
                {format(new Date(userDetails.created), 'dd MMMM yyyy', { locale: th })}
              </Typography>

              <Typography gutterBottom>
                อยู่ในระบบมา: {formatDistanceToNow(new Date(userDetails.created))} แล้ว
              </Typography>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={closeModal}>ปิด</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
