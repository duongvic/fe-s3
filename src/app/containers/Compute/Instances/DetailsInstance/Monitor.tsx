import { Col, Row, Space, Typography } from 'antd';
import { MemorizedRealtimeChartBase } from 'app/components/RealtimeChartBase';
import empty from 'is-empty';
import moment from 'moment';
import React, { memo, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { chartBlue, chartOrange, Status } from '../constants';
import { selectCompute, selectMonitor } from '../selector';
import { actions } from '../slice';
import './styles.less';

function Monitor() {
  const dispatch = useDispatch();
  const { instanceId }: any = useParams();
  const ref = useRef<any>({ intervalId: null });
  const { t } = useTranslation('constant');

  const refCurrent = ref.current;

  const monitor = useSelector(selectMonitor);
  const statusCompute = useSelector(selectCompute)?.status;
  const getMonitor = () => {
    dispatch(
      actions.setDataGetMonitor({
        computeId: instanceId,
        step: '1m',
        start: moment().unix(),
        end: moment().unix(),
      }),
    );
    dispatch(actions.getMonitor());
  };
  const stopInterval = () => {
    if (refCurrent.intervalId) {
      clearInterval(refCurrent.intervalId);
    }
  };

  useEffect(() => {
    if (statusCompute === Status.ACTIVE.text) {
      getMonitor();
      stopInterval();
      refCurrent.intervalId = setInterval(() => {
        getMonitor();
      }, 60 * 1000);
    } else {
      stopInterval();
    }
    return () => {
      stopInterval();
    };
  }, [statusCompute]);

  const convertDataUpdate = (data, unit?) => {
    if (!empty(data)) {
      const gmt = 60 * 60 * 7;
      const value = unit
        ? `${(Number(data[0][1]) / 1048576).toFixed(2)}`
        : data[0][1];
      return {
        time: data[0][0] + gmt,
        value: value,
      };
    }
    return null;
  };

  const updateCPU = convertDataUpdate(monitor.cpu);
  const updateRam = convertDataUpdate(monitor.ram);
  const updateDiskRead = convertDataUpdate(monitor.disk.read, 'MBps');
  const updateDiskWrite = convertDataUpdate(monitor.disk.write, 'MBps');
  const updateNetworkReceiver = convertDataUpdate(
    monitor.network.receiver,
    'Mbps',
  );
  const updateNetworkTransfer = convertDataUpdate(
    monitor.network.transfer,
    'Mbps',
  );
  const updateIopsReceiver = convertDataUpdate(monitor.iops.receiver);
  const updateIopsTransfer = convertDataUpdate(monitor.iops.transfer);

  const linesCPU = [
    { title: t('Title.CPU'), style: chartBlue, data: [], update: updateCPU },
  ];
  const linesRam = [
    { title: t('Title.RAM'), style: chartBlue, data: [], update: updateRam },
  ];
  const linesDisk = [
    {
      title: t('Title.DISK_READ'),
      style: chartBlue,
      data: [],
      update: updateDiskRead,
    },
    {
      title: t('Title.DISK_WRITE'),
      style: chartOrange,
      data: [],
      update: updateDiskWrite,
    },
  ];
  const linesNetworkReceiver = [
    {
      title: t('Title.NETWORK_RECEIVER'),
      style: chartBlue,
      data: [],
      update: updateNetworkReceiver,
    },
  ];
  const linesNetworkTransfer = [
    {
      title: t('Title.NETWORK_TRANSFER'),
      style: chartOrange,
      data: [],
      update: updateNetworkTransfer,
    },
  ];
  const linesIops = [
    {
      title: t('Title.IOPS_RECEIVER'),
      style: chartBlue,
      data: [],
      update: updateIopsReceiver,
    },
    {
      title: t('Title.IOPS_TRANSFER'),
      style: chartOrange,
      data: [],
      update: updateIopsTransfer,
    },
  ];

  return (
    <Row gutter={[16, 32]} style={{ marginTop: 16 }}>
      <Col span={12}>
        <div className="container-flex">
          <Typography.Title level={3}>{t('Title.CPU')}</Typography.Title>
          <Space>
            <Typography className="title-blue">{t('Title.CPU')}</Typography>
            <div className="btn-blue"></div>
          </Space>
          <MemorizedRealtimeChartBase lines={linesCPU} />
        </div>
      </Col>

      <Col span={12}>
        <div className="container-flex">
          <Typography.Title level={3}>{t('Title.RAM')}</Typography.Title>
          <Space>
            <Typography className="title-blue">{t('Title.RAM')}</Typography>
            <div className="btn-blue"></div>
          </Space>
          <MemorizedRealtimeChartBase lines={linesRam} />
        </div>
      </Col>

      <Col span={12}>
        <div className="container-flex">
          <Typography.Title level={3}>{t('Title.DISK')}</Typography.Title>
          <Space>
            <Space>
              <Typography className="title-blue">
                {t('Title.DISK_READ')}
              </Typography>
              <div className="btn-blue"></div>
            </Space>
            <Space>
              <Typography className="title-orange">
                {t('Title.DISK_WRITE')}
              </Typography>
              <div className="btn-orange"></div>
            </Space>
          </Space>
          <MemorizedRealtimeChartBase lines={linesDisk} />
        </div>
      </Col>

      <Col span={12}>
        <div className="container-flex">
          <Typography.Title level={3}>{t('Title.IOPS')}</Typography.Title>
          <Space>
            <Space>
              <Typography className="title-blue">
                {t('Title.IOPS_RECEIVER')}
              </Typography>
              <div className="btn-blue"></div>
            </Space>
            <Space>
              <Typography className="title-orange">
                {t('Title.IOPS_TRANSFER')}
              </Typography>
              <div className="btn-orange"></div>
            </Space>
          </Space>
          <MemorizedRealtimeChartBase lines={linesIops} />
        </div>
      </Col>

      <Col span={12}>
        <div className="container-flex">
          <Typography.Title level={3}>
            {t('Title.NETWORK_RECEIVER')}
          </Typography.Title>
          <Space>
            <Typography className="title-blue">
              {t('Title.NETWORK_RECEIVER')}
            </Typography>
            <div className="btn-blue"></div>
          </Space>
          <MemorizedRealtimeChartBase lines={linesNetworkReceiver} />
        </div>
      </Col>

      <Col span={12}>
        <div className="container-flex">
          <Typography.Title level={3}>
            {t('Title.NETWORK_TRANSFER')}
          </Typography.Title>
          <Space>
            <Typography className="title-orange">
              {t('Title.NETWORK_TRANSFER')}
            </Typography>
            <div className="btn-orange"></div>
          </Space>
          <MemorizedRealtimeChartBase lines={linesNetworkTransfer} />
        </div>
      </Col>
    </Row>
  );
}

export const MemorizedMonitor = memo(Monitor);
