// import { message } from 'antd';
import path from 'path/api';
import i18next from 'i18next';
import empty from 'is-empty';
import { call, put, select, takeLatest, delay } from 'redux-saga/effects';
import { setConditions } from 'utils/common';
import { request, requestAuthorizationToken, requestToken } from 'utils/request';
import { selectUser, selectQuery } from '../Users/selectors';
import {
  selectContractCode,
  selectData,
  selectOrder,
  selectOrders,
  selectPagination,
  selectParams,
  selectRegions
} from './selectors';
import { actions, defaultState } from './slice';
import moment from 'moment';
import { formatMoney } from 'utils/constant'
import { DiskIOPS, OrderType } from './constants';
import { sortBy, indexOf } from 'lodash';

export function* getOrders() {
  const pagination = yield select(selectPagination);
  const requestUrl = path.orders.orders +
    `?page=${pagination?.current}&pageSize=${pagination?.pageSize}`;
  const options = { method: 'get' };

  const res = yield call(requestAuthorizationToken, requestUrl, options);


  let orderData = res?.data?.rows
  // orderData?.forEach(function (parent) {
  // parent.key = parent.id
  // parent.extended_orders = []
  // orderData.forEach(function (child) {
  //   if (child.ref_order_id === parent.id) {
  //     parent.extended_orders.push(child);
  //   }
  // })
  // })

  // orderData = orderData.filter(order => order.order_type !== 'EXTEND')


  // yield delay(700);
  if (res?.code !== 200) {
    yield put(actions.setError(res?.msg));
  } else {
    yield put(actions.ordersLoaded(orderData));
    yield put(
      actions.setPagination({
        ...pagination,
        // total:
        //   res?.data?.totalPages &&
        //     pagination.total < 629518 * pagination?.pageSize
        //     ? res?.data?.totalPages * pagination?.pageSize
        //     : pagination?.total,
        total: res?.data?.totalRows
        // total: orderData.length
      }),
    );
  }
}

export function* queryOrders() {
  const pagination = yield select(selectPagination);
  const params = yield select(selectParams);
  const condition = setConditions({ ...params });
  const requestUrl = `${path.orders.orders}?${condition}&page=${pagination.current}&pageSize=${pagination.pageSize}`;
  const options = { method: 'get' };

  const res = yield call(requestAuthorizationToken, requestUrl, options);

  let orderData = res?.data?.rows

  orderData?.forEach(function (parent) {
    parent.key = parent.id
    // parent.extended_orders = []
  })

  if (res?.code !== 200) {
    yield put(actions.setError(res?.msg));
  } else {
    yield put(actions.ordersQueried(orderData));
    if (res.data.length === 0)
      yield put(actions.setError(i18next.t('Message.RETURN_ZERO_DATA')));
    yield put(
      actions.setPagination({
        ...pagination,
        // total:
        //   res?.data?.totalPages &&
        //     pagination.total < 629518 * pagination?.pageSize
        //     ? res?.data?.totalPages * pagination?.pageSize
        //     : pagination?.total,
        // total: orderData.length
        total: res?.data?.totalRows
      }),
    );
  }
}

export function* getRegions() {
  const requestUrl = path.regions.regions;
  const options = { method: 'get' };
  const res = yield call(requestAuthorizationToken, requestUrl, options);
  // yield delay(500);
  try {
    if (res?.code !== 200) {
      // yield put(actions.setError(null));
      yield put(actions.setError(res?.msg));
    } else {
      yield put(actions.regionsGetted(res?.data?.rows));
    }
  } catch (error) {
    yield put(actions.setError(error));
  }
}

export function* updateOrder() {

  const data = yield select(selectData);
  const order = yield select(selectOrder);
  // const regions = yield select(selectRegions);
  // const region_name = regions?.find(item => item?.id === data?.region_id).name

  let start_at = new Date(data?.newInfo?.start_at).toISOString();
  let end_at = new Date(data?.newInfo?.end_at).toISOString();

  //Update Order
  const requestUrl = `${path.orders.order}/${data.orderId}`;
  const options = { method: 'PATCH', body: JSON.stringify(data.newInfo) };
  const res = yield call(requestAuthorizationToken, requestUrl, options);
  if (res?.code !== 200) {
    yield put(actions.setError(res?.msg));
  } else {
    yield put(actions.orderUpdated({ ...order, ...res?.data, price: formatMoney(`${res?.data.price}`), start_at: start_at, end_at: end_at }));
    yield put(actions.setNotice(i18next.t('Message.UPDATE_ORDER_SUCCESS')));
  }
}

