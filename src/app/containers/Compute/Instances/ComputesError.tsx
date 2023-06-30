import ProTable, { ProColumns } from '@ant-design/pro-table';
import { Button, Typography } from 'antd';
import ButtonDeleteBase from 'app/components/ButtonDeleteBase';
import { selectAccount } from 'app/containers/Auth/selectors';
import ModalSelectZones from 'app/containers/Orders/ModalSelectZones';
import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { formatDateInTable } from 'utils/common';
import { Status } from './constants';
import { selectComputesError, selectData, selectLoading } from './selector';
import { actions } from './slice';

export interface TableListInstance {
  id: number;
  compute_id: number;
  type: string;
  status: string;
  created_at: number;
  action: string;
}

export default function ComputesError() {
  const [visible, setVisible] = useState(false);

  const dispatch = useDispatch();
  const ref: any = useRef({});
  const { t } = useTranslation('constant');

  const computesError = useSelector(selectComputesError);
  const loading = useSelector(selectLoading).computesError;
  const data = useSelector(selectData);
  const account = useSelector(selectAccount);

  const dataSource = formatDateInTable(computesError);

  useEffect(() => {
    dispatch(actions.getComputesError());
  }, [dispatch]);

  const handleClickDelete = (record, index) => {
    // let newC = [...computesError];
    // newC.splice(index, 1);
    // console.log(newC);
    dispatch(
      actions.setData({
        computeId: record.compute_id,
        index,
        action: 'DELETE',
      }),
    );
    dispatch(actions.deleteCompute());
  };

  const closeModal = () => {
    setVisible(false);
  };

  const handleClickDeploy = (record, index) => {
    setVisible(true);
    ref.current = { record, index };
  };

  const deployCompute = zone => {
    const { record, index } = ref.current;
    dispatch(
      actions.setData({
        compute_id: record?.id,
        action: 'REDEPLOY',
        index,
        zone: zone,
      }),
    );
    dispatch(actions.reDeployCompute());
    setVisible(false);
  };

  const columns: ProColumns<TableListInstance>[] = [
    {
      title: t('Title.COMPUTE_ID'),
      dataIndex: 'id',
      width: 90,
      render: (text, record, index) => (
        <Link to={`/dashboard/instances/${text}`}>{text}</Link>
      ),
      sorter: (a, b) => a.compute_id - b.compute_id,
    },
    {
      title: t('Title.NAME'),
      dataIndex: 'name',
      ellipsis: true,
      width: 70,
    },
    {
      title: t('Title.ORDER_ID'),
      dataIndex: 'order_id',
      width: 70,
    },
    {
      title: t('Title.ORDER_EXTEND'),
      dataIndex: 'order_idx',
      width: 70,
    },
    {
      title: t('Title.CREATED_AT'),
      width: 140,
      key: 'createDate',
      dataIndex: 'created_at',
      valueType: 'dateTime',
      sorter: (a, b) => a.created_at - b.created_at,
    },
    {
      title: t('Title.STATUS'),
      dataIndex: 'status',
      initialValue: 'all',
      filters: true,
      width: 90,
      valueEnum: {
        ...Status,
      },
    },
    {
      title: t('Title.MESSAGE'),
      dataIndex: 'error_log',
      width: 350,
      render: (text, record: any, index) => {
        return (
          <Typography.Text type="danger">
            {record.error_log?.message}
          </Typography.Text>
        );
      },
    },
    {
      title: t('Title.ACTION'),
      width: 180,
      key: 'option',
      valueType: 'option',
      render: (text, record, index) => {
        if (
          ['ADMIN', 'IT_ADMIN'].some(ele => ele === account?.role?.toUpperCase())
        ) {
          return [
            <Button
              key={`deploy${index}`}
              type="primary"
              disabled={
                data
                  ? data.index === index && data.action !== 'REDEPLOY'
                  : false
              }
              loading={
                data
                  ? data.index === index && data.action === 'REDEPLOY'
                  : false
              }
              onClick={() => {
                handleClickDeploy(record, index);
              }}
            >
              {t('Button.DEPLOY')}
            </Button>,
            <ButtonDeleteBase
              key={`delete${index}`}
              disabled={
                data ? data.index === index && data.action !== 'DELETE' : false
              }
              loading={
                data ? data.index === index && data.action === 'DELETE' : false
              }
              onConfirm={() => {
                handleClickDelete(record, index);
              }}
            />,
          ];
        }
      },
    },
  ];

  return (
    <>
      <ProTable<TableListInstance>
        columns={columns}
        dataSource={dataSource}
        tableStyle={{ overflow: 'scroll' }}
        loading={loading}
        rowKey={record => String(record.id)}
        options={{
          reload: () => dispatch(actions.getComputesError()),
          fullScreen: false,
        }}
        pagination={{
          showQuickJumper: true,
          pageSize: 10,
        }}
        search={{
          layout: 'vertical',
          defaultCollapsed: true,
        }}
        dateFormatter="string"
      />
      <ModalSelectZones
        visible={visible}
        deployCompute={deployCompute}
        closeModal={closeModal}
      />
    </>
  );
}
