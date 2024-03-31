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
  Button,
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
  const [user, setUser] = useState(null);

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
  }, [navigate]);

  const checkSaleRoundStatus = async () => {
    try {
      const response = await fetch('http://localhost:3333/api/salerounds/status');
      if (response.ok) {
        const data = await response.json();
        const isSaleRoundOpenLocalStorage = localStorage.getItem('isSaleRoundOpen');
        setIsSaleRound(isSaleRoundOpenLocalStorage === 'true' || data.isOpen);
      } else {
        // Handle the case where the sale round status is not available from the server
        const isSaleRoundOpenLocalStorage = localStorage.getItem('isSaleRoundOpen');
        setIsSaleRound(isSaleRoundOpenLocalStorage === 'true');
      }
    } catch (error) {
      console.error('Error checking sale round status:', error);
    }
  };

  const saveSaleRoundStatus = (isOpen) => {
    localStorage.setItem('isSaleRoundOpen', isOpen);
  };

  const fetchOrders = async () => {
    try {
      const response = await fetch('http://localhost:3333/api/saleorder/saleOrders/currentdate');
      if (!response.ok) {
        throw new Error('Failed to fetch orders');
      }
      let data = await response.json();

      // Sort orders by date in descending order
      data = data.sort((a, b) =>
        moment(b.date).tz('Asia/Bangkok').diff(moment(a.date).tz('Asia/Bangkok'))
      );

      setOrders(data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  const handleOpenSaleRound = async () => {
    try {
      const response = await fetch('http://localhost:3333/api/salerounds/open', { method: 'POST' });
      if (response.ok) {
        setIsSaleRound(true);
        setIsSaleRoundOpen(true); // เปลี่ยนค่าเมื่อเปิดร้าน
        saveSaleRoundStatus(true); // Save the sale round status to local storage
      }
    } catch (error) {
      console.error('Error opening sale round:', error);
    }
  };

  const handleCloseSaleRound = async () => {
    try {
      const currentTime = moment().format('DD/MM/YYYY, H:mm:ss');

      const result = await Swal.fire({
        title: 'คุณต้องการที่จะปิดรอบขายใช่หรือไม่?',
        text: ` ของรอบขายในเวลาใช่หรือไม่คือ ${currentTime}`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'ใช่',
        cancelButtonText: 'ไม่',
        reverseButtons: true,
      });

      if (result.isConfirmed) {
        const response = await fetch('http://localhost:3333/api/salerounds/close', {
          method: 'POST',
        });
        if (response.ok) {
          setIsSaleRound(false);
          setIsSaleRoundOpen(false); // เปลี่ยนค่าเมื่อปิดร้าน
          saveSaleRoundStatus(false); // Save the sale round status to local storage
        } else {
          // Handle the case where the sale round is already closed
          const data = await response.json();
          if (data.error === 'Sale round is already closed') {
            setIsSaleRound(false);
            setIsSaleRoundOpen(false); // เปลี่ยนค่าเมื่อปิดร้าน
            saveSaleRoundStatus(false);
          } else {
            console.error('Error closing sale round:', data.error);
          }
        }
      }
    } catch (error) {
      console.error('Error closing sale round:', error);
    }
  };

  // เพิ่มฟังก์ชันตรวจสอบเวลาเปิด-ปิดร้าน
  const checkSaleRoundTime = () => {
    const now = moment().tz('Asia/Bangkok');
    const openTime = moment().tz('Asia/Bangkok').set({ hour: 0, minute: 0, second: 0 }); // เวลาเปิดร้าน 09:00
    const closeTime = moment().tz('Asia/Bangkok').set({ hour: 17, minute: 14, second: 0 }); // เวลาปิดร้าน 17:00

    // ตรวจสอบว่าตอนนี้อยู่ในช่วงเวลาเปิดร้านหรือไม่
    setIsSaleRoundOpen(now.isBetween(openTime, closeTime));
  };

  const isOrderFromToday = (dateString) => {
    const orderDate = moment(dateString).tz('Asia/Bangkok').startOf('day');
    const today = moment().tz('Asia/Bangkok').startOf('day');
    return orderDate.isSame(today, 'day');
  };

  const filteredOrders = showTodayOnly
    ? orders.filter((order) => isOrderFromToday(order.date))
    : orders;

  const formatCurrency = (value) =>
    new Intl.NumberFormat('th-TH', {
      style: 'currency',
      currency: 'THB',
      minimumFractionDigits: 2,
    }).format(value);

  const totalAmount = filteredOrders.reduce((acc, order) => acc + order.total, 0);

  return (
    <Container>
      <Box sx={{ width: '100%', overflow: 'hidden' }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={4}>
          <Typography variant="h4" sx={{ mb: 5 }}>
            <StyledDiv>{isSaleRoundOpen ? 'รอบขายเปิดอยู่' : 'รอบขายปิดแล้ว'}</StyledDiv>
          </Typography>
          <Box sx={{ '& button': { m: 1 } }}>
            <Button
              variant="contained"
              color="success"
              onClick={handleOpenSaleRound}
              disabled={isSaleRound || !isSaleRoundOpen} // ปุ่มจะถูก disable ถ้าเปิดร้านอยู่แล้ว หรือไม่ได้อยู่ในช่วงเวลาเปิดร้าน
            >
              <StyledDiv>เปิดรอบขาย</StyledDiv>
            </Button>
            <Button
              variant="contained"
              color="error"
              onClick={handleCloseSaleRound}
              disabled={!isSaleRound}
            >
              <StyledDiv>ปิดรอบขาย</StyledDiv>
            </Button>
            {user && user.role === 'เจ้าของร้าน' && (
              <Button
                variant="contained"
                sx={{ backgroundColor: '#4caf50', '&:hover': { backgroundColor: '#357a38' } }}
                onClick={() => navigate('/open-order')}
              >
                <StyledDiv>ระยะเวลาการเปิด-ร้าน</StyledDiv>
              </Button>
            )}
          </Box>
        </Stack>
        {isSaleRound && (
          <Paper sx={{ mt: 3 }}>
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    {/* <TableCell>เลขออเดอร์</TableCell> */}
                    <TableCell>ชื่อผู้ทำรายการ</TableCell>
                    <TableCell align="right">สถานะ</TableCell>
                    <TableCell align="right">วันที่และเวลา</TableCell>
                    <TableCell align="right">การชำระเงิน</TableCell>
                    <TableCell align="right">ราคารวม</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredOrders.map((order) => (
                    <TableRow key={order._id}>
                      {/* <TableCell>{order.orderNumber}</TableCell> */}
                      <TableCell>{order.user}</TableCell>
                      <TableCell align="right">
                        <StatusBadge status={order.status} />
                      </TableCell>
                      <TableCell align="right">
                        {moment(order.date).tz('Asia/Bangkok').format('DD/MM/YYYY, H:mm:ss')}
                      </TableCell>
                      <TableCell align="right">{order.paymentMethod}</TableCell>
                      <TableCell align="right">{formatCurrency(order.total)}</TableCell>{' '}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
              <Box
                sx={{
                  p: 2,
                  backgroundColor: 'success.main',
                  color: 'white',
                  borderRadius: '4px',
                }}
              >
                <Typography variant="h5" sx={{ fontWeight: 'bold' }} align="right">
                  <StyledDiv>ยอดรวมทั้งหมด: {formatCurrency(totalAmount)}</StyledDiv>
                </Typography>
              </Box>
            </Box>
          </Paper>
        )}
      </Box>
    </Container>
  );
}

export default RealTimeOrderPage;
