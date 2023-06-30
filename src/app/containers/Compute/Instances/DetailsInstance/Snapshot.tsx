import ProTable, { ProColumns } from '@ant-design/pro-table';
import { Button, message, Space } from 'antd';
import ButtonDeleteBase from 'app/components/ButtonDeleteBase';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import {
  selectCompute,
  selectData,
  selectLoading,
  selectNotice,
  selectSnapshots,
} from '../selector';
import { actions } from '../slice';
import SnapshotForm from './SnapshotForm';
interface TableListSnapshot {
  id: number;
  name: string;
  created_at: number;
  volume_id: string;
  status: string;
  size: number;
  description: string;
}

export default function Snapshot() {
  const [showSnapshotForm, setShowSnapshotForm] = useState(false);
  // const [showScheduleForm, setShowScheduleForm] = useState(false);

  const { instanceId }: any = useParams();
  const dispatch = useDispatch();
  const { t } = useTranslation(['translation', 'constant']);

  const data = useSelector(selectData);
  const snapshots = useSelector(selectSnapshots);
  const compute = useSelector(selectCompute);
  const loading = useSelector(selectLoading)?.snapshots;
  const notice = useSelector(selectNotice);

  const columns: ProColumns<TableListSnapshot>[] = [
    {
      title: t('constant:Title.NO'),
      dataIndex: 'index',
      valueType: 'indexBorder',
      width: 48,
    },
    {
      title: t('constant:Title.NAME'),
      dataIndex: 'name',
      width: 60,
      ellipsis: true,
    },
    {
      title: t('constant:Title:CREATED_AT'),
      width: 200,
      key: 'createDate',
      dataIndex: 'created_at',
      valueType: 'dateTime',
      sorter: (a, b) => a.created_at - b.created_at,
    },
    // {
    //   title: 'Volume',
    //   dataIndex: 'volume_id',
    // },
    {
      title: t('constant:Title.STATUS'),
      dataIndex: 'status',
      initialValue: 'all',
      width: 140,
      filters: true,
      valueEnum: {
        all: { text: 'all', status: 'Default' },
        close: { text: 'close', status: 'Default' },
        running: { text: 'running', status: 'Processing' },
        online: { text: 'online', status: 'Success' },
        error: { text: 'error', status: 'Error' },
      },
    },
    {
      title: t('constant:Title.BACKUP_SIZE'),
      dataIndex: 'size',
      width: 100,
      sorter: (a, b) => a.size - b.size,
    },
    {
      title: t('constant:Title.DESCRIPTION'),
      dataIndex: 'description',
      width: 100,
    },
    {
      title: t('constant:Title.ACTIONS'),
      width: 180,
      key: 'option',
      valueType: 'option',
      render: (text, record, index) => [
        <ButtonDeleteBase
          key={`delete${index}`}
          onConfirm={() => handleDelete(record, index)}
          loading={data ? data.index === index : false}
        ></ButtonDeleteBase>,
        <Button
          key={`rollback${index}`}
          size="small"
          onClick={() => handleRollback(record, index)}
          loading={data ? data.indexRollback === index : false}
        >
          {t('constant:Button.ROLLBACK')}
        </Button>,
      ],
    },
  ];

  const getSnapshots = () => {
    dispatch(actions.setData({ instanceId }));
    dispatch(actions.getSnapshots());
  };

  const handleDelete = (record, index) => {
    dispatch(
      actions.setData({
        snapshotId: record.id,
        instanceId: instanceId,
        index: index,
      }),
    );
    dispatch(actions.deleteSnapshot());
  };

  const handleRollback = (record, index) => {
    dispatch(
      actions.setData({
        snapshotId: record.id,
        instanceId: instanceId,
        indexRollback: index,
      }),
    );
    dispatch(actions.rollbackSnapshot());
  };

  const handleClickBtnCreate = () => {
    if (compute.vm_cfg?.snapshot === 0)
      message.warning(t('Message.SNAPSHOT_NOT_SUPPORTED'), 6);
    else setShowSnapshotForm(true);
  };
  const hideCreateSecurityForm = () => {
    setShowSnapshotForm(false);
  };

  // const handleClickBtnSchedule = () => {
  //   setShowScheduleForm(true);
  // };
  // const hideScheduleForm = () => {
  //   setShowScheduleForm(false);
  // };

  useEffect(() => {
    if (notice === t('Message.CREATE_SNAPSHOT_SUCCESS')) {
      getSnapshots();
      hideCreateSecurityForm();
    }
  }, [notice]);

  return (
    <>
      <ProTable<TableListSnapshot>
        columns={columns}
        dataSource={snapshots}
        loading={loading}
        options={{
          reload: getSnapshots,
          fullScreen: false,
        }}
        rowKey={record => String(record.id)}
        pagination={{
          showQuickJumper: true,
          pageSize: 10,
        }}
        search={false}
        dateFormatter="string"
        toolbar={{
          title: (
            <Space>
              <Button
                type="primary"
                key="launchInstance"
                onClick={handleClickBtnCreate}
              >
                {t('constant:Button.CREATE')}
              </Button>
              {/* <Button onClick={handleClickBtnSchedule}>Schedule</Button>  */}
            </Space>
          ),
        }}
      />
      <SnapshotForm
        instanceId={instanceId}
        visible={showSnapshotForm}
        hideModal={hideCreateSecurityForm}
      />
      {/* <ScheduleFormSnapshot
        instanceId={instanceId}
        visible={showScheduleForm}
        hideModal={hideScheduleForm}
      /> */}
    </>
  );
}
