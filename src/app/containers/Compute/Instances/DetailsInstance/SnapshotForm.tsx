import { Button, Card, Col, Form, Input, Modal, Row } from 'antd';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectLoading, selectNotice, selectSnapshot } from '../selector';
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

export default function SnapshotForm({
  visible,
  hideModal,
  instanceId,
}: props) {
  const dispatch = useDispatch();

  const loading = useSelector(selectLoading)?.snapshot;
  const notice = useSelector(selectNotice);

  const onFinish = values => {
    dispatch(actions.setData({ instanceId, data: values }));
    dispatch(actions.createSnapshot());
  };

  const onFinishFailed = errorInfo => {
    console.log('Failed:', errorInfo);
  };

  return (
    <>
      <Modal
        width={600}
        visible={visible}
        title="Create Snapshot"
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
              name="createSnapshot"
              onFinish={onFinish}
              onFinishFailed={onFinishFailed}
            >
              <Form.Item
                label="Snapshot name"
                name="name"
                rules={[
                  {
                    required: true,
                    message: 'Please input a value!',
                  },
                ]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                label="Description"
                name="description"
                rules={[
                  {
                    required: true,
                    message: 'Please input a value!',
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
              title="Description: "
              bordered={false}
              headStyle={{ border: 'none' }}
            >
              A snapshot is an image which preserves the disk state of a running
              instance.
            </Card>
          </Col>
        </Row>
      </Modal>
    </>
  );
}
