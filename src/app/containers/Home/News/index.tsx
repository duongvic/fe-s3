import { Col, Divider, Row, Typography } from 'antd';
import bannerBottom from 'assets/img/news/banner_all_1.jpg';
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Redirect, useRouteMatch } from 'react-router';
import LandingBase from '../Landing/LandingBase';
import Banner from './Banner';
import SiderBar from './SiderBar';
import './style.less';

export default function News(props) {
  const match: any = useRouteMatch();
  const { t } = useTranslation(['letter', 'introduction']);

  const target = match?.params.target;
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const renderTitle = () => {
    let title: string;
    if (target === 'thu-ngo') title = 'title';
    else title = 'introduction:title';
    return <Typography.Title>{t(title).toUpperCase()}</Typography.Title>;
  };

  const renderTypo = input => (
    <Typography style={{ margin: '10px 0' }}>&emsp;&emsp;{input}</Typography>
  );

  const renderLetter = () => (
    <>
      {renderTypo(t('block1'))}
      {renderTypo(t('block2'))}
      {renderTypo(t('block3'))}
      {renderTypo(t('block4'))}
    </>
  );
  const renderIntro = () => (
    <>
      {renderTypo(t('introduction:block1'))}
      {renderTypo(t('introduction:block2'))}
      {renderTypo(t('introduction:block3'))}
    </>
  );

  const getTitle = () => {
    if (target === 'thu-ngo') return 'title';
    else return 'introduction:title';
  };
  return (
    <LandingBase>
      <div className="news">
        <Banner title={t(getTitle())}></Banner>
        <Row justify="center">
          <Row justify="space-between" className="news-content">
            <Col lg={16} style={{ padding: 16 }}>
              {renderTitle()}
              <Divider className="divider1"></Divider>
              <Divider className="divider2"></Divider>
              {target === 'thu-ngo' ? renderLetter() : renderIntro()}
            </Col>
            <Col md={24} lg={7}>
              <SiderBar></SiderBar>
            </Col>
          </Row>
        </Row>
        <Row justify="center">
          <img
            src={bannerBottom}
            style={{ marginBottom: '2rem', maxWidth: '100%' }}
          />
        </Row>
      </div>
    </LandingBase>
  );
}
