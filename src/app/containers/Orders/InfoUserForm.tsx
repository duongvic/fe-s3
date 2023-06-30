import { Button, Card, Col, Form, Row } from 'antd';
import UserFormBase from 'app/components/UserFormBase';
import { MODE_CREATE, MODE_UPDATE } from 'app/containers/Users/constants';
import { actions, reducer, sliceKey } from 'app/containers/Users/slice';
// import { translations } from 'locales/translations';
import moment from 'moment';
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { fillValuesToForm } from 'utils/common';
import { noticficationBase } from 'utils/constant';
import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';
import { usersSaga } from '../Users/saga';
import {
  selectError,
  selectLoading,
  selectMode,
  selectNotice,
  selectUser,
} from '../Users/selectors';
import { Effect } from './Effect';

const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
};
interface Props {
  enableBtnNext: (bol) => void;
}

export default function InfoUserForm({ enableBtnNext }: Props) {
  useInjectReducer({ key: sliceKey, reducer: reducer });
  useInjectSaga({ key: sliceKey, saga: usersSaga });

  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const { t } = useTranslation();

  const mode = useSelector(selectMode);
  const loadingCreate = useSelector(selectLoading).create;
  const loadingUpdate = useSelector(selectLoading).update;
  const loadingQuery = useSelector(selectLoading).query;
  const user = useSelector(selectUser);

  const error = useSelector(selectError);
  const notice = useSelector(selectNotice);

  const onFinish = values => {
    values.id_issue_date = values.id_issue_date?.format('YYYY-MM-DD');
    delete values.identification;
    if (mode === MODE_CREATE) {
      delete values.confirmPassword;
      dispatch(actions.setData(values));
      dispatch(actions.createUser());
    } else {
      // delete values.user_name;
      // delete values.email;
      dispatch(actions.setData({ data: values, userId: user?.id }));
      dispatch(actions.updateUser());
    }

    // delete values.user_name;
    // delete values.email;
    // dispatch(actions.setData({ data: values, userId: user?.id }));
    // dispatch(actions.setUser({ ...user, data: values, userId: user?.id }));
    // enableBtnNext(true);
    // dispatch(actions.updateUser());
  };

  const handleBlurUsername = e => {
    const searchTerm = e.target.value;
    if (searchTerm && searchTerm !== user?.user_name) {
      dispatch(actions.setQuery(e.target.value));
      dispatch(actions.queryUser());
    }
  };

  //Reset Form
  useEffect(() => {
    dispatch(actions.setError(null));
    dispatch(actions.setNotice(null));
  }, [dispatch]);

  //Enable BtnNext
  useEffect(() => {
    if (user) {
      enableBtnNext(true);
      dispatch(actions.setMode(MODE_UPDATE));
    } else if (!user) {
      enableBtnNext(false);
      dispatch(actions.setMode(MODE_CREATE));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, dispatch]);

  //Notification Create User
  useEffect(() => {
    if (notice) {
      if (notice === t('Message.CREATE_USER_SUCCESS')) {
        noticficationBase(
          'success',
          `Sign in to email: ${user.email} to verify your account.`,
        );
      } else {
        noticficationBase('success', notice);
      }
      dispatch(actions.setNotice(null));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, notice]);

  //Notification Error
  useEffect(() => {
    if (error) {
      noticficationBase('error', error);
      dispatch(actions.setError(null));
    }
  }, [error, dispatch]);

  //fill values to form
  useEffect(() => {
    if (mode === MODE_UPDATE && user) {
      const values = { ...user };
      const { id_issue_date } = values;

      if (id_issue_date) values.id_issue_date = moment(id_issue_date);

      fillValuesToForm(values, form);
    } else if (!user) {
      form.resetFields();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, user, dispatch]);

  return (
    <Effect>
      <Form
        form={form}
        name="infoUser"
        layout="horizontal"
        {...layout}
        labelAlign="left"
        onFinish={onFinish}
        scrollToFirstError
        // autoComplete="off"
      >
        <Row>
          <Col span={18} push={3}>
            <Card
              title={t('Title.CUSTOMER_INFO')}
              bordered={false}
              style={{ height: '100%' }}
            >
              <UserFormBase
                mode={mode}
                handleBlurUsername={handleBlurUsername}
                loading={loadingQuery}
                userType={user?.user_type}
              />
            </Card>
          </Col>
        </Row>
        <Row justify="center" style={{ marginTop: 8 }}>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={mode === MODE_UPDATE ? loadingUpdate : loadingCreate}
            >
              {mode === MODE_UPDATE ? t('Button.UPDATE') : t('Button.CREATE')}
            </Button>
          </Form.Item>
        </Row>
      </Form>
    </Effect>
  );
}
