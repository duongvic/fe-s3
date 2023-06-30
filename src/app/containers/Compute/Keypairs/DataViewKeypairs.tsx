import { SearchOutlined } from '@ant-design/icons';
import ProTable, { ProColumns, TableDropdown } from '@ant-design/pro-table';
import { Button, Input } from 'antd';
import React, { useState } from 'react';
import CreateKeypairForm from './CreateKeypairForm';

export interface TableListKeypair {
  key: number;
  name: string;
  type: string;
  fingerprint: string;
}
const tableListDataSource: TableListKeypair[] = [];

const columns: ProColumns<TableListKeypair>[] = [
  {
    title: 'No',
    dataIndex: 'index',
    valueType: 'indexBorder',
    width: 48,
  },
  {
    title: 'Name',
    dataIndex: 'name',
    render: _ => <></>,
    // render: _ => <a>{_}</a>,
    //  https://ant.design/components/table-cn/#components-table-demo-custom-filter-panel
    filterDropdown: () => (
      <div style={{ padding: 8 }}>
        <Input style={{ width: 188, marginBottom: 8, display: 'block' }} />
      </div>
    ),
    filterIcon: filtered => (
      <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
    ),
  },
  {
    title: 'Type',
    dataIndex: 'type',
    render: _ => <></>,
    // render: _ => <a>{_}</a>,
    //  https://ant.design/components/table-cn/#components-table-demo-custom-filter-panel
    filterDropdown: () => (
      <div style={{ padding: 8 }}>
        <Input style={{ width: 188, marginBottom: 8, display: 'block' }} />
      </div>
    ),
    filterIcon: filtered => (
      <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
    ),
  },
  {
    title: 'Fingerprint',
    dataIndex: 'fingerprint',
    render: _ => <></>,
    // render: _ => <a>{_}</a>,
    //  https://ant.design/components/table-cn/#components-table-demo-custom-filter-panel
    filterDropdown: () => (
      <div style={{ padding: 8 }}>
        <Input style={{ width: 188, marginBottom: 8, display: 'block' }} />
      </div>
    ),
    filterIcon: filtered => (
      <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
    ),
  },
  {
    title: 'Actions',
    width: 180,
    key: 'option',
    valueType: 'option',
    render: () => [
      <span key="link">act1</span>,
      <span key="link2">act2</span>,
      <span key="link3">act3</span>,
      <TableDropdown
        key="actionGroup"
        menus={[
          { key: 'copy', name: 'copy' },
          { key: 'delete', name: 'delete' },
        ]}
      />,
    ],
  },
];

export default function DataViewKeypairs() {
  const [showCreateKeypairForm, setShowCreateKeypairForm] = useState(false);

  const handleClickBtnCreate = () => {
    setShowCreateKeypairForm(true);
  };
  const hideCreateKeypairForm = () => {
    setShowCreateKeypairForm(false);
  };

  return (
    <>
      <ProTable<TableListKeypair>
        columns={columns}
        request={(params, sorter, filter) => {
          console.log(params, sorter, filter);
          return Promise.resolve({
            data: tableListDataSource,
            success: true,
          });
        }}
        rowKey="key"
        pagination={{
          showQuickJumper: true,
          pageSize: 10,
        }}
        search={{
          layout: 'vertical',
          defaultCollapsed: true,
        }}
        dateFormatter="string"
        toolbar={{
          title: (
            <Button
              type="primary"
              key="launchInstance"
              onClick={handleClickBtnCreate}
            >
              Create
            </Button>
          ),
        }}
      />
      <CreateKeypairForm
        visible={showCreateKeypairForm}
        hideModal={hideCreateKeypairForm}
      />
    </>
  );
}
