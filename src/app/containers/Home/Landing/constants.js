export const DocsURL = {
  docs:
    'https://docs.google.com/document/d/1iSSoe1GyIV-hYlz8-_EDNOUTPF9GCumo2c3K1bTsbOs/edit',
  google_authen:
    'https://docs.google.com/document/d/1iSSoe1GyIV-hYlz8-_EDNOUTPF9GCumo2c3K1bTsbOs/edit#heading=h.17dp8vu',
};

export const vi = {
  Buy: 'Mua',
  Trial: 'Dùng thử',
  Custom_Package: 'Gói tùy chỉnh',
};

export const en = {
  Buy: 'Buy',
  Trial: 'Trial',
  RESET_INSTANCE_PASSWORD: 'Reset Instance Password',
};
export const PackageDuration = ['1_MONTH', '12_MONTHS', '24_MONTHS'];

export const content0_data1 = [
  'Hỗ trợ 24/7/365',
  'Giao diện quản trị thân thiện, dễ sử dụng',
  'An toàn, bảo mật',
  'Tài nguyên không giới hạn',
  'Cam kết SLA 99,99%',
  'Triển khai nhanh',
];

export const content0_data2 = [
  {
    title: 'MONITOR TÀI NGUYÊN',
    content: 'Giám sát tài nguyên của VM ngay trên giao diện Webportal.',
  },
  {
    title: 'QUẢN TRỊ DỄ DÀNG',
    content:
      'Giao diện thân thiện, dễ thao tác. Tích hợp nhiều tính năng: khởi tạo, sửa, xóa, thay đổi cấu hình, cài đặt Firewall,…',
  },
  {
    title: 'TƯỜNG LỬA (FIREWALL)',
    content: 'Tùy chọn thiết lập chính sách truy cập.',
  },
  {
    title: 'BACKUP DỮ LIỆU',
    content:
      'Tính năng backup được tích hợp trong trang quản trị. Khách hàng có thể tùy chọn chu kỳ backup: ngày, tuần,….',
  },
  {
    title: 'SNAPSHOT',
    content:
      'Tính năng Snapshot được tích hợp trong trang quản trị. Hệ thống sẽ tự động sao lưu toàn bộ Server tại thời điểm kích hoạt.',
  },
  {
    title: 'VPN',
    content:
      'Tính năng mạng riêng ảo cao cấp (client to site, site to site) và xây dựng nhiều mạng nội bộ',
  },
];

export const CustomPackage = [
  { prefix: 'CPU', suffix: 'vCPU', max: 64 },
  { prefix: 'MEMORY', suffix: 'GB', step: 10, max: 2050 },
  { prefix: 'DISK', suffix: 'GB', step: 10, max: 2050 },
  { prefix: 'SNAPSHOT', suffix: 'GB', step: 10, max: 2050 },
  { prefix: 'BACKUP', suffix: 'GB', step: 10, max: 2050 },
];

export const Region = ['HCM', 'HN'];

export const Content4Products = [
  {
    id: 1,
    name: 'CPU',
    description: 'Intel Xeon',
    is_base: true,
    unit: 'vCPU',
  },
  {
    id: 2,
    name: 'MEMORY',
    unit: 'GB',
    is_base: true,
  },
  {
    id: 3,
    name: 'DISK',
    description: 'Intel Xeon',
    unit: 'GB',
    is_base: true,
  },
  {
    id: 4,
    name: 'IP',
    unit: 'IP',
    // unit: {
    //   id: 8,
    //   name: 'IP',
    //   code: 'IP',
    //   description: '',
    // },
    is_base: true,
  },
  {
    id: 5,
    name: 'NET',
    unit: 'Mbps',
    // unit: {
    //   id: 8,
    //   name: 'Mbps',
    //   code: 'Mbps',
    //   description: '',
    // },
    is_base: true,
  },
  {
    id: 6,
    name: 'SNAPSHOT',
    unit: 'GB',
    is_base: true,
  },
  {
    id: 7,
    name: 'BACKUP',
    unit: 'GB',
    is_base: true,
  },
];

export const settingCarousel = {
  draggable: true,
  swipeToSlide: true,
  speed: 500,
  slidesToShow: 4,
  responsive: [
    {
      breakpoint: 1024,
      settings: {
        slidesToShow: 3,
        // slidesToScroll: 3,
        infinite: true,
        dots: true,
      },
    },
    {
      breakpoint: 600,
      settings: {
        slidesToShow: 2,
        // slidesToScroll: 2,
        initialSlide: 2,
      },
    },
    {
      breakpoint: 480,
      settings: {
        slidesToShow: 1,
        // slidesToScroll: 1,
      },
    },
  ],
};
