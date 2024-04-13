import Swal from 'sweetalert2';
import PropTypes from 'prop-types';
import moment from 'moment-timezone';
import styled1 from 'styled-components';
import { useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';

import {
  Box,
  Paper,
  Table,
  Stack,
  Select,
  MenuItem,
  TableRow,
  TableBody,
  TableCell,
  Container,
  TableHead,
  Typography,
  TableContainer,
} from '@mui/material';

function StatusBadge({ status }) {
  let bgColor;
  let text;
  const textColor = '#fff';

  switch (status) {
    case 'Pending':
      bgColor = '#FFA726';
      text = 'รอดำเนินการ';
      break;
    case 'Completed':
      bgColor = '#66BB6A';
      text = 'เสร็จสิ้น';
      break;
    case 'Cancelled':
      bgColor = '#EF5350';
      text = 'ยกเลิก';
      break;
    default:
      bgColor = '#78909C';
      text = 'ไม่ระบุ';
  }

  return (
    <Box
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100px',
        height: '25px',
        borderRadius: '12px',
        backgroundColor: bgColor,
        color: textColor,
        fontWeight: 'bold',
      }}
    >
      {text}
    </Box>
  );
}

StatusBadge.propTypes = {
  status: PropTypes.string.isRequired,
};

function RealTimeOrderPage() {
  const StyledDiv = styled1.div`
    font-family: 'Prompt', sans-serif;
  `;
  const navigate = useNavigate();
  const [isSaleRound, setIsSaleRound] = useState(false);
  const [orders, setOrders] = useState([]);
  const [showTodayOnly, setShowTodayOnly] = useState(false);
  const [isSaleRoundOpen, setIsSaleRoundOpen] = useState(false);
  const [setUser] = useState(null);
  const [searchTerm] = useState('');

  useEffect(() => {
    checkSaleRoundStatus();
    fetchOrders();
    checkSaleRoundTime();
  }, []);

  useEffect(() => {
    const intervalId = setInterval(() => {
      checkSaleRoundStatus();
      fetchOrders();
      checkSaleRoundTime();
    }, 1500);

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    setShowTodayOnly(!isSaleRound);
  }, [isSaleRound]);

  useEffect(() => {
    const fetchData = async () => {
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
  }, [navigate, setUser]); // เพิ่ม setUser เป็น dependency ของ useEffect

  // ฟังก์ชันสำหรับหักล้างสต็อก

  const checkSaleRoundStatus = async () => {
    try {
      const response = await fetch('https://test-api-01.azurewebsites.net/api/salerounds/status');
      if (response.ok) {
        const data = await response.json();
        const isSaleRoundOpenLocalStorage = localStorage.getItem('isSaleRoundOpen');
        setIsSaleRound(isSaleRoundOpenLocalStorage === 'true' || data.isOpen);
      } else {
        const isSaleRoundOpenLocalStorage = localStorage.getItem('isSaleRoundOpen');
        setIsSaleRound(isSaleRoundOpenLocalStorage === 'true');
      }
    } catch (error) {
      console.error('Error checking sale round status:', error);
    }
  };

  const fetchOrders = async () => {
    try {
      const response = await fetch(
        'https://test-api-01.azurewebsites.net/api/saleorder/saleOrders'
      );
      if (!response.ok) {
        throw new Error('Failed to fetch orders');
      }
      let data = await response.json();
      data = data.sort((a, b) =>
        moment(b.date).tz('Asia/Bangkok').diff(moment(a.date).tz('Asia/Bangkok'))
      );

      setOrders(data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  // เพิ่มฟังก์ชันตรวจสอบเวลาเปิด-ปิดร้าน
  const checkSaleRoundTime = () => {
    const now = moment().tz('Asia/Bangkok');
    const openTime = moment().tz('Asia/Bangkok').set({ hour: 0, minute: 0, second: 0 }); // เวลาเปิดร้าน 09:00
    const closeTime = moment().tz('Asia/Bangkok').set({ hour: 24, minute: 0, second: 0 }); // เวลาปิดร้าน 17:00

    setIsSaleRoundOpen(now.isBetween(openTime, closeTime));
  };

  const isOrderFromToday = (dateString) => {
    const orderDate = moment(dateString).tz('Asia/Bangkok').startOf('day');
    const today = moment().tz('Asia/Bangkok').startOf('day');
    return orderDate.isSame(today, 'day');
  };

  const filteredOrders = showTodayOnly
    ? orders.filter((order) => isOrderFromToday(order.date))
    : orders.filter((order) => {
        const searchTermLower = searchTerm.toLowerCase();
        const statusLower = order.status.toLowerCase();
        const containsSearchTerm = (keyword) => keyword.toLowerCase().includes(searchTermLower);

        if (statusLower === 'cancelled') {
          // เพิ่มเงื่อนไขนี้เพื่อกรอง order ที่มี status เป็น 'ยกเลิก' เท่านั้น
          return true;
        }

        if (
          containsSearchTerm(order.user) ||
          containsSearchTerm(order.paymentMethod) ||
          containsSearchTerm(statusLower)
        ) {
          return true;
        }

        if (
          (searchTermLower === 'completed' || searchTermLower === 'เสร็จสิ้น') &&
          statusLower === 'completed'
        ) {
          return true;
        }

        if (
          (searchTermLower.includes('รอ') || searchTermLower === 'pending') &&
          statusLower === 'pending'
        ) {
          return true;
        }

        if (searchTermLower.includes('ยก') && statusLower === 'cancelled') {
          return true;
        }

        if (
          (searchTermLower === 'เสร็จสิ้น' || searchTermLower === 'completed') &&
          statusLower === 'completed'
        ) {
          return true;
        }

        return false;
      });

  const formatCurrency = (value) =>
    new Intl.NumberFormat('th-TH', {
      style: 'currency',
      currency: 'THB',
      minimumFractionDigits: 2,
    }).format(value);

  return (
    <Container>
      <Box sx={{ width: '100%', overflow: 'hidden' }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={4}>
          <Typography variant="h4">
            <StyledDiv>{isSaleRoundOpen ? 'รายงานการยกเลิกบิล' : 'รายงานการยกเลิกบิล'}</StyledDiv>
          </Typography>
        </Stack>
        <Stack direction="row" spacing={2} justifyContent="center" marginBottom={4}>
          <Paper>
            <Select
              onChange={(event) => navigate(event.target.value)}
              defaultValue="/report/cancelbill"
              inputProps={{ 'aria-label': 'select' }}
            >
              <MenuItem value="/report/daily">รายงานยอดขาย 7 วันย้อนหลัง</MenuItem>
              <MenuItem value="/report/cancelbill">รานงานการยกเลิกบิล</MenuItem>
              <MenuItem value="/report/salemenu">ประวัติกการขายสินค้า</MenuItem>
              <MenuItem value="/report/payment">รายงานการขายจำแนกตามประเภทการชำระเงิน</MenuItem>
              <MenuItem value="/report/cost">รายชื่อวัตถุดิบราคาต้นทุนสูงสุด</MenuItem>
              <MenuItem value="/report/popular-menu">ยอดขายที่ขายดีสุดตามเวลา</MenuItem>
            </Select>
          </Paper>
        </Stack>

        {isSaleRound && (
          <Paper sx={{ mt: 3 }}>
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>ชื่อผู้ทำรายการ</TableCell>
                    <TableCell align="right">รายการเมนู</TableCell>
                    <TableCell align="right">สถานะ</TableCell>
                    <TableCell align="right">วันที่และเวลา</TableCell>
                    <TableCell align="right">การชำระเงิน</TableCell>
                    <TableCell align="right">ราคารวม</TableCell>
                    {/* <TableCell align="right">เงินที่รับมา</TableCell> */}
                    {filteredOrders.some((order) => order.status === 'Pending') && (
                      <TableCell align="center">จัดการ</TableCell>
                    )}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredOrders.map((order) => {
                    if (order.status === 'Cancelled') {
                      // เพิ่มเงื่อนไขนี้เพื่อแสดงเฉพาะ order ที่มี status เป็น 'ยกเลิก' เท่านั้น
                      return (
                        <TableRow key={order._id}>
                          <TableCell>{order.user}</TableCell>
                          <TableCell align="right">
                            <ul style={{ listStyleType: 'none', paddingInlineStart: 0 }}>
                              {order.items.map((item, index) => (
                                <li key={index}>
                                  {`${item.quantity} x ${item.name} - ${formatCurrency(
                                    item.price
                                  )}`}
                                </li>
                              ))}
                            </ul>
                          </TableCell>
                          <TableCell align="right">
                            <StatusBadge status={order.status} />
                          </TableCell>
                          <TableCell align="right">
                            {moment(order.date).tz('Asia/Bangkok').format('DD/MM/YYYY, H:mm:ss')}
                          </TableCell>
                          <TableCell align="right">{order.paymentMethod}</TableCell>
                          <TableCell align="right">{formatCurrency(order.total)}</TableCell>
                        </TableRow>
                      );
                    }
                    return null;
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        )}
      </Box>
    </Container>
  );
}

export default RealTimeOrderPage;
