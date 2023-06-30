import {
  CaretDownOutlined,
  FacebookFilled,
  MailFilled,
  PhoneFilled,
  YoutubeFilled,
} from '@ant-design/icons';
import { Button, Col, Divider, Dropdown, Menu, Row, Space } from 'antd';
import ChangeLanguageSelect from 'app/components/ChangeLanguageSelect';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { Link, NavLink, useHistory, useLocation } from 'react-router-dom';
import { useInjectReducer } from 'utils/redux-injectors';
import { selectAccount, selectAccountInfo } from '../../Auth/selectors';
import { reducer, sliceKey } from '../../Auth/slice';
import AvatarUser from '../../Dashboard/AvatarUser';
import { selectContacts, selectNavbars } from '../selectors';
import './less/navbar.less';
import ModalCheckTwoFactor from './ModalCheckTwoFactor';

export default function Navbar(props) {
  useInjectReducer({ key: sliceKey, reducer: reducer });

  const [visible, setVisible] = useState(false);
  const [isScroll, setIsScroll] = useState(false);

  const location = useLocation();
  const account = useSelector(selectAccount);
  const accountInfo = useSelector(selectAccountInfo);
  const logo = useSelector(selectNavbars);
  const contacts = useSelector(selectContacts);

  const history = useHistory();
  const { t } = useTranslation();

  const setting: any = localStorage.getItem('setting');
  let dashboardNavItem = setting ? JSON.parse(setting)?.navItem : '';
  dashboardNavItem = dashboardNavItem || '';

  const handleClick = () => {
    if (account?.enable_two_factors) {
      history.push(`/dashboard${dashboardNavItem}`);
    } else {
      setVisible(true);
    }
  };

  const isSelected = input => {
    if (input) return 'selected-item';
    return '';
  };
  const product = (
    <Menu>
      <Menu.Item>
        {window.location.pathname === '/' ? (
          <a href="/#custom_package">Compute</a>
        ) : (
          <Link to="/#custom_package">Compute</Link>
        )}
      </Menu.Item>
      <Menu.Item>
        {window.location.pathname === '/' ? (
          <a href="/#custom_package">VDC</a>
        ) : (
          <Link to="/#custom_package">VDC</Link>
        )}
      </Menu.Item>
    </Menu>
  );
  const support = (
    <Menu>
      <Menu.Item
        className={`${isSelected(location.pathname === '/news/thu-ngo')}`}
      >
        <Link to="/news/thu-ngo">{t('Navbar.INTRO_LETTER')}</Link>
      </Menu.Item>
      <Menu.Item
        className={`${isSelected(
          location.pathname === '/news/gioi-thieu-chung',
        )}`}
      >
        <Link to="/news/gioi-thieu-chung">{t('Navbar.INTRO')}</Link>
      </Menu.Item>
    </Menu>
  );
  useEffect(() => {
    const scrollEffect = () => {
      if (window.scrollY > 100) {
        setIsScroll(true);
      } else {
        setIsScroll(false);
      }
    };
    document.addEventListener('scroll', scrollEffect);
    return () => document.removeEventListener('scroll', scrollEffect);
  }, [logo]);
  return (
    <>
      <ModalCheckTwoFactor
        visible={visible}
        setVisible={value => setVisible(value)}
      />
      <div
        className={`header-landing ${
          isScroll ? 'header-scroll' : 'header-default'
        }`}
      >
        <Row
          align="middle"
          className="header-landing--top"
          style={{ display: `${isScroll ? 'none' : 'flex'}` }}
        >
          <Col span={2} push={1}>
            <Space size={24}>
              <NavLink to="/">
                <FacebookFilled />
              </NavLink>
              <NavLink to="/">
                <YoutubeFilled />
              </NavLink>
            </Space>
          </Col>
          <Col span={21}>
            <Row justify="end">
              <Space size={50}>
                <a href={`tel:${contacts?.phone}`}>
                  <PhoneFilled />
                  &nbsp; Hotline: {contacts?.phone}
                </a>
                <a href={`mailto:${contacts?.email}`}>
                  <MailFilled />
                  &nbsp; Email: {contacts?.email}
                </a>
              </Space>
            </Row>
          </Col>
        </Row>

        <Row>
          <Col span={22} push={1}>
            <Divider
              className="header-landing--divider"
              style={{ display: `${isScroll ? 'none' : ''}` }}
            ></Divider>
          </Col>
        </Row>
        <Row wrap={false} className="header-landing--bottom" align="middle">
          <Col span={2} push={1}>
            <NavLink to="/">
              <img src={logo} height={50} alt=""></img>
            </NavLink>
          </Col>
          <Col span={21} className="right">
            <Row justify="end">
              <Menu mode="horizontal" className="landing-menu">
                <Menu.Item key="1">
                  <Dropdown
                    overlay={product}
                    placement="bottomCenter"
                    arrow={true}
                  >
                    <Button
                      type="link"
                      className={isScroll ? 'text-black' : 'text-white'}
                      style={{ padding: 0 }}
                    >
                      {t('Navbar.PRODUCTS').toUpperCase()}
                      <CaretDownOutlined />
                    </Button>
                  </Dropdown>
                </Menu.Item>
                <Menu.Item key="2">
                  <Dropdown
                    overlay={support}
                    placement="bottomCenter"
                    arrow={true}
                  >
                    <Button
                      className={isScroll ? 'text-black' : 'text-white'}
                      type="link"
                      style={{ padding: 0 }}
                    >
                      {t('Navbar.INTRODUCTION').toUpperCase()}
                      <CaretDownOutlined />
                    </Button>
                  </Dropdown>
                </Menu.Item>
                <Menu.Item key="3">
                  <Link
                    to="/docs"
                    className={isScroll ? 'text-black' : 'text-white'}
                    rel="noreferrer"
                  >
                    {t('Navbar.DOCUMENT').toUpperCase()}
                  </Link>
                </Menu.Item>
                <Menu.Item key="4" style={{ marginRight: 0 }}>
                  <ChangeLanguageSelect
                    className={isScroll ? 'text-black' : 'text-white'}
                  />
                </Menu.Item>
                {account ? (
                  <>
                    <Menu.Item key="5" style={{ marginRight: 0 }}>
                      <Button
                        type="link"
                        className={isScroll ? 'text-black' : 'text-white'}
                        onClick={handleClick}
                      >
                        DASHBOARD
                      </Button>
                    </Menu.Item>
                    <div style={{ marginLeft: '3rem' }}>
                      <AvatarUser user={props.user} />
                    </div>
                  </>
                ) : (
                  <>
                    <Menu.Item key="5">
                      <NavLink
                        to="/sign-in"
                        className={isScroll ? 'text-black' : 'text-white'}
                      >
                        {t('Button.SIGN_IN').toUpperCase()}
                      </NavLink>
                    </Menu.Item>
                    <Menu.Item key="6" style={{ marginRight: 0 }}>
                      <NavLink
                        to="/sign-up"
                        className={isScroll ? 'text-black' : 'text-white'}
                      >
                        {t('Button.SIGN_UP').toUpperCase()}
                      </NavLink>
                    </Menu.Item>
                  </>
                )}
              </Menu>
            </Row>
          </Col>
        </Row>
      </div>
      <Row className="header-mobile">
        <Col xs={24} md={0}>
          <Row justify="space-between" align="middle">
            <NavLink to="/">
              <img src={logo} height={50} alt=""></img>
            </NavLink>
            <Col sm={account ? 4 : 10} xs={account ? 10 : 16}>
              <Row justify="space-between" align="middle">
                <ChangeLanguageSelect />
                {account ? (
                  <>
                    <AvatarUser user={props.user} />
                  </>
                ) : (
                  <>
                    <NavLink to="/sign-in">
                      {t('Button.SIGN_IN').toUpperCase()}
                    </NavLink>
                    <NavLink to="/sign-up" className="signup-button">
                      {t('Button.SIGN_UP').toUpperCase()}
                    </NavLink>
                  </>
                )}
              </Row>
            </Col>
          </Row>
        </Col>
      </Row>
    </>
  );
}
