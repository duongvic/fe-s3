import { QuestionCircleOutlined } from '@ant-design/icons';
import ProTable, { ProColumns } from '@ant-design/pro-table';
import { Button, Card, Popconfirm, Row, Space, Typography } from 'antd';
import { selectAccount } from 'app/containers/Auth/selectors';
import { ordersSaga } from 'app/containers/Orders/saga';
import { selectVmCfg } from 'app/containers/Orders/selectors';
import * as orders from 'app/containers/Orders/slice';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink, useParams } from 'react-router-dom';
import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';
import { Action, Status } from '../constants';
import {
  selectCompute,
  selectData,
  selectLoading,
  selectNotice,
} from '../selector';
import { actions } from '../slice';
import { ModalEditInstance } from './ModalEditInstance';
import { MomorizedMonitorLog } from './MonitorLog';

interface Instance {
  id: number;
  name: string;
  customer_id: string;
  access_ipv4: string;
  region_name: string;
  status: string;
  created_at: string;
  start_at: string;
  end_at: string;
  cpu: number;
  memory: number;
  disk: number;
}

export default function OverviewInstance() {
  useInjectReducer({ key: orders.sliceKey, reducer: orders.reducer });
  useInjectSaga({ key: orders.sliceKey, saga: ordersSaga });

  const [visible, setVisible] = useState(false);

  const dispatch = useDispatch();
  const { instanceId }: any = useParams();
  const { t } = useTranslation(['translation', 'constant']);

  const compute = useSelector(selectCompute);
  const loading = useSelector(selectLoading)?.compute;
  const data = useSelector(selectData);
  const orderId = compute?.order_id;
  const orderIdx = compute?.order_idx;
  const notice = useSelector(selectNotice);
  const account = useSelector(selectAccount);
  const vmCfg = useSelector(selectVmCfg);

  const { order_id, order_idx } = compute
    ? compute
    : { order_id: '', order_idx: '' };
  const computeAddImage = JSON.parse(JSON.stringify(compute));
  if (compute && vmCfg) {
    computeAddImage.vm_cfg.image = vmCfg[7]?.name;
  }

  const loadCompute = () => {
    dispatch(actions.setData({ instanceId }));
    dispatch(actions.loadCompute());
  };

  const handleAction = action => {
    dispatch(actions.setData({ action: action, computeId: instanceId }));
    dispatch(actions.loadAction());
  };

  const handleClickExtend = () => {
    dispatch(orders.actions.setOrderIdx(orderIdx));
    localStorage.setItem('orderIdx', JSON.stringify(orderIdx));
  };

  const columns: ProColumns<Instance>[] = [
    {
      title: t('constant:Title.REGION'),
      key: 'region',
      width: 70,
      dataIndex: 'region_name',
    },
    {
      title: t('constant:Title.INSTANCE_NAME'),
      key: 'name',
      ellipsis: true,
      width: 150,
      dataIndex: 'name',
    },
    {
      title: t('constant:Title.RESOURCES'),
      width: 100,
      dataIndex: 'vm_cfg',
      key: 'vm-cfg',
      render: (text: any, record, index) => {
        return Object.keys(text).map(item => (
          <>
            <Typography.Text key={item}>
              {item}: {text?.[item]}{' '}
              {['vcpu', 'image'].every(str => str !== item) && (
                <Typography.Text>GB</Typography.Text>
              )}
              <br />
            </Typography.Text>
          </>
        ));
      },
    },
    {
      title: t('constant:Title.CREATE_DATE'),
      width: 140,
      key: 'createDate',
      dataIndex: 'created_at',
      valueType: 'dateTime',
    },
    {
      title: t('constant:Title.START_DATE'),
      width: 80,
      key: 'startDate',
      dataIndex: 'start_at',
      valueType: 'date',
    },
    {
      title: t('constant:Title.END_DATE'),
      width: 80,
      key: 'endDate',
      dataIndex: 'end_at',
      valueType: 'date',
    },
    {
      title: t('constant:Title.STATUS'),
      key: 'status',
      dataIndex: 'status',
      width: 110,
      initialValue: 'running',
      filters: false,
      valueEnum: Status,
    },
    {
      title: t('constant:Title.PUBLIC_IPV4'),
      key: 'ip',
      width: 100,
      dataIndex: 'access_ipv4',
      copyable: true,
    },
    {
      title: t('constant:Title.BACKEND_ID'),
      key: 'backend_id',
      width: 150,
      dataIndex: 'backend_id',
      copyable: true,
    },
  ];

  const filterComlumn = () => {
    if (['USER', 'SALE_ADMIN'].includes(account?.role?.toUpperCase())) {
      return columns.slice(0, columns.length - 1);
    }
    return columns;
  };

  const hideModal = () => {
    setVisible(false);
  };

  useEffect(() => {
    if (instanceId !== compute?.id) {
      loadCompute();
    }
  }, [dispatch, instanceId]);

  useEffect(() => {
    if (order_id && order_idx) {
      dispatch(orders.actions.setData({ order_id, order_idx }));
      dispatch(orders.actions.getVmCfg());
    }
  }, [dispatch, order_id, order_idx]);

  useEffect(() => {
    if (notice === t('Message.ACTION_COMPLETED')) {
      loadCompute();
    } else if (notice === t('Message.UPDATE_INSTANCE_SUCCESS')) {
      setVisible(false);
    }
  }, [notice]);

  useEffect(() => {
    if (window.location.hash === '#edit') {
      setVisible(true);
    }
  }, []);

  return (
    <>
      <ProTable<Instance>
        columns={filterComlumn()}
        dataSource={[computeAddImage]}
        rowKey={record => String(record?.id)}
        tableStyle={{ overflow: 'scroll' }}
        loading={loading}
        pagination={false}
        search={false}
        dateFormatter="string"
        toolbar={{
          title: t('constant:Title.INFORMATION'),
        }}
        options={{ reload: () => loadCompute() }}
      />
      <Card
        title={t('constant:Title.MANAGEMENT')}
        className="management"
        bordered={true}
        headStyle={{ borderBottom: 'none' }}
        style={{ marginTop: 16 }}
      >
        <Space>
          {compute?.status !== 'ACTIVE' && (
            <Button
              type="primary"
              loading={data ? data.action === Action.START : false}
              onClick={() => handleAction(Action.START)}
            >
              {t('constant:Button.START')}
            </Button>
          )}
          {compute?.status !== 'SHUTOFF' && (
            <Popconfirm
              placement="bottom"
              title={t('Message.CONFIRM_SHUTDOWN')}
              onConfirm={() => handleAction(Action.STOP)}
              icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
              okText={t('constant:Button.OK')}
              cancelText={t('constant:Button.CANCEL')}
            >
              <Button
                type="primary"
                loading={data ? data.action === Action.STOP : false}
                danger
              >
                {t('constant:Button.SHUTDOWN')}
              </Button>
            </Popconfirm>
          )}
          <Button
            loading={data ? data.action === Action.REBOOT : false}
            onClick={() => handleAction(Action.REBOOT)}
          >
            {t('constant:Button.REBOOT')}
          </Button>
          {!['ACTIVE', 'SHUTOFF'].includes(compute?.status) && (
            <Button
              type="primary"
              loading={data ? data.action === Action.RESUME : false}
              ghost
              onClick={() => handleAction(Action.RESUME)}
            >
              {t('constant:Button.RESUME')}
            </Button>
          )}
          <Button
            danger
            loading={data ? data.action === Action.SUSPEND : false}
            onClick={() => handleAction(Action.SUSPEND)}
          >
            {t('constant:Button.SUSPEND')}
          </Button>
          <Button type="primary" ghost onClick={() => setVisible(true)}>
            {t('constant:Button.EDIT_INSTANCE')}
          </Button>
        </Space>
      </Card>
      {['ADMIN', 'SALE_ADMIN'].includes(account?.role?.toUpperCase()) && (
        <Card
          title={t('constant:Title.PACKAGE')}
          className="package"
          bordered={true}
          headStyle={{ borderBottom: 'none' }}
          style={{ marginTop: 16 }}
        >
          <Space>
            <Button type="primary" onClick={handleClickExtend}>
              <NavLink to={`/dashboard/orders/expire/${orderId}`}>
                {t('Button.EXTEND')}
              </NavLink>
            </Button>
            <Button onClick={handleClickExtend}>
              <NavLink to={`/dashboard/orders/extend/${orderId}`}>
                {t('Button.UPGRADE')}
              </NavLink>
            </Button>
          </Space>
        </Card>
      )}
      <br />
      <br />
      <Row justify="center">
        <Typography.Title level={3}>Monitor</Typography.Title>
      </Row>
      <MomorizedMonitorLog />
      {/* <MemorizedMonitor /> */}
      <ModalEditInstance visible={visible} onCancel={hideModal} />
    </>
  );
}
