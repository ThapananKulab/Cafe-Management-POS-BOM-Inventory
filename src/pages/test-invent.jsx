import axios from 'axios';
import React, { useState, useEffect } from 'react';

import {
  List,
  Button,
  ListItem,
  Container,
  TextField,
  Typography,
  ListItemText,
} from '@mui/material';

function InventoryManager() {
  const [inventoryItems, setInventoryItems] = useState([]);
  const [newItem, setNewItem] = useState({
    name: '',
    unit: '',
    quantityInStock: '',
    unitPrice: '',
  });

  useEffect(() => {
    fetchInventoryItems();
  }, []);

  const fetchInventoryItems = async () => {
    try {
      const response = await axios.get('http://localhost:3333/api/inventoryitems/all');
      setInventoryItems(response.data);
    } catch (error) {
      console.error('Error fetching inventory items:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewItem((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:3333/api/inventoryitems/add', newItem);
      alert('Inventory item added successfully!');
      fetchInventoryItems();
      setNewItem({ name: '', unit: '', quantityInStock: '', unitPrice: '' });
    } catch (error) {
      console.error('Error adding inventory item:', error);
      alert('Failed to add inventory item.');
    }
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" gutterBottom>
        Inventory Items
      </Typography>
      <List>
        {inventoryItems.map((item) => (
          <ListItem key={item._id}>
            <ListItemText
              primary={`${item.name}, ${item.unit}, ${item.quantityInStock}, ${item.unitPrice}`}
            />
          </ListItem>
        ))}
      </List>
      <Typography variant="h5" gutterBottom>
        Add Inventory Item
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Name"
          name="name"
          value={newItem.name}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Unit"
          name="unit"
          value={newItem.unit}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          type="number"
          label="Quantity in Stock"
          name="quantityInStock"
          value={newItem.quantityInStock}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          type="number"
          label="Unit Price"
          name="unitPrice"
          value={newItem.unitPrice}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <Button type="submit" variant="contained" color="primary" style={{ marginTop: '20px' }}>
          Add Item
        </Button>
      </form>
    </Container>
  );
}

export default InventoryManager;
