import {
  Button,
  Card,
  Col,
  Form,
  Input,
  Row,
  Switch,
  Select,
  Spin,
} from 'antd';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useRouteMatch } from 'react-router';
import {
  selectLoading,
  selectNotice,
  selectParams,
  selectProduct,
} from './selectors';
import { actions } from './slice';
import { RESOURCE_TYPE, CN_TYPE } from './constants';
import { formatMoney } from 'utils/constant';

export default function Product() {
  const [isChecked, setIsChecked] = useState(false);

  const product = useSelector(selectProduct);

  const loading = useSelector(selectLoading)?.get;
  const notice = useSelector(selectNotice);
  const paramsRedux = useSelector(selectParams);

  const match: any = useRouteMatch();
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const { t } = useTranslation(['constant', 'translation']);
  const history = useHistory();

  const layout = {
    labelCol: { lg: 6, md: 4, xs: 6 },
    wrapperCol: { lg: 6, md: 8, xs: 12 },
  };

  const rules = {
    rules: [{ required: true, message: t('Field_Message.REQUIRED_FIELD') }],
  };

  //convert list object to arr
  const dataSelect_ResourceType = Object.values(RESOURCE_TYPE);

  const dataSelect_CnType = Object.values(CN_TYPE);

  useEffect(() => {
    if (!product || product === null) {
      dispatch(actions.setData({ productId: match.params.productId }));
      dispatch(actions.loadProduct());
    }
  }, [dispatch, product, match]);

  useEffect(() => {
    if (notice === t('translation:Message.UPDATE_PRODUCT_SUCCESS')) {
      if (paramsRedux) {
        dispatch(actions.queryProducts());
      }
      dispatch(actions.setProducts(null));
      history.push('/dashboard/products');
    }
  }, [notice, paramsRedux, dispatch, history, t]);

  useEffect(() => {
    if (product) {
      let newProduct = {
        ...product,
        resource_type: product?.type,
        price: formatMoney(`${product?.maintenance_fee + product?.init_fee}`),
      };
      // delete newProduct.Type;
      newProduct = {
        ...newProduct,
        ...(product?.data ? product?.data : product),
      };
      form.setFieldsValue({
        ...newProduct,
      });
      setIsChecked(product?.data ? product?.data?.is_base : product?.is_base);
    }
  }, [form, product]);

  const onFinish = value => {
    let data;
    data = {
      name: value?.name,
      cn: value?.cn,
      type: value?.resource_type,
      is_base: value?.is_base,
      data: {
        arch: value?.arch,
        type: value?.type,
        version: value?.version,
        platform: value?.platform,
        backend_name: value?.backend_name,
      },
    };
    dispatch(
      actions.setData({ data: data, productId: match.params.productId }),
    );
    dispatch(actions.updateProduct());
  };

  if (loading) {
    return <Spin />;
  }

  return (
    <Form
      form={form}
      {...layout}
      layout="horizontal"
      labelAlign="left"
      scrollToFirstError={true}
      onFinish={onFinish}
    >
      <Card bordered={false} style={{ height: '100%', minHeight: '76vh' }}>
        <Form.Item name="name" label={t('Label.NAME')} {...rules}>
          <Input></Input>
        </Form.Item>

        <Form.Item name="cn" label={t('Label.CN')} {...rules}>
          <Select placeholder={t('translation:Label.CN')}>
            {dataSelect_CnType?.length > 0 &&
              dataSelect_CnType?.map(item => (
                <Select.Option value={item} key={item}>
                  {item}
                </Select.Option>
              ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="resource_type"
          label={t('Label.RESOURCE_TYPE')}
          {...rules}
        >
          <Select placeholder={t('translation:Label.RESOURCE_TYPE')}>
            {dataSelect_ResourceType?.length > 0 &&
              dataSelect_ResourceType?.map(item => (
                <Select.Option value={item} key={item}>
                  {item}
                </Select.Option>
              ))}
          </Select>
        </Form.Item>

        <Form.Item name="price" label={t('Label.PRICE')}>
          <Input disabled></Input>
        </Form.Item>
        {product?.cn === 'image' && (
          <>
            <Form.Item name="arch" label={t('Label.ARCH')}>
              <Input></Input>
            </Form.Item>
            <Form.Item name="type" label={t('Label.IMAGE_TYPE')}>
              <Input></Input>
            </Form.Item>
            <Form.Item name="version" label={t('Label.VERSION')}>
              <Input></Input>
            </Form.Item>
            <Form.Item name="platform" label={t('Label.PLATFORM')}>
              <Input></Input>
            </Form.Item>
            <Form.Item name="backend_name" label={t('Label.BACKEND_NAME')}>
              <Input></Input>
            </Form.Item>
          </>
        )}
        <Form.Item name="is_base" label={t('Label.IS_BASE')}>
          <Switch
            checked={isChecked}
            disabled
            // onChange={() => setIsChecked(!isChecked)}
          ></Switch>
        </Form.Item>
        <Col span={12}>
          <Row justify="center">
            <Form.Item htmlFor="submit">
              <Button type="primary" htmlType="submit" loading={loading}>
                {t('translation:Button.UPDATE')}
              </Button>
            </Form.Item>
          </Row>
        </Col>
      </Card>
    </Form>
  );
}
