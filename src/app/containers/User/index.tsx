import TabPane from '@ant-design/pro-card/lib/components/TabPane';
import { Tabs } from 'antd';
import TabBase from 'app/components/TabBase';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import ChangePassword from './ChangePassword';
import Instances from './Instances';
import Orders from './Orders';
import './style.less';
import UserDetail from './UserDetail';

const User = React.memo(() => {
  const [activeKey, setActiveKey] = useState('user_info');
  const { t } = useTranslation(['translation', 'constant']);

  const onTabClick = e => {
    setActiveKey(e);
    window.location.hash = e;
  };

  useEffect(() => {
    switch (window.location.hash) {
      case '#instances':
        setActiveKey('instances');
        break;
      case '#orders':
        setActiveKey('orders');
        break;
      default:
        setActiveKey('user_info');
        break;
    }
  }, []);

  return (
    <div className="card-container">
      <Tabs type="card" activeKey={activeKey} onTabClick={onTabClick}>
        {TabBase(<UserDetail />, t('Title.USER_INFO'), 'user_info')}
        {/* {TabBase(
          <ChangePassword />,
          t('Title.CHANGE_PASSWORD'),
          'change_password',
        )} */}
        <TabPane tab={t('constant:Title.ORDERS')} key="orders">
          <Orders />
        </TabPane>
      </Tabs>
    </div>
  );
});

export default User;
