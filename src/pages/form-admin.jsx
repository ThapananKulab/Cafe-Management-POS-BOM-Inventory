import React from 'react';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';

function FormAdmin() {
  const handleSubmit = (event) => {
    event.preventDefault();
    console.log('Form Submitted');
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      margin="auto"
      width="100%"
    >
      <form noValidate autoComplete="off" onSubmit={handleSubmit}>
        {[...Array(5)].map((_, index) => (
          <Box key={index} marginY={1} width="75%">
            <TextField
              fullWidth
              id={`outlined-basic-${index}`}
              label={`ช่องกรอกข้อมูล ${index + 1}`}
              variant="outlined"
              sx={{ borderRadius: 2, '& .MuiOutlinedInput-root': { borderRadius: 2 } }} // กำหนดระดับความโค้งของกรอบ
            />
          </Box>
        ))}
        <Box marginTop={2}>
          <Button type="submit" variant="contained" color="primary">
            Submit
          </Button>
        </Box>
      </form>
    </Box>
  );
}

export default FormAdmin;
