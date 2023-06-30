import { Tabs } from 'antd';
import TabBase from 'app/components/TabBase';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import ChangePassword from '../User/ChangePassword';
import UserDetail from '../User/UserDetail';
import SecurityOption from './SecurityOption';

export default function Account() {
  const [activeKey, setActiveKey] = useState('1');
  const { t } = useTranslation();

  const handleTabClick = key => {
    setActiveKey(key);
  };

  useEffect(() => {
    if (window.location.hash === '#security_option') {
      setActiveKey('3');
    }
  }, []);

  return (
    <div className="card-container">
      <Tabs type="card" activeKey={activeKey} onTabClick={handleTabClick}>
        {TabBase(<UserDetail />, t('Title.USER_INFO'), '1')}
        {TabBase(<ChangePassword />, t('Title.CHANGE_PASSWORD'), '2')}
        {TabBase(<SecurityOption />, t('Title.SECURITY_OPTION'), '3')}
      </Tabs>
    </div>
  );
}
