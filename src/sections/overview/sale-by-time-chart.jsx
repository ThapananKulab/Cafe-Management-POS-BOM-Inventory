import 'chart.js/auto';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import React, { useState, useEffect } from 'react';

const SalesByTimeChart = () => {
  const [salesData, setSalesData] = useState([]);

  useEffect(() => {
    const fetchSalesData = async () => {
      try {
        const response = await axios.get(
          'https://test-api-01.azurewebsites.net/api/saleorder/dashboard/salesByTime'
        );
        setSalesData(response.data);
      } catch (error) {
        console.error('Error fetching sales by time:', error);
      }
    };

    fetchSalesData();
  }, []);

  const chartData = {
    labels: salesData.map((data) => `${data._id}:00`),
    datasets: [
      {
        label: 'ยอดขาย',
        data: salesData.map((data) => data.totalSales),
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1,
      },
    ],
  };

  return (
    <div>
      <h2>กราฟยอดขายตามช่วงเวลาของวันนี้</h2>
      <Line data={chartData} />
    </div>
  );
};

export default SalesByTimeChart;
