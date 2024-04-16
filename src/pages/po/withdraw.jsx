import axios from 'axios';
import styled from 'styled-components';
import React, { useState, useEffect } from 'react';

import {
  Stack,
  Table,
  Button,
  TableRow,
  TableBody,
  TableCell,
  TableHead,
  Container,
  Typography,
  TableContainer,
} from '@mui/material';

const PendingReceipts = () => {
  const StyledDiv = styled.div`
    font-family: 'Prompt', sans-serif;
  `;
  const [pendingReceipts, setPendingReceipts] = useState([]);

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

  const handleWithdraw = async (purchaseReceiptId, itemId) => {
    try {
      console.log(
        `Trying to withdraw item with purchaseReceiptId ${purchaseReceiptId} and itemId ${itemId}`
      );

      const received = new Date().toISOString(); // Get current time in ISO string format

      await axios.post('http://localhost:3333/api/purchaseitem/add-to-q', {
        purchaseReceiptId,
        selectedItemIds: [itemId],
        status: 'withdrawn',
        received, // Use current time as received
      });

      console.log('Item withdrawn successfully');
    } catch (error) {
      console.error('Error withdrawing items:', error);
    }
  };

  return (
    <Container>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <Typography variant="h4" style={{ marginBottom: '1rem' }}>
          <StyledDiv>โกดังร้าน</StyledDiv>
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
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {pendingReceipts.map((receipt) => {
              const purchaseId = receipt._id;
              return (
                <>
                  {receipt.items
                    .filter((item) => item.status === 'pending')
                    .map((item, index) => (
                      <TableRow key={item._id}>
                        {index === 0 && (
                          <TableCell
                            rowSpan={receipt.items.filter((it) => it.status === 'pending').length}
                          >
                            {purchaseId}
                          </TableCell>
                        )}
                        <TableCell>{item._id}</TableCell>
                        <TableCell>{item.item.name}</TableCell>
                        <TableCell>{item.item.realquantity}</TableCell>
                        <TableCell>{item.quantity}</TableCell>
                        <TableCell>{item.status}</TableCell>
                        <TableCell>
                          <Button
                            variant="contained"
                            onClick={() => handleWithdraw(purchaseId, item.item._id)}
                          >
                            เบิก
                          </Button>
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
