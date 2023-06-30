import ProTable, { ProColumns } from '@ant-design/pro-table';
import { Button, Form, Modal, Row, Select, TimePicker } from 'antd';
import ButtonDeleteBase from 'app/components/ButtonDeleteBase';
import moment from 'moment';
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import {
  selectData,
  selectLoading,
  selectSnapshotSchedule,
  selectSnapshotSchedules,
} from '../selector';
import { actions } from '../slice';

const { Option } = Select;

interface TableListSchedules {
  id: number;
  days_of_week: string;
  start_time: number;
  compute_id: string;
}

interface props {
  visible: boolean;
  hideModal: () => void;
  instanceId?: string;
}

const tailLayout = {
  wrapperCol: { offset: 0, span: 16 },
};

export default function ScheduleFormSnapshot({
  visible,
  hideModal,
  instanceId,
}: props) {
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const { t } = useTranslation(['translation', 'constant']);

  const loadingCreate = useSelector(selectLoading)?.createSchedule;
  const loadingGet = useSelector(selectLoading)?.getSchedules;
  const snapshotSchedule = useSelector(selectSnapshotSchedule);
  const snapshotScheduleList = useSelector(selectSnapshotSchedules);
  const data = useSelector(selectData);

  // useEffect(() => {
  //   dispatch(actions.setData({ instanceId }));
  //   dispatch(actions.getSnapshotSchedules());
  // }, [dispatch, instanceId]);

  // useEffect(() => {
  //   if (snapshotSchedule) {
  //     dispatch(actions.setData({ instanceId }));
  //     dispatch(actions.getSnapshotSchedules());
  //     form.resetFields();
  //   }
  // }, [dispatch, snapshotSchedule, form, instanceId]);

  const onFinish = values => {
    const { start_time } = values;
    const HH = moment(start_time).format('HH');
    const MM = moment(start_time).format('mm');
    const time = parseInt(HH) * 60 + parseInt(MM);
    values.start_time = time;

    dispatch(
      actions.setData({ instanceId, data: { ...values, type: 'SNAPSHOT' } }),
    );

    dispatch(actions.createSnapshotSchedule());
  };

  const onFinishFailed = errorInfo => {
    console.log('Failed:', errorInfo);
  };

  const columns: ProColumns<TableListSchedules>[] = [
    {
      title: t('constant:Title.NO'),
      dataIndex: 'index',
      valueType: 'indexBorder',
      width: 48,
    },
    {
      title: t('constant:Title.ID'),
      dataIndex: 'id',
    },
    {
      title: t('constant:Title.DAYS'),
      dataIndex: 'days_of_week',
      // render: (text, record) => {
      //   const day = record.days_of_week;
      //   const days = day.split(',');
      //   return days.map(item => item[0].toUpperCase).join(', ');
      // },
    },
    {
      title: t('constant:Title.CREATE_DATE'),
      width: 140,
      key: 'createDate',
      dataIndex: 'start_time',
      render: (text, record) => {
        const time = record.start_time;
        let mm: any = time % 60;
        let HH: any = (time - mm) / 60;

        if (HH < 10) HH = `0${HH}`;
        if (mm < 10) mm = `0${mm}`;

        return `${HH}:${mm}`;
      },
    },
    {
      title: t('constant:Title.ACTIONS'),
      width: 180,
      key: 'option',
      valueType: 'option',
      render: (text, record, index) => [
        <ButtonDeleteBase
          key={`delete${index}`}
          loading={data ? data.index === index : false}
          onConfirm={() => {
            handleClickDelete(record, index);
          }}
        />,
      ],
    },
  ];

  const handleClickDelete = (record, index) => {
    dispatch(actions.setData({ instanceId, index, scheduleId: record.id }));
    dispatch(actions.deleteScheduleSnapshot());
  };

  return (
    <>
      <Modal
        width={600}
        visible={visible}
        title={t('constant:Title.SCHEDULE_FORM_SNAPSHOT')}
        onCancel={hideModal}
        footer={[
          <Button key="back" onClick={hideModal}>
            {t('constant:Button.CANCEL')}
          </Button>,
        ]}
      >
        <Row>
          <Form
            form={form}
            layout="vertical"
            name="createSchedule"
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            style={{ width: '100%' }}
          >
            <Form.Item
              label={t('constant:Label.DAYS')}
              name="days_of_week"
              rules={[
                {
                  required: true,
                  message: t('Field_Message.REQUIRED_FIELD'),
                },
              ]}
            >
              <Select
                mode="multiple"
                placeholder={t('constant:Placeholder.SELECT_ONE_DAY')}
                optionLabelProp="label"
                size="large"
              >
                <Option value="Mon" label="Monday">
                  <div>Monday</div>
                </Option>
                <Option value="Tue" label="Tuesday">
                  <div>Tuesday</div>
                </Option>
                <Option value="Wed" label="Wednesday">
                  <div>Wednesday</div>
                </Option>
                <Option value="Thu" label="Thursday">
                  <div>Thursday</div>
                </Option>
                <Option value="Fri" label="Friday">
                  <div>Friday</div>
                </Option>
                <Option value="Sat" label="Saturday">
                  <div>Saturday</div>
                </Option>
                <Option value="Sun" label="Sunday">
                  <div>Sunday</div>
                </Option>
              </Select>
            </Form.Item>
            <Form.Item
              label={t('constant:Label.Time')}
              name="start_time"
              initialValue={moment('00:00', 'HH:mm')}
              rules={[
                {
                  required: true,
                  message: t('Field_Message.REQUIRED_FIELD'),
                },
              ]}
            >
              <TimePicker
                style={{ width: '100%' }}
                format="HH:mm"
                size="large"
              />
            </Form.Item>
            <Form.Item {...tailLayout}>
              <Button type="primary" loading={loadingCreate} htmlType="submit">
                {t('constant:Button.CREATE')}
              </Button>
            </Form.Item>
          </Form>
        </Row>
        <ProTable<TableListSchedules>
          columns={columns}
          dataSource={snapshotScheduleList}
          loading={loadingGet}
          rowKey={record => String(record.id)}
          pagination={{
            showQuickJumper: true,
            pageSize: 10,
          }}
          search={false}
          dateFormatter="string"
        />
      </Modal>
    </>
  );
}
