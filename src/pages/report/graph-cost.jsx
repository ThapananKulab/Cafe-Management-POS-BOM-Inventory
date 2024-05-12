import 'chart.js/auto';
import React from 'react';
import PropTypes from 'prop-types';
import { Doughnut } from 'react-chartjs-2';

import './PaymentMethodPieChart.css'; // import CSS file

const CostChart = ({ highestCostRecipes }) => {
  // สร้างข้อมูลสำหรับ Chart.js
  const chartData = {
    labels: highestCostRecipes.map((recipe) => recipe.name), // รายชื่อสูตร
    datasets: [
      {
        label: 'ราคาต้นทุน',
        data: highestCostRecipes.map((recipe) => recipe.cost), // ราคาต้นทุนของแต่ละสูตร
        backgroundColor: [
          'rgba(255, 99, 132, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(75, 192, 192, 0.6)',
          'rgba(153, 102, 255, 0.6)',
          'rgba(255, 159, 64, 0.6)',
          'rgba(255, 99, 132, 0.6)',
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="wrapper">
      <Doughnut
        data={chartData}
        options={{
          title: {
            display: true,
            text: 'ราคาต้นทุนสูงสุดของสูตร',
            fontSize: 20,
          },
          legend: {
            display: true,
            position: 'right',
          },
        }}
      />
    </div>
  );
};

CostChart.propTypes = {
  highestCostRecipes: PropTypes.array.isRequired, // ตรวจสอบ props highestCostRecipes ว่าเป็น array และจำเป็นต้องใช้
};

export default CostChart;
