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
  const [ingredientAdded, setIngredientAdded] = useState(false);

  useEffect(() => {
    const fetchInventoryItems = async () => {
      try {
        const { data } = await axios.get(
          'https://test-api-01.azurewebsites.net/api/inventoryitems/all'
        );
        const updatedIngredients = data.map((item) => ({
          ...item,
          unitPrice: item.unitPrice || 0,
          realquantity: item.realquantity || 0,
        }));
        setInventoryItems(updatedIngredients);
      } catch (error) {
        console.error('Error fetching inventory items:', error);
      }
    };

    fetchInventoryItems();
  }, []);

  // useEffect(() => {
  //   const savedRecipe = localStorage.getItem('savedRecipe');
  //   if (savedRecipe) {
  //     setRecipe(JSON.parse(savedRecipe));
  //   }
  // }, []);

  // useEffect(() => {
  //   localStorage.setItem('savedRecipe', JSON.stringify(recipe));
  // }, [recipe]);

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

      const totalCost = ingredients.reduce((acc, curr) => {
        const itemCost = curr.unitPrice * curr.quantity;
        return acc + itemCost;
      }, 0);

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
      // navigate('/recipe');
      localStorage.removeItem('savedRecipe');
    } catch (error) {
      console.error('Error adding recipe:', error);
      toast.error('เพิ่มสูตรไม่สำเร็จ', {
        autoClose: 1000,
      });
    }
  };
  const addIngredient = () => {
    if (!ingredientAdded) {
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
      setIngredientAdded(true); // เซ็ตค่าเป็น true เมื่อมีการเพิ่มส่วนประกอบ
    }
  };

  const updateIngredient = (index, field, value) => {
    const updatedIngredients = recipe.ingredients.map((ingredient, i) => {
      if (i === index) {
        let newValue = value;
        if (field === 'inventoryItemId') {
          const selectedItem = inventoryItems.find((inventoryItem) => inventoryItem._id === value);
          const newName = selectedItem ? selectedItem.name : '';
          const newUnitPrice = selectedItem
            ? selectedItem.unitPrice / selectedItem.realquantity
            : 0;
          newValue = { ...ingredient, [field]: value, name: newName, unitPrice: newUnitPrice };
        } else if (field === 'quantity') {
          const unit = ingredientUnits[index];
          const targetUnit = 'gram';
          const inventoryItem = inventoryItems.find(
            (item) => item._id === ingredient.inventoryItemId
          );
          const { unitPrice, realquantity } = inventoryItem || { unitPrice: 0, realquantity: 0 };
          const adjustedUnitPrice = realquantity > 0 ? unitPrice / realquantity : 0;
          newValue = {
            ...ingredient,
            [field]: calculateQuantity(value, unit, targetUnit),
            unitPrice: adjustedUnitPrice,
          };
        }
        return newValue;
      }
      return ingredient;
    });

    setRecipe((prevRecipe) => ({ ...prevRecipe, ingredients: updatedIngredients }));
  };

  // const removeIngredient = (index) => {
  //   setRecipe((prevRecipe) => ({
  //     ...prevRecipe,
  //     ingredients: prevRecipe.ingredients.filter((_, i) => i !== index),
  //   }));
  // };

  return (
    <Container maxWidth="sm" sx={{ mt: 5 }}>
      <IconButton variant="outlined" onClick={() => navigate('/recipe')}>
        <Icon icon="lets-icons:back" />
      </IconButton>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom component="div">
          <StyledDiv>เพิ่มเมนูพร้อมขาย</StyledDiv>
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

              <Grid item xs={3}>
                <TextField
                  label="จำนวน"
                  type="number"
                  disabled
                  sx={{ mb: -5 }}
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
              {/* แสดงช่องราคาต้นทุนวัตถุดิบเฉพาะเมื่อมีการเลือกหรือระบุราคาขาย */}
              {ingredient.inventoryItemId && (
                <Grid item xs={7}>
                  <TextField
                    label="ราคาต้นทุนวัตถุดิบ"
                    value={ingredient.unitPrice}
                    fullWidth
                    disabled
                  />
                </Grid>
              )}

              {/* <Grid item xs={2}>
                <IconButton onClick={() => removeIngredient(index)} color="error">
                  <Icon icon="streamline:delete-1-solid" />
                </IconButton>
              </Grid> */}
            </Grid>
          ))}
          <Stack direction="row" spacing={2} justifyContent="center">
            <Button
              onClick={addIngredient}
              variant="outlined"
              sx={{
                display: ingredientAdded ? 'none' : 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Icon icon="akar-icons:plus" sx={{ marginRight: '0.5rem' }} />
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
