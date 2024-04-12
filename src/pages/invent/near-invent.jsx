import axios from 'axios';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import React, { useState, useEffect } from 'react';

import {
  Box,
  Paper,
  Table,
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
  const [nearEmptyItems, setNearEmptyItems] = useState([]);

  useEffect(() => {
    const fetchNearEmptyItems = async () => {
      try {
        const response = await axios.get('http://localhost:3333/api/inventoryitems/nearEmpty');
        setNearEmptyItems(response.data);
      } catch (error) {
        console.error('Error fetching near empty items:', error);
      }
    };
    fetchNearEmptyItems();
  }, []);

  const StyledTableCell = styled(({ item, children, ...props }) => (
    <TableCell {...props}>{children}</TableCell>
  ))`
    color: ${({ item }) => (item.quantityInStock <= 10 ? 'red' : 'black')};
  `;

  StyledTableCell.propTypes = {
    children: PropTypes.node.isRequired,
    item: PropTypes.object.isRequired,
  };

  return (
    <Container>
      <Box sx={{ width: '100%', overflow: 'hidden' }}>
        <Typography variant="h4">
          <StyledDiv>วัตถุดิบใกล้หมด</StyledDiv>
        </Typography>
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
                  {/* <TableCell>Status</TableCell> */}
                </TableRow>
              </TableHead>
              <TableBody>
                {nearEmptyItems.map((item) => (
                  <TableRow key={item._id}>
                    <TableCell>{item.name}</TableCell>
                    <StyledTableCell item={item}>{item.quantityInStock}</StyledTableCell>
                    <TableCell>{item.unit}</TableCell>
                    <TableCell>{item.type}</TableCell>
                    {/* <TableCell>{item.status}</TableCell> */}
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
