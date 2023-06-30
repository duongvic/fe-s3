import { Col, Row, Select, Space, Typography } from 'antd';
import Item from 'antd/lib/list/Item';
import { MemorizedChartBase } from 'app/components/ChartBase';
import empty from 'is-empty';
import moment from 'moment';
import React, { memo, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { chartBlue, chartOrange } from '../constants';
import { selectLoading, selectMonitorLog } from '../selector';
import { actions, defaultState } from '../slice';
import './styles.less';

const { Option } = Select;

function MonitorLog() {
  const [date, setDate] = useState({
    start: moment().subtract(1, 'days').format(),
    end: moment().format(),
  });
  const [step, setStep] = useState('1m');

  const dispatch = useDispatch();
  const { instanceId }: any = useParams();
  const { t } = useTranslation(['translation', 'constant']);

  const monitorLog = useSelector(selectMonitorLog);
  const loading = useSelector(selectLoading)?.monitorLog;

  const convertData = data => {
    const gmt = 60 * 60 * 7;
    if (!empty(data)) {
      return data.map(item => ({ time: item[0] + gmt, value: item[1] }));
    }
    return [];
  };

  const timeOption = [
    { title: t('TimeOption.1_HOUR_AGO'), value: 60 * 60 },
    { title: t('TimeOption.6_HOURS_AGO'), value: 60 * 60 * 6 },
    { title: t('TimeOption.12_HOURS_AGO'), value: 60 * 60 * 12 },
    { title: t('TimeOption.24_HOURS_AGO'), value: 60 * 60 * 24 },
    { title: t('TimeOption.2_DAYS_AGO'), value: 60 * 60 * 24 * 2 },
    { title: t('TimeOption.7_DAYS_AGO'), value: 60 * 60 * 24 * 7 },
    { title: t('TimeOption.15_DAYS_AGO'), value: 60 * 60 * 24 * 15 },
    { title: t('TimeOption.1_MONTH_AGO'), value: 60 * 60 * 24 * 30 },
    // { title: t('TimeOption.6_MONTH_AGO'), value: 60 * 60 * 24 * 30 * 6 },
    // { title: t('TimeOption.1_YEAR_AGO'), value: 60 * 60 * 24 * 30 * 12 },
  ];

  const { cpu, ram, disk, network, iops } = monitorLog;
  const dataCPU = convertData(cpu);
  const dataRam = convertData(ram);
  const dataDiskRead = convertData(disk?.read).map(item => ({
    ...item,
    value: item.value / 1024 / 1024,
  }));
  const dataDiskWrite = convertData(disk?.write).map(item => ({
    ...item,
    value: item.value / 1024 / 1024,
  }));
  const dataNetworkReceiver = convertData(network?.receiver).map(item => ({
    ...item,
    value: item.value / 1024,
  }));
  const dataNetworkTransfer = convertData(network?.transfer).map(item => ({
    ...item,
    value: item.value / 1024,
  }));
  const dataIopsReceiver = convertData(iops?.receiver);
  const dataIopsTransfer = convertData(iops?.transfer);

  const linesCPU = [
    {
      title: t('constant:Title.CPU'),
      style: chartBlue,
      data: dataCPU,
    },
  ];
  const linesRam = [
    { title: t('constant:Title.RAM'), style: chartBlue, data: dataRam },
  ];
  const linesDisk = [
    {
      title: t('constant:Title.DISK_READ'),
      style: chartBlue,
      data: dataDiskRead,
    },
    {
      title: t('constant:Title.DISK_WRITE'),
      style: chartOrange,
      data: dataDiskWrite,
    },
  ];
  const linesNetworkReceiver = [
    {
      title: t('constant:Title.NETWORK_RECEIVER'),
      style: chartBlue,
      data: dataNetworkReceiver,
    },
  ];
  const linesNetworkTransfer = [
    {
      title: t('constant:Title.NETWORK_TRANSFER'),
      style: chartOrange,
      data: dataNetworkTransfer,
    },
  ];

  const linesIops = [
    {
      title: t('constant:Title.IOPS_RECEIVER'),
      style: chartBlue,
      data: dataIopsReceiver,
    },
    {
      title: t('constant:Title.IOPS_TRANSFER'),
      style: chartOrange,
      data: dataIopsTransfer,
    },
  ];

  useEffect(() => {
    if (cpu?.length === 0) {
      const start = moment().unix() - 60 * 60;
      const end = moment().unix();
      dispatch(
        actions.setData({
          step: step,
          computeId: instanceId,
          start: start,
          end: end,
        }),
      );
      dispatch(actions.getMonitorLog());
    }
  }, []);

  useEffect(() => {
    return () => {
      dispatch(actions.monitorLogGetted(defaultState.monitorLog));
    };
  }, []);

  // const convertDate = value => {
  //   if (Array.isArray(value)) {
  //     setDate({
  //       start: moment(value[0]._d).format('YYYY-MM-DD') + ' 00:00:00',
  //       end: moment(value[1]._d).format('YYYY-MM-DD') + ' 23:59:59',
  //     });
  //   } else {
  //     let day = moment(value).format('YYYY-MM-DD');
  //     setDate({
  //       start: day + ' 00:00:00',
  //       end: day + ' 23:59:59',
  //     });
  //   }
  // };

  // const handleClickSearch = () => {
  //   const start = moment(date.start).unix();
  //   const end = moment(date.end).unix();

  //   dispatch(
  //     actions.setData({
  //       step: step,
  //       computeId: instanceId,
  //       start: start,
  //       end: end,
  //     }),
  //   );
  //   dispatch(actions.getMonitorLog());
  // };

  // const getTypePicker = () => {
  //   if (step === '30m' || step === '1h' || step === '1d') {
  //     return (
  //       <DatePicker.RangePicker
  //         defaultValue={[moment(), moment()]}
  //         format={'DD-MM-YYYY'}
  //         onChange={value => convertDate(value)}
  //       />
  //     );
  //   }
  //   return (
  //     <>
  //       <DatePicker
  //         defaultValue={moment()}
  //         format={'DD-MM-YYYY'}
  //         onChange={value => convertDate(value)}
  //       />
  //     </>
  //   );
  // };

  const onChange = value => {
    const start = moment().unix() - value;
    const end = moment().unix();
    value /= 60;
    let step: any = null;
    if (value / 1 < 600) step = '1m';
    else if (500 < value && value / 3 < 600) step = '3m';
    else if (500 < value && value / 5 < 600) step = '5m';
    else if (500 < value && value / 30 < 600) step = '30m';
    else if (500 < value && value / 60 < 600) step = '1h';
    else step = '1d';
    // console.log(instanceId, start, end, step);

    dispatch(
      actions.setData({
        step: step,
        computeId: instanceId,
        start: start,
        end: end,
      }),
    );
    dispatch(actions.getMonitorLog());
  };
  const inputDate = (
    <Row justify="center">
      {/* <Select defaultValue="1m" onChange={setStep} style={{ width: '6rem' }}>
        {LogType.map((item, index) => (
          <Option key={index} value={item.value}>
            {item.text}
          </Option>
        ))}
      </Select> */}
      <Select
        loading={loading}
        placeholder="SELECT DATE"
        onSelect={onChange}
        style={{ width: '25rem' }}
        defaultValue={timeOption[0].value}
      >
        {timeOption.map(item => (
          <Option key={item.title} value={item.value}>
            {item.title}
          </Option>
        ))}
      </Select>
      {/* {getTypePicker()}
      <Button onClick={handleClickSearch} loading={loading}>
        Tìm kiếm
      </Button> */}
    </Row>
  );

  return (
    <>
      {inputDate}
      <Row style={{ marginTop: '1rem' }} gutter={[16, 32]}>
        <Col span={12}>
          <div className="container-flex">
            <Typography.Title level={3}>CPU</Typography.Title>
            <Space>
              <Typography className="title-blue">CPU</Typography>
              <div className="btn-blue"></div>
            </Space>
            <MemorizedChartBase lines={linesCPU} />
          </div>
        </Col>
        <Col span={12}>
          <div className="container-flex">
            <Typography.Title level={3}>Ram</Typography.Title>
            <Space>
              <Typography className="title-blue">Ram</Typography>
              <div className="btn-blue"></div>
            </Space>
            <MemorizedChartBase lines={linesRam} />
          </div>
        </Col>
        <Col span={12}>
          <div className="container-flex">
            <Typography.Title level={3}>Disk</Typography.Title>
            <Space>
              <Space>
                <Typography className="title-blue">Disk Read</Typography>
                <div className="btn-blue"></div>
              </Space>
              <Space>
                <Typography className="title-orange">Disk Write</Typography>
                <div className="btn-orange"></div>
              </Space>
            </Space>
            <MemorizedChartBase lines={linesDisk} />
          </div>
        </Col>

        <Col span={12}>
          <div className="container-flex">
            <Typography.Title level={3}>Iops</Typography.Title>
            <Space>
              <Space>
                <Typography className="title-blue">Receiver</Typography>
                <div className="btn-blue"></div>
              </Space>
              <Space>
                <Typography className="title-orange">Transfer</Typography>
                <div className="btn-orange"></div>
              </Space>
            </Space>
            <MemorizedChartBase lines={linesIops} />
          </div>
        </Col>

        <Col span={12}>
          <div className="container-flex">
            <Typography.Title level={3}>Network Receiver</Typography.Title>
            <Space>
              <Typography className="title-blue">Network Receiver</Typography>
              <div className="btn-blue"></div>
            </Space>
            <MemorizedChartBase lines={linesNetworkReceiver} />
          </div>
        </Col>
        <Col span={12}>
          <div className="container-flex">
            <Typography.Title level={3}>Network Transfer</Typography.Title>
            <Space>
              <Typography className="title-orange">Network Transfer</Typography>
              <div className="btn-orange"></div>
            </Space>
            <MemorizedChartBase lines={linesNetworkTransfer} />
          </div>
        </Col>
      </Row>
    </>
  );
}

export const MomorizedMonitorLog = memo(MonitorLog);
