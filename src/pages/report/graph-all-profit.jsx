import 'chart.js/auto';
import React from 'react';
import PropTypes from 'prop-types'; // import PropTypes
import { Line } from 'react-chartjs-2';

const MultiLineGraph = ({ data }) => {
  // แยกข้อมูลออกเป็นอาเรย์ของวันที่ และอาเรย์ของข้อมูลแต่ละประเภท
  const dates = data.map((row) => row.date);
  const salesRevenue = data.map((row) => row.salesRevenue);
  const purchaseCost = data.map((row) => row.purchaseCost);
  const expenses = data.map((row) => row.expenses);

  // สร้างข้อมูลสำหรับกราฟ
  const chartData = {
    labels: dates,
    datasets: [
      {
        label: 'ยอดขาย',
        data: salesRevenue,
        fill: false,
        backgroundColor: 'rgb(75, 192, 192)',
        borderColor: 'rgba(75, 192, 192, 0.2)',
      },
      {
        label: 'สั่งซื้อวัตถุดิบ',
        data: purchaseCost,
        fill: false,
        backgroundColor: 'rgb(192, 75, 192)',
        borderColor: 'rgba(192, 75, 192, 0.2)',
      },
      {
        label: 'ค่าใช้จ่าย',
        data: expenses,
        fill: false,
        backgroundColor: 'rgb(192, 192, 75)',
        borderColor: 'rgba(192, 192, 75, 0.2)',
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
          text: 'จำนวน',
        },
      },
    },
  };

  return <Line data={chartData} options={options} />;
};

// ระบุ PropTypes สำหรับ 'data' prop
MultiLineGraph.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      date: PropTypes.string.isRequired,
      salesRevenue: PropTypes.number.isRequired,
      purchaseCost: PropTypes.number.isRequired,
      expenses: PropTypes.number.isRequired,
    })
  ).isRequired,
};

export default MultiLineGraph;
