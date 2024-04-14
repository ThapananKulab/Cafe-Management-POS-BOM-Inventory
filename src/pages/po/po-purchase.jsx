import axios from 'axios';
import React, { useState, useEffect } from 'react';

import {
  Box,
  Stack,
  Modal,
  Paper,
  Table,
  Button,
  TableRow,
  TableCell,
  Container,
  TableHead,
  TableBody,
  TableContainer,
} from '@mui/material';

const PurchaseReceiptPage = () => {
  const [purchaseReceipts, setPurchaseReceipts] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState(null);

  useEffect(() => {
    const fetchPurchaseReceipts = async () => {
      try {
        const response = await axios.get(
          'https://test-api-01.azurewebsites.net/api/purchaseitem/all'
        );
        setPurchaseReceipts(response.data);
      } catch (error) {
        console.error('Error fetching purchase receipts:', error);
      }
    };
    fetchPurchaseReceipts();
  }, []);

  const handleOpenModal = (receipt) => {
    setSelectedReceipt(receipt);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setSelectedReceipt(null);
    setOpenModal(false);
  };

  return (
    <div>
      <Container>
        <Box sx={{ width: '100%', overflow: 'hidden' }}>
          <Stack direction="row" alignItems="center" justifyContent="space-between" mb={4}>
            <h1>Purchase Receipts</h1>
          </Stack>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Receipt ID</TableCell>
                  <TableCell>Date Received</TableCell>
                  <TableCell>Total</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {purchaseReceipts.map((receipt) => (
                  <TableRow key={receipt._id}>
                    <TableCell>{receipt._id}</TableCell>
                    <TableCell>{new Date(receipt.receivedAt).toLocaleDateString()}</TableCell>
                    <TableCell>{receipt.total}</TableCell>
                    <TableCell>
                      <Button onClick={() => handleOpenModal(receipt)}>View Details</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Container>

      <Modal open={openModal} onClose={handleCloseModal}>
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '8px',
          }}
        >
          <h2>Receipt Details</h2>
          <p>Receipt ID: {selectedReceipt && selectedReceipt._id}</p>
          <p>
            Date Received:{' '}
            {selectedReceipt && new Date(selectedReceipt.receivedAt).toLocaleDateString()}
          </p>
          <p style={{ fontSize: '18px', fontWeight: 'bold', color: 'green' }}>
            Total: {selectedReceipt && selectedReceipt.total}
          </p>
          <h3>Inventory Items:</h3>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Quantity</TableCell>
                  <TableCell>Unit Price</TableCell>
                  <TableCell>Total</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {selectedReceipt &&
                  selectedReceipt.items.map((item) => (
                    <TableRow key={item.item._id}>
                      <TableCell>{item.item.name}</TableCell>
                      <TableCell>{item.quantity}</TableCell>
                      <TableCell>{item.unitPrice}</TableCell>
                      <TableCell>{item.quantity * item.unitPrice}</TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      </Modal>
    </div>
  );
};

export default PurchaseReceiptPage;
