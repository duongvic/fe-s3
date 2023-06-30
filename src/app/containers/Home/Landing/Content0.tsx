import { Carousel, Col, Divider, Row, Space, Typography } from 'antd';
import i18next from 'i18next';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import {
  selectBenefitServices,
  selectDesServices,
  selectFeatures,
} from '../selectors';
import { settingCarousel } from './constants';
import Effect from './Effect';

export default function Content0(props) {
  const { t } = useTranslation();
  const currentLanguage = i18next.language ?? window.localStorage.i18nextLng;

  const desServices = useSelector(selectDesServices);
  const benefitServices = useSelector(selectBenefitServices);
  const features = useSelector(selectFeatures);

  const renderFeatures = () => {
    const featuresSelectedByLng =
      currentLanguage === 'vi-VN' ? features?.vi : features?.en;
    return featuresSelectedByLng?.map(item => (
      <Col
        key={item.title}
        lg={8}
        sm={12}
        xs={24}
        style={{
          padding: 10,
          minHeight: 120,
        }}
      >
        <Space
          direction="vertical"
          size={0}
          style={{
            background: '#EDF4FF',
            padding: 10,
            height: '100%',
            width: '100%',
          }}
        >
          <Row justify="center">
            <Typography.Title level={4}>{item?.title}</Typography.Title>
          </Row>
          <Row justify="center">
            <Typography.Text style={{ textAlign: 'center' }}>
              {item?.body}
            </Typography.Text>
          </Row>
        </Space>
      </Col>
    ));
  };

  const renderDesService = () => {
    const whichDesService =
      currentLanguage === 'vi-VN' ? desServices?.vi : desServices?.en;
    return (
      <Row
        justify="space-between"
        style={{ padding: '64px 10px', maxWidth: 1200 }}
      >
        <Col lg={15} xs={24}>
          <Space direction="vertical">
            <Typography.Text strong style={{ fontSize: 40 }}>
              {whichDesService?.title}
            </Typography.Text>
            <Typography.Text strong style={{ fontSize: 25 }}>
              {whichDesService?.sub_title}
            </Typography.Text>
            <Col xs={2}>
              <Divider style={{ height: 3, background: '#5eaff0' }} />
            </Col>
            <Typography.Text>{whichDesService?.body}</Typography.Text>
          </Space>
        </Col>
        <Col lg={8} xs={24}>
          <Row justify="center">
            <img
              src={whichDesService?.image}
              alt=""
              style={{ borderRadius: '50%', height: 308 }}
            />
          </Row>
        </Col>
      </Row>
    );
  };

  const renderBenefitServices = () => {
    const whichBenefitService =
      currentLanguage === 'vi-VN' ? benefitServices?.vi : benefitServices?.en;
    return whichBenefitService?.map((item, idx) => (
      <div key={idx}>
        <div style={{ padding: '0 5px' }}>
          <Row
            style={{
              background: 'white',
              padding: '15px 0',
            }}
            align="top"
            justify="center"
          >
            <Col span={6}>
              <img
                src={item?.image}
                alt=""
                width={70}
                style={{
                  display: 'initial',
                }}
              />
            </Col>
            <Col span={17}>
              <Row justify="center">
                <Typography.Text
                  strong
                  style={{ fontSize: 18, textAlign: 'center' }}
                >
                  {item?.title}
                </Typography.Text>
              </Row>
            </Col>
          </Row>
        </div>
      </div>
    ));
  };

  return (
    <div className="content0">
      <Row justify="center" style={{ background: 'white', minHeight: 458 }}>
        <Effect>{renderDesService()}</Effect>
      </Row>
      <Row justify="center">
        <Row style={{ maxWidth: 1200, width: '100%', minHeight: 308 }}>
          <Space
            direction="vertical"
            style={{ padding: '64px 10px', width: '100%' }}
            size="large"
          >
            <Row justify="center">
              <Typography.Title style={{ textAlign: 'center' }}>
                {t('Title.CONTENT_0_1')}
              </Typography.Title>
            </Row>
            <Carousel autoplay={true} {...settingCarousel}>
              {renderBenefitServices()}
            </Carousel>
          </Space>
        </Row>
      </Row>

      <Row justify="center" style={{ background: 'white', minHeight: 505 }}>
        <Space
          size="large"
          style={{ width: '100%', padding: '64px 0', maxWidth: 1200 }}
          direction="vertical"
        >
          <Row justify="center">
            <Typography.Title>{t('Title.CONTENT_0_2')}</Typography.Title>
          </Row>
          <Effect>
            <Row justify="center">{renderFeatures()}</Row>
          </Effect>
        </Space>
      </Row>
    </div>
  );
}
