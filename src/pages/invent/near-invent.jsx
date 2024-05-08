import axios from 'axios';
import PropTypes from 'prop-types';
import { Icon } from '@iconify/react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';

import {
  Box,
  Badge,
  Stack,
  Paper,
  Table,
  Button,
  TableRow,
  TableCell,
  TableHead,
  Container,
  TableBody,
  Typography,
  TableContainer,
} from '@mui/material';

export default function InventoryItemsTable() {
  const StyledDiv = styled.div`
    font-family: 'Prompt', sans-serif;
  `;

  const navigate = useNavigate();

  const [nearEmptyItems, setNearEmptyItems] = useState([]);

  useEffect(() => {
    const fetchNearEmptyItems = async () => {
      try {
        const response = await axios.get(
          'https://test-api-01.azurewebsites.net/api/inventoryitems/nearEmpty'
        );
        setNearEmptyItems(response.data);
      } catch (error) {
        console.error('Error fetching near empty items:', error);
      }
    };
    fetchNearEmptyItems();
  }, []);

  const StyledTableCell = styled(TableCell)`
    color: ${({ isLower }) => (isLower ? 'red' : 'black')};
  `;

  StyledTableCell.propTypes = {
    children: PropTypes.node.isRequired,
    isLower: PropTypes.bool.isRequired,
  };

  return (
    <Container>
      <Box sx={{ width: '100%', overflow: 'hidden' }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={4}>
          <Typography variant="h4">
            <StyledDiv>วัตถุดิบใกล้หมด</StyledDiv>
          </Typography>
          <Stack direction="row" spacing={2}>
            <Button
              variant="contained"
              color="inherit"
              startIcon={<Icon icon="carbon:settings-adjust" />}
              onClick={() => navigate('/edit/edit-near-invent')}
            >
              <StyledDiv>ปรับวัตถุดิบเมื่อใกล้หมด</StyledDiv>
            </Button>
          </Stack>
        </Stack>
        <br />
        <Paper>
          <TableContainer component={Paper} sx={{ maxHeight: 440 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ชื่อวัตถุดิบ</TableCell>
                  <TableCell>ปริมาณใน Stock</TableCell>
                  <TableCell>หน่วยนับ</TableCell>
                  <TableCell>ประเภท</TableCell>
                  <TableCell>สถานะ</TableCell> {/* เพิ่มส่วนของสถานะ */}
                </TableRow>
              </TableHead>
              <TableBody>
                {nearEmptyItems.map((item) => (
                  <TableRow key={item._id}>
                    <TableCell>{item.name}</TableCell>
                    <StyledTableCell isLower={item.quantityInStock < item.isLower}>
                      {item.quantityInStock}
                    </StyledTableCell>
                    <TableCell>{item.unit}</TableCell>
                    <TableCell>{item.type}</TableCell>
                    <TableCell>
                      <Badge
                        badgeContent={item.quantityInStock === 0 ? 'หมด' : 'ใกล้'}
                        color={item.quantityInStock === 0 ? 'error' : 'warning'}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Box>
    </Container>
  );
}
