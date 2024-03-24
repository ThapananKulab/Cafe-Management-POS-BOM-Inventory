import Swal from 'sweetalert2';
import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';

import { useRouter } from 'src/routes/hooks';

import { RecipeView } from 'src/sections/recipe/view';

// ----------------------------------------------------------------------

export default function RecipePage() {
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('https://cafe-project-server11.onrender.com/api/authen', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const result = await response.json();
        if (result.status === 'ok') {
          console.log('เรียบร้อย');
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
        <title> สูตร </title>
      </Helmet>
      <RecipeView />
    </>
  );
}
