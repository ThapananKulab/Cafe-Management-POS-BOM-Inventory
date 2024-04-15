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
  Select,
  MenuItem,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
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

  useEffect(() => {
    const fetchDailySales = async () => {
      try {
        const response = await axios.get(
          'https://test-api-01.azurewebsites.net/api/salerounds/statuses'
        );
        if (response.data && response.data.saleRounds) {
          const sortedSaleRounds = response.data.saleRounds.sort(
            (a, b) => moment(b.openedAt).valueOf() - moment(a.openedAt).valueOf()
          );
          setSaleRounds(sortedSaleRounds);
        }
      } catch (error) {
        console.error('Error fetching sale rounds:', error);
      }
    };

    fetchDailySales();
  }, []);

  return (
    <Container>
      <Box sx={{ width: '100%', overflow: 'hidden' }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4">
            <StyledDiv>รอบขายทั้งหมด</StyledDiv>
          </Typography>
        </Stack>
        <Stack direction="row" spacing={2} justifyContent="center" marginBottom={4}>
          <Paper>
            <Select
              onChange={(event) => navigate(event.target.value)}
              defaultValue="/open-order"
              inputProps={{ 'aria-label': 'select' }}
            >
              <MenuItem value="/report/daily">รายงานยอดขาย 7 วันย้อนหลัง</MenuItem>
              <MenuItem value="/report/cancelbill">รายงานการยกเลิกบิล</MenuItem>
              <MenuItem value="/report/salemenu">ประวัติการขายสินค้า</MenuItem>
              <MenuItem value="/report/payment">รายงานการขายจำแนกตามประเภทการชำระเงิน</MenuItem>
              <MenuItem value="/report/cost">รายชื่อวัตถุดิบราคาต้นทุนสูงสุด</MenuItem>
              <MenuItem value="/report/popular-menu">ยอดขายที่ขายดีสุดตามเวลา</MenuItem>
              <MenuItem value="/open-order">ประวัติการปิด-เปิดร้าน</MenuItem>
            </Select>
          </Paper>
        </Stack>
        <TableContainer component={Paper}>
          <Table aria-label="sale rounds table">
            <TableHead>
              <TableRow>
                <TableCell>สถานะปิด/เปิดร้าน</TableCell>
                <TableCell align="right">เวลาเปิดร้าน</TableCell>
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
