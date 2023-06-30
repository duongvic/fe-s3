import {
  EllipsisOutlined,
  LogoutOutlined,
  SettingOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Avatar, Card, Dropdown, Skeleton, Tooltip } from 'antd';
import { actions } from 'app/containers/Auth/slice';
import { localPath } from 'path/local';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { selectAccount } from '../Auth/selectors';

const { Meta } = Card;

function AvatarUser(props) {
  const [visible, setVisible] = useState(false);

  const dispatch = useDispatch();
  const history = useHistory();

  const account = useSelector(selectAccount);

  const handleLogout = () => {
    dispatch(actions.logout());
  };

  const handleClickSetting = () => {
    history.push(localPath.profile.profile);
  };

  useEffect(() => {
    const hideUserInfo = () => {
      setVisible(false);
    };
    document.addEventListener('scroll', hideUserInfo);

    return () => {
      document.removeEventListener('scroll', hideUserInfo);
    };
  }, []);

  const userInfo = (
    <>
      <Card
        style={{ width: 300 }}
        actions={[
          <Tooltip placement="bottom" title="Setting">
            <SettingOutlined
              key="setting"
              style={{ fontSize: 16 }}
              onClick={handleClickSetting}
            />
          </Tooltip>,
          <Tooltip placement="bottom" title="More">
            <EllipsisOutlined key="ellipsis" />
          </Tooltip>,
          <Tooltip placement="bottom" title="Logout">
            <LogoutOutlined key="signout" onClick={handleLogout} />
          </Tooltip>,
        ]}
      >
        <Skeleton loading={false} avatar active>
          <Meta
            avatar={
              <Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />
            }
            title={account?.user_name}
            description={account?.email}
          />
        </Skeleton>
      </Card>
    </>
  );

  return (
    <Dropdown
      arrow={true}
      overlay={userInfo}
      trigger={['click']}
      visible={visible}
    >
      <div onClick={() => setVisible(!visible)}>
        <Avatar
          size="large"
          icon={<UserOutlined style={{ fontSize: '1.5rem' }} />}
          style={{ backgroundColor: '#24B24B' }}
        />
      </div>
    </Dropdown>
  );
}

export default AvatarUser;
