import React, { useState } from 'react';

import './app.css';

function OzToMlConverter() {
  const [oz, setOz] = useState('');
  const [ml, setMl] = useState('');

  const [tablespoons, setTablespoons] = useState('');
  const [teaspoons, setTeaspoons] = useState('');

  const [grams, setGrams] = useState('');

  const handleTeaspoonChange = (e) => {
    const tspValue = e.target.value;
    setTeaspoons(tspValue);
    // สมมติว่า 1 ช้อนชา = 5 กรัม สำหรับวัสดุที่มีความหนาแน่นใกล้เคียงกับน้ำ
    const gramValue = tspValue ? tspValue * 5 : ''; // คำนวณจำนวนกรัม
    setGrams(gramValue);
  };

  const handleTablespoonToGramsChange = (e) => {
    const tbspValue = e.target.value;
    setTablespoons(tbspValue);
    // สมมติว่า 1 ช้อนโต๊ะ = 15 กรัม สำหรับวัสดุที่มีความหนาแน่นใกล้เคียงกับน้ำ
    const gramValue = tbspValue ? tbspValue * 15 : ''; // คำนวณจำนวนกรัม
    setGrams(gramValue);
  };

  const handleOzChange = (e) => {
    const ozValue = e.target.value;
    setOz(ozValue);
    const mlValue = ozValue ? ozValue * 29.5735 : '';
    setMl(mlValue.toFixed(2)); // ปัดเศษไป 2 ตำแหน่งทศนิยม
  };

  const handleTablespoonChange = (e) => {
    const tablespoonValue = e.target.value;
    setTablespoons(tablespoonValue);
    const teaspoonValue = tablespoonValue ? tablespoonValue * 3 : '';
    setTeaspoons(teaspoonValue); // ไม่จำเป็นต้องปัดเศษเพราะการแปลงนี้ไม่มีทศนิยม
  };

  return (
    <div className="container">
      <div className="converter">
        <h2>แปลงหน่วย ออนซ์ เป็น มิลลิลิตร</h2>
        <input
          type="number"
          value={oz}
          onChange={handleOzChange}
          placeholder="กรอกค่าในหน่วยออนซ์"
        />
        <p>
          {oz} ออนซ์ คือ {ml} มิลลิลิตร
        </p>
      </div>

      <div className="converter">
        <h2>แปลงหน่วย ช้อนโต๊ะ เป็น ช้อนชา</h2>
        <input
          type="number"
          value={tablespoons}
          onChange={handleTablespoonChange}
          placeholder="กรอกค่าในหน่วยช้อนโต๊ะ"
        />
        <p>
          {tablespoons} ช้อนโต๊ะ คือ {teaspoons} ช้อนชา
        </p>
      </div>

      <div className="converter">
        <h2>แปลงหน่วย ช้อนชา เป็น กรัม</h2>
        <input
          type="number"
          value={teaspoons}
          onChange={handleTeaspoonChange}
          placeholder="กรอกค่าในหน่วยช้อนชา"
        />
        <p>
          {teaspoons} ช้อนชา ประมาณ {grams} กรัม
        </p>
      </div>

      <div className="converter">
        <h2>แปลงหน่วย ช้อนโต๊ะ เป็น กรัม</h2>
        <input
          type="number"
          value={tablespoons}
          onChange={handleTablespoonToGramsChange}
          placeholder="กรอกค่าในหน่วยช้อนโต๊ะ"
        />
        <p>
          {tablespoons} ช้อนโต๊ะ ประมาณ {grams} กรัม
        </p>
      </div>
    </div>
  );
}

export default OzToMlConverter;
