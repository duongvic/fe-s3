import { Button, Form, Modal, Row, Card, Col, Space } from 'antd';
import Input from 'antd/es/input';
// import { selectAccount } from 'app/containers/Auth/selectors';
import {
  selectVmCfg,
  selectVmCfgId,
  selectVmCfgInstance,
} from 'app/containers/Orders/selectors';
import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router';
import { moneyFormatter } from 'utils/constant';

import {
  selectLoading,
  // selectContract,
  selectInstance,
  selectService,
  selectCurrentOs,
  selectCurrentOsAmount,
  selectReview,
  selectOs,
  selectProducts,
  selectVmCfgService,
  selectOrder,
  selectVmCfgOs,
  selectNotice,
} from '../selectors';
import { actions } from '../slice';
import EditInfoInstance from './EditInfoInstance.jsx';
import EditOptionServices from './EditOptionServices.jsx';

import empty from 'is-empty';

const { TextArea } = Input;
interface ModalExtendInstanceProps {
  visible: boolean;
  onCancel: () => void;
  mode?: string;
}

interface paramsType {
  instanceId: string;
}

export const ModalExtendInstance: React.FC<ModalExtendInstanceProps> = ({
  visible,
  onCancel,
  mode,
}) => {
  const { t } = useTranslation(['translation', 'constant']);
  const notice = useSelector(selectNotice);

  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const history = useHistory();
  const params = useParams<paramsType>();
  const { instanceId } = params;

  const loading = useSelector(selectLoading);
  const vmCfgId = useSelector(selectVmCfgId);

  // const instance = useSelector(selectCompute);
  const vmCfg = useSelector(selectVmCfg);

  // const account = useSelector(selectAccount);
  // const contract = useSelector(selectContract);

  const instance = useSelector(selectInstance);
  const vmCfgInstace = useSelector(selectVmCfgInstance);

  const service = useSelector(selectService);
  const vmCfgService = useSelector(selectVmCfgService);

  const currentOs = useSelector(selectCurrentOs);
  const currentOsAmount = useSelector(selectCurrentOsAmount);

  const review = useSelector(selectReview);
  // console.log('BanDaureview', review);

  const os = useSelector(selectOs);
  const vmCfgOs = useSelector(selectVmCfgOs);
  const products = useSelector(selectProducts);
  const order = useSelector(selectOrder);

  const handleClickAdd = () => {
    let OS = { ...os?.find(item => item?.name === currentOs) };
    let items = [...products, [...instance, ...service]]; // gộp thành  mảng
    // console.log('5D arr [products,instance,service]', items);
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

    instance.forEach(item => {
      dataReview[item?.name.replace(' ', '_')] =
        item?.iops && parseInt(item?.iops) > 0
          ? `${item?.quantity} - IOPS : ${item?.iops}`
          : item?.quantity;
    });

    service.forEach(item => {
      dataReview[item?.name.replace(' ', '')] = item?.quantity;
    });

    dispatch(actions.setReview([...review, dataReview]));

    //end
  };

  useEffect(() => {
    if (vmCfgId && vmCfgOs) {
      dispatch(actions.setCurrentOs(`${vmCfgOs?.[0]?.name}`));
      // console.log('currentOs', currentOs);
      dispatch(actions.setCurrentOsAmount(vmCfgOs?.[0]?.quantity));
    } else {
      dispatch(actions.setCurrentOs(''));
      dispatch(actions.setCurrentOsAmount(0));
    }
  }, [vmCfgOs, vmCfgId, dispatch]);

  const onFinish = data => {
    let OS = os;
    OS = {
      ...os
        ?.filter(item => item?.name === currentOs)
        ?.map(item => ({
          ...item,
          quantity: currentOsAmount ? currentOsAmount : 0,
        })),
    };

    let items: any[] = [];
    let remark = form.getFieldValue('remark');
    let price_extend = form.getFieldValue('price_extend');
    items = [...products, [...instance, ...service, OS?.[0]]];

    dispatch(
      actions.setData({
        data: items,
        vmConfigId: vmCfgId,
        remark: remark,
        price_extend: price_extend,
      }),
    );
    dispatch(actions.extendOrder());
  };

  const onOk = () => {
    form.resetFields();
    onCancel();
  };

  useEffect(() => {
    if (notice === t('Message.UPDATE_ORDER_SUCCESS')) {
    }
  }, [notice]);

  return (
    <Modal
      title={t('constant:Title.EDIT_INSTANCE')}
      visible={visible}
      onOk={onOk}
      onCancel={onCancel}
      width={1200}
      destroyOnClose={true}
      footer={false}
    >
      <Form
        form={form}
        labelCol={{ xs: { span: 24 }, sm: { span: 8 } }}
        // className="edit-instance-form"

        onFinish={onFinish}
      >
        <Row gutter={8} style={{ marginBottom: 4 }}>
          <Col span={14}>
            <Card
              title={t('Title.INSTANCE_INFO')}
              bordered={false}
              style={{ height: '100%' }}
            >
              <EditInfoInstance />
            </Card>
          </Col>
          <Col span={10}>
            <Card
              title={t('Title.EXTEND_SERVICE')}
              bordered={false}
              style={{ height: '100%' }}
            >
              <EditOptionServices />
            </Card>
          </Col>
        </Row>

        {/* <Row justify="center" style={{ margin: '16px 0px' }}>
          <Space>
            <Button
              // disabled={mode === MODE_EXTEND ? products.length > 0 : false}
              // disabled={review.length === 1 ? true : false}
              type="primary"
              onClick={handleClickAdd}
            >
              {t('constant:Button.ADD')}
            </Button>
          </Space>
        </Row> */}

        {/* {review?.length > 0 && <EditReviewInstance mode={mode} />} */}

        <Row style={{ marginTop: 16 }}>
          <Col span={12}></Col>
          <Col span={24}>
            <Form.Item
              name="price_extend"
              label={t('translation:Label.PRICE')}
              getValueFromEvent={e => moneyFormatter(e)}
              rules={[
                {
                  required: true,
                  min: 0,
                  message: t('translation:Field_Message.CONTRACT_TOTAL'),
                },
              ]}
            >
              <Input
                style={{ width: '50%' }}
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
              />
            </Form.Item>
          </Col>
        </Row>

        <Row style={{ marginTop: 16 }}>
          <Col span={12}></Col>
          <Col span={24}>
            <Form.Item name="remark" label={t('Label.NOTES')}>
              <TextArea rows={8} />
            </Form.Item>
          </Col>
        </Row>

        <Row className="ma-16" justify="center">
          <Form.Item>
            <Space>
              <Button htmlType="submit" type="primary" loading={loading}>
                {t('Button.CONFIRM')}
              </Button>

              <Button onClick={onCancel}>{t('Button.CANCEL')}</Button>
            </Space>
          </Form.Item>
        </Row>
      </Form>
    </Modal>
  );
};
