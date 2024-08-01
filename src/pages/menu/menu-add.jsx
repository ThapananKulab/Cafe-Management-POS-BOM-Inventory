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
    sweetLevel: 'ปกติ',
    type: 'ร้อน',
    recipe: '',
    image: '',
    cost: '', // เพิ่ม cost เข้าไป
    glassSize: 'ไม่มี', // เพิ่มฟิลด์ glassSize
  });

  const [recipes, setRecipes] = useState([]);

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const response = await axios.get(
          'https://cafe-management-pos-bom-inventory-api.vercel.app/api/recipes/all'
        );
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
        cost: selectedRecipe ? selectedRecipe.cost : '',
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
    const formData = new FormData();
    formData.append('name', menuItem.name);
    formData.append('description', menuItem.description);
    formData.append('price', menuItem.price);
    formData.append('recipe', menuItem.recipe);
    formData.append('image', menuItem.image);
    formData.append('sweetLevel', menuItem.sweetLevel);
    formData.append('type', menuItem.type);
    formData.append('cost', menuItem.cost);
    formData.append('glassSize', menuItem.glassSize); // เพิ่ม glassSize ไปยัง formData

    try {
      const response = await axios.post(
        'https://cafe-management-pos-bom-inventory-api.vercel.app/api/menus/addMenu',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
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
          id="cost"
          label="ราคาต้นทุน"
          name="cost"
          type="number"
          value={menuItem.cost}
          onChange={handleChange}
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
        <FormControl fullWidth margin="normal">
          <InputLabel>ระดับความหวาน</InputLabel>
          <Select
            name="sweetLevel"
            value={menuItem.sweetLevel}
            label="ระดับความหวาน"
            onChange={handleChange}
          >
            <MenuItem value="ปกติ">ปกติ</MenuItem>
            <MenuItem value="หวานน้อย">หวานน้อย</MenuItem>
            <MenuItem value="หวานมาก">หวานมาก</MenuItem>
            <MenuItem value="ทั่วไป">ทั่วไป</MenuItem>
          </Select>
        </FormControl>

        <FormControl fullWidth margin="normal">
          <InputLabel>ประเภท</InputLabel>
          <Select name="type" value={menuItem.type} label="ประเภท" onChange={handleChange}>
            <MenuItem value="ร้อน">ร้อน</MenuItem>
            <MenuItem value="เย็น">เย็น</MenuItem>
            <MenuItem value="ปั่น">ปั่น</MenuItem>
            <MenuItem value="ทั่วไป">ทั่วไป</MenuItem>
          </Select>
        </FormControl>
        <FormControl fullWidth margin="normal">
          <InputLabel>ขนาดแก้ว</InputLabel>
          <Select
            name="glassSize"
            value={menuItem.glassSize}
            label="ขนาดแก้ว"
            onChange={handleChange}
          >
            <MenuItem value="ไม่มี">ไม่มี</MenuItem>
            <MenuItem value="เล็ก">เล็ก</MenuItem>
            <MenuItem value="กลาง">กลาง</MenuItem>
            <MenuItem value="ใหญ่">ใหญ่</MenuItem>
          </Select>
        </FormControl>
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
          justifyContent="center"
          alignItems="center"
          sx={{ width: '100%', mt: 3 }}
        >
          {' '}
          <Button
            onClick={() => navigate(-1)}
            variant="contained"
            color="error"
            size="large"
            sx={{
              width: '150px',
              height: '56px',
              fontSize: '20px',
            }}
          >
            <Icon icon="material-symbols:cancel-outline" sx={{ fontSize: '28px' }} />{' '}
            {/* Adjust icon size as needed */}
          </Button>
          <Button
            type="submit"
            variant="contained"
            sx={{
              width: '150px',
              height: '56px',
              fontSize: '20px',
              mb: 2,
              py: 1.5,
              bgcolor: 'primary.main',
              '&:hover': { bgcolor: 'primary.dark' },
            }}
          >
            <Icon icon="material-symbols-light:send" sx={{ fontSize: '28px' }} />{' '}
          </Button>
        </Stack>
      </Box>
    </Container>
  );
}

export default AddMenuItem;
