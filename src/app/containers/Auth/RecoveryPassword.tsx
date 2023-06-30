import { LockOutlined } from '@ant-design/icons';
import { Button, Form, Input } from 'antd';
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink, useHistory, useParams } from 'react-router-dom';
import AuthBase from './AuthBase';
import { Pattern } from './constants';
import { selectLoading, selectNotice } from './selectors';
import { actions } from './slice';

export default function ResetPassword(props) {
  const dispatch = useDispatch();
  const params: any = useParams();
  const [form] = Form.useForm();
  const history = useHistory();
  const { t } = useTranslation(['translation', 'constant']);
  const loading = useSelector(selectLoading);
  const notice = useSelector(selectNotice);

  const onFinish = values => {
    form.resetFields();
    dispatch(
      actions.setData({ password: values.password, token: params?.token }),
    );
    dispatch(actions.resetPassword());
  };

  useEffect(() => {
    if (notice === t('Message.RESET_PASSWORD_SUCCESS'))
      history.push('/sign-in');
  }, [notice, history]);

  return (
    <AuthBase title={t('Title.RECOVERY_PASSWORD')}>
      <Form form={form} name="normal_login" onFinish={onFinish}>
        <Form.Item
          name="password"
          rules={[
            {
              required: true,
              message: t('Field_Message.PASSWORD'),
            },
            {
              pattern: Pattern.PASSWORD,
              message: t('Invalid_Pattern.PASSWORD'),
            },
          ]}
          hasFeedback
        >
          <Input.Password
            prefix={<LockOutlined className="site-form-item-icon" />}
            placeholder={t('Placeholder.NEW_PASSWORD')}
          />
        </Form.Item>
        <Form.Item
          name="confirm"
          dependencies={['password']}
          hasFeedback
          rules={[
            {
              required: true,
              message: t('Field_Message.CONFIRM_PASSWORD'),
            },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('password') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(t('Field_Message.PASSWORD_NOT_MATCH'));
              },
            }),
          ]}
        >
          <Input.Password
            prefix={<LockOutlined className="site-form-item-icon" />}
            placeholder={t('Placeholder.CONFIRM_PASSWORD')}
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
            {t('constant:Button.UPDATE')}
          </Button>
          <NavLink to="/sign-in">{t('Link.BACK_TO_SIGN_IN')}</NavLink>
        </Form.Item>
      </Form>
    </AuthBase>
  );
}
