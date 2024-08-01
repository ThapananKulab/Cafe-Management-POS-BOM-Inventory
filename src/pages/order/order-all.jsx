import Swal from 'sweetalert2';
import PropTypes from 'prop-types';
import moment from 'moment-timezone';
import { Icon } from '@iconify/react';
import styled1 from 'styled-components';
import ReactToPrint from 'react-to-print';
import { useNavigate } from 'react-router-dom';
import React, { useRef, useState, useEffect } from 'react';

import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
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
  TextField,
  Typography,
  IconButton,
  TableContainer,
  TablePagination,
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
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [isSaleRound, setIsSaleRound] = useState(false);
  const [orders, setOrders] = useState([]);
  const [showTodayOnly, setShowTodayOnly] = useState(false);
  const [isSaleRoundOpen, setIsSaleRoundOpen] = useState(false);
  const [setUser] = useState(null);
  const [receiptInfo, setReceiptInfo] = useState(null);
  const componentRef = useRef();
  const [searchTerm, setSearchTerm] = useState('');
  const [startDate, setStartDate] = useState(moment());
  const [endDate, setEndDate] = useState(moment());

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // const handleSearchChange = (event) => {
  //   setSearchTerm(event.target.value);
  // };

  const handleViewReceipt = (orderId) => {
    const foundOrder = orders.find((orderItem) => orderItem._id === orderId);
    if (foundOrder) {
      setReceiptInfo(foundOrder);
    }
  };
  const handleCloseReceiptModal = () => {
    setReceiptInfo(null);
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
    }, 5000);

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    setShowTodayOnly(!isSaleRound);
  }, [isSaleRound]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(
          'https://cafe-management-pos-bom-inventory-api.vercel.app/api/authen',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          }
        );
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
          `https://cafe-management-pos-bom-inventory-api.vercel.app/api/saleorder/${orderId}/accept`,
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
        } else {
          const data = await response.json();
          console.error('Error accepting order:', data.error);
        }
      }
    } catch (error) {
      console.error('Error accepting order:', error);
    }
  };

  const deductStock = async (orderId) => {
    try {
      const response = await fetch(
        `https://cafe-management-pos-bom-inventory-api.vercel.app/api/saleorder/${orderId}/deductStock`,
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
          `https://cafe-management-pos-bom-inventory-api.vercel.app/api/saleorder/${orderId}/cancel`,
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
      const response = await fetch(
        'https://cafe-management-pos-bom-inventory-api.vercel.app/api/salerounds/status'
      );
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
        'https://cafe-management-pos-bom-inventory-api.vercel.app/api/saleorder/saleOrders'
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

  const checkSaleRoundTime = () => {
    const now = moment().tz('Asia/Bangkok');
    const openTime = moment().tz('Asia/Bangkok').set({ hour: 0, minute: 0, second: 0 });
    const closeTime = moment().tz('Asia/Bangkok').set({ hour: 24, minute: 0, second: 0 });

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
        const orderDate = moment(order.date).tz('Asia/Bangkok');
        return orderDate.isBetween(startDate, endDate, 'day', '[]'); // '[]' includes both start and end dates
      });

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
    .filter((order) => order.status === 'Completed') // Filter only completed orders
    .reduce((acc, order) => acc + order.total, 0);

  const handleStartDateChange = (date) => {
    setStartDate(date);
  };

  const handleEndDateChange = (date) => {
    setEndDate(date);
  };

  return (
    <Container>
      <Box sx={{ width: '100%', overflow: 'hidden' }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={4}>
          <Typography variant="h4" sx={{ mb: 5 }}>
            <StyledDiv>{isSaleRoundOpen ? 'ออเดอร์ทั้งหมด' : 'ออเดอร์ทั้งหมด'}</StyledDiv>
          </Typography>
          <Box sx={{ '& button': { m: 1 } }}>
            <Button
              variant="contained"
              sx={{ backgroundColor: '#333333', '&:hover': { backgroundColor: '#555555' } }}
              onClick={() => navigate('/order')}
            >
              <StyledDiv>ออเดอร์ประจำวัน</StyledDiv>
            </Button>
          </Box>
        </Stack>
        <Box sx={{ '& button': { m: 1 }, display: 'flex', justifyContent: 'center', gap: '1rem' }}>
          <Button
            variant="contained"
            // style={{ backgroundColor: '#2196F3', color: '#fff' }} // Show All
            style={{ backgroundColor: '#78909C', color: '#fff' }} // Show All
            onClick={() => setSearchTerm('')}
            disabled={!searchTerm}
          >
            <StyledDiv>ทั้งหมด</StyledDiv>
          </Button>

          <Button
            variant="contained"
            style={{ backgroundColor: '#66BB6A', color: '#fff' }} // Completed
            onClick={() => setSearchTerm('Completed')}
            disabled={searchTerm === 'Completed'}
          >
            <StyledDiv>เสร็จสิ้น</StyledDiv>
          </Button>
          <Button
            variant="contained"
            style={{ backgroundColor: '#FFA726', color: '#fff' }} // Pending
            onClick={() => setSearchTerm('Pending')}
            disabled={searchTerm === 'Pending'}
          >
            <StyledDiv>รอดำเนินการ</StyledDiv>
          </Button>
          <Button
            variant="contained"
            style={{ backgroundColor: '#EF5350', color: '#fff' }} // Cancelled
            onClick={() => setSearchTerm('Cancelled')}
            disabled={searchTerm === 'Cancelled'}
          >
            <StyledDiv>ยกเลิก</StyledDiv>
          </Button>
        </Box>
        <br />
        <LocalizationProvider dateAdapter={AdapterMoment}>
          <DesktopDatePicker
            label="วันที่เริ่มต้น"
            value={startDate}
            onChange={handleStartDateChange}
            renderInput={(params) => <TextField {...params} />}
          />
          &nbsp;
          <DesktopDatePicker
            label="วันที่สิ้นสุด"
            value={endDate}
            onChange={handleEndDateChange}
            renderInput={(params) => <TextField {...params} />}
          />
        </LocalizationProvider>

        {isSaleRound && (
          <Paper sx={{ mt: 3 }}>
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 650 }} stickyHeader aria-label="sticky table">
                <TableHead>
                  <TableRow>
                    <TableCell>เลขออเดอร์</TableCell>
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
                  {filteredOrdersByStatus
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((order) => (
                      <TableRow key={order._id}>
                        <TableCell>{order._id}</TableCell>
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

                        <TableCell align="right">
                          {order.status === 'Pending' && (
                            <Box>
                              <IconButton onClick={() => handleAcceptOrder(order._id)}>
                                <Icon icon="fa:check" color="#4caf50" width={24} height={24} />
                              </IconButton>
                              <IconButton onClick={() => handleCancelOrder(order._id)}>
                                <Icon
                                  icon="mdi:cancel-bold"
                                  color="#f44336"
                                  width={30}
                                  height={30}
                                />
                              </IconButton>
                            </Box>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={filteredOrders.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />

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
                      </div>
                    )}
                </Box>
              </StyledDiv>
            </Modal>
          </Paper>
        )}
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
      </Box>
    </Container>
  );
}

export default RealTimeOrderPage;
