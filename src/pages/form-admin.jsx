import React from 'react';
import styled from 'styled-components';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';

export default function LoginView() {
  const StyledDiv = styled.div`
    font-family: 'Prompt', sans-serif;
  `;

  const renderForm = (
    <form>
      <Stack spacing={3}>
        <TextField name="username" label="ชื่อบัญชีผู้ใช้" />
        <TextField name="username" label="ชื่อบัญชีผู้ใช้" />
        <TextField name="username" label="ชื่อบัญชีผู้ใช้" />
        <TextField name="username" label="ชื่อบัญชีผู้ใช้" />
      </Stack>

      <Box marginTop={3}>
        <LoadingButton
          fullWidth
          size="large"
          type="submit"
          variant="contained"
          color="warning"
          sx={{ color: 'white' }}
        >
          <StyledDiv>เข้าสู่ระบบ</StyledDiv>
        </LoadingButton>
      </Box>
    </form>
  );

  return (
    <Box
      sx={{
        height: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
      }}
    >
      <Stack alignItems="center" sx={{ flexGrow: 1, justifyContent: 'center', marginTop: '-10vh' }}>
        <Card
          sx={{
            p: 5,
            width: 1,
            maxWidth: 420,
          }}
        >
          <Box>
            <Typography variant="h4" component="div" textAlign="center">
              <StyledDiv>แก้ไขโปรไฟล์</StyledDiv>
            </Typography>
          </Box>
          {renderForm}
        </Card>
      </Stack>
    </Box>
  );
}
