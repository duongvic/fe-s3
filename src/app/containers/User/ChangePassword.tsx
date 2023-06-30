import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import { Button, Card, Form, Input, Row } from 'antd';
import { selectLoading, selectUser } from 'app/containers/Users/selectors';
import { actions } from 'app/containers/Users/slice';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { Pattern } from '../Auth/constants';
import { selectAccount } from '../Auth/selectors';

export default function ChangePassword() {
  const loading = useSelector(selectLoading);
  const user = useSelector(selectUser);
  const account = useSelector(selectAccount);

  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const layout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 18 },
  };

  const onFinish = value => {
    delete value.confirmPassword;
    delete value.user_name;
    const data = { data: value, userId: user.id };
    dispatch(actions.setData(data));
    dispatch(actions.updateUser());
    form.resetFields();
  };

  const renderField = input => {
    const target: any = input.target
      ? ({ getFieldValue }) => ({
          validator(rule, value) {
            if (!value || getFieldValue('password') === value) {
              return Promise.resolve();
            }
            return Promise.reject(t('Field_Message.PASSWORD_NOT_MATCH'));
          },
        })
      : '';
    return (
      <Form.Item
        name={input.name}
        label={input.label}
        rules={[
          {
            required: true,
            message: t('Field_Message.REQUIRED_FIELD'),
            whitespace: true,
          },
          target,
          {
            pattern: Pattern.PASSWORD,
            message: t('Invalid_Pattern.PASSWORD'),
          },
        ]}
      >
        <Input.Password
          placeholder="Password"
          iconRender={visible =>
            visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
          }
        />
      </Form.Item>
    );
  };

  return (
    <Form
      name="infoUser"
      layout="horizontal"
      {...layout}
      form={form}
      labelAlign="left"
      onFinish={onFinish}
    >
      <Card
        title={t('Title.CHANGE_PASSWORD')}
        bordered={false}
        style={{ height: '100%', minHeight: '78vh' }}
      >
        <Form.Item name="user_name" label={t('Label.ACCOUNT')}>
          <Input disabled placeholder={user?.user_name}></Input>
        </Form.Item>
        {!['IT_ADMIN', 'SALE_ADMIN', 'ADMIN'].includes(account?.role?.toUpperCase()) &&
          renderField({ name: 'old_password', label: t('Label.OLD_PASSWORD') })}
        {renderField({ name: 'password', label: t('Label.NEW_PASSWORD') })}
        {renderField({
          name: 'confirmPassword',
          label: t('Label.CONFIRM_PASSWORD'),
          target: 'password',
        })}
        <Row justify="center" style={{ marginTop: '1rem' }}>
          <Button type="primary" htmlType="submit" loading={loading}>
            {t('Button.SUBMIT')}
          </Button>
        </Row>
      </Card>
    </Form>
  );
}
