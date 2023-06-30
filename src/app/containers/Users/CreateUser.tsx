import { Button, Card, Col, Form, Input, Row, Select } from 'antd';
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { noticficationBase } from 'utils/constant';
import { Pattern } from '../Auth/constants';
import { selectError, selectLoading, selectNotice } from '../Auth/selectors';
import { actions } from '../Auth/slice';
import { Roles } from './constants';

export default function CreateUser() {
  const dispatch = useDispatch();
  const history = useHistory();
  const { t } = useTranslation(['translation', 'constant']);
  const loading = useSelector(selectLoading);
  const error = useSelector(selectError);
  const notice = useSelector(selectNotice);

  const [form]: any = Form.useForm();

  const layout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 18 },
  };

  const onFinish = value => {
    delete value.confirm_password;
    dispatch(actions.setData({ ...value, status: 'DEACTIVATED' }));
    dispatch(actions.loadSignup());
  };

  useEffect(() => {
    if (notice) {
      noticficationBase('success', notice);
      dispatch(actions.setNotice(null));
      setTimeout(() => history.push('/dashboard/users'), 1000);
    }
  }, [notice, dispatch, history]);

  useEffect(() => {
    if (error) {
      noticficationBase('error', error);
      dispatch(actions.setError(null));
    }
  }, [error, dispatch]);

  return (
    <Row className="steps-content">
      <Col span={18} push={3}>
        <Form
          form={form}
          layout="horizontal"
          labelAlign="left"
          onFinish={onFinish}
          {...layout}
          scrollToFirstError={true}
        >
          <Card
            title={t('Title.CREATE_ACCOUNT')}
            bordered={false}
            style={{ height: '100%', minHeight: '78vh' }}
          >
            <Form.Item
              name="user_role"
              label={t('Label.ROLE')}
              wrapperCol={{ span: 6 }}
              initialValue="SALE"
            >
              <Select>
                {Roles.map((item, idx) => (
                  <Select.Option value={item} key={idx}>
                    {item}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item
              name="full_name"
              label={t('Label.FULL_NAME')}
              rules={[
                { required: true, message: t('Field_Message.FULL_NAME') },
                {
                  pattern: Pattern.FULL_NAME,
                  message: t('Invalid_Pattern.FULL_NAME'),
                },
              ]}
            >
              <Input placeholder={t('Placeholder.FULL_NAME')} />
            </Form.Item>
            <Form.Item
              name="user_name"
              label={t('Label.USERNAME')}
              rules={[
                {
                  required: true,
                  message: t('Field_Message.USERNAME'),
                },
              ]}
            >
              <Input placeholder={t('Placeholder.USERNAME')} />
            </Form.Item>
            <Form.Item
              name="password"
              label={t('Label.PASSWORD')}
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
                autoComplete="new-password"
                placeholder={t('Placeholder.PASSWORD')}
              />
            </Form.Item>
            <Form.Item
              name="confirm_password"
              dependencies={['password']}
              label={t('Label.CONFIRM_PASSWORD')}
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
                    return Promise.reject(
                      t('Field_Message.PASSWORD_NOT_MATCH'),
                    );
                  },
                }),
              ]}
            >
              <Input.Password placeholder={t('Placeholder.CONFIRM_PASSWORD')} />
            </Form.Item>
            <Form.Item
              name="phone_num"
              label={t('Label.PHONE_NUMBER')}
              rules={[
                { required: true, message: t('Field_Message.PHONE_NUMBER') },
                {
                  pattern: Pattern.PHONE_NUM,
                  message: t('Invalid_Pattern.PHONE_NUM'),
                },
              ]}
            >
              <Input
                placeholder={t('Placeholder.PHONE_NUMBER')}
                type="number"
              />
            </Form.Item>
            <Form.Item
              name="email"
              label={t('constant:Label.EMAIL')}
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
              />
            </Form.Item>
            <Row justify="center" style={{ marginTop: '1rem' }}>
              <Button type="primary" htmlType="submit" loading={loading}>
                Submit
              </Button>
            </Row>
          </Card>
        </Form>
      </Col>
    </Row>
  );
}
