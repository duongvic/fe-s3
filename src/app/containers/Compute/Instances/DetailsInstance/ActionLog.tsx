import ProTable, { ProColumns } from '@ant-design/pro-table';
import { Typography } from 'antd';
import { selectAccount } from 'app/containers/Auth/selectors';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router';
import { Status } from '../constants';
import { selectActionLog, selectLoading } from '../selector';
import { actions } from '../slice';

interface TableListActionLog {
  key: number;
  action: string;
  created_at: number;
  user: string;
  error: string;
  status: string;
  request_user_email: string;
}

const tableListDataSource: TableListActionLog[] = [];

interface ParamTypes {
  instanceId: string;
}

export default function ActionLog() {
  const { instanceId } = useParams<ParamTypes>();

  const actionLog = useSelector(selectActionLog);
  const loading = useSelector(selectLoading);
  const account = useSelector(selectAccount);

  const dispatch = useDispatch();

  const getActionLog = () => {
    dispatch(actions.setData({ instanceId }));
    dispatch(actions.getActionLog());
  };

  const { t } = useTranslation('constant');
  const columns: ProColumns<TableListActionLog>[] = [
    {
      title: t('Title.CREATED_AT'),
      width: 120,
      key: 'since',
      dataIndex: 'created_at',
      valueType: 'dateTime',
      sorter: (a, b) => a.created_at - b.created_at,
    },
    {
      title: t('Title.USER'),
      width: 70,
      dataIndex: 'request_user_email',
    },
    {
      title: t('Title.ACTION'),
      width: 200,
      render: (text, record: any, index) => {
        return (
          <Typography.Text>{record?.message.toUpperCase()}</Typography.Text>
        );
      },
    },
    {
      title: t('Title.STATUS'),
      dataIndex: 'status',
      width: 140,
      initialValue: 'all',
      filters: true,
      valueEnum: {
        ...Status,
      },
    },
    {
      title: t('Title.DETAIL'),
      render: (text, record: any, index) => (
        <Typography.Text type="danger">
          {record.contents?.error}
        </Typography.Text>
      ),
    },
  ];

  return (
    <>
      <ProTable<TableListActionLog>
        tableStyle={{ overflow: 'scroll' }}
        columns={
          account?.role?.toUpperCase() !== 'USER'
            ? columns
            : [...columns.slice(0, 1), ...columns.slice(2)]
        }
        dataSource={actionLog}
        loading={loading}
        options={{
          reload: getActionLog,
        }}
        // request={(params, sorter, filter) => {
        //   return Promise.resolve({
        //     data: tableListDataSource,
        //     success: true,
        //   });
        // }}
        rowKey="key"
        pagination={{
          showQuickJumper: true,
          pageSize: 10,
        }}
        search={false}
        dateFormatter="string"
      />
    </>
  );
}
