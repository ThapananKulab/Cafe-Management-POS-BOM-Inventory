import Swal from 'sweetalert2';
import PropTypes from 'prop-types';
import moment from 'moment-timezone';
import React, { useState, useEffect } from 'react';

import {
  Box,
  Paper,
  Table,
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
  const [isSaleRound, setIsSaleRound] = useState(false);
  const [orders, setOrders] = useState([]);
  const [showTodayOnly, setShowTodayOnly] = useState(false);
  const [isSaleRoundOpen, setIsSaleRoundOpen] = useState(false); // เพิ่ม state เพื่อตรวจสอบว่าอยู่ในช่วงเวลาเปิดร้านหรือไม่

  useEffect(() => {
    checkSaleRoundStatus();
    fetchOrders();
    checkSaleRoundTime(); // เรียกฟังก์ชันตรวจสอบเวลาเปิด-ปิดร้าน
  }, []);

  useEffect(() => {
    const intervalId = setInterval(() => {
      checkSaleRoundStatus();
      fetchOrders();
      checkSaleRoundTime(); // เรียกฟังก์ชันตรวจสอบเวลาเปิด-ปิดร้าน
    }, 1500); // 5000 มิลลิวินาที = 5 วินาที

    return () => clearInterval(intervalId); // ควรล้าง Interval เมื่อ Component ถูก Unmount เพื่อป้องกัน Memory Leak
  }, []);

  useEffect(() => {
    // When sale round status changes, decide whether to show only today's orders
    setShowTodayOnly(!isSaleRound);
  }, [isSaleRound]);

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
    const openTime = moment().tz('Asia/Bangkok').set({ hour: 7, minute: 0, second: 0 }); // เวลาเปิดร้าน 09:00
    const closeTime = moment().tz('Asia/Bangkok').set({ hour: 24, minute: 14, second: 0 }); // เวลาปิดร้าน 17:00

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
      <Typography variant="h4" sx={{ mb: 5 }}>
        {isSaleRoundOpen ? 'รอบขายเปิดอยู่' : 'รอบขายปิดแล้ว'}
      </Typography>
      <Box sx={{ '& button': { m: 1 } }}>
        <Button
          variant="contained"
          color="success"
          onClick={handleOpenSaleRound}
          disabled={isSaleRound || !isSaleRoundOpen} // ปุ่มจะถูก disable ถ้าเปิดร้านอยู่แล้ว หรือไม่ได้อยู่ในช่วงเวลาเปิดร้าน
        >
          เปิดรอบขาย
        </Button>
        <Button
          variant="contained"
          color="error"
          onClick={handleCloseSaleRound}
          disabled={!isSaleRound}
        >
          ปิดรอบขาย
        </Button>
        <Button
          variant="contained"
          sx={{ backgroundColor: '#4caf50', '&:hover': { backgroundColor: '#357a38' } }} // Adjust hover color as needed
          disabled={!isSaleRoundOpen} // ปุ่มจะถูก disable ถ้าไม่ได้อยู่ในช่วงเวลาเปิดร้าน
        >
          ระยะเวลาการเปิด-ร้าน
        </Button>
      </Box>
      {isSaleRound && (
        <Paper sx={{ mt: 3 }}>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>Order Number</TableCell>
                  <TableCell align="right">Date and Time</TableCell>
                  <TableCell align="right">Total</TableCell>
                  <TableCell align="right">Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredOrders.map((order) => (
                  <TableRow key={order._id}>
                    <TableCell>{order.orderNumber}</TableCell>
                    <TableCell align="right">
                      {moment(order.date).tz('Asia/Bangkok').format('DD/MM/YYYY, H:mm:ss')}
                    </TableCell>
                    <TableCell align="right">{formatCurrency(order.total)}</TableCell>{' '}
                    {/* ใช้งาน formatCurrency ที่นี่ */}
                    <TableCell align="right">
                      <StatusBadge status={order.status} />
                    </TableCell>
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
                ยอดรวมทั้งหมด: {formatCurrency(totalAmount)}
              </Typography>
            </Box>
          </Box>
        </Paper>
      )}
    </Container>
  );
}

export default RealTimeOrderPage;
