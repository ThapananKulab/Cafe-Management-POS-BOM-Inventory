import { jwtDecode } from 'jwt-decode';
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
export const RecipePage = lazy(() => import('src/pages/recipe'));
export const InventPage = lazy(() => import('src/pages/invent'));
export const Page404 = lazy(() => import('src/pages/page-not-found'));
export const UpdateProfile = lazy(() => import('src/pages/update-profile'));
export const EditProducts = lazy(() => import('src/pages/edit-product'));
export const EditUser = lazy(() => import('src/pages/edit-user'));
export const AddProducts = lazy(() => import('src/pages/add-product'));
export const AddUser = lazy(() => import('src/pages/add-user'));
export const Pos = lazy(() => import('src/pages/pos/pos'));
export const EditInventPage = lazy(() => import('src/pages/invent/edit-invent'));
export const AddRaw = lazy(() => import('src/pages/add-raw'));
export const ProductAddQuantity = lazy(() => import('src/pages/product-addquantity'));
export const TestOL = lazy(() => import('src/pages/test-ol'));
export const TestMenu = lazy(() => import('src/pages/menu/menu-add'));
export const TestReceip = lazy(() => import('src/pages/receip/test-receip'));
export const TestInvent = lazy(() => import('src/pages/invent/test-invent'));
export const MenuShow = lazy(() => import('src/pages/menu/menu-view'));
export const TestPromtpay = lazy(() => import('src/pages/test-promtpay'));
export const Post = lazy(() => import('src/pages/pos/post'));
export const InventUpdateStock = lazy(() => import('src/pages/invent/update-stock'));
export const TestR = lazy(() => import('src/pages/test-r'));
export const TestM = lazy(() => import('src/pages/test-m'));

// ----------------------------------------------------------------------

export default function Router() {
  const getUserRoleFromToken = () => {
    const token = localStorage.getItem('token');
    if (!token) return null;

    try {
      const decoded = jwtDecode(token);
      return decoded.user.role;
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  };
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
        {
          path: 'user',
          element: getUserRoleFromToken() === 'เจ้าของร้าน' ? <UserPage /> : <Navigate to="/404" />,
        },
        { path: 'products', element: <ProductsPage /> },
        { path: 'blog', element: <BlogPage /> },
        { path: 'product', element: <ProductPage /> },
        { path: 'raw', element: <RawPage /> },
        { path: 'invent', element: <InventPage /> },
        {
          path: '/recipe',
          element: <RecipePage />,
        },
        {
          path: '/menu',
          element: <MenuShow />,
        },
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
      path: '/add-product',
      element: <AddProducts />,
      // element: getUserRoleFromToken() === 'เจ้าของร้าน' ? <AddProducts /> : <Navigate to="/404" />,
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
      path: '/add-raw',
      element: <AddRaw />,
    },
    {
      path: '/product/add-quantity',
      element: <ProductAddQuantity />,
    },
    {
      path: '/edit-invent/:rawId',
      element: <EditInventPage />,
    },
    {
      path: '/edit-product/:productId',
      element: <EditProducts />,
    },
    {
      path: '/edit-user/:userId',
      element: <EditUser />,
    },
    {
      path: '/test-ol',
      element: <TestOL />,
    },
    {
      path: '/manage/menu',
      element: <TestMenu />,
    },
    {
      path: '/manage/recipe',
      element: <TestReceip />,
    },
    {
      path: '/manage/invent',
      element: <TestInvent />,
    },
    {
      path: '/manage/invent/update-stock',
      element: <InventUpdateStock />,
    },
    {
      path: '/tp',
      element: <TestPromtpay />,
    },
    {
      path: '/sale/pos',
      element: <Post />,
    },
    {
      path: '/test-m',
      element: <TestM />,
    },
    {
      path: '/test-r',
      element: <TestR />,
    },
  ]);

  return routes;
}

// element: getUserRoleFromToken() === 'เจ้าของร้าน' ? <AddProducts /> : <Navigate to="/404" />,
