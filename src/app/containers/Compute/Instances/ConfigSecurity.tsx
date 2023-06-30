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
  protocol?: string;
  portRange?: string;
  source?: string;
  description?: string;
}

export default function ConfigSecurity() {
  const [editableKeys, setEditableRowKeys] = useState<React.Key[]>([]);
  const [dataSource, setDataSource] = useState<DataSourceType[]>([]);
  const [position, setPosition] = useState<'top' | 'bottom'>('bottom');
  const [newRecord, setNewRecord] = useState({
    id: (Math.random() * 1000000).toFixed(0),
  });

  const { t } = useTranslation();
  const columns: ProColumns<DataSourceType>[] = [
    {
      title: t('Title.PROTOCOL'),
      key: 'protocol',
      dataIndex: 'device',
      valueType: 'select',
      formItemProps: {
        rules: [
          {
            required: true,
            message: t('Field_Message.REQUIRE_FIELD'),
          },
        ],
      },
      valueEnum: {
        icmp: { text: 'ICMP', status: 'icmp' },
        tcp: {
          text: 'TCP',
          status: 'tcp',
        },
        udp: {
          text: 'UDP',
          status: 'udp',
        },
      },
    },
    {
      title: t('Title.PORT_RANGE'),
      dataIndex: 'portRange',
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
      title: t('Title.SOURCE'),
      dataIndex: 'source',
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
      title: t('Title.DESCRIPTION'),
      dataIndex: 'description',
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
      title: t('Title.OPERATION'),
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
    <>
      <EditableProTable<DataSourceType>
        rowKey="id"
        maxLength={5}
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
    </>
  );
}
