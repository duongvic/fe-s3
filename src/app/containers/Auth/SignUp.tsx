import {
  IdcardOutlined,
  LockOutlined,
  MailOutlined,
  PhoneOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Button, Checkbox, Form, Input, Row, Typography } from 'antd';
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink, useHistory } from 'react-router-dom';
import AuthBase from './AuthBase';
import { Pattern } from './constants';
import { selectError, selectLoading, selectSignup } from './selectors';
import { actions } from './slice';

const { Text } = Typography;

export default function SignUp() {
  const { t } = useTranslation(['translation', 'constant']);
  const dispatch = useDispatch();
  const history = useHistory();

  const loading = useSelector(selectLoading);
  const signup = useSelector(selectSignup);
  const error = useSelector(selectError);

  const [form] = Form.useForm();

  const onFinish = values => {
    const { user_name, full_name, email, password, phone_num } = values;
    const data = { user_name, full_name, email, password, phone_num };
    dispatch(actions.setData(data));
    dispatch(actions.loadSignup());
  };

  //Reset
  useEffect(() => {
    dispatch(actions.setError(null));
    dispatch(actions.setSignup(null));
  }, [dispatch]);

  useEffect(() => {
    if (signup) {
      setTimeout(() => {
        history.push('/sign-in');
      }, 1000);
      dispatch(actions.setSignup(null));
    }
  }, [signup, dispatch, history]);

  return (
    <AuthBase title={t('Title.SIGN_UP')}>
      <Form
        form={form}
        name="register"
        onFinish={onFinish}
        scrollToFirstError
        initialValues={{
          prefix: '86',
        }}
      >
        <Form.Item
          name="user_name"
          rules={[
            { required: true, message: t('Field_Message.USERNAME') },
            {
              pattern: Pattern.USERNAME,
              message: t('Invalid_Pattern.USERNAME'),
            },
          ]}
        >
          <Input
            prefix={<UserOutlined className="site-form-item-icon" />}
            placeholder={t('Placeholder.USERNAME')}
            size="large"
            autoFocus
          />
        </Form.Item>
        <Form.Item
          name="full_name"
          rules={[
            { required: true, message: t('Field_Message.FULL_NAME') },
            {
              pattern: Pattern.FULL_NAME,
              message: t('Invalid_Pattern.FULL_NAME'),
            },
          ]}
        >
          <Input
            prefix={<IdcardOutlined className="site-form-item-icon" />}
            placeholder={t('Placeholder.FULL_NAME')}
            size="large"
          />
        </Form.Item>
        <Form.Item
          name="email"
          rules={[
            {
              type: 'email',
              message: t('Invalid_Pattern.EMAIL'),
            },
            {
              required: true,
              message: t('Field_Message.EMAIL'),
            },
          ]}
        >
          <Input
            size="large"
            placeholder={t('constant:Placeholder.EMAIL')}
            prefix={<MailOutlined className="site-form-item-icon" />}
          />
        </Form.Item>

        <Form.Item
          name="phone_num"
          rules={[
            { required: true, message: t('Field_Message.PHONE_NUMBER') },
            {
              pattern: Pattern.PHONE_NUM,
              message: t('Invalid_Pattern.PHONE_NUM'),
            },
          ]}
        >
          <Input
            type="number"
            size="large"
            placeholder={t('Placeholder.PHONE_NUMBER')}
            prefix={<PhoneOutlined className="site-form-item-icon" />}
          />
        </Form.Item>
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
            size="large"
            autoComplete="new-password"
            placeholder={t('Placeholder.PASSWORD')}
            prefix={<LockOutlined className="site-form-item-icon" />}
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
              validator(rule, value) {
                if (!value || getFieldValue('password') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(t('Field_Message.PASSWORD_NOT_MATCH'));
              },
            }),
          ]}
        >
          <Input.Password
            size="large"
            placeholder={t('Placeholder.CONFIRM_PASSWORD')}
            prefix={<LockOutlined className="site-form-item-icon" />}
          />
        </Form.Item>

        <Form.Item
          name="agreement"
          valuePropName="checked"
          rules={[
            {
              validator: (_, value) =>
                value
                  ? Promise.resolve()
                  : Promise.reject(t('Field_Message.ARGREEMENT')),
            },
          ]}
        >
          <Checkbox>
            {t('Link.I_HAVE_READ')}
            <NavLink to="/">{t('Link.POLICY')}</NavLink>
          </Checkbox>
        </Form.Item>
        {error && (
          <Row style={{ marginBottom: 4 }}>
            <Text type="danger">{`Error: ${error}`}</Text>
          </Row>
        )}
        <Form.Item>
          <Button
            size="large"
            type="primary"
            htmlType="submit"
            loading={loading}
            className="auth-form-button"
            block
          >
            {t('Button.SIGN_UP')}
          </Button>
          <NavLink to="/sign-in">{t('Link.BACK_TO_SIGN_IN')}</NavLink>
        </Form.Item>
      </Form>
    </AuthBase>
  );
}
