import ProTable, { ProColumns } from '@ant-design/pro-table';
import { Button, Typography } from 'antd';
import empty from 'is-empty';
import React, { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useRouteMatch } from 'react-router-dom';
import { fillValuesToForm, formatDateInTable } from 'utils/common';
import { noticficationBase } from 'utils/constant';
import { selectAccount } from '../Auth/selectors';
import { Status, USER_CREATE } from './constants';
import {
  selectData,
  selectError,
  selectLoading,
  selectNotice,
  selectPagination,
  selectParams,
  selectUsers,
} from './selectors';
import { actions, defaultState } from './slice';

const { Link } = Typography;

export interface TableListUser {
  id: number;
  name: string;
  userid: string;
  email: string;
  role: string;
  status: boolean;
  created_on: number;
}

export default function OverviewUsers() {
  const dispatch = useDispatch();
  const match = useRouteMatch();
  const history = useHistory();
  const { t } = useTranslation(['translation', 'constant']);
  const formRef = useRef<any>();

  const loading = useSelector(selectLoading)?.gets;
  const users = useSelector(selectUsers);
  const pagination = useSelector(selectPagination);
  const data = useSelector(selectData);
  const account = useSelector(selectAccount);
  const notice = useSelector(selectNotice);
  const error = useSelector(selectError);
  const paramsRedux = useSelector(selectParams);

  const dataSource = formatDateInTable(users);

  const handleClickAction = (user, index) => {
    dispatch(
      actions.setData({
        data: { status: user.status === true ? false : true },
        userId: user.id,
        index: index,
      }),
    );
    dispatch(actions.updateUser());
  };
  const handleClickUserName = (record, index) => {
    const profile = { ...users[index].profile };
    delete profile.id;
    const user = { ...users[index], ...profile };
    delete user.profile;

    dispatch(actions.setUser(user));
    history.push(`${match.url}/${record.id}`);
    // history.push(`${match.url}/${record?.userid}`);
  };

  useEffect(() => {
    if (notice) {
      noticficationBase('success', notice);
      dispatch(actions.setNotice(null));
    }
  }, [dispatch, notice]);

  useEffect(() => {
    if (error) {
      noticficationBase('error', error);
      dispatch(actions.setError(null));
    }
  }, [dispatch, error]);

  useEffect(() => {
    if (paramsRedux) {
      fillValuesToForm(paramsRedux, formRef.current);
    }
  }, []);

  useEffect(() => {
    if (!users?.length) {
      dispatch(actions.loadUsers());
    }
  }, []);

  const columns: ProColumns<TableListUser>[] = [
    {
      title: 'STT',
      key: 'index',
      width: 60,
      search: false,
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
      title: 'ID',
      dataIndex: 'id',
      search: false,
      hideInTable: true,
      width: 48,
    },
    {
      title: 'Name',
      width: 140,
      key: 'name',
      // dataIndex: 'name',
      render: (text, record, index) => {
        return (
          <Link key={index} onClick={() => handleClickUserName(record, index)}>
            {record?.name}
          </Link>
        );
      },
    },
    {
      title: 'Username',
      width: 140,
      key: 'userid',
      dataIndex: 'userid',
    },
    {
      title: 'Email',
      key: 'email',
      ellipsis: true,
      search: false,
      width: 140,
      dataIndex: 'email',
    },
    {
      title: 'User Role',
      key: 'role',
      dataIndex: 'role',
      width: 140,
      search: false,
    },
    {
      title: 'Status',
      key: 'status',
      dataIndex: 'status',
      search: false,
      width: 140,
      filters: true,
      valueEnum: { ...Status },
    },
    {
      title: 'Creation Date',
      width: 140,
      key: 'created_on',
      dataIndex: 'created_on',
      valueType: 'dateTime',
      search: false,
      sorter: (a, b) => a.created_on - b.created_on,
    },
    // {
    //   title: 'Actions',
    //   width: 180,
    //   key: 'option',
    //   valueType: 'option',
    //   render: (text, record, index) => [
    //     <Button
    //       key={index}
    //       type="primary"
    //       size="small"
    //       danger={record.status === true}
    //       loading={data ? data.index === index : false}
    //       onClick={() => handleClickAction(record, index)}
    //     >
    //       {record.status === true ? false : true}
    //     </Button>,
    //   ],
    // },
  ];

  const onSubmit = params => {
    Object.keys(params).forEach(item => {
      if (params[item] === '') delete params[item];
    });
    if (Object.keys(params).length > 0) {
      dispatch(actions.setPagination({ ...defaultState.pagination }));
      dispatch(actions.setParams({ userid: params.userid }));
      dispatch(actions.queryUserInTable());
    }
  };

  const handleClickReload = () => {
    dispatch(actions.setPagination({ ...defaultState.pagination }));
    dispatch(actions.loadUsers());
  };

  const onReset = () => {
    dispatch(actions.setParams(null));
    handleClickReload();
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
      dispatch(actions.queryUserInTable());
    } else {
      dispatch(actions.loadUsers());
    }
  };
  return (
    <ProTable<TableListUser>
      columns={columns}
      formRef={formRef}
      tableStyle={{ overflow: 'auto' }}
      dataSource={users ? dataSource : []}
      onReset={onReset}
      loading={loading}
      rowKey={record => String(record.id)}
      options={{
        reload: () => handleClickReload(),
        fullScreen: false,
      }}
      onSubmit={params => onSubmit({ ...params })}
      onChange={e => handleChangeCurrentPage(e)}
      pagination={{
        current: pagination.current,
        showQuickJumper: true,
        pageSize: pagination.pageSize,
        total: pagination.total,
      }}
      search={{
        layout: 'vertical',
        defaultCollapsed: true,
      }}
      toolbar={{
        title: account?.permission?.includes(USER_CREATE) && (
          <Button
            type="primary"
            key="launchInstance"
            onClick={() => {
              history.push(`${match.url}/create`);
            }}
          >
            {t('constant:Button.CREATE')}
          </Button>
        ),
      }}
      dateFormatter="string"
    />
  );
}
