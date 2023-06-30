import { DownloadOutlined } from '@ant-design/icons';
import ProTable, { ProColumns } from '@ant-design/pro-table';
import { Button, Select, Space, Typography } from 'antd';
import ButtonDeleteBase from 'app/components/ButtonDeleteBase';
import { columnsInstaces } from 'app/components/constant';
import { selectAccount } from 'app/containers/Auth/selectors';
import { Status } from 'app/containers/Compute/Instances/constants';
import { instancesSaga } from 'app/containers/Compute/Instances/saga';
import {
  selectComputes,
  selectData,
  selectLoading,
  selectPagination,
  selectParams,
} from 'app/containers/Compute/Instances/selector';
import {
  actions,
  defaultState,
  reducer,
  sliceKey,
} from 'app/containers/Compute/Instances/slice';
import { localPath } from 'path/local';
import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink, useHistory, useRouteMatch } from 'react-router-dom';
import { fillValuesToForm, formatDateInTable } from 'utils/common';
import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';
import * as securityGroups from '../Security/slice';
import ModalDowloadCSV from 'app/components/ModalDowloadCSV';
// import { ModalEditInstance } from './DetailsInstance/ModalEditInstance';

const { Link } = Typography;

export interface TableListInstance {
  id: number;
  name: string;
  status: string;
  created_at: number;
  start_at: number;
  end_at: number;
  region_id: number;
  region_name: string;
  access_ipv4: string;
  customer_name: string;
}

