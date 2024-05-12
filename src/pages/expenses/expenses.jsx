import axios from 'axios';
import { Helmet } from 'react-helmet-async';
import React, { useState, useEffect } from 'react';

import {
  Box,
  Modal,
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
  const [isOpen, setIsOpen] = useState(false);
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
      setIsOpen(false); // ปิด Modal เมื่อเพิ่มค่าใช้จ่ายเสร็จ
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
      <Container>
        <Box sx={{ width: '100%', overflow: 'hidden' }}>
          <Stack direction="row" alignItems="center" justifyContent="space-between" mb={4}>
            <Typography variant="h4">เพิ่มค่าใช้จ่าย</Typography>
          </Stack>
          <Button onClick={() => setIsOpen(true)} variant="contained" color="primary">
            เพิ่ม
          </Button>
          <Modal
            open={isOpen}
            onClose={() => setIsOpen(false)}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box
              sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: 400,
                bgcolor: 'background.paper',
                border: '2px solid #000',
                borderRadius: '8px', // เพิ่มขอบมนเรียบ
                boxShadow: 24,
                p: 4,
              }}
            >
              <form onSubmit={handleSubmit}>
                <Stack direction="row" alignItems="center" justifyContent="space-between" mb={4}>
                  <Typography variant="h4">เพิ่มค่าใช้จ่าย</Typography>
                </Stack>
                <TextField
                  name="description"
                  label="ชื่อค่าใช้จ่าย"
                  variant="outlined"
                  fullWidth
                  value={expense.description}
                  onChange={handleChange}
                  sx={{ mb: 2 }} // เพิ่มระยะห่างด้านล่าง
                />
                <TextField
                  name="amount"
                  label="จำนวนเงิน"
                  variant="outlined"
                  fullWidth
                  type="number"
                  value={expense.amount}
                  onChange={handleChange}
                  sx={{ mb: 2 }} // เพิ่มระยะห่างด้านล่าง
                />
                <TextField
                  select
                  name="category"
                  label="รายการ"
                  value={expense.category}
                  onChange={handleChange}
                  fullWidth
                  variant="outlined"
                  sx={{ mb: 2 }} // เพิ่มระยะห่างด้านล่าง
                >
                  {['ค่าเช่าพื่นที่', 'ค่าพนักงาน', 'อื่นๆ'].map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </TextField>
                <Button type="submit" variant="contained" color="primary">
                  เพิ่ม
                </Button>
              </form>
            </Box>
          </Modal>
          <TableContainer component={Paper}>
            <Typography variant="h6" gutterBottom component="div" sx={{ mt: 4 }}>
              รายการค่าใช้จ่าย
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
    </>
  );
}

export default ExpenseForm;
