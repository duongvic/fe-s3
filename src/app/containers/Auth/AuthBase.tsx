import { Image, notification, Row, Space, Typography } from 'antd';
import logo from 'assets/img/logo/logo_2017.svg';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { noticficationBase } from 'utils/constant';
import { selectError, selectNotice } from './selectors';
import { actions } from './slice';
import './style.less';

interface props {
  title: string;
  children: any;
}

export default function AuthBase({ title, children }: props) {
  const dispatch = useDispatch();

  const notice = useSelector(selectNotice);
  const error = useSelector(selectError);
  useEffect(() => {
    if (notice) {
      noticficationBase('success', notice);
      dispatch(actions.setNotice(null));
    }
  }, [notice, dispatch]);

  useEffect(() => {
    if (error) {
      noticficationBase('error', error);
      dispatch(actions.setError(null));
    }
  }, [error, dispatch]);

  return (
    <Space direction="vertical" size="middle" className="auth-form">
      <Row justify="center">
        <NavLink to="/">
          <Image width={100} src={logo}></Image>
        </NavLink>
      </Row>
      <Row justify="center">
        <Typography.Title level={2}>{title}</Typography.Title>
      </Row>
      <Row justify="center">{children}</Row>
    </Space>
  );
}
