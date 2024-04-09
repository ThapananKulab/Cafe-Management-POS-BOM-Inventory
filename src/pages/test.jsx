import axios from 'axios';
import React, { useState } from 'react';

import { Box, Button, TextField, Typography } from '@mui/material';

const QRCodeGenerator = () => {
  const [phoneNumber, setPhoneNumber] = useState('0819139936');
  const [amount, setAmount] = useState('');
  const [qrCode, setQrCode] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3333/generateQR', {
        phoneNumber,
        amount,
      });
      if (response.data.RespCode === 200) {
        setQrCode(response.data.Result);
      } else {
        alert(response.data.RespMessage);
      }
    } catch (error) {
      console.error('Error generating QR code:', error);
      alert('Failed to generate QR code');
    }
  };

  return (
    <Box sx={{ maxWidth: 400, mx: 'auto', mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Generate QR Code
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Phone Number"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          fullWidth
          margin="normal"
        />
        <Button variant="contained" color="primary" type="submit" fullWidth>
          Generate QR Code
        </Button>
      </form>
      {qrCode && (
        <Box mt={4}>
          <Typography variant="h6" gutterBottom>
            QR Code
          </Typography>
          <img src={qrCode} alt="QR Code" style={{ maxWidth: '100%' }} />
        </Box>
      )}
    </Box>
  );
};

export default QRCodeGenerator;
