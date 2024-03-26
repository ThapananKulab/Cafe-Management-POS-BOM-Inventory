import axios from 'axios';
import Swal from 'sweetalert2';
import styled1 from 'styled-components';
import { useNavigate } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import React, { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';

import {
  Box,
  Modal,
  Table,
  Paper,
  Stack,
  Avatar,
  Button,
  Checkbox,
  TableRow,
  TextField,
  TableBody,
  TableCell,
  TableHead,
  Container,
  Typography,
  InputAdornment,
  TableContainer,
  TablePagination,
} from '@mui/material';

import Iconify from 'src/components/iconify';

function MenuTable() {
  const StyledDiv = styled1.div`
    font-family: 'Prompt', sans-serif;
  `;
  const [menus, setMenus] = useState([]);
  const [selected, setSelected] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [filteredMenus, setFilteredMenus] = useState([]); // State to hold filtered menus
  const [searchQuery, setSearchQuery] = useState(''); // State to hold the search query
  const navigate = useNavigate();
  const [openModal, setOpenModal] = useState(false);
  const [currentRecipe, setCurrentRecipe] = useState(null);

  const [inventoryItems, setInventoryItems] = useState([]);

  useEffect(() => {
    // Fetch inventory items from your API
    const fetchInventoryItems = async () => {
      const { data } = await axios.get('https://test-api-01.azurewebsites.net/api/inventoryitems/all');
      setInventoryItems(data);
    };
    fetchInventoryItems();
  }, []);

  const handleOpenModal = (selectedRecipe) => {
    setCurrentRecipe(selectedRecipe);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  useEffect(() => {
    const fetchMenus = async () => {
      try {
        const response = await axios.get('https://test-api-01.azurewebsites.net/api/menus/allMenus');
        setMenus(response.data);
        setFilteredMenus(response.data);
      } catch (error) {
        console.error('Could not fetch menus:', error);
      }
    };
    fetchMenus();
  }, []);

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelected = menus.map((n) => n._id);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  useEffect(() => {
    const result = menus.filter(
      (menu) =>
        menu.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        menu.description.toLowerCase().includes(searchQuery.toLowerCase()) // Add other fields if needed
    );
    setFilteredMenus(result);
  }, [searchQuery, menus]);

  const handleClick = (event, id) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }

    setSelected(newSelected);
  };

  const isSelected = (id) => selected.indexOf(id) !== -1;

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleDeleteSelected = async () => {
    Swal.fire({
      title: 'คุณแน่ใจหรือไม่?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'ใช่, ลบเลย!',
      cancelButtonText: 'ไม่, ยกเลิก!',
      reverseButtons: true,
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          // ลบข้อมูลด้วยการเรียก API
          await Promise.all(
            selected.map((id) => axios.delete(`http://localhost:3333/api/menus/${id}`))
          );
          toast.success(`${selected.length} item(s)ลบสำเร็จ`);
          setSelected([]);
          const response = await axios.get('http://localhost:3333/api/menus/allMenus');
          setMenus(response.data);
        } catch (error) {
          console.error('Failed to delete selected menus:', error);
          Swal.fire('เกิดข้อผิดพลาด!', 'ไม่สามารถลบข้อมูลได้. กรุณาลองใหม่อีกครั้ง.', 'error');
        }
      }
    });
  };

  return (
    <Container>
      <Box sx={{ width: '100%', overflow: 'hidden' }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={4}>
          <Typography variant="h4">
            <StyledDiv>เมนู</StyledDiv>
          </Typography>

          <Stack direction="row" spacing={2}>
            <Button
              variant="contained"
              color="error"
              startIcon={<Iconify icon="eva:trash-2-outline" />}
              onClick={handleDeleteSelected}
              disabled={selected.length === 0}
            >
              ลบ
            </Button>
            <Button
              variant="contained"
              color="inherit"
              startIcon={<Iconify icon="eva:plus-fill" />}
              onClick={() => navigate('/manage/menu')}
            >
              <StyledDiv>เพิ่มเมนู</StyledDiv>
            </Button>
          </Stack>
        </Stack>
        <TextField
          variant="outlined"
          label="Search เมนู"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{
            width: '300px', // fixed width, adjust as needed
            mb: 2,
            backgroundColor: 'background.paper', // adjust color based on your theme
            borderRadius: '20px',
            '& .MuiOutlinedInput-root': {
              '&.Mui-focused fieldset': {
                borderColor: 'primary.main', // color when the input is focused
              },
            },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Iconify icon="material-symbols:search" />
              </InputAdornment>
            ),
            style: {
              borderRadius: '20px',
            },
          }}
        />
        <TableContainer component={Paper} sx={{ maxHeight: 440 }}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox">
                  <Checkbox
                    color="primary"
                    indeterminate={selected.length > 0 && selected.length < menus.length}
                    checked={menus.length > 0 && selected.length === menus.length}
                    onChange={handleSelectAllClick}
                  />
                </TableCell>
                <TableCell>ชื่อเมนู</TableCell>
                <TableCell>รูปภาพ</TableCell>
                <TableCell>รายละเอียด</TableCell>
                <TableCell>ราคา</TableCell>
                <TableCell>ใบสูตร</TableCell>
              </TableRow>
            </TableHead>
            {/* Update the TableBody to use filteredMenus instead of menus */}
            <TableBody>
              {filteredMenus
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((menu, index) => {
                  const isItemSelected = isSelected(menu._id);
                  return (
                    <TableRow
                      key={menu._id}
                      hover
                      onClick={(event) => handleClick(event, menu._id)}
                      role="checkbox"
                      aria-checked={isItemSelected}
                      tabIndex={-1}
                      selected={isItemSelected}
                    >
                      <TableCell padding="checkbox">
                        <Checkbox color="primary" checked={isItemSelected} />
                      </TableCell>
                      <TableCell>{menu.name}</TableCell>
                      <TableCell>
                        <Avatar src={menu.image} alt={menu.name} variant="rounded" />
                      </TableCell>
                      <TableCell>{menu.description}</TableCell>
                      <TableCell>{`${menu.price.toFixed(2)} บาท`}</TableCell>
                      <TableCell
                        onClick={() => handleOpenModal(menu.recipe)}
                        style={{ cursor: 'pointer' }}
                      >
                        <Iconify icon="mingcute:paper-fill" width={24} height={24} />
                      </TableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
            <Modal
              open={openModal}
              onClose={handleCloseModal}
              aria-labelledby="recipe-modal-title"
              aria-describedby="recipe-modal-description"
            >
              <Box
                sx={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  width: 400,
                  bgcolor: 'background.paper',
                  boxShadow: 24,
                  p: 4,
                }}
              >
                <Typography id="recipe-modal-title" variant="h6" component="h2">
                  {currentRecipe?.name}
                </Typography>
                <Typography id="recipe-modal-description" sx={{ mt: 2 }}>
                  สูตร:
                  <ul>
                    {currentRecipe?.ingredients.map((ingredient) => {
                      const inventoryItem = inventoryItems.find(
                        (item) => item._id === ingredient.inventoryItemId.toString()
                      );

                      // Default unit is 'กรัม'.
                      let unit = 'กรัม';

                      // Check if the inventory item name suggests it's a liquid, but not a type of sugar.
                      if (
                        inventoryItem?.name.includes('น้ำ') ||
                        inventoryItem?.name.includes('นม')
                      ) {
                        if (
                          !inventoryItem?.name.includes('น้ำตาล') &&
                          !inventoryItem?.name.includes('ทราย')
                        ) {
                          unit = 'ml';
                        }
                      }

                      return (
                        <li key={ingredient.inventoryItemId}>
                          {inventoryItem?.name}: {ingredient.quantity} {unit}
                        </li>
                      );
                    })}
                  </ul>
                </Typography>
                {/* If you have a method or other recipe details, you can display them here */}
              </Box>
            </Modal>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={menus.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Box>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </Container>
  );
}

export default MenuTable;
