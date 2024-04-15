import axios from 'axios';
import React, { useState } from 'react';

import { Grid, Paper, Button, TextField, Typography } from '@mui/material';

function StockOutForm() {
  const [date, setDate] = useState(new Date());
  const [items, setItems] = useState([{ item: '', quantity: '' }]);

  const handleItemChange = (index, e) => {
    const { name, value } = e.target;
    const list = [...items];
    list[index][name] = value;
    setItems(list);
  };

  const handleAddItem = () => {
    setItems([...items, { item: '', quantity: '' }]);
  };

  const handleRemoveItem = (index) => {
    const list = [...items];
    list.splice(index, 1);
    setItems(list);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/stock-out', { date, items });
      alert('Stock Out saved successfully!');
    } catch (error) {
      console.error('Error saving Stock Out:', error);
      alert('Error saving Stock Out!');
    }
  };

  return (
    <Paper elevation={3} style={{ padding: 20 }}>
      <Typography variant="h5" gutterBottom>
        Stock Out Form
      </Typography>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              label="Date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              InputLabelProps={{
                shrink: true,
              }}
              fullWidth
            />
          </Grid>
          {items.map((item, index) => (
            <React.Fragment key={index}>
              <Grid item xs={6}>
                <TextField
                  label="Item"
                  value={item.item}
                  name="item"
                  onChange={(e) => handleItemChange(index, e)}
                  fullWidth
                />
              </Grid>
              <Grid item xs={4}>
                <TextField
                  label="Quantity"
                  type="number"
                  value={item.quantity}
                  name="quantity"
                  onChange={(e) => handleItemChange(index, e)}
                  fullWidth
                />
              </Grid>
              <Grid item xs={2}>
                <Button variant="contained" color="error" onClick={() => handleRemoveItem(index)}>
                  Remove
                </Button>
              </Grid>
            </React.Fragment>
          ))}
        </Grid>
        <Button variant="contained" onClick={handleAddItem} style={{ marginTop: 10 }}>
          Add Item
        </Button>
        <Button variant="contained" color="primary" type="submit" style={{ marginTop: 10 }}>
          Save
        </Button>
      </form>
    </Paper>
  );
}

export default StockOutForm;
