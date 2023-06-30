import { MailOutlined } from '@ant-design/icons';
import { Button, Form, Input, Row, Statistic, Typography } from 'antd';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';
import AuthBase from './AuthBase';
import { selectCountdown, selectLoading } from './selectors';
import { actions } from './slice';

export default function ForgotPassword(props) {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const loading = useSelector(selectLoading);
  const countdown = useSelector(selectCountdown);

  const onFinish = values => {
    dispatch(actions.setData({ user_name: values.user_name }));
    dispatch(actions.forgotPassword());
  };

  return (
    <AuthBase title={t('Title.FORGOT_PASSWORD')}>
      <Form name="normal_login" onFinish={onFinish}>
        <Form.Item
          name="user_name"
          rules={[
            {
              required: true,
              message: t('Field_Message.USERNAME_OR_EMAIL'),
            },
          ]}
        >
          <Input
            size="large"
            placeholder={t('Placeholder.USERNAME_OR_EMAIL')}
            prefix={<MailOutlined className="site-form-item-icon" />}
          />
        </Form.Item>
        <Form.Item>
          <Button
            size="large"
            type="primary"
            htmlType="submit"
            loading={loading}
            block
            disabled={countdown > 0}
          >
            {t('Button.SEND_EMAIL')}
          </Button>
          <Row justify="space-between">
            <Typography.Text>
              <NavLink to="/sign-in">{t('Link.BACK_TO_SIGN_IN')}</NavLink>
            </Typography.Text>
            {countdown > 0 && (
              <Row>
                <Typography.Text style={{ color: '#8c8c8c' }}>
                  {t('Typography.SEND_AGAIN_IN')}
                </Typography.Text>
                &nbsp;
                <Statistic.Countdown
                  value={countdown}
                  onFinish={() => dispatch(actions.setCountdown(0))}
                  format="mm:ss"
                  className="count-down"
                />
              </Row>
            )}
          </Row>
        </Form.Item>
      </Form>
    </AuthBase>
  );
}