export function* approveOrder() {

  const data = yield select(selectData);
  const order = yield select(selectOrder);
  const orders = yield select(selectOrders);

  const requestUrl = `${path.orders.order}/${data.orderId}`;
  // const options = { method: 'put', body: JSON.stringify(data.newInfo) };
  // const res = yield call(requestAuthorizationToken, requestUrl, options);
  const options = { method: 'put' };
  const res = yield call(requestAuthorizationToken, requestUrl, options);
  if (res?.code !== 200) {
    yield put(actions.setError(res?.msg));
  } else {
    yield put(actions.orderApproved({ ...order, ...res?.data }));
    yield put(actions.setNotice(i18next.t('Message.APPROVE_SUCCESS')));
    const newOrders = [...orders];
    debugger
    newOrders[data.approve] = res?.data;
    yield put(actions.ordersLoaded(newOrders));
  }
}

export function* deployOrder() {

  const data = yield select(selectData);
  const orders = yield select(selectOrders);
  const requestUrl = `${path.computes.computes}`;
  const options = {
    method: 'post',
    body: JSON.stringify({
      order_id: data.data.order_id,
      availability_zone: data.data.zone,
    }),
  };

  const res = yield call(requestAuthorizationToken, requestUrl, options);
  if (res?.code !== 200) {
    yield put(actions.setError(res?.msg));
  } else {
    yield put(actions.setNotice(i18next.t('Message.DEPLOY_SUCCESS')));
    const order = { ...data.order };
    order.status = 'DEPLOYED';
    const newOrders = [...orders];
    newOrders[data.deploy] = order;
    yield put(actions.ordersLoaded(newOrders));
  }
}

///products?type=OS
export function* getOs() {
  const requestUrl = `${path.orders.os}&page=1&pageSize=1000`;
  const options = { method: 'get' };

  const res = yield call(requestAuthorizationToken, requestUrl, options);

  let dataOS = []
  dataOS = res?.data?.rows?.filter(
    item => item?.cn !== 'no_os',
  );


  if (res?.code !== 200) {
    yield put(actions.setError(res?.msg));
  } else {
    yield put(actions.osLoaded(dataOS));
  }
}

//get instance ?is_base=1
export function* getInstance() {
  const requestUrl = `${path.orders.instance}&page=1&pageSize=1000`;
  const options = { method: 'get' };
  const res = yield call(requestAuthorizationToken, requestUrl, options);
  if (res?.code !== 200) {
    yield put(actions.setError(res?.msg));
  } else {
    const defaultInstance = res?.data?.rows
      ?.filter(item => item.type !== 'OS')
      ?.map(item => {
        const id = item?.id
        const name = item?.name
        const cn = item?.cn
        const unit_id = item?.unit_id
        const product_id = item?.id
        const iops = (item?.name === 'ROOT_DISK' || item?.name === 'DATA_DISK') ? DiskIOPS['5000'] : 0
        const data = (item?.name === 'ROOT_DISK' || item?.name === 'DATA_DISK') ? { iops: iops, volumes: [] } : null
        return { id, cn, name, unit: item?.unit?.name, unit_id: unit_id, product_id, quantity: 0, iops, data };
      });

    var instanceOrder = ["vcpu", "ram", "disk", "root_disk", "data_disk", "ip", "net"];
    var sortedInstance = sortBy(defaultInstance, function (item) {
      return indexOf(instanceOrder, item.cn);
    });

    yield put(actions.instanceLoaded(sortedInstance));
  }
}

// Extend Service is_base=0
export function* getService() {
  const requestUrl = `${path.orders.service}&page=1&pageSize=1000`;
  const options = { method: 'get' };
  const res = yield call(requestAuthorizationToken, requestUrl, options);

  if (res?.code !== 200) {
    yield put(actions.setError(res?.msg));
  } else {
    const defaultService = res?.data?.rows?.map(item => {
      const id = item?.id
      const name = item?.name
      const cn = item?.cn
      const unit_id = item?.unit_id
      const product_id = item?.id
      return { id, cn, name, unit: item?.unit?.name, unit_id: unit_id, product_id, quantity: 0, data: { iops: 0 } };
    });
    var serviceOrder = ["snapshot", "backup", "lb", "vpn", "gpu"];
    const sortedExtendedService = sortBy(defaultService, function (item) {
      return indexOf(serviceOrder, item.cn);
    });
    yield put(actions.serviceLoaded(sortedExtendedService));
  }
}

