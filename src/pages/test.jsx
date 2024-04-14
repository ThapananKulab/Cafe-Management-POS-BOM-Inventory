import axios from 'axios';
import React, { useState, useEffect } from 'react';

import {
  List,
  Select,
  Button,
  MenuItem,
  ListItem,
  Container,
  TextField,
  Typography,
  ListItemText,
} from '@mui/material';

const CreatePurchaseReceiptPage = () => {
  const [inventoryItems, setInventoryItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [quantity, setQuantity] = useState('');
  const [unitPrice, setUnitPrice] = useState('');
  const [purchaseItems, setPurchaseItems] = useState([]);

  useEffect(() => {
    const fetchInventoryItems = async () => {
      try {
        const response = await axios.get('/api/inventory');
        setInventoryItems(response.data);
      } catch (error) {
        console.error('Error fetching inventory items:', error);
      }
    };
    fetchInventoryItems();
  }, []);

  const handleAddItem = () => {
    const newItem = {
      item: selectedItems,
      quantity: parseInt(quantity, 10), // เราระบุ radix เป็น 10 ที่นี่
      unitPrice: parseFloat(unitPrice),
    };
    setPurchaseItems([...purchaseItems, newItem]);
    setSelectedItems([]);
    setQuantity('');
    setUnitPrice('');
  };

  const handleSubmit = async () => {
    try {
      const response = await axios.post('/api/purchase-receipts', { items: purchaseItems });
      console.log('Purchase receipt created:', response.data);
      // Clear the purchase items after submission
      setPurchaseItems([]);
    } catch (error) {
      console.error('Error creating purchase receipt:', error);
    }
  };

  return (
    <Container>
      <Typography variant="h2" gutterBottom>
        Create Purchase Receipt
      </Typography>
      <Select
        multiple
        value={selectedItems}
        onChange={(e) =>
          setSelectedItems(Array.from(e.target.selectedOptions, (option) => option.value))
        }
        fullWidth
        sx={{ marginBottom: 2 }}
      >
        <MenuItem value="">Select item(s)</MenuItem>
        {inventoryItems.map((item) => (
          <MenuItem key={item._id} value={item._id}>
            {item.name}
          </MenuItem>
        ))}
      </Select>
      <TextField
        type="number"
        value={quantity}
        onChange={(e) => setQuantity(e.target.value)}
        placeholder="Quantity"
        fullWidth
        sx={{ marginBottom: 2 }}
      />
      <TextField
        type="number"
        value={unitPrice}
        onChange={(e) => setUnitPrice(e.target.value)}
        placeholder="Unit Price"
        fullWidth
        sx={{ marginBottom: 2 }}
      />
      <Button variant="contained" onClick={handleAddItem} sx={{ marginBottom: 2 }}>
        Add Item
      </Button>
      <div>
        <Typography variant="h3" gutterBottom>
          Purchase Items
        </Typography>
        <List>
          {purchaseItems.map((item, index) => (
            <ListItem key={index}>
              <ListItemText
                primary={`Items: ${item.item.join(', ')}`}
                secondary={`Quantity: ${item.quantity}, Unit Price: ${item.unitPrice}`}
              />
            </ListItem>
          ))}
        </List>
      </div>
      <Button variant="contained" onClick={handleSubmit}>
        Create Purchase Receipt
      </Button>
    </Container>
  );
};

export default CreatePurchaseReceiptPage;
