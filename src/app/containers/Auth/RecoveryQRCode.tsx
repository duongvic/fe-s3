import { MailOutlined } from '@ant-design/icons';
import { Form, Input, Row } from 'antd';
import QRCode from 'qrcode.react';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { NavLink, useHistory } from 'react-router-dom';
import AuthBase from './AuthBase';
import { Pattern } from './constants';

export default function RecoveryQRCode() {
  const [qrCode, setQrCode] = useState('');
  const [userInfo, setUserInfo]: any = useState('');

  const history = useHistory();
  const { t } = useTranslation();

  useEffect(() => {
    if (history.location.pathname.match('GOOGLE:')) {
      setQrCode(
        history.location.pathname.replace('/two-factor/recovery/', '') +
          history.location.search,
      );
      setUserInfo(qrCode.match(Pattern.GET_EMAIL)?.[0]);
    }
  });

  return (
    <AuthBase title={t('Title.RECOVERY_QR_CODE')}>
      <Form>
        <Input
          disabled
          size="large"
          value={userInfo}
          prefix={<MailOutlined className="site-form-item-icon" />}
        />
        <Row justify="center">
          <QRCode value={qrCode} size={290} level={'H'} includeMargin={true} />
        </Row>
        <Row justify="center">
          <NavLink to="/sign-in">{t('Link.BACK_TO_SIGN_IN')}</NavLink>
        </Row>
      </Form>
    </AuthBase>
  );
}
