import axios from 'axios';
import React, { useState, useEffect } from 'react';

import {
  Table,
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
                        <TableCell>{item.status}</TableCell>
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
