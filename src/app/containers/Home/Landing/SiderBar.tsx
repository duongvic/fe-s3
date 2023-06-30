import {
  CloudServerOutlined,
  DashboardOutlined,
  FileSearchOutlined,
  LoginOutlined,
  LogoutOutlined,
  PushpinOutlined,
  UserAddOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Button, Menu } from 'antd';
import {
  selectAccount,
  selectAccountInfo,
} from 'app/containers/Auth/selectors';
import { actions } from 'app/containers/Auth/slice';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { Link, NavLink, useHistory } from 'react-router-dom';
import ModalCheckTwoFactor from './ModalCheckTwoFactor';

export default function SiderBar() {
  const [visible, setVisible] = useState(false);

  const account = useSelector(selectAccount);
  const accountInfo = useSelector(selectAccountInfo);

  const { t } = useTranslation();
  const dispatch = useDispatch();
  const history = useHistory();

  const handleLogout = () => {
    dispatch(actions.logout());
  };

  const handleClick = () => {
    if (account?.enable_two_factors) {
      history.push(`/dashboard`);
    } else {
      setVisible(true);
    }
  };

  return (
    <>
      <ModalCheckTwoFactor
        setVisible={value => setVisible(value)}
        visible={visible}
      />
      <Menu theme="dark" mode="inline" defaultSelectedKeys={['4']}>
        <Menu.SubMenu
          title={t('Navbar.PRODUCTS')}
          icon={<CloudServerOutlined />}
        >
          <Menu.Item>
            {window.location.pathname === '/' ? (
              <a href="/#custom_package">Compute</a>
            ) : (
              <Link to="/#custom_package">Compute</Link>
            )}
          </Menu.Item>
        </Menu.SubMenu>
        <Menu.SubMenu title={t('Navbar.SUPPORT')} icon={<FileSearchOutlined />}>
          <Menu.Item>
            <Link to="/docs">{t('Navbar.DOCUMENT')}</Link>
          </Menu.Item>
        </Menu.SubMenu>
        <Menu.SubMenu title={t('Navbar.INTRO')} icon={<PushpinOutlined />}>
          <Menu.Item>
            <Link to="/news/thu-ngo">{t('Navbar.INTRO_LETTER')}</Link>
          </Menu.Item>
          <Menu.Item>
            <Link to="/news/gioi-thieu-chung">{t('Navbar.INTRO')}</Link>
          </Menu.Item>
        </Menu.SubMenu>
        {account ? (
          <>
            <Menu.Item icon={<DashboardOutlined />}>
              <Button type="link" onClick={handleClick}>
                Dashboard
              </Button>
            </Menu.Item>
            <Menu.Item icon={<UserOutlined />}>
              <NavLink to="/profile">Profile</NavLink>
            </Menu.Item>
            <Menu.Item icon={<LogoutOutlined />} onClick={() => handleLogout()}>
              {t('Button.SIGN_OUT')}
            </Menu.Item>
          </>
        ) : (
          <>
            <Menu.Item icon={<LoginOutlined />}>
              <NavLink to="/sign-in">{t('Button.SIGN_IN')}</NavLink>
            </Menu.Item>
            <Menu.Item icon={<UserAddOutlined />}>
              <NavLink to="/sign-up">{t('Button.SIGN_UP')}</NavLink>
            </Menu.Item>
          </>
        )}
      </Menu>
    </>
  );
}