export function* createOrder() {
  const accoutStorage = localStorage.getItem('account');
  const js_accoutStorage = accoutStorage ? JSON.parse(accoutStorage) : null;
  let staff_id = js_accoutStorage?.id ? parseInt(js_accoutStorage?.id) : null;
  const data = yield select(selectData);
  if (empty(data)) {
    return yield put(actions.setError(i18next.t('Message.DATA_INVALID')));
  }

  const regions = yield select(selectRegions);
  const region_name = regions?.find(item => item?.id === data?.region_id).name

  const start_at = data?.contract?.start_at ? data?.contract?.start_at : undefined;
  const end_at = data?.contract?.end_at ? data?.contract?.end_at : undefined;
  const id_issue_date = data?.customer?.id_issue_date && moment(data?.customer?.id_issue_date).isValid() ? new Date(data?.customer?.id_issue_date).toISOString() : undefined;
  const items = data?.items ? data?.items : []

  let new_items: any = [];
  for (let i = 0; i < items?.length; i++) {
    new_items[i] = { products: [] };
    for (let j = 0; j < items?.[i].products?.length; j++) {
      if (items[i]?.products[j]?.name === '-' || items[i]?.products[j]?.name === undefined) {
        new_items[i].products.push({
          product_id: 32,
          quantity: 0,
          unit_id: 7,
          data: null
        })
        continue;
      }
      new_items[i].products.push({
        product_id: items[i]?.products[j]?.id,
        quantity: items[i]?.products[j]?.quantity,
        unit_id: items[i]?.products[j]?.unit_id,
        data: (items[i]?.products[j]?.name === 'ROOT_DISK' || items[i]?.products[j]?.name === 'DATA_DISK') ? {
          iops: parseInt(items[i]?.products[j]?.data.iops) !== 0 ? parseInt(items[i]?.products[j]?.data.iops) : DiskIOPS['5000'],
          volumes: items[i]?.products[j]?.data?.volumes?.map((volume, index) => ({ ...volume }))
        } : null
      })
    }
  }

  let passw: any = "";
  let nameUser: any = "";
  if (data?.customer?.password) {
    passw = data?.customer?.password;
    nameUser = data?.customer?.username
  } else {
    passw = "";
    nameUser = "";
  }
  //B1 create orderDetail
  const customer = {
    username: nameUser,
    password: passw,
    name: data?.customer?.full_name,
    email: data?.customer?.email,
    phone_number: data?.customer?.phone_number,
    tax_number: data?.customer?.tax_number,
    id_number: data?.customer?.id_number,
    id_issue_date: id_issue_date,
    id_issue_location: data?.customer?.id_location,
    address: data?.customer?.address,
    rep_name: data?.customer?.rep_name,
    rep_phone: data?.customer?.rep_phone,
    rep_email: data?.customer?.rep_email,
    ref_email: data?.customer?.ref_email,
    ref_name: data?.customer?.ref_name,
    ref_phone: data?.customer?.ref_phone
  };

  const contract = {
    code: data?.contract?.code,
    start_at: start_at,
    end_at: end_at,
  }

  const co_sale = {
    department: data?.co_sale?.department,
    sale: data?.co_sale?.sale
  }

  const optionsOrder = {
    code: 'CASORDER',
    customer_id: parseInt(data?.customer?.id),
    staff_id: staff_id,
    order_type: data?.order_type,
    service_type: data?.service_type,
    region_id: data?.region_id,
    region_name: region_name,
    price: data?.price ? data?.price : 0,
    pmt_type: data?.pmt_type,
    sale_care: data?.sale_care,
    contract: contract,
    customer: customer,
    items: new_items,
    co_sale: co_sale,
    remark: data?.remark
  };

  const requestUrl_Order = path.orders.create
  try {
    const resOrder = yield call(requestAuthorizationToken, requestUrl_Order, { method: 'POST', body: JSON.stringify(optionsOrder) })
    if (resOrder.code === 200) {
      yield put(actions.orderCreated(resOrder));
      yield put(actions.setNotice(i18next.t('Message.CREATE_ORDER_SUCCESS')));
    } else {
      yield put(actions.setError(resOrder?.msg));
    }
  } catch (error) {
    yield put(actions.setError('Send Email Create Order fail'));
    yield put(actions.setNotice(i18next.t('Message.CREATE_ORDER_SUCCESS')));

  }

}

