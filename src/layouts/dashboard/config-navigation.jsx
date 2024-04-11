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
  {
    title: 'วัตถุดิบ',
    // path: '/raw',
    icon: icon('material-7'),
    subItems: [
      {
        title: 'จัดการวัตถุดิบ',
        path: '/invent',
        icon: icon('ic-manage'),
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
    path: '/order',
    icon: icon('ic-order'),
  },
  {
    title: 'แจ้งเตือน',
    path: '/notification',
    icon: icon('ic-notic'),
    subItems: [
      {
        title: 'chat',
        path: '/notification',
        icon: icon('chat-81'),
      },
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
