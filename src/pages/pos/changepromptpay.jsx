import axios from 'axios';
import Swal from 'sweetalert2';
import styled1 from 'styled-components';
import 'react-toastify/dist/ReactToastify.css';
import React, { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';

import {
  Box,
  Stack,
  Select,
  Button,
  MenuItem,
  Container,
  TextField,
  Typography,
  FormControl,
} from '@mui/material';

const AddPhonePage = () => {
  const StyledDiv = styled1.div`
    font-family: 'Prompt', sans-serif;
  `;
  const [phoneNumber, setPhoneNumber] = useState('');
  const [addError, setAddError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [phoneNumbers, setPhoneNumbers] = useState([]);
  const [promptPayNumbers, setPromptPayNumbers] = useState([]);
  const [selectedPhoneNumber, setSelectedPhoneNumber] = useState('');

  useEffect(() => {
    fetchPhoneNumbers();
    fetchPromptPayPhoneNumbers();
  }, []);

  const handleAddPhone = async () => {
    try {
      if (!phoneNumber.trim()) {
        throw new Error('Phone number is required');
      }
      await axios.post('https://test-api-01.azurewebsites.net/api/phonenumber/add', {
        phoneNumber,
      });
      setPhoneNumber('');
      setSuccess(true);
      setAddError(null);
      fetchPhoneNumbers();
      toast.success('เพิ่มหมายเลขโทรศัพท์สำเร็จแล้ว');
    } catch (err) {
      setAddError(err.response?.data?.error || 'เพิ่มไม่สำเร็จ');
      setSuccess(false);
    }
  };

  const fetchPhoneNumbers = async () => {
    try {
      const response = await axios.get('https://test-api-01.azurewebsites.net/api/phonenumber/all');
      setPhoneNumbers(response.data);
    } catch (error) {
      console.error('Error fetching phone numbers:', error);
    }
  };

  const handleAddPromptPay = async () => {
    try {
      const selectedPromptPayId = '662bdf1e0fd21950ee6cdefa';
      await axios.post('https://test-api-01.azurewebsites.net/api/promptpay/addOrUpdate', {
        id: selectedPromptPayId,
        phoneNumber: selectedPhoneNumber,
      });
      setSuccess(true);
      setAddError(null);
      toast.success('เปลี่ยนเบอร์สำเร็จแล้ว');
    } catch (error) {
      console.error('Error adding PromptPay:', error);
      setSuccess(false);
    }
  };

  const fetchPromptPayPhoneNumbers = async () => {
    try {
      const response = await axios.get('https://test-api-01.azurewebsites.net/api/promptpay/all');
      setPromptPayNumbers(response.data.split(', ')); // Split the response data into an array
    } catch (error) {
      console.error('Error fetching promptpay phone numbers:', error);
    }
  };

  const handleChangePhoneNumber = (event) => {
    setSelectedPhoneNumber(event.target.value);
  };

  const handleDeletePhoneNumber = async (id) => {
    try {
      const result = await Swal.fire({
        title: 'คุณแน่ใจหรือไม่?',
        text: 'คุณต้องการลบหมายเลขโทรศัพท์นี้หรือไม่?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'ใช่',
        cancelButtonText: 'ยกเลิก',
      });

      if (result.isConfirmed) {
        await axios.delete(`https://test-api-01.azurewebsites.net/api/phonenumber/delete/${id}`);
        fetchPhoneNumbers();
        Swal.fire('ลบแล้ว!', 'หมายเลขโทรศัพท์ถูกลบแล้ว', 'success');
      }
    } catch (error) {
      console.error('Error deleting phone number:', error);
      Swal.fire('เกิดข้อผิดพลาด!', 'มีข้อผิดพลาดเกิดขึ้นในขณะที่พยายามลบหมายเลขโทรศัพท์', 'error');
    }
  };

  return (
    <Container>
      <ToastContainer />
      <Box sx={{ width: '100%', overflow: 'hidden' }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            <StyledDiv>จัดการ PromptPay </StyledDiv>
          </Typography>
        </Stack>

        <Box marginBottom={2}>
          <TextField
            label="เพิ่มหมายเลขโทรศัพท์"
            variant="outlined"
            fullWidth
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleAddPhone}
            style={{ marginTop: '1rem' }}
          >
            <StyledDiv>เพิ่ม </StyledDiv>
          </Button>
        </Box>
        {addError && (
          <Typography variant="body1" color="error" gutterBottom>
            <StyledDiv> {addError} </StyledDiv>
          </Typography>
        )}
        {success && (
          <Typography variant="body1" color="primary" gutterBottom>
            <StyledDiv>เพิ่มสำเร็จ</StyledDiv>
          </Typography>
        )}

        <FormControl fullWidth style={{ marginTop: '2rem' }}>
          <Select
            value={selectedPhoneNumber}
            onChange={handleChangePhoneNumber}
            displayEmpty
            inputProps={{ 'aria-label': 'Select phone number' }}
          >
            <MenuItem value="" disabled>
              <StyledDiv>เลือกหมายเลขโทรศัพท์ </StyledDiv>
            </MenuItem>
            {/* เราจะเพิ่ม PromptPay เข้าไปในตัวเลือกของ Select Component */}
            {phoneNumbers.map((phone) => (
              <MenuItem key={phone._id} value={phone.phoneNumber}>
                {phone.phoneNumber}
              </MenuItem>
            ))}
            {/* {promptPayNumbers.map((promptPayNumber, index) => (
              <MenuItem key={index} value={promptPayNumber}>
                {promptPayNumber}
              </MenuItem>
            ))} */}
          </Select>
        </FormControl>

        <Button
          variant="contained"
          color="primary"
          onClick={handleAddPromptPay}
          style={{ marginTop: '1rem' }}
        >
          <StyledDiv>เปลี่ยนเบอร์โทรศัพท์ </StyledDiv>
        </Button>
        <Typography
          variant="body1"
          gutterBottom
          style={{ fontWeight: 'bold', textAlign: 'center' }}
        >
          <StyledDiv>เลข PromptPay ปัจจุบัน: </StyledDiv>
          <StyledDiv style={{ color: 'red' }}>{promptPayNumbers.join(', ')}</StyledDiv>
        </Typography>

        <Box marginTop={4}>
          <Typography variant="h6" gutterBottom>
            <StyledDiv>ตารางข้อมูลโทรศัพท์</StyledDiv>
          </Typography>
          <table>
            <thead>
              <tr>
                <th>
                  <StyledDiv>ลำดับ</StyledDiv>
                </th>
                <th>
                  <StyledDiv>หมายเลขโทรศัพท์</StyledDiv>
                </th>
              </tr>
            </thead>
            <tbody>
              {phoneNumbers.map((phone, index) => (
                <tr key={phone._id}>
                  <td>
                    <StyledDiv>{index + 1}</StyledDiv>
                  </td>
                  <td>
                    <StyledDiv>{phone.phoneNumber}</StyledDiv>
                  </td>
                  <td>
                    <Button
                      variant="outlined"
                      color="secondary"
                      onClick={() => handleDeletePhoneNumber(phone._id)}
                    >
                      <StyledDiv>ลบ</StyledDiv>
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Box>
      </Box>
    </Container>
  );
};

export default AddPhonePage;