export function* renewOrder() {

  const data = yield select(selectData);
  const order = yield select(selectOrder);


  if (empty(data)) {
    yield put(actions.setError(i18next.t('Message.DATA_INVALID')));
    return;
  }
  // const start_at = data?.contract?.start_at ? data?.contract?.start_at : undefined;
  // const end_at = data?.contract?.end_at ? data?.contract?.end_at : undefined;

  const start_at = data?.contract?.start_at ? data?.contract?.start_at.split('T')[0] : undefined;
  const end_at = data?.contract?.end_at ? data?.contract?.end_at.split('T')[0] : undefined;
  const renewOpts = {
    order_id: order?.id,
    order_type: data?.order_type,
    contract: {
      code: order?.contract_code,
      start_at: start_at,
      end_at: end_at
    },
    duration: data?.duration,
    co_sale: data?.co_sale,
    items: data?.items,
    remark: data?.remark
  }

  const requestUrl = path.orders.orders;
  const options = { method: 'post', body: JSON.stringify(renewOpts) };
  try {
    const res = yield call(requestAuthorizationToken, requestUrl, options);
    if (res?.code === 200) {
      yield put(actions.orderCreated(res));
      return yield put(actions.setNotice(i18next.t('Message.RENEW_SUCCESS')));
    } else {
      yield put(actions.setError(res?.msg));
    }
  } catch (error) {
    yield put(actions.setError('Send Email Create Order fail'));
    yield put(actions.setNotice(i18next.t('Message.RENEW_SUCCESS')));

  }

}

export function* extendOrder() {

  const data = yield select(selectData);
  const order = yield select(selectOrder);

  let price_extend = data?.price_extend ? parseFloat(data?.price_extend.replaceAll(',', '')) : 0;
  let price = order?.price ? parseFloat(order?.price.replaceAll(',', '')) : 0;

  debugger
  if (empty(data)) {
    yield put(actions.setError(i18next.t('Message.DATA_INVALID')));
    return;
  }

  const cloneData = data?.data ? data?.data : []
  let new_items: any = [];
  for (let i = 0; i < cloneData?.length; i++) {
    new_items[i] = {
      order_idx: data?.vmConfigId,
      products: []
    };
    debugger
    for (let j = 0; j < cloneData?.[i]?.length; j++) {
      if (cloneData?.[i]?.[j] === undefined) {
        new_items[i].products.push({
          product_id: 32,
          quantity: 0,
          unit_id: 7,
          data: null
        })
        continue;
      }

      new_items[i].products.push({
        product_id: cloneData?.[i]?.[j]?.id,
        quantity: cloneData?.[i]?.[j]?.quantity,
        unit_id: cloneData?.[i]?.[j]?.unit_id,
        data: (cloneData?.[i]?.[j]?.name === 'ROOT_DISK' || cloneData?.[i]?.[j]?.name === 'DATA_DISK') ? {
          iops: parseInt(cloneData?.[i]?.[j]?.data?.iops),
          volumes: cloneData?.[i]?.[j]?.data?.volumes?.map((volume, index) => ({ ...volume }))
        } : null
      })
    }
  }

  debugger
  const extendOpts = {
    order_id: order?.id,
    order_type: OrderType.EXTEND,
    contract: {
      code: order?.contract_code,
    },
    duration: data?.duration,
    items: new_items,
    remark: data?.remark,
    price: price + price_extend
  }

  const requestUrl = path.orders.orders;
  const options = { method: 'post', body: JSON.stringify(extendOpts) };

  try {
    const res = yield call(requestAuthorizationToken, requestUrl, options);
    if (res.code === 200) {
      yield put(actions.orderCreated(res));
      return yield put(actions.setNotice(i18next.t('Message.EXTEND_SUCCESS')));
    } else {
      yield put(actions.setError(res?.msg));
    }
  } catch (error) {
    yield put(actions.setError('Send Email Create Order fail'));
    yield put(actions.setNotice(i18next.t('Message.EXTEND_SUCCESS')));

  }

}

