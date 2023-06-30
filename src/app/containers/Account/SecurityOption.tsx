import {
  Button,
  Card,
  Col,
  Form,
  Input,
  Popconfirm,
  Row,
  Space,
  Switch,
  Tooltip,
  Typography,
} from 'antd';
import {
  selectAccount,
  selectAccountInfo,
  selectError,
  selectLoading,
  selectNotice,
  selectQRCode,
} from 'app/containers/Auth/selectors';
import { actions } from 'app/containers/Auth/slice';
import QRCode from 'qrcode.react';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { Link, NavLink } from 'react-router-dom';
import { noticficationBase } from 'utils/constant';

let setting: any = localStorage.getItem('setting');

export default function SecurityOption() {
  const [isCheck, setIsCheck] = useState(false);

  const qrCode = useSelector(selectQRCode);
  const error = useSelector(selectError);
  const notice = useSelector(selectNotice);
  const loading = useSelector(selectLoading);
  const account = useSelector(selectAccount);
  const accountInfo = useSelector(selectAccountInfo);

  const { t } = useTranslation(['translation', 'constant']);
  const dispatch = useDispatch();

  const onChange = () => {
    dispatch(actions.getQRCode());
  };

  const onFinish = value => {
    dispatch(actions.setData({ otp_token: value?.otp_token }));
    dispatch(actions.disableTwoFactor());
    dispatch(actions.setQRCode(null));
  };

  useEffect(() => {
    setIsCheck(
      accountInfo?.enable_two_factors
        ? accountInfo?.enable_two_factors
        : Boolean(JSON.parse(setting)?.qrCode),
    );
  }, [accountInfo]);

  useEffect(() => {
    if (notice) {
      noticficationBase('success', notice);
      switch (notice) {
        case t('Message.DISABLE_TWO_FACTOR_SUCCESS'): {
          setting = JSON.parse(setting);
          delete setting.qrCode;
          setting = JSON.stringify(setting);
          localStorage.setItem('setting', setting);
          setIsCheck(false);
          dispatch(actions.setData({ user_name: account?.user_name }));
          dispatch(actions.queryAccount());
          break;
        }
        case t('Message.CREATE_TWO_FACTORS_SUCCESS'): {
          setIsCheck(true);
          dispatch(actions.setData({ user_name: account?.user_name }));
          dispatch(actions.queryAccount());
          break;
        }
        default:
          break;
      }
      dispatch(actions.setNotice(null));
    }
  }, [notice, dispatch, account.user_name, t]);

  useEffect(() => {
    if (error) {
      noticficationBase('error', error);
      dispatch(actions.setError(null));
    }
  }, [error, dispatch]);
  return (
    <Card
      className="security-option"
      title={t('Title.SECURITY_OPTION')}
      bordered={false}
      style={{ height: '100%', minHeight: '78vh' }}
    >
      <Row>
        <Col xs={24} md={12}>
          <Space direction="vertical" size={16}>
            <Typography.Title level={3}>
              {t('Title.TWO_FACTOR')}
            </Typography.Title>
            <Typography>
              {t('Typography.TWO_FACTOR_CONTENT_1')}
              <br />
              <br />
              {t('Typography.TWO_FACTOR_CONTENT_2')}
            </Typography>
            <Link to="/docs#2.5">{t('Link.FOR_IOS_USERS')}</Link>
            <Link to="/docs#2.4">{t('Link.FOR_ANDROID_USERS')}</Link>
            <NavLink to="forgot-qrcode">{t('Title.RECOVERY_QR_CODE')}</NavLink>
          </Space>
        </Col>
        <Col xs={24} md={12}>
          <Row justify="center">
            <Typography>
              {t('Title.TWO_FACTOR')}: &nbsp;
              {isCheck ? (
                <Tooltip
                  trigger="click"
                  placement="bottom"
                  overlayInnerStyle={{ padding: 22, width: 'fit-content' }}
                  color="white"
                  title={
                    <Form
                      layout="vertical"
                      onFinish={onFinish}
                      style={{ width: '15rem' }}
                    >
                      <Typography.Text>
                        {t('Typography.ARE_YOU_SURE_TO_TURN_OFF_2_FACTOR')}
                      </Typography.Text>
                      <Form.Item
                        label={t('Label.OTP_CODE')}
                        name="otp_token"
                        rules={[
                          {
                            required: true,
                            message: t('Field_Message.OTP'),
                          },
                        ]}
                      >
                        <Input placeholder={t('Placeholder.OTP')}></Input>
                      </Form.Item>
                      <Form.Item>
                        <Button
                          htmlType="submit"
                          type="primary"
                          loading={loading}
                        >
                          {t('Button.SUBMIT')}
                        </Button>
                      </Form.Item>
                    </Form>
                  }
                >
                  <Switch checked={true}></Switch>
                </Tooltip>
              ) : (
                <Popconfirm
                  placement="bottom"
                  title={t('Typography.ARE_YOU_SURE_TO_TURN_ON_2_FACTOR')}
                  onConfirm={onChange}
                  okText={t('constant:Button.OK')}
                  cancelText={t('constant:Button.CANCEL')}
                >
                  <Switch checked={false}></Switch>
                </Popconfirm>
              )}
            </Typography>
          </Row>
          <Row justify="center">
            {qrCode || JSON.parse(setting)?.qrCode ? (
              <QRCode
                value={qrCode || JSON.parse(setting)?.qrCode}
                size={290}
                level={'H'}
                includeMargin={true}
              />
            ) : (
              <></>
            )}
          </Row>
        </Col>
      </Row>
    </Card>
  );
}
