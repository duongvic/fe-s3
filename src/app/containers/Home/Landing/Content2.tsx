import {
  Badge,
  Button,
  Col,
  Divider,
  Row,
  Select,
  Space,
  Typography,
} from 'antd';
import Title from 'antd/lib/typography/Title';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { formatPrice } from 'utils/formatPrice';
import { selectAccount } from '../../Auth/selectors';
import {
  selectProductsLanding,
  selectRegion,
  selectRegions,
} from '../../Orders/selectors';
import { actions } from '../../Orders/slice';
import { Content4Products, en, PackageDuration, vi } from './constants';
import CustomSlider from './CustomSlider';
import Effect from './Effect';
import PackageModal from './PackageModal';

const { Text } = Typography;
export default function Content2(props) {
  const [data, setData]: any = useState({
    cpu: { value: 0, price: 0 },
    memory: { value: 0, price: 0 },
    disk: { value: 0, price: 0 },
    snapshot: { value: 0, price: 0 },
    backup: { value: 0, price: 0 },
    ip: { value: 0, price: 0 },
    net: { value: 0, price: 0 },
    os: { value: null, price: 0 },
    duration: { value: 1, price: 0 },
  });
  const [os, setOs]: any = useState([]);

  const user = useSelector(selectAccount);
  const region = useSelector(selectRegion);
  const regions = useSelector(selectRegions);
  const products = useSelector(selectProductsLanding);

  const dispatch = useDispatch();
  const { t } = useTranslation();

  const getData = (value, name, price) => {
    setData({
      ...data,
      [name.toLowerCase()]: { price: value * price, value: value },
    });
  };

  useEffect(() => {
    let osArray: any = [];
    products.forEach(element => {
      if (element.type === 'OS') osArray.push(element);
    });
    setOs(osArray);
  }, [products]);

  useEffect(() => {}, []);

  return (
    <div className="home-page-wrapper content2-wrapper" id="custom_package">
      <div className="home-page content2">
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <Row justify="center">
            <Typography.Title>{t('Title.CONTENT_2')}</Typography.Title>
          </Row>
          <Effect>
            <Row key="row" gutter={[0, 24]}>
              <Col lg={12} sm={24} key="col">
                {products?.map((input, idx) => {
                  return (
                    input.type !== 'OS' && (
                      <Row key={idx}>
                        <CustomSlider
                          getData={(value, name) =>
                            getData(value, name, input.price)
                          }
                          prefix={input.name}
                          suffix={input.unit.code}
                        ></CustomSlider>
                      </Row>
                    )
                  );
                })}
                <Row align="middle" className="package--item" gutter={[0, 24]}>
                  <Col span={5}>
                    <Badge dot={true}>{t('Label.OS')}</Badge>
                  </Col>
                  <Col span={12}>
                    <Select
                      showSearch
                      style={{ width: '100%' }}
                      optionFilterProp="children"
                      placeholder={t('Placeholder.OS')}
                      onChange={(value: any) =>
                        setData({
                          ...data,
                          os: { ...os[value] },
                        })
                      }
                      filterOption={(input, option: any) =>
                        option.children
                          .toString()
                          .toLowerCase()
                          .indexOf(input.toLowerCase()) >= 0
                      }
                    >
                      {os.map((item, idx) => (
                        <Select.Option value={idx} key={idx}>
                          {item?.name}
                        </Select.Option>
                      ))}
                    </Select>
                  </Col>
                </Row>
                <Row align="middle" className="package--item" gutter={[0, 24]}>
                  <Col span={5}>
                    <Typography.Text>{t('Label.DURATION')}</Typography.Text>
                  </Col>
                  <Col span={12}>
                    <Select
                      showSearch
                      style={{ width: '100%' }}
                      optionFilterProp="children"
                      defaultValue={t(`TimeOption.${PackageDuration[0]}`)}
                      onChange={value =>
                        setData({
                          ...data,
                          duration: { ...data.duration, value: value },
                        })
                      }
                      filterOption={(input, option: any) =>
                        option.children
                          .toString()
                          .toLowerCase()
                          .indexOf(input.toLowerCase()) >= 0
                      }
                    >
                      {PackageDuration.map((item, idx) => (
                        <Select.Option value={item} key={idx}>
                          {t(`TimeOption.${item}`)}
                        </Select.Option>
                      ))}
                    </Select>
                  </Col>
                </Row>
                <Row align="middle" className="package--item">
                  <Col span={5}>
                    <Typography.Text>{t('Label.REGION')}</Typography.Text>
                  </Col>
                  <Col span={12}>
                    <Select
                      value={region}
                      style={{ width: '6rem' }}
                      onSelect={value => dispatch(actions.setRegion(value))}
                    >
                      {regions?.map(item => (
                        <Select.Option value={item.id} key={item.id}>
                          {item.name}
                        </Select.Option>
                      ))}
                    </Select>
                  </Col>
                </Row>
              </Col>
              <Col span={1}></Col>

              <Col lg={11} sm={24}>
                <Row justify="center">
                  {user ? (
                    <Title type="warning" level={2}>
                      {t('Button.YOUR_CUSTOM_PACKAGE')}
                    </Title>
                  ) : (
                    <Title type="warning" level={2}>
                      {t('Button.SIGN_IN')}
                    </Title>
                  )}
                </Row>
                {user ? (
                  <>
                    <DisplayPrice data={data} />
                  </>
                ) : (
                  <Button shape="round" block={true} type="primary">
                    <NavLink to="sign-in">
                      <b>{t('Button.SIGN_IN_TO_KNOW_PRICE')}</b>
                    </NavLink>
                  </Button>
                )}
              </Col>
            </Row>
          </Effect>
        </Space>
      </div>
    </div>
  );
}

