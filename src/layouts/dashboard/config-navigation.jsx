import SvgColor from 'src/components/svg-color';

const icon = (name) => (
  <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />
);

const navConfig = [
  {
    title: 'รายงาน',
    path: '/dashboard',
    icon: icon('ic-ana'),
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
    // path: '/product',
    icon: icon('ic_products'),
    subItems: [
      {
        title: 'จัดการเมนู',
        path: '/menu',
        icon: icon('ic-drink-a'),
      },
      // {
      //   title: 'จัดการสินค้า',
      //   path: '/product',
      //   icon: icon('ic_productsM'),
      // },
      // {
      //   title: 'นำเข้าสินค้า',
      //   path: '/product/add-quantity',
      //   icon: icon('ic-improduct'),
      // },
    ],
  },
  {
    title: 'BOM',
    // path: '/invent',
    icon: icon('ic_raw'),
    subItems: [
      {
        title: 'จัดการวัตถุดิบ',
        path: '/invent',
        icon: icon('ic-manage'),
      },
      {
        title: 'นำเข้าวัตถุดิบ',
        path: '/manage/invent/update-stock',
        icon: icon('ic-improduct'),
      },
      {
        title: 'สูตรเครื่องดื่ม',
        path: '/recipe',
        icon: icon('ic-rec'),
      },
    ],
  },
  // {
  //   title: 'วัตถุดิบ',
  //   // path: '/raw',
  //   icon: icon('ic_raw'),
  //   subItems: [
  //     {
  //       title: 'จัดการวัตถุดิบ',
  //       path: '/raw',
  //       icon: icon('ic_milk'),
  //     },
  //   ],
  // },
  // {
  //   title: 'สูตรเครื่องดื่ม',
  //   // path: '/raw',
  //   icon: icon('ic-raw2'),
  //   subItems: [
  //     {
  //       title: 'จัดการสูตรเครื่องดื่ม',
  //       path: '/recipe',
  //       icon: icon('ic-rec'),
  //     },
  //   ],
  // },
  {
    title: 'ออเดอร์',
    path: '/order',
    icon: icon('ic-order'),
  },
  {
    title: 'แจ้งเตือน',
    // path: '/raw',
    icon: icon('ic-notic'),
  },
  // {
  //   title: 'blog',
  //   path: '/blog',
  //   icon: icon('ic_blog'),
  // },
  {
    title: 'POS',
    path: '/sale/pos',
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
