import { Col, Divider, Row, Space, Typography } from 'antd';
import React from 'react';

import img from 'assets/img/news/tin.jpg';
import { PlayCircleTwoTone } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const siderbarTop = [
  { title: 'Hosting FPT tham gia sự kiện OpenInfra Day', image: img },
  { title: 'Hosting FPT tham gia sự kiện OpenInfra Day', image: img },
  { title: 'Hosting FPT tham gia sự kiện OpenInfra Day', image: img },
];
const siderbarBottom = [
  {
    title: 'Internet FPT Telecom - Mọi dịch vụ trên một kết nối',
    link: 'tJNTc47UZSo',
  },
  { title: 'FPT Telecom Trung Tâm Dữ Liệu', link: '9AxorIC1dNU' },
  {
    title: 'Bảo mật thông tin trong công nghệ lưu trữ đám mây',
    link: 'r3gxOGJ2dys',
  },
];

export default function SiderBar() {
  const { t } = useTranslation();
  return (
    <Row justify="space-around" gutter={[0, 32]} className="news-siderbar">
      <Col lg={24} md={11}>
        <Space direction="vertical" className="siderbar-item">
          <Typography.Title level={4} style={{ color: '#5EAFF0', margin: 0 }}>
            {t('Title.RELATED_NEWS')}
          </Typography.Title>
          {siderbarTop.map((item, idx) => (
            <div key={idx}>
              <Divider style={{ margin: 0 }}></Divider>
              <Space size="middle">
                <img src={item.image} alt="" width={70} height={70} />
                <Typography.Text>{item.title}</Typography.Text>
              </Space>
            </div>
          ))}
          <Divider dashed style={{ margin: '5px 0' }}></Divider>
          <Row justify="center" align="middle">
            <Link to="/" style={{ color: '#5EAFF0' }}>
              Các tin khác
            </Link>
          </Row>
        </Space>
      </Col>
      <Col lg={24} md={12}>
        <Space direction="vertical" className="siderbar-item">
          <Typography.Title level={4} style={{ color: '#5EAFF0' }}>
            VIDEO
          </Typography.Title>
          <Divider style={{ margin: '0 0 5px' }}></Divider>
          <iframe
            style={{ width: '100%' }}
            src="https://www.youtube.com/embed/tJNTc47UZSo"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
          {siderbarBottom.map((item, idx) => (
            <Row align="middle" justify="space-between" key={idx}>
              <Col md={3} xs={0}>
                <PlayCircleTwoTone style={{ fontSize: 40 }} />
              </Col>
              <Col md={20}>
                <a
                  href={`https://www.youtube.com/embed/${item.link}`}
                  style={{ color: '#1890FF' }}
                >
                  {item.title}
                </a>
              </Col>
            </Row>
          ))}
        </Space>
      </Col>
    </Row>
  );
}
