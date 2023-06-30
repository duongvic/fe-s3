import { Button, Card, Col, DatePicker, Form, Input, Row, Select } from 'antd';
import moment from 'moment';
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import { noticficationBase } from 'utils/constant';
import { selectAccount } from '../Auth/selectors';
import { Active, Gender, USER_EDIT } from '../Users/constants';
import {
  selectError,
  selectLoading,
  selectNotice,
  selectUser,
} from '../Users/selectors';
import { actions } from '../Users/slice';

export default function UserDetail() {
  const dispatch = useDispatch();
  const params: any = useParams();
  const history = useHistory();
  const { t } = useTranslation(['translation', 'constant']);

  const account = useSelector(selectAccount);
  const loading = useSelector(selectLoading);
  const error = useSelector(selectError);
  const user = useSelector(selectUser);
  const notice = useSelector(selectNotice);

  const [form]: any = Form.useForm();

  // const userId = params.userId ? params.userId : account.id;
  const userId = params.userId ? params.userId : account.id;

  const layout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 18 },
  };

  const onFinish = value => {
    const { date_of_birth } = value;

    if (date_of_birth)
      value.date_of_birth = moment(value.date_of_birth).format('YYYY-MM-DD');
    delete value.user_name;
    delete value.email;
    const data = { data: value, userId: user.id };
    dispatch(actions.setData(data));
    dispatch(actions.updateUser());
  };

  useEffect(() => {
    if (!user || (user && Number(userId) !== user.id)) {
      dispatch(actions.setQuery(userId));
      dispatch(actions.loadUser());
    }
  }, []);

  useEffect(() => {
    if (user)
      form.setFieldsValue({
        ...user,
        date_of_birth: user.date_of_birth
          ? moment(user.date_of_birth, 'YYYY-MM-DD')
          : null,
      });
  }, [user, form]);

  useEffect(() => {
    if (notice) {
      if (notice === t('Message.UPDATE_USER_SUCCESS')) {
        noticficationBase('success', notice);
        // dispatch(actions.setQuery(userId));
        // dispatch(actions.queryUser());
      } else {
        noticficationBase('success', notice);
      }
      dispatch(actions.setNotice(null));
    }
  }, [dispatch, notice]);

  useEffect(() => {
    if (error) {
      if (
        [
          t('constant:Message.ACTION_NOT_ALLOW'),
          t('constant:Message.USER_NOT_FOUND'),
        ].includes(error)
      ) {
        history.push('/dashboard/users');
      }
      noticficationBase('error', error);
      dispatch(actions.setError(null));
    }
  }, []);

  return user ? (
    <Form
      form={form}
      layout="horizontal"
      labelAlign="left"
      onFinish={onFinish}
      {...layout}
    >
      <Card
        title={t('Title.USER_INFO')}
        bordered={false}
        style={{ height: '100%', minHeight: '78vh' }}
      >
        {params.userId && (
          <Form.Item
            name="status"
            label={t('Label.STATUS')}
            wrapperCol={{ span: 4 }}
          >
            <Select>
              {Active.map((item, idx) => (
                <Select.Option value={item} key={idx}>
                  {item}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        )}
        <Form.Item
          name="full_name"
          label={t('Label.FULL_NAME')}
          rules={[
            {
              required: true,
              message: t('Field_Message.FULL_NAME'),
            },
          ]}
        >
          <Input placeholder={t('Placeholder.FULL_NAME')} />
        </Form.Item>

        <Form.Item name="username" label={t('Label.USERNAME')}>
          <Input placeholder={t('Placeholder.USERNAME')} disabled />
        </Form.Item>

        <Row>
          <Col span={16}>
            <Form.Item
              labelCol={{ span: 9 }}
              name="date_of_birth"
              label={t('Label.BIRTHDAY')}
              rules={[
                {
                  type: 'object',
                  required: true,
                  message: t('Field_Message.BIRTHDAY'),
                },
              ]}
            >
              <DatePicker
                // onChange={(value: any) => console.log(moment(value?._d))}
                format="YYYY-MM-DD"
              />
            </Form.Item>
          </Col>

          {/* <Col span={8}>
            <Form.Item
              name="gender"
              label={t('Label.GENDER')}
              labelCol={{ span: 8 }}
            >
              <Select>
                {Gender.map((item, idx) => (
                  <Select.Option value={item} key={idx}>
                    {item.toLowerCase()}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col> */}
        </Row>

        <Form.Item
          name="address"
          label={t('Label.ADDRESS')}
          rules={[
            {
              required: true,
              whitespace: true,
              message: t('Field_Message.ADDRESS'),
            },
          ]}
        >
          <Input placeholder={t('Placeholder.ADDRESS')} />
        </Form.Item>

        <Form.Item
          name="phone_number"
          label={t('Label.PHONE_NUMBER')}
          rules={[
            {
              required: true,
              whitespace: true,
              message: t('Field_Message.PHONE_NUMBER'),
            },
          ]}
        >
          <Input placeholder={t('Placeholder.PHONE_NUMBER')} />
        </Form.Item>

        <Form.Item
          name="email"
          label={t('constant:Label.EMAIL')}
          rules={[
            {
              type: 'email',
              message: t('Field_Message.EMAIL'),
            },
          ]}
        >
          <Input disabled />
        </Form.Item>

        <Form.Item
          name={`${user?.user_type === 'COMPANY' ? 'tax_number' : 'id_number'}`}
          label={
            user.user_type === 'COMPANY'
              ? t('Label.TAX_NO')
              : t('constant:Label.ID')
          }
          rules={[
            {
              required: true,
              whitespace: true,
              message: t('Field_Message.ID'),
            },
          ]}
        >
          <Input placeholder={t('Field_Message.FULL_NAME')} type="number" />
        </Form.Item>

        {user?.user_type === 'COMPANY' ? (
          <>
            <Form.Item
              name="rep_name"
              label={t('Label.REP_NAME')}
              rules={[
                {
                  required: true,
                  message: t('Field_Message.FULL_NAME'),
                  whitespace: true,
                },
              ]}
            >
              <Input placeholder={t('Placeholder.REP_NAME')} />
            </Form.Item>
            <Row>
              <Col span={6}></Col>
              <Col span={18}>
                <Form.Item
                  name="rep_phone"
                  label={t('Label.PHONE_NUMBER')}
                  rules={[
                    {
                      required: true,
                      message: t('Field_Message.PHONE_NUMBER'),
                    },
                  ]}
                >
                  <Input placeholder={t('Placeholder.PHONE_NUMBER')} />
                </Form.Item>
              </Col>
              <Col span={18} push={6}>
                <Form.Item
                  name="rep_email"
                  label={t('constant:Label.EMAIL')}
                  rules={[
                    {
                      required: true,
                      type: 'email',
                      message: t('Field_Message.EMAIL'),
                    },
                  ]}
                >
                  <Input placeholder={t('Placeholder.EMAIL')} />
                </Form.Item>
              </Col>
            </Row>
          </>
        ) : (
          <></>
        )}
        <Form.Item
          name="ref_name"
          label={t('Label.REF_NAME')}
          rules={[
            {
              required: true,
              message: t('Field_Message.FULL_NAME'),
              whitespace: true,
            },
          ]}
        >
          <Input placeholder={t('Placeholder.REF_NAME')} />
        </Form.Item>
        <Row>
          <Col span={6}></Col>
          <Col span={18}>
            <Form.Item
              name="ref_phone"
              label={t('Label.PHONE_NUMBER')}
              rules={[
                {
                  required: true,
                  message: t('Field_Message.PHONE_NUMBER'),
                },
              ]}
            >
              <Input placeholder={t('Placeholder.PHONE_NUMBER')} />
            </Form.Item>
          </Col>
          <Col span={18} push={6}>
            <Form.Item
              name="ref_email"
              label={t('constant:Label.EMAIL')}
              rules={[
                {
                  required: true,
                  type: 'email',
                  message: t('Field_Message.EMAIL'),
                },
              ]}
            >
              <Input placeholder={t('constant:Placeholder.EMAIL')} />
            </Form.Item>
          </Col>
        </Row>

        {account?.permission?.includes(USER_EDIT) && (
          <Row justify="center" style={{ marginTop: '1rem' }}>
            <Button type="primary" htmlType="submit" loading={loading}>
              {t('Button.SUBMIT')}
            </Button>
          </Row>
        )}
      </Card>
    </Form>
  ) : (
    <></>
  );
}
