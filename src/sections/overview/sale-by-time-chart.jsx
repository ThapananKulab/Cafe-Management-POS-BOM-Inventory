import 'chart.js/auto';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import styled from 'styled-components';
import React, { useState, useEffect } from 'react';

import { Typography } from '@mui/material';

const SalesByTimeChart = () => {
  const StyledDiv = styled.div`
    font-family: 'Prompt', sans-serif;
  `;

  const [salesData, setSalesData] = useState([]);

  useEffect(() => {
    const fetchSalesData = async () => {
      try {
        const response = await axios.get(
          'http://localhost:3333/api/saleorder/dashboard/salesByTime'
        );
        setSalesData(response.data);
      } catch (error) {
        console.error('Error fetching sales by time:', error);
      }
    };
    fetchSalesData();
  }, []);

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
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1,
      },
    ],
  };

  return (
    <div>
      <Typography variant="h6" gutterBottom>
        <StyledDiv>กราฟยอดขายตามช่วงเวลาของวันนี้</StyledDiv>
      </Typography>
      <Line data={chartData} />
    </div>
  );
};

export default SalesByTimeChart;
