import axios from 'axios';
import Swal from 'sweetalert2';
import { Icon } from '@iconify/react';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Button, Select, MenuItem, TextField, InputLabel, FormControl } from '@mui/material';

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
    { value: 'admin', label: 'Admin' },
    { value: 'user', label: 'User' },
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
    userFormData.append('image', image);

    try {
      const response = await axios.post(
        'http://localhost:3333/api/users/insertReact',
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
          title: `User registration successful for ${username}`,
          showConfirmButton: false,
          timer: 1500,
        });
      }
      navigate('/add-user');
      console.log(response.data);
    } catch (error) {
      console.error('Error registering user:', error);
    }
  };

  return (
    <div className="form-container">
      <div className="container">
        <Button
          onClick={handleBack}
          variant="outlined"
          color="primary"
          sx={{
            position: 'absolute',
            left: 6,
            top: 25,
            zIndex: 10,
            opacity: 0.9,
            '&:hover': {
              opacity: 1,
            },
          }}
        >
          <Icon icon="mingcute:back-fill" /> กลับสู่หน้าหลัก
        </Button>
        <div className="frame">
          <h2>เพิ่มบัญชีผู้ใช้</h2>
          <form onSubmit={handleUserSubmit}>
            <TextField
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              label="Username"
              variant="outlined"
              fullWidth
              required
            />
            <TextField
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              label="Password"
              variant="outlined"
              fullWidth
              required
            />
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
            <TextField
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              label="Email"
              variant="outlined"
              fullWidth
              required
            />
            <TextField
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              label="Phone"
              variant="outlined"
              fullWidth
              required
            />
            <TextField
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              label="Address"
              variant="outlined"
              fullWidth
              required
            />
            <FormControl fullWidth variant="outlined" required>
              <InputLabel>Role</InputLabel>
              <Select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                label="Role"
              >
                {roles.map((userRole) => (
  <MenuItem key={userRole.value} value={userRole.value}>
    {userRole.label}
  </MenuItem>
))}
              </Select>
            </FormControl>
            <br />
            <br />
            <input type="file" onChange={(e) => setImage(e.target.files[0])} required />
            <br />
            <br />
            <Button type="submit" variant="outlined" color="primary">
              Submit
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UserForm;
