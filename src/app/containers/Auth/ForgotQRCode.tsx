import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Form, Input } from 'antd';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';
import AuthBase from './AuthBase';
import { selectLoading } from './selectors';
import { actions } from './slice';

export default function ForgotQRCode() {
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const { t } = useTranslation(['translation', 'constant']);

  const loading = useSelector(selectLoading);

  const onFinish = value => {
    form.resetFields();
    dispatch(
      actions.setData({ username: value.username, password: value.password }),
    );
    dispatch(actions.forgotQRCode());
  };

  return (
    <AuthBase title={t('constant:Title.RESET_GOOGLE_AUTHENTICATOR')}>
      <Form form={form} name="normal_login" onFinish={onFinish}>
        <Form.Item
          name="username"
          rules={[
            {
              required: true,
              message: t('Field_Message.USERNAME_OR_EMAIL'),
            },
          ]}
        >
          <Input
            size="large"
            placeholder={t('Placeholder.USERNAME')}
            prefix={<UserOutlined className="site-form-item-icon" />}
          />
        </Form.Item>
        <Form.Item
          name="password"
          rules={[
            {
              required: true,
              message: t('Field_Message.PASSWORD'),
            },
          ]}
        >
          <Input.Password
            size="large"
            placeholder={t('Placeholder.PASSWORD')}
            prefix={<LockOutlined className="site-form-item-icon" />}
          />
        </Form.Item>
        <Form.Item>
          <Button
            size="large"
            type="primary"
            htmlType="submit"
            loading={loading}
            className="auth-form-button"
            block
          >
            {t('Button.SEND_EMAIL')}
          </Button>
          <NavLink to="/sign-in">{t('Link.BACK_TO_SIGN_IN')}</NavLink>
        </Form.Item>
      </Form>
    </AuthBase>
  );
}
