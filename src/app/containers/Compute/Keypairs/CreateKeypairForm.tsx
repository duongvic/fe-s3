import { Button, Card, Col, Form, Input, Modal, Row, Select } from 'antd';
import React, { useState } from 'react';

const { Option } = Select;

interface props {
  visible: boolean;
  hideModal: () => void;
}

const tailLayout = {
  wrapperCol: { offset: 8, span: 16 },
};

export default function CreateKeypairForm({ visible, hideModal }: props) {
  const [loading, setLoading] = useState(false);

  const onFinish = values => {
    console.log('Success:', values);
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      hideModal();
    }, 3000);
  };

  const onFinishFailed = errorInfo => {
    console.log('Failed:', errorInfo);
  };

  return (
    <>
      <Modal
        width={600}
        visible={visible}
        title="Create Keypair"
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
              name="createKeypair"
              onFinish={onFinish}
              onFinishFailed={onFinishFailed}
            >
              <Form.Item
                label="Keypair name"
                name="name"
                rules={[
                  {
                    required: true,
                    message: 'Please input your Keypair name!',
                  },
                ]}
              >
                <Input />
              </Form.Item>
              <Form.Item label="Keypair type" name="type" initialValue="ssh">
                <Select>
                  <Option value="ssh">SSH key</Option>
                  <Option value="x509">X509 Certificate</Option>
                </Select>
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
              Key Pairs are how you login to your instance after it is launched.
              Choose a key pair name you will recognize. Names may only include
              alphanumeric characters, spaces, dashes and underscores.
            </Card>
          </Col>
        </Row>
      </Modal>
    </>
  );
}
