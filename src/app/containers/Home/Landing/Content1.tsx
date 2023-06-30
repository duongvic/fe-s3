import { LeftCircleTwoTone, RightCircleTwoTone } from '@ant-design/icons';
import {
  Button,
  Card,
  Carousel,
  Divider,
  notification,
  Row,
  Select,
  Space,
  Typography,
} from 'antd';
import Title from 'antd/lib/typography/Title';
import saleImg from 'assets/icon/sale1.gif';
import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { formatPrice } from 'utils/formatPrice';
import { selectAccount } from '../../Auth/selectors';
import {
  selectError,
  selectNotice,
  selectPackages,
  selectProductsLanding,
  selectRegion,
  selectRegions,
} from '../../Orders/selectors';
import { actions } from '../../Orders/slice';
import { en, PackageDuration, settingCarousel } from './constants';
import PackageModal from './PackageModal';

const { Option } = Select;
export default function Content1(props) {
  const [os, setOs]: any = useState([]);

  const notice = useSelector(selectNotice);
  const error = useSelector(selectError);
  const region = useSelector(selectRegion);
  const packages = useSelector(selectPackages);
  const products = useSelector(selectProductsLanding);
  const regions = useSelector(selectRegions);

  const dispatch = useDispatch();
  const refCarousel: any = useRef(null);
  const { t } = useTranslation();
  useEffect(() => {
    if (packages?.length === 0) dispatch(actions.loadPackages());
    if (products?.length === 0) dispatch(actions.loadProductsLanding());
  }, [dispatch]);

  useEffect(() => {
    if (notice || error) {
      const status = notice ? 'success' : 'error';
      notification[status]({
        message: notice ? notice : error,
        placement: 'bottomRight',
        duration: 5,
      });
      if (error) dispatch(actions.setError(null));
      if (notice) dispatch(actions.setNotice(null));
    }
  }, [notice, error, dispatch]);

  useEffect(() => {
    let osArray: any = [];
    products.forEach(element => {
      if (element.type === 'OS') osArray.push({ ...element });
    });
    setOs(osArray);
  }, [products]);
  return (
    <div className="home-page-wrapper content1-wrapper">
      <div className="home-page content1">
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <Row justify="center">
            <Typography.Title>{t('Title.CONTENT_1')}</Typography.Title>
          </Row>
          <Row justify="space-between" gutter={[0, 48]} align="middle">
            <LeftCircleTwoTone
              className="direct-button"
              onClick={() => refCarousel.current.prev()}
            />
            <Typography.Text>
              {t('Label.REGION')}:&nbsp;
              <Select
                value={region}
                style={{ width: '5rem' }}
                onChange={value => dispatch(actions.setRegion(value))}
              >
                {regions?.map(item => (
                  <Select.Option value={item?.id} key={item?.id}>
                    {item?.name}
                  </Select.Option>
                ))}
              </Select>
            </Typography.Text>
            <RightCircleTwoTone
              className="direct-button"
              onClick={() => refCarousel.current.next()}
            />
          </Row>
          <Carousel ref={refCarousel} key="block0" {...settingCarousel}>
            {(packages.length > 4 ? packages : [...packages, ...packages]).map(
              (item, idx) => {
                return (
                  item.name !== 'Custom' && (
                    <DisplayPackage data={item} key={idx} os={os} />
                  )
                );
              },
            )}
          </Carousel>
        </Space>
      </div>
    </div>
  );
}

