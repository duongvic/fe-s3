import { Button, Form, InputNumber, Modal, Row, Tabs } from 'antd';
import Input from 'antd/es/input';
import { selectAccount } from 'app/containers/Auth/selectors';
import { selectVmCfg } from 'app/containers/Orders/selectors';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router';
import { selectCompute, selectLoading } from '../selector';
import { actions } from '../slice';

interface ModalEditInstanceProps {
  visible: boolean;
  onCancel: () => void;
}

interface paramsType {
  instanceId: string;
}

const { TabPane } = Tabs;

export const ModalEditInstance: React.FC<ModalEditInstanceProps> = ({
  visible,
  onCancel,
}) => {
  const [current, setCurrent] = useState('INSTANCE_INFO');

  const loading = useSelector(selectLoading);
  const instance = useSelector(selectCompute);
  const vmCfg: any = useSelector(selectVmCfg);
  const account = useSelector(selectAccount);

  const { t } = useTranslation(['translation', 'constant']);

  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const params = useParams<paramsType>();
  const { instanceId } = params;

  const onFinish = data => {
    if ('vcpu' in data) {
      data.ram *= 1024;
      const { backend_id, access_ipv4, ...raw_data } = data;
      dispatch(
        actions.setData({ backend_id, access_ipv4, raw_data, instanceId }),
      );
    } else {
      form.setFieldsValue({
        password: '',
        confirm: '',
      });
      delete data.confirm;
      dispatch(actions.setData({ ...data, instanceId }));
    }
    dispatch(actions.editCompute());
  };

  const changePasswordForm = () => {
    return (
      <>
        <Form.Item
          name="password"
          label={t('Label.PASSWORD')}
          rules={[
            {
              required: true,
              message: t('Field_Message.PASSWORD'),
            },
          ]}
          hasFeedback
        >
          <Input.Password />
        </Form.Item>
        <Form.Item
          name="confirm"
          label={t('Label.CONFIRM_PASSWORD')}
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
                return Promise.reject(
                  new Error(t('Field_Message.PASSWORD_NOT_MATCH')),
                );
              },
            }),
          ]}
        >
          <Input.Password />
        </Form.Item>
      </>
    );
  };

  const infrastructuresForm = () => {
    return (
      <>
        <Form.Item name="backend_id" label={t('constant:Label.BACKEND_ID')}>
          <Input></Input>
        </Form.Item>
        <Form.Item name="vcpu" label={t('constant:Title.CPU')}>
          <InputNumber></InputNumber>
        </Form.Item>
        <Form.Item name="ram" label={t('constant:Title.RAM')}>
          <InputNumber></InputNumber>
        </Form.Item>
        <Form.Item name="disk" label={t('constant:Title.DISK')}>
          <InputNumber></InputNumber>
        </Form.Item>
        <Form.Item name="ip" label={t('constant:Label.IP')}>
          <InputNumber></InputNumber>
        </Form.Item>
        <Form.Item name="net" label={t('constant:Label.NET')}>
          <InputNumber></InputNumber>
        </Form.Item>
        <Form.Item name="snapshot" label={t('constant:Title.SNAPSHOT')}>
          <InputNumber></InputNumber>
        </Form.Item>
        <Form.Item name="backup" label={t('constant:Title.BACKUP')}>
          <InputNumber></InputNumber>
        </Form.Item>
        <Form.Item name="image" label={t('constant:Label.IMAGE')}>
          <Input></Input>
        </Form.Item>
        <Form.Item name="access_ipv4" label={t('constant:Label.IP')}>
          <Input></Input>
        </Form.Item>
        {/* <Form.Item
          name="availability_zone"
          label={t('constant:Label.AVAILABILITY_ZONE')}
        >
          <Input></Input>
        </Form.Item> */}
      </>
    );
  };

  const instanceInfoForm = () => {
    return (
      <>
        <Form.Item
          name="name"
          label={t('constant:Label.NAME')}
          rules={[
            {
              required: true,
              message: t('Field_Message.INSTANCE_NAME'),
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item name="description" label={t('constant:Label.DESCRIPTION')}>
          <Input />
        </Form.Item>
      </>
    );
  };

  const onOk = () => {
    form.resetFields();
    onCancel();
  };

  const onTabClick = key => {
    setCurrent(key);
  };

  const renderContent = () => {
    switch (current) {
      case 'INFRASTRUCTURES': {
        return infrastructuresForm();
      }
      case 'CHANGE_PASSWORD': {
        return changePasswordForm();
      }
      case 'INSTANCE_INFO':
      default: {
        return instanceInfoForm();
      }
    }
  };

  useEffect(() => {
    if (instance && vmCfg) {
      form.setFieldsValue({
        ...instance.vm_cfg,
        name: instance.name,
        backend_id: instance.backend_id,
        description: instance.description,
        access_ipv4: instance.access_ipv4,
        ip: vmCfg[3].quantity,
        net: vmCfg[4].quantity,
        image: vmCfg[7].data.backend_name,
      });
    }
  }, [instance, vmCfg]);

  return (
    <Modal
      title={t('constant:Title.EDIT_INSTANCE')}
      visible={visible}
      onOk={onOk}
      onCancel={onCancel}
      footer={<></>}
    >
      <Form
        labelCol={{ xs: { span: 24 }, sm: { span: 8 } }}
        className="edit-instance-form"
        form={form}
        onFinish={onFinish}
      >
        <Tabs onTabClick={onTabClick}>
          <TabPane
            tab={t('constant:Title.INSTANCE_INFO')}
            key="INSTANCE_INFO"
          ></TabPane>
          {['IT_ADMIN', 'ADMIN', 'SALE_ADMIN'].includes(account?.role?.toUpperCase()) && (
            <TabPane
              tab={t('constant:Title.INFRASTRUCTURES')}
              key="INFRASTRUCTURES"
            ></TabPane>
          )}
          <TabPane
            tab={t('constant:Title.CHANGE_PASSWORD')}
            key="CHANGE_PASSWORD"
          ></TabPane>
        </Tabs>
        {renderContent()}
        <Row justify="center">
          <Form.Item>
            <Button htmlType="submit" type="primary" loading={loading}>
              {t('Button.SUBMIT')}
            </Button>
          </Form.Item>
        </Row>
      </Form>
    </Modal>
  );
};
