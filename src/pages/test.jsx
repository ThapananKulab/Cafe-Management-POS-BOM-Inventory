// import axios from 'axios';
// import React, { useState, useEffect } from 'react';

// import {
//   Paper,
//   Table,
//   TableRow,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableContainer,
// } from '@mui/material';

// const SaleRoundsTable = () => {
//   const [saleRounds, setSaleRounds] = useState([]);

//   useEffect(() => {
//     const fetchSaleRounds = async () => {
//       try {
//         const response = await axios.get('http://localhost:3333/api/salerounds/status');
//         if (response.data && response.data.status) {
//           // Assuming the API returns an array of sale rounds
//           setSaleRounds([response.data.status]);
//         }
//       } catch (error) {
//         console.error('Error fetching sale rounds:', error);
//       }
//     };

//     fetchSaleRounds();
//   }, []);

//   return (
//     <TableContainer component={Paper}>
//       <Table aria-label="sale rounds table">
//         <TableHead>
//           <TableRow>
//             <TableCell>Status</TableCell>
//             <TableCell align="right">Opened At</TableCell>
//             <TableCell align="right">Closed At</TableCell>
//           </TableRow>
//         </TableHead>
//         <TableBody>
//           {saleRounds.map((round, index) => (
//             <TableRow key={index}>
//               <TableCell component="th" scope="row">
//                 {round.isOpen ? 'Open' : 'Closed'}
//               </TableCell>
//               <TableCell align="right">{new Date(round.openedAt).toLocaleString()}</TableCell>
//               <TableCell align="right">
//                 {round.closedAt ? new Date(round.closedAt).toLocaleString() : 'N/A'}
//               </TableCell>
//             </TableRow>
//           ))}
//         </TableBody>
//       </Table>
//     </TableContainer>
//   );
// };

// export default SaleRoundsTable;

import axios from 'axios';
import React, { useState, useEffect } from 'react';

import {
  Paper,
  Table,
  TableRow,
  TableBody,
  TableCell,
  TableHead,
  TableContainer,
} from '@mui/material';

const SaleRoundsTable = () => {
  const [saleRounds, setSaleRounds] = useState([]);

  useEffect(() => {
    const fetchSaleRounds = async () => {
      try {
        const response = await axios.get('http://localhost:3333/api/salerounds/statuses');
        if (response.data && response.data.saleRounds) {
          // Correctly access the array of sale rounds
          setSaleRounds(response.data.saleRounds);
        }
      } catch (error) {
        console.error('Error fetching sale rounds:', error);
      }
    };

    fetchSaleRounds();
  }, []);

  return (
    <TableContainer component={Paper}>
      <Table aria-label="sale rounds table">
        <TableHead>
          <TableRow>
            <TableCell>Status</TableCell>
            <TableCell align="right">Opened At</TableCell>
            <TableCell align="right">Closed At</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {saleRounds.map((round, index) => (
            <TableRow key={index}>
              <TableCell component="th" scope="row">
                {round.isOpen ? 'Open' : 'Closed'}
              </TableCell>
              <TableCell align="right">{new Date(round.openedAt).toLocaleString()}</TableCell>
              <TableCell align="right">
                {round.closedAt ? new Date(round.closedAt).toLocaleString() : 'N/A'}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default SaleRoundsTable;
