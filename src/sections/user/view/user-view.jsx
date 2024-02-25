import axios from 'axios';
import Swal from 'sweetalert2';
import { Icon } from '@iconify/react';
import styled from 'styled-components';
import { differenceInDays } from 'date-fns';
import React, { useState, useEffect } from 'react';

import {
  Box,
  Grid,
  Paper,
  Table,
  Stack,
  Modal,
  Button,
  MenuItem,
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
  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper', // สามารถเปลี่ยนเป็นสีที่ต้องการ เช่น 'white', '#f7f7f7'
    borderRadius: '16px', // ทำให้มุมโค้งมน
    border: 'none', // ถ้าต้องการลบขอบด้านนอกออก หรือปรับเป็น '1px solid #e0e0e0' เพื่อดูเรียบร้อย
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', // ปรับค่าเงาให้ดูนุ่มนวลขึ้น
    p: 4,
  };

  const categories = [
    { value: 'cool', label: 'เย็น' },
    { value: 'hot', label: 'ร้อน' },
    { value: 'mix', label: 'ปั่น' },
    // เพิ่มประเภทสินค้าตามที่ต้องการ
  ];

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState(''); // สร้าง state สำหรับจัดการคำค้นหา

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

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log('Form submitted');
    handleClose();
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
              onClick={handleOpen}
            >
              <StyledDiv>เพิ่มสินค้า </StyledDiv>
            </Button>
            <Modal
              open={open}
              onClose={handleClose}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
            >
              <Box
                sx={style}
                component="form"
                onSubmit={handleSubmit}
                noValidate
                autoComplete="off"
              >
                <Typography id="modal-modal-title" variant="h6" component="h2">
                  <StyledDiv>เพิ่มสินค้า</StyledDiv>
                </Typography>
                <TextField fullWidth margin="normal" label="ชื่อสินค้า" variant="outlined" />
                <TextField
                  fullWidth
                  margin="normal"
                  label="ราคา"
                  type="number"
                  variant="outlined"
                />
                <TextField
                  select // ใช้ prop select เพื่อให้เป็น dropdown
                  fullWidth
                  margin="normal"
                  label="ประเภท"
                  variant="outlined"
                  required
                >
                  {categories.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </TextField>
                <Button
                  variant="outlined" // แก้ไขจาก "contained" เป็น "outlined"
                  component="label"
                  sx={{ mt: 2, mr: 2 }} // เพิ่มระยะห่างด้านขวา (mr)
                >
                  <StyledDiv style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Icon icon="mdi:file-image" style={{ fontSize: 'inherit' }} />
                    อัปโหลด
                  </StyledDiv>
                  <input type="file" hidden /> {/* เพิ่ม required ที่นี่ */}
                </Button>
                {/* ใช้ Box เพื่อเว้นบรรทัด */}
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                  <Button type="submit" variant="contained" color="primary" sx={{ width: '50%' }}>
                    <StyledDiv>บันทึก</StyledDiv>
                  </Button>
                </Box>{' '}
                {/* ตรวจสอบให้แน่ใจว่ามีการปิดแท็ก <Box> ที่นี่ */}
              </Box>
            </Modal>
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
                          {/* Placeholder for user image */}
                          <img src={user.imageUrl || 'placeholder.jpg'} alt={user.username} />
                        </TableCell>
                        <TableCell>{user.username}</TableCell>
                        <TableCell>
                          {user.firstname} {user.lastname}
                        </TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>{user.role}</TableCell>
                        <TableCell>{user.phone}</TableCell>
                        <TableCell> {formatDateAndCalculateDays(user.created)}</TableCell>
                        <TableCell>
                          <a
                            href="#"
                            style={{ marginRight: '8px', display: 'inline-block' }}
                            onClick={(e) => {
                              e.preventDefault();
                            }}
                          >
                            {}
                          </a>
                          {}
                          <Icon
                            icon="mingcute:edit-line"
                            width="2em"
                            height="2em"
                            onClick={() => confirmDelete(user._id)}
                          />
                          <a
                            href="#"
                            style={{ marginRight: '8px', display: 'inline-block' }}
                            onClick={(e) => {
                              e.preventDefault();
                              // Implement edit functionality or redirect here
                            }}
                          >
                            {/* Use an appropriate icon component or element for editing */}
                          </a>
                          {/* Use the user._id from the map function */}
                          <Icon
                            icon="mingcute:delete-fill"
                            width="2em"
                            height="2em"
                            onClick={() => confirmDelete(user._id)}
                          />
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} align="center">
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
