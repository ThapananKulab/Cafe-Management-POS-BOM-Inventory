import SvgColor from 'src/components/svg-color';

const icon = (name) => (
  <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />
);

const navConfigUser = [
  // {
  //   title: 'dashboard',
  //   path: '/dashboard',
  //   icon: icon('ic_analytics'),
  // },
  // {
  //   title: 'products',
  //   path: '/products',
  //   icon: icon('ic_cart'),
  // },
  // {
  //   title: 'สินค้า',
  //   // path: '/product',
  //   icon: icon('ic_products'),
  //   subItems: [
  //     {
  //       title: 'จัดการสินค้า',
  //       path: '/product',
  //       icon: icon('ic_productsM'),
  //     },
  //     {
  //       title: 'นำเข้าสินค้า',
  //       path: '/product/add-quantity',
  //       icon: icon('ic-improduct'),
  //     },
  //   ],
  // },
  {
    title: 'ขายสินค้า',
    path: '/sale/pos',
    icon: icon('ic_sell'),
  },
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
  // {
  //   title: 'blog',
  //   path: '/blog',
  //   icon: icon('ic_blog'),
  {
    title: 'BOM',
    // path: '/invent',
    icon: icon('m_bom'),
    subItems: [
      {
        title: 'ท็อปปิ้ง/สูตรเครื่องดื่ม',
        path: '/recipe',
        icon: icon('ic-rec'),
      },
    ],
  },
  {
    title: 'วัตถุดิบ',
    // path: '/invent',
    icon: icon('ic_raw'),
    subItems: [
      {
        title: 'จัดการวัตถุดิบ',
        path: '/invent',
        icon: icon('ic-manage'),
      },
      {
        title: 'โกดังวัตถุดิบ/เบิกวัตถุดิบ',
        path: '/purchase/withdraw',
        icon: icon('stock-svgrepo-com'),
      },
    ],
  },
  {
    title: 'ออเดอร์',
    path: '/order',
    icon: icon('ic-order'),
  },
  // {
  //   title: 'แจ้งเตือน',
  //   // path: '/raw',
  //   icon: icon('ic-notic'),
  // },
  {
    title: 'ข้อมูลทั่วไป',
    path: '/topic',
    icon: icon('g-1'),
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

export default navConfigUser;
