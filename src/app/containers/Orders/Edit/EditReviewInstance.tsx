import ProTable, { ProColumns } from '@ant-design/pro-table';
import { Button, Col, Form, Input, Row, Space, Card, Table } from 'antd';
import React, { useRef, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
// import { forceReducerReload } from 'redux-injectors';
import {
  MODE_EDIT,
  MODE_EXTEND,
  ORDER_DELETE,
  ORDER_EDIT,
} from '../../Users/constants';
import { selectUser } from '../../Users/selectors';
import { selectAccount } from 'app/containers/Auth/selectors';
import {
  selectContract,
  selectLoading,
  selectProducts,
  selectRegion,
  selectReview,
  selectService,
  selectNotice,
  selectData,
  selectOrder,
  // selectVmCfgId,
} from '../selectors';
import { actions } from '../slice';
import ButtonDeleteBase from 'app/components/ButtonDeleteBase';
import { ModalEditInstance } from '../Edit';
const { TextArea } = Input;

export interface TableListOrderInstance {
  id: number;
  CPU: number;
  Memory: number;
  DISK: number;
  NET: number;
  IP: number;
  Snapshot: number;
  Backup: number;
  OS: string;
  // RootDisk: string;
  // DataDisk: string;
  VPN: number;
  // Load_Balancer: string;
}

export interface TableListExtend {
  id: number;
  name: string;
  quantity: number;
}

interface Props {
  mode?: string;
  // order?: any;
}

export function EditReviewInstance({ mode }: Props) {
  const [visible, setVisible] = useState(false);
  const hideModal = () => {
    setVisible(false);
    dispatch(actions.setVmConfigId(null));
  };

  const order = useSelector(selectOrder);

  const data = useSelector(selectData);
  const dispatch = useDispatch();
  const history = useHistory();
  const noteRef: any = useRef(null);

  console.log('noteRef', noteRef);

  const { t } = useTranslation(['translation', 'constant']);
  const account = useSelector(selectAccount);
  const notice = useSelector(selectNotice);

  const service = useSelector(selectService);

  const dataSource = useSelector(selectReview);

  const defaultColumsInterface: any =
    dataSource?.length > 0 ? Object?.keys(dataSource?.[0]) : [];

  const [
    dataExtendServiceInformation,
    setDataExtendServiceInformation,
  ] = useState([]);

  useEffect(() => {
    if (service?.length > 0 && dataSource?.length > 0) {
      const newDataExtendServiceInformation = service?.map(e => ({
        ...e,
        quantity: dataSource.reduce(
          (init, curr) => init + parseInt(curr[e?.name.replace(' ', '')]),
          0,
        ),
      }));
      setDataExtendServiceInformation(newDataExtendServiceInformation);
    } else {
      setDataExtendServiceInformation([]);
    }
  }, [service, dataSource]);

  const user = useSelector(selectUser);

  const contract = useSelector(selectContract);

  const products = useSelector(selectProducts);
  const loading = useSelector(selectLoading).order;
  const region = useSelector(selectRegion);

  const handleClickDeleteCreate = index => {
    const newData = [...dataSource];
    const newProducts = [...products];

    newProducts.splice(index, 1);
    newData.splice(index, 1);
    dispatch(actions.setReview(newData));
    dispatch(actions.setProducts(newProducts));
  };

  const handleClickDeleteEdit = (record, index) => {
    // const newData = [...dataSource];
    // const newProducts = [...products];

    // newProducts.splice(index, 1);
    // newData.splice(index, 1);
    // dispatch(actions.setReview(newData));
    // dispatch(actions.setProducts(newProducts));

    // let id_RemoveVmConfig;
    // const vm_config = order?.VmConfig ? order?.VmConfig : [];
    // for (let i = 0; i < vm_config?.length; i++) {
    //   if (index === i) {
    //     id_RemoveVmConfig = vm_config[i]?.ID;
    //     break;
    //   }
    //   continue;
    // }
    // dispatch(actions.setData({ delete: index, vmConfigId: id_RemoveVmConfig }));

    dispatch(
      actions.setData({ tableIndex: index, vmConfigId: record?.VmCfgId }),
    );
    dispatch(actions.deleteVmConfig());
  };

  // const vmCfgId = useSelector(selectVmCfgId);

  const handleClickEdit = (record, index) => {
    // let id_EditVmConfig;
    // const vm_config = order?.VmConfig ? order?.VmConfig : [];
    // for (let i = 0; i < vm_config?.length; i++) {
    //   if (index === i) {
    //     id_EditVmConfig = vm_config[i]?.ID;
    //     break;
    //   }
    //   continue;
    // }
    // dispatch(actions.setVmConfigId(id_EditVmConfig));

    dispatch(actions.setVmConfigId(record?.VmCfgId));
    setVisible(true);
  };

  // console.log('vmCfgId9999', vmCfgId);

  const handleClickCreate = () => {
    let items: any[] = [];
    products.forEach(product => {
      items = [...items, { products: product }];
    });

    const { current } = contract;
    let newContract: any = {};
    newContract.code = current.contract_code;
    newContract.start_at = current.start_at;
    newContract.end_at = current.end_at;

    let co_sale: any = {};
    co_sale.department = current.department;
    co_sale.sale = current.sale;

    const newData = {
      ...current,
      contract: newContract,
      customer: user,
      remark: noteRef.current.state.value,
      items: items,
      quantity: 1,
      co_sale,
      region_id: region,
    };
    // newData.price = Number(newData.price);
    newData.price = newData?.price
      ? parseFloat(newData.price.replaceAll(',', ''))
      : 0;
    delete newData.department;
    delete newData.end_at;
    delete newData.sale;
    delete newData.start_at;
    delete newData.contract_code;

    dispatch(actions.setData(newData));
    dispatch(actions.createOrder());
  };

  useEffect(() => {
    if (notice === t('Message.CREATE_ORDER_SUCCESS')) {
      dispatch(actions.loadOrders());
      history.push('/dashboard/orders');
    }
  }, []);

  let columns1: any = [];
  if (order?.service_type === 'POOL') {
    for (let i = 0; i < defaultColumsInterface?.length; i++) {
      const objTemp: any = {};
      if (
        defaultColumsInterface?.[i] !== 'VmCfgId' &&
        defaultColumsInterface?.[i] !== 'diskVmID' &&
        defaultColumsInterface?.[i] !== 'VmCfgId' &&
        defaultColumsInterface?.[i] !== 'DATA_DISK' &&
        defaultColumsInterface?.[i] !== 'ROOT_DISK'
      ) {
        objTemp.title = `${defaultColumsInterface?.[i]}`;
        objTemp.key = `${defaultColumsInterface?.[i]}`;
        objTemp.dataIndex = defaultColumsInterface?.[i];
      }
      columns1.push(objTemp);
    }
  } else {
    for (let i = 0; i < defaultColumsInterface?.length; i++) {
      const objTemp: any = {};
      if (
        defaultColumsInterface?.[i] !== 'VmCfgId' &&
        defaultColumsInterface?.[i] !== 'diskVmID'
      ) {
        objTemp.title = `${defaultColumsInterface?.[i]}`;
        objTemp.key = `${defaultColumsInterface?.[i]}`;
        objTemp.dataIndex = defaultColumsInterface?.[i];
      }
      columns1.push(objTemp);
    }
  }

  const [page, setPage] = useState(1);

  const newColums: any = [
    {
      title: 'STT',
      width: 60,
      render: (text, record: any, index) => {
        return <span> {(page - 1) * 10 + (index + 1)}</span>;
      },
    },
    ...columns1,
    {
      title: t('constant:Title.ACTIONS'),
      width: 150,
      key: 'option',
      valueType: 'option',
      render: (text, record, index) => {
        if (mode === MODE_EDIT) {
          return [
            <>
              <Row className="row-flex">
                {account.permission?.includes(ORDER_EDIT) && (
                  <Col span={12}>
                    <Button
                      key="1"
                      type="primary"
                      size="small"
                      disabled={order?.approval_step >= 1}
                      onClick={() => handleClickEdit(record, index)}
                    >
                      {t('Button.EDIT')}
                    </Button>
                  </Col>
                )}
                {account.permission?.includes(ORDER_DELETE) && (
                  <Col span={12}>
                    <ButtonDeleteBase
                      requirePassword={order?.approval_step >= 1}
                      disabled={order?.approval_step >= 1}
                      onConfirm={() => handleClickDeleteEdit(record, index)}
                      loading={data ? index === data.delete : false}
                      size="small"
                      key="2"
                    />
                  </Col>
                )}
              </Row>
            </>,
          ];
        } else {
          return [
            <>
              <Button
                key="button"
                disabled={mode === MODE_EDIT}
                type="primary"
                danger
                onClick={() => handleClickDeleteCreate(index)}
              >
                {t('Button.DELETE')}
              </Button>
            </>,
          ];
        }
      },
    },
  ];

  // console.log('newColums', newColums);

  // const columns = [
  //   {
  //     title: t('constant:Title.NO'),
  //     // valueType: 'indexBorder',
  //     width: 48,
  //     key: 'NO',
  //   },
  //   {
  //     title: t('constant:Title.CPU_WITH_SUFFIX'),
  //     dataIndex: 'CPU',
  //     key: 'CPU',
  //     sorter: (a, b) => a.CPU - b.CPU,
  //   },
  //   {
  //     title: t('constant:Title.MEMORY_WITH_SUFFIX'),
  //     dataIndex: 'Memory',
  //     key: 'Memory',
  //     sorter: (a, b) => a.Memory - b.Memory,
  //   },
  //   {
  //     title: t('constant:Title.DISK_ROOT_WITH_SUFFIX'),
  //     // dataIndex: 'RootDisk',
  //     key: 'RootDisk',
  //     render: (text, record, index) => <span></span>,
  //     // sorter: (a, b) => a.RootDisk - b.RootDisk,
  //   },
  //   {
  //     title: t('constant:Title.DISK_DATA_WITH_SUFFIX'),
  //     // dataIndex: 'DataDisk',
  //     key: 'DataDisk',
  //     render: (text, record, index) => <span></span>,
  //     // sorter: (a, b) => a.DataDisk - b.DataDisk,
  //   },

  //   {
  //     title: t('constant:Title.NET_WITH_SUFFIX'),
  //     dataIndex: 'NET',
  //     key: 'NET',
  //     sorter: (a, b) => a.NET - b.NET,
  //   },
  //   {
  //     title: t('constant:Title.IPS_WITH_SUFFIX'),
  //     dataIndex: 'IP',
  //     key: 'IP',
  //     sorter: (a, b) => a.IP - b.IP,
  //   },
  //   {
  //     title: t('constant:Title.SNAPSHOT_WITH_SUFFIX'),
  //     dataIndex: 'Snapshot',
  //     key: 'Snapshot',
  //     sorter: (a, b) => a.Snapshot - b.Snapshot,
  //   },
  //   {
  //     title: t('constant:Title.BACKUP_WITH_SUFFIX'),
  //     dataIndex: 'Backup',
  //     key: 'Backup',
  //     sorter: (a, b) => a.Backup - b.Backup,
  //   },
  //   {
  //     title: 'VPN',
  //     dataIndex: 'VPN',
  //     key: 'VPN',
  //     sorter: (a, b) => a.VPN - b.VPN,
  //   },

  //   {
  //     title: 'Load Balancer',
  //     key: 'LoadBalancer',
  //     // dataIndex: 'OS',
  //     width: 100,
  //     render: (text, record, index) => <span></span>,
  //   },
  //   {
  //     title: 'OS',
  //     key: 'OS',
  //     dataIndex: 'OS',
  //     width: 100,
  //   },
  //   {
  //     title: t('constant:Title.ACTIONS'),
  //     width: 100,
  //     key: 'option',
  //     valueType: 'option',
  //     // fixed: 'right',
  //     render: (text, record, index) => [
  //       <Button
  //         key="button"
  //         disabled={mode === MODE_EDIT}
  //         type="primary"
  //         danger
  //         onClick={() => handleClickDelete(index)}
  //       >
  //         {t('Button.DELETE')}
  //       </Button>,
  //     ],
  //   },
  // ];

  //colums table extend service information
  const columsExtendService = [
    {
      title: t('translation:Title.SERVICE_NAME'),
      key: 'name',
      width: '30%',

      render: (text, record: any, index) => {
        return <span>{record?.name}</span>;
      },
    },
    {
      title: t('translation:Title.INFORMATION'),
      key: 'quantity',
      // editable: true,
      render: (text, record: any, index) => {
        return <span>{record?.quantity}</span>;
      },
    },
  ];

  return (
    <>
      <Row gutter={4}>
        {dataSource?.length > 0 && (
          <Col span={mode === MODE_EDIT ? 24 : 12}>
            <Card
              title={t('constant:Title.INSTANCE_INFO')}
              bordered={false}
              style={{ height: '100%' }}
            >
              <Table
                columns={newColums}
                dataSource={dataSource ? dataSource : []}
                // tableStyle={{ overflow: 'scroll' }}
                scroll={{ x: 500 }}
                style={{ whiteSpace: 'pre' }}
                rowKey={record => record.id}
                pagination={{
                  onChange(current) {
                    setPage(current);
                  },
                }}
                // pagination={{
                //   showQuickJumper: true,
                //   pageSize: 10,
                // }}
                // search={false}
                // dateFormatter="string"
                // options={false}
              />
            </Card>
          </Col>
        )}

        {mode !== MODE_EDIT && mode !== MODE_EXTEND && (
          <Col span={12}>
            <Card
              title={t('translation:Title.ADDITIONAL_SERVICE_INFORMATION')}
              bordered={false}
              style={{ height: '100%' }}
            >
              <ProTable<TableListExtend>
                columns={columsExtendService}
                dataSource={
                  dataExtendServiceInformation
                    ? dataExtendServiceInformation
                    : []
                }
                // tableStyle={{ overflow: 'scroll' }}
                rowKey={record => String(record.id)}
                pagination={{
                  showQuickJumper: true,
                  pageSize: 10,
                }}
                search={false}
                dateFormatter="string"
                options={false}
              />
            </Card>
          </Col>
        )}
      </Row>

      <Row style={{ marginTop: 16 }}>
        <Col span={12}></Col>
        <Col span={12}>
          <Form.Item name="remark" label={t('Label.NOTES')}>
            <TextArea ref={noteRef} rows={8} />
          </Form.Item>
        </Col>
      </Row>

      {mode !== MODE_EDIT && mode !== MODE_EXTEND && (
        <Row className="ma-16" justify="center">
          <Space>
            <Button
              loading={loading}
              type="primary"
              onClick={handleClickCreate}
            >
              {t('Button.CREATE')}
            </Button>
            <Button onClick={() => history.push('/dashboard/orders')}>
              {t('Button.CANCEL')}
            </Button>
          </Space>
        </Row>
      )}

      <ModalEditInstance
        visible={visible}
        onCancel={hideModal}
        mode={mode}
        // order={order}
      />
    </>
  );
}
