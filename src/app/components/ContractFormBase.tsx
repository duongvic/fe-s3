import React, { useState, useCallback } from 'react';
import { LoadingOutlined } from '@ant-design/icons';
import {
  Col,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Row,
  Select,
  // Space,
  Spin,
  Typography,
} from 'antd';
import { OrderType, Status } from 'app/containers/Orders/constants';
import {
  selectRegion,
  selectRegions,
  selectContract,
} from 'app/containers/Orders/selectors';
import { actions } from 'app/containers/Orders/slice';
import {
  MODE_EDIT,
  MODE_EXTEND,
  MODE_RENEW,
} from 'app/containers/Users/constants';
// import { format } from 'prettier';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { formatMoney, moneyFormatter } from 'utils/constant';
import moment from 'moment';

const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;
const { Option } = Select;
const { Text } = Typography;

// const selectorMoney = (
//   <Form.Item name="money" noStyle>
//     <Select style={{ width: 100 }} defaultValue="vnd">
//       <Option value="vnd">VND</Option>
//       <Option value="usd">USD</Option>
//     </Select>
//   </Form.Item>
// );

interface Props {
  loading?: boolean;
  handleBlurContract?: any;
  mode?: string;
}

export default function ContractFormBase({
  loading,
  handleBlurContract,
  mode,
}: Props) {
  const { t } = useTranslation(['translation', 'constant']);
  const dispatch = useDispatch();
  // const [form] = Form.useForm();

  const contract = useSelector(selectContract);

  const regions = useSelector(selectRegions);
  const region = useSelector(selectRegion);

  const optionRegion = regions?.map(region => (
    <Option value={region?.id} key={region?.id}>
      {region?.name}
    </Option>
  ));

  const [showContractNo, setShowContractNo] = useState(true);

  const handleChangeOrderType = e => {
    const orderType = e;
    if (orderType && orderType === OrderType.TRIAL) {
      setShowContractNo(false);
    } else {
      setShowContractNo(true);
    }
  };

  const onSelect = value => {
    dispatch(actions.setRegion(value));
  };

  const disabledStartDate = useCallback(
    value => {
      const endDate = contract?.current?.end_at;
      const nowDate = moment().format('YYYY-MM-DD');
      if (mode === MODE_RENEW) {
        if (moment(nowDate).isBefore(endDate)) {
          const remaining =
            new Date(endDate).getTime() - new Date(nowDate).getTime();
          const days = Math.floor(remaining / 86400 / 1000);
          return value && value < moment().add(days, 'day');
        } else {
          return value && value < moment().subtract(1, 'day');
        }
      }
      return false;
    },
    [mode, contract],
  );

  return (
    <>
      {showContractNo && (
        <Form.Item
          name="contract_code"
          label={t('translation:Label.CONTRACT_NO')}
          rules={[
            {
              required: true,
              message: t('translation:Field_Message.CONTRACT_NO'),
              whitespace: true,
            },
          ]}
        >
          <Input
            disabled={mode === MODE_RENEW ? true : false}
            placeholder={t('translation:Placeholder.CONTRACT_NO')}
            onBlur={handleBlurContract}
            suffix={loading ? <Spin indicator={antIcon} /> : null}
          />
        </Form.Item>
      )}

      {mode === MODE_EDIT && (
        <Form.Item
          name="code"
          label={t('Title.ORDER_CODE')}
          rules={[
            {
              required: true,
              message: t('translation:Field_Message.INVALID_ORDER_CODE'),
              whitespace: true,
            },
          ]}
        >
          <Input
            disabled={true}
            placeholder={t('Title.ORDER_CODE')}
            // onBlur={handleBlurContract}
            suffix={loading ? <Spin indicator={antIcon} /> : null}
          />
        </Form.Item>
      )}

      <Form.Item
        initialValue={region}
        name="region_id"
        label={t('translation:Title.AREA')}
      >
        <Select
          value={region}
          // style={{ width: 80 }}
          onSelect={onSelect}
          loading={loading}
        >
          {optionRegion}
        </Select>
      </Form.Item>

      <Form.Item
        initialValue="POOL"
        name="service_type"
        label={t('translation:Field_Message.SERVICE')}
      >
        <Select>
          <Option value="POOL">POOL</Option>
          <Option value="COMPUTE">COMPUTE</Option>
        </Select>
      </Form.Item>

      <Form.Item
        initialValue={OrderType.BUY}
        name="order_type"
        label={t('translation:Label.ORDER_TYPE')}
      >
        {contract?.current?.id > 0 ? (
          <Select
            disabled={
              mode === MODE_RENEW || mode === MODE_EXTEND ? true : false
            }
            onChange={handleChangeOrderType}
          >
            <Option value={OrderType.TRIAL}>
              {t('translation:Button.TRIAL')}
            </Option>
            <Option value={OrderType.BUY}>{t('translation:Button.BUY')}</Option>
            <Option value={OrderType.EXTEND}>
              {t('translation:Button.EXTEND')}
            </Option>
            <Option value={OrderType.RENEW}>
              {t('translation:Button.RENEW')}
            </Option>
          </Select>
        ) : (
          <Select onChange={handleChangeOrderType}>
            <Option value={OrderType.TRIAL}>
              {t('translation:Button.TRIAL')}
            </Option>
            <Option value={OrderType.BUY}>{t('translation:Button.BUY')}</Option>
          </Select>
        )}
      </Form.Item>

      <Form.Item
        name="duration"
        label={t('Label.CONTRACT_DURATION')}
        rules={[
          { required: true, message: t('Field_Message.DURATION_INVALID') },
        ]}
      >
        <InputNumber
          style={{ width: '9rem' }}
          disabled
          parser={(value: any) => value.replace(/[ ngày]\s?|(,*)/g, '')}
          min={0}
          formatter={value =>
            `${value} ngày`.replace(/\B(?=(\d{3})+(?!\d))/g, '')
          }
        />
      </Form.Item>

      <Form.Item
        name="start_at"
        label={t('translation:Label.START_AT')}
        rules={[
          {
            type: 'object',
            required: true,
            message: t('translation:Field_Message.SELECT_TIME'),
          },
        ]}
      >
        <DatePicker disabledDate={disabledStartDate} format="YYYY-MM-DD" />
      </Form.Item>
      <Form.Item
        name="end_at"
        label={t('translation:Label.END_AT')}
        rules={[
          {
            type: 'object',
            required: true,
            message: t('translation:Field_Message.SELECT_TIME'),
          },
        ]}
      >
        <DatePicker disabledDate={disabledStartDate} format="YYYY-MM-DD" />
      </Form.Item>

      <Form.Item
        name="price"
        label={t('translation:Label.CONTRACT_TOTAL')}
        getValueFromEvent={e => moneyFormatter(e)}
        rules={[
          {
            required: true,
            min: 0,
            message: t('translation:Field_Message.CONTRACT_TOTAL'),
          },
        ]}
      >
        {/* <Input
          addonBefore={selectorMoney}
          type="number"
          min={0}
          style={{ width: '100%' }}
          placeholder="Giá trị đơn hàng"
        /> */}
        <Input
          style={{ width: '50%' }}
          // min={0}
          // formatter={value =>
          //   `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
          // }
          // parser={value => String(value).replace(/\$\s?|(,*)/g, '')}
          addonAfter={
            <span
              style={{
                width: '50px',
                display: 'flex',
                justifyContent: 'center',
              }}
            >
              VNĐ
            </span>
          }
        />
      </Form.Item>
      {/* <Form.Item
        initialValue="PAY_COMPLETED"
        name="status"
        label={t('Label.ORDER_STATUS')}
      >
        <Select>
          {Object.keys(Status).map(item => (
            <Option key={item} value={item}>
              {item}
            </Option>
          ))}
        </Select>
      </Form.Item> */}
      <Form.Item
        initialValue="COD"
        name="pmt_type"
        label={t('translation:Label.PAYMENT_TYPE')}
      >
        <Select>
          <Option value="COD">COD</Option>
          <Option value="MONTHLY">MONTHLY</Option>
        </Select>
      </Form.Item>
      <Form.Item
        name="sale_care"
        label={t('translation:Title.SALE_CARE')}
        rules={[
          {
            type: 'email',
            message: t('translation:Invalid_Pattern.EMAIL'),
          },
          {
            required: true,
            message: t('translation:Field_Message.REQUIRED_FIELD'),
            whitespace: true,
          },
        ]}
      >
        <Input placeholder={t('constant:Placeholder.EMAIL')} />
      </Form.Item>
      <Text>Co-Sale:</Text>
      <Row>
        <Col
          span={mode === MODE_EDIT ? 22 : 24}
          offset={mode === MODE_EDIT ? 2 : 0}
        >
          <Form.Item
            labelAlign="right"
            name="department"
            label={t('translation:Title.CENTER')}
          >
            <Input placeholder={t('translation:Title.CENTER')} />
          </Form.Item>
          <Form.Item
            labelAlign="right"
            name="sale"
            label="E-mail"
            rules={[
              {
                type: 'email',
                message: t('Invalid_Pattern.EMAIL'),
              },
            ]}
          >
            <Input placeholder={t('constant:Placeholder.EMAIL')} />
          </Form.Item>
        </Col>
      </Row>
    </>
  );
}