export function* getOrder() {

  const data = yield select(selectData);
  if (!data) {
    return;
  }
  const requestUrl = `${path.orders.order}/${data.orderId}`;

  const options = { method: 'get' };

  const res = yield call(requestAuthorizationToken, requestUrl, options);
  if ('errors' in res) {
    yield put(actions.setError(res.errors[0].message));
  } else {
    const start_at = res?.data?.start_at ? moment(res?.data?.start_at).format('YYYY-MM-DD') : undefined
    const end_at = res?.data?.end_at ? moment(res?.data?.end_at).format('YYYY-MM-DD') : undefined
    const id_issue_date = res?.data?.id_issue_date ? moment(res?.data?.id_issue_date).format('YYYY-MM-DD') : undefined
    const price = res?.data?.price ? formatMoney(`${res?.data?.price}`) : 0
    const order = { ...res?.data, start_at: start_at, end_at: end_at, price: price, id_issue_date: id_issue_date }
    yield put(actions.orderGetted(order));
  }
}

export function* queryContract() {

  let newData: any = [];
  const code = yield select(selectContractCode);
  const user = yield select(selectUser);

  const conditionUserId = user?.id ? user?.id : user?.resources?.[0]?.id
  if (!code) {
    yield put(actions.setError(null));
    return;
  }
  const requestUrl = `${path.orders.orders}?contract_code=${code}&sort='id DESC'`;
  const options = { method: 'get' };


  const res = yield call(requestAuthorizationToken, requestUrl, options);
  if (res?.msg === 'error') {
    yield put(actions.setError(res?.message));
  } else {
    if (res.data?.rows?.length > 0) {
      if (res.data?.rows?.[0].customer_id !== conditionUserId) {
        yield put(actions.setError(i18next.t('Message.CONTRACT_WRONG_USER')))
        yield put(actions.setShowBtnCreateContract(true));
      } else {
        newData = res?.data?.rows?.map(item => ({
          ...item,
          price: item.price ? formatMoney(`${item.price}`) : 0,
          start_at: moment(item?.start_at).format('YYYY-MM-DD'),
          end_at: moment(item?.end_at).format('YYYY-MM-DD')
        }));
        yield put(actions.contractLoaded({ current: newData?.[0] }));
        yield put(actions.setShowBtnCreateContract(false));
      }
    } else {
      yield put(actions.contractLoaded({ current: newData }));
      yield put(actions.setError(i18next.t('Message.CONTRACT_NOT_EXISTS')));
      yield put(actions.setShowBtnCreateContract(false));
    }
  }
}

export function* loadPackages() {

  // const requestUrl = `${ path.products.packages }`;
  // const options = { method: 'get' };

  // const res = yield call(request, requestUrl, options);

  // if ('errors' in res) {
  //   yield put(actions.setError(res.errors[0].message));
  // } else {
  //   yield put(actions.packagesLoaded(res.data.slice(1)));
  // }
}

export function* loadProductsLanding() {

  // const requestUrl = `${ path.products.products }`;
  // const options = { method: 'get' };

  // const res = yield call(request, requestUrl, options);
  // if ('errors' in res) {
  //   yield put(actions.setError(res.errors[0].message));
  // } else {
  //   yield put(actions.productsLandingLoaded(res.data));
  // }
}


export function* loadZones() {

  const data = yield select(selectData);
  const requestUrl = path.computes.zones.replace(':regionId', data.regionId);
  const options = { method: 'get' };

  if (!data) {
    yield put(actions.setError(i18next.t('Message.DATA_INVALID')));
    return;
  }

  const res = yield call(request, requestUrl, options);
  if ('errors' in res) {
    yield put(actions.setError(res.errors[0].message));
  } else {
    yield put(actions.zonesLoaded(res));
  }
}

