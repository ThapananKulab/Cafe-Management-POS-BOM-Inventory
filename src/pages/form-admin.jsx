import React from 'react';

import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';

function FormAdmin() {
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      margin="auto"
      width="100%"
    >
      <form noValidate autoComplete="off">
        {[...Array(5)].map((_, index) => (
          <Box key={index} marginY={1} width="50%">
            {' '}
            {/* Adjust width as needed */}
            <TextField
              fullWidth
              id={`outlined-basic-${index}`}
              label={`ช่องกรอกข้อมูล ${index + 1}`}
              variant="outlined"
            />
          </Box>
        ))}
      </form>
    </Box>
  );
}

export default FormAdmin;
