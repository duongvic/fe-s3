import { Col, Row, Typography } from 'antd';
import QueueAnim from 'rc-queue-anim';
import OverPack from 'rc-scroll-anim/lib/ScrollOverPack';
import TweenOne from 'rc-tween-one';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { selectContacts } from '../selectors';

export default function Footer(props) {
  const { t } = useTranslation(['translation', 'constant']);
  const contacts = useSelector(selectContacts);
  return (
    <div className="home-page-wrapper footer1-wrapper" style={{ zIndex: 1 }}>
      <OverPack className="footer1" playScale={0.1} {...{ always: false }}>
        <QueueAnim
          type="bottom"
          key="ul"
          leaveReverse
          component={Row}
          className="home-page"
        >
          <Col key="block0" xs={24} sm={12} md={6} className="block">
            <img
              className="logo"
              src="https://upload.wikimedia.org/wikipedia/vi/a/a2/FPT_Telecom_logo.svg"
              width="100%"
              alt="img"
            />
            <p>{t('Footer.COMPANY_NAME')}</p>
            <p>{t('Footer.COMPANY_ADDRESS')}</p>
            <p>Hotline: {contacts?.phone}</p>
            <p>Email: {contacts?.email}</p>
          </Col>
          <Col key="block1" xs={24} sm={12} md={6} className="block">
            <Typography.Title level={2}>
              {t('Footer.PRODUCTS')}
            </Typography.Title>
            <Link to="#">{t('constant:Footer.FAQ')}</Link>
            <Link to="/#custom_package">
              {t('constant:Footer.VIRTUAL_DATA_SERVER')}
            </Link>
            <Link to="#">{t('constant:Footer.VDC_SERVICE')}</Link>
            <Link to="#">{t('constant:Footer.BUSINESS_EMAIL')}</Link>
            <Link to="#">{t('constant:Footer.LOAD_BALANCER')}</Link>
            <Link to="#">{t('constant:Footer.SIMPLE_STORAGE')}</Link>
            <Link to="#">{t('Footer.MORE')}</Link>
          </Col>
          <Col key="block2" xs={24} sm={12} md={6} className="block">
            <Typography.Title level={2}>
              {t('Footer.ABOUT_FTI_VDC')}
            </Typography.Title>
            <Link to="#">{t('Footer.INTRODUCTION')}</Link>
            <Link to="#">{t('Footer.RECRUITMENT')}</Link>
            <Link to="#">{t('Footer.CUSTOMERS')}</Link>
            <Link to="#">{t('Footer.PRIVACY_POLICY')}</Link>
            <Link to="#">{t('Footer.MORE')}</Link>
          </Col>
          <Col key="block3" xs={24} sm={12} md={6} className="block">
            <Typography.Title level={2}>{t('Footer.ADDRESS')}</Typography.Title>
            <strong>{t('Footer.HEADQUARTERS')}</strong>
            <p>{t('Footer.ADDRESS_IN_HN')}</p>
            <strong>{t('Footer.BRANCH_IN_HCM')}</strong>
            <p>{t('Footer.ADDRESS_IN_HCM')}</p>
            <strong>{t('Footer.BRANCH_IN_DN')}</strong>
            <p>{t('Footer.ADDRESS_IN_DN')}</p>
          </Col>
        </QueueAnim>
        <TweenOne
          animation={{ y: '+=30', opacity: 0, type: 'from' }}
          key="copyright"
          className="copyright-wrapper"
        >
          <div className="home-page">
            <div className="copyright">
              <p>{t('Footer.BOTTOM_FOOTER')}</p>
            </div>
          </div>
        </TweenOne>
      </OverPack>
    </div>
  );
}
