import ProTable from '@ant-design/pro-table';
import {
  Button,
  Col,
  Form,
  Input,
  Row,
  Space,
  Card,
  Table,
  // Typography,
} from 'antd';
import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
// import { forceReducerReload } from 'redux-injectors';
import { MODE_EDIT, MODE_EXTEND } from '../Users/constants';
import { selectUser } from '../Users/selectors';
import {
  selectContract,
  selectLoading,
  selectProducts,
  selectRegion,
  selectReview,
  selectService,
  selectNotice,
  selectInstance,
} from './selectors';
import { actions } from './slice';
import ButtonDeleteBase from 'app/components/ButtonDeleteBase';
import './styles.less';

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
}

export default function ReviewInstance({ mode }: Props) {
  const dispatch = useDispatch();
  const history = useHistory();
  const noteRef: any = useRef(null);
  const { t } = useTranslation(['translation', 'constant']);

  const notice = useSelector(selectNotice);

  const service = useSelector(selectService);

  const instance = useSelector(selectInstance);

  const dataSource = useSelector(selectReview);

  const [dataSourceView, setDataSourceView] = useState<any>([]);

  // console.log('dataSource ben trai', dataSource);

  const defaultColumsInterface: any =
    dataSource?.length > 0 ? Object?.keys(dataSource?.[0]) : [];

  // defaultColumsInterface.sort(function (a, b) {
  //   var nameA = a?.toUpperCase(); // ignore upper and lowercase
  //   var nameB = b?.toUpperCase(); // ignore upper and lowercase
  //   if (nameA < nameB) {
  //     return -1;
  //   }
  //   if (nameA > nameB) {
  //     return 1;
  //   }
  //   return 0;
  // });

  const [
    dataExtendServiceInformation,
    setDataExtendServiceInformation,
  ] = useState<any>([]);

  // //sum service option
  // useEffect(() => {
  //   if (service?.length > 0 && dataSource?.length > 0) {
  //     const newDataExtendServiceInformation = service?.map(e => ({
  //       ...e,
  //       quantity: dataSource.reduce(
  //         (init, curr) => init + parseInt(curr[e?.name.replace(' ', '')]),
  //         0,
  //       ),
  //     }));
  //     setDataExtendServiceInformation(newDataExtendServiceInformation);
  //   } else {
  //     setDataExtendServiceInformation([]);
  //   }
  // }, [service, dataSource]);

  //sum service option
  useEffect(() => {
    let newDataExtend,
      newDataServiceOption,
      newDataInstance: any = [];
    if (service?.length > 0 && dataSource?.length > 0) {
      newDataServiceOption = service?.map(e => ({
        ...e,
        quantity: dataSource.reduce(
          (init, curr) => init + parseInt(curr[e?.name.replace(' ', '')]),
          0,
        ),
      }));

      if (instance?.length > 0 && dataSource?.length > 0) {
        newDataInstance = instance?.map(e => ({
          ...e,
          quantity:
            e?.name === 'ROOT_DISK' || e?.name === 'DATA_DISK'
              ? dataSource.reduce(
                  (init, curr) =>
                    init +
                    parseInt(curr[e?.name.replace(' ', '')].split(' ')[1]),
                  0,
                )
              : dataSource.reduce(
                  (init, curr) =>
                    init + parseInt(curr[e?.name.replace(' ', '')]),
                  0,
                ),
        }));
      }
      newDataExtend = [...newDataInstance, ...newDataServiceOption];
      let cloneNewDataExtend: any = [];
      if (contract.current.service_type === 'POOL') {
        cloneNewDataExtend = newDataExtend?.filter(
          item =>
            item?.name?.toUpperCase().replace(' ', '_') !== 'ROOT_DISK' &&
            item?.name?.toUpperCase().replace(' ', '_') !== 'DATA_DISK',
        );
      } else {
        cloneNewDataExtend = newDataExtend?.filter(
          item => item?.name?.toUpperCase().replace(' ', '_') !== 'DISK',
        );
      }

      // newDataExtend.sort(function (a, b) {
      //   var nameA = a?.name?.toUpperCase(); // ignore upper and lowercase
      //   var nameB = b?.name?.toUpperCase(); // ignore upper and lowercase
      //   if (nameA < nameB) {
      //     return -1;
      //   }
      //   if (nameA > nameB) {
      //     return 1;
      //   }
      //   return 0;
      // });

      const newDataSource = [...dataSource];

      newDataSource?.sort(function (a, b) {
        var nameA = a?.name?.toUpperCase(); // ignore upper and lowercase
        var nameB = b?.name?.toUpperCase(); // ignore upper and lowercase
        if (nameA < nameB) {
          return -1;
        }
        if (nameA > nameB) {
          return 1;
        }
        return 0;
      });
      setDataExtendServiceInformation(cloneNewDataExtend);
      setDataSourceView(newDataSource);
    } else {
      setDataExtendServiceInformation([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [service, dataSource, instance]);

  // //sum instance
  // useEffect(() => {
  //   if (instance?.length > 0 && dataSource?.length > 0) {
  //     const newDataExtendServiceInformation = instance?.map(e => ({
  //       ...e,
  //       quantity: dataSource.reduce(
  //         (init, curr) => init + parseInt(curr[e?.name.replace(' ', '')]),
  //         0,
  //       ),
  //     }));
  //     setDataExtendServiceInformation(newDataExtendServiceInformation);
  //   } else {
  //     setDataExtendServiceInformation([]);
  //   }
  // }, [instance, dataSource]);

  const user = useSelector(selectUser);

  const contract = useSelector(selectContract);

  const products = useSelector(selectProducts);

  // console.log('products', products);
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
    const newData = [...dataSource];
    const newProducts = [...products];

    newProducts.splice(index, 1);
    newData.splice(index, 1);
    dispatch(actions.setReview(newData));
    dispatch(actions.setProducts(newProducts));
  };

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

  const handleClickCancel = () => {
    dispatch(actions.contractLoaded({}));
    dispatch(actions.setReview([]));
    history.push('/dashboard/orders');
  };

  useEffect(() => {
    if (notice === t('Message.CREATE_ORDER_SUCCESS')) {
      dispatch(actions.loadOrders());
      dispatch(actions.setContract({}));
      history.push('/dashboard/orders');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [notice]);

  let columns1: any = [];

  if (contract.current.service_type === 'POOL') {
    defaultColumsInterface.forEach(column => {
      const objTemp: any = {};
      if (column !== 'DATA_DISK' && column !== 'ROOT_DISK') {
        objTemp.title = `${column}`;
        objTemp.key = `${column}`;
        objTemp.dataIndex = column;
      }
      columns1.push(objTemp);
    });
  } else {
    defaultColumsInterface.forEach(column => {
      const objTemp: any = {};
      objTemp.title = `${column}`;
      objTemp.key = `${column}`;
      objTemp.dataIndex = column;
      columns1.push(objTemp);
    });
  }

  const newColums: any = [
    {
      title: 'STT',
      width: 60,
      render: (text, record: any, index) => {
        return <span> {index + 1}</span>;
      },
    },
    ...columns1,
    {
      title: t('constant:Title.ACTIONS'),
      // width: 100,
      key: 'option',
      valueType: 'option',
      // fixed: 'right',
      // render: (text, record, index) => [

      //   <Button
      //     key="button"
      //     disabled={mode === MODE_EDIT}
      //     type="primary"
      //     danger
      //     onClick={() => handleClickDelete(index)}
      //   >
      //     {t('Button.DELETE')}
      //   </Button>,
      // ],
      render: (text, record, index) => {
        if (mode === MODE_EDIT) {
          return [
            <>
              <Row className="row-flex">
                <Col span={12}>
                  <Button key="1" type="primary" size="small">
                    {t('Button.EDIT')}
                  </Button>
                </Col>
                <Col span={12}>
                  <ButtonDeleteBase
                    disabled={mode === MODE_EDIT}
                    onConfirm={() => handleClickDeleteEdit(record, index)}
                    loading={false}
                    size="small"
                    key="2"
                  />
                </Col>
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
      render: (text, record: any, index) => {
        return <span>{record?.name}</span>;
      },
    },
    {
      title: t('translation:Title.INFORMATION'),
      key: 'quantity',
      // editable: true,
      render: (text, record: any, index) => {
        return <span>{`${record?.quantity} - ${record?.unit}`}</span>;
      },
    },
  ];

  return (
    <>
      <Row gutter={4}>
        <Col span={mode === MODE_EDIT ? 24 : 16}>
          <Card
            title={t('constant:Title.INSTANCE_INFO')}
            bordered={false}
            style={{ height: '100%' }}
          >
            <Table
              columns={newColums}
              dataSource={dataSource ? dataSource : []}
              // tableStyle={{ overflow: 'scroll' }}
              scroll={{ x: 1500 }}
              style={{ whiteSpace: 'pre' }}
              rowKey={record => record.id}
              pagination={{
                showQuickJumper: true,
                pageSize: 10,
              }}
              // search={false}
              // dateFormatter="string"
              // options={false}
            />
          </Card>
        </Col>

        {mode !== MODE_EDIT && mode !== MODE_EXTEND && (
          <Col span={8}>
            <Card
              // title={t('translation:Title.ADDITIONAL_SERVICE_INFORMATION')}
              title={'TOTAL'}
              bordered={false}
              style={{ height: '100%' }}
            >
              <ProTable<TableListExtend>
                bordered
                columns={columsExtendService}
                dataSource={
                  dataExtendServiceInformation
                    ? dataExtendServiceInformation
                    : []
                }
                // tableStyle={{ overflow: 'scroll' }}

                rowKey={record => String(record.id)}
                pagination={false}
                // pagination={{
                //   showQuickJumper: true,
                //   pageSize: 10,
                // }}
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
            <Button onClick={handleClickCancel}>{t('Button.CANCEL')}</Button>
          </Space>
        </Row>
      )}
    </>
  );
}
