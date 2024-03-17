import axios from 'axios';
import { Icon } from '@iconify/react';
import { useParams, useNavigate } from 'react-router-dom';
import React, { useRef, useState, useEffect } from 'react';

import {
  Box,
  Card,
  Grid,
  Button,
  Select,
  MenuItem,
  TextField,
  Container,
  Typography,
} from '@mui/material';

const UserForm = () => {
  // State hooks
  const [username, setUsername] = useState('');
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [role, setRole] = useState('');
  const [image, setImage] = useState(null);

  // Refs
  const fileInputRef = useRef(null);

  const navigate = useNavigate();
  const { userId } = useParams();

  useEffect(() => {
    if (userId) {
      axios
        .get(`https://cafe-project-server11.onrender.com/api/users/${userId}`)
        .then((response) => {
          const userData = response.data;
          setUsername(userData.username);
          setFirstname(userData.firstname);
          setLastname(userData.lastname);
          setEmail(userData.email);
          setPhone(userData.phone);
          setAddress(userData.address);
          setRole(userData.role);
        })
        .catch((error) => console.error('Error fetching user:', error));
    }
  }, [userId]);

  const handleBack = () => navigate('/user');

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('username', username);
    formData.append('firstname', firstname);
    formData.append('lastname', lastname);
    formData.append('email', email);
    formData.append('phone', phone);
    formData.append('address', address);
    formData.append('role', role);

    if (image) {
      formData.append('image', image);
    }

    try {
      await axios.post(
        `https://cafe-project-server11.onrender.com/api/users/updateUser/${userId}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      navigate('/user'); // Adjust as needed
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  // const handleButtonClick = () => {
  //   fileInputRef.current.click();
  // };

  return (
    <Box
      sx={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Container maxWidth="sm">
        <Card
          sx={{ p: 5, display: 'flex', flexDirection: 'column', alignItems: 'center', width: 1 }}
        >
          <Typography variant="h4" component="h1" gutterBottom>
            แก้ไขโปรไฟล์ คุณ: {firstname} {lastname}
          </Typography>
          <form onSubmit={handleSubmit}>
            {/* Image Upload Section */}
            <Grid item xs={12}>
              <Box mt={2} textAlign="center">
                {image && (
                  <img
                    src={URL.createObjectURL(image)} // Use URL.createObjectURL to preview the selected image
                    alt="Preview"
                    style={{
                      maxWidth: '100px',
                      maxHeight: '100px',
                      borderRadius: '50%',
                      objectFit: 'cover',
                      border: '2px solid #ddd',
                      padding: '5px',
                      backgroundColor: '#fff',
                      display: 'block',
                      marginLeft: 'auto',
                      marginRight: 'auto',
                    }}
                  />
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  style={{ display: 'none' }}
                  onChange={handleImageChange}
                />
                {/* <Button
                  variant="outlined"
                  component="span"
                  onClick={handleButtonClick}
                  style={{ display: 'block', margin: '10px auto 0' }}
                >
                  Upload
                </Button> */}
              </Box>
            </Grid>

            <Box mt={3}>{}</Box>
            <Grid container spacing={2} justifyContent="center" alignItems="center">
              <Grid item xs={12} display="flex" flexDirection="column" alignItems="center">
                {/* <Typography variant="h6" gutterBottom>
                  User ID: {userId}
                </Typography> */}
                <Box sx={{ minWidth: 120, textAlign: 'center' }}>
                  <Typography variant="subtitle1">ตำแหน่ง</Typography>
                  <Select
                    fullWidth
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    displayEmpty
                    inputProps={{ 'aria-label': 'Without label' }}
                    variant="outlined"
                    sx={{ textAlign: 'left' }} // Adjust the text alignment inside the select
                  >
                    <MenuItem value="" disabled>
                      Select Role
                    </MenuItem>
                    <MenuItem value="เจ้าของร้าน">เจ้าของร้าน</MenuItem>
                    <MenuItem value="พนักงาน">พนักงาน</MenuItem>
                  </Select>
                </Box>
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="ชื่อ"
                  value={firstname}
                  onChange={(e) => setFirstname(e.target.value)}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="นามสกุล"
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
                  label="เบอร์โทรศัพท์"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="ที่อยู่"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12}>
                <Box marginTop={3} display="flex" justifyContent="center" gap={2}>
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
              </Grid>
            </Grid>
          </form>
        </Card>
      </Container>
    </Box>
  );
};

export default UserForm;
