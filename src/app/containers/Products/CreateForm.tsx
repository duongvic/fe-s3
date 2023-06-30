import { Button, Card, Col, Form, Input, Row, Select, Spin } from 'antd';
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import { RESOURCE_TYPE, SERVICE_TYPE } from './constants';
import { selectLoading, selectNotice, selectUnits } from './selectors';
import { actions } from './slice';
import { moneyFormatter } from 'utils/constant';

export default function CreateForm() {
  const notice = useSelector(selectNotice);
  const { t } = useTranslation(['translation', 'constant']);

  const dispatch = useDispatch();
  const history = useHistory();

  const units = useSelector(selectUnits);
  const loading = useSelector(selectLoading)?.units;

  // const dataUnits = units ? units?.filter(e => e?.name === 'License') : [];

  // console.log('units dataUnits', dataUnits?.[0]?.id);

  //convert list to arr
  const dataSelect_ResourceType = Object.values(RESOURCE_TYPE);

  const layout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 18 },
  };

  const rules = {
    rules: [{ required: true, message: t('Field_Message.REQUIRED_FIELD') }],
  };

  useEffect(() => {
    if (notice === t('Message.CREATE_PRODUCT_SUCCESS')) {
      dispatch(actions.loadProducts());
      history.push('/dashboard/products');
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [notice]);

  useEffect(() => {
    if (units?.length === null || units?.length === undefined)
      dispatch(actions.loadUnits());
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onFinish = (value: any) => {
    const data: any = {
      ...value,
      type: value.resource_type,
      unit_id: value?.unit ? parseFloat(value?.unit) : 0,
      init_fee: value?.init_fee
        ? parseFloat(value.init_fee.replaceAll(',', ''))
        : 0,
      maintenance_fee: value?.maintenance_fee
        ? parseFloat(value.maintenance_fee.replaceAll(',', ''))
        : 0,
      data: {
        arch: value.arch,
        type: value.type,
        version: value.version,
        platform: value.platform,
        backend_name: value.backend_name,
      },
    };
    delete data.arch;
    delete data.resource_type;
    // //    delete data.type;
    delete data.version;
    delete data.platform;
    delete data.backend_name;
    delete data.unit;
    dispatch(actions.setData(data));
    dispatch(actions.createProduct());
  };

  function handleChange(value) {
    console.log(`selected ${value}`);
  }

  if (loading) {
    return <Spin />;
  }

  return (
    <Row className="steps-content">
      <Col span={18} push={3}>
        <Form
          {...layout}
          layout="horizontal"
          labelAlign="left"
          scrollToFirstError={true}
          onFinish={onFinish}
        >
          <Card
            title={t('Title.CREATE_PRODUCT')}
            bordered={false}
            style={{ height: '100%', minHeight: '78vh' }}
          >
            <Form.Item
              label={t('translation:Label.NAME')}
              name="name"
              {...rules}
            >
              <Input placeholder={t('translation:Label.NAME')}></Input>
            </Form.Item>
            <Form.Item
              label={t('translation:Label.RESOURCE_TYPE')}
              name="resource_type"
              {...rules}
            >
              <Select placeholder={t('translation:Label.RESOURCE_TYPE')}>
                {dataSelect_ResourceType?.map(item => (
                  <Select.Option value={item} key={item}>
                    {item}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              label={t('translation:Label.UNIT')}
              name="unit"
              initialValue={`${units?.[0] ? units?.[0]?.id : undefined}`}
              {...rules}
            >
              <Select className="w-100-p" onSelect={handleChange}>
                {units?.map(item => (
                  <Select.Option key={`${item?.id}`} value={`${item?.id}`}>
                    {item?.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              initialValue="image"
              label={t('translation:Label.CN')}
              name="cn"
            >
              <Input disabled></Input>
            </Form.Item>

            <Form.Item
              label={t('translation:Label.SERVICE_TYPE')}
              name="service_type"
              {...rules}
            >
              <Select placeholder={t('translation:Label.SERVICE_TYPE')}>
                {Object.values(SERVICE_TYPE)?.map(item => (
                  <Select.Option value={item} key={item}>
                    {item}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              label={t('translation:Label.INIT_FEE')}
              name="init_fee"
              // initialValue={0}
              // {...rules}
              getValueFromEvent={e => moneyFormatter(e)}
              rules={[
                {
                  required: true,
                  // transform,
                  // type: 'number',
                  min: 0,
                  message: t('Field_Message.REQUIRED_FIELD'),
                },
              ]}
            >
              <Input
                style={{ width: '50%' }}
                allowClear
                // formatter={value =>
                //   `${value} VNĐ`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                // }
                // parser={(value: any) => value.replace(/[ VNĐ]\s?|(,*)/g, '')}
                // min={0}
                addonAfter={
                  <span
                    style={{
                      width: '50px',
                      display: 'flex',
                      justifyContent: 'center',
                    }}
                  >
                    VNĐ
                  </span>
                }
              ></Input>
            </Form.Item>
            <Form.Item
              label={t('translation:Label.MAINTENANCE_FEE')}
              name="maintenance_fee"
              // initialValue={0}
              // {...rules}
              getValueFromEvent={e => moneyFormatter(e)}
              rules={[
                {
                  required: true,
                  // transform,
                  // type: 'number',
                  min: 0,
                  message: t('Field_Message.REQUIRED_FIELD'),
                },
              ]}
            >
              <Input
                style={{ width: '50%' }}
                // formatter={value =>
                //   `${value} VNĐ`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                // }
                // parser={(value: any) => value.replace(/[ VNĐ]\s?|(,*)/g, '')}
                min={0}
                addonAfter={
                  <span
                    style={{
                      width: '50px',
                      display: 'flex',
                      justifyContent: 'center',
                    }}
                  >
                    VNĐ
                  </span>
                }
              ></Input>
            </Form.Item>
            <Form.Item
              label={t('translation:Label.DESCRIPTION')}
              name="description"
              {...rules}
            >
              <Input.TextArea
                allowClear
                placeholder={t('translation:Placeholder.DESCRIPTION')}
              ></Input.TextArea>
            </Form.Item>
            <Form.Item
              label={t('translation:Label.ARCH')}
              name="arch"
              {...rules}
            >
              <Input placeholder={t('translation:Placeholder.ARCH')}></Input>
            </Form.Item>
            <Form.Item
              label={t('translation:Label.IMAGE_TYPE')}
              name="type"
              {...rules}
            >
              <Input
                placeholder={t('translation:Placeholder.IMAGE_TYPE')}
              ></Input>
            </Form.Item>
            <Form.Item
              label={t('translation:Label.VERSION')}
              name="version"
              {...rules}
            >
              <Input placeholder={t('translation:Placeholder.VERSION')}></Input>
            </Form.Item>
            <Form.Item
              label={t('translation:Label.PLATFORM')}
              name="platform"
              {...rules}
            >
              <Input
                placeholder={t('translation:Placeholder.PLATFORM')}
              ></Input>
            </Form.Item>
            <Form.Item
              label={t('translation:Label.BACKEND_NAME')}
              name="backend_name"
              {...rules}
            >
              <Input
                placeholder={t('translation:Placeholder.BACKEND_NAME')}
              ></Input>
            </Form.Item>

            <Row justify="center">
              <Form.Item>
                <Button htmlType="submit" type="primary" loading={loading}>
                  {t('translation:Button.CREATE')}
                </Button>
              </Form.Item>
            </Row>
          </Card>
        </Form>
      </Col>
    </Row>
  );
}
