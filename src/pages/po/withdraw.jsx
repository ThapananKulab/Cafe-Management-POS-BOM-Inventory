import axios from 'axios';
import Swal from 'sweetalert2';
import { Icon } from '@iconify/react';
import styled from 'styled-components';
import React, { useState, useEffect } from 'react';

import {
  Stack,
  Table,
  TableRow,
  TableBody,
  TableCell,
  TableHead,
  Container,
  Typography,
  IconButton,
  TableContainer,
} from '@mui/material';

const PendingReceipts = () => {
  const StyledDiv = styled.div`
    font-family: 'Prompt', sans-serif;
  `;
  const [pendingReceipts, setPendingReceipts] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:3333/api/purchaseitem/pending');
        setPendingReceipts(response.data);
      } catch (error) {
        console.error('Error fetching pending receipts:', error);
      }
    };

    const interval = setInterval(() => {
      fetchData();
    }, 5000); // เรียก API ทุก 5 วินาที

    fetchData(); // เรียก API ครั้งแรกเมื่อคอมโพเนนต์ถูกโหลด

    return () => clearInterval(interval); // เมื่อคอมโพเนนต์ถูกถอดจาก DOM ให้เคลียร์ interval
  }, []);

  const handleWithdraw = async (purchaseReceiptId, itemId) => {
    try {
      const result = await Swal.fire({
        title: 'ยืนยันการเบิก',
        text: 'คุณแน่ใจหรือไม่ที่ต้องการที่จะเบิกรายการนี้?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'ใช่',
        cancelButtonText: 'ไม่',
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
      });

      if (result.isConfirmed) {
        console.log(
          `Trying to withdraw item with purchaseReceiptId ${purchaseReceiptId} and itemId ${itemId}`
        );

        const received = new Date();

        await axios.post('https://test-api-01.azurewebsites.net/api/purchaseitem/add-to-q', {
          purchaseReceiptId,
          selectedItemIds: [itemId],
          status: 'withdrawn',
          received,
        });

        console.log('Item withdrawn successfully');
      }
    } catch (error) {
      console.error('Error withdrawing items:', error);
    }
  };

  return (
    <Container>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <Typography variant="h4" style={{ marginBottom: '1rem' }}>
          <StyledDiv>โกดังร้าน</StyledDiv>
        </Typography>
      </Stack>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID ใบสั่งซื่อ</TableCell>
              {/* <TableCell>ID วัตถุดิบ</TableCell> */}
              <TableCell>ชื่อวัตถุดิบ</TableCell>
              <TableCell>ปริมาณ</TableCell>
              <TableCell>จำนวน</TableCell>
              <TableCell>สถานะ</TableCell>
              <TableCell>จัดการ</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {pendingReceipts.map((receipt) => {
              const purchaseId = receipt._id;
              return (
                <>
                  {receipt.items
                    .filter((item) => item.status === 'pending')
                    .map((item, index) => (
                      <TableRow key={item._id}>
                        {index === 0 && (
                          <TableCell
                            rowSpan={receipt.items.filter((it) => it.status === 'pending').length}
                          >
                            {purchaseId}
                          </TableCell>
                        )}
                        {/* <TableCell>{item._id}</TableCell> */}
                        <TableCell>{item.item.name}</TableCell>
                        <TableCell>{item.item.realquantity}</TableCell>
                        <TableCell>{item.quantity}</TableCell>
                        <TableCell>{item.status.replace('pending', 'รอดำเนินการ')}</TableCell>
                        <TableCell>
                          <IconButton
                            onClick={() => handleWithdraw(purchaseId, item.item._id)}
                            color="secondary"
                          >
                            <Icon icon="ph:hand-withdraw" />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                </>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default PendingReceipts;
