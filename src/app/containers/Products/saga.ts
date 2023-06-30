// import { empty } from 'is-empty';
import path from 'path/api';
import i18next from 'i18next';
import { call, put, select, takeLatest, delay } from 'redux-saga/effects';
import { setConditions } from 'utils/common';
import { requestAuthorizationToken } from 'utils/request';
import {
  selectData,
  selectPagination,
  selectParams,
  selectProducts,
} from './selectors';
import { actions } from './slice';

export function* loadProducts() {
  const pagination = yield select(selectPagination);
  const requestUrl =
    path.products.products +
    `?page=${pagination.current}&pageSize=${pagination.pageSize}`;

  const options = { method: 'get' };
  const res = yield call(requestAuthorizationToken, requestUrl, options);
  // yield delay(3000);
  if ('errors' in res) {
    yield put(actions.setError(res.errors[0].message));
  } else {
    yield put(actions.productsLoaded(res?.data?.rows));
    yield put(
      actions.setPagination({
        ...pagination,
        // total:
        //   res?.data?.totalPages &&
        //     pagination.total < res?.data?.totalPages * pagination?.pageSize
        //     ? res?.data?.totalPages * pagination?.pageSize
        //     : pagination?.total,
        total: res?.data?.totalRows
      }),
    );
  }
}

export function* queryProducts() {
  const pagination = yield select(selectPagination);
  const params = yield select(selectParams);
  const condition = setConditions({ ...params });
  const requestUrl = `${path.products.products}?${condition}&page=${pagination.current}&pageSize=${pagination.pageSize}`;
  const options = { method: 'get' };

  const res = yield call(requestAuthorizationToken, requestUrl, options);
  if ('errors' in res) {
    yield put(actions.setError(res.errors[0].message));
  } else {
    if (res?.data?.length === 0)
      yield put(actions.setError(i18next.t('Message.RETURN_ZERO_DATA')));
    yield put(
      actions.setPagination({
        ...pagination,
        // total:
        //   res?.data?.totalPages &&
        //     pagination.total < res?.data?.totalPages * pagination?.pageSize
        //     ? res?.data?.totalPages * pagination?.pageSize
        //     : pagination?.total,
        total: res?.data?.totalRows
      }),
    );
    yield put(actions.productsQueried(res?.data?.rows));
  }
}


export function* createProduct() {
  const data = yield select(selectData);

  if (!data) {
    yield put(actions.setNotice(i18next.t('Message.CREATE_PRODUCT_FAIL')));
  }
  const requestUrl = path.products.create;
  const options = { method: 'post', body: JSON.stringify(data) };
  const res = yield call(requestAuthorizationToken, requestUrl, options);
  if ('errors' in res) {
    yield put(actions.setError(res.errors[0].message));
  } else {
    yield put(actions.setNotice(i18next.t('Message.CREATE_PRODUCT_SUCCESS')));
  }
}

export function* deleteProduct() {
  const data = yield select(selectData);
  const products = yield select(selectProducts);
  const requestUrl = path.products.product.replace(
    ':productId',
    data.productId,
  );
  const options = { method: 'delete' };
  const res = yield call(requestAuthorizationToken, requestUrl, options);
  if (!res) {
    yield put(actions.setError(i18next.t('Message.DELETE_PRODUCT_FAIL')));
  } else if (typeof res === 'boolean') {
    yield delay(5000);
    yield put(actions.setNotice(i18next.t('Message.DELETE_PRODUCT_SUCCESS')));
  } else if ('errors' in res) {
    yield put(actions.setError(res.errors[0].message));
  }
  yield put(actions.setData(null));
  let newProducts = [...products];
  newProducts.splice(data.tableIndex, 1);
  yield put(actions.productsLoaded(newProducts));
}

export function* loadProduct() {
  const data = yield select(selectData);
  const requestUrl = path.products.product.replace(
    ':productId',
    data.productId,
  );
  const options = { method: 'get' };

  const res = yield call(requestAuthorizationToken, requestUrl, options);

  if ('errors' in res) {
    yield put(actions.setError(res.errors[0].message));
  } else {
    yield put(actions.productLoaded(res?.data));
  }
}

export function* updateProduct() {
  const data = yield select(selectData);
  try {
    if (!data) {
      return yield put(actions.setError(i18next.t('Message.DATA_INVALID')));
    }
    const requestUrl = `${path.products.product.replace(':productId', data.productId)}`;
    const options = { method: 'PATCH', body: JSON.stringify(data?.data) };

    const res = yield call(requestAuthorizationToken, requestUrl, options);

    if ('error' in res) {
      return yield put(actions.setError(res.error.default.type[0]));
    } else {
      yield put(actions.productLoaded(res?.data));
      yield put(actions.setNotice(i18next.t('Message.UPDATE_PRODUCT_SUCCESS')));
    }
  } catch (error) {
    yield put(actions.setError(i18next.t('Message.UPDATE_PRODUCT_FAIL')));
    yield put(actions.productLoaded(data));

  }
}

export function* loadUnits() {
  try {
    const requestUrl = path.products.units;
    const options = { method: 'GET' };
    const res = yield call(requestAuthorizationToken, requestUrl, options);
    if ('error' in res) {
      return yield put(actions.setError(res.error.default.type[0]));
    } else {
      yield put(actions.unitsLoaded(res?.data?.rows));

    }
  } catch (error) {
    yield put(actions.setError('Load data units fail'));
    yield put(actions.unitsLoaded([]));
  }
}

export function* productsSaga() {
  yield takeLatest(actions.loadProducts.type, loadProducts);
  yield takeLatest(actions.createProduct.type, createProduct);
  yield takeLatest(actions.queryProducts.type, queryProducts);
  yield takeLatest(actions.deleteProduct.type, deleteProduct);
  yield takeLatest(actions.loadProduct.type, loadProduct);
  yield takeLatest(actions.updateProduct.type, updateProduct);
  yield takeLatest(actions.loadUnits.type, loadUnits);

}
