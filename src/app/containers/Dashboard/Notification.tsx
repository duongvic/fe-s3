import { BellOutlined } from '@ant-design/icons';
import { Badge, Dropdown, Menu } from 'antd';
import React, { useState } from 'react';

const menu = (
  <>
    <Menu>
      <Menu.Item key="0">
        <a href="/">1st menu item</a>
      </Menu.Item>
      <Menu.Item key="1">
        <a href="/">2nd menu item</a>
      </Menu.Item>
      <Menu.Item key="2">3rd menu item</Menu.Item>
    </Menu>
  </>
);

export default function Notification() {
  const [count, setCount] = useState(3);

  const handleClickBell = () => {
    setCount(0);
  };

  return (
    <div style={{ display: 'flex' }}>
      <Dropdown
        arrow={true}
        overlay={menu}
        trigger={['click']}
        placement="bottomCenter"
      >
        <Badge count={count}>
          <BellOutlined
            style={{ fontSize: 30, color: count ? '#F27024' : '#fff' }}
            onClick={handleClickBell}
          />
        </Badge>
      </Dropdown>
    </div>
  );
}
