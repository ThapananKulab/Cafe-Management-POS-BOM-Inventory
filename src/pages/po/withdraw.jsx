import axios from 'axios';
import React, { useState, useEffect } from 'react';

import {
  Table,
  Button,
  TableRow,
  TableBody,
  TableCell,
  TableHead,
  Typography,
  TableContainer,
} from '@mui/material';

const PendingReceipts = () => {
  const [pendingReceipts, setPendingReceipts] = useState([]);

  useEffect(() => {
    const fetchPendingReceipts = async () => {
      try {
        const response = await axios.get(
          'https://test-api-01.azurewebsites.net/api/purchaseitem/pending'
        );
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

      const received = new Date(); // สร้างข้อมูลเวลาปัจจุบัน

      await axios.post('http://localhost:3333/api/purchaseitem/add-to-q', {
        purchaseReceiptId,
        selectedItemIds: [itemId],
        status: 'withdrawn',
        received: received.toISOString(),
      });

      console.log('Item withdrawn successfully');
    } catch (error) {
      console.error('Error withdrawing items:', error);
    }
  };

  return (
    <div>
      <Typography variant="h6" style={{ marginBottom: '1rem' }}>
        โกดังร้าน
      </Typography>
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
    </div>
  );
};

export default PendingReceipts;
