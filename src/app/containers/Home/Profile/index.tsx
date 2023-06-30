import { Col, Menu, Row } from 'antd';
import { usersSaga } from 'app/containers/Users/saga';
import { reducer, sliceKey } from 'app/containers/Users/slice';
import UserDetail from 'app/containers/User/UserDetail';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';
import Effect from '../Landing/Effect';
import LandingBase from '../Landing/LandingBase';
import './style.less';
import SecurityOption from 'app/containers/Account/SecurityOption';
import ChangePassword from 'app/containers/User/ChangePassword';

export default function Profile() {
  useInjectReducer({ key: sliceKey, reducer: reducer });
  useInjectSaga({ key: sliceKey, saga: usersSaga });

  const [current, setCurrent]: any = useState('update-profile');

  const { t } = useTranslation();

  const renderContent = () => {
    if (current === 'update-profile') return <UserDetail />;
    else if (current === 'change-security') return <ChangePassword />;
    else if (current === 'auth-option') return <SecurityOption />;
  };

  useEffect(() => {
    if (window.location.hash === '#security_option') {
      setCurrent('auth-option');
    }
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <LandingBase>
      <div className="profile">
        <Menu
          onClick={value => setCurrent(value.key)}
          selectedKeys={[current]}
          style={{
            background: 'transparent',
            display: 'flex',
            justifyContent: 'center',
            marginBottom: '1rem',
          }}
          mode="horizontal"
        >
          <Menu.Item key="update-profile">{t('Title.USER_INFO')}</Menu.Item>
          <Menu.Item key="change-security">
            {t('Title.CHANGE_PASSWORD')}
          </Menu.Item>
          <Menu.Item key="auth-option">{t('Title.SECURITY_OPTION')}</Menu.Item>
        </Menu>
        <div className="profile--form">
          <Row>
            <Col xl={6} lg={0}></Col>
            <Col xl={12} lg={24} style={{ width: '100%' }}>
              <Effect>{renderContent()}</Effect>
            </Col>
          </Row>
        </div>
      </div>
    </LandingBase>
  );
}