export function* getVmCfg() {

  const data = yield select(selectData);
  const requestUrl = path.orders.vmCfg
    .replace(':orderID', data?.order_id)
    .replace(':orderIDX', data?.order_idx);
  const options = { method: 'get' };

  if (!data) {
    yield put(actions.setError(i18next.t('Message.DATA_INVALID')));
    return;
  }

  const res = yield call(request, requestUrl, options);
  if ('errors' in res) {
    yield put(actions.setError(res.errors[0].message));
  } else {
    yield put(actions.vmCfgGetted(res));
  }
}

export function* deleteOrder() {

  const data = yield select(selectData);
  const requestUrl = `${path.orders.order}/${data.orderId}`;
  const options = { method: 'delete' };
  const orders = yield select(selectOrders);
  if (!data) {
    yield put(actions.setError(i18next.t('Message.DATA_INVALID')));
    return;
  }
  const res = yield call(requestAuthorizationToken, requestUrl, options);
  if (!res) {
    yield put(actions.setNotice(i18next.t('Message.DELETE_ORDER_FAIL')));
  } else if (res?.code === 200) {
    let newOrders = [...orders];
    newOrders.splice(data.delete, 1);
    yield put(actions.setOrders(newOrders));
    yield put(actions.setData(defaultState.data));
    yield put(actions.setNotice(i18next.t('Message.DELETE_ORDER_SUCCESS')));
  } else {
    yield put(actions.setError(res?.msg));
  }
}

export function* liquidation() {

  const data = yield select(selectData);
  const orders = yield select(selectOrders);

  const currentOrder = orders?.find(item => item?.id === data?.orderId)
  let start_at = new Date(currentOrder.start_at).toISOString();
  let end_at = new Date(currentOrder.end_at).toISOString();

  let newInfo = {
    co_sale: currentOrder?.co_sale,
    code: currentOrder?.code,
    contract_code: currentOrder?.contract_code,
    customer: currentOrder?.customer,
    duration: currentOrder?.duration,
    start_at: start_at,
    end_at: end_at,
    order_type: currentOrder?.order_type,
    pmt_type: currentOrder?.pmt_type,
    price: currentOrder?.price,
    region_id: currentOrder?.region_id,
    remark: currentOrder?.remark,
    sale_care: currentOrder?.sale_care,
    service_type: currentOrder?.service_type,
    liquidated: true
  }

  //Update Order
  const requestUrl = `${path.orders.order}/${data.orderId}`;
  const options = { method: 'PATCH', body: JSON.stringify(newInfo) };
  const res = yield call(requestAuthorizationToken, requestUrl, options);
  if (res?.code !== 200) {
    yield put(actions.setError(res?.msg));
  } else {
    yield put(actions.orderUpdated({ ...currentOrder, ...res?.data, price: formatMoney(`${res?.data.price}`), start_at: start_at, end_at: end_at }));
    yield put(actions.setNotice(i18next.t('Message.LIQUIDATED_SUCCESS')));
    const newOrders = [...orders];
    newOrders[data.liquidation] = res?.data
    yield put(actions.ordersLoaded(newOrders));
  }
}


export function* deleteOrderDetail(id) {
  const requestUrl = `${path.orderDtls}/${id}`;
  const options = { method: 'DELETE' };
  const res = yield call(requestAuthorizationToken, requestUrl, options);
  return res;

}

export function* deleteOrders(id) {
  const requestUrl = `${path.orders.order}/${id}`;
  const options = { method: 'DELETE' };
  const res = yield call(requestAuthorizationToken, requestUrl, options);
  return res;
}


//------------VmConfig
export function* deleteVmConfig() {
  const data = yield select(selectData);
  const order = yield select(selectOrder);
  const requestUrl = `${path.orders.order}/${order.id}/order_products/${data?.vmConfigId}`;
  const options = { method: 'delete' };
  if (!data) {
    yield put(actions.setError(i18next.t('Message.DATA_INVALID')));
    return;
  }
  const res = yield call(requestAuthorizationToken, requestUrl, options);
  if (!res) {
    yield put(actions.setNotice(i18next.t('Message.DELETE_INSTANCE_FAIL')));
  } else if (res?.code === 200) {
    const new_order_products = order?.order_products?.filter(item => item?.idx !== data?.vmConfigId)
    yield put(actions.setData(null));
    const newOrder = { ...order, order_products: new_order_products }
    yield put(actions.orderGetted(newOrder));
    yield put(actions.setNotice(i18next.t('Message.DELETE_INSTANCE_SUCCESS')));
  } else {
    yield put(actions.setError(res?.msg));
  }
}