export default function DataviewInstances() {
  useInjectReducer({
    key: securityGroups.sliceKey,
    reducer: securityGroups.reducer,
  });
  useInjectReducer({
    key: sliceKey,
    reducer: reducer,
  });
  useInjectSaga({ key: sliceKey, saga: instancesSaga });

  const [visibleDownloadModal, setVisibleDownloadModal] = useState(false);

  const history = useHistory();
  const match = useRouteMatch();
  const dispatch = useDispatch();
  const { t } = useTranslation(['constant', 'translation']);

  const computes = useSelector(selectComputes);
  const loading = useSelector(selectLoading)?.computes;
  const data = useSelector(selectData);
  const pagination = useSelector(selectPagination);
  const paramsRedux = useSelector(selectParams);
  const account = useSelector(selectAccount);

  const formRef = useRef<any>();

  const dataSource = formatDateInTable(computes);
  const handleClickDelete = (record, index) => {
    dispatch(actions.setData({ computeId: record.id, index }));
    dispatch(actions.deleteCompute());
  };

  const handleClickComputeName = (record, index) => {
    const compute = record;
    dispatch(actions.computeLoaded(compute));
    dispatch(securityGroups.actions.setSecurityGroups([]));
    history.push(
      `${localPath.instances.instance}`.replace(':instanceId', compute.id),
    );
  };

  const getComputes = () => {
    if (account?.role?.toUpperCase() !== 'USER') {
      dispatch(actions.loadComputes());
    } else {
      dispatch(actions.loadComputesFilterRoleUser());
    }
  };

  const handleClickReload = () => {
    dispatch(actions.setPagination({ ...defaultState.pagination }));
    getComputes();
  };

  const handleChangeCurrentPage = params => {
    dispatch(
      actions.setPagination({
        ...pagination,
        current: params.current,
        pageSize: params.pageSize,
      }),
    );
    if (paramsRedux) {
      if (paramsRedux?.contract_code) {
        dispatch(actions.queryInstancesByContractCode());
      } else {
        dispatch(actions.queryInstances());
      }
    } else {
      getComputes();
    }
  };

  const editInstance = instanceId => {
    history.push(
      `${localPath.instances.instance.replace(':instanceId', instanceId)}#edit`,
    );
  };

  const handleClickUserEmail = () => {
    dispatch(actions.setParams(defaultState.params));
  };

  const columns: ProColumns<TableListInstance>[] = [
    {
      title: t('Title.ID'),
      dataIndex: 'id',
      key: 'id',
      width: 48,
      search: false,
    },
    {
      title: t('Title.CONTRACT_CODE'),
      key: 'contract_code',
      width: 48,
      hideInTable: true,
    },
    {
      title: t('Title.ORDER_ID'),
      width: 60,
      key: 'order_id',
      dataIndex: 'order_id',
      render: (text: any, record, index) => (
        <NavLink to={localPath.orders.order.replace(':orderId', text)}>
          {text}
        </NavLink>
      ),
    },
    {
      title: t('Title.REGION'),
      dataIndex: 'region_name',
      key: 'region_name',
      width: 61,
      search: false,
    },
    {
      title: t('Title.NAME'),
      key: 'name',
      dataIndex: 'name',
      width: 140,
      render: (text, record, index) => (
        <Link onClick={() => handleClickComputeName(record, index)}>
          {text}
        </Link>
      ),
      search: false,
    },
    {
      title: t('Title.CREATED_AT'),
      width: 140,
      search: false,
      key: 'created_at',
      dataIndex: 'created_at',
      valueType: 'dateTime',
      sorter: (a, b) => a.created_at - b.created_at,
    },
    {
      title: t('Title.START_DATE'),
      width: 140,
      search: false,
      key: 'start_at',
      dataIndex: 'start_at',
      valueType: 'date',
      sorter: (a, b) => a.start_at - b.start_at,
    },
    {
      title: t('Title.END_DATE'),
      width: 140,
      search: false,
      key: 'end_at',
      dataIndex: 'end_at',
      valueType: 'date',
      sorter: (a, b) => a.end_at - b.end_at,
    },
    {
      title: t('Title.STATUS'),
      dataIndex: 'status',
      key: 'status',
      width: 110,
      filters: true,
      valueEnum: {
        ...Status,
      },
    },
    {
      title: t('Title.PUBLIC_IPV4'),
      dataIndex: 'access_ipv4',
      key: 'access_ipv4',
      width: 140,
      ellipsis: true,
      copyable: true,
    },
    {
      title: t('Title.USER_EMAIL'),
      width: 190,
      copyable: true,
      key: 'target_user_email',
      dataIndex: 'customer_name',
      render: (text, record: any, index) => {
        return (
          <NavLink
            className="nav-link"
            onClick={handleClickUserEmail}
            to={`${localPath.users.user.replace(
              ':username',
              record?.customer_id,
            )}#instances`}
          >
            {text}
          </NavLink>
        );
      },
    },
    {
      title: t('Title.USER_ID'),
      hideInTable: true,
      key: 'target_user_id',
    },
    {
      title: t('Title.ACTIONS'),
      width: 180,
      key: 'option',
      valueType: 'option',
      render: (text, record: any, index) => {
        return [
          ['SALE_ADMIN', 'ADMIN'].includes(account?.role?.toUpperCase()) && (
            <Select
              placeholder="Action"
              key="select"
              onSelect={(e: any) =>
                history.push(e.replace(':orderId', record.order_id))
              }
              size="small"
            >
              <Select.Option value={localPath.orders.extend}>
                {t('translation:Button.EXTEND')}
              </Select.Option>
              <Select.Option value={localPath.orders.upgrade}>
                {t('translation:Button.UPGRADE')}
              </Select.Option>
            </Select>
          ),
          <Button
            type="default"
            size="small"
            onClick={() => editInstance(record.id)}
          >
            Edit
          </Button>,
          ['ADMIN', 'IT_ADMIN'].includes(account?.role?.toUpperCase()) && (
            <ButtonDeleteBase
              key={index}
              loading={data ? data.index === index : false}
              onConfirm={() => {
                handleClickDelete(record, index);
              }}
            />
          ),
        ];
      },
    },
  ];

  useEffect(() => {
    if (
      [localPath.instances.instances, localPath.dashboard].includes(
        window.location.pathname,
      ) &&
      !computes.length
    ) {
      if (account?.role?.toUpperCase() === 'USER') {
        dispatch(actions.loadComputesFilterRoleUser());
      } else {
        dispatch(actions.loadComputes());
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    fillValuesToForm(paramsRedux, formRef.current);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paramsRedux?.target_user_id]);

  const checkColumns = () => {
    if (account?.role?.toUpperCase() === 'USER') {
      return [...columns.slice(0, 1), ...columns.slice(3, 10)];
    } else return columns;
  };

  const onReset = () => {
    dispatch(actions.setParams(null));
    handleClickReload();
  };

  const onSubmit = params => {
    if (Object.keys(params).length > 0) {
      dispatch(actions.setPagination({ ...defaultState.pagination }));
      dispatch(actions.setParams(params));
      if (params.contract_code) {
        dispatch(actions.queryInstancesByContractCode());
      } else {
        dispatch(actions.queryInstances());
      }
    }
  };

  const hideDowloadModal = () => {
    setVisibleDownloadModal(false);
  };

  return (
    <>
      <ProTable<TableListInstance>
        formRef={formRef}
        columns={checkColumns()}
        tableStyle={{ overflow: 'scroll' }}
        dataSource={dataSource}
        loading={loading}
        rowKey={record => String(record.id)}
        onReset={onReset}
        onSubmit={onSubmit}
        options={{
          reload: () => {
            if (account?.role?.toUpperCase() !== 'USER') {
              handleClickReload();
            } else {
              dispatch(actions.loadComputesFilterRoleUser());
            }
          },
          fullScreen: false,
        }}
        onChange={e => handleChangeCurrentPage(e)}
        pagination={{
          current: pagination.current,
          showQuickJumper: true,
          pageSize: pagination.pageSize,
          total: pagination.total,
        }}
        search={{
          layout: 'vertical',
          defaultCollapsed: false,
        }}
        dateFormatter="string"
        toolBarRender={() => [
          <DownloadOutlined
            key="download-csv"
            style={{ fontSize: 18 }}
            onClick={() => setVisibleDownloadModal(true)}
          />,
        ]}
        toolbar={{
          title: (
            <Space key="button">
              {['ADMIN', 'IT_ADMIN'].includes(account?.role?.toUpperCase()) && (
                <Button
                  type="primary"
                  key="computeError"
                  danger
                  onClick={() => {
                    history.push(`${match.url}/error`);
                  }}
                >
                  {t('Button.INSTANCE_ERROR')}
                </Button>
              )}
            </Space>
          ),
        }}
      />
      <ModalDowloadCSV
        visible={visibleDownloadModal}
        arr={columnsInstaces}
        data={computes}
        filename="Instances Report.csv"
        onCancel={hideDowloadModal}
      />
    </>
  );
}
