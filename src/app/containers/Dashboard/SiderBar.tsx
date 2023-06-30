import { Menu } from 'antd';
import React from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import logo from '../../../assets/img/logo/logo_2017.svg';
import { dashboardRoutes } from '../../routes/route.dashboard';
import { selectAccount } from '../Auth/selectors';
import './styles.less';

const { SubMenu } = Menu;

export default function SiderBar() {
  const history = useHistory();
  const setting = localStorage.getItem('setting');

  // console.log('settingSiderBar ', setting);

  let defaultNavItem = setting ? JSON.parse(setting)?.navItem : '/orders';
  defaultNavItem = defaultNavItem || '/orders';

  // console.log('defaultNavItem', defaultNavItem);

  const account = useSelector(selectAccount);

  // console.log('duong SliderBar account', account);
  const handleClickLink = e => {
    history.push(`/dashboard${e.key}`);
  };

  const handleClickLogo = () => history.push('/');
  const onSelect = ({ item, key }) => {
    const newSetting = setting
      ? { ...JSON.parse(setting), navItem: key }
      : { navItem: key };
    localStorage.setItem('setting', JSON.stringify(newSetting));
  };

  const menu = (
    <Menu
      theme="dark"
      mode="inline"
      // defaultOpenKeys={['Instances', 'Orders', 'Users', 'Account']}
      defaultOpenKeys={['Orders', 'Users', 'Account']}
      defaultSelectedKeys={[defaultNavItem]}
      onClick={handleClickLink}
      style={{ width: '100%' }}
      onSelect={onSelect}
    >
      {dashboardRoutes?.map(
        prop =>
          prop?.role?.some(
            element => element === account?.role?.toUpperCase(),
          ) && (
            <SubMenu
              key={prop?.name}
              icon={prop?.icon}
              title={prop?.name}
              className="submenu"
            >
              {prop.children.map(
                chil =>
                  chil?.role?.some(
                    element => element === account?.role?.toUpperCase(),
                  ) && (
                    <Menu.Item key={`${chil.path}`} icon={chil.icon}>
                      {chil.name}
                    </Menu.Item>
                  ),
              )}
            </SubMenu>
          ),
      )}
    </Menu>
  );

  return (
    <>
      <div className="logo">
        <img src={logo} alt="logo" onClick={handleClickLogo} />
      </div>
      {menu}
    </>
  );
}
