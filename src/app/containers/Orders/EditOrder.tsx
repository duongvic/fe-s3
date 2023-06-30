import { Button, Card, Col, Form, Row, Space } from 'antd';
import ContractFormBase from 'app/components/ContractFormBase';
import UserFormBase from 'app/components/UserFormBase';
import * as userSelect from 'app/containers/Users/selectors';
import * as users from 'app/containers/Users/slice';
import moment from 'moment';
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import { autoFillToDurationField, fillValuesToForm } from 'utils/common';
import { noticficationBase } from 'utils/constant';
import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';
import { MODE_CREATE, MODE_EDIT, ORDER_EDIT } from '../Users/constants';
import { usersSaga } from '../Users/saga';
import { EditReviewInstance } from './Edit';
import {
  selectContract,
  selectLoading,
  selectOrder,
  selectOrderIdx,
  selectParams,
  selectNotice,
  selectVmsByUserId,
  // selectInstance,
  // selectService,
} from './selectors';
import * as orders from './slice';
import groupBy from 'lodash/groupBy';
import { selectAccount } from 'app/containers/Auth/selectors';

const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
};

interface Props {
  orderType?: string;
}

export default function EditOrder({ orderType }: Props) {
  useInjectReducer({ key: users.sliceKey, reducer: users.reducer });
  useInjectSaga({ key: users.sliceKey, saga: usersSaga });

  const { orderId }: any = useParams();
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const history = useHistory();
  const { t } = useTranslation(['translation', 'constant']);

  const account = useSelector(selectAccount);
  const paramsReduxOder = useSelector(selectParams);
  const order = useSelector(selectOrder);
  const noticeUser = useSelector(userSelect.selectNotice);
  const errorUser = useSelector(userSelect.selectError);
  const user = useSelector(userSelect.selectUser);
  const contract = useSelector(selectContract);
  const loading = useSelector(selectLoading)?.order;

  const orderIdx: any =
    useSelector(selectOrderIdx) || localStorage.getItem('orderIdx');
  const noticeOrder = useSelector(selectNotice);

  const vmsByUserId = useSelector(selectVmsByUserId);

  const getReview = order => {
    if (order) {
      let review: any = [];

      let arrVmConfigs = order?.order_products ? order?.order_products : [];
      const newVmConfigs: any = Object.values(groupBy(arrVmConfigs, 'idx'));

      newVmConfigs?.forEach(vmConfig => {
        let row: any = {};
        const checkForOS = () => {
          for (let i = 0; i < vmConfig?.length; i++) {
            if (
              vmConfig?.[i].product?.type === 'OS' &&
              vmConfig?.[i].product?.cn === 'image'
            ) {
              return true;
            }
          }
          return false;
        };

        let total: any[] = [];
        vmConfig?.forEach(item => {
          let volumeReview: any[] = [];
          if (item?.product?.type === 'OS')
            row.OS = item?.product?.name + ' - License: ' + item?.quantity;
          else if (item?.data?.iops && parseInt(item?.data?.iops) > 0) {
            item?.data?.volumes?.forEach((vol, index) => {
              volumeReview.push(`- Volume ${index + 1}: ${vol.size} GB`);
              total.push(vol.size);
            });
            row[item?.product?.name] = `Size: ${item?.quantity} GB\nIOPS : ${
              item?.data?.iops
            }\nVolumes:\n${volumeReview.join('\n')}`;
          } else {
            row[item?.product?.name] =
              item?.quantity === 0 ? '-' : item?.quantity;
          }
          row.diskVmID = total.reduce(
            (previousValue, currentValue) => previousValue + currentValue,
            0,
          );
          row.VmCfgId = item?.idx;
        });
        if (checkForOS() === false) {
          row.OS = '-';
        }

        review.push(row);
      });

      if (review.length > 0) {
        const viewRow = review.map(el => {
          const lstVm = vmsByUserId?.data?.find(
            item =>
              (item?.resource?.cpu === el.CPU &&
                item?.resource?.ram === el.MEMORY &&
                item?.resource?.disk === el.diskVmID) ||
              (item?.resource?.cpu === el.CPU &&
                item?.resource?.ram === el.MEMORY &&
                item?.resource?.disk === el.DISK),
          );
          console.log('lstVm', lstVm);
          return {
            VM_ID: lstVm ? lstVm?.uid_ems : null,
            VM_IPAddress:
              lstVm && lstVm?.ip_addresses?.length > 1
                ? `\n${lstVm?.ip_addresses.join('\n')}`
                : lstVm?.ip_addresses,
            ...el,
          };
        });

        console.log('viewRow', viewRow);
        return viewRow;
      }
    }
  };

  const onFinish = values => {
    values.id_issue_date = values.id_issue_date?.format('YYYY-MM-DD');
    values.end_at = values.end_at?.format('YYYY-MM-DD');
    values.start_at = values.start_at?.format('YYYY-MM-DD');

    const {
      remark,
      start_at,
      end_at,
      region_id,
      price,
      // status,
      contract_code,
      duration,
      service_type,
      order_type,
      sale_care,
      pmt_type,
      sale,
      department,
      username,
      email,
      user_type,
      account_type,
      full_name,
      short_name,
      phone_number,
      tax_number,
      id_number,
      id_issue_date,
      id_issue_location,
      address,
      date_of_birth,
      ref_name,
      ref_phone,
      ref_email,
      rep_name,
      rep_phone,
      rep_email,
      company,
      code,
    } = values;

    const user = {
      username,
      email,
      user_type,
      account_type,
      full_name,
      short_name,
      phone_number,
      tax_number,
      id_number,
      id_issue_date,
      id_issue_location,
      address,
      date_of_birth,
      ref_name,
      ref_phone,
      ref_email,
      rep_name,
      rep_phone,
      rep_email,
      company,
    };

    const infoOrder = {
      remark: remark || '',
      duration,
      region_id,
      price,
      service_type,
      order_type,
      sale_care,
      pmt_type,
      code,
    };

    let customer: any = { ...user };
    let contract: any = {};
    contract.code = contract_code;
    contract.start_at = start_at;
    contract.end_at = end_at;
    // contract.status = status;

    let co_sale: any = {};
    co_sale.department = department;
    co_sale.sale = sale;

    let newOrder: any = {
      ...infoOrder,
      // contract: contract,
      contract_code: contract_code,
      start_at: new Date(start_at).toISOString(),
      end_at: new Date(end_at).toISOString(),
      customer: customer,
      co_sale,
    };
    // newOrder.price = Number(newOrder.price);
    newOrder.price = newOrder?.price
      ? parseFloat(newOrder.price.replaceAll(',', ''))
      : 0;
    delete user.username;
    delete user.email;

    // tạm ẩn k upadte user
    // dispatch(users.actions.setData({ userId: order.customer_id, data: user }));
    // dispatch(users.actions.updateUser());

    if (orderType) {
      customer = { ...user, id: order?.customer_id };

      newOrder = {
        ...newOrder,
        customer: customer,
        ref_order_id: Number(orderId),
        ref_order_idx: Number(orderIdx),
        quantity: 1,
        order_type: orderType,
        start_at: start_at,
        end_at: end_at,
      };

      dispatch(orders.actions.setData(newOrder));
      dispatch(orders.actions.extendOrder());
    } else {
      dispatch(orders.actions.setData({ orderId, newInfo: newOrder }));
      dispatch(orders.actions.updateOrder());
    }
  };

  const onFieldsChange = (changedFields, allFields) =>
    autoFillToDurationField(changedFields, allFields, form);

  useEffect(() => {
    if (orderId !== order?.id) {
      dispatch(orders.actions.setData({ orderId }));
      dispatch(orders.actions.getOrder());
      dispatch(orders.actions.loadVmsByUserId());
      dispatch(orders.actions.setReview(getReview(order)));
    }
  }, [dispatch, orderId]);

  useEffect(() => {
    if (order) {
      dispatch(users.actions.setQuery(order?.customer_id));
      dispatch(users.actions.loadUser());
      dispatch(orders.actions.loadVmsByUserId());
      dispatch(orders.actions.contractLoaded({ current: order }));
      dispatch(orders.actions.setReview(getReview(order)));
    }
    return () => {
      dispatch(users.actions.setUser(null));
      dispatch(orders.actions.contractLoaded({ current: null }));
      dispatch(orders.actions.setReview([]));
      dispatch(orders.actions.setMode(MODE_CREATE));
    };
  }, [order, dispatch]);

  useEffect(() => {
    if (noticeUser) {
      noticficationBase('success', noticeUser);
      dispatch(users.actions.setNotice(null));
    }
  }, [noticeUser, dispatch]);

  useEffect(() => {
    if (errorUser) {
      noticficationBase('error', errorUser);
      dispatch(users.actions.setError(null));
    }
  }, [errorUser, dispatch]);

  //fill values to form
  useEffect(() => {
    if (user || contract.current) {
      let values = { ...contract.current, ...contract.current?.co_sale };
      const { start_at, end_at } = values;

      if (start_at) values.start_at = moment(values.start_at);
      if (end_at) values.end_at = moment(values.end_at);

      values = { ...values, ...user, status: values.status };
      const { id_issue_date } = values;

      if (id_issue_date)
        values.id_issue_date = moment(id_issue_date).isValid()
          ? moment(id_issue_date)
          : undefined;

      fillValuesToForm(values, form);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contract.current, user, contract, form]);

  useEffect(() => {
    if (noticeOrder === t('translation:Message.UPDATE_ORDER_SUCCESS')) {
      if (paramsReduxOder) {
        dispatch(orders.actions.queryOrders());
      }
      dispatch(orders.actions.setOrders(null));
    }
  }, [noticeOrder, paramsReduxOder, dispatch, history, t]);
  return (
    <Form
      form={form}
      name="editOrder"
      layout="vertical"
      {...layout}
      labelAlign="left"
      onFinish={onFinish}
      scrollToFirstError={true}
      onFieldsChange={(changedFields, allFields) =>
        onFieldsChange(changedFields, allFields)
      }
    >
      <Row gutter={8}>
        <Col span={12}>
          <Card
            title={t('Title.CUSTOMER_INFO')}
            bordered={false}
            style={{ height: '100%' }}
          >
            <UserFormBase mode={MODE_EDIT} userType={user?.user_type} />
          </Card>
        </Col>
        <Col span={12}>
          <Card
            title={t('Title.SERVICE_INFO')}
            bordered={false}
            style={{ height: '100%' }}
          >
            <ContractFormBase mode={MODE_EDIT} />
          </Card>
        </Col>
      </Row>
      <div style={{ marginTop: 8, whiteSpace: 'pre' }}>
        <EditReviewInstance mode={MODE_EDIT} />
      </div>
      <Row justify="center" style={{ marginTop: 8 }}>
        <Space>
          {account.permission?.includes(ORDER_EDIT) && (
            <Form.Item>
              <Button
                type="primary"
                disabled={order?.liquidated !== true ? false : true}
                htmlType="submit"
                loading={loading}
              >
                {t('constant:Button.UPDATE')}
              </Button>
            </Form.Item>
          )}

          <Form.Item>
            <Button
              type="default"
              onClick={() => history.push('/dashboard/orders')}
            >
              {t('constant:Button.CANCEL')}
            </Button>
          </Form.Item>
        </Space>
      </Row>
    </Form>
  );
}
