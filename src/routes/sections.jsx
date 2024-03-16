import { lazy, Suspense } from 'react';
import { Outlet, Navigate, useRoutes } from 'react-router-dom';

import DashboardLayout from 'src/layouts/dashboard';

export const DasboardPage = lazy(() => import('src/pages/app'));
export const BlogPage = lazy(() => import('src/pages/blog'));
export const UserPage = lazy(() => import('src/pages/user'));
export const LoginPage = lazy(() => import('src/pages/login'));
export const ProductsPage = lazy(() => import('src/pages/products'));
export const ProductPage = lazy(() => import('src/pages/product'));
export const RawPage = lazy(() => import('src/pages/raw'));
export const Page404 = lazy(() => import('src/pages/page-not-found'));
export const UpdateProfile = lazy(() => import('src/pages/update-profile'));
export const EditProducts = lazy(() => import('src/pages/edit-product'));
export const AddProducts = lazy(() => import('src/pages/add-product'));
export const AddUser = lazy(() => import('src/pages/add-user'));
export const Pos = lazy(() => import('src/pages/pos'));
export const UpdateProfileUser = lazy(() => import('src/pages/update-profile-user'));
export const AddRaw = lazy(() => import('src/pages/add-raw'));

// ----------------------------------------------------------------------

export default function Router() {
  const routes = useRoutes([
    {
      element: (
        <DashboardLayout>
          <Suspense>
            <Outlet />
          </Suspense>
        </DashboardLayout>
      ),
      children: [
        { path: 'dashboard', element: <DasboardPage /> },
        { path: 'user', element: <UserPage /> },
        { path: 'products', element: <ProductsPage /> },
        { path: 'blog', element: <BlogPage /> },
        { path: 'product', element: <ProductPage /> },
        { path: 'raw', element: <RawPage /> },
      ],
    },
    { index: true, element: <LoginPage /> },
    {
      path: '404',
      element: <Page404 />,
    },
    {
      path: '*',
      element: <Navigate to="/404" replace />,
    },
    {
      path: '/update-profile',
      element: <UpdateProfile />,
    },
    {
      path: '/edit-product',
      element: <EditProducts />,
    },
    {
      path: '/add-product',
      element: <AddProducts />,
    },
    {
      path: '/add-user',
      element: <AddUser />,
    },
    {
      path: '/pos',
      element: <Pos />,
    },
    {
      path: '/update-profile-user',
      element: <UpdateProfileUser />,
    },
    {
      path: '/add-raw',
      element: <AddRaw />,
    },
  ]);

  return routes;
}
