import axios from 'axios';
import Swal from 'sweetalert2';
import { Icon } from '@iconify/react';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Box, Button, Select, MenuItem, TextField, InputLabel, FormControl } from '@mui/material';

import './style.css';

const UserForm = () => {
  // State hooks for form fields
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [role, setRole] = useState('');
  const [image, setImage] = useState(null); // For storing the uploaded image file
  const navigate = useNavigate();

  // Possible roles - Adjust according to your application's needs
  const roles = [
    { value: 'พนักงาน', label: 'พนักงาน' },
    { value: 'เจ้าของร้าน', label: 'เจ้าของร้าน' },
  ];

  const handleBack = () => {
    navigate('/user');
  };

  const handleUserSubmit = async (e) => {
    e.preventDefault();

    const userFormData = new FormData();
    // Append user details to the form data
    userFormData.append('username', username);
    userFormData.append('password', password);
    userFormData.append('firstname', firstname);
    userFormData.append('lastname', lastname);
    userFormData.append('email', email);
    userFormData.append('phone', phone);
    userFormData.append('address', address);
    userFormData.append('role', role);
    if (image) userFormData.append('image', image); // Append the image if present

    try {
      const response = await axios.post(
        'https://cafe-management-pos-bom-inventory-api.vercel.app/api/employees/add-user',
        userFormData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      if (response.data.success) {
        Swal.fire({
          icon: 'success',
          title: 'เพิ่มสำเร็จ',
          showConfirmButton: false,
          timer: 1500,
        });
        navigate('/user');
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: response.data.message,
        });
      }
    } catch (error) {
      console.error('Error creating user:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'An error occurred while creating the user.',
      });
    }
  };

  return (
    <div className="form-container">
      <div className="container">
        <div className="frame">
          <h2>เพิ่มบัญชีผู้ใช้</h2>
          <form onSubmit={handleUserSubmit}>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '5px',
                marginBottom: '5px',
              }}
            >
              {/* Row 1 - Username & Password */}
              <div style={{ display: 'flex', flexDirection: 'row', gap: '20px' }}>
                <div style={{ flex: 1 }}>
                  <TextField
                    autoFocus
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    label="ชื่อบัญชีผู้ใช้"
                    variant="outlined"
                    fullWidth
                    required
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <TextField
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    label="รหัสผ่าน"
                    variant="outlined"
                    fullWidth
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'row', gap: '20px' }}>
                <TextField
                  type="text"
                  value={firstname}
                  onChange={(e) => setFirstname(e.target.value)}
                  label="ชื่อ"
                  variant="outlined"
                  fullWidth
                  required
                />
                <TextField
                  type="text"
                  value={lastname}
                  onChange={(e) => setLastname(e.target.value)}
                  label="นามสกุล"
                  variant="outlined"
                  fullWidth
                  required
                />
              </div>
              <div style={{ display: 'flex', flexDirection: 'row', gap: '20px' }}>
                <TextField
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  label="เบอร์โทรศัพท์"
                  variant="outlined"
                  fullWidth
                  required
                />
                <FormControl fullWidth variant="outlined" required>
                  <InputLabel>ตำแหน่ง</InputLabel>
                  <Select value={role} onChange={(e) => setRole(e.target.value)} label="Role">
                    {roles.map((userRole) => (
                      <MenuItem key={userRole.value} value={userRole.value}>
                        {userRole.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </div>

              <div style={{ flex: 1 }}>
                <TextField
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  label="Email"
                  variant="outlined"
                  fullWidth
                  required
                />
              </div>
              <div style={{ flex: 1 }}>
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
                />
              </div>
            </div>
            <input type="file" onChange={(e) => setImage(e.target.files[0])} required />
            <br />
            <br />
            <Box display="flex" justifyContent="flex-end" gap={2} sx={{ mb: 2 }}>
              <Button
                onClick={handleBack}
                variant="contained"
                color="error"
                size="large"
                sx={{ width: '180px', fontSize: 28 }}
              >
                <Icon icon="material-symbols:cancel-outline" sx={{ fontSize: 28 }} />
              </Button>
              <Button
                type="submit"
                variant="outlined"
                color="primary"
                size="large"
                sx={{ width: '180px', fontSize: 28 }}
              >
                <Icon icon="formkit:submit" sx={{ fontSize: 28 }} />
              </Button>
            </Box>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UserForm;