function DisplayPackage(props) {
  const [show, setShow] = useState(false);
  const [type, setType] = useState('Trial');
  const [data, setData]: any = useState({
    products: [...props.data.products],
    os: null,
    duration: 1,
  });

  const user = useSelector(selectAccount);

  const history = useHistory();
  const { t } = useTranslation();

  const showModal = input => {
    setType(input);
    setShow(true);
  };
  return (
    <>
      <Card
        bodyStyle={{ padding: '0 1rem' }}
        style={{ border: 'none', background: 'transparent' }}
        hoverable
        cover={
          <div className="package">
            {props.data?.priority > 0 && (
              <img
                src={saleImg}
                alt=""
                style={{ position: 'absolute', width: 70, zIndex: 3, left: 0 }}
              />
            )}
            <div className="package--header">
              <Row justify="center" align="middle" className="title">
                <Typography.Title level={4}>{props.data.name}</Typography.Title>
              </Row>
              <Divider style={{ marginTop: 0 }}></Divider>
              <Row justify="center">
                <Title level={2}>
                  {formatPrice(
                    Number(
                      props.data.price * data.duration +
                        (data.os?.price ? Number(data.os?.price) : 0),
                    ),
                  )}
                </Title>{' '}
                VND
              </Row>
              <Row justify="center">
                <Typography.Text>/{t('Typography.MONTH')}</Typography.Text>
              </Row>
            </div>
            <Space direction="vertical" size={6} style={{ width: '100%' }}>
              {props.data.products.map((item, idx) => (
                <Row justify="center" key={idx}>
                  {item.name !== 'NET' ? item.name : 'NETWORK'}: {item.quantity}{' '}
                  {item.unit}&nbsp;
                  {item.description ? (
                    <Typography.Text>({item.description})</Typography.Text>
                  ) : (
                    ''
                  )}
                </Row>
              ))}
              <Row justify="center">{t('Label.OS')}</Row>

              <Row justify="center">
                <Select
                  showSearch
                  style={{ width: '60%' }}
                  optionFilterProp="children"
                  onChange={(value: any) =>
                    setData({
                      ...data,
                      os: props.os[value],
                    })
                  }
                  placeholder={t('Placeholder.OS')}
                  filterOption={(input, option: any) =>
                    option.children
                      .toString()
                      .toLowerCase()
                      .indexOf(input.toLowerCase()) >= 0
                  }
                >
                  {props.os.map((item, idx) => (
                    <Select.Option value={idx} key={idx}>
                      {item.name}
                    </Select.Option>
                  ))}
                </Select>
              </Row>
              <Row justify="center">{t('Label.DURATION')}</Row>
              <Row justify="center">
                <Select
                  showSearch
                  style={{ width: '60%' }}
                  placeholder="Select Duration"
                  optionFilterProp="children"
                  filterOption={(input: any, option: any) =>
                    option.children
                      .toString()
                      .toLowerCase()
                      .indexOf(input.toLowerCase()) >= 0
                  }
                  defaultValue={PackageDuration[0]}
                  onChange={value => setData({ ...data, duration: value })}
                >
                  {PackageDuration.map((item, idx) => (
                    <Option value={item} key={idx}>
                      {t(`TimeOption.${item}`)}
                    </Option>
                  ))}
                </Select>
              </Row>
              {user ? (
                <>
                  <Row justify="center">
                    <Button
                      type="primary"
                      shape="round"
                      disabled={data?.os ? false : true}
                      onClick={() => showModal(en.Buy)}
                    >
                      {t('Button.BUY')}
                    </Button>
                  </Row>
                  <Row justify="center">
                    <Button
                      shape="round"
                      disabled={data?.os ? false : true}
                      onClick={() => showModal(en.Trial)}
                    >
                      {t('Button.TRIAL')}
                    </Button>
                  </Row>
                </>
              ) : (
                <Row justify="center">
                  <Button
                    type="primary"
                    shape="round"
                    onClick={() => history.push('/sign-in')}
                  >
                    {t('Button.SIGN_IN')}
                  </Button>
                </Row>
              )}
            </Space>
            <PackageModal
              show={show}
              data={data}
              package_id={props.data.id}
              price={props.data.price * data.duration}
              type={type}
              setShow={() => setShow(false)}
              title={props.data.name}
            />
          </div>
        }
      ></Card>
    </>
  );
}
