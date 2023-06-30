import { ProFormRadio } from '@ant-design/pro-form';
import { EditableProTable, ProColumns } from '@ant-design/pro-table';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

const waitTime = (time: number = 100) => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(true);
    }, time);
  });
};

interface DataSourceType {
  id: React.Key;
  volume?: string;
  device?: string;
  snapshot?: string;
  size?: number;
  encryption?: string;
}

export default function ConfigStorage() {
  const [editableKeys, setEditableRowKeys] = useState<React.Key[]>([]);
  const [dataSource, setDataSource] = useState<DataSourceType[]>([]);
  const [position, setPosition] = useState<'top' | 'bottom'>('bottom');
  const [newRecord, setNewRecord] = useState({
    id: (Math.random() * 1000000).toFixed(0),
  });

  const { t } = useTranslation();
  const columns: ProColumns<DataSourceType>[] = [
    {
      title: 'Volume Type',
      dataIndex: 'volume',
      formItemProps: {
        rules: [
          {
            required: true,
            message: t('Field_Message.REQUIRED_FIELD'),
          },
        ],
      },
      // Editing is not allowed on the second line
      editable: (text, record, index) => {
        return index !== 1;
      },
      width: '20%',
    },
    {
      title: 'Device',
      key: 'device',
      dataIndex: 'device',
      valueType: 'select',
      formItemProps: {
        rules: [
          {
            required: true,
            message: t('Field_Message.REQUIRED_FIELD'),
          },
        ],
      },
      valueEnum: {
        all: { text: 'dev1', status: 'dev1' },
        open: {
          text: 'dev2',
          status: 'dev2',
        },
        closed: {
          text: 'dev3',
          status: 'dev3',
        },
      },
    },
    {
      title: 'Snapshot',
      dataIndex: 'snapshot',
      formItemProps: {
        rules: [
          {
            required: true,
            message: t('Field_Message.REQUIRED_FIELD'),
          },
        ],
      },
      // Editing is not allowed on the second line
      editable: (text, record, index) => {
        return index !== 1;
      },
      width: '20%',
    },
    {
      title: 'Size',
      dataIndex: 'size',
      valueType: 'digit',
      formItemProps: {
        rules: [
          {
            required: true,
            message: t('Field_Message.REQUIRED_FIELD'),
          },
        ],
      },
      // Editing is not allowed on the second line
      editable: (text, record, index) => {
        return index !== 1;
      },
      width: '15%',
    },
    {
      title: 'Encryption',
      dataIndex: 'encryption',
      formItemProps: {
        rules: [
          {
            required: true,
            message: t('Field_Message.REQUIRED_FIELD'),
          },
        ],
      },
      // Editing is not allowed on the second line
      editable: (text, record, index) => {
        return index !== 1;
      },
      width: '20%',
    },
    {
      title: 'Operation',
      valueType: 'option',
      width: 200,
      render: (text, record, _, action) => [
        <a
          key="editable"
          onClick={() => {
            action.startEditable?.(record.id);
          }}
        >
          edit
        </a>,
      ],
    },
  ];

  return (
    <EditableProTable<DataSourceType>
      rowKey="id"
      recordCreatorProps={{
        position,
        record: newRecord,
      }}
      toolBarRender={() => [
        <ProFormRadio.Group
          key="render"
          fieldProps={{
            value: position,
            onChange: e => setPosition(e.target.value),
          }}
          options={[
            {
              label: 'Add to the top',
              value: 'top',
            },
            {
              label: 'Add to the bottom',
              value: 'bottom',
            },
          ]}
        />,
      ]}
      columns={columns}
      request={async () => ({
        data: [],
        total: 3,
        success: true,
      })}
      value={dataSource}
      onChange={setDataSource}
      editable={{
        editableKeys,
        onSave: async () => {
          await waitTime(2000);
          setNewRecord({
            id: (Math.random() * 1000000).toFixed(0),
          });
        },
        onChange: setEditableRowKeys,
      }}
    />
  );
}
