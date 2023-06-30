import { Button, Form, Input, Modal } from 'antd';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { Pattern } from './constants';
import { selectError, selectLoading } from './selectors';

interface props {
  visible: boolean;
  setVisible: () => void;
  submitWithOtp: (value) => void;
}

export default function RequireOtp({
  visible,
  submitWithOtp,
  setVisible,
}: props) {
  const { t } = useTranslation();

  const loading = useSelector(selectLoading);
  const error = useSelector(selectError);

  const onFinish = value => {
    submitWithOtp(String(value.otp));
  };
  return (
    <Modal
      title={t('Title.OTP')}
      visible={visible}
      width={335}
      footer={null}
      onCancel={setVisible}
      closable={true}
      maskClosable={false}
    >
      <p style={{ textAlign: 'center', color: error ? 'red' : '' }}>
        {error ? error : t('Message.REQUIRE_OTP')}
      </p>
      <Form onFinish={onFinish}>
        <Form.Item
          name="otp"
          rules={[
            { required: true, message: t('Field_Message.OTP') },
            { pattern: Pattern.OTP, message: t('Invalid_Pattern.OTP') },
          ]}
        >
          <Input
            style={{ width: '100%' }}
            size="large"
            placeholder={t('Placeholder.OTP')}
            maxLength={6}
            autoFocus
          ></Input>
        </Form.Item>
        <NavLink to="/forgot-qrcode">
          {t('Title.LOST_GOOGLE_AUTHENTICATOR_ACCOUNT')}
        </NavLink>
        <Form.Item>
          <Button
            loading={loading}
            type="primary"
            block
            style={{ marginTop: '1rem' }}
            htmlType="submit"
          >
            {t('Button.SUBMIT')}
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
}
