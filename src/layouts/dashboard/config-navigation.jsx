import SvgColor from 'src/components/svg-color';

const icon = (name) => (
  <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />
);

const navConfig = [
  {
    title: 'dashboard',
    path: '/dashboard',
    icon: icon('ic_analytics'),
  },
  {
    title: 'พนักงาน',
    // path: '/user',
    icon: icon('ic_user'),
    subItems: [
      {
        title: 'จัดการพนักงาน',
        path: '/user',
        icon: icon('ic-manager'),
      },
    ],
  },
  // {
  //   title: 'products',
  //   path: '/products',
  //   icon: icon('ic_cart'),
  // },
  {
    title: 'สินค้า',
    path: '/product',
    icon: icon('ic_products'),
  },
  {
    title: 'วัตถุดิบ',
    path: '/raw',
    icon: icon('ic_raw'),
  },
  // {
  //   title: 'blog',
  //   path: '/blog',
  //   icon: icon('ic_blog'),
  // },
  {
    title: 'ขายสินค้า',
    path: '/pos',
    icon: icon('ic_sell'),
  },

  // {
  //   title: 'login',
  //   path: '/login',
  //   icon: icon('ic_lock'),
  // },
  // {
  //   title: 'Not found',
  //   path: '/404',
  //   icon: icon('ic_disabled'),
  // },
];

export default navConfig;
