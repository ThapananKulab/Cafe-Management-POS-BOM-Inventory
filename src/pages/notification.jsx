import axios from 'axios';
import Swal from 'sweetalert2';
import { Icon } from '@iconify/react';
import { useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';

import { Grid, Paper, Avatar, Button, TextField, Container, Typography } from '@mui/material';

function ChatPage() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const [userId, setUserId] = useState('');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(
          'https://cafe-management-pos-bom-inventory-api.vercel.app/api/authen',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          }
        );
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
    const fetchMessages = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(
          `https://cafe-management-pos-bom-inventory-api.vercel.app/api/chatmessage/get-messages/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.data.success) {
          setMessages(response.data.messages);
        }
      } catch (error) {
        console.error('Failed to fetch messages:', error);
      }
    };

    fetchMessages();
  }, [userId]);

  const sendMessage = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        'https://cafe-management-pos-bom-inventory-api.vercel.app/api/chatmessage/send-message',
        { senderId: user?.id, receiverId: '6573c88a1871d28dee176da0', message },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setMessage('');
      setUserId(user?.id);
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  useEffect(() => {
    const socket = new WebSocket('ws://localhost:3333');

    socket.onopen = () => {
      console.log('WebSocket Client Connected');
    };

    socket.onmessage = (event) => {
      console.log('Received: ', event.data);
      setMessages((prevMessages) => [...prevMessages, JSON.parse(event.data)]);
    };

    return () => {
      socket.close();
    };
  }, []);

  return (
    <Container>
      <Typography variant="h4" align="center" gutterBottom>
        Chat Application
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ padding: '20px' }}>
            <Typography variant="h6" gutterBottom>
              Online Users
            </Typography>
            {/* Display online users here */}
          </Paper>
        </Grid>
        <Grid item xs={12} md={8}>
          <Paper elevation={3} sx={{ padding: '20px', minHeight: '70vh', overflowY: 'auto' }}>
            {messages.map((msg, index) => (
              <div
                key={index}
                style={{
                  marginBottom: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  flexDirection: 'row-reverse',
                }}
              >
                <Typography variant="body1">
                  <strong>{user?.username}</strong>: {msg.message}
                </Typography>
                <Avatar
                  src={user?.image?.url}
                  sx={{ bgcolor: 'primary.main', marginLeft: '10px' }}
                />
              </div>
            ))}
          </Paper>
          <Paper elevation={3} sx={{ padding: '10px', marginTop: '10px' }}>
            <Grid container spacing={2}>
              <Grid item xs={9}>
                <TextField
                  fullWidth
                  label="Type a message..."
                  variant="outlined"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
              </Grid>
              <Grid item xs={3}>
                <Button
                  fullWidth
                  variant="contained"
                  color="primary"
                  endIcon={<Icon icon="ic:outline-send" />}
                  onClick={sendMessage}
                >
                  Send
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}

export default ChatPage;
