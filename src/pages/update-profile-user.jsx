import axios from 'axios';
import React, { useState, useEffect } from 'react';

import { Grid, Button, TextField, Container, Typography } from '@mui/material';

const UpdateUserPage = () => {
  const [updateP_id, setUpdateP_id] = useState('');
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [role, setRole] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3333/api/users/65efdec4f6785a50d2e55636`
        );
        const userData = response.data;

        setUpdateP_id(userData._id || '');
        setFirstname(userData.firstname || '');
        setLastname(userData.lastname || '');
        setEmail(userData.email || '');
        setPhone(userData.phone || '');
        setAddress(userData.address || '');
        setRole(userData.role || '');
      } catch (error) {
        console.error(error.response.data);
      }
    };

    fetchUserData();
  }, []);

  const handleUpdateUser = async () => {
    try {
      const response = await axios.post('http://localhost:3333/api/users/updateProfile', {
        updateP_id,
        firstname,
        lastname,
        email,
        phone,
        address,
        role,
      });

      console.log(response.data);
    } catch (error) {
      console.error(error.response.data);
    }
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" component="h1" gutterBottom>
        Update User
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="User ID"
            value={updateP_id}
            onChange={(e) => setUpdateP_id(e.target.value)}
            variant="outlined"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="First Name"
            value={firstname}
            onChange={(e) => setFirstname(e.target.value)}
            variant="outlined"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Last Name"
            value={lastname}
            onChange={(e) => setLastname(e.target.value)}
            variant="outlined"
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            variant="outlined"
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            variant="outlined"
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            variant="outlined"
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            variant="outlined"
          />
        </Grid>
        <Grid item xs={12}>
          <Button fullWidth variant="contained" color="primary" onClick={handleUpdateUser}>
            Update User
          </Button>
        </Grid>
      </Grid>
    </Container>
  );
};

export default UpdateUserPage;
