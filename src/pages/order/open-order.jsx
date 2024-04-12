import axios from 'axios';
import moment from 'moment-timezone';
import { Icon } from '@iconify/react';
import styled1 from 'styled-components';
import { useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';

import {
  Box,
  Paper,
  Table,
  Stack,
  Button,
  TableRow,
  TableBody,
  TableCell,
  TableHead,
  Container,
  Typography,
  TableContainer,
} from '@mui/material';

const SaleRoundsTable = () => {
  const StyledDiv = styled1.div`
    font-family: 'Prompt', sans-serif;
  `;
  const [saleRounds, setSaleRounds] = useState([]);

  const navigate = useNavigate(); // สร้าง instance ของ useNavigate

  const handleNavigateToOrders = () => {
    navigate('/order'); // ใช้ navigate ไปยัง path '/orders'
  };

  useEffect(() => {
    const fetchSaleRounds = async () => {
      try {
        const response = await axios.get(
          'https://test-api-01.azurewebsites.net/api/salerounds/statuses'
        );
        if (response.data && response.data.saleRounds) {
          // Sort sale rounds by openedAt in descending order
          const sortedSaleRounds = response.data.saleRounds.sort(
            (a, b) => moment(b.openedAt).valueOf() - moment(a.openedAt).valueOf()
          );
          setSaleRounds(sortedSaleRounds);
        }
      } catch (error) {
        console.error('Error fetching sale rounds:', error);
      }
    };

    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('https://test-api-01.azurewebsites.net/api/authen', {
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
          // setUser(result.decoded.user); // ตั้งค่า state ด้วยข้อมูลผู้ใช้
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchSaleRounds();
    fetchUserData();
  }, []);

  return (
    <Container>
      <Box sx={{ width: '100%', overflow: 'hidden' }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4">
            <StyledDiv>รอบขายทั้งหมด</StyledDiv>
          </Typography>
          <Button
            variant="contained"
            sx={{
              backgroundColor: '#696969',
              '&:hover': {
                backgroundColor: '#696969',
              },
            }}
            onClick={handleNavigateToOrders}
          >
            รายการ Order
          </Button>
        </Stack>
        <TableContainer component={Paper}>
          <Table aria-label="sale rounds table">
            <TableHead>
              <TableRow>
                {/* <TableCell>ผู้เปิดร้าน</TableCell> 
                <TableCell>ตำแหน่ง</TableCell>  */}
                <TableCell>สถานะปิด/เปิดร้าน</TableCell>
                <TableCell align="right">เวลาเปิดร้าน</TableCell> {/* แก้เป็นเวลาเปิดร้าน */}
                <TableCell align="right">เวลาปิดร้าน</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {saleRounds.map((round, index) => (
                <TableRow key={index}>
                  <TableCell component="th" scope="row">
                    {round.isOpen ? (
                      <Icon icon="mdi:user-check" color="#008000" fontSize="large" />
                    ) : (
                      <Icon icon="ci:user-close" color="#ff0000" fontSize="large" />
                    )}
                  </TableCell>
                  <TableCell align="right">
                    {round.openedAt
                      ? moment(round.openedAt).tz('Asia/Bangkok').format('DD/MM/YYYY, H:mm:ss')
                      : 'ไม่ได้เปิดรอบ'}
                  </TableCell>
                  <TableCell align="right">
                    {round.closedAt
                      ? moment(round.closedAt).tz('Asia/Bangkok').format('DD/MM/YYYY, H:mm:ss')
                      : 'ไม่ได้ปิดรอบ'}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Container>
  );
};

export default SaleRoundsTable;
