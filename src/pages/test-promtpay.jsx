import axios from 'axios';
import React, { useState } from 'react';

import { Button, Container, TextField, Typography } from '@mui/material';

function UpdateStock() {
  const [id, setId] = useState('');
  const [quantityInStock, setQuantityInStock] = useState('');

  const handleUpdate = async () => {
    try {
      const response = await axios.patch(
        `http://localhost:3333/api/inventoryitems/update-stock/${id}`,
        { quantityInStock }
      );
      alert(
        `Stock updated: ${response.data.name} now has ${response.data.quantityInStock} in stock.`
      );
    } catch (error) {
      // Here's the change: using a template literal instead of string concatenation
      alert(`Failed to update stock: ${error.response.data.message}`);
    }
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h6" sx={{ mb: 2 }}>
        Update Inventory Item Stock
      </Typography>
      <TextField
        fullWidth
        label="Item ID"
        value={id}
        onChange={(e) => setId(e.target.value)}
        margin="normal"
      />
      <TextField
        fullWidth
        type="number"
        label="Quantity in Stock"
        value={quantityInStock}
        onChange={(e) => setQuantityInStock(e.target.value)}
        margin="normal"
      />
      <Button variant="contained" onClick={handleUpdate} sx={{ mt: 2 }}>
        Update Stock
      </Button>
    </Container>
  );
}

export default UpdateStock;
