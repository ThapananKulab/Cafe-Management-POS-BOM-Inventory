import axios from 'axios';
import Swal from 'sweetalert2';
import { Icon } from '@iconify/react';
import styled from 'styled-components';
import { differenceInDays } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';

import {
  Grid,
  Paper,
  Table,
  Stack,
  Button,
  TableRow,
  Container,
  TableBody,
  TableCell,
  TableHead,
  TextField,
  Typography,
  TableContainer,
} from '@mui/material';

import Iconify from 'src/components/iconify';

export default function UserPage() {
  const StyledDiv = styled.div`
    font-family: 'Prompt', sans-serif;
  `;
  const navigate = useNavigate();
  // const style = {
  //   position: 'absolute',
  //   top: '50%',
  //   left: '50%',
  //   transform: 'translate(-50%, -50%)',
  //   width: 400,
  //   bgcolor: 'background.paper', // สามารถเปลี่ยนเป็นสีที่ต้องการ เช่น 'white', '#f7f7f7'
  //   borderRadius: '16px', // ทำให้มุมโค้งมน
  //   border: 'none', // ถ้าต้องการลบขอบด้านนอกออก หรือปรับเป็น '1px solid #e0e0e0' เพื่อดูเรียบร้อย
  //   boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', // ปรับค่าเงาให้ดูนุ่มนวลขึ้น
  //   p: 4,
  // };

  // const categories = [
  //   { value: 'cool', label: 'เย็น' },
  //   { value: 'hot', label: 'ร้อน' },
  //   { value: 'mix', label: 'ปั่น' },
  //   // เพิ่มประเภทสินค้าตามที่ต้องการ
  // ];

  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('https://cafe-project-server11.onrender.com/api/users');
        setUsers(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchUsers();
  }, []);

  const confirmDelete = (userId) => {
    Swal.fire({
      title: 'คุณแน่ใจไหม?',
      text: 'คุณจะไม่สามารถกู้คืนข้อมูลนี้ได้!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'ใช่, ลบเลย!',
      cancelButtonText: 'ยกเลิก',
      reverseButtons: true,
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`https://cafe-project-server11.onrender.com/api/users/${userId}`); // Ensure this URL matches your actual API endpoint
          Swal.fire('Deleted!', 'ผู้ใช้ถูกลบเรียบร้อยแล้ว.', 'success');
          setUsers((prevUsers) => prevUsers.filter((user) => user._id !== userId));
        } catch (error) {
          console.error('There was an error deleting the user:', error);
          Swal.fire('Error!', 'ไม่สามารถลบผู้ใช้ได้.', 'error');
        }
      }
    });
  };

  const editUser = (userId) => {
    navigate(`/edit-user/${userId}`);
  };

  const filteredUsers = users.filter(
    (user) =>
      user.username.toLowerCase().includes(search.toLowerCase()) ||
      user.firstname.toLowerCase().includes(search.toLowerCase()) ||
      user.lastname.toLowerCase().includes(search.toLowerCase())
  );

  const formatDateAndCalculateDays = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const formattedDate = new Intl.DateTimeFormat('th-TH', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      timeZone: 'Asia/Bangkok',
    }).format(date);

    const daysDifference = differenceInDays(now, date);

    return `${formattedDate} (${daysDifference} วันที่ผ่านมา)`;
  };

  return (
    <div>
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4">
            <StyledDiv>สินค้า</StyledDiv>
          </Typography>
          <StyledDiv>
            <Button
              variant="contained"
              color="inherit"
              startIcon={<Iconify icon="eva:plus-fill" />}
              onClick={() => navigate('/add-user')}
            >
              <StyledDiv>เพิ่มพนักงาน </StyledDiv>
            </Button>
          </StyledDiv>
        </Stack>

        <TextField
          label="ค้นหาผู้ใช้งาน เช่น สมประสงค์"
          variant="outlined"
          size="small" // ทำให้ TextField มีขนาดเล็กลง
          margin="normal"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{ maxWidth: '50%' }}
        />

        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 1000 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>ลำดับ</TableCell>
                    <TableCell>ID</TableCell>
                    <TableCell>รูปภาพ</TableCell>
                    <TableCell>บัญชีผู้ใช้</TableCell>
                    <TableCell>ชือ-นามสกุล</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>สถานะ</TableCell>
                    <TableCell>เบอร์โทรศัพท์</TableCell>
                    <TableCell>จัดการ</TableCell>
                    <TableCell>อยู่ในระบบนาน</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredUsers.length > 0 ? (
                    filteredUsers.map((user, index) => (
                      <TableRow
                        key={user._id}
                        sx={{
                          '&:nth-of-type(odd)': {
                            backgroundColor: 'rgba(0, 0, 0, 0.02)',
                          },
                          '&:nth-of-type(even)': {
                            backgroundColor: 'rgba(0, 0, 0, 0.04)',
                          },
                        }}
                      >
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>{user._id}</TableCell>
                        <TableCell>
                          <img
                            src={`https://cafe-project-server11.onrender.com/images-user/${user.image}`}
                            alt={user.username}
                          />
                        </TableCell>
                        <TableCell>{user.username}</TableCell>
                        <TableCell>
                          {user.firstname} {user.lastname}
                        </TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>{user.role}</TableCell>
                        <TableCell>{user.phone}</TableCell>
                        <TableCell>{formatDateAndCalculateDays(user.created)}</TableCell>
                        <TableCell>
                          {/* ตรวจสอบว่า user.role ไม่ใช่ 'เจ้าของร้าน' ถ้าใช่ไม่แสดงไอคอน */}
                          {user.role !== 'เจ้าของร้าน' && (
                            <>
                              <Icon
                                icon="mingcute:edit-line"
                                width="2em"
                                height="2em"
                                onClick={() => editUser(user._id)} // Updated this line
                              />
                              <Icon
                                icon="mingcute:delete-fill"
                                width="2em"
                                height="2em"
                                onClick={() => confirmDelete(user._id)}
                              />
                            </>
                          )}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={10} align="center">
                        <Typography variant="subtitle1" gutterBottom>
                          <StyledDiv>ไม่พบผู้ใช้</StyledDiv>
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        </Grid>
      </Container>
    </div>
  );
}
