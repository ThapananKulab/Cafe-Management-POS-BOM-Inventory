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
        const response = await axios.get('http://localhost:3333/api/purchaseitem/pending');
        setPendingReceipts(response.data);
      } catch (error) {
        console.error('Error fetching pending receipts:', error);
      }
    };

    fetchPendingReceipts();
  }, []);

  const handleWithdraw = async (purchaseId, itemId) => {
    try {
      console.log(`Withdraw button clicked for Purchase ID: ${purchaseId}, Item ID: ${itemId}`);
    } catch (error) {
      console.error('Error withdrawing items:', error);
    }
  };

  return (
    <div>
      <Typography variant="h6" style={{ marginBottom: '1rem' }}>
        โกดังร้าน
      </Typography>
      {pendingReceipts.map((receipt) => (
        <div key={receipt._id} style={{ marginBottom: '2rem' }}>
          <Typography variant="subtitle1" style={{ marginBottom: '0.5rem' }}>
            Purchase ID: {receipt._id}
          </Typography>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Item Name</TableCell>
                  <TableCell>Quantity</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {receipt.items.map((item) => (
                  <TableRow key={item._id}>
                    <TableCell>{item.item.name}</TableCell>
                    <TableCell>{item.quantity}</TableCell>
                    <TableCell>{item.status}</TableCell>
                    <TableCell>
                      <Button
                        variant="contained"
                        onClick={() => handleWithdraw(receipt._id, item._id)}
                      >
                        Withdraw
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      ))}
    </div>
  );
};

export default PendingReceipts;
