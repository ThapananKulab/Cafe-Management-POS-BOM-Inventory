import SvgColor from 'src/components/svg-color';

const icon = (name) => (
  <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />
);

const navConfig = [
  {
    title: 'เอกสาร/รายงาน',
    // path: '/dashboard',
    icon: icon('chart-pie'),
    subItems: [
      {
        title: 'Dashboard',
        path: '/dashboard',
        icon: icon('ic-ana'),
      },
      {
        title: 'รายงาน',
        path: '/report/daily',
        icon: icon('report'),
      },
      {
        title: 'ประวัติการขายทั้งหมด',
        path: '/order-all',
        icon: icon('order-all'),
      },
      {
        title: 'ประวัติการขายประจำวัน',
        path: '/order',
        icon: icon('order-today'),
      },
    ],
  },

  // {
  //   title: 'ออเดอร์',
  //   icon: icon('ic-order'),
  //   subItems: [
  //     {
  //       title: 'ออเดอร์ทัังหมด',
  //       path: '/order-all',
  //       icon: icon('order-all'),
  //     },
  //   ],
  // },
  {
    title: 'บริหารข้อมูลกลาง',
    icon: icon('ic_user'),
    subItems: [
      {
        title: 'พนักงาน',
        path: '/user',
        icon: icon('ic-manager'),
      },
      {
        title: 'ซัพพลายเออร์',
        path: '/store',
        icon: icon('store-svgrepo-com'),
      },
    ],
  },
  {
    title: 'บริหารสต๊อค',
    // path: '/raw',
    icon: icon('material-7'),
    subItems: [
      {
        title: 'คลังวัตถุดิบ',
        path: '/invent',
        icon: icon('ic-manage'),
      },
      {
        title: 'วัตถุดิบใกล้หมด',
        path: '/manage/near-invent',
        icon: icon('stock-low'),
      },
      {
        title: 'รับวัตถุดิบเข้า',
        path: '/manage/invent/update-stock',
        icon: icon('ic-improduct'),
      },
      {
        title: 'นำเข้า PO',
        path: '/purchase/create',
        icon: icon('invoice'),
      },
    ],
  },
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
    title: 'สินค้า',
    // path: '/product',
    icon: icon('cafe-8'),
    subItems: [
      {
        title: 'เมนู',
        path: '/menu',
        icon: icon('ic-drink-a'),
      },
    ],
  },
  {
    title: 'แจ้งเตือน',
    // path: '/notification',
    icon: icon('ic-notic'),
    subItems: [
      {
        title: 'ข้อมูลทั่วไป',
        path: '/topic',
        icon: icon('g-1'),
      },
    ],
  },
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
