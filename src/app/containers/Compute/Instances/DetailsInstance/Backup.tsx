import ProTable, { ProColumns } from '@ant-design/pro-table';
import { Button, message, Space } from 'antd';
import ButtonDeleteBase from 'app/components/ButtonDeleteBase';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import {
  selectBackups,
  selectCompute,
  selectData,
  selectLoading,
  selectNotice,
} from '../selector';
import { actions } from '../slice';
import BackupForm from './BackupForm';

interface TableListBackup {
  id: number;
  name: string;
  created_at: number;
  volume_id: string;
  status: string;
  size: number;
  description: string;
}

export default function Backup() {
  const [showBackupForm, setShowBackupForm] = useState(false);
  // const [showScheduleForm, setShowScheduleForm] = useState(false);

  const { instanceId }: any = useParams();
  const dispatch = useDispatch();
  const { t } = useTranslation(['constant', 'translation']);

  const compute = useSelector(selectCompute);
  const notice = useSelector(selectNotice);
  const data = useSelector(selectData);
  const backups = useSelector(selectBackups);
  const loading = useSelector(selectLoading)?.backups;
  const columns: ProColumns<TableListBackup>[] = [
    {
      title: t('Title.NO'),
      dataIndex: 'index',
      valueType: 'indexBorder',
      width: 48,
    },
    {
      title: t('Title.NAME'),
      dataIndex: 'name',
    },
    {
      title: t('Title.CREATE_DATE'),
      width: 200,
      key: 'createDate',
      dataIndex: 'created_at',
      valueType: 'dateTime',
      sorter: (a, b) => a.created_at - b.created_at,
    },
    // {
    //   title: 'Volume',
    //   dataIndex: 'volume_id',
    //   filterDropdown: () => (
    //     <div style={{ padding: 8 }}>
    //       <Input style={{ width: 188, marginBottom: 8, display: 'block' }} />
    //     </div>
    //   ),
    //   filterIcon: filtered => (
    //     <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
    //   ),
    // },
    {
      title: t('Title.STATUS'),
      dataIndex: 'status',
      initialValue: 'all',
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
      title: t('Title.BACKUP_SIZE'),
      dataIndex: 'size',
      sorter: (a, b) => a.size - b.size,
    },
    {
      title: t('Title.DESCRIPTION'),
      dataIndex: 'description',
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
        <Button
          key={`delete${index}`}
          onClick={() => handleRollback(record, index)}
          loading={data ? data.indexRollback === index : false}
        >
          {t('Button.ROLLBACK')}
        </Button>,
      ],
    },
  ];

  const getBackup = () => {
    dispatch(actions.setData({ instanceId }));
    dispatch(actions.getBackups());
  };

  const handleDelete = (record, index) => {
    console.log(record);
    dispatch(
      actions.setData({
        backupId: record.id,
        instanceId: instanceId,
        index: index,
      }),
    );
    dispatch(actions.deleteBackup());
  };

  const handleRollback = (record, index) => {
    dispatch(
      actions.setData({
        backupId: record.id,
        instanceId,
        indexRollback: index,
      }),
    );
    dispatch(actions.rollbackBackup());
  };

  const handleClickBtnCreate = () => {
    if (compute?.vm_cfg.backup === 0) {
      message.warning(t('translation:Message.BACKUP_NOT_SUPPORTED'), 6);
    } else setShowBackupForm(true);
  };
  const hideCreateSecurityForm = () => {
    setShowBackupForm(false);
  };

  // const handleClickBtnSchedule = () => {
  //   setShowScheduleForm(true);
  // };
  // const hideScheduleForm = () => {
  //   setShowScheduleForm(false);
  // };

  useEffect(() => {
    if (notice === t('Message.CREATE_BACKUP_SUCCESS')) {
      getBackup();
      hideCreateSecurityForm();
    }
  }, [notice]);

  return (
    <>
      <ProTable<TableListBackup>
        columns={columns}
        dataSource={backups}
        loading={loading}
        rowKey={record => String(record.id)}
        pagination={{
          showQuickJumper: true,
          pageSize: 10,
        }}
        options={{
          reload: getBackup,
          fullScreen: false,
        }}
        search={false}
        dateFormatter="string"
        toolbar={{
          title: (
            <Space>
              <Button
                type="primary"
                key="createBackup"
                onClick={handleClickBtnCreate}
              >
                Create
              </Button>
              {/* <Button onClick={handleClickBtnSchedule}>Schedule</Button> */}
            </Space>
          ),
        }}
      />
      <BackupForm
        instanceId={instanceId}
        visible={showBackupForm}
        hideModal={hideCreateSecurityForm}
      />
      {/* <ScheduleFormBackup
        instanceId={instanceId}
        visible={showScheduleForm}
        hideModal={hideScheduleForm}
      /> */}
    </>
  );
}
