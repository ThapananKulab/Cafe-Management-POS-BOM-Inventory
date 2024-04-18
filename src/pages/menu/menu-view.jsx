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
  Select,
  MenuItem,
  Checkbox,
  TableRow,
  TextField,
  TableBody,
  TableCell,
  TableHead,
  Container,
  Typography,
  InputLabel,
  FormControl,
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
  const [filteredMenus, setFilteredMenus] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const [openModal, setOpenModal] = useState(false);
  const [currentRecipe, setCurrentRecipe] = useState(null);
  const [inventoryItems, setInventoryItems] = useState([]);
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [updateData, setUpdateData] = useState({ name: '', description: '', price: 0 });
  const [recipes, setRecipes] = useState([]); // This line defines 'recipes'
  const [selectedFile, setSelectedFile] = useState(null);
  const [setUser] = useState(null);
  const [searchSweetLevel, setSearchSweetLevel] = useState('');
  const [searchType, setSearchType] = useState('');
  const [searchGlassSize, setSearchGlassSize] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('https://test-api-01.azurewebsites.net/api/authen', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const result = await response.json();
        if (result.status === 'ok') {
          setUser(result.decoded.user);
        } else {
          localStorage.removeItem('token');
          Swal.fire({
            icon: 'error',
            title: 'กรุณา Login ก่อน',
            text: result.message,
          });
          navigate('/');
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };
    fetchData();
  }, [navigate, setUser]);

  const sweetLevels = ['ปกติ', 'หวานน้อย', 'หวานมาก', 'ทั่วไป'];
  const types = ['ร้อน', 'เย็น', 'ปั่น', 'ทั่วไป'];
  const glassSize = ['ไม่มี', 'เล็ก', 'กลาง', 'ใหญ่'];

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const response = await axios.get('https://test-api-01.azurewebsites.net/api/recipes/all');
        setRecipes(response.data);
      } catch (error) {
        console.error('Failed to fetch recipes', error);
      }
    };

    fetchRecipes();
  }, []);

  const handleUpdateSelected = async () => {
    if (selected.length === 1) {
      const menuItemId = selected[0];
      await fetchMenuItemDetails(menuItemId);
      setUpdateModalOpen(true);
    }
  };

  useEffect(() => {
    const fetchInventoryItems = async () => {
      const { data } = await axios.get(
        'https://test-api-01.azurewebsites.net/api/inventoryitems/all'
      );
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

  const handleFileChange = (event) => {
    if (event.target.files.length > 0) {
      setSelectedFile(event.target.files[0]);
    } else {
      setSelectedFile(null);
    }
  };

  const fetchMenus = async () => {
    try {
      const response = await axios.get('https://test-api-01.azurewebsites.net/api/menus/allMenus');
      setMenus(response.data);
    } catch (error) {
      console.error('Could not fetch menus:', error);
    }
  };

  useEffect(() => {
    fetchMenus();

    const intervalId = setInterval(fetchMenus, 5000);

    return () => clearInterval(intervalId);
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
    const result = menus
      .filter(
        (menu) =>
          menu.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          menu.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          menu.price.toString().includes(searchQuery) ||
          menu.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
          menu.sweetLevel.toLowerCase().includes(searchQuery.toLowerCase()) ||
          menu.glassSize.toLowerCase().includes(searchQuery.toLowerCase())
      )
      .filter((menu) => menu.sweetLevel.toLowerCase().includes(searchSweetLevel.toLowerCase()))
      .filter((menu) => menu.type.toLowerCase().includes(searchType.toLowerCase()))
      .filter((menu) => menu.glassSize.toLowerCase().includes(searchGlassSize.toLowerCase()));
    setFilteredMenus(result);
  }, [searchQuery, searchSweetLevel, searchType, searchGlassSize, menus]);

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
      confirmButtonText: 'ใช่',
      cancelButtonText: 'ยกเลิก!',
      reverseButtons: true,
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await Promise.all(
            selected.map((id) =>
              axios.delete(`https://test-api-01.azurewebsites.net/api/menus/${id}`)
            )
          );
          // toast.success(`${selected.length} item(s)ลบสำเร็จ`);
          toast.success(`ลบสำเร็จ`);
          setSelected([]);
          const response = await axios.get(
            'https://test-api-01.azurewebsites.net/api/menus/allMenus'
          );
          setMenus(response.data);
        } catch (error) {
          console.error('Failed to delete selected menus:', error);
          Swal.fire('เกิดข้อผิดพลาด!', 'ไม่สามารถลบข้อมูลได้. กรุณาลองใหม่อีกครั้ง.', 'error');
        }
      }
    });
  };

  const fetchMenuItemDetails = async (menuItemId) => {
    try {
      const response = await axios.get(
        `https://test-api-01.azurewebsites.net/api/menus/menu/${menuItemId}`
      );
      const menuItemDetails = response.data;

      setUpdateData({
        ...menuItemDetails,
        recipe: menuItemDetails.recipe._id,
      });
    } catch (error) {
      console.error('Failed to fetch menu item details', error);
    }
  };

  const handleUpdateMenu = async () => {
    const formData = new FormData();
    Object.keys(updateData).forEach((key) => {
      if (key !== 'image') {
        formData.append(key, updateData[key]);
      }
    });

    if (selectedFile) {
      formData.append('image', selectedFile);
    }

    try {
      await axios.put(
        `https://test-api-01.azurewebsites.net/api/menus/${updateData._id}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      toast.success('แก้ไขเมนูสำเร็จ');
      setUpdateModalOpen(false);
    } catch (error) {
      console.error('Failed to update menu item:', error);
      toast.error('Failed to update menu item');
    }
  };

  return (
    <Container>
      <Box sx={{ width: '100%', overflow: 'hidden' }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={4}>
          <Typography variant="h4">
            <StyledDiv>เมนู</StyledDiv>
          </Typography>

          <Stack direction="row" spacing={2}>
            {/* {user && user.role === 'เจ้าของร้าน' && (
              <> */}
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
              color="primary"
              startIcon={<Iconify icon="eva:edit-fill" />}
              onClick={handleUpdateSelected}
              disabled={selected.length !== 1}
            >
              แก้ไข
            </Button>
            {/* </>
            )} */}
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
            width: '300px',
            mb: 2,
            backgroundColor: 'background.paper',
            borderRadius: '20px',
            '& .MuiOutlinedInput-root': {
              '&.Mui-focused fieldset': {
                borderColor: 'primary.main',
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
        <Stack direction="row" spacing={2}>
          <FormControl fullWidth margin="normal">
            <InputLabel id="sweetLevel-select-label">ความหวาน</InputLabel>
            <Select
              labelId="sweetLevel-select-label"
              id="sweetLevel-select"
              value={searchSweetLevel}
              label="Sweet Level"
              onChange={(e) => setSearchSweetLevel(e.target.value)}
            >
              <MenuItem value="">ทั้งหมด</MenuItem>
              {sweetLevels.map((level) => (
                <MenuItem key={level} value={level}>
                  {level}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth margin="normal">
            <InputLabel id="type-select-label">ประเภท</InputLabel>
            <Select
              labelId="type-select-label"
              id="type-select"
              value={searchType}
              label="Type"
              onChange={(e) => setSearchType(e.target.value)}
            >
              <MenuItem value="">ทั้งหมด</MenuItem>
              {types.map((type) => (
                <MenuItem key={type} value={type}>
                  {type}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth margin="normal">
            <InputLabel id="glassSize-select-label">ขนาดแก้ว</InputLabel>
            <Select
              labelId="glassSize-select-label"
              id="glassSize-select"
              value={searchGlassSize}
              label="Glass Size"
              onChange={(e) => setSearchGlassSize(e.target.value)}
            >
              <MenuItem value="">ทั้งหมด</MenuItem>
              {glassSize.map((size) => (
                <MenuItem key={size} value={size}>
                  {size}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Stack>

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
                <TableCell>ประเภท</TableCell>
                <TableCell>รสชาติ</TableCell>
                <TableCell>ขนาดแก้ว</TableCell>
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
                      <TableCell>{menu.type}</TableCell>
                      <TableCell>{menu.sweetLevel}</TableCell>
                      <TableCell>{menu.glassSize}</TableCell>
                      <TableCell>{menu.description}</TableCell>
                      <TableCell>{`${menu.price.toFixed(2)} บาท`}</TableCell>
                      <TableCell
                        onClick={() => handleOpenModal(menu.recipe)}
                        style={{ cursor: 'pointer' }}
                      >
                        {menu.recipe ? (
                          <Iconify icon="mingcute:paper-fill" width={24} height={24} />
                        ) : (
                          'ไม่มีสูตร'
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
            </TableBody>

            <Modal
              open={updateModalOpen}
              onClose={() => setUpdateModalOpen(false)}
              aria-labelledby="update-modal-title"
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Box
                sx={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  width: 400, // คุณสามารถปรับค่านี้ตามที่ต้องการ
                  maxWidth: '90%', // กำหนดค่าสูงสุดของความกว้างไม่ให้เกิน 90% ของ viewport
                  maxHeight: '90vh', // กำหนดค่าสูงสุดของความสูงไม่ให้เกิน 90vh
                  overflowY: 'auto', // เพิ่ม scrollbar ในกรณีที่เนื้อหาภายในมีความสูงเกินกว่ากำหนด
                  bgcolor: 'background.paper',
                  boxShadow: 24,
                  p: 4,
                  borderRadius: 2,
                }}
              >
                <Typography id="update-modal-title" variant="h6" component="h2" sx={{ mb: 2 }}>
                  แก้ไขเมนู
                </Typography>
                <FormControl fullWidth margin="normal">
                  <InputLabel id="recipe-select-label">Recipe</InputLabel>
                  <Select
                    labelId="recipe-select-label"
                    value={updateData.recipe}
                    label="Recipe"
                    onChange={(e) => setUpdateData({ ...updateData, recipe: e.target.value })}
                  >
                    {recipes.map((recipe) => (
                      <MenuItem key={recipe._id} value={recipe._id}>
                        {recipe.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <TextField
                  label="Name"
                  value={updateData.name}
                  onChange={(e) => setUpdateData({ ...updateData, name: e.target.value })}
                  fullWidth
                  margin="normal"
                />
                <TextField
                  label="Price"
                  type="number"
                  value={updateData.price}
                  onChange={(e) => setUpdateData({ ...updateData, price: e.target.value })}
                  fullWidth
                  margin="normal"
                />
                <FormControl fullWidth margin="normal">
                  <InputLabel id="sweetLevel-select-label">Sweet Level</InputLabel>
                  <Select
                    labelId="sweetLevel-select-label"
                    id="sweetLevel-select"
                    value={updateData.sweetLevel}
                    label="Sweet Level"
                    onChange={(e) => setUpdateData({ ...updateData, sweetLevel: e.target.value })}
                  >
                    {sweetLevels.map((level) => (
                      <MenuItem key={level} value={level}>
                        {level}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <FormControl fullWidth margin="normal">
                  <InputLabel id="type-select-label">Type</InputLabel>
                  <Select
                    labelId="type-select-label"
                    id="type-select"
                    value={updateData.type}
                    label="Type"
                    onChange={(e) => setUpdateData({ ...updateData, type: e.target.value })}
                  >
                    {types.map((type) => (
                      <MenuItem key={type} value={type}>
                        {type}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <FormControl fullWidth margin="normal">
                  <InputLabel id="sweetLevel-select-label">glassSize</InputLabel>
                  <Select
                    labelId="sweetLevel-select-label"
                    id="sweetLevel-select"
                    value={updateData.glassSize}
                    label="Sweet Level"
                    onChange={(e) => setUpdateData({ ...updateData, glassSize: e.target.value })}
                  >
                    {glassSize.map((size) => (
                      <MenuItem key={size} value={size}>
                        {size}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <TextField
                  label="Description"
                  value={updateData.description}
                  onChange={(e) => setUpdateData({ ...updateData, description: e.target.value })}
                  fullWidth
                  margin="normal"
                  multiline
                  rows={3}
                />
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    mt: 3,
                  }}
                >
                  <Avatar
                    src={updateData.image}
                    alt="รูปภาพเมนู"
                    variant="rounded"
                    sx={{ width: 100, height: 100, mb: 2 }}
                  />
                  <Button variant="outlined" component="label" sx={{ mb: 2 }}>
                    อัปโหลดรูป
                    <input type="file" hidden onChange={handleFileChange} />
                  </Button>
                </Box>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                    mt: 3,
                    width: '100%',
                  }}
                >
                  <Box
                    sx={{
                      width: '100%',
                    }}
                  >
                    <Button
                      onClick={handleUpdateMenu}
                      variant="contained"
                      color="warning"
                      fullWidth
                    >
                      แก้ไข
                    </Button>
                  </Box>
                </Box>
              </Box>
            </Modal>

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

                      return (
                        <li key={ingredient.inventoryItemId}>
                          {inventoryItem?.name}: {ingredient.quantity} {inventoryItem?.unit}
                        </li>
                      );
                    })}
                  </ul>
                </Typography>
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
