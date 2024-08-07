import Swal from 'sweetalert2';
import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';

import { useRouter } from 'src/routes/hooks';

import { UserView } from 'src/sections/user/view';

// ----------------------------------------------------------------------

export default function UserPage() {
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(
          'https://cafe-management-pos-bom-inventory-api.vercel.app/api/authen',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const result = await response.json();
        if (result.status === 'ok') {
          // Possible implementation or comment
        } else {
          localStorage.removeItem('token');
          Swal.fire({
            icon: 'error',
            title: 'กรุณา Login ก่อน',
            text: result.message,
          });
          router.push('/');
        }
      } catch (error) {
        console.error('Error:', error.status);
      }
    };
    fetchData();
  }, [router]);

  return (
    <>
      <Helmet>
        <title> พนักงาน </title>
      </Helmet>

      <UserView />
    </>
  );
}
