import styled from 'styled-components';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { RouterLink } from 'src/routes/components';

export default function NotFoundView() {
  const StyledDiv = styled.div`
    font-family: 'Prompt', sans-serif;
  `;

  return (
    <Container>
      <Box
        sx={{
          py: 12,
          maxWidth: 480,
          mx: 'auto',
          display: 'flex',
          minHeight: '100vh',
          textAlign: 'center',
          alignItems: 'center',
          flexDirection: 'column',
          justifyContent: 'center',
        }}
      >
        <Typography variant="h3" sx={{ mb: 3 }}>
          <StyledDiv>ขออภัยไม่พบหน้านี้</StyledDiv>
        </Typography>
        <Box
          component="img"
          src="/assets/illustrations/illustration_404.svg"
          sx={{
            mx: 'auto',
            height: 260,
            my: { xs: 4, sm: 4 },
          }}
        />
        <Button href="/dashboard" size="large" variant="contained" component={RouterLink}>
          <StyledDiv>กลับสู่หน้าหลัก</StyledDiv>
        </Button>
      </Box>
    </Container>
  );
}
