import { DownloadOutlined } from '@ant-design/icons';
import ProTable, { ProColumns } from '@ant-design/pro-table';
import { Button } from 'antd';
import ButtonDeleteBase from 'app/components/ButtonDeleteBase';
import { columnsOrders } from 'app/components/constant';
import { selectAccount } from 'app/containers/Auth/selectors';
import { Status, OrderType } from 'app/containers/Orders/constants';
import { useParams } from 'react-router';
import {
  selectData,
  selectLoading,
  selectOrders,
  selectPagination,
  selectParams,
} from 'app/containers/Orders/selectors';
import ModalDowloadCSV from 'app/components/ModalDowloadCSV';
import { actions, defaultState } from 'app/containers/Orders/slice';
import { localPath } from 'path/local';
import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { Link, NavLink, useHistory, useRouteMatch } from 'react-router-dom';
import { fillValuesToForm, formatDateInTable } from 'utils/common';
import { formatMoney } from 'utils/constant';
import {
  ORDER_APPROVE,
  ORDER_DELETE,
  ORDER_EXTEND,
  ORDER_RENEW,
} from '../Users/constants';
// import { stringify } from 'querystring';

export interface TableListOrder {
  key: string;
  id: number;
  code: string;
  region: string;
  customer_id: string;
  order_type: string;
  created_at: number;
  total: string;
  duration: number;
  status: string;
  start_at: number;
  end_at: number;
  approval_step: number;
  extended_orders: any;
  liquidated: boolean;
}

