import { Button, Card, Col, Form, Input, Modal, Row } from 'antd';
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { selectBackup, selectLoading } from '../selector';
import { actions } from '../slice';

const { TextArea } = Input;

interface props {
  visible: boolean;
  hideModal: () => void;
  instanceId?: string;
}

const tailLayout = {
  wrapperCol: { offset: 8, span: 16 },
};

export default function BackupForm({ visible, hideModal, instanceId }: props) {
  const dispatch = useDispatch();
  const { t } = useTranslation(['translation', 'constant']);

  const loading = useSelector(selectLoading)?.backup;
  const backup = useSelector(selectBackup);
  const onFinish = values => {
    dispatch(actions.setData({ instanceId, data: values }));
    dispatch(actions.createBackup());
  };

  const onFinishFailed = errorInfo => {
    console.log('Failed:', errorInfo);
  };

  return (
    <>
      <Modal
        width={600}
        visible={visible}
        title={t('constant:Title.CREATE_BACKUP')}
        onCancel={hideModal}
        footer={[
          <Button key="back" onClick={hideModal}>
            Cancel
          </Button>,
        ]}
      >
        <Row>
          <Col span={14}>
            <Form
              layout="vertical"
              name="createBackup"
              onFinish={onFinish}
              onFinishFailed={onFinishFailed}
            >
              <Form.Item
                label={t('constant:Label.BACKUP_NAME')}
                name="name"
                rules={[
                  {
                    required: true,
                    message: t('Field_Message.REQUIRED_FIELD'),
                  },
                ]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                label={t('constant:Label.DESCRIPTION')}
                name="description"
                rules={[
                  {
                    required: true,
                    message: t('Field_Message.REQUIRED_FIELD'),
                  },
                ]}
              >
                <TextArea />
              </Form.Item>

              <Form.Item {...tailLayout}>
                <Button type="primary" loading={loading} htmlType="submit">
                  Create
                </Button>
              </Form.Item>
            </Form>
          </Col>
          <Col span={10}>
            <Card
              title={t('constant:Title.DESCRIPTION')}
              bordered={false}
              headStyle={{ border: 'none' }}
            >
              {t('constant:Title.BACKUP_DESCRIPTION')}
            </Card>
          </Col>
        </Row>
      </Modal>
    </>
  );
}
