import 'chart.js/auto';
import React from 'react';
import PropTypes from 'prop-types'; // import PropTypes
import { Line } from 'react-chartjs-2';

const Graph = ({ data }) => {
  // แยกข้อมูลออกเป็นอาเรย์ของวันที่และอาเรย์ของกำไร
  const dates = data.map((row) => row.date);
  const profits = data.map((row) => row.profit);

  // สร้างข้อมูลสำหรับกราฟ
  const chartData = {
    labels: dates,
    datasets: [
      {
        label: 'กำไรสุทธิ',
        data: profits,
        fill: false,
        backgroundColor: 'rgb(75, 192, 192)',
        borderColor: 'rgba(75, 192, 192, 0.2)',
      },
    ],
  };

  // กำหนดค่าต่าง ๆ ของกราฟ
  const options = {
    scales: {
      x: {
        title: {
          display: true,
          text: 'วันที่',
        },
      },
      y: {
        title: {
          display: true,
          text: 'กำไร',
        },
      },
    },
  };

  return <Line data={chartData} options={options} />;
};

// ระบุ PropTypes สำหรับ 'data' prop
Graph.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      date: PropTypes.string.isRequired,
      profit: PropTypes.number.isRequired,
    })
  ).isRequired,
};

export default Graph;
