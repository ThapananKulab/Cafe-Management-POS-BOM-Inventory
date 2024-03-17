import axios from 'axios';
import { Icon } from '@iconify/react';
import React, { useState, useEffect } from 'react';

import {
  Box,
  Button,
  Select,
  MenuItem,
  Container,
  TextField,
  Typography,
  InputLabel,
  IconButton,
  FormControl,
} from '@mui/material';

function AddRecipe() {
  const [inventoryItems, setInventoryItems] = useState([]);
  const [recipe, setRecipe] = useState({
    title: '',
    ingredients: [],
  });

  useEffect(() => {
    // Fetch inventory items from your API
    const fetchInventoryItems = async () => {
      const { data } = await axios.get('http://localhost:3333/api/inventoryitems/all');
      setInventoryItems(data);
    };
    fetchInventoryItems();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setRecipe((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Handle adding, updating, and removing ingredients
  // Similar to previously shared methods

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3333/api/recipes/add', {
        // Ensure endpoint matches
        name: recipe.title, // Adjust according to your schema
        ingredients: recipe.ingredients.map((ingredient) => ({
          inventoryItemId: ingredient.inventoryItemId,
          quantity: ingredient.quantity,
        })),
      });
      console.log(response.data);
      alert('Recipe added successfully!');
    } catch (error) {
      console.error('Error adding recipe:', error);
      alert('Failed to add recipe.');
    }
  };

  // Function to handle adding a new ingredient field
  const addIngredient = () => {
    setRecipe((prevRecipe) => ({
      ...prevRecipe,
      ingredients: [...prevRecipe.ingredients, { inventoryItemId: '', quantity: 1 }],
    }));
  };

  // Function to handle updating an ingredient
  const updateIngredient = (index, field, value) => {
    const updatedIngredients = recipe.ingredients.map((ingredient, i) => {
      if (i === index) {
        return { ...ingredient, [field]: value };
      }
      return ingredient;
    });
    setRecipe({ ...recipe, ingredients: updatedIngredients });
  };

  // Function to remove an ingredient
  const removeIngredient = (index) => {
    setRecipe((prevRecipe) => ({
      ...prevRecipe,
      ingredients: prevRecipe.ingredients.filter((_, i) => i !== index),
    }));
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 5 }}>
      <Typography variant="h4" gutterBottom>
        เพิ่มสูตรเมนู
      </Typography>
      <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
        {/* ย้าย TextField สำหรับ Title ไปอยู่ตรงนี้เพื่อให้อยู่บนสุด */}
        <TextField
          label="Title"
          name="title"
          value={recipe.title}
          onChange={handleChange}
          fullWidth
          sx={{ mb: 2 }} // ใส่ margin-bottom เล็กน้อยเพื่อให้มีระยะห่างกับฟิลด์ถัดไป
        />
        {/* Ingredient selection fields */}
        {recipe.ingredients.map((ingredient, index) => (
          <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 2 }}>
            <FormControl fullWidth>
              <InputLabel>เพิ่มส่วนประกอบ</InputLabel>
              <Select
                value={ingredient.inventoryItemId}
                label="Inventory Item"
                onChange={(e) => updateIngredient(index, 'inventoryItemId', e.target.value)}
              >
                {inventoryItems.map((item) => (
                  <MenuItem key={item._id} value={item._id}>
                    {item.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              label="จำนวนที่ใช้ หน่วย กรัม "
              type="number"
              value={ingredient.quantity}
              onChange={(e) => updateIngredient(index, 'quantity', e.target.value)}
            />
            <IconButton onClick={() => removeIngredient(index)}>
              <Icon icon="fluent:delete-32-filled" />
            </IconButton>
          </Box>
        ))}
        <Button onClick={addIngredient} variant="contained" sx={{ mt: 2, mb: 2 }}>
          Add Ingredient
        </Button>
        <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
          Submit
        </Button>
      </Box>
    </Container>
  );
}

export default AddRecipe;
