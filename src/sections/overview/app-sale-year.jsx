import 'chart.js/auto';
import axios from 'axios';
import { Bar } from 'react-chartjs-2'; // เปลี่ยนจาก Line เป็น Bar
import styled1 from 'styled-components';
import React, { useState, useEffect } from 'react';

import { TextField, Typography } from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';

const SalesChart = () => {
  const StyledDiv = styled1.div`
  font-family: 'Prompt', sans-serif;
`;
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [salesData, setSalesData] = useState([]);

  useEffect(() => {
    const fetchSalesData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3333/api/saleorder/salesdata?year=${selectedYear}`
        );
        setSalesData(response.data);
      } catch (error) {
        console.error('Error fetching sales data:', error);
      }
    };
    fetchSalesData();
  }, [selectedYear]);

  const chartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        label: 'ยอดขาย',
        data: [
          salesData[0] || 0,
          salesData[1] || 0,
          salesData[2] || 0,
          salesData[3] || 0,
          salesData[4] || 0,
          salesData[5] || 0,
          salesData[6] || 0,
          salesData[7] || 0,
          salesData[8] || 0,
          salesData[9] || 0,
          salesData[10] || 0,
          salesData[11] || 0,
        ],
        backgroundColor: 'rgb(75, 192, 192)', // สีพื้นหลังของแท่ง
      },
    ],
  };

  return (
    <div>
      <Typography variant="h6" gutterBottom>
        <StyledDiv>กราฟยอดขายตามรายปี</StyledDiv>
      </Typography>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <DatePicker
          views={['year']}
          label="เลือกปี"
          value={new Date(selectedYear, 0, 1)} // กำหนดวันที่เป็น 1 มกราคมของปีที่เลือก
          onChange={(newValue) => setSelectedYear(newValue.getFullYear())}
          renderInput={(params) => <TextField {...params} helperText={null} />}
        />
      </LocalizationProvider>
      <Bar data={chartData} /> {/* เปลี่ยนจาก Line เป็น Bar */}
    </div>
  );
};

export default SalesChart;
