import axios from 'axios';
import { Icon } from '@iconify/react';
import styled1 from 'styled-components';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
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
  // InputAdornment,
} from '@mui/material';

function AddRecipe() {
  const StyledDiv = styled1.div`
  font-family: 'Prompt', sans-serif;
`;
  const navigate = useNavigate();
  const [inventoryItems, setInventoryItems] = useState([]);
  const [recipe, setRecipe] = useState({
    title: '',
    ingredients: [],
  });
  const [ingredientUnits, setIngredientUnits] = useState(['gram']);
  const [totalCost, setTotalCost] = useState(0);

  const handleUnitChange = (e) => {};

  useEffect(() => {
    const fetchInventoryItems = async () => {
      try {
        const { data } = await axios.get(
          'https://test-api-01.azurewebsites.net/api/inventoryitems/all'
        );
        const updatedIngredients = data.map((item) => ({
          ...item,
          unitPrice: item.unitPrice || 0, // Default value if unitPrice is undefined
          realquantity: item.realquantity || 0, // Default value if realquantity is undefined
        }));
        setInventoryItems(updatedIngredients);
      } catch (error) {
        console.error('Error fetching inventory items:', error);
      }
    };

    fetchInventoryItems();
  }, []);

  useEffect(() => {
    const savedRecipe = localStorage.getItem('savedRecipe');
    if (savedRecipe) {
      setRecipe(JSON.parse(savedRecipe));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('savedRecipe', JSON.stringify(recipe));
  }, [recipe]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setRecipe((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const calculateQuantity = (quantity, unit, targetUnit) => {
    switch (unit) {
      case 'gram':
        return targetUnit === 'gram' ? quantity : convertToUnit(quantity, targetUnit);
      case 'teaspoon':
      case 'tablespoon':
        return targetUnit === 'gram' ? convertToGram(quantity, unit) : quantity;
      default:
        return quantity;
    }
  };

  const convertToUnit = (value, targetUnit) => {
    switch (targetUnit) {
      case 'teaspoon':
        return parseInt(parseFloat(value) / 5, 10); // 1 ช้อนชา = 5 กรัม (ประมาณ)
      case 'tablespoon':
        return parseInt(parseFloat(value) / 15, 10); // 1 ช้อนโต๊ะ = 15 กรัม (ประมาณ)
      default:
        return value;
    }
  };

  const convertToGram = (value, targetUnit) => {
    switch (targetUnit) {
      case 'teaspoon':
        return parseInt(parseFloat(value) * 5, 10); // 1 ช้อนชา = 5 กรัม (ประมาณ)
      case 'tablespoon':
        return parseInt(parseFloat(value) * 15, 10); // 1 ช้อนโต๊ะ = 15 กรัม (ประมาณ)
      default:
        return value;
    }
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
      const recipesResponse = await axios.get(
        'https://test-api-01.azurewebsites.net/api/recipes/all'
      );
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
      const response = await axios.post('https://test-api-01.azurewebsites.net/api/recipes/add', {
        name: recipe.title,
        ingredients: ingredients.map((ingredient) => ({
          inventoryItemId: ingredient.inventoryItemId,
          quantity: ingredient.quantity,
        })),
        cost: totalCost,
      });

      console.log(response.data);
      toast.success('เพิ่มสำเร็จ', {
        autoClose: 1000,
      });

      navigate('/recipe');
      localStorage.removeItem('savedRecipe');
    } catch (error) {
      console.error('Error adding recipe:', error);
      toast.error('เพิ่มสูตรไม่สำเร็จ', {
        autoClose: 1000,
      });
    }
  };
  const addIngredient = () => {
    const newIngredient = {
      inventoryItemId: '',
      quantity: 1,
      name: '',
      unit: 'gram',
      unitPrice: '',
      realquantity: '',
    };
    setRecipe((prevRecipe) => ({
      ...prevRecipe,
      ingredients: [...prevRecipe.ingredients, newIngredient],
    }));
    setIngredientUnits((prevUnits) => [...prevUnits, 'gram']);
  };

  const updateIngredient = (index, field, value) => {
    const updatedIngredients = recipe.ingredients.map((ingredient, i) => {
      if (i === index) {
        let newValue = value;
        if (field === 'inventoryItemId') {
          const selectedItem = inventoryItems.find((inventoryItem) => inventoryItem._id === value);
          const newName = selectedItem ? selectedItem.name : '';
          newValue = { ...ingredient, [field]: value, name: newName };
        } else if (field === 'quantity') {
          const unit = ingredientUnits[index];
          const targetUnit = 'gram';
          const inventoryItem = inventoryItems.find(
            (item) => item._id === ingredient.inventoryItemId
          );
          const { unitPrice, realquantity } = inventoryItem || { unitPrice: 0, realquantity: 0 }; // Destructure with default values
          newValue = {
            ...ingredient,
            [field]: calculateQuantity(value, unit, targetUnit),
            unitPrice,
            realquantity,
          };
        }
        return newValue;
      }
      return ingredient;
    });

    // Update total cost
    const newTotalCost = updatedIngredients.reduce((acc, curr) => {
      const itemCost = curr.unitPrice * (curr.quantity / curr.realquantity);
      return acc + itemCost;
    }, 0);
    setTotalCost(newTotalCost);

    setRecipe((prevRecipe) => ({ ...prevRecipe, ingredients: updatedIngredients }));
  };

  const removeIngredient = (index) => {
    setRecipe((prevRecipe) => ({
      ...prevRecipe,
      ingredients: prevRecipe.ingredients.filter((_, i) => i !== index),
    }));
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 5 }}>
      <IconButton variant="outlined" onClick={() => navigate('/recipe')}>
        <Icon icon="lets-icons:back" />
      </IconButton>
      <Paper elevation={3} sx={{ p: 4 }}>
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
                <Typography variant="body1" sx={{ mb: 1 }}>
                  {index + 1}.
                </Typography>

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
                        {/* เพิ่มการแสดง unitPrice ที่ตรงกับ item.name */}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={5}>
                <TextField
                  label=""
                  type="number"
                  value={ingredient.quantity}
                  onChange={(e) => updateIngredient(index, 'quantity', e.target.value)}
                  fullWidth
                  sx={{ mb: -5 }}
                  disabled
                />
              </Grid>

              <Grid item xs={7}>
                <FormControl fullWidth>
                  <InputLabel>หน่วย</InputLabel>
                  <Select
                    value={ingredientUnits[index]} // ใช้หน่วยที่เกี่ยวข้องกับส่วนประกอบนี้
                    onChange={(e) => {
                      const newUnit = e.target.value;
                      setIngredientUnits((prevUnits) => {
                        const updatedUnits = [...prevUnits];
                        updatedUnits[index] = newUnit;
                        return updatedUnits;
                      });
                      handleUnitChange(e);
                    }}
                  >
                    <MenuItem value="gram">กรัม</MenuItem>
                    <MenuItem value="grams">ชิ้น</MenuItem>
                    <MenuItem value="grams1">ML</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={3}>
                <TextField
                  label="จำนวน"
                  type="number"
                  value={
                    ingredientUnits[index] === 'gram'
                      ? ingredient.quantity
                      : convertToUnit(ingredient.quantity, ingredientUnits[index])
                  }
                  onChange={(e) =>
                    updateIngredient(
                      index,
                      'quantity',
                      ingredientUnits[index] === 'gram'
                        ? e.target.value
                        : convertToGram(e.target.value, ingredientUnits[index])
                    )
                  }
                  fullWidth
                />
              </Grid>
              <Grid item xs={7}>
                <TextField
                  label="ราคาต้นทุนวัตถุดิบ"
                  value={
                    ingredient.unitPrice && ingredient.realquantity && ingredient.quantity
                      ? (
                          ingredient.unitPrice *
                          (ingredient.quantity / ingredient.realquantity)
                        ).toFixed(2)
                      : 'ราคาต้นทุน'
                  }
                  fullWidth
                  disabled
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
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Icon icon="akar-icons:plus" sx={{ marginRight: '0.5rem' }} />
            </Button>

            <Button type="submit" variant="contained" color="primary">
              ตกลง
            </Button>
            <TextField
              label="ราคาทั้งหมด"
              value={Number.isNaN(totalCost) ? '0.00' : totalCost.toFixed(2)}
              fullWidth
              disabled
              sx={{ mt: 3 }}
            />
            <ToastContainer />
          </Stack>
        </Box>
      </Paper>
    </Container>
  );
}

export default AddRecipe;