export function* getVmCfgInstance() {
  const data = yield select(selectData);
  const order = yield select(selectOrder);

  const idx = data?.vmConfigId
  const defaultVmCfgInstance = order?.order_products
    ?.filter(item => item?.product?.type !== 'OS' && item?.product?.is_base === true && item?.idx === idx)
    ?.map(item => {
      const id = item?.product?.id
      const cn = item?.product?.cn
      const name = item?.product?.name
      const unit = item?.unit?.name
      const unit_id = item?.unit_id
      const product_id = item?.id
      const quantity = item?.quantity
      const iops = item?.data?.iops
      const data = item?.data
      return { id, cn, name, unit, unit_id, product_id, quantity, iops, data };
    });

  var instanceOrder = ["vcpu", "ram", "disk", "root_disk", "data_disk", "ip", "net"];
  var sortedInstance = sortBy(defaultVmCfgInstance, function (item) {
    return indexOf(instanceOrder, item?.cn);
  });


  const rootVolumes = sortedInstance?.find(item => item?.name.toUpperCase() === "ROOT_DISK")?.data?.volumes
  yield put(actions.setRootVolumes(rootVolumes));

  const dataVolumes = sortedInstance?.find(item => item?.name.toUpperCase() === "DATA_DISK")?.data?.volumes
  yield put(actions.setDataVolumes(dataVolumes));

  yield delay(500);
  yield put(actions.vmCfgInstanceLoaded(sortedInstance));
}

export function* getVmCfgOs() {
  const data = yield select(selectData);
  const order = yield select(selectOrder);

  const idx = data?.vmConfigId
  const defaultVmCfgOS = order?.order_products
    ?.filter(item => item?.product?.type === 'OS' && item?.product?.is_base === true && item?.idx === idx)
    ?.map(item => {
      const id = item?.product?.id
      const name = item?.product?.name
      const unit = item?.unit?.name
      const unit_id = item?.unit_id
      const product_id = item?.id
      const quantity = item?.quantity
      const iops = item?.data?.iops
      return { id, name, unit, unit_id, product_id, quantity, iops };
    });
  yield delay(500);
  yield put(actions.vmCfgOsLoaded(defaultVmCfgOS));
}


export function* getVmCfgService() {
  const data = yield select(selectData);
  const order = yield select(selectOrder);

  const idx = data?.vmConfigId
  const defaultVmCfgInstance = order?.order_products
    ?.filter(item => item?.product?.type !== 'OS' && item?.product?.is_base === false && item?.idx === idx)
    ?.map(item => {
      const id = item?.product?.id
      const cn = item?.cn?.id
      const name = item?.product?.name
      const unit = item?.unit?.name
      const unit_id = item?.unit_id
      const product_id = item?.id
      const quantity = item?.quantity
      const iops = item?.data?.iops
      return { id, cn, name, unit, unit_id, product_id, quantity, iops };
    });

  var serviceOrder = ["snapshot", "backup", "lb", "vpn", "gpu"];
  const sortedExtendedService = sortBy(defaultVmCfgInstance, function (item) {
    return indexOf(serviceOrder, item.cn);
  });

  yield delay(500);
  yield put(actions.vmCfgServiceLoaded(sortedExtendedService));
}


