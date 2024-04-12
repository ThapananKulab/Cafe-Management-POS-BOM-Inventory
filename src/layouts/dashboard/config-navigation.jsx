import SvgColor from 'src/components/svg-color';

const icon = (name) => (
  <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />
);

const navConfig = [
  {
    title: 'Dashboard',
    path: '/dashboard',
    icon: icon('ic_analytics'),
    subItems: [
      {
        title: 'ภาพรวมร้านค้า',
        path: '/dashboard',
        icon: icon('ic-ana'),
      },
      {
        title: 'รายงาน',
        path: '/report/daily',
        icon: icon('report'),
      },
    ],
  },
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
        title: 'รายการวัตถุดิบ',
        path: '/invent',
        icon: icon('ic-manage'),
      },
      {
        title: 'วัตถุดิบใกล้หมด',
        path: '/manage/near-invent',
        icon: icon('stock-low'),
      },
      {
        title: 'สต็อกวัตถุดิบ',
        path: '/manage/invent/update-stock',
        icon: icon('ic-improduct'),
      },
    ],
  },
  {
    title: 'BOM',
    // path: '/invent',
    icon: icon('m_bom'),
    subItems: [
      {
        title: 'สูตรเครื่องดื่ม',
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
        title: 'จัดการเมนู',
        path: '/menu',
        icon: icon('ic-drink-a'),
      },
    ],
  },
  {
    title: 'ออเดอร์',
    // path: '/order',
    icon: icon('ic-order'),
    subItems: [
      {
        title: 'ออเดอร์ทัังหมด',
        path: '/order-all',
        icon: icon('order-all'),
      },
      {
        title: 'ออเดอร์ประจำวัน',
        path: '/order',
        icon: icon('order-today'),
      },
      {
        title: 'ระยะเวลาการเปิดปิดร้าน',
        path: '/open-order',
        icon: icon('time-svgrepo-com'),
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
