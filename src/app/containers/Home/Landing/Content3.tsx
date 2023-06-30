import { Carousel, Row, Space, Typography } from 'antd';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { selectCustomers } from '../selectors';
import { settingCarousel } from './constants';

export default function Content3(props) {
  const customers = useSelector(selectCustomers);

  const { t } = useTranslation();

  return (
    <div className="home-page-wrapper content3-wrapper">
      <div className="home-page content3">
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <Row justify="center">
            <Typography.Title style={{ textAlign: 'center' }}>
              {t('Title.CONTENT_3')}
            </Typography.Title>
          </Row>
          <Carousel autoplay={true} {...settingCarousel}>
            {customers?.map((item, idx) => (
              <img src={item} key={idx}></img>
            ))}
          </Carousel>
        </Space>
      </div>
    </div>
  );
}
