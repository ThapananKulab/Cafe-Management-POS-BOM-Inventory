import axios from 'axios';
import Swal from 'sweetalert2';
import React, { useState, useEffect } from 'react';

import {
  Box,
  List,
  Modal,
  Button,
  ListItem,
  Container,
  TextField,
  Typography,
  ListItemText,
} from '@mui/material';

const App = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [email, setEmail] = useState('');
  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const fetchSuppliers = async () => {
    try {
      const response = await axios.get('http://localhost:3333/api/supplier/suppliers');
      setSuppliers(response.data);
    } catch (error) {
      console.error('Error fetching suppliers:', error);
    }
  };

  const addSupplier = async () => {
    try {
      await axios.post('http://localhost:3333/api/supplier/suppliers', {
        name,
        phone,
        address,
        email,
      });
      fetchSuppliers();
      // ปิด Modal เมื่อเพิ่ม Supplier เรียบร้อย
      setOpenModal(false);
    } catch (error) {
      console.error('Error adding supplier:', error);
    }
  };

  const handleDeleteSupplier = async (supplierId) => {
    // แสดง Swal ก่อนลบ Supplier
    Swal.fire({
      title: 'คุณแน่ใจหรือไม่?',
      text: 'คุณต้องการลบ Supplier นี้หรือไม่?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'ใช่, ลบ',
      cancelButtonText: 'ยกเลิก',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`http://localhost:3333/api/supplier/suppliers/${supplierId}`);
          fetchSuppliers(); // รีเฟรชข้อมูลหลังจากลบเสร็จ
          // แสดง Swal แจ้งเตือนลบสำเร็จ
          Swal.fire('ลบสำเร็จ!', 'Supplier ถูกลบออกแล้ว', 'success');
        } catch (error) {
          console.error('Error deleting supplier:', error);
        }
      }
    });
  };

  return (
    <Container maxWidth="md" style={{ marginTop: '40px' }}>
      <Typography variant="h4" gutterBottom>
        ข้อมูล Supplier
      </Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={() => setOpenModal(true)}
        style={{ marginBottom: '20px' }}
      >
        เพิ่ม Supplier
      </Button>
      <List>
        {suppliers.map((supplier, index) => (
          <ListItem
            key={index}
            style={{ border: '1px solid #ccc', borderRadius: '5px', marginBottom: '10px' }}
          >
            <ListItemText
              primary={supplier.name}
              secondary={
                <div>
                  <div style={{ marginBottom: '5px' }}>เบอร์โทร: {supplier.phone}</div>
                  <div style={{ marginBottom: '5px' }}>อีเมล: {supplier.email}</div>
                  <div>ที่อยู่: {supplier.address}</div>
                </div>
              }
            />
            {/* เพิ่มปุ่มลบ */}
            <Button
              variant="outlined"
              color="secondary"
              onClick={() => handleDeleteSupplier(supplier._id)}
            >
              ลบ
            </Button>
          </ListItem>
        ))}
      </List>

      {/* Modal เพิ่ม Supplier */}
      <Modal open={openModal} onClose={() => setOpenModal(false)}>
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
          <Typography variant="h6" gutterBottom>
            เพิ่ม Supplier
          </Typography>
          <TextField
            label="ชื่อ Supplier"
            variant="outlined"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{ marginBottom: '10px', width: '100%' }}
          />
          <TextField
            label="เบอร์โทร"
            variant="outlined"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            style={{ marginBottom: '10px', width: '100%' }}
          />
          <TextField
            label="อีเมล"
            variant="outlined"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ marginBottom: '10px', width: '100%' }}
          />

          <TextField
            multiline
            rows={2} // กำหนดความสูงโดยการเพิ่มจำนวนบรรทัด
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            label="ที่อยู่"
            variant="outlined"
            fullWidth
            required
            style={{ marginBottom: '10px' }}
          />

          <Button
            variant="contained"
            color="primary"
            onClick={addSupplier}
            style={{ width: '100%' }}
          >
            เพิ่ม
          </Button>
        </Box>
      </Modal>
    </Container>
  );
};

export default App;
