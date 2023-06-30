import { Button, Card, Col, Form, Input, Modal, Row, Select } from 'antd';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import {
  selectLoading,
  selectNotice,
  selectSecurityRule,
} from '../../Security/selector';
import { actions } from '../../Security/slice';
import { Pattern } from '../constants';

const { Option } = Select;

interface props {
  visible: boolean;
  hideModal: () => void;
}

const tailLayout = {
  wrapperCol: { offset: 8, span: 16 },
};

export default function SecurityRuleForm({ visible, hideModal }: props) {
  const [min, setMin]: any = useState(0);
  const [max, setMax]: any = useState(0);
  const [protocol, setProtocol] = useState('tcp');

  const dispatch = useDispatch();
  const { instanceId }: any = useParams();
  const [form] = Form.useForm();
  const { t } = useTranslation(['translation', 'constant']);

  const loading = useSelector(selectLoading);
  const notice = useSelector(selectNotice);

  const onFinish = values => {
    dispatch(
      actions.setData({
        data: values,
        computeId: instanceId,
      }),
    );
    dispatch(actions.createSecurityGroupRule());
  };

  useEffect(() => {
    if (notice === t('Message.CREATE_SECURITY_RULE_SUCCESS')) {
      hideModal();
    }
  }, [notice]);

  const setPortRange = e => {
    if (e.target.name === 'min') {
      setMin(e.target.value);
      form.setFieldsValue({ port_range: e.target.value + ':' + max });
    } else if (e.target.name === 'max') {
      setMax(e.target.value);
      form.setFieldsValue({ port_range: min + ':' + e.target.value });
    }
  };

  const renderPortRange = protocol => {
    switch (protocol) {
      case 'icmp':
      case 'all':
        return <></>;
      default:
        return (
          <Form.Item
            label={t('constant:Label.PORT_RANGE')}
            name="port_range"
            style={{ margin: 0 }}
            rules={[
              {
                required: true,
                message: t('Field_Message.REQUIRED_FIELD'),
              },
            ]}
          >
            <Input.Group compact>
              <Input
                required
                name="min"
                type="number"
                onChange={e => setPortRange(e)}
                min={0}
                style={{ width: '40%', textAlign: 'center' }}
                placeholder="Minimum"
              />
              <Input
                className="site-input-split"
                style={{
                  width: '20%',
                  borderLeft: 0,
                  textAlign: 'center',
                  pointerEvents: 'none',
                }}
                placeholder="~"
                disabled
              />
              <Input
                required
                name="max"
                type="number"
                onChange={e => setPortRange(e)}
                min={parseInt(min)}
                className="site-input-right"
                style={{
                  width: '40%',
                  textAlign: 'center',
                  borderLeft: 0,
                }}
                placeholder="Maximum"
              />
            </Input.Group>
          </Form.Item>
        );
    }
  };

  return (
    <>
      <Modal
        width={900}
        visible={visible}
        title={t('constant:Title.SECURITY_RULE')}
        onCancel={hideModal}
        footer={[
          <Button key="back" onClick={hideModal}>
            {t('constant:Button.CANCEL')}
          </Button>,
        ]}
      >
        <Row>
          <Col span={14}>
            <Form
              form={form}
              initialValues={{
                protocol: 'tcp',
                direction: 'ingress',
                ether_type: 'IPv4',
              }}
              layout="vertical"
              name="securityRule"
              onFinish={onFinish}
            >
              <Form.Item label="Protocol" name="protocol">
                <Select
                  defaultValue="tcp"
                  style={{ width: '100%' }}
                  onChange={value => setProtocol(value)}
                >
                  <Option value="tcp">TCP Rule</Option>
                  <Option value="udp">UDP Rule</Option>
                  <Option value="icmp">ICMP Rule</Option>
                  <Option value="other">Other Protocol</Option>
                  <Option value="all">All ICMP</Option>
                </Select>
              </Form.Item>
              <Form.Item label="Direction" name="direction">
                <Select defaultValue="ingress" style={{ width: '100%' }}>
                  <Option value="ingress">Ingress</Option>
                  <Option value="egress">Egress</Option>
                </Select>
              </Form.Item>
              {renderPortRange(protocol)}
              <Form.Item label="Ether Type" name="ether_type">
                <Select defaultValue="IPv4" style={{ width: '100%' }}>
                  <Option value="IPv4">IPv4</Option>
                  <Option value="IPv6">IPv6</Option>
                </Select>
              </Form.Item>
              <Form.Item
                label="Source Ip"
                name="source_ip"
                rules={[
                  {
                    pattern: Pattern.IP,
                    required: true,
                    message: t('Field_Message.SOURCE_IP'),
                  },
                ]}
              >
                <Input placeholder={t('constant:Placeholder.SOURCE_IP')} />
              </Form.Item>
              <Form.Item {...tailLayout}>
                <Button
                  type="primary"
                  loading={loading.create}
                  htmlType="submit"
                >
                  {t('constant:Button.CREATE')}
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
              Rules define which traffic is allowed to instances assigned to the
              security group. A security group rule consists of three main
              parts:
              <p>
                <b>Rule: </b>You can specify the desired rule template or use
                custom rules, the options are Custom TCP Rule, Custom UDP Rule,
                or Custom ICMP Rule.
              </p>
              <p>
                <b>Open Port/Port Range: </b>For TCP and UDP rules you may
                choose to open either a single port or a range of ports.
                Selecting the "Port Range" option will provide you with space to
                provide both the starting and ending ports for the range. For
                ICMP rules you instead specify an ICMP type and code in the
                spaces provided.
              </p>
              <p>
                <b>Open Port/Port Range: </b>For TCP and UDP rules you may
                choose to open either a single port or a range of ports.
                Selecting the "Port Range" option will provide you with space to
                provide both the starting and ending ports for the range. For
                ICMP rules you instead specify an ICMP type and code in the
                spaces provided.
              </p>
            </Card>
          </Col>
        </Row>
      </Modal>
    </>
  );
}