export default function DataviewOrders() {
  const [visible, setVisible] = useState(false);
  const [visibleDownloadModal, setVisibleDownloadModal] = useState(false);
  const { orderId }: any = useParams();

  const loading = useSelector(selectLoading)?.orders;
  const orders = useSelector(selectOrders);
  const pagination = useSelector(selectPagination);
  const account = useSelector(selectAccount);
  const data = useSelector(selectData);
  const paramsRedux = useSelector(selectParams);
  const param = useParams<any>();

  const history = useHistory();
  const dispatch = useDispatch();
  const match = useRouteMatch();
  const ref: any = useRef({});
  const { t } = useTranslation(['translation']);
  const formRef = useRef<any>();

  const dataSource = formatDateInTable(orders);

  // const dataSource = formatOrder(orders);

  function formatOrder(parent) {
    let newParents = formatDateInTable(parent);
    for (var i = 0; i < newParents?.length; i++) {
      let newChildren = formatDateInTable(newParents[i]?.extended_orders);
      newParents[i].extended_orders = newChildren;
    }
    return newParents;
  }

  const closeModal = () => {
    setVisible(false);
  };

  const handleClickReload = () => {
    if (!param.userId) {
      dispatch(actions.setPagination({ ...defaultState.pagination }));
      dispatch(actions.loadOrders());
    } else {
      dispatch(actions.queryOrders());
    }
  };

  const handleClickApprove = (record, index) => {
    dispatch(
      actions.setData({
        orderId: record?.id,
        newInfo: { is_approved: true },
        approve: index,
      }),
    );
    dispatch(actions.approveOrder());
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
      dispatch(actions.queryOrders());
    } else {
      dispatch(actions.loadOrders());
    }
  };

  const handleClickDelete = (record, index) => {
    dispatch(actions.setData({ delete: index, orderId: record?.id }));
    dispatch(actions.deleteOrder());
  };

  const handleClickExtendOrder = (record, index) => {
    history.push(`/dashboard/orders/extend/${record?.id}`);
  };

  const handleClickRenewOrder = (record, index) => {
    history.push(`/dashboard/orders/renew/${record?.id}`);
  };

  const handleClickLiquidation = (record, index) => {
    dispatch(actions.setData({ orderId: record?.id, liquidation: index }));
    dispatch(actions.liquidation());
  };

  const hadleClickCustomerEmail = () => {
    dispatch(actions.setParams(defaultState.params));
  };

  const columns: ProColumns<TableListOrder>[] = [
    {
      title: 'STT',
      key: 'STT',
      width: 60,
      search: false,
      hideInTable: true,
      render: (text, record: any, index) => {
        return (
          <span>
            {' '}
            {pagination?.pageSize * (pagination?.current - 1) + index + 1}
          </span>
        );
      },
    },
    {
      title: t('Title.ORDER_ID'),
      key: `id`,
      dataIndex: 'id',
      width: 60,
      search: false,
      render: (text, record: any, index) => {
        return record?.id;
      },
    },
    {
      title: t('Title.REF_ORDER_ID'),
      key: 'ref_order_id',
      dataIndex: 'ref_order_id',
      width: 60,
      search: false,
      render: (text, record: any, index) => (
        <Link
          to={localPath.orders.order.replace(
            ':orderId',
            record?.ref_order_id > 0 ? record?.ref_order_id : record?.id,
          )}
        >
          {text}
        </Link>
      ),
    },
    {
      title: t('Title.REF_ORDER_IDX'),
      key: 'ref_order_idx',
      dataIndex: 'ref_order_idx',
      width: 60,
      search: false,
    },
    {
      title: t('Title.REGION'),
      key: 'region',
      dataIndex: 'region',
      width: 70,
      search: false,
      render: (text, record: any, index) => {
        return record?.region?.name;
      },
    },
    {
      title: t('Title.SALE_CARE'),
      key: 'sale_care',
      dataIndex: 'sale_care',
      width: 160,
      render: (text, record: any, index) => record?.sale_care,
      ellipsis: true,
    },
    {
      title: t('Title.ORDER_TYPE'),
      key: 'order_type',
      width: 75,
      render: (text, record: any, index) => record?.order_type,
      ellipsis: true,
      dataIndex: 'order_type',
      filters: true,
      valueEnum: { ...OrderType },
    },
    {
      title: t('Title.ORDER_CODE'),
      key: 'code',
      dataIndex: 'code',
      render: (text, record: any, index) => (
        <Link to={localPath.orders.order.replace(':orderId', record?.id)}>
          {text}
        </Link>
      ),
      width: 180,
    },
    {
      title: t('Title.CONTRACT_CODE'),
      key: 'contract_code',
      dataIndex: 'contract_code',
      render: (text, record: any, index) => {
        return <span>{text}</span>;
      },
      width: 140,
    },
    {
      title: t('Title.CUSTOMER_NAME'),
      key: 'customer_name',
      dataIndex: 'customer_name',
      width: 140,
      search: { transform: (value, field, object) => 'order_dtls.name' },
      render: (text, record: any, index) => record?.order_dtl?.name,
    },
    {
      title: t('Title.CUSTOMER_EMAIL'),
      key: 'email',
      dataIndex: 'email',
      width: 140,
      search: { transform: (value, field, object) => 'order_dtls.email' },
      render: (text: any, record: any, index) => {
        return <span>{record?.order_dtl?.email}</span>;
      },
    },
    {
      title: t('Title.CREATED_AT'),
      width: 110,
      key: 'created_at',
      dataIndex: 'created_at',
      valueType: 'date',
      sorter: (a, b) => a.created_at - b.created_at,
      search: false,
    },
    {
      title: t('Title.CONTRACT_VALUE'),
      key: 'price',
      // dataIndex: 'price',
      width: 130,
      search: false,
      render: (text: any, record: any, index) => {
        return <span>{formatMoney(`${record?.price}`)}</span>;
      },
    },
    {
      title: t('Title.START_DATE'),
      width: 100,
      key: 'start_at',
      dataIndex: 'start_at',
      valueType: 'date',
      sorter: (a, b) => a.start_at - b.start_at,
      search: false,
    },
    {
      title: t('Title.END_DATE'),
      width: 100,
      key: 'end_at',
      dataIndex: 'end_at',
      valueType: 'date',
      sorter: (a, b) => a.end_at - b.end_at,
      search: false,
    },
    {
      title: t('Title.CUSTOMER_ID'),
      hideInTable: true,
      key: 'customer_id',
      dataIndex: 'customer_id',
      search: false,
    },
    {
      title: t('Title.STATUS'),
      key: 'status',
      ellipsis: true,
      dataIndex: 'status',
      filters: true,
      valueEnum: { ...Status },
      width: 140,
    },
    {
      title: t('Title.ACTIONS'),
      width: 280,
      key: 'option',
      valueType: 'option',
      render: (text, record, index) => {
        return [
          <>
            {record.liquidated === true && (
              <span className="txt-liq"> {t('Button.LIQUIDATED')}</span>
            )}

            {record.approval_step > 0 && record.liquidated !== true && (
              <Button
                key="5"
                type="primary"
                size="small"
                onClick={() => handleClickLiquidation(record, index)}
                className={checkDisabledActions(record) ? 'no-action' : ''}
              >
                {t('Button.LIQUIDATION')}
              </Button>
            )}
            {record.approval_step > 0 ? (
              <>
                {account?.permission?.includes(ORDER_EXTEND) &&
                  record.liquidated !== true && (
                    <Button
                      key="3"
                      type="primary"
                      size="small"
                      className={
                        checkDisabledActions(record) ? 'no-action' : ''
                      }
                      onClick={() => handleClickExtendOrder(record, index)}
                    >
                      {t('Button.EXTEND')}
                    </Button>
                  )}

                {account?.permission?.includes(ORDER_RENEW) &&
                  record.liquidated !== true && (
                    <Button
                      key="4"
                      type="primary"
                      size="small"
                      className={
                        checkDisabledActions(record) ? 'no-action' : ''
                      }
                      onClick={() => handleClickRenewOrder(record, index)}
                    >
                      {t('Button.RENEW')}
                    </Button>
                  )}
              </>
            ) : (
              <>
                {account?.permission?.includes(ORDER_APPROVE) && (
                  <Button
                    key="1"
                    type="primary"
                    size="small"
                    disabled={record.approval_step >= 1}
                    onClick={() => handleClickApprove(record, index)}
                    loading={data ? index === data.approve : false}
                  >
                    {t('Button.APPROVE')}
                  </Button>
                )}

                {account?.permission?.includes(ORDER_DELETE) && (
                  <ButtonDeleteBase
                    onConfirm={() => handleClickDelete(record, index)}
                    disabled={record.approval_step >= 1}
                    loading={data ? index === data.delete : false}
                    size="small"
                    key="2"
                  />
                )}
              </>
            )}
          </>,
        ];
      },
    },
  ];

  const checkDisabledActions = record => {
    let disabled = true;
    for (let i = 0; i < record?.order_products?.length; i++) {
      if (record?.order_products?.[i].disabled === false) {
        disabled = false;
        break;
      }
    }
    return disabled;
  };

  const more_columns: ProColumns<TableListOrder>[] = [
    {
      title: ' ',
      width: 48,
      search: false,
    },
    {
      title: t('Title.ORDER_ID'),
      key: `id`,
      dataIndex: 'id',
      width: 60,
      search: false,
      render: (text, record: any, index) => {
        return record?.id;
      },
    },
    {
      title: t('Title.REF_ORDER_ID'),
      key: 'ref_order_id',
      dataIndex: 'ref_order_id',
      width: 60,
      search: false,
      render: (text, record: any, index) => (
        <Link to={localPath.orders.order.replace(':orderId', record?.id)}>
          {text}
        </Link>
      ),
    },
    {
      title: t('Title.REF_ORDER_IDX'),
      key: 'ref_order_idx',
      dataIndex: 'ref_order_idx',
      width: 60,
      search: false,
    },
    {
      title: t('Title.REGION'),
      key: 'region',
      dataIndex: 'region',
      width: 70,
      search: false,
      render: (text, record: any, index) => {
        return record?.region?.name;
      },
    },
    {
      title: t('Title.SALE_CARE'),
      key: 'sale_care',
      dataIndex: 'sale_care',
      width: 160,
      render: (text, record: any, index) => record?.sale_care,
      ellipsis: true,
    },
    {
      title: t('Title.ORDER_TYPE'),
      key: 'order_type',
      width: 75,
      render: (text, record: any, index) => record?.order_type,
      ellipsis: true,
      dataIndex: 'order_type',
      filters: true,
      valueEnum: { ...OrderType },
    },
    {
      title: t('Title.ORDER_CODE'),
      key: 'code',
      dataIndex: 'code',
      render: (text, record: any, index) => (
        <Link to={localPath.orders.order.replace(':orderId', record?.id)}>
          {text}
        </Link>
      ),
      width: 180,
    },
    {
      title: t('Title.CONTRACT_CODE'),
      key: 'contract_code',
      dataIndex: 'contract_code',
      render: (text, record: any, index) => {
        return <span>{text}</span>;
      },
      width: 140,
    },
    {
      title: t('Title.CUSTOMER_NAME'),
      key: 'customer_name',
      dataIndex: 'customer_name',
      width: 140,
      search: { transform: (value, field, object) => 'order_dtls.name' },
      render: (text, record: any, index) => record?.order_dtl?.name,
    },
    {
      title: t('Title.CUSTOMER_EMAIL'),
      key: 'email',
      dataIndex: 'email',
      width: 140,
      search: { transform: (value, field, object) => 'order_dtls.email' },
      render: (text: any, record: any, index) => {
        return <span>{record?.order_dtl?.email}</span>;
      },
    },
    {
      title: t('Title.CREATED_AT'),
      width: 110,
      key: 'created_at',
      dataIndex: 'created_at',
      valueType: 'dateTime',
      sorter: (a, b) => a.created_at - b.created_at,
      search: false,
    },
    {
      title: t('Title.CONTRACT_VALUE'),
      key: 'price',
      // dataIndex: 'price',
      width: 130,
      search: false,
      render: (text: any, record: any, index) => {
        return <span>{formatMoney(`${record?.price}`)}</span>;
      },
    },
    {
      title: t('Title.START_DATE'),
      width: 100,
      key: 'start_at',
      dataIndex: 'start_at',
      valueType: 'date',
      sorter: (a, b) => a.start_at - b.start_at,
      search: false,
    },
    {
      title: t('Title.END_DATE'),
      width: 100,
      key: 'end_at',
      dataIndex: 'end_at',
      valueType: 'date',
      sorter: (a, b) => a.end_at - b.end_at,
      search: false,
    },
    {
      title: t('Title.CUSTOMER_ID'),
      hideInTable: true,
      key: 'customer_id',
      dataIndex: 'customer_id',
      search: false,
    },
    {
      title: t('Title.STATUS'),
      key: 'status',
      ellipsis: true,
      dataIndex: 'status',
      filters: true,
      valueEnum: { ...Status },
      width: 140,
    },
    {
      title: t('Title.ACTIONS'),
      width: 280,
      key: 'option',
      valueType: 'option',
      render: (text, record, index) => {
        return [
          <>
            {account?.permission?.includes(ORDER_APPROVE) && (
              <Button
                key="1"
                type="primary"
                size="small"
                disabled={record.approval_step >= 1}
                onClick={() => handleClickApprove(record, index)}
                loading={data ? index === data.approve : false}
              >
                {t('Button.APPROVE')}
              </Button>
            )}

            {account?.permission?.includes(ORDER_DELETE) && (
              <ButtonDeleteBase
                onConfirm={() => handleClickDelete(record, index)}
                loading={data ? index === data.delete : false}
                disabled={record.approval_step >= 1}
                size="small"
                key="2"
              />
            )}
          </>,
        ];
      },
    },
  ];

  // const expandedRowRender = record => {
  //   return (
  //     <ProTable
  //       columns={more_columns}
  //       search={false}
  //       showHeader={false}
  //       dataSource={record.extended_orders}
  //       pagination={false}
  //       toolBarRender={false}
  //       rowClassName={'expanded-stuff'}
  //     />
  //   );
  // };

  const onReset = () => {
    if (param.userId) {
      dispatch(actions.setParams({ customer_id: param.userId }));
    } else {
      dispatch(actions.setParams(null));
    }
    handleClickReload();
  };

  const onSubmit = params => {
    if (Object.keys(params).length > 0) {
      if (param.userId) {
        params.customer_id = param.userId;
      }
      dispatch(actions.setPagination({ ...defaultState.pagination }));
      dispatch(actions.setParams(params));
      dispatch(actions.queryOrders());
      console.log('Params', params);
    }
  };

  const hideDowloadModal = () => {
    setVisibleDownloadModal(false);
  };

  useEffect(() => {
    if (
      !orders?.length &&
      window.location?.pathname === localPath?.orders?.orders
    ) {
      dispatch(actions.loadOrders());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);

  useEffect(() => {
    fillValuesToForm(paramsRedux, formRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // const rowClassName = record => {
  //   return record?.extended_orders?.length > 0
  //     ? ''
  //     : 'table-list-order--hide-expand';
  // };

  return (
    <>
      <ProTable<TableListOrder>
        formRef={formRef}
        className="DataViewOrders"
        columns={columns}
        tableStyle={{ overflow: 'auto' }}
        dataSource={dataSource}
        // expandable={{ expandedRowRender }}
        // rowClassName={rowClassName}
        loading={loading}
        onReset={onReset}
        onSubmit={params => onSubmit(params)}
        rowKey={record => record.key}
        options={{
          reload: () => handleClickReload(),
          fullScreen: false,
        }}
        onChange={e => handleChangeCurrentPage(e)}
        pagination={{
          showQuickJumper: true,
          current: pagination.current,
          pageSize: pagination.pageSize,
          total: pagination.total,
        }}
        search={{
          layout: 'vertical',
          defaultCollapsed: false,
        }}
        toolBarRender={() => [
          <DownloadOutlined
            key="download-csv"
            style={{ fontSize: 18 }}
            onClick={() => setVisibleDownloadModal(true)}
          />,
        ]}
        dateFormatter="string"
        toolbar={{
          title: account?.permission?.includes(ORDER_DELETE) && (
            <Button
              type="primary"
              key="launchInstance"
              onClick={() => {
                // history.push(`${match.url}/create`);
                history.push(`/dashboard/orders/create`);
              }}
            >
              {t('Button.CREATE')}
            </Button>
          ),
        }}
      />
      <ModalDowloadCSV
        visible={visibleDownloadModal}
        arr={columnsOrders}
        data={orders?.map((item: any) => {
          return { ...item.order_dtl, ...item };
        })}
        filename="Orders Report.csv"
        onCancel={hideDowloadModal}
      />
    </>
  );
}
