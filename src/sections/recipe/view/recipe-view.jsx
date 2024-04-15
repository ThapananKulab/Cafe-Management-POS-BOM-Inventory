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
  Select,
  Button,
  MenuItem,
  TableRow,
  TableBody,
  Container,
  TableCell,
  TableHead,
  TextField,
  InputLabel,
  Typography,
  FormControl,
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
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [editableRecipe, setEditableRecipe] = useState({ name: '', ingredients: [] });

  const [openDetailModal, setOpenDetailModal] = useState(false);
  const [selectedUnit, setSelectedUnit] = useState('กรัม');
  const [conversionValue, setConversionValue] = useState('');

  const convertToGram = () => {
    let gram = 0;
    if (!conversionValue || Number.isNaN(parseFloat(conversionValue))) {
      return gram; // ถ้าไม่มีค่าหรือไม่ใช่ตัวเลข ให้คืนค่าเป็น 0
    }

    if (selectedUnit === 'ช้อนชา') {
      gram = parseFloat(conversionValue) * 5;
    } else if (selectedUnit === 'ช้อนโต๊ะ') {
      gram = parseFloat(conversionValue) * 15;
    }
    return gram;
  };

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

  const handleIngredientChange = (e, ingIndex) => {
    const { name, value } = e.target;
    setEditableRecipe((prevState) => {
      const updatedIngredients = [...prevState.ingredients];
      updatedIngredients[ingIndex] = {
        ...updatedIngredients[ingIndex],
        [name]: value,
      };
      return { ...prevState, ingredients: updatedIngredients };
    });
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
        const response = await axios.get('http://localhost:3333/api/inventoryitems/all');
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
      const newTotalCost = calculateTotalCost().toFixed(2);
      const updatedRecipe = { ...editableRecipe, cost: newTotalCost };
      const response = await axios.put(
        `http://localhost:3333/api/recipes/update/${editableRecipe._id}`,
        updatedRecipe
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

  const calculateTotalCost = () => {
    let totalCost = 0;
    editableRecipe.ingredients.forEach((ingredient) => {
      const { unitPrice, realquantity } =
        inventoryItems.find((item) => {
          console.log('Ingredient ID:', ingredient.inventoryItemId?._id);
          console.log('Item ID:', item._id);
          return item._id === ingredient.inventoryItemId?._id;
        }) || {};
      if (unitPrice !== undefined && realquantity !== undefined) {
        const quantity = parseFloat(ingredient.quantity) || 0;
        const cost = (unitPrice * quantity) / realquantity;
        totalCost += parseFloat(cost.toFixed(2));
      }
    });

    return totalCost;
  };

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden', bgcolor: '#f9fafb' }}>
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={4}>
          <Typography variant="h4">
            <StyledDiv>ใบสูตร</StyledDiv>
          </Typography>
          <Stack direction="row" alignItems="center" justifyContent="flex-end" mb={4}>
            <Button
              variant="contained"
              color="inherit"
              startIcon={<Iconify icon="eva:plus-fill" />}
              onClick={() => navigate('/add-one-receip')}
            >
              <StyledDiv>เพิ่มเมนูเดี่ยว</StyledDiv>
            </Button>
            &nbsp;
            <Button
              variant="contained"
              color="inherit"
              startIcon={<Iconify icon="eva:plus-fill" />}
              onClick={() => navigate('/manage/recipe')}
            >
              <StyledDiv>เพิ่มสูตร</StyledDiv>
            </Button>
          </Stack>
        </Stack>
        <TableContainer sx={{ maxHeight: 440 }} component={Paper}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <StyledTableRow>
                <StyledTableCell>
                  <StyledDiv>ชื่อสูตร</StyledDiv>
                </StyledTableCell>
                <StyledTableCell align="right">
                  <StyledDiv>รายละเอียด</StyledDiv>
                </StyledTableCell>
                <StyledTableCell align="" />
              </StyledTableRow>
            </TableHead>
            <TableBody>
              {recipes.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((recipe) => (
                <StyledTableRow hover role="checkbox" tabIndex={-1} key={recipe._id.$oid}>
                  <StyledTableCell component="th" scope="row">
                    <Typography variant="body1" sx={{ fontWeight: 'bold', color: 'black' }}>
                      <StyledDiv>{recipe.name}</StyledDiv>
                    </Typography>

                    <Typography variant="body2" sx={{ mt: 0.5 }}>
                      <StyledDiv>ราคาต้นทุน: {recipe.cost} บาท</StyledDiv>
                    </Typography>
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
                          <strong>สูตร (หน่วยเป็นกรัม) ยกเว้นพวก ขนม</strong>
                          <Box sx={{ mt: 1 }}>
                            {selectedRecipe?.ingredients.map(
                              ({ inventoryItemId, quantity }, index) => {
                                const name = inventoryItemId?.name;
                                const unit = inventoryItemId?.unit;
                                return (
                                  <Typography key={index} variant="body2" sx={{ mt: 0.5 }}>
                                    {name} : <strong>{quantity}</strong> {unit}
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
              width: '80%',
              maxWidth: '1200px',
              maxHeight: '90vh',
              overflowY: 'auto',
              bgcolor: 'background.paper',
              border: '2px solid #000',
              boxShadow: 24,
              p: 4,
            }}
          >
            {selectedRecipe && (
              <>
                <Typography id="modal-modal-title" variant="h6" component="h2" mb={6}>
                  แก้ไขสูตร: {selectedRecipe.name}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  <FormControl>
                    <TextField
                      type="number"
                      value={conversionValue}
                      onChange={(e) => setConversionValue(e.target.value)}
                      fullWidth
                      mb={2}
                    />
                  </FormControl>
                  <InputLabel>หน่วย</InputLabel>
                  <Select value={selectedUnit} onChange={(e) => setSelectedUnit(e.target.value)}>
                    <MenuItem value="กรัม">กรัม</MenuItem>
                    <MenuItem value="ช้อนชา">ช้อนชา</MenuItem>
                    <MenuItem value="ช้อนโต๊ะ">ช้อนโต๊ะ</MenuItem>
                  </Select>
                  <Typography variant="body1">
                    {`${conversionValue} ${selectedUnit} เท่ากับ `}
                    <span style={{ fontWeight: 'bold', color: '#ff5722' }}>
                      {` ${convertToGram()} `}
                    </span>
                    กรัม
                  </Typography>
                </Box>

                <TextField
                  fullWidth
                  label="ชื่อสูตร"
                  sx={{ mb: 2, my: 2, mt: 2, maxWidth: 300, display: 'block', margin: 'auto' }}
                  value={editableRecipe?.name || ''}
                  onChange={(e) => setEditableRecipe({ ...editableRecipe, name: e.target.value })}
                />
                <br />
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
                      name="quantity"
                      value={ingredient.quantity}
                      onChange={(e) => handleIngredientChange(e, index)}
                    />
                    {ingredient.inventoryItemId?.unit}
                    <Button
                      color="error"
                      sx={{
                        padding: '10px 20px',
                        fontSize: '1rem',
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
                <Box sx={{ textAlign: 'center' }}>
                  <TextField
                    fullWidth
                    label="Total"
                    variant="outlined"
                    value={calculateTotalCost().toFixed(2)}
                    disabled
                    sx={{ width: '50%', textAlign: 'center' }}
                  />
                  <br />
                  <Button
                    sx={{
                      padding: '20px 40px',
                      fontSize: '1.5rem',
                      borderRadius: '8px',
                      margin: '5px',
                    }}
                    onClick={() =>
                      setEditableRecipe({
                        ...editableRecipe,
                        ingredients: [
                          ...editableRecipe.ingredients,
                          { inventoryItemId: null, quantity: '' },
                        ],
                      })
                    }
                  >
                    <Icon icon="streamline:add-1-solid" />
                  </Button>
                  <Button
                    sx={{
                      padding: '20px 40px',
                      fontSize: '1.5rem',
                      borderRadius: '8px',
                      margin: '5px',
                    }}
                    onClick={updateRecipe}
                  >
                    <Icon icon="formkit:submit" />
                  </Button>
                </Box>
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