export function* updateOrderVmCfg() {
  const data = yield select(selectData);
  const order = yield select(selectOrder);

  const new_items = data?.newInfo ? data?.newInfo : []
  const idx = data?.vmConfigId

  // B3 Chỗ này có có OrderID rồi thì tạo vmConfig
  const requestUrlVmConfig = `${path.orders.order}/${order.id}/order_products/${idx}`;
  let items: any[] = [];
  for (let i = 0; i < new_items[0].length; i++) {
    if (new_items[0]?.[i] === undefined) { continue; }
    items.push({
      order_id: order.id,
      idx: idx,
      product_id: new_items[0]?.[i]?.id,
      quantity: new_items[0]?.[i]?.quantity,
      unit_id: new_items[0]?.[i]?.unit_id,
      data: (new_items[0]?.[i]?.name === 'ROOT_DISK' || new_items[0]?.[i]?.name === 'DATA_DISK') ? {
        iops: new_items[0]?.[i]?.iops ? parseInt(new_items[0]?.[i]?.iops) : 0,
        volumes: new_items[0]?.[i]?.data?.volumes ? (new_items[0]?.[i]?.data?.volumes) : []
      } : null
    })
  }
  const optionsVmConfig = {
    method: 'PUT',
    body: JSON.stringify({
      items
    })
  };


  const resVmConfig = yield call(requestAuthorizationToken, requestUrlVmConfig, optionsVmConfig);
  if (resVmConfig?.code !== 200) {
    return yield put(actions.setError(resVmConfig?.msg));
  } else {
    // let arrNewVmConfig: any = []
    // for (let i = 0; i < order?.VmConfig?.length; i++) {
    //   if (order?.VmConfig?.[i]?.id === resVmConfig?.data?.id) {
    //     arrNewVmConfig.push(resVmConfig?.data)
    //   } else {
    //     arrNewVmConfig.push(order?.VmConfig?.[i])
    //   }
    // }
    // const newOrder = { ...order, VmConfig: arrNewVmConfig }

    // yield put(actions.orderVmCfgUpdated(resVmConfig?.data));
    const newOrder: any = resVmConfig?.data ? resVmConfig?.data : order;
    const cloneNewOrer: any = { ...newOrder, price: formatMoney(`${newOrder.price}`) }
    yield put(actions.orderGetted(cloneNewOrer));
    return yield put(actions.setNotice(i18next.t('Message.UPDATE_ORDER_SUCCESS')));

  }
}

export function* getVmsByUserId() {
  try {

    const userId = yield select(selectQuery);
    const requestUrl = `${path.vmConfig.vmByUserId.replace(':userId', `${userId}`)}`;

    const optionsVmConfig = {
      method: 'POST',
      body: JSON.stringify({
        action: "get_ipaddress_by_userid"
      })
    };

    const res = yield call(requestToken, requestUrl, optionsVmConfig);
    if ('error' in res) {
      yield put(actions.setVmsByUserIdLoaded([]));
    } else {
      yield delay(1000)
      yield put(actions.setVmsByUserIdLoaded(res));
      // localStorage.setItem('vmsByUserId', res);
      // console.log('âdada', yield put(actions.setVmsByUserIdLoaded(res)))
    }
  } catch (error) {
    console.log(error)
  }

}
/**
 * Root saga manages watcher lifecycle
 */
export function* ordersSaga() {
  yield takeLatest(actions.getRegions.type, getRegions);
  yield takeLatest(actions.loadOrders.type, getOrders);
  yield takeLatest(actions.loadContract.type, queryContract);
  yield takeLatest(actions.loadInstance.type, getInstance);
  yield takeLatest(actions.loadService.type, getService);
  yield takeLatest(actions.loadOs.type, getOs);
  yield takeLatest(actions.createOrder.type, createOrder);
  yield takeLatest(actions.updateOrder.type, updateOrder);
  yield takeLatest(actions.getOrder.type, getOrder);
  yield takeLatest(actions.deployOrder.type, deployOrder);
  yield takeLatest(actions.approveOrder.type, approveOrder);
  yield takeLatest(actions.extendOrder.type, extendOrder);
  yield takeLatest(actions.renewOrder.type, renewOrder);

  yield takeLatest(actions.loadPackages.type, loadPackages);
  yield takeLatest(actions.loadProductsLanding.type, loadProductsLanding);
  yield takeLatest(actions.queryOrders.type, queryOrders);
  yield takeLatest(actions.loadZones.type, loadZones);
  yield takeLatest(actions.getVmCfg.type, getVmCfg);
  yield takeLatest(actions.deleteOrder.type, deleteOrder);

  yield takeLatest(actions.liquidation.type, liquidation);
  //VmConfig
  yield takeLatest(actions.deleteVmConfig.type, deleteVmConfig);
  yield takeLatest(actions.loadVmCfgInstance.type, getVmCfgInstance);
  yield takeLatest(actions.loadVmCfgOs.type, getVmCfgOs);
  yield takeLatest(actions.loadVmCfgService.type, getVmCfgService);
  yield takeLatest(actions.updateOrderVmCfg.type, updateOrderVmCfg);
  yield takeLatest(actions.loadVmsByUserId.type, getVmsByUserId);
}
