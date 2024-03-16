import axios from 'axios';
import Swal from 'sweetalert2';
import { Icon } from '@iconify/react';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Box, Button, Select, MenuItem, TextField, InputLabel, FormControl } from '@mui/material';

import './style.css';

const UserForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [role, setRole] = useState('');
  const [image, setImage] = useState(null);
  const navigate = useNavigate();

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
    userFormData.append('username', username);
    userFormData.append('password', password);
    userFormData.append('firstname', firstname);
    userFormData.append('lastname', lastname);
    userFormData.append('email', email);
    userFormData.append('phone', phone);
    userFormData.append('address', address);
    userFormData.append('role', role);
    userFormData.append('image', image); // Always append the image

    try {
      const response = await axios.post(
        'https://cafe-project-server11.onrender.com/api/users/insertReact',
        // 'http://localhost:3333/api/users/insertReact',
        userFormData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );

      console.log('Server Response:', response.data);

      if (response.data.success) {
        Swal.fire({
          icon: 'success',
          title: `เพิ่ม ${username} สำเร็จ`,
          showConfirmButton: false,
          timer: 1500,
        });
        navigate('/user');
      } else if (response.data.username && username !== response.data.username) {
        Swal.fire({
          icon: 'warning',
          title: 'Warning',
          text: 'Invalid username. Please provide a valid username.',
        });
      } else {
        console.log('Error Message:', response.data.message);
        Swal.fire({
          icon: 'error',
          title: 'ผิดพลาด',
          text: response.data.message,
        });
      }
    } catch (error) {
      console.error('Error registering user:', error);

      if (error.response && error.response.data) {
        console.log('Server Error Response:', error.response.data);
        const errorMessage = error.response.data.message;
        Swal.fire({
          icon: 'error',
          title: 'ผิดพลาด',
          text: errorMessage || 'Unknown error occurred',
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'ผิดพลาด',
          text: 'Unknown error occurred',
        });
      }
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
                    label="Username"
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
                    label="Password"
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
                  label="First Name"
                  variant="outlined"
                  fullWidth
                  required
                />
                <TextField
                  type="text"
                  value={lastname}
                  onChange={(e) => setLastname(e.target.value)}
                  label="Last Name"
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
                  label="Phone"
                  variant="outlined"
                  fullWidth
                  required
                />
                <FormControl fullWidth variant="outlined" required>
                  <InputLabel>Role</InputLabel>
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
                  label="Address"
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
