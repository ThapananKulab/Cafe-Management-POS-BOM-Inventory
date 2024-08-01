import 'chart.js/auto';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import styled from 'styled-components';
import React, { useState, useEffect } from 'react';

import { TextField, Typography } from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';

const SalesByTimeChart = () => {
  const StyledDiv = styled.div`
    font-family: 'Prompt', sans-serif;
  `;

  const [salesData, setSalesData] = useState([]);
  const [selectedDateTime, setSelectedDateTime] = useState(new Date());

  useEffect(() => {
    const fetchSalesData = async () => {
      try {
        const response = await axios.get(
          `https://cafe-management-pos-bom-inventory-api.vercel.app/api/saleorder/dashboard/salesByTime?date=${selectedDateTime.toISOString()}`
        );
        setSalesData(response.data);
      } catch (error) {
        console.error('Error fetching sales by time:', error);
      }
    };
    fetchSalesData();
    const intervalId = setInterval(fetchSalesData, 5000);
    return () => clearInterval(intervalId);
  }, [selectedDateTime]);

  const chartData = {
    labels: Array.from({ length: 24 }, (_, i) => `${i.toString().padStart(2, '0')}:00`),
    datasets: [
      {
        label: 'ยอดขาย',
        data: Array.from({ length: 24 }, (_, i) => {
          const foundData = salesData.find((data) => data._id === i);
          return foundData ? foundData.totalSales : 0;
        }),
        fill: false,
        borderColor: 'rgb(75, 191, 192)',
        tension: 0.4,
      },
    ],
  };

  return (
    <div>
      <Typography variant="h6" gutterBottom>
        <StyledDiv>ยอดขายตามวันเวลา</StyledDiv>
      </Typography>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <DatePicker
          label="เลือกวันที่"
          value={selectedDateTime}
          onChange={(newDate) => setSelectedDateTime(newDate)}
          renderInput={(params) => <TextField {...params} />}
          inputFormat="dd/MM/yyyy"
        />
      </LocalizationProvider>
      <Line data={chartData} />
    </div>
  );
};

export default SalesByTimeChart;
