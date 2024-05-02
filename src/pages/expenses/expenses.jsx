import axios from 'axios';
import styled1 from 'styled-components';
import { Helmet } from 'react-helmet-async';
import React, { useState, useEffect } from 'react';

import {
  Box,
  Grid,
  Stack,
  Table,
  Paper,
  Button,
  TableRow,
  MenuItem,
  TableBody,
  TableHead,
  Container,
  TextField,
  TableCell,
  Typography,
  TableContainer,
} from '@mui/material';

function ExpenseForm() {
  const StyledDiv = styled1.div`
    font-family: 'Prompt', sans-serif;
  `;
  const [expense, setExpense] = useState({
    description: '',
    amount: '',
    category: '',
  });

  const [expenses, setExpenses] = useState([]);

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const response = await axios.get('https://test-api-01.azurewebsites.net/api/expenses/all');
        setExpenses(response.data);
      } catch (error) {
        console.error('Error fetching expenses:', error);
      }
    };
    fetchExpenses();
    const intervalId = setInterval(fetchExpenses, 5000);
    return () => clearInterval(intervalId);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('https://test-api-01.azurewebsites.net/api/expenses/add', expense);
      alert('Expense added successfully!');
      setExpense({ description: '', amount: '', category: '' });
    } catch (error) {
      console.error('Error adding expense:', error);
      alert('Failed to add expense!');
    }
  };

  const handleChange = (e) => {
    setExpense({ ...expense, [e.target.name]: e.target.value });
  };

  return (
    <>
      <Helmet>
        <title>ค่าใช้จ่าย</title>
      </Helmet>
      <form onSubmit={handleSubmit}>
        <Container>
          <Box sx={{ width: '100%', overflow: 'hidden' }}>
            <Stack direction="row" alignItems="center" justifyContent="space-between" mb={4}>
              <Typography variant="h4">
                <StyledDiv>เพิ่มค่าใช้จ่าย</StyledDiv>
              </Typography>
            </Stack>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  name="description"
                  label="ชื่อค่าใช้จ่าย"
                  variant="outlined"
                  fullWidth
                  value={expense.description}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  name="amount"
                  label="จำนวนเงิน"
                  variant="outlined"
                  fullWidth
                  type="number"
                  value={expense.amount}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  select
                  name="category"
                  label="รายการ"
                  value={expense.category}
                  onChange={handleChange}
                  fullWidth
                  variant="outlined"
                >
                  {['ค่าเช่าพื่นที่', 'ค่าพนักงาน', 'อื่นๆ'].map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12}>
                <Button type="submit" variant="contained" color="primary">
                  เพิ่ม
                </Button>
              </Grid>
            </Grid>
            <TableContainer component={Paper}>
              <Typography variant="h6" gutterBottom component="div" sx={{ mt: 4 }}>
                <StyledDiv>รายการค่าใช้จ่าย</StyledDiv>
              </Typography>
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>ชื่อค่าใช้จ่าย</TableCell>
                    <TableCell align="right">จำนวนเงิน</TableCell>
                    <TableCell align="right">รายการ</TableCell>
                    <TableCell align="right">วันที่</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {expenses.map((expense1) => (
                    <TableRow
                      key={expense1._id}
                      sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    >
                      <TableCell component="th" scope="row">
                        {expense1.description}
                      </TableCell>
                      <TableCell align="right">{expense1.amount}</TableCell>
                      <TableCell align="right">{expense1.category}</TableCell>
                      <TableCell align="right">
                        {new Date(expense1.date).toLocaleDateString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </Container>
      </form>
    </>
  );
}

export default ExpenseForm;
