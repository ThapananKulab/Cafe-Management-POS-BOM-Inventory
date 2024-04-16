import axios from 'axios';
import 'moment/locale/th';
import moment from 'moment-timezone';
import styled from 'styled-components';
import React, { useState, useEffect } from 'react';

import {
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

const PendingReceipts = () => {
  const [pendingReceipts, setPendingReceipts] = useState([]);
  const StyledDiv = styled.div`
    font-family: 'Prompt', sans-serif;
  `;

  useEffect(() => {
    const fetchPendingReceipts = async () => {
      try {
        const response = await axios.get('http://localhost:3333/api/purchaseitem/pending');
        setPendingReceipts(response.data);
      } catch (error) {
        console.error('Error fetching pending receipts:', error);
      }
    };

    fetchPendingReceipts();
  }, []);

  return (
    <Container>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <Typography variant="h6" style={{ marginBottom: '1rem' }}>
          <StyledDiv>รายการเบิก</StyledDiv>
        </Typography>
      </Stack>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Purchase ID</TableCell>
              <TableCell>Item id</TableCell>
              <TableCell>Item Name</TableCell>
              <TableCell>ปริมาณ</TableCell>
              <TableCell>จำนวน</TableCell>
              <TableCell>สถานะ</TableCell>
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
                        <TableCell>{item._id}</TableCell>
                        <TableCell>{item.item.name}</TableCell>
                        <TableCell>{item.item.realquantity}</TableCell>
                        <TableCell>{item.quantity}</TableCell>
                        <TableCell>
                          {moment.tz(item.received, 'Asia/Bangkok').locale('th').format('LLLL')}
                        </TableCell>
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
