import ProTable, { ProColumns } from '@ant-design/pro-table';
import { Button, Typography } from 'antd';
import ButtonDeleteBase from 'app/components/ButtonDeleteBase';
import React, { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useHistory, useRouteMatch } from 'react-router-dom';
import { fillValuesToForm } from 'utils/common';
import { formatPrice } from 'utils/formatPrice';
import { PRODUCT_CREATE, PRODUCT_DELETE } from '../Users/constants';
import { RESOURCE_TYPE } from './constants';
import { selectAccount } from 'app/containers/Auth/selectors';

import {
  selectData,
  selectLoading,
  selectPagination,
  selectParams,
  selectProducts,
} from './selectors';
import { actions, defaultState } from './slice';

export interface PropductsInterFace {
  id: number;
  name: string;
  type: string;
  cn: string;
  price: string;
  maintenance_fee: string;
  init_fee: string;
}

export default function Overview() {
  const dispatch = useDispatch();
  const history = useHistory();
  const match = useRouteMatch();
  const formRef = useRef<any>();
  const { t } = useTranslation(['translation', 'constant']);

  const products = useSelector(selectProducts);
  const account = useSelector(selectAccount);
  const loading = useSelector(selectLoading)?.get;
  const pagination = useSelector(selectPagination);
  const data = useSelector(selectData);
  const paramsRedux = useSelector(selectParams);

  // const dataSource = formatDateInTable(products);

  useEffect(() => {
    if (!products) {
      dispatch(actions.loadProducts());
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (paramsRedux) {
      fillValuesToForm(paramsRedux, formRef.current);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const deleteProduct = (record, index) => {
    dispatch(actions.setData({ productId: record?.id, tableIndex: index }));
    dispatch(actions.deleteProduct());
  };

  const handleClickReload = () => {
    dispatch(actions.setPagination({ ...defaultState.pagination }));
    dispatch(actions.loadProducts());
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
      dispatch(actions.queryProducts());
    } else {
      dispatch(actions.loadProducts());
    }
  };

  const onReset = () => {
    dispatch(actions.setParams(null));
    handleClickReload();
  };

  const onSubmit = params => {
    if (Object.keys(params).length > 0) {
      dispatch(actions.setPagination({ ...defaultState.pagination }));
      dispatch(actions.setParams(params));
      dispatch(actions.queryProducts());
    }
  };

  const columns: ProColumns<PropductsInterFace>[] = [
    {
      title: 'STT',
      key: 'index',
      search: false,
      width: 48,
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
      title: t('translation:Title.ID'),
      key: 'product_id',
      search: false,
      width: 48,
      render: (text, record: any, index) => {
        return record?.id;
      },
    },
    {
      title: t('translation:Title.NAME'),
      // dataIndex: 'name',
      key: 'name',
      render: (text, record: any, index) => (
        <Link
          to={`${match.url}/${record?.id}`}
          onClick={() => dispatch(actions.setProduct(record))}
        >
          {/* {text} */}
          {record?.name}
        </Link>
      ),
    },
    {
      title: t('translation:Title.TYPE'),
      key: 'type',
      dataIndex: 'type',
      ellipsis: true,
      filters: true,
      valueEnum: { ...RESOURCE_TYPE },
    },
    {
      title: t('constant:Label.CN'),
      key: 'cn',
      // dataIndex: 'cn',
      render: (text, record: any, index) => {
        return record?.cn;
      },
    },
    {
      title: t('translation:Title.PRICE'),
      // dataIndex: 'price',
      key: 'price',
      render: (text, record, index) => (
        <span>{formatPrice(record?.maintenance_fee + record?.init_fee)}</span>
      ),
    },
    {
      title: t('translation:Title.UNIT'),
      key: 'unit_name',
      // dataIndex: 'unit',
      search: false,
      render: (text, record: any, index) => (
        <Typography.Text>{record.unit?.name}</Typography.Text>
      ),
    },
    {
      title: t('translation:Title.ACTION'),
      width: 100,
      key: 'option',
      valueType: 'option',
      hideInTable: account?.permission?.includes(PRODUCT_DELETE) ? false : true,
      render: (text: any, record, index) => (
        <>
          {account.permission?.includes(PRODUCT_DELETE) && (
            <ButtonDeleteBase
              key="2"
              loading={data ? index === data.tableIndex : false}
              onConfirm={() => deleteProduct(record, index)}
            />
          )}
        </>
      ),
    },
  ];

  return (
    <ProTable<PropductsInterFace>
      formRef={formRef}
      columns={columns}
      tableStyle={{ overflow: 'scroll' }}
      dataSource={products ? products : []}
      onReset={onReset}
      onSubmit={params => onSubmit(params)}
      loading={loading}
      rowKey={record => String(record.id)}
      options={{
        reload: () => handleClickReload(),
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
      toolbar={{
        title: account?.permission?.includes(PRODUCT_CREATE) && (
          <Button
            type="primary"
            key="createProducts"
            onClick={() => history.push(`${match.url}/create`)}
          >
            {t('translation:Button.CREATE')}
          </Button>
        ),
      }}
      dateFormatter="string"
    />
  );
}
