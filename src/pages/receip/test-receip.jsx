import axios from 'axios';
import { Icon } from '@iconify/react';
import styled1 from 'styled-components';
import 'react-toastify/dist/ReactToastify.css';
import React, { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';

import {
  Box,
  Grid,
  Paper,
  Stack,
  Button,
  Select,
  MenuItem,
  Container,
  TextField,
  Typography,
  InputLabel,
  IconButton,
  FormControl,
  InputAdornment,
} from '@mui/material';

function AddRecipe() {
  const StyledDiv = styled1.div`
  font-family: 'Prompt', sans-serif;
`;
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { ingredients } = recipe;

    // ตรวจสอบว่ามีส่วนผสมซ้ำกันในรายการหรือไม่
    const uniqueIngredients = new Set();
    const hasDuplicate = ingredients.some((ingredient) => {
      if (uniqueIngredients.has(ingredient.inventoryItemId)) {
        return true; // พบส่วนผสมซ้ำ
      }
      uniqueIngredients.add(ingredient.inventoryItemId);
      return false;
    });
    if (hasDuplicate) {
      toast.error('ห้ามมีส่วนผสมซ้ำ', {
        autoClose: 1000,
      });
      return;
    }
    try {
      const recipesResponse = await axios.get('http://localhost:3333/api/recipes/all');
      const recipes = recipesResponse.data;
      const isDuplicate = recipes.some(
        (existingRecipe) => existingRecipe.name.toLowerCase() === recipe.title.toLowerCase()
      );

      if (isDuplicate) {
        toast.error('ชื่อสูตรนี้มีอยู่แล้ว', {
          autoClose: 1000,
        });
        return;
      }

      const response = await axios.post('http://localhost:3333/api/recipes/add', {
        name: recipe.title,
        ingredients: recipe.ingredients.map((ingredient) => ({
          inventoryItemId: ingredient.inventoryItemId,
          quantity: ingredient.quantity,
        })),
      });

      console.log(response.data);
      toast.success('เพิ่มสำเร็จ', {
        autoClose: 1000,
      });
    } catch (error) {
      console.error('Error adding recipe:', error);
      toast.error('เพิ่มสูตรไม่สำเร็จ', {
        autoClose: 1000,
      });
    }
  };

  const addIngredient = () => {
    setRecipe((prevRecipe) => ({
      ...prevRecipe,
      ingredients: [...prevRecipe.ingredients, { inventoryItemId: '', quantity: 1, name: '' }],
    }));
  };

  const updateIngredient = (index, field, value) => {
    const updatedIngredients = recipe.ingredients.map((ingredient, i) => {
      if (i === index) {
        if (field === 'inventoryItemId') {
          const selectedItem = inventoryItems.find((inventoryItem) => inventoryItem._id === value);
          const newName = selectedItem ? selectedItem.name : '';
          return { ...ingredient, [field]: value, name: newName };
        }
        return { ...ingredient, [field]: value };
      }
      return ingredient;
    });
    setRecipe({ ...recipe, ingredients: updatedIngredients });
  };

  const removeIngredient = (index) => {
    setRecipe((prevRecipe) => ({
      ...prevRecipe,
      ingredients: prevRecipe.ingredients.filter((_, i) => i !== index),
    }));
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 5 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        {' '}
        {/* เพิ่ม Paper เพื่อให้มีพื้นหลังและเงา */}
        <Typography variant="h4" gutterBottom component="div">
          <StyledDiv>เพิ่มสูตรเมนู</StyledDiv>
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField
            label="ชื่อสูตร"
            name="title"
            value={recipe.title}
            onChange={handleChange}
            fullWidth
            sx={{ mb: 3 }} // ปรับ margin-bottom
          />
          {/* Ingredient selection fields */}
          {recipe.ingredients.map((ingredient, index) => (
            <Grid container spacing={2} alignItems="center" key={index} sx={{ mb: 2 }}>
              <Grid item xs={7}>
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
              </Grid>
              <Grid item xs={3}>
                <TextField
                  label="จำนวน"
                  type="number"
                  value={ingredient.quantity}
                  onChange={(e) => updateIngredient(index, 'quantity', e.target.value)}
                  fullWidth
                  // Display suffix based on the ingredient's name
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        {ingredient.name &&
                          ((ingredient.name.includes('น้ำ') || ingredient.name.includes('นม')) &&
                          !ingredient.name.includes('น้ำตาล') &&
                          !ingredient.name.includes('ทราย')
                            ? 'ml'
                            : 'กรัม')}
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={2}>
                <IconButton onClick={() => removeIngredient(index)} color="error">
                  <Icon icon="streamline:delete-1-solid" />
                </IconButton>
              </Grid>
            </Grid>
          ))}
          <Stack direction="row" spacing={2} justifyContent="center">
            <Button
              onClick={addIngredient}
              variant="outlined"
              startIcon={<Icon icon="akar-icons:plus" />}
            >
              เพิ่ม
            </Button>
            <Button type="submit" variant="contained" color="primary">
              ตกลง
            </Button>
            <ToastContainer />
          </Stack>
        </Box>
      </Paper>
    </Container>
  );
}

export default AddRecipe;
