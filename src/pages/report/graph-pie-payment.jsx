import 'chart.js/auto';
import React from 'react';
import PropTypes from 'prop-types';
import { Pie } from 'react-chartjs-2';

import './PaymentMethodPieChart.css'; // import CSS file

const PaymentMethodPieChart = ({ data }) => {
  const chartData = {
    labels: data.map((item) => item._id),
    datasets: [
      {
        label: 'จำนวนรวม',
        data: data.map((item) => item.totalAmount),
        backgroundColor: [
          'rgba(255, 99, 132, 0.6)', // Red
          'rgba(54, 162, 235, 0.6)', // Blue
          'rgba(255, 206, 86, 0.6)', // Yellow
          'rgba(75, 192, 192, 0.6)', // Green
          'rgba(153, 102, 255, 0.6)', // Purple
          'rgba(255, 159, 64, 0.6)', // Orange
        ],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    plugins: {
      legend: {
        display: true,
        position: 'right',
      },
    },
  };

  return (
    <div className="wrapper">
      <Pie data={chartData} options={options} className="PaymentMethodPieChart" />
    </div>
  );
};

// กำหนด PropTypes
PaymentMethodPieChart.propTypes = {
  data: PropTypes.array.isRequired,
};

export default PaymentMethodPieChart;
