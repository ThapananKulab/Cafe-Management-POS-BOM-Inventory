import axios from 'axios';
import React, { useState } from 'react';

import { Box, Button, Container, TextField, Typography } from '@mui/material';

function AddMenuItem() {
  const [menuItem, setMenuItem] = useState({
    name: '',
    description: '',
    price: 0,
    recipe: '',
    image: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setMenuItem((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3333/api/menus/addMenu', menuItem);
      console.log(response.data);
      alert('Menu item added successfully!');
    } catch (error) {
      console.error('Error adding menu item:', error);
      alert('Failed to add menu item.');
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 5 }}>
      <Typography variant="h4" gutterBottom>
        Add Menu Item
      </Typography>
      <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
        <TextField
          margin="normal"
          required
          fullWidth
          id="name"
          label="Name"
          name="name"
          value={menuItem.name}
          onChange={handleChange}
          autoFocus
        />
        <TextField
          margin="normal"
          fullWidth
          id="description"
          label="Description"
          name="description"
          value={menuItem.description}
          onChange={handleChange}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          id="price"
          label="Price"
          name="price"
          type="number"
          value={menuItem.price}
          onChange={handleChange}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          id="recipe"
          label="Recipe ID"
          name="recipe"
          value={menuItem.recipe}
          onChange={handleChange}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          id="image"
          label="Image URL"
          name="image"
          value={menuItem.image}
          onChange={handleChange}
        />
        <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
          Submit
        </Button>
      </Box>
    </Container>
  );
}

export default AddMenuItem;
