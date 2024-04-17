import axios from 'axios';
import 'moment/locale/th';
import moment from 'moment-timezone';
import styled from 'styled-components';
import React, { useState, useEffect } from 'react';

import {
  Badge,
  Table,
  Stack,
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
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <Typography variant="h4" style={{ marginBottom: '1rem' }}>
          <StyledDiv>รายการเบิก</StyledDiv>
        </Typography>
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
                        <TableCell>{item.item.name}</TableCell>
                        <TableCell>{item.item.realquantity}</TableCell>
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
