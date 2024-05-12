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
export const TestReceip = lazy(() => import('src/pages/receip/add-receip'));
export const AddOneReceip = lazy(() => import('src/pages/receip/add-one-receip'));
export const AddInvent = lazy(() => import('src/pages/invent/add-invent'));
export const NearInvent = lazy(() => import('src/pages/invent/near-invent'));
export const MenuShow = lazy(() => import('src/pages/menu/menu-view'));
export const TestPromtpay = lazy(() => import('src/pages/test-promtpay'));
export const Post = lazy(() => import('src/pages/pos/post'));
export const PromptPay = lazy(() => import('src/pages/pos/changepromptpay'));
export const InventUpdateStock = lazy(() => import('src/pages/invent/update-stock'));
export const EditNearInventPage = lazy(() => import('src/pages/invent/edit-near-invent'));
export const TestR = lazy(() => import('src/pages/test-r'));
export const TestM = lazy(() => import('src/pages/test-m'));
export const OrderPage = lazy(() => import('src/pages/order/order-view'));
export const Test = lazy(() => import('src/pages/test'));
export const OpenOrderPage = lazy(() => import('src/pages/order/open-order'));
export const OrderAll = lazy(() => import('src/pages/order/order-all'));
export const Notification = lazy(() => import('src/pages/notification'));
export const Topic = lazy(() => import('src/pages/topic'));
export const Store = lazy(() => import('src/pages/store'));
export const ReportDaily = lazy(() => import('src/pages/report/report-daily'));
export const ReportCancelBill = lazy(() => import('src/pages/report/report-cancel-bill'));
export const ReportSaleMenu = lazy(() => import('src/pages/report/report-sale-menu'));
export const ReportPayment = lazy(() => import('src/pages/report/report-payment'));
export const ReportCost = lazy(() => import('src/pages/report/report-cost-recipe'));
export const ReportProfitMonth = lazy(() => import('src/pages/report/report-profit-month'));
export const ReportPopular = lazy(() => import('src/pages/report/report-popular-menu'));
export const ImPurchase = lazy(() => import('src/pages/po/purchase'));
export const ReportPurchase = lazy(() => import('src/pages/po/po-purchase'));
export const Withdraw = lazy(() => import('src/pages/po/withdraw'));
export const WithdrawOut = lazy(() => import('src/pages/po/withdraw-out'));
export const Expenses = lazy(() => import('src/pages/expenses/expenses'));

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
        { path: 'blog', element: <BlogPage /> },
        { path: 'product', element: <ProductPage /> },
        { path: 'raw', element: <RawPage /> },
        { path: 'invent', element: <InventPage /> },
        {
          path: '/recipe',
          element: <RecipePage />,
        },
        {
          path: '/order',
          element: <OrderPage />,
        },
        {
          path: '/menu',
          element: <MenuShow />,
        },
        {
          path: '/manage/menu',
          element: <TestMenu />,
        },
        {
          path: '/open-order',
          element: <OpenOrderPage />,
        },
        {
          path: '/order-all',
          element: <OrderAll />,
        },
        {
          path: '/manage/invent/update-stock',
          element: <InventUpdateStock />,
        },
        {
          path: '/manage/near-invent',
          element: <NearInvent />,
        },
        {
          path: '/edit-invent/:rawId',
          element: <EditInventPage />,
        },
        {
          path: '/notification',
          element: <Notification />,
        },
        {
          path: '/topic',
          element: <Topic />,
        },
        {
          path: '/add-one-receip',
          element: <AddOneReceip />,
        },
        {
          path: '/manage/recipe',
          element: <TestReceip />,
        },
        {
          path: '/store',
          element: <Store />,
        },
        {
          path: '/add-user',
          element: <AddUser />,
        },
        {
          path: '/report/daily',
          element: <ReportDaily />,
        },
        {
          path: '/report/cancelbill',
          element: <ReportCancelBill />,
        },
        {
          path: '/report/salemenu',
          element: <ReportSaleMenu />,
        },
        {
          path: '/report/payment',
          element: <ReportPayment />,
        },
        {
          path: '/report/cost',
          element: <ReportCost />,
        },
        {
          path: '/report/popular-menu',
          element: <ReportPopular />,
        },
        {
          path: '/purchase/create',
          element: <ImPurchase />,
        },
        {
          path: '/purchase/report',
          element: <ReportPurchase />,
        },
        {
          path: '/purchase/withdraw',
          element: <Withdraw />,
        },
        {
          path: '/purchase/withdraw-out',
          element: <WithdrawOut />,
        },
        {
          path: '/manage/changepromptpay',
          element: <PromptPay />,
        },
        {
          path: '/manage/expenses',
          element: <Expenses />,
        },
        {
          path: '/edit/edit-near-invent',
          element: <EditNearInventPage />,
        },
        {
          path: '/report/profit-month',
          element: <ReportProfitMonth />,
        },
      ],
    },
    { index: true, element: <LoginPage /> },
    { path: 'products', element: <ProductsPage /> },
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
      path: '/menus',
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
      path: '/manage/invent',
      element: <AddInvent />,
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
    {
      path: '/topic',
      element: <Topic />,
    },
    {
      path: '/test',
      element: <Test />,
    },
  ]);

  return routes;
}

// element: getUserRoleFromToken() === 'เจ้าของร้าน' ? <AddProducts /> : <Navigate to="/404" />,
