import { Button, Card, Col, Form, Row } from 'antd';
import ContractFormBase from 'app/components/ContractFormBase';
import moment from 'moment';
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { autoFillToDurationField, fillValuesToForm } from 'utils/common';
import { noticficationBase } from 'utils/constant';
import { Effect } from './Effect';
import {
  selectContract,
  selectLoading,
  selectLoadingQuery,
  selectMode,
  selectShowBtnCreateContract,
} from './selectors';
import { actions } from './slice';

const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
};
interface props {
  enableBtnNext: (bol) => void;
}

export default function InfoService({ enableBtnNext }: props) {
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const { t } = useTranslation();

  const showBtnCreateContract = useSelector(selectShowBtnCreateContract);

  const mode = useSelector(selectMode);
  const contract = useSelector(selectContract);

  // console.log('duogn InfoService : contract', contract);

  const loading = useSelector(selectLoading);
  const loadingQuery = useSelector(selectLoadingQuery);

  const onFinish = values => {
    const { region_id } = values;
    values.end_at = values.end_at.format('YYYY-MM-DD');
    values.start_at = values.start_at.format('YYYY-MM-DD');

    dispatch(actions.contractLoaded({ current: values }));
    dispatch(actions.setRegion(region_id));
    enableBtnNext(true);

    noticficationBase(
      'success',
      `Contract: ${
        values?.contract_code ? values?.contract_code : 'Trial'
      } create success`,
    );
  };

  const handleBlurContract = e => {
    const searchTerm = e.target.value;
    if (searchTerm && contract.current?.contract_code !== searchTerm) {
      dispatch(actions.setContractCode(e.target.value));
      dispatch(actions.loadContract());
    }
  };

  const onFieldsChange = (changedFields, allFields) =>
    autoFillToDurationField(changedFields, allFields, form);

  //Reset Error
  useEffect(() => {
    dispatch(actions.setError(null));
  }, [dispatch]);

  //Enable BtnNext
  useEffect(() => {
    if (!contract.current) enableBtnNext(false);
  }, [contract]);

  //fill values to form
  useEffect(() => {
    if (contract.current) {
      const values = {
        ...contract.current,
        ...contract.current.co_sale,
        // order_type: 'BUY',
      };
      values.start_at = moment(values.start_at);
      values.end_at = moment(values.end_at);
      fillValuesToForm(values, form);
    } else {
      form.resetFields();
    }
  }, [contract, form]);

  return (
    <Effect>
      <Form
        form={form}
        name="infoService"
        layout="horizontal"
        {...layout}
        labelAlign="left"
        onFinish={onFinish}
        onFieldsChange={(changedFields, allFields) =>
          onFieldsChange(changedFields, allFields)
        }
      >
        <Row>
          {/* Thong tin dich vu */}
          <Col span={18} push={3}>
            <Card
              title={t('Title.SERVICE_INFO')}
              bordered={false}
              style={{ height: '100%' }}
            >
              <ContractFormBase
                loading={loadingQuery}
                handleBlurContract={handleBlurContract}
              />
            </Card>
          </Col>
        </Row>
        <Row justify="center" style={{ marginTop: 8 }}>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              disabled={showBtnCreateContract}
            >
              {mode === 'update' ? 'Update' : 'Create'}
            </Button>
          </Form.Item>
        </Row>
      </Form>
    </Effect>
  );
}
