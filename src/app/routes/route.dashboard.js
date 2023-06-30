import {
  CloudServerOutlined,
  FundOutlined,
  HddOutlined,
  IdcardOutlined,
  LogoutOutlined,
  ShoppingCartOutlined,
  TeamOutlined,
  UserOutlined,
} from '@ant-design/icons';
import Account from 'app/containers/Account';
import SignOut from 'app/containers/Auth/SignOut';
import Instances from 'app/containers/Compute/Instances';
import Orders from 'app/containers/Orders';
import Products from 'app/containers/Products';
import Users from 'app/containers/Users';
import React from 'react';

// Menu left
export const dashboardRoutes = [
  // {
  //   name: 'Instances',
  //   icon: <CloudServerOutlined className="submenu-icon" />,
  //   role: ['USER', 'ADMIN', 'IT_ADMIN', 'SALE_ADMIN'],
  //   children: [
  //     // {
  //     //   path: '/instances',
  //     //   requireTwoFactor: true,
  //     //   name: 'Overview',
  //     //   icon: <FundOutlined />,
  //     //   role: ['USER', 'ADMIN', 'IT_ADMIN', 'SALE_ADMIN'],
  //     //   component: <Instances />,
  //     // },
  //     // {
  //     //   path: '/keypairs',
  //     //   name: 'Keypairs',
  //     //   icon: <KeyOutlined />,
  //     //   role: ['USER', 'ADMIN', 'IT_ADMIN', 'SALE_ADMIN'],
  //     //   exact: true,
  //     //   component: <DataViewKeypairs />,
  //     // },
  //     // {
  //     //   path: '/security',
  //     //   name: 'Security',
  //     //   icon: <SecurityScanOutlined />,
  //     //   exact: true,
  //     //   // component: SecGroups
  //     // },
  //   ],
  // },
  {
    name: 'Orders',
    role: ['ADMIN', 'IT_ADMIN', 'SALE_ADMIN', 'PORTAL_ADMIN'],
    icon: <ShoppingCartOutlined className="submenu-icon" />,
    children: [
      {
        path: '/orders',
        requireTwoFactor: true,
        role: ['ADMIN', 'IT_ADMIN', 'SALE_ADMIN', 'PORTAL_ADMIN'],
        name: 'Overview',
        icon: <FundOutlined />,
        component: <Orders />,
      },
      {
        path: '/products',
        requireTwoFactor: true,
        role: ['ADMIN', 'IT_ADMIN', 'PORTAL_ADMIN'],
        name: 'Products',
        icon: <HddOutlined />,
        component: <Products />,
      },
    ],
  },
  {
    role: ['ADMIN', 'IT_ADMIN', 'SALE_ADMIN', 'PORTAL_ADMIN'],
    name: 'Users',
    icon: <TeamOutlined className="submenu-icon" />,
    children: [
      {
        path: '/users',
        requireTwoFactor: true,
        role: ['ADMIN', 'IT_ADMIN', 'SALE_ADMIN', 'PORTAL_ADMIN'],
        name: 'Overview',
        icon: <FundOutlined />,
        component: <Users />,
      },
    ],
  },
  {
    role: ['ADMIN', 'IT_ADMIN', 'SALE_ADMIN', 'SALE', 'PORTAL_ADMIN'],
    name: 'Account',
    icon: <IdcardOutlined className="submenu-icon" />,
    children: [
      {
        path: '/profile',
        requireTwoFactor: false,
        role: ['ADMIN', 'IT_ADMIN', 'SALE_ADMIN', 'SALE', 'PORTAL_ADMIN'],
        name: 'Profile',
        icon: <UserOutlined />,
        component: <Account />,
      },
      // {
      //   path: '/sign-out',
      //   requireTwoFactor: false,
      //   role: ['ADMIN', 'IT_ADMIN', 'SALE_ADMIN', 'USER'],
      //   name: 'Logout',
      //   icon: <LogoutOutlined />,
      //   component: <SignOut />,
      // },
    ],
  },
];
