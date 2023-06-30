import { Button, Card, Col, Row, Space } from 'antd';
import React from 'react';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import InfoInstance from './InfoInstance.jsx';
import OptionServices from './OptionServices.jsx';
import ReviewInstance from './ReviewInstance';
import {
  selectCurrentOs,
  selectInstance,
  selectOs,
  selectProducts,
  selectReview,
  selectService,
  selectContract,
  selectCurrentOsAmount,
} from './selectors';
import { actions } from './slice';
import './styles.less';
import empty from 'is-empty';
import { MODE_EXTEND } from '../Users/constants';
import { DiskIOPS } from './constants';
interface Props {
  mode?: string;
}

//B3 from tạo create order
export default function SetPackage({ mode }: Props) {
  const history = useHistory();
  const dispatch = useDispatch();
  const { t } = useTranslation(['translation', 'constant']);

  const contract = useSelector(selectContract);

  const instance = useSelector(selectInstance);

  const service = useSelector(selectService);

  const currentOs = useSelector(selectCurrentOs);
  const currentOsAmount = useSelector(selectCurrentOsAmount);

  const review = useSelector(selectReview);

  const os = useSelector(selectOs);
  const products = useSelector(selectProducts);

  const handleClickCancel = () => {
    dispatch(actions.setReview([]));
    dispatch(actions.contractLoaded({}));
    history.push('/dashboard/orders');
  };

  const handleClickAdd = () => {
    
    let OS = { ...os?.find(item => item?.name === currentOs) };
    let items = [...products, [...instance, ...service]]; // gộp thành  mảng
    if (!empty(OS)) {
      OS.quantity = currentOsAmount ? currentOsAmount : 0;
      OS.unit = OS.unit?.name;

      items = [...products, [...instance, ...service, OS]];
    } else {
      OS = {
        quantity: 0,
        name: '-',
      };
      items = [...products, [...instance, ...service, OS]];
    }

    dispatch(actions.setProducts(items));

    //create obj new dataView

    const dataReview = {
      OS:
        currentOs !== undefined && currentOs !== ''
          ? currentOs +
            '- License: ' +
            (currentOsAmount !== undefined ? currentOsAmount : 0)
          : '-',
    };

    // instance.forEach(item => {
    //   dataReview[item?.name.replace(' ', '_')] =
    //     item?.data?.iops && parseInt(item?.data?.iops) > 0
    //       ? `${item?.quantity} - IOPS : ${item?.data?.iops}`
    //       : item?.quantity;
    // });

    instance.forEach(item => {
      let volumeReview: any[] = [];
      let iops = item?.data?.iops;
      if (item?.name === 'ROOT_DISK' || item?.name === 'DATA_DISK') {
        iops = item?.data?.iops === 0 ? DiskIOPS['5000'] : item?.data?.iops;
        item?.data?.volumes?.forEach((vol, idx) => {
          volumeReview.push(`- Volume ${idx + 1}: ${vol.size} GB`);
        });
      }
      dataReview[item?.name.replace(' ', '_')] =
        parseInt(iops) > 0
          ? `Size: ${
              item?.quantity
            } GB\nIOPS : ${iops}\nVolumes:\n${volumeReview.join('\n')}`
          : item?.quantity;
    });

    service.forEach(item => {
      dataReview[item?.name.replace(' ', '')] = item?.quantity;
    });

    dispatch(actions.setReview([...review, dataReview]));

    //end
  };

  return (
    <>
      <Row gutter={mode === MODE_EXTEND ? 0 : 4} style={{ marginBottom: 4 }}>
        <Col span={12}>
          <Card
            title={t('Title.INSTANCE_INFO')}
            bordered={false}
            // style={{ height: '100%' }}
          >
            <InfoInstance />
          </Card>
        </Col>
        <Col span={12}>
          <Card
            title={t('Title.EXTEND_SERVICE')}
            bordered={false}
            style={{ height: '100%' }}
          >
            <OptionServices />
          </Card>
        </Col>
      </Row>

      <Row justify="center" style={{ margin: '16px 16px' }}>
        {contract?.current?.service_type === 'POOL' ? (
          <Space>
            <Button
              style={{ margin: '0 8px' }}
              // disabled={mode === MODE_EXTEND ? products.length > 0 : false}
              disabled={review.length === 1 ? true : false}
              type="primary"
              onClick={handleClickAdd}
            >
              {t('constant:Button.ADD')}
            </Button>
          </Space>
        ) : (
          <Space>
            <Button
              style={{ margin: '0 8px' }}
              disabled={mode === MODE_EXTEND ? products.length > 0 : false}
              type="primary"
              onClick={handleClickAdd}
            >
              {t('constant:Button.ADD')}
            </Button>
          </Space>
        )}

        {review?.length <= 0 && (
          <Space>
            <Button onClick={handleClickCancel}>{t('Button.CANCEL')}</Button>
          </Space>
        )}
      </Row>

      {/* <Card
        title={t('Title.INSTANCE_INFO')}
        headStyle={{ textAlign: 'center' }}
        bordered={false}
        style={{ height: '100%' }}
      > */}
      {/* {mode === MODE_EXTEND ? (
        <>
          <ExtendReviewInstance mode={MODE_EXTEND} />
        </>
      ) : (
        <>{review?.length > 0 && <ReviewInstance mode={mode} />}</>
      )} */}

      <>{review?.length > 0 && <ReviewInstance mode={mode} />}</>

      {/* </Card> */}
    </>
  );
}
