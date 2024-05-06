import styled1 from 'styled-components';
import { useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';

import {
  Box,
  Stack,
  Paper,
  Table,
  Select,
  MenuItem,
  TableRow,
  TableCell,
  TableHead,
  TableBody,
  Container,
  Typography,
  TableContainer,
} from '@mui/material';

function HighestCostRecipeReport() {
  const navigate = useNavigate();
  const [highestCostRecipes, setHighestCostRecipes] = useState([]);

  const StyledDiv = styled1.div`
    font-family: 'Prompt', sans-serif;
  `;

  useEffect(() => {
    async function fetchHighestCostRecipes() {
      try {
        const response = await fetch(
          'https://test-api-01.azurewebsites.net/api/recipes/reports/highest-cost-recipes'
        );
        if (!response.ok) {
          throw new Error('Failed to fetch highest cost recipes');
        }
        const data = await response.json();
        setHighestCostRecipes(data);
      } catch (error) {
        console.error('Error fetching highest cost recipes:', error);
      }
    }
    fetchHighestCostRecipes();
  }, []);

  return (
    <Container>
      <Box sx={{ width: '100%', overflow: 'hidden' }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={4}>
          <Typography variant="h4">
            <StyledDiv>รายชื่อราคาต้นทุนสูงสุด</StyledDiv>
          </Typography>
        </Stack>
        <Stack direction="row" spacing={2} justifyContent="center" marginBottom={4}>
          <Paper>
            <Select
              onChange={(event) => navigate(event.target.value)}
              defaultValue="/report/cost"
              inputProps={{ 'aria-label': 'select' }}
            >
              {/* <MenuItem value="/report/daily">รายงานยอดขาย 7 วันย้อนหลัง</MenuItem> */}
              {/* <MenuItem value="/report/cancelbill">รายงานการยกเลิกบิล</MenuItem> */}
              <MenuItem value="/report/salemenu">ประวัติการขายสินค้า</MenuItem>
              <MenuItem value="/report/payment">รายงานการขายจำแนกตามประเภทการชำระเงิน</MenuItem>
              <MenuItem value="/report/cost">รายชื่อวัตถุดิบราคาต้นทุนสูงสุด</MenuItem>
              {/* <MenuItem value="/report/popular-menu">ยอดขายที่ขายดีสุดตามเวลา</MenuItem> */}
            </Select>
          </Paper>
        </Stack>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>รายชื่อสูตร</TableCell>
                <TableCell>ราคาต้นทุน</TableCell>
                <TableCell>สูตร</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {highestCostRecipes.map((recipe, recipeIndex) => (
                <TableRow key={recipeIndex}>
                  <TableCell>{recipe.name}</TableCell>
                  <TableCell>{recipe.cost}</TableCell>
                  <TableCell>
                    <ul>
                      {recipe.ingredients.map((ingredient, ingredientIndex) => (
                        <li key={ingredientIndex}>{ingredient.inventoryItemId.name}</li>
                      ))}
                    </ul>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Container>
  );
}

export default HighestCostRecipeReport;
