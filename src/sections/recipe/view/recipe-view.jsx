import axios from 'axios';
import Swal from 'sweetalert2';
import { Icon } from '@iconify/react';
import styled1 from 'styled-components';
import { useNavigate } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import React, { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';

import { styled } from '@mui/material/styles';
import {
  Box,
  Table,
  Paper,
  Stack,
  Modal,
  Button,
  TableRow,
  TableBody,
  Container,
  TableCell,
  TableHead,
  TextField,
  Typography,
  Autocomplete,
  TableContainer,
  TablePagination,
  tableCellClasses,
} from '@mui/material';

import Iconify from 'src/components/iconify';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

function RecipeTable() {
  const StyledDiv = styled1.div`
  font-family: 'Prompt', sans-serif;
`;

  const [recipes, setRecipes] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const navigate = useNavigate();
  const [openModal, setOpenModal] = useState(false);

  const [inventoryItems, setInventoryItems] = useState([]);
  const [selectedRecipe, setSelectedRecipe] = useState(null); // ตัวอย่าง state สำหรับการเลือกสูตรอาหาร
  const [editableRecipe, setEditableRecipe] = useState({ name: '', ingredients: [] });
  const [openDetailModal, setOpenDetailModal] = useState(false);

  const handleOpenModal = (recipe) => {
    setSelectedRecipe(recipe);
    const editableCopy = { ...recipe, ingredients: [...recipe.ingredients] };
    setEditableRecipe(editableCopy);
    setOpenModal(true);
  };

  const handleOpenDetailModal = (recipe) => {
    setSelectedRecipe(recipe);
    setOpenDetailModal(true);
  };

  const handleCloseDetailModal = () => {
    setOpenDetailModal(false);
  };

  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };

  useEffect(() => {
    const fetchInventoryItems = async () => {
      try {
        const response = await axios.get('http://localhost:3333/api/inventoryitems/all'); // ปรับ URL ตาม endpoint ของคุณ
        setInventoryItems(response.data);
      } catch (error) {
        console.error('Failed to fetch inventory items:', error);
      }
    };

    fetchInventoryItems();
  }, []);
  useEffect(() => {
    fetchRecipes();
  }, []);

  const fetchRecipes = async () => {
    try {
      const response = await axios.get('http://localhost:3333/api/recipes/all');
      setRecipes(response.data);
    } catch (error) {
      console.error('Failed to fetch recipes:', error);
    }
  };

  const updateRecipe = async () => {
    try {
      const response = await axios.put(
        `http://localhost:3333/api/recipes/update/${editableRecipe._id}`,
        editableRecipe
      );
      console.log('Recipe updated:', response.data);
      fetchRecipes();
      setOpenModal(false);
      toast.success('แก้ไขสูตรสำเร็จ', {
        position: 'top-right',
        autoClose: 1000,
      });
    } catch (error) {
      console.error('แก้ไขสูตรไม่สำเร็จ', error);
      toast.error('Failed to update recipe.', {
        position: 'top-right',
        autoClose: 1000,
      });
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const deleteRecipe = async (recipeId) => {
    try {
      console.log('Attempting to delete recipe with ID:', recipeId);

      const willDelete = await Swal.fire({
        title: 'คุณแน่ใจใช่ไหม',
        text: 'คุณจะไม่สามารถกู้คืนข้อมูลนี้ได้',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'ใช่',
        cancelButtonText: 'ไม่',
      });

      if (willDelete.isConfirmed) {
        const response = await axios.delete(`http://localhost:3333/api/recipes/delete/${recipeId}`);
        console.log('Recipe deleted:', response.data);
        fetchRecipes();

        toast.success('Recipe deleted successfully!', {
          position: 'top-right',
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }
    } catch (error) {
      console.error('Failed to delete recipe:', error);

      toast.error('Failed to delete recipe.', {
        position: 'top-right',
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden', bgcolor: '#f9fafb' }}>
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={4}>
          <Typography variant="h4">
            <StyledDiv>ใบสูตร</StyledDiv>
          </Typography>
          <Button
            variant="contained"
            color="inherit"
            startIcon={<Iconify icon="eva:plus-fill" />}
            onClick={() => navigate('/manage/recipe')}
          >
            <StyledDiv>เพิ่มสูตร</StyledDiv>
          </Button>
        </Stack>
        <TableContainer sx={{ maxHeight: 440 }} component={Paper}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <StyledTableRow>
                <StyledTableCell>ชื่อสูตร</StyledTableCell>
                <StyledTableCell align="right">รายละเอียด</StyledTableCell>
                <StyledTableCell align="center">แก้ไขสูตร</StyledTableCell>
              </StyledTableRow>
            </TableHead>
            <TableBody>
              {recipes.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((recipe) => (
                <StyledTableRow hover role="checkbox" tabIndex={-1} key={recipe._id.$oid}>
                  <StyledTableCell component="th" scope="row">
                    {recipe.name}
                  </StyledTableCell>
                  <StyledTableCell align="right">
                    <Button onClick={() => handleOpenDetailModal(recipe)}>
                      <Icon
                        icon="lets-icons:paper"
                        style={{ fontSize: '24px', width: '24px', height: '24px' }}
                      />
                    </Button>
                  </StyledTableCell>
                  <Modal
                    open={openDetailModal}
                    onClose={handleCloseDetailModal}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                  >
                    <Box sx={style}>
                      <Typography id="modal-modal-title" variant="h6" component="h2" sx={{ mb: 2 }}>
                        {selectedRecipe?.name || 'Recipe Details'}
                      </Typography>
                      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                        <Typography
                          variant="body1"
                          component="div"
                          sx={{ fontWeight: 'bold', mb: 1 }}
                        >
                          <strong>สูตร</strong>
                          <Box sx={{ mt: 1 }}>
                            {selectedRecipe?.ingredients.map(
                              ({ inventoryItemId, quantity }, index) => {
                                const name = inventoryItemId?.name || 'Item';
                                let unit = 'กรัม';
                                if (name.includes('น้ำ') || name.includes('นม')) {
                                  if (!name.includes('น้ำตาล') && !name.includes('ทราย')) {
                                    unit = 'ml';
                                  }
                                }
                                return (
                                  <Typography key={index} variant="body2" sx={{ mt: 0.5 }}>
                                    {name}: {quantity} {unit}
                                  </Typography>
                                );
                              }
                            )}
                          </Box>
                        </Typography>
                      </Box>
                    </Box>
                  </Modal>
                  <StyledTableCell align="right">
                    <Button onClick={() => handleOpenModal(recipe)}>
                      <Icon
                        icon="akar-icons:edit"
                        style={{ fontSize: '24px', width: '24px', height: '24px' }}
                      />
                    </Button>
                    <Button onClick={() => deleteRecipe(recipe._id)} color="error">
                      <Icon
                        icon="bi:trash-fill"
                        style={{ fontSize: '24px', width: '24px', height: '24px' }}
                      />
                    </Button>
                  </StyledTableCell>
                </StyledTableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Modal
          open={openModal}
          onClose={() => setOpenModal(false)}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
          PaperProps={{
            sx: {
              maxWidth: '600px', // กำหนดความกว้างสูงสุด
              maxHeight: '90vh', // กำหนดความสูงสูงสุด
              width: 'auto', // ให้ความกว้างเป็นอัตโนมัติตามเนื้อหา
              height: 'auto', // ให้ความสูงเป็นอัตโนมัติตามเนื้อหา
              overflow: 'auto', // เพิ่ม scrollbar หากเนื้อหาเกินขนาด
            },
          }}
        >
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '80%', // Use a percentage of the viewport width for responsiveness
              maxWidth: '1200px', // Optional: Set a maximum width to ensure it doesn't get too large on bigger screens
              maxHeight: '90vh',
              overflowY: 'auto', // Enable vertical scrolling within the modal if content overflows
              bgcolor: 'background.paper',
              border: '2px solid #000',
              boxShadow: 24,
              p: 4,
            }}
          >
            {selectedRecipe && (
              <>
                <Typography id="modal-modal-title" variant="h6" component="h2">
                  แก้ไขสูตร: {selectedRecipe.name}
                </Typography>
                <TextField
                  fullWidth
                  label="ชื่อสูตร"
                  sx={{ my: 2 }}
                  value={editableRecipe?.name || ''}
                  onChange={(e) => setEditableRecipe({ ...editableRecipe, name: e.target.value })}
                />
                {editableRecipe?.ingredients.map((ingredient, index) => (
                  <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                    <Autocomplete
                      fullWidth
                      options={inventoryItems}
                      getOptionLabel={(option) => option.name}
                      value={ingredient.inventoryItemId || null}
                      onChange={(event, newValue) => {
                        setEditableRecipe({
                          ...editableRecipe,
                          ingredients: editableRecipe.ingredients.map((ing, ingIndex) =>
                            index === ingIndex
                              ? {
                                  ...ing,
                                  inventoryItemId: newValue || { name: '', id: null },
                                }
                              : ing
                          ),
                        });
                      }}
                      renderInput={(params) => <TextField {...params} label="วัตถุดิบ" />}
                    />
                    <TextField
                      fullWidth
                      label="ปริมาณ"
                      type="number"
                      value={ingredient.quantity || ''}
                      onChange={(e) =>
                        setEditableRecipe({
                          ...editableRecipe,
                          ingredients: editableRecipe.ingredients.map((ing, ingIndex) =>
                            index === ingIndex ? { ...ing, quantity: e.target.value } : ing
                          ),
                        })
                      }
                    />
                    กรัม
                    <Button
                      color="error"
                      sx={{
                        padding: '10px 20px', // Increase padding for a larger button
                        fontSize: '1rem', // Adjust font size as needed
                      }}
                      onClick={() =>
                        setEditableRecipe({
                          ...editableRecipe,
                          ingredients: editableRecipe.ingredients.filter(
                            (_, ingIndex) => index !== ingIndex
                          ),
                        })
                      }
                    >
                      <Icon icon="streamline:delete-1-solid" />
                    </Button>
                  </Box>
                ))}
                <Button
                  sx={{
                    padding: '20px 40px', // Match padding for consistency
                    fontSize: '1.5rem', // Match font size for a consistent look
                    borderRadius: '8px', // Optional: Rounded corners
                    margin: '5px', // Optional: Space between buttons
                  }}
                  onClick={() =>
                    setEditableRecipe({
                      ...editableRecipe,
                      ingredients: [
                        ...editableRecipe.ingredients,
                        { inventoryItemId: null, quantity: '' }, // ทำให้เป็นโครงสร้างเปล่าสำหรับเลือกจาก Autocomplete
                      ],
                    })
                  }
                >
                  <Icon icon="streamline:add-1-solid" />
                </Button>
                <Button
                  sx={{
                    padding: '20px 40px', // Match padding for consistency
                    fontSize: '1.5rem', // Match font size for a consistent look
                    borderRadius: '8px', // Optional: Rounded corners
                    margin: '5px', // Optional: Space between buttons
                  }}
                  onClick={updateRecipe}
                >
                  <Icon icon="formkit:submit" />
                </Button>
              </>
            )}
          </Box>
        </Modal>

        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={recipes.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
        <ToastContainer />
      </Container>
    </Paper>
  );
}

export default RecipeTable;
