import { Breadcrumb, Divider, Row, Space, Typography } from 'antd';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

export default function Banner(props) {
  const { t } = useTranslation();
  const Separator = (
    <Breadcrumb.Separator>
      <Typography.Text style={{ color: 'white' }}>{'>'}</Typography.Text>
    </Breadcrumb.Separator>
  );
  return (
    <Row className="news-banner" justify="center" align="middle">
      <Space style={{ maxWidth: 1200, width: '100%' }} direction="vertical">
        <Typography.Title style={{ color: 'white', fontSize: 45 }}>
          {`${props.title}`.toUpperCase()}
        </Typography.Title>
        <Row align="middle">
          <Divider
            style={{
              background: '#5EAFF0',
              width: '3rem',
              height: 1.8,
              minWidth: 1,
              marginRight: '1rem',
            }}
          ></Divider>
          <Breadcrumb separator="" className="breadcrumb">
            <Breadcrumb.Item>
              <Link to="/" style={{ color: 'white' }}>
                {t('Title.MAIN_PAGE')}
              </Link>
            </Breadcrumb.Item>
            {Separator}
            <Breadcrumb.Item>
              <Typography.Text style={{ color: 'white' }}>
                {props.title}
              </Typography.Text>
            </Breadcrumb.Item>
          </Breadcrumb>
        </Row>
      </Space>
    </Row>
  );
}
