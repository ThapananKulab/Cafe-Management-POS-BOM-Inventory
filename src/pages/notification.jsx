import React, { useState } from 'react';

import Button from '@mui/material/Button';
import MuiAlert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

function App() {
  // สร้าง state เพื่อเก็บข้อความแจ้งเตือน
  const [open, setOpen] = useState(false);
  const [notification, setNotification] = useState('');

  // ฟังก์ชันสำหรับแสดงข้อความแจ้งเตือน
  const handleNotification = (message) => {
    setNotification(message);
    setOpen(true);
  };

  // ปิดข้อความแจ้งเตือน
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      {/* Snackbar สำหรับแสดงข้อความแจ้งเตือน */}
      <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
          {notification}
        </Alert>
      </Snackbar>

      {/* สร้างปุ่มสำหรับทดสอบการแสดงข้อความแจ้งเตือน */}
      <Button onClick={() => handleNotification('ข้อความแจ้งเตือนสำเร็จ!')}>
        แสดงข้อความแจ้งเตือน
      </Button>
    </div>
  );
}

export default App;