function DisplayPrice(props) {
  const [price, setPrice] = useState(0);
  const [show, setShow] = useState(false);
  const [type, setType] = useState('Trial');
  const [data, setData]: any = useState({});

  const { t } = useTranslation();
  const showModal = input => {
    setData({
      products: [
        { ...Content4Products[0], quantity: props.data.cpu.value },
        { ...Content4Products[1], quantity: props.data.memory.value },
        { ...Content4Products[2], quantity: props.data.disk.value },
        { ...Content4Products[3], quantity: props.data.ip.value },
        { ...Content4Products[4], quantity: props.data.net.value },
        { ...Content4Products[5], quantity: props.data.snapshot.value },
        { ...Content4Products[6], quantity: props.data.backup.value },
      ],
      os: props.data.os,
      duration: props.data.duration.value,
    });
    setType(input);
    setShow(true);
  };
  useEffect(() => {
    setPrice(
      (props.data.cpu.price +
        props.data.memory.price +
        props.data.disk.price +
        props.data.snapshot.price +
        props.data.ip.price +
        props.data.net.price +
        props.data.backup.price +
        Number(props.data.os.price)) *
        props.data.duration.value,
    );
  });

  const isDisable = () =>
    props.data.cpu.value > 0 &&
    props.data.memory.value > 0 &&
    props.data.disk.value > 0 &&
    props.data.ip.value > 0 &&
    props.data.net.value > 0 &&
    props.data.os.name
      ? false
      : true;
  return (
    <>
      <Col span={15} push={4}>
        {Object.keys(props.data).map(
          (item, idx) =>
            item !== 'duration' && (
              <Row justify="space-between" key={idx}>
                <Text type="success">{item.toUpperCase()}:</Text>
                <Text type="success" strong>
                  {formatPrice(props.data[item]?.price)} đ
                </Text>
              </Row>
            ),
        )}
        <Divider></Divider>
        <Row justify="space-between" align="top" gutter={[0, 24]}>
          <Text type="success" style={{ margin: 'auto 0' }}>
            Thành tiền:
          </Text>
          <Title level={2} style={{ marginTop: 0 }}>
            <Text strong type="warning">
              {formatPrice(price)} VND
            </Text>
          </Title>
        </Row>
      </Col>
      <PackageModal
        show={show}
        data={data}
        price={price}
        type={type}
        setShow={() => setShow(false)}
        title={vi.Custom_Package}
      />

      <Row justify="center" gutter={[0, 24]}>
        <Space size={24}>
          <Button
            shape="round"
            onClick={() => showModal(en.Buy)}
            type="primary"
            style={{ width: '6rem' }}
            disabled={isDisable()}
          >
            {t('Button.BUY')}
          </Button>
          <Button
            shape="round"
            onClick={() => showModal(en.Trial)}
            style={{ width: '6rem' }}
            disabled={isDisable()}
          >
            {t('Button.TRIAL')}
          </Button>
        </Space>
      </Row>
      <Row justify="center">
        <Text type="secondary">
          {t('Typography.CONTACT_HOTLINE_IF_YOU_HAVE_SPECIAL_REQUEST')}
        </Text>
      </Row>
    </>
  );
}
