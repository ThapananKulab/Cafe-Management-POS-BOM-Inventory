import axios from 'axios';
import 'moment/locale/th';
import moment from 'moment-timezone';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';

import {
  Badge,
  Table,
  Stack,
  Paper,
  Select,
  MenuItem,
  TableRow,
  TableBody,
  TableCell,
  TableHead,
  Container,
  Typography,
  TableContainer,
} from '@mui/material';

const thaiMonths = [
  'มกราคม',
  'กุมภาพันธ์',
  'มีนาคม',
  'เมษายน',
  'พฤษภาคม',
  'มิถุนายน',
  'กรกฎาคม',
  'สิงหาคม',
  'กันยายน',
  'ตุลาคม',
  'พฤศจิกายน',
  'ธันวาคม',
];

const PendingReceipts = () => {
  const [pendingReceipts, setPendingReceipts] = useState([]);
  const StyledDiv = styled.div`
    font-family: 'Prompt', sans-serif;
  `;

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          'https://test-api-01.azurewebsites.net/api/purchaseitem/pending'
        );
        setPendingReceipts(response.data);
      } catch (error) {
        console.error('Error fetching pending receipts:', error);
      }
    };

    const interval = setInterval(() => {
      fetchData();
    }, 5000);

    fetchData();

    return () => clearInterval(interval);
  }, []);

  return (
    <Container>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={4}>
        <Typography variant="h4">
          <StyledDiv>รายงานเบิกวัตถุดิบ</StyledDiv>
        </Typography>
      </Stack>
      <Stack direction="row" spacing={2} justifyContent="center" marginBottom={4}>
        <Paper>
          <Select
            onChange={(event) => navigate(event.target.value)}
            defaultValue="/purchase/withdraw-out"
            inputProps={{ 'aria-label': 'select' }}
          >
            {/* <MenuItem value="/report/daily">รายงานยอดขาย 7 วันย้อนหลัง</MenuItem> */}
            {/* <MenuItem value="/report/cancelbill">รายงานการยกเลิกบิล</MenuItem> */}
            <MenuItem value="/report/salemenu">ประวัติการขายสินค้า</MenuItem>
            <MenuItem value="/report/payment">รายงานการขายจำแนกตามประเภทการชำระเงิน</MenuItem>
            <MenuItem value="/report/cost">รายชื่อวัตถุดิบราคาต้นทุนสูงสุด</MenuItem>
            <MenuItem value="/purchase/withdraw-out">รายงานเบิกวัตถุดิบ</MenuItem>
            <MenuItem value="/purchase/report">ประวัติใบสั่งซื้อ</MenuItem>
            {/* <MenuItem value="/report/popular-menu">ยอดขายที่ขายดีสุดตามเวลา</MenuItem> */}
          </Select>
        </Paper>
      </Stack>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID ใบสั่งซื่อ</TableCell>
              {/* <TableCell>Item id</TableCell> */}
              <TableCell>ชื่อวัตถุดิบ</TableCell>
              <TableCell>ปริมาณ</TableCell>
              <TableCell>จำนวน</TableCell>
              <TableCell>สถานะ</TableCell>
              <TableCell>โดย</TableCell>
              <TableCell>วันที่และเวลาเบิก</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {pendingReceipts.map((receipt) => {
              const purchaseId = receipt._id;
              return (
                <>
                  {receipt.items
                    .filter((item) => item.status === 'withdrawn')
                    .map((item, index) => (
                      <TableRow key={item._id}>
                        {index === 0 && (
                          <TableCell
                            rowSpan={receipt.items.filter((it) => it.status === 'withdrawn').length}
                          >
                            {purchaseId}
                          </TableCell>
                        )}
                        {/* <TableCell>{item._id}</TableCell> */}
                        <TableCell>{item.item && item.item.name}</TableCell>
                        <TableCell>{item.item && item.item.realquantity}</TableCell>
                        <TableCell>{item.quantity}</TableCell>
                        <TableCell
                          style={{
                            position: 'relative',
                            paddingRight: '24px',
                            display: 'flex',
                            alignItems: 'center',
                          }}
                        >
                          <Badge color="error" variant="dot" style={{ marginRight: '4px' }} />
                          <span>{item.status.replace('withdrawn', 'เบิกแล้ว')}</span>
                        </TableCell>
                        <TableCell>{item.withdrawner}</TableCell>
                        <TableCell component="th" scope="row">
                          {moment(item.received).format(
                            `D ${thaiMonths[moment(item.received).month()]} YYYY HH:mm:ss`
                          )}
                        </TableCell>
                        {/* 
                        <TableCell>
                          {moment.tz(item.received, 'Asia/Bangkok').locale('th').format('LLLL')}
                        </TableCell> */}
                      </TableRow>
                    ))}
                </>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default PendingReceipts;
