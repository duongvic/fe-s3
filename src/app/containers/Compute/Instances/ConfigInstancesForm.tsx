import {
  EyeInvisibleOutlined,
  EyeTwoTone,
  MinusCircleOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import {
  Button,
  Card,
  Checkbox,
  Col,
  Form,
  Input,
  InputNumber,
  Radio,
  Row,
  Select,
  Space,
} from 'antd';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { selectFlavor, selectNetworks } from './selector';
import { actions } from './slice';

const { TextArea } = Input;
const { Option } = Select;

export default function ConfigInstancesForm() {
  const [accessType, setAccessType] = useState('password');
  const [form] = Form.useForm();

  const dispatch = useDispatch();
  const { t } = useTranslation();

  const flavor = useSelector(selectFlavor);
  const networks = useSelector(selectNetworks);

  //handleChange AccessType
  const handleChangeAccessType = e => {
    setAccessType(e.target.value);
  };

  useEffect(() => {
    dispatch(actions.loadFlavor());
  }, [dispatch]);

  return (
    <Form layout="vertical" form={form}>
      <Row gutter={[16, 16]}>
        {/* Step 1 */}
        <Col span={12}>
          <Card title="Step 1: General" bordered={false}>
            <Form.Item
              name="name"
              label={t('Label.INSTANCE_NAME')}
              rules={[
                {
                  required: true,
                  message: t('Field_Message.INSTANCE_NAME'),
                  whitespace: true,
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="user"
              label={t('Label.INSTANCES_USER')}
              rules={[
                {
                  required: true,
                  message: t('Field_Message.INSTANCES_USER'),
                  whitespace: true,
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item name="notes" label={t('Label.NOTES')}>
              <TextArea rows={4} />
            </Form.Item>
            <Form.Item
              initialValue={1}
              name="number"
              label={t('Label.NUMBER_OF_INSTANCES')}
            >
              <InputNumber min={1} />
            </Form.Item>
            <Form.Item
              initialValue="password"
              name="accessType"
              label={t('Label.USER_ACCESS_TYPE')}
            >
              <Radio.Group onChange={handleChangeAccessType}>
                <Radio value="password">Password</Radio>
                <Radio value="keypair">Keypair</Radio>
              </Radio.Group>
            </Form.Item>
            {accessType === 'password' && (
              <>
                <Form.Item
                  name="password"
                  label={t('Label.PASSWORD')}
                  rules={[
                    {
                      required: true,
                      message: t('Field_Message.PASSWORD'),
                      whitespace: true,
                    },
                  ]}
                >
                  <Input.Password
                    placeholder={t('Placeholder.PASSWORD')}
                    iconRender={visible =>
                      visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                    }
                  />
                </Form.Item>
                <Form.Item
                  name="confirmPassword"
                  label={t('Label.CONFIRM_PASSWORD')}
                  rules={[
                    {
                      required: true,
                      message: t('Field_Message.CONFIRM_PASSWORD'),
                      whitespace: true,
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
                  <Input.Password
                    placeholder="input password"
                    iconRender={visible =>
                      visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                    }
                  />
                </Form.Item>
              </>
            )}
            {accessType === 'keypair' && (
              <Form.Item
                name="privateKey"
                label={t('LabelPRIVATE_KEY')}
                rules={[
                  {
                    required: true,
                    message: t('Field_Message.PRIVATE_KEY'),
                    whitespace: true,
                  },
                ]}
              >
                <Select placeholder={t('Placeholder.PRIVATE_KEY')}>
                  <Option value="pkey1">Private key 1</Option>
                  <Option value="pkey2">Private key 2</Option>
                </Select>
              </Form.Item>
            )}
          </Card>
        </Col>
        <Col span={12}>
          {/* Step 2          */}
          <Row gutter={[0, 16]} style={{ height: '100%', marginBottom: 0 }}>
            <Col span={24} style={{ height: '50%' }}>
              <Card
                title="Step 2: Select Flavor"
                bordered={false}
                style={{ height: '100%' }}
              >
                <Form.Item
                  initialValue={flavor && flavor[0].name}
                  name="flavor"
                  label={t('Label.SELECT_FLAVOR')}
                >
                  <Select>
                    {flavor &&
                      flavor.map(item => (
                        <Option key={item.id} value={item.name}>
                          {item.name}
                        </Option>
                      ))}
                  </Select>
                </Form.Item>
                <Form.Item
                  initialValue="ubuntu16.04"
                  name="image"
                  label={<span>Image</span>}
                >
                  <Select>
                    <Option value="ubuntu16.04">Ubuntu16.04</Option>
                    <Option value="ubuntu18.04">Ubuntu18.04</Option>
                  </Select>
                </Form.Item>
              </Card>
            </Col>

            {/* Step 3 */}
            <Col span={24} style={{ height: '52%' }}>
              <Card
                title="Step 3: Network"
                bordered={false}
                style={{ height: '100%' }}
              >
                <Form.Item
                  name="network"
                  label={<span>Network</span>}
                  rules={[
                    {
                      required: true,
                      message: 'Please input network!',
                      whitespace: true,
                    },
                  ]}
                >
                  <Select placeholder="Please select a network">
                    {networks &&
                      networks.map(item => (
                        <Option key={item.id} value={item.name}>
                          {item.name}
                        </Option>
                      ))}
                  </Select>
                </Form.Item>
                <Form.Item
                  name="subnet"
                  label={<span>Subnet</span>}
                  rules={[
                    {
                      required: true,
                      message: 'Please input subnet!',
                      whitespace: true,
                    },
                  ]}
                >
                  <Select placeholder="Please select a subnet">
                    <Option value="m1">M1</Option>
                    <Option value="m1.small">M1.small</Option>
                  </Select>
                </Form.Item>
                <Form.Item name="autoAssignPublicIp" valuePropName="checked">
                  <Checkbox value="auto">Auto assign Public IP</Checkbox>
                </Form.Item>
              </Card>
            </Col>
          </Row>
        </Col>

        {/* Step 4 */}
        <Col span={12}>
          <Card title="Step 4: Storage" bordered={false}>
            <Form.List name="storage">
              {(fields, { add, remove }) => (
                <>
                  {fields.map(field => (
                    <Space key={field.key} align="baseline">
                      <Form.Item
                        {...field}
                        label="Volume Type"
                        name={[field.name, 'volumeType']}
                        fieldKey={[field.fieldKey, 'volumeType']}
                        rules={[
                          {
                            required: true,
                            message: 'Missing volume type',
                          },
                        ]}
                      >
                        <Input />
                      </Form.Item>

                      <Form.Item
                        {...field}
                        label="Device"
                        name={[field.name, 'device']}
                        fieldKey={[field.fieldKey, 'device']}
                        rules={[{ required: true, message: 'Missing device' }]}
                      >
                        <Select style={{ width: 120 }}>
                          <Option value="m1">M1</Option>
                          <Option value="m1.small">M1.small</Option>
                        </Select>
                      </Form.Item>
                      <Form.Item
                        {...field}
                        label="Snapshot"
                        name={[field.name, 'snapshot']}
                        fieldKey={[field.fieldKey, 'snapshot']}
                        rules={[
                          { required: true, message: 'Missing snapshot' },
                        ]}
                      >
                        <Input />
                      </Form.Item>
                      <Form.Item
                        {...field}
                        label="Size (GB)"
                        name={[field.name, 'size']}
                        fieldKey={[field.fieldKey, 'size']}
                        rules={[{ required: true, message: 'Missing size' }]}
                      >
                        <InputNumber min={0} />
                      </Form.Item>
                      <Form.Item
                        {...field}
                        label="Encryption"
                        name={[field.name, 'encryption']}
                        fieldKey={[field.fieldKey, 'encryption']}
                        rules={[
                          { required: true, message: 'Missing encryption' },
                        ]}
                      >
                        <Input />
                      </Form.Item>

                      <MinusCircleOutlined
                        style={{ position: 'relative', top: 35 }}
                        onClick={() => remove(field.name)}
                      />
                    </Space>
                  ))}

                  <Form.Item>
                    <Button
                      type="dashed"
                      onClick={() => add()}
                      block
                      icon={<PlusOutlined />}
                    >
                      Add storage
                    </Button>
                  </Form.Item>
                </>
              )}
            </Form.List>
          </Card>
        </Col>
        <Col span={12}>
          <Card title="Step 5: Security" bordered={false}>
            <Form.List name="security">
              {(fields, { add, remove }) => (
                <>
                  {fields.map(field => (
                    <Space key={field.key} align="baseline">
                      <Form.Item
                        {...field}
                        label="Device"
                        name={[field.name, 'device']}
                        fieldKey={[field.fieldKey, 'device']}
                        rules={[{ required: true, message: 'Missing device' }]}
                      >
                        <Select style={{ width: 120 }}>
                          <Option value="icmp">ICMP</Option>
                          <Option value="tcp">TCP</Option>
                          <Option value="udp">UDP</Option>
                        </Select>
                      </Form.Item>
                      <Form.Item
                        {...field}
                        label="Port Range"
                        name={[field.name, 'portRange']}
                        fieldKey={[field.fieldKey, 'portRange']}
                        rules={[
                          {
                            required: true,
                            message: 'Missing volume port range',
                          },
                        ]}
                      >
                        <Input />
                      </Form.Item>
                      <Form.Item
                        {...field}
                        label="Source"
                        name={[field.name, 'source']}
                        fieldKey={[field.fieldKey, 'source']}
                        rules={[{ required: true, message: 'Missing source' }]}
                      >
                        <Input />
                      </Form.Item>
                      <Form.Item
                        {...field}
                        label="Description"
                        name={[field.name, 'description']}
                        fieldKey={[field.fieldKey, 'description']}
                        rules={[
                          { required: true, message: 'Missing description' },
                        ]}
                      >
                        <Input />
                      </Form.Item>

                      <MinusCircleOutlined
                        style={{ position: 'relative', top: 35 }}
                        onClick={() => remove(field.name)}
                      />
                    </Space>
                  ))}

                  <Form.Item>
                    <Button
                      type="dashed"
                      onClick={() => add()}
                      block
                      icon={<PlusOutlined />}
                    >
                      Add security
                    </Button>
                  </Form.Item>
                </>
              )}
            </Form.List>
          </Card>
        </Col>
      </Row>
      <Row justify="center">
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Create
          </Button>
        </Form.Item>
      </Row>
    </Form>
  );
}
