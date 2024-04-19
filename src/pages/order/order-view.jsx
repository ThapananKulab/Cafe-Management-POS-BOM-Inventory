import Swal from 'sweetalert2';
import PropTypes from 'prop-types';
import moment from 'moment-timezone';
import { Icon } from '@iconify/react';
import styled1 from 'styled-components';
import ReactToPrint from 'react-to-print';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import React, { useRef, useState, useEffect } from 'react';

import {
  Box,
  Modal,
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
  IconButton,
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
  const [receiptInfo, setReceiptInfo] = useState(null);
  const componentRef = useRef();
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (status) => {
    setSearchTerm(status);
    if (status === 'All') {
      setSearchTerm('');
    }
  };

  const handleViewReceipt = (orderId) => {
    const foundOrder = orders.find((orderItem) => orderItem._id === orderId);
    if (foundOrder) {
      setReceiptInfo(foundOrder);
    }
  };

  const handleCloseReceiptModal = () => {
    setReceiptInfo(null); // เคลียร์ข้อมูลใบเสร็จที่แสดง
  };

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
  }, [navigate, setUser]);

  const handleAcceptOrder = async (orderId) => {
    try {
      const result = await Swal.fire({
        title: 'คุณต้องการที่จะรับ Order นี้หรือไม่?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'ใช่',
        cancelButtonText: 'ไม่',
      });

      if (result.isConfirmed) {
        const response = await fetch(
          `https://test-api-01.azurewebsites.net/api/saleorder/${orderId}/accept`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ orderId }),
          }
        );

        if (response.ok) {
          await deductStock(orderId);
          Swal.fire({
            icon: 'success',
            title: 'รับ Order สำเร็จ',
            showConfirmButton: false,
            timer: 1500, // Close alert after 1.5 seconds
          });
        } else {
          const data = await response.json();
          console.error('Error accepting order:', data.error);
          Swal.fire({
            icon: 'error',
            title: 'ไม่สามารถรับ Order ได้',
            text: data.error,
          });
        }
      }
    } catch (error) {
      console.error('Error accepting order:', error);
      Swal.fire({
        icon: 'error',
        title: 'เกิดข้อผิดพลาด',
        text: 'เกิดข้อผิดพลาดในการรับ Order',
      });
    }
  };

  // ฟังก์ชันสำหรับหักล้างสต็อก
  const deductStock = async (orderId) => {
    try {
      const response = await fetch(
        `https://test-api-01.azurewebsites.net/api/saleorder/${orderId}/deductStock`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        const data = await response.json();
        console.error('Error deducting stock:', data.message);
      }
    } catch (error) {
      console.error('Error deducting stock:', error);
    }
  };

  const handleCancelOrder = async (orderId) => {
    try {
      const result = await Swal.fire({
        title: 'คุณต้องการที่จะยกเลิก Order นี้หรือไม่?',
        // text: 'การดำเนินการนี้ไม่สามารถย้อนกลับได้',
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'ใช่',
        cancelButtonText: 'ไม่',
      });

      if (result.isConfirmed) {
        const response = await fetch(
          `https://test-api-01.azurewebsites.net/api/saleorder/${orderId}/cancel`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ orderId }),
          }
        );

        if (response.ok) {
          fetchOrders();
        } else {
          const data = await response.json();
          console.error('Error cancelling order:', data.error);
        }
      }
    } catch (error) {
      console.error('Error cancelling order:', error);
    }
  };

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

  // const saveSaleRoundStatus = (isOpen) => {
  //   localStorage.setItem('isSaleRoundOpen', isOpen);
  // };

  const fetchOrders = async () => {
    try {
      const response = await fetch(
        'https://test-api-01.azurewebsites.net/api/saleorder/saleOrders/currentdate'
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

  // const handleOpenSaleRound = async () => {
  //   try {
  //     const response = await fetch('https://test-api-01.azurewebsites.net/api/salerounds/open', {
  //       method: 'POST',
  //     });
  //     if (response.ok) {
  //       setIsSaleRound(true);
  //       setIsSaleRoundOpen(true); // เปลี่ยนค่าเมื่อเปิดร้าน
  //       saveSaleRoundStatus(true); // Save the sale round status to local storage
  //     }
  //   } catch (error) {
  //     console.error('Error opening sale round:', error);
  //   }
  // };

  // const handleCloseSaleRound = async () => {
  //   try {
  //     const currentTime = moment().format('DD/MM/YYYY, H:mm:ss');

  //     const result = await Swal.fire({
  //       title: 'คุณต้องการที่จะปิดรอบขายใช่หรือไม่?',
  //       text: ` ของรอบขายในเวลาใช่หรือไม่คือ ${currentTime}`,
  //       icon: 'warning',
  //       showCancelButton: true,
  //       confirmButtonText: 'ใช่',
  //       cancelButtonText: 'ไม่',
  //       reverseButtons: true,
  //     });

  //     if (result.isConfirmed) {
  //       const response = await fetch('https://test-api-01.azurewebsites.net/api/salerounds/close', {
  //         method: 'POST',
  //       });
  //       if (response.ok) {
  //         setIsSaleRound(false);
  //         setIsSaleRoundOpen(false); // เปลี่ยนค่าเมื่อปิดร้าน
  //         saveSaleRoundStatus(false); // Save the sale round status to local storage
  //       } else {
  //         // Handle the case where the sale round is already closed
  //         const data = await response.json();
  //         if (data.error === 'Sale round is already closed') {
  //           setIsSaleRound(false);
  //           setIsSaleRoundOpen(false); // เปลี่ยนค่าเมื่อปิดร้าน
  //           saveSaleRoundStatus(false);
  //         } else {
  //           console.error('Error closing sale round:', data.error);
  //         }
  //       }
  //     }
  //   } catch (error) {
  //     console.error('Error closing sale round:', error);
  //   }
  // };

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
    : orders;

  const filteredOrdersByStatus = searchTerm
    ? filteredOrders.filter((order) => order.status === searchTerm)
    : filteredOrders;

  const formatCurrency = (value) =>
    new Intl.NumberFormat('th-TH', {
      style: 'currency',
      currency: 'THB',
      minimumFractionDigits: 2,
    }).format(value);

  const totalAmount = filteredOrders
    .filter((order) => order.status === 'Completed')
    .reduce((acc, order) => acc + order.total, 0);

  return (
    <>
      <Helmet>
        <title>ออเดอร์ประจำวัน</title>
      </Helmet>
      <Container>
        <Box sx={{ width: '100%', overflow: 'hidden' }}>
          <Stack direction="row" alignItems="center" justifyContent="space-between" mb={4}>
            <Typography variant="h4" sx={{ mb: 5 }}>
              {/* <StyledDiv>{isSaleRoundOpen ? 'รอบขายเปิดอยู่' : 'รอบขายปิดแล้ว'}</StyledDiv> */}
              <StyledDiv>{isSaleRoundOpen ? 'ออเดอร์ประจำวัน' : 'ออเดอร์ประจำวัน'}</StyledDiv>
            </Typography>
            <Box sx={{ '& button': { m: 1 } }}>
              {/* <Button
              variant="contained"
              color="success"
              onClick={handleOpenSaleRound}
              disabled={isSaleRound || !isSaleRoundOpen}
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
            {user && user.role === 'เจ้าของร้าน' && (
              <Button
                variant="contained"
                sx={{ backgroundColor: '#1976d2', '&:hover': { backgroundColor: '#115293' } }}
                onClick={() => navigate('/order-all')}
              >
                <StyledDiv>Order ทั้งหมด</StyledDiv>
              </Button>
            )} */}
            </Box>
          </Stack>
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
            <Button
              variant="contained"
              style={{ backgroundColor: '#78909C', color: '#fff' }} // Show All
              onClick={() => handleSearch('All')}
              disabled={searchTerm === 'All'}
            >
              <StyledDiv>ทั้งหมด</StyledDiv>
            </Button>
            <Button
              variant="contained"
              style={{ backgroundColor: '#66BB6A', color: '#fff' }} // Completed
              onClick={() => handleSearch('Completed')}
              disabled={searchTerm === 'Completed'}
            >
              <StyledDiv>เสร็จสิ้น</StyledDiv>
            </Button>
            <Button
              variant="contained"
              style={{ backgroundColor: '#FFA726', color: '#fff' }} // Pending
              onClick={() => handleSearch('Pending')}
              disabled={searchTerm === 'Pending'}
            >
              <StyledDiv>กำลังรอ</StyledDiv>
            </Button>
            <Button
              variant="contained"
              style={{ backgroundColor: '#EF5350', color: '#fff' }} // Cancelled
              onClick={() => handleSearch('Cancelled')}
              disabled={searchTerm === 'Cancelled'}
            >
              <StyledDiv>ยกเลิก</StyledDiv>
            </Button>
          </Box>

          <Paper sx={{ mt: 3 }}>
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    {/* <TableCell>เลขออเดอร์</TableCell> */}
                    <TableCell>ชื่อผู้ทำรายการ</TableCell>
                    <TableCell align="right">รายการเมนู</TableCell>
                    <TableCell align="right">สถานะ</TableCell>
                    <TableCell align="right">วันที่และเวลา</TableCell>
                    <TableCell align="right">การชำระเงิน</TableCell>
                    <TableCell align="right">ราคารวม</TableCell>
                    <TableCell align="right">เงินที่รับมา</TableCell>
                    {filteredOrders.some((order) => order.status === 'Pending') && (
                      <TableCell align="center">จัดการ</TableCell>
                    )}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredOrdersByStatus.map((order) => (
                    <TableRow key={order._id}>
                      <TableCell>{order.user}</TableCell>
                      <TableCell align="right">
                        <ul style={{ listStyleType: 'none', paddingInlineStart: 0 }}>
                          {order.items.map((item, index) => (
                            <li key={index}>
                              {`${item.quantity} x ${item.name} - ${formatCurrency(item.price)}`}
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
                      <TableCell align="right">
                        {(order.status === 'Completed' || order.status === 'Pending') && (
                          <Button variant="outlined" onClick={() => handleViewReceipt(order._id)}>
                            ดูใบเสร็จ
                          </Button>
                        )}
                      </TableCell>

                      {/* <TableCell align="right">
                        {order.total + (order.change || 0) === order.total
                          ? 'รับมาพอดี'
                          : formatCurrency(order.total + (order.change || 0))}
                      </TableCell> */}
                      <TableCell align="right">
                        {order.status === 'Pending' && (
                          <Box>
                            <IconButton onClick={() => handleAcceptOrder(order._id)}>
                              <Icon icon="fa:check" color="#4caf50" width={24} height={24} />
                            </IconButton>
                            <IconButton onClick={() => handleCancelOrder(order._id)}>
                              <Icon icon="mdi:cancel-bold" color="#f44336" width={30} height={30} />
                            </IconButton>
                          </Box>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            <Modal
              open={
                !!receiptInfo &&
                (receiptInfo.status === 'Completed' || receiptInfo.status === 'Pending')
              }
              onClose={handleCloseReceiptModal}
            >
              <StyledDiv>
                <Box
                  sx={{
                    position: 'fixed',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: 400,
                    bgcolor: 'background.paper',
                    p: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                  }}
                >
                  {receiptInfo &&
                    (receiptInfo.status === 'Completed' || receiptInfo.status === 'Pending') && (
                      <div style={{ width: '100%' }}>
                        <div ref={componentRef}>
                          <h2 style={{ textAlign: 'center', margin: '0' }}>ใบเสร็จ</h2>
                          <p>เลขที่ออเดอร์: {receiptInfo._id}</p>
                          <p>
                            วันที่:{' '}
                            {moment(receiptInfo.date)
                              .tz('Asia/Bangkok')
                              .format('DD/MM/YYYY, H:mm:ss')}
                          </p>
                          <p>รายการสินค้า:</p>
                          <ul style={{ listStyleType: 'none', paddingInlineStart: 0 }}>
                            {receiptInfo.items.map((item, index) => (
                              <li key={index} style={{ textAlign: 'left' }}>
                                {item.quantity} x {item.name}
                                <span style={{ float: 'right' }}>
                                  {formatCurrency(item.price * item.quantity)}
                                </span>
                              </li>
                            ))}
                          </ul>

                          <p>วิธีการชำระเงิน: {receiptInfo.paymentMethod}</p>

                          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <p>
                              เงินที่รับมา:
                              {formatCurrency(receiptInfo.total + (receiptInfo.change || 0))}
                            </p>
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <p>เงินทอน: {formatCurrency(receiptInfo.change || 0)}</p>
                          </div>
                          <hr style={{ marginLeft: '8px', flex: '1' }} />
                          <div
                            style={{
                              display: 'flex',
                              justifyContent: 'flex-end',
                              alignItems: 'center',
                            }}
                          >
                            <p
                              style={{ fontWeight: 'bold', fontSize: '1.2rem', marginRight: '8px' }}
                            >
                              ยอดรวม:
                            </p>
                            <p style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>
                              {formatCurrency(receiptInfo.total)}
                            </p>
                          </div>
                          <hr style={{ marginLeft: '8px', flex: '1' }} />
                        </div>

                        <ReactToPrint
                          trigger={() => (
                            <Button
                              variant="contained"
                              color="primary"
                              style={{ marginLeft: 'auto', marginTop: '1rem' }}
                            >
                              <StyledDiv>พิมพ์รายการ</StyledDiv>
                            </Button>
                          )}
                          content={() => componentRef.current}
                          pageStyle={`
                            @page {
                              size: A4;
                              margin: 0;
                            }
                            @media print {
                              body {
                                margin: 1.6cm;
                              }
                            }
                          `}
                        />
                        {/* <Button
                          variant="contained"
                          onClick={handleCloseReceiptModal}
                          style={{ marginLeft: 'auto', marginTop: '1rem' }}
                        >
                          ปิด
                        </Button> */}
                      </div>
                    )}
                </Box>
              </StyledDiv>
            </Modal>

            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
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
        </Box>
      </Container>
    </>
  );
}

export default RealTimeOrderPage;
