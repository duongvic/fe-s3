import ProTable, { ProColumns } from '@ant-design/pro-table';
import { Button } from 'antd';
import ButtonDeleteBase from 'app/components/ButtonDeleteBase';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';
import { securityGroupsSaga } from '../../Security/saga';
import {
  selectData,
  selectError,
  selectLoading,
  selectNotice,
  selectSecurityGroups,
} from '../../Security/selector';
import { actions, reducer, sliceKey } from '../../Security/slice';
import SecurityRuleForm from './SecurityRuleForm';

interface TableListSecurity {
  id: number;
  key: number;
  direction: string;
  etherType: string;
  IP: string;
  port: string;
  remoteIP: string;
}
const tableListDataSource: TableListSecurity[] = [];

export default function SecurityInstance() {
  useInjectReducer({ key: sliceKey, reducer: reducer });
  useInjectSaga({ key: sliceKey, saga: securityGroupsSaga });

  const [showForm, setshowForm] = useState(false);

  const dispatch = useDispatch();
  const { instanceId }: any = useParams();
  const { t } = useTranslation('constant');

  const loading = useSelector(selectLoading);
  const securityGroups = useSelector(selectSecurityGroups);
  const data = useSelector(selectData);
  const error = useSelector(selectError);
  const notice = useSelector(selectNotice);

  useEffect(() => {
    return () => {
      dispatch(actions.setSecurityRule(null));
    };
  }, []);

  const columns: ProColumns<TableListSecurity>[] = [
    {
      title: t('Title.NO'),
      dataIndex: 'index',
      valueType: 'indexBorder',
      width: 48,
    },
    {
      title: t('Title.DIRECTION'),
      dataIndex: 'direction',
    },
    {
      title: t('Title.ETHER_TYPE'),
      dataIndex: 'ether_type',
    },
    {
      title: t('Title.IP_PROTOCOL'),
      dataIndex: 'protocol',
    },
    {
      title: t('Title.PORT_RANGE'),
      dataIndex: 'port_range',
    },
    {
      title: t('Title.REMOTE_IP'),
      dataIndex: 'source_ip',
    },
    {
      title: t('Title.ACTIONS'),
      width: 180,
      key: 'option',
      valueType: 'option',
      render: (text, record, index) => [
        <ButtonDeleteBase
          key={`delete${index}`}
          onConfirm={() => handleDelete(record, index)}
          loading={data ? data.index === index : false}
        />,
      ],
    },
  ];

  const getSecurityRules = () => {
    dispatch(actions.setData(instanceId));
    dispatch(actions.loadSecurityGroups());
  }

  const handleDelete = (record, index) => {
    dispatch(
      actions.setData({
        computeId: instanceId,
        ruleId: record.id,
        index: index,
      }),
    );
    dispatch(actions.deleteSecurityGroupRule());
  };
  return (
    <>
      <ProTable<TableListSecurity>
        loading={loading.overview}
        columns={columns}
        rowKey={record => String(record.id)}
        // request={(params, sorter, filter) => {
        //   // console.log(params, sorter, filter);
        //   return Promise.resolve({
        //     data: tableListDataSource,
        //     success: true,
        //   });
        // }}
        options={{
          reload: getSecurityRules
        }}
        dataSource={
          securityGroups.length >= 1 ? securityGroups[0]['rules'] : []
        }
        pagination={{
          showQuickJumper: true,
          pageSize: 10,
        }}
        search={false}
        dateFormatter="string"
        toolbar={{
          title: (
            <Button
              type="primary"
              key="launchInstance"
              onClick={() => setshowForm(true)}
            >
              {t('Button.CREATE')}
            </Button>
          ),
        }}
      />
      <SecurityRuleForm
        visible={showForm}
        hideModal={() => setshowForm(false)}
      />
    </>
  );
}
