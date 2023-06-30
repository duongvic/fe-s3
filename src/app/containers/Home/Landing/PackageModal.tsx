import { Divider, Modal, Row, Typography } from 'antd';
import moment from 'moment';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { formatPrice } from 'utils/formatPrice';
import { selectAccount } from '../../Auth/selectors';
import { selectRegion, selectRegions } from '../../Orders/selectors';
import { actions } from '../../Orders/slice';

const { Text, Title } = Typography;
export default function PackageModal(props) {
  const [confirmLoading, setConfirmLoading] = useState(false);
  const products = props.data.products ? props.data.products : [];

  const region = useSelector(selectRegion);
  const account = useSelector(selectAccount);
  const regions = useSelector(selectRegions);

  const dispatch = useDispatch();
  const { t } = useTranslation();

  const handleOk = () => {
    setConfirmLoading(true);
    const items = props.package_id
      ? [
          {
            package_id: props.package_id,
            products: [
              {
                ...props.data.os,
                quantity: 1,
                unit: props.data.os.unit.code,
              },
            ],
          },
        ]
      : [
          {
            products: [
              ...products,
              {
                ...props.data.os,
                quantity: 1,
                unit: props.data.os.unit.code,
              },
            ],
          },
        ];
    const data = {
      customer: { id: account.id },
      service_type: 'COMPUTE',
      pmt_type: 'COD',
      price: props.price,
      duration: props.data.duration,
      order_type: props.type.toUpperCase(),
      quantity: 1,
      region_id: region,
      items: [...items],
    };
    dispatch(actions.setData(data));
    dispatch(actions.createOrder());
    setTimeout(() => {
      props.setShow();
      setConfirmLoading(false);
    }, 500);
  };
  return (
    <Modal
      title={props.title}
      visible={props.show}
      confirmLoading={confirmLoading}
      onOk={handleOk}
      onCancel={() => props.setShow()}
    >
      {products.map((item, idx) => (
        <Row justify="space-between" key={idx}>
          <Text>{item.name.toUpperCase()}:</Text>
          <Text strong>
            {item.quantity} {item?.unit}&nbsp;
            {item.description ? (
              <Typography.Text>({item.description})</Typography.Text>
            ) : (
              ''
            )}
          </Text>
        </Row>
      ))}
      <Row justify="space-between">
        <Text>{t('Label.OS')}</Text>
        <Text strong>{props.data.os?.name}</Text>
      </Row>
      <Row justify="space-between">
        <Text>{t('Label.DURATION')}</Text>
        <Text strong>{props.data.duration}</Text>
      </Row>
      <Divider></Divider>
      <Row justify="space-between">
        <Text>{t('Label.REGION')}</Text>
        <Text strong>
          {regions?.filter(item => item?.id === region)[0]?.name}
        </Text>
      </Row>
      <Row justify="space-between">
        <Text>Ngày tạo:</Text>
        <Text strong>{moment().format('DD/MM/YYYY')}</Text>
      </Row>
      <Row justify="space-between">
        <Text>{t('Label.ORDER_TYPE')}</Text>
        <Text strong>{props.type}</Text>
      </Row>
      <Divider></Divider>
      <Row justify="space-between">
        <Text>{t('Label.PRICE')}</Text>
        <Text strong>
          <Title level={2} type="warning">
            {formatPrice(Number(props.price))} VND
          </Title>
        </Text>
      </Row>
    </Modal>
  );
}
