import axios from 'axios';
import { Icon } from '@iconify/react';
import styled1 from 'styled-components';
import { useNavigate } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import React, { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';

import {
  Box,
  Stack,
  Button,
  Select,
  MenuItem,
  Container,
  TextField,
  InputLabel,
  Typography,
  FormControl,
} from '@mui/material';

function AddMenuItem() {
  const navigate = useNavigate();

  const StyledDiv = styled1.div`
  font-family: 'Prompt', sans-serif;
`;
  const [menuItem, setMenuItem] = useState({
    name: '',
    description: '',
    price: '',
    recipe: '',
    image: '',
  });
  const [recipes, setRecipes] = useState([]);

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const response = await axios.get('http://localhost:3333/api/recipes/all');
        setRecipes(response.data);
      } catch (error) {
        console.error('Error fetching recipes:', error);
        toast.error('Error fetching recipes.');
      }
    };

    fetchRecipes();
  }, []);
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'recipe') {
      const selectedRecipe = recipes.find((recipe) => recipe._id === value);
      setMenuItem((prevState) => ({
        ...prevState,
        recipe: value,
        name: selectedRecipe ? selectedRecipe.name : '',
      }));
    } else {
      setMenuItem((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };

  const handleFileChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      setMenuItem((prevState) => ({
        ...prevState,
        image: event.target.files[0],
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const checkDuplicate = await axios.get(
        `http://localhost:3333/api/menus/checkName?name=${encodeURIComponent(menuItem.name)}`
      );
      if (checkDuplicate.data.exists) {
        toast.error('ชื่อเมนูนี้ถูกใช้แล้ว');
        return;
      }
    } catch (error) {
      console.error('Error checking for duplicate names:', error);
      toast.error('ชื่อเมนูซ้ำ');
      return;
    }

    const formData = new FormData();
    formData.append('name', menuItem.name);
    formData.append('description', menuItem.description);
    formData.append('price', menuItem.price);
    formData.append('recipe', menuItem.recipe);
    formData.append('image', menuItem.image);

    try {
      const response = await axios.post('http://localhost:3333/api/menus/addMenu', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log(response.data);
      toast.success('เพิ่มเมนูสำเร็จ');
    } catch (error) {
      console.error('Error adding menu item:', error);
      toast.error('ข้อมูลไม่ครบ');
    }
  };

  return (
    <Container
      maxWidth="xs"
      sx={{
        mt: 2,
        bgcolor: 'background.paper',
        boxShadow: 3,
        borderRadius: 2,
        p: 2,
        width: 'auto',
      }}
    >
      <ToastContainer />

      <Typography
        variant="h4"
        gutterBottom
        component="div"
        textAlign="center"
        sx={{ fontWeight: 'medium' }}
      >
        <StyledDiv>เพิ่มเมนู</StyledDiv>
      </Typography>
      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
        <FormControl fullWidth margin="normal">
          <InputLabel>สูตรที่เตรียมไว้</InputLabel>
          <Select name="recipe" value={menuItem.recipe} label="Recipe" onChange={handleChange}>
            {recipes.map((recipe) => (
              <MenuItem key={recipe._id} value={recipe._id}>
                {recipe.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        {/* <TextField
          margin="normal"
          required
          fullWidth
          id="recipe"
          label="Recipe ID"
          name="recipe"
          value={menuItem.recipe}
          onChange={handleChange}
        /> */}
        <TextField
          margin="normal"
          required
          fullWidth
          id="name"
          label="ชื่อเมนู"
          name="name"
          value={menuItem.name}
          onChange={handleChange}
          autoFocus
          sx={{ backgroundColor: 'white', borderRadius: 1 }}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          id="description"
          label="รายละเอียด"
          name="description"
          value={menuItem.description}
          onChange={handleChange}
          multiline
          rows={4} // ตั้งค่านี้ตามความต้องการของคุณ
        />

        <TextField
          margin="normal"
          required
          fullWidth
          id="price"
          label="ราคา"
          name="price"
          type="number"
          value={menuItem.price}
          onChange={handleChange}
        />
        <input
          accept="image/*"
          required
          id="image"
          type="file"
          onChange={(e) => handleFileChange(e)}
          style={{ margin: '20px 0' }}
        />

        <Stack
          direction="row"
          spacing={2}
          justifyContent="center" // Centers the buttons horizontally in the Stack
          alignItems="center" // Align items vertically
          sx={{ width: '100%', mt: 3 }}
        >
          {' '}
          <Button
            onClick={() => navigate(-1)}
            variant="contained"
            color="error"
            size="large"
            sx={{
              width: '150px', // Ensure both buttons have the same width
              height: '56px', // Match the height if needed
              fontSize: '20px', // Adjust the font size as needed
            }}
          >
            <Icon icon="material-symbols:cancel-outline" sx={{ fontSize: '28px' }} />{' '}
            {/* Adjust icon size as needed */}
          </Button>
          <Button
            type="submit"
            variant="contained"
            sx={{
              width: '150px', // Ensure both buttons have the same width
              height: '56px', // Match the height if needed
              fontSize: '20px', // Adjust the font size as needed
              mb: 2,
              py: 1.5,
              bgcolor: 'primary.main',
              '&:hover': { bgcolor: 'primary.dark' },
            }}
          >
            <Icon icon="material-symbols-light:send" sx={{ fontSize: '28px' }} />{' '}
            {/* Adjust icon size as needed */}
          </Button>
        </Stack>
      </Box>
    </Container>
  );
}

export default AddMenuItem;
