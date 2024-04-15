import axios from 'axios';
import Swal from 'sweetalert2';
import { Icon } from '@iconify/react';
import styled1 from 'styled-components';
import { useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';

import {
  Box,
  Card,
  Modal,
  Stack,
  Button,
  Divider,
  TextField,
  Container,
  IconButton,
  Typography,
  CardHeader,
  CardContent,
  CardActions,
} from '@mui/material';

function App() {
  const StyledDiv = styled1.div`
  font-family: 'Prompt', sans-serif;
`;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('https://test-api-01.azurewebsites.net/api/authen', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const result = await response.json();
        if (result.status === 'ok') {
          setUser(result.decoded.user);
        } else {
          localStorage.removeItem('token');
          Swal.fire({
            icon: 'error',
            title: 'กรุณา Login ก่อน',
            text: result.message,
          });
          navigate('/');
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };
    fetchData();
  }, [navigate]);

  useEffect(() => {
    axios
      .get('https://test-api-01.azurewebsites.net/api/post/all')
      .then((res) => setPosts(res.data))
      .catch((err) => console.log(err));
  }, []);

  const handleModalOpen = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleSubmit = async () => {
    try {
      const dataToSend = {
        ...formData,
        author: `${user?.firstname} ${user?.lastname} (${user?.role})`,
      };
      const res = await axios.post(
        'https://test-api-01.azurewebsites.net/api/post/add',
        dataToSend
      );
      setPosts([...posts, res.data]);
      setFormData({ title: '', content: '' });
      handleModalClose();
    } catch (error) {
      console.error('Error creating post:', error);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleDelete = async (postId) => {
    const confirmation = await Swal.fire({
      title: 'คุณแน่ใจหรือไม่?',
      text: 'คุณต้องการที่จะลบโพสต์นี้?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
    });

    if (confirmation.isConfirmed) {
      try {
        await axios.delete(`https://test-api-01.azurewebsites.net/api/post/delete/${postId}`);
        setPosts(posts.filter((post) => post._id !== postId));
        Swal.fire({
          icon: 'success',
          title: 'ลบโพสต์สำเร็จ',
          text: 'โพสต์ถูกลบออกจากระบบแล้ว',
        });
      } catch (error) {
        console.error('Error deleting post:', error);
        Swal.fire({
          icon: 'error',
          title: 'เกิดข้อผิดพลาดในการลบโพสต์',
          text: 'ไม่สามารถลบโพสต์ได้ กรุณาลองใหม่ภายหลัง',
        });
      }
    }
  };

  return (
    <Container maxWidth="md">
      <Typography variant="h4" gutterBottom>
        <StyledDiv>แจ้งเรื่อง</StyledDiv>
      </Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={handleModalOpen}
        style={{
          display: 'block',
          margin: 'auto',
          fontSize: '1rem', // Adjust the font size as needed
          padding: '5px 20px', // Adjust the padding as needed
        }}
      >
        <StyledDiv>โพสต์</StyledDiv>
      </Button>

      <Modal
        open={isModalOpen}
        onClose={handleModalClose}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Box
          sx={{
            width: 400,
            bgcolor: 'background.paper',
            p: 3,
            borderRadius: '8px',
            outline: 'none',
          }}
        >
          <Typography variant="h5" gutterBottom>
            <StyledDiv>เพิ่มโพสต์ใหม่</StyledDiv>
          </Typography>
          <Stack spacing={2}>
            <TextField
              name="title"
              label="Title"
              variant="outlined"
              fullWidth
              value={formData.title}
              onChange={handleChange}
            />
            <TextField
              name="content"
              label="Content"
              variant="outlined"
              multiline
              rows={4}
              fullWidth
              value={formData.content}
              onChange={handleChange}
            />
            <TextField
              label="Author"
              variant="outlined"
              fullWidth
              value={`${user?.firstname} ${user?.lastname} ${user?.role}`}
              disabled
            />
            <Button variant="contained" color="primary" onClick={handleSubmit}>
              Post
            </Button>
          </Stack>
        </Box>
      </Modal>
      <Box mt={3}>
        <Typography variant="h5" gutterBottom>
          <StyledDiv>โพสต์ทั้งหมด</StyledDiv>
        </Typography>
        {posts
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .map((post) => (
            <Card key={post._id} sx={{ mb: 2 }}>
              <CardHeader
                title={`${post.author}`}
                subheader={new Date(post.createdAt).toLocaleString()}
              />
              <CardContent>
                <Typography variant="h3" component="div">
                  <StyledDiv> {post.title}</StyledDiv>
                </Typography>
                <Typography>
                  <StyledDiv>{post.content}</StyledDiv>
                </Typography>
              </CardContent>
              <CardActions>
                {user && user.role === 'เจ้าของร้าน' ? (
                  <IconButton color="error" onClick={() => handleDelete(post._id)}>
                    <Icon icon="material-symbols:delete-sharp" />
                  </IconButton>
                ) : null}
              </CardActions>
              <Divider />
              {/* Add comments here */}
            </Card>
          ))}
      </Box>
    </Container>
  );
}

export default App;
