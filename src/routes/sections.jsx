import { lazy, Suspense } from 'react';
import { Outlet, Navigate, useRoutes } from 'react-router-dom';

import DashboardLayout from 'src/layouts/dashboard';

export const DasboardPage = lazy(() => import('src/pages/app'));
export const BlogPage = lazy(() => import('src/pages/blog'));
export const UserPage = lazy(() => import('src/pages/user'));
export const LoginPage = lazy(() => import('src/pages/login'));
export const ProductsPage = lazy(() => import('src/pages/products'));
export const ProductPage = lazy(() => import('src/pages/product'));
export const Page404 = lazy(() => import('src/pages/page-not-found'));
export const FormAdmin = lazy(() => import('src/pages/form-admin'));
export const EditProducts = lazy(() => import('src/pages/edit-product'));
export const AddProducts = lazy(() => import('src/pages/add-product'));

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
      path: '/formadmin',
      element: <FormAdmin />,
    },
    {
      path: '/edit-product',
      element: <EditProducts />,
    },
    {
      path: '/add-product',
      element: <AddProducts />,
    },
  ]);

  return routes;
}
