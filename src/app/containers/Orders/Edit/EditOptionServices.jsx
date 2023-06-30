import { Form, InputNumber, Table } from 'antd';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import {
  selectContract,
  selectLoading,
  selectVmCfgId,
  selectVmCfgService,
} from '../selectors';
import { actions } from '../slice';
import '../styles.less';

const EditableContext = React.createContext();

const EditableRow = ({ index, ...props }) => {
  const [form] = Form.useForm();
  return (
    <Form form={form} component={false}>
      <EditableContext.Provider value={form}>
        <tr {...props} />
      </EditableContext.Provider>
    </Form>
  );
};

const EditableCell = ({
  title,
  editable,
  children,
  dataIndex,
  record,
  handleSave,
  ...restProps
}) => {
  const [editing, setEditing] = useState(false);
  const inputRef = useRef();
  const form = useContext(EditableContext);
  useEffect(() => {
    if (editing) {
      inputRef.current.focus();
    }
  }, [editing]);

  const toggleEdit = () => {
    setEditing(!editing);
    form.setFieldsValue({
      [dataIndex]: record[dataIndex],
    });
  };

  const save = async e => {
    try {
      const values = await form.validateFields();
      toggleEdit();
      handleSave({ ...record, ...values });
    } catch (errInfo) {
      console.log('Save failed:', errInfo);
    }
  };

  let childNode = children;

  if (editable) {
    childNode = editing ? (
      <Form.Item
        style={{
          margin: 0,
        }}
        name={dataIndex}
        rules={[
          {
            required: true,
            message: `${title} is required.`,
          },
        ]}
      >
        <InputNumber
          type="number"
          min={0}
          ref={inputRef}
          onPressEnter={save}
          onBlur={save}
        />
      </Form.Item>
    ) : (
      <div
        className="editable-cell-value-wrap"
        style={{
          paddingRight: 24,
        }}
        onClick={toggleEdit}
      >
        {children}
      </div>
    );
  }

  return <td {...restProps}>{childNode}</td>;
};

export default function EditOptionServices() {
  const dispatch = useDispatch();
  const { t } = useTranslation('constant');

  const vmCfgId = useSelector(selectVmCfgId);
  const contract = useSelector(selectContract);
  const dataSource1 = useSelector(selectVmCfgService);

  // console.log('dataSource extend service', dataSource);
  const loading = useSelector(selectLoading)?.service;

  useEffect(() => {
    if (contract?.current) {
      dispatch(actions.loadService());
    }
  }, [contract, dispatch]);

  useEffect(() => {
    if (vmCfgId) {
      dispatch(actions.setData({ vmConfigId: vmCfgId }));
      dispatch(actions.loadVmCfgService());
    } else {
      dispatch(actions.setVmCfgService([]));
    }
  }, [dispatch, vmCfgId]);

  const handleSave = row => {
    const newData = [...dataSource1];
    const index = newData.findIndex(item => row.id === item.id);
    const item = newData[index];
    newData.splice(index, 1, { ...item, ...row });
    dispatch(actions.setService(newData));
    dispatch(actions.setVmCfgService(newData));
  };

  const defaultColumns = [
    {
      title: t('Title.NAME'),
      dataIndex: 'name',
      width: '30%',
      key: 'name',
    },
    {
      title: t('Title.QUANTITY'),
      dataIndex: 'quantity',
      key: 'quantity',
      editable: true,
    },
    {
      title: t('Title.UNIT'),
      dataIndex: 'unit',
      key: 'unit',
    },
  ];

  const components = {
    body: {
      row: EditableRow,
      cell: EditableCell,
    },
  };

  const columns = defaultColumns.map(col => {
    if (!col.editable) {
      return col;
    }

    return {
      ...col,
      onCell: record => ({
        record,
        editable: col.editable,
        dataIndex: col.dataIndex,
        title: col.title,
        handleSave: handleSave,
      }),
    };
  });

  return (
    <div>
      <Table
        components={components}
        rowClassName={() => 'editable-row'}
        bordered
        pagination={false}
        dataSource={dataSource1 ? dataSource1 : []}
        columns={columns}
        loading={loading}
      />
    </div>
  );
}
